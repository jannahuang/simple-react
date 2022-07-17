/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ (() => {

eval("const log = console.log.bind(console);\n\nconst isClass = function (o) {\n  return o.prototype instanceof React.Component;\n}; // 判断是否对象\n\n\nconst isObject = o => {\n  return Object.prototype.toString.call(o) === '[object Object]';\n};\n\nlet store = {\n  vdom: null,\n  element: null\n}; // 定义 Component 类\n\nclass Component {\n  constructor(props) {\n    this.props = props;\n  }\n\n  setState(state) {\n    this.state = state; // 新建刷新方法 render()\n\n    render(store.vdom, store.element);\n  }\n\n}\n\nconst render = (vdom, element) => {\n  // 先用简单粗暴的方法，如果页面有元素的话，把元素清空\n  while (element.hasChildNodes()) {\n    element.removeChild(element.lastChild);\n  } // 然后再调用 ReactDOM.render() 方法添加元素\n\n\n  ReactDOM.render(vdom, element);\n}; // 创建节点\n\n\nconst createElement = (type, props, ...children) => {\n  // 注意没有 props 和 children 时的兼容\n  let newProps = Object.assign({}, props);\n\n  if (children.length === 0) {\n    newProps.children = [];\n  } else {\n    let l = []; // children 兼容处理，区分对象和文本节点\n\n    for (let c of children) {\n      if (isObject(c)) {\n        l.push(c);\n      } else {\n        let t = createTextElement(c);\n        l.push(t);\n      }\n    }\n\n    newProps.children = l;\n  }\n\n  let obj = {\n    type,\n    props: newProps\n  };\n  return obj;\n}; // 创建文本节点\n\n\nconst createTextElement = text => {\n  let type = 'text';\n  let props = {\n    nodeValue: text\n  }; // 改写结构之后再次调用 createElement()\n\n  let e = createElement(type, props);\n  return e;\n};\n\nconst React = {\n  createElement,\n  Component\n};\nconst ReactDOM = {\n  render: (vdom, container) => {\n    // 全局变量存的一直是最初的值\n    if (store.vdom === null) {\n      store.vdom = vdom;\n    }\n\n    if (store.element === null) {\n      store.element = container;\n    }\n\n    let type = vdom.type;\n    let props = vdom.props || [];\n    let children = props && props.children || [];\n    let element = null; // 1.创建元素：文本节点和普通节点需用不同方式创建\n\n    if (type === 'text') {\n      element = document.createTextNode(vdom.props.nodeValue);\n    } else if (isClass(type)) {\n      // type 可能是 Component 类的子类\n      let cls = type;\n\n      if (cls.instance === undefined) {\n        cls.instance = new cls(props);\n      }\n\n      let instance = cls.instance; // 改变 state 的值\n\n      let state = instance.state;\n      let r = instance.render(state, props);\n      element = ReactDOM.render(r, container);\n    } else {\n      element = document.createElement(type);\n    }\n\n    let keys = Object.keys(props); // props 里包含 onClick、children 和其他属性\n\n    for (let k of keys) {\n      if (k.startsWith('on')) {\n        // 2. 添加点击事件\n        let eventType = k.toLowerCase().slice(2);\n        let callback = props[k];\n        element.addEventListener(eventType, callback);\n      } else if (k === 'children') {\n        // 3. 处理子节点\n        for (let c of children) {\n          // 递归调用 处理 children\n          // 对于上述 JSX，此时的 element 就是 button 元素\n          ReactDOM.render(c, element);\n        }\n      } else {\n        // 4. 添加其他属性\n        element[k] = props[k];\n      }\n    } // 5. 将元素添加到页面容器中\n\n\n    container.appendChild(element);\n    return element;\n  }\n};\n\nclass App extends React.Component {\n  constructor(props) {\n    super(props);\n    this.state = {\n      count: 0\n    };\n  }\n\n  actionAdd = () => {\n    let count = this.state.count;\n    this.setState({\n      count: count + 1\n    });\n  };\n  actionMinus = () => {\n    let count = this.state.count;\n    this.setState({\n      count: count - 1\n    });\n  };\n\n  render(state, props) {\n    return /*#__PURE__*/React.createElement(\"div\", null, /*#__PURE__*/React.createElement(\"button\", {\n      onClick: this.actionAdd\n    }, \"+\"), /*#__PURE__*/React.createElement(\"span\", {\n      style: \"margin: 10px\"\n    }, state.count), /*#__PURE__*/React.createElement(\"button\", {\n      onClick: this.actionMinus\n    }, \"-\"));\n  }\n\n}\n\nconst vdomButton = () => {\n  let type = 'button';\n  let props = {\n    id: 'id-button-like',\n    onClick: () => console.log('click')\n  };\n  let children = [{\n    type: 'text',\n    value: 'Like'\n  }];\n  let vdom = React.createElement(type, props, children);\n  return vdom;\n};\n\nconst __main = () => {\n  // // 获取 vdom 对象\n  // let vdom = vdomButton()\n  // 获取需要添加到对应的容器\n  let root = document.querySelector('#root');\n  ReactDOM.render( /*#__PURE__*/React.createElement(App, null), root);\n};\n\n__main();\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/index.js"]();
/******/ 	
/******/ })()
;