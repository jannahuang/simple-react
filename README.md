# simple-react
## 拆解实现简易版 React
![实现简易版 React](https://raw.githubusercontent.com/jannahuang/blog/main/pictures/%E7%AE%80%E6%98%93%E7%89%88%20React.png)
## React 基础原理
新建一个 js 文件，以实现简易版 React。假设要将以下 JSX 显示在 html 页面上：
```javascript
// 点赞按钮 JSX
<button id="id-button-like" onClick="() => console.log('click')">Like</botton>
```
为了便于理解，我们先把属性单独处理。真实的 React vdom 只包含 type 和 properties，其他内容都放在 properties 里。（先手动解析用于测试，后续实现 React.createElement()方法用于创建对象）：
```javascript
const vdomButton = () => {
    let node = {
        type: 'button',
        properties: {
            id: 'id-button-like',
        },
        events: {
            onClick: () => console.log('click'),
        }
        children: [
            {
                type: 'text',
                value: 'Like',
            }
        ]
    }
    return node
}
```
新建一个程序主入口 __main，根据 React 的用法可知，我们需要调用 ReactDOM.render() 方法，解析 JSX 并生成的 DOM 节点，然后添加到 html 页面对应的容器中。
```javascript
const __main = () => {
    // 获取 vdom 对象
    let vdom = vdomButton()
    // 获取需要添加到对应的容器
    let root = document.querySelector('#root')
    ReactDOM.render(vdom, root)
}
```
针对上述结构的 vdom，可以实现如下 ReactDOM.render() 方法。
```javascript
const ReactDOM = {
    render(vdom, container) {
        // 1. 创建标签：获取 vdom 类型，然后创建对应标签元素
        let type = vdom.type
        let element = document.createElement(type)

        // 2. 设置属性：用 Object.entries() 方法获取 vdom.properties 键和值组成的数组，给元素设置属性
        let props = vdom.properties
        Object.entries(props).forEach(([k, v]) => element.setAttribute(k, v))

        // 3. 添加事件：解析事件类型，并用 addEventListener() 方法添加事件。
        // * 注意 events 是对象结构
        let events = vdom.events
        for (let e of Object.keys(events)) {
            // 统一转小写便于处理
            let eventType = e.toLowerCase().slice(2)
            let callback = events[e]
            element.addEventListener(eventType, callback)
        }

        // 4. 处理子节点：
        let children = vdom.children
        children.forEach(c => {
            if (c.type === 'text') {
                element.innerHTML = c.value
            }
        })

        // 5. 将元素添加到页面容器中
        container.appendChild(element)
    },
}
```
至此，我们了解了 React 的基本原理：解析 JSX 模版，并生成 DOM 节点插入到 html 页面的容器中。
接下来，实现 React.createElement(type, props, children) 方法。根据 [React 官网的示例](https://react.docschina.org/docs/introducing-jsx.html)可知，JSX 模版等效于由 React.createElement() 方法创建的对象。
```javascript
const element = (
  <h1 className="greeting">
    Hello, world!
  </h1>
);
// 上述 JSX 完全等效于下述代码
const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Hello, world!'
);

// React.createElement() 会返回如下结构的对象
// 注意：这是简化过的结构
const element = {
  type: 'h1',
  props: {
    className: 'greeting',
    children: 'Hello, world!'
  }
};
```
可见 children 等其他属性包含在 props 中（本次简易版 React 只考虑 type 和 props）。将上述 vdomButton 改写成调用 React.createElement() 创建对象：
```javascript
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
```
由创建的对象结构可知，React.createElement() 可简单处理为：
```javascript
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
```
由于 vdom 结构发生变化，我们需要修改 ReactDOM.render() 方法。
```javascript
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
```
这样我们就可以在 html 页面创建一个按钮元素。
![button-like](https://raw.githubusercontent.com/jannahuang/blog/main/pictures/button-like.png)

## 使用 Babel 转译 JSX
在 React 中是用 Babel 把 JSX 转译成一个名为 React.createElement() 函数调用。我们也用 Babel 试试看。
先建一个 package.json 文件，然后安装所需的 Babel 依赖。
> npm install @babel/core @babel/preset-env @babel/preset-react
然后根据 Babel 官方用法配置 babel.config.js 文件。
```javascript
// babel.config.js
module.exports = {
    "presets": ["@babel/preset-react"]
}
```
新建一个 test.js 文件来测试转译。
```javascript
// test.js
const { transform } = require("@babel/core")
let a = "<div></div>"
let r = transform(a, {
    plugins: [
        "@babel/plugin-transform-react-jsx"
    ]
})
```
把 r 打印出来可以得到一串对象，可以看到 r.code 就是转译后的函数调用形式 React.createElement("div", null)。再测试一个复杂一点的 JSX。
```javascript
<div id='id-test' class='div-test'>
    <span id='id-span-test'>test</span>
</div>
// 转译后可以得到以下函数调用形式
React.createElement("div", {
    id: "id-test",
    class: "div-test"
}, React.createElement("span", {
    id: "id-span-test"
}, "test"));
```
那么如果 JSX 是 <App /> 这种自定义的标签，会转译成什么呢？
```javascript
React.createElement(App, null)
```
可见与普通标签相比，自定义标签的 JSX 没有双引号。那么如何对自定义标签的 JSX 进行解析呢？