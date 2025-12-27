---
title: Dom 树
---

# DOM 树详解

## 什么是 DOM 树

DOM (Document Object Model) 树是浏览器将 HTML 文档解析成的一种树形数据结构，它将整个 HTML 文档表示为一个由节点组成的树状层次结构。

## DOM 树的基本概念

### 1. 节点类型

DOM 树由不同类型的节点组成：

- **文档节点 (Document Node)**: 整个文档的根节点
- **元素节点 (Element Node)**: HTML 元素，如 `<div>`, `<p>` 等
- **文本节点 (Text Node)**: 包含实际文本内容
- **属性节点 (Attribute Node)**: 元素的属性
- **注释节点 (Comment Node)**: HTML 注释

### 2. 节点关系

- **父节点 (Parent Node)**: 直接包含其他节点的节点
- **子节点 (Child Node)**: 被父节点直接包含的节点
- **兄弟节点 (Sibling Node)**: 具有相同父节点的节点
- **祖先节点**: 从根节点到当前节点路径上的所有节点
- **后代节点**: 当前节点下的所有子节点及其子节点

## DOM 树构建过程

### 1. HTML 解析阶段

```html
<!DOCTYPE html>
<html>
<head>
    <title>示例页面</title>
</head>
<body>
    <div id="container">
        <p class="text">Hello World</p>
        <!-- 这是一个注释 -->
        <ul>
            <li>项目1</li>
            <li>项目2</li>
        </ul>
    </div>
</body>
</html>
```

### 2. 对应的 DOM 树结构

```
Document
├── html (HTMLHtmlElement)
│   ├── head (HTMLHeadElement)
│   │   └── title (HTMLTitleElement)
│   │       └── "示例页面" (Text)
│   └── body (HTMLBodyElement)
│       └── div#container (HTMLDivElement)
│           ├── p.text (HTMLParagraphElement)
│           │   ├── class="text" (Attribute)
│           │   └── "Hello World" (Text)
│           ├── <!-- 这是一个注释 --> (Comment)
│           └── ul (HTMLUListElement)
│               ├── li (HTMLLIElement)
│               │   └── "项目1" (Text)
│               └── li (HTMLLIElement)
│                   └── "项目2" (Text)
```

## DOM 树操作

### 1. 节点遍历

```javascript
// 获取根节点
const root = document.documentElement; // <html> 元素

// 获取子节点
const children = root.children;

// 获取父节点
const parent = document.body.parentNode; // <html>

// 获取兄弟节点
const nextSibling = document.head.nextSibling; // body 元素
```

### 2. 节点查找

```javascript
// 通过 ID 查找
const element = document.getElementById('container');

// 通过类名查找
const elements = document.getElementsByClassName('text');

// 通过标签名查找
const paragraphs = document.getElementsByTagName('p');

// 通过选择器查找
const firstParagraph = document.querySelector('p.text');
const allListItems = document.querySelectorAll('li');
```

### 3. 节点修改

```javascript
// 创建新节点
const newDiv = document.createElement('div');
const textNode = document.createTextNode('新内容');

// 添加节点
newDiv.appendChild(textNode);
document.body.appendChild(newDiv);

// 修改节点
const existingElement = document.getElementById('container');
existingElement.setAttribute('class', 'new-class');
existingElement.textContent = '更新的内容';

// 删除节点
const elementToRemove = document.querySelector('p.text');
elementToRemove.parentNode.removeChild(elementToRemove);
```

## DOM 树的重要特性

### 1. 层次结构

每个节点都有明确的层级关系，这种结构使得我们可以使用路径方式访问任意节点。

### 2. 动态性

DOM 树是动态的，可以通过 JavaScript 随时修改：

```javascript
// 动态添加样式
const container = document.getElementById('container');
container.style.backgroundColor = 'lightblue';

// 动态添加事件监听器
container.addEventListener('click', function() {
    console.log('容器被点击了');
});
```

### 3. 接口统一

所有 DOM 节点都实现了统一的接口，提供了相同的基本操作方法：

```javascript
// 所有元素节点都有这些方法
const element = document.querySelector('div');
element.appendChild(child);
element.removeChild(child);
element.setAttribute('name', 'value');
element.getAttribute('name');
```

## DOM 树与渲染

DOM 树只是页面结构的表示，浏览器还需要结合 CSSOM 树生成渲染树：

```javascript
// DOM 树示例
/*
HTML:
<div class="container">
  <p style="color: red;">文本内容</p>
</div>

DOM 树:
Document
└── html
    └── body
        └── div.container
            └── p
                └── Text("文本内容")
*/

// CSSOM 树会包含样式信息
// 渲染树会结合 DOM 和 CSSOM 信息
```

## 实际应用示例

### 遍历 DOM 树

```javascript
function traverseDOM(node, depth = 0) {
    const indent = '  '.repeat(depth);
    console.log(`${indent}${node.nodeName}`);
    
    for (let i = 0; i < node.childNodes.length; i++) {
        traverseDOM(node.childNodes[i], depth + 1);
    }
}

// 遍历整个文档
traverseDOM(document);
```

### 查找特定元素

```javascript
function findElementsByTag(tagName, root = document) {
    const results = [];
    
    function traverse(node) {
        if (node.nodeType === Node.ELEMENT_NODE && 
            node.tagName.toLowerCase() === tagName.toLowerCase()) {
            results.push(node);
        }
        
        for (let child of node.childNodes) {
            if (child.nodeType === Node.ELEMENT_NODE) {
                traverse(child);
            }
        }
    }
    
    traverse(root);
    return results;
}

// 查找所有 div 元素
const divs = findElementsByTag('div');
```

## 性能考虑

DOM 操作是昂贵的，应该尽量减少：

```javascript
// 不好的做法：频繁操作 DOM
for (let i = 0; i < 1000; i++) {
    const div = document.createElement('div');
    div.textContent = `Item ${i}`;
    document.body.appendChild(div); // 每次都触发重排
}

// 好的做法：使用文档片段
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
    const div = document.createElement('div');
    div.textContent = `Item ${i}`;
    fragment.appendChild(div);
}
document.body.appendChild(fragment); // 只触发一次重排
```

DOM 树是 Web 开发的核心概念，理解它有助于更好地操作页面元素、优化性能和解决相关问题。