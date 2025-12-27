---
title: jquery有哪些查询节点的选择器
---

## jQuery 节点查询选择器详解

### 1. 基本选择器

#### ID 选择器
```javascript
// 选择具有特定 ID 的元素
$('#myId')           // 选择 id="myId" 的元素
$('#header')         // 选择 id="header" 的元素
$('#user-profile')   // 选择 id="user-profile" 的元素
```

#### 类选择器
```javascript
// 选择具有特定类的元素
$('.myClass')        // 选择 class="myClass" 的元素
$('.active')         // 选择 class="active" 的元素
$('.btn.primary')    // 选择同时具有 btn 和 primary 类的元素
```

#### 标签选择器
```javascript
// 选择特定标签的元素
$('div')             // 选择所有 div 元素
$('p')               // 选择所有 p 元素
$('input')           // 选择所有 input 元素
$('ul')              // 选择所有 ul 元素
```

#### 通用选择器
```javascript
// 选择所有元素
$('*')               // 选择文档中的所有元素
$('div *')           // 选择所有 div 内的元素
```

#### 组合选择器
```javascript
// 选择多个不同类型的选择器
$('div, p, .highlight')  // 选择所有 div、p 元素和具有 highlight 类的元素
$('#header, .sidebar')   // 选择 id="header" 的元素和具有 sidebar 类的元素
```

### 2. 层级选择器

#### 后代选择器
```javascript
// 选择某元素内部的所有指定元素（包括子孙元素）
$('div p')           // 选择 div 内的所有 p 元素
$('#container span') // 选择 id="container" 内的所有 span 元素
$('.menu a')         // 选择 class="menu" 内的所有 a 元素
```

#### 子元素选择器
```javascript
// 选择某元素的直接子元素
$('div > p')         // 选择 div 的直接子元素 p
$('#list > li')      // 选择 id="list" 的直接子元素 li
$('ul > .item')      // 选择 ul 的直接子元素中具有 item 类的元素
```

#### 相邻兄弟选择器
```javascript
// 选择紧接在某元素后的同级元素
$('h1 + p')          // 选择紧跟在 h1 后面的 p 元素
$('.title + .content') // 选择紧跟在 class="title" 元素后的 class="content" 元素
$('label + input')   // 选择紧跟在 label 后面的 input 元素
```

#### 通用兄弟选择器
```javascript
// 选择某元素后面的所有同级元素
$('h1 ~ p')          // 选择 h1 后面的所有 p 元素
$('.item ~ .item')   // 选择 class="item" 元素后面的所有 class="item" 元素
$('li ~ li')         // 选择第一个 li 后面的所有 li 元素
```

### 3. 基本过滤选择器

#### 索引过滤
```javascript
// 基于索引的选择
$('li:first')        // 选择第一个 li 元素
$('li:last')         // 选择最后一个 li 元素
$('li:eq(2)')        // 选择索引为 2 的 li 元素（第三个）
$('li:gt(2)')        // 选择索引大于 2 的所有 li 元素
$('li:lt(3)')        // 选择索引小于 3 的所有 li 元素
$('li:even')         // 选择索引为偶数的 li 元素
$('li:odd')          // 选择索引为奇数的 li 元素
```

#### 内容过滤
```javascript
// 基于内容的选择
$('div:contains("Hello")')  // 选择包含文本 "Hello" 的 div 元素
$('p:empty')                // 选择没有任何内容的 p 元素
$('div:has(p)')             // 选择包含 p 元素的 div 元素
$('span:parent')            // 选择至少包含一个子元素的 span 元素
```

#### 可见性过滤
```javascript
// 基于可见性的选择
$('div:hidden')             // 选择所有隐藏的 div 元素
$('p:visible')              // 选择所有可见的 p 元素
```

### 4. 属性选择器

#### 基本属性选择
```javascript
// 属性存在性选择
$('input[type]')            // 选择具有 type 属性的 input 元素
$('div[id]')                // 选择具有 id 属性的 div 元素

// 属性值精确匹配
$('input[type="text"]')     // 选择 type="text" 的 input 元素
$('a[href="https://example.com"]')  // 选择 href="https://example.com" 的 a 元素

// 属性值包含选择
$('div[class*="col"]')      // 选择 class 属性值包含 "col" 的 div 元素
$('a[href*="example"]')     // 选择 href 属性值包含 "example" 的 a 元素

// 属性值前缀匹配
$('a[href^="https"]')       // 选择 href 属性值以 "https" 开头的 a 元素
$('img[src^="/images/"]')   // 选择 src 属性值以 "/images/" 开头的 img 元素

// 属性值后缀匹配
$('a[href$=".pdf"]')        // 选择 href 属性值以 ".pdf" 结尾的 a 元素
$('img[src$=".jpg"]')       // 选择 src 属性值以 ".jpg" 结尾的 img 元素
```

### 5. 表单选择器

