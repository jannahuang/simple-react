const log = console.log.bind(console)

const isClass = function(o) {
    return o.prototype instanceof React.Component
}

// 判断是否对象
const isObject = (o) => {
    return Object.prototype.toString.call(o) === '[object Object]'
}

let store = {
    vdom: null,
    element: null,
}

// 定义 Component 类
class Component {
    constructor(props) {
        this.props = props
    }
    setState(state) {
        this.state = state
        // 新建刷新方法 render()
        render(store.vdom, store.element)
    }
}

const render = (vdom, element) => {
    // 先用简单粗暴的方法，如果页面有元素的话，把元素清空
    while (element.hasChildNodes()) {
        element.removeChild(element.lastChild)
    }
    // 然后再调用 ReactDOM.render() 方法添加元素
    ReactDOM.render(vdom, element)
}


// 创建节点
const createElement = (type, props, ...children) => {
    // 注意没有 props 和 children 时的兼容
    let newProps = Object.assign({}, props)
    if (children.length === 0) {
        newProps.children = []
    } else {
        let l = []
        // children 兼容处理，区分对象和文本节点
        for (let c of children) {
            if (isObject(c)) {
                l.push(c)
            } else {
                let t = createTextElement(c)
                l.push(t)
            }
        }
        newProps.children = l
    }
    let obj = {
        type,
        props: newProps
    }
    return obj
}

// 创建文本节点
const createTextElement = (text) => {
    let type = 'text'
    let props = {
        nodeValue: text
    }
    // 改写结构之后再次调用 createElement()
    let e = createElement(type, props)
    return e
}

const React = {
    createElement,
    Component
}

const ReactDOM = {
    render: (vdom, container) => {
        // 全局变量存的一直是最初的值
        if (store.vdom === null) {
            store.vdom = vdom
        }
        if (store.element === null) {
            store.element = container
        }
        let type = vdom.type
        let props = vdom.props || []
        let children = props && props.children || []
        let element = null
        // 1.创建元素：文本节点和普通节点需用不同方式创建
        if (type === 'text') {
            element = document.createTextNode(vdom.props.nodeValue)
        } else if (isClass(type)) {
            // type 可能是 Component 类的子类
            let cls = type
            if (cls.instance === undefined) {
                cls.instance = new cls(props)
            }
            let instance = cls.instance
            // 改变 state 的值
            let state = instance.state
            let r = instance.render(state, props)
            element =  ReactDOM.render(r, container)
        } else {
            element = document.createElement(type)
        }
        let keys = Object.keys(props)
        // props 里包含 onClick、children 和其他属性
        for (let k of keys) {
            if (k.startsWith('on')) {
                // 2. 添加点击事件
                let eventType = k.toLowerCase().slice(2)
                let callback = props[k]
                element.addEventListener(eventType, callback)
            } else if (k === 'children') {
                // 3. 处理子节点
                for (let c of children) {
                    // 递归调用 处理 children
                    // 对于上述 JSX，此时的 element 就是 button 元素
                    ReactDOM.render(c, element)
                }
            } else {
                // 4. 添加其他属性
                element[k] = props[k]
            }
        }
        // 5. 将元素添加到页面容器中
        container.appendChild(element)
        return element
    }
}

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            count: 0,
        }
    }
    actionAdd = () => {
        let count = this.state.count
        this.setState({
            count: count + 1,
        })
    }
    actionMinus = () => {
        let count = this.state.count
        this.setState({
            count: count - 1,
        })
    }
    render(state, props) {
        return (
            <div>
                <button onClick={this.actionAdd}>
                    +
                </button>
                <span style="margin: 10px">
                    { state.count }
                </span>
                <button onClick={this.actionMinus}>
                    -
                </button>
            </div>
        )
    }
}

const vdomButton = () => {
    let type = 'button'
    let props = {
            id: 'id-button-like',
            onClick: () => console.log('click'),
        }
    let children = [
            {
                type: 'text',
                value: 'Like',
            }
        ]
    let vdom = React.createElement(type, props, children)
    return vdom
}

const __main = () => {
    // // 获取 vdom 对象
    // let vdom = vdomButton()
    // 获取需要添加到对应的容器
    let root = document.querySelector('#root')
    ReactDOM.render(<App />, root)
}

__main()