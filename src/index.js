const log = console.log.bind(console)

const React = {
    createElement: (type, props, children) => {
        props.children = children
        let obj = {
            type,
            props
        }
        return obj
    }
}

const ReactDOM = {
    render: (vdom, container) => {
        let type = vdom.type
        let props = vdom.props || []
        let children = props && props.children || []
        let element = null
        // 1.创建元素：文本节点和普通节点需用不同方式创建
        if (type === 'text') {
            element = document.createTextNode(vdom.value)
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
                element.setAttribute(k, props[k])
            }
        }
        // 5. 将元素添加到页面容器中
        container.appendChild(element)
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
    // 获取 vdom 对象
    let vdom = vdomButton()
    // 获取需要添加到对应的容器
    let root = document.querySelector('#root')
    ReactDOM.render(vdom, root)
}

__main()