#### 表单元素选择
```javascript
// 表单控件选择
$(':input')                 // 选择所有 input、textarea、select 和 button 元素
$(':text')                  // 选择 type="text" 的 input 元素
$(':password')              // 选择 type="password" 的 input 元素
$(':radio')                 // 选择 type="radio" 的 input 元素
$(':checkbox')              // 选择 type="checkbox" 的 input 元素
$(':submit')                // 选择 type="submit" 的 input 元素
$(':image')                 // 选择 type="image" 的 input 元素
$(':reset')                 // 选择 type="reset" 的 input 元素
$(':button')                // 选择 type="button" 的 input 元素和 button 元素
$(':file')                  // 选择 type="file" 的 input 元素
```

#### 表单状态选择
```javascript
// 表单状态选择
$(':enabled')               // 选择所有启用的表单元素
$(':disabled')              // 选择所有禁用的表单元素
$(':checked')               // 选择所有被选中的单选框和复选框
$(':selected')              // 选择所有被选中的 option 元素
$(':focus')                 // 选择当前获得焦点的元素
```

### 6. 子元素过滤选择器

```javascript
// 基于子元素位置的选择
$('div:first-child')        // 选择作为父元素第一个子元素的 div
$('li:last-child')          // 选择作为父元素最后一个子元素的 li
$('p:only-child')           // 选择作为父元素唯一子元素的 p
$('tr:nth-child(2)')        // 选择作为父元素第二个子元素的 tr
$('tr:nth-child(even)')     // 选择作为父元素偶数位置子元素的 tr
$('tr:nth-child(odd)')      // 选择作为父元素奇数位置子元素的 tr
$('tr:nth-child(3n)')       // 选择作为父元素第 3、6、9... 位置子元素的 tr
```

### 7. jQuery 特有选择器

#### 内容过滤选择器
```javascript
// jQuery 扩展的选择器
$('div:header')             // 选择所有标题元素 (h1, h2, h3, h4, h5, h6)
$('div:animated')           // 选择当前正在执行动画的 div 元素
$('div:focus')              // 选择当前获得焦点的 div 元素
```

#### 元素关系选择器
```javascript
// jQuery 扩展的选择器
$('div:not(.hidden)')       // 选择不具有 hidden 类的 div 元素
$('input:not(:checked)')    // 选择未被选中的 input 元素
$('li:not(:first-child)')   // 选择不是第一个子元素的 li 元素
```

### 8. 实际应用示例

#### 表格操作
```javascript
// 选择表格中的特定行
$('table tr:even')          // 选择表格中的偶数行
$('table tr:odd')           // 选择表格中的奇数行
$('table tr:first')         // 选择表格的第一行
$('table tr:last')          // 选择表格的最后一行
$('table tr:nth-child(3)')  // 选择表格的第三行

// 选择表格中的特定单元格
$('td:empty')               // 选择空的单元格
$('td:contains("总计")')    // 选择包含"总计"的单元格
```

#### 导航菜单
```javascript
// 选择导航菜单项
$('.nav-item:first')        // 选择第一个导航项
$('.nav-item:last')         // 选择最后一个导航项
$('.nav-item.active')       // 选择激活的导航项
$('.nav-item:not(.disabled)') // 选择非禁用的导航项
```

#### 表单验证
```javascript
// 选择表单中的必填字段
$('input[required]')        // 选择具有 required 属性的输入框
$('input[type="email"]')    // 选择邮箱输入框
$('input:invalid')          // 选择无效的输入框
$('input:valid')            // 选择有效的输入框
$('.form-group:has(.error)') // 选择包含错误元素的表单组
```

#### 动态内容处理
```javascript
// 选择动态添加的元素
$(document).on('click', '.dynamic-button', function() {
  // 处理动态添加的按钮点击
});

// 选择特定条件的元素
$('.item:visible:not(.hidden)')  // 选择可见且不具有 hidden 类的元素
$('.data-row:nth-child(2n+1)')   // 选择奇数行的数据行
```

### 9. 性能优化建议

```javascript
// 优先使用 ID 选择器（性能最好）
$('#myId')                  // 最快

// 使用标签+类组合提高性能
$('div.myClass')            // 比 .myClass 更快

// 避免复杂的选择器
// 不推荐
$('div.container ul.list li.item a.link span.text')
// 推荐
$('.link-text') 或 $('#specific-element')

// 使用上下文限制搜索范围
$('.item', '#container')    // 在 #container 内搜索 .item
$('#container').find('.item') // 同样效果

// 缓存选择器结果
var $items = $('.item');
$items.addClass('processed');
$items.filter(':first').addClass('first-item');
```

### 10. 选择器组合示例

```javascript
// 复杂选择器示例
$('div.container > ul.list li.item:first-child')
$('input[type="text"]:enabled:focus')
$('table tr:nth-child(even):not(.header)')
$('.menu-item:has(> .submenu)')
$('form input[required]:not(:valid)')
```

这些选择器提供了强大的元素查询能力，可以精确地定位和操作 DOM 元素。合理使用选择器可以大大提高开发效率和代码可读性。