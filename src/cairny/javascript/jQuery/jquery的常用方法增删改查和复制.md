---
title: jquery的常用方法增删改查和复制
---

## jQuery 常用方法 - 增删改查和复制

### 1. 查找元素 (Select/Query)

#### 基本选择器
```javascript
// ID 选择器
$('#myId')

// 类选择器
$('.myClass')

// 标签选择器
$('div')

// 属性选择器
$('input[type="text"]')

// 组合选择器
$('div.class1, span.class2')
```

#### 层级选择器
```javascript
// 后代选择器
$('div p') // 选择 div 内的所有 p 元素

// 子元素选择器
$('div > p') // 选择 div 的直接子元素 p

// 相邻兄弟选择器
$('h1 + p') // 选择紧跟在 h1 后面的 p 元素

// 通用兄弟选择器
$('h1 ~ p') // 选择 h1 后面的所有兄弟 p 元素
```

#### 过滤选择器
```javascript
// 基本过滤
$('li:first')    // 第一个 li
$('li:last')     // 最后一个 li
$('li:even')     // 索引为偶数的 li
$('li:odd')      // 索引为奇数的 li
$('li:eq(2)')    // 索引为 2 的 li
$('li:gt(2)')    // 索引大于 2 的 li
$('li:lt(2)')    // 索引小于 2 的 li

// 内容过滤
$('div:contains("Hello")') // 包含文本 "Hello" 的 div
$('td:empty')              // 空的 td 元素
$('div:has(p)')            // 包含 p 元素的 div

// 表单过滤
$('input:text')     // 所有文本输入框
$('input:password') // 所有密码输入框
$('input:checked')  // 所有被选中的输入框
$('input:selected') // 所有被选中的 option 元素
```

#### 查找方法
```javascript
// 在已选元素中查找子元素
$('#parent').find('child')

// 获取父元素
$('.child').parent()

// 获取所有祖先元素
$('.child').parents()

// 获取直接父元素
$('.child').parent()

// 获取兄弟元素
$('li').siblings()

// 获取下一个兄弟元素
$('li').next()

// 获取上一个兄弟元素
$('li').prev()

// 获取所有后续兄弟元素
$('li').nextAll()

// 获取所有前面的兄弟元素
$('li').prevAll()
```

### 2. 增加元素 (Create/Add)

#### 内部插入
```javascript
// 在元素内部末尾添加内容
$('#container').append('<p>新段落</p>')
$('<p>新段落</p>').appendTo('#container')

// 在元素内部开头添加内容
$('#container').prepend('<p>新段落</p>')
$('<p>新段落</p>').prependTo('#container')
```

#### 外部插入
```javascript
// 在元素后面插入
$('#target').after('<p>后面的新元素</p>')
$('<p>后面的新元素</p>').insertAfter('#target')

// 在元素前面插入
$('#target').before('<p>前面的新元素</p>')
$('<p>前面的新元素</p>').insertBefore('#target')
```

#### 创建元素
```javascript
// 创建新元素
var newDiv = $('<div class="new-div">内容</div>')

// 创建元素并设置属性
var newInput = $('<input>', {
  type: 'text',
  class: 'form-control',
  placeholder: '请输入'
})
```

### 3. 删除元素 (Delete/Remove)

```javascript
// 删除元素及其所有子元素
$('#element').remove()

// 删除元素但保留数据和事件
$('#element').detach()

// 清空元素内容
$('#element').empty()

// 删除特定元素
$('li').remove('.selected') // 删除带有 selected 类的 li

// 删除属性
$('#element').removeAttr('class')
```

### 4. 修改元素 (Update/Modify)

#### 修改内容
```javascript
// 修改 HTML 内容
$('#element').html('<strong>新内容</strong>')

// 获取 HTML 内容
var content = $('#element').html()

// 修改文本内容
$('#element').text('纯文本内容')

// 获取文本内容
var text = $('#element').text()

// 修改表单元素的值
$('#input').val('新值')
var value = $('#input').val()
```

#### 修改属性
```javascript
// 设置属性
$('#element').attr('title', '新标题')

// 获取属性
var title = $('#element').attr('title')

// 设置多个属性
$('#element').attr({
  'title': '新标题',
  'class': 'new-class'
})

// 设置类
$('#element').addClass('new-class')
$('#element').removeClass('old-class')
$('#element').toggleClass('active')
$('#element').hasClass('active') // 检查是否有类

// 设置样式
$('#element').css('color', 'red')
$('#element').css({
  'color': 'red',
  'font-size': '16px'
})
```

#### 修改元素数据
```javascript
// 设置数据
$('#element').data('key', 'value')

// 获取数据
var value = $('#element').data('key')

// 设置多个数据
$('#element').data({
  'name': 'John',
  'age': 30
})
```

### 5. 复制元素 (Copy/Clone)

```javascript
// 浅拷贝 - 不复制事件处理器
var clonedElement = $('#element').clone()

// 深拷贝 - 复制事件处理器
var clonedElement = $('#element').clone(true)

// 复制并插入到其他位置
$('#element').clone().appendTo('#target')

// 复制并替换其他元素
$('#element').clone().replaceAll('#target')
```

### 6. 实际应用示例

#### 动态列表操作
```javascript
// 添加列表项
function addListItem(text) {
  var newItem = $('<li>').text(text)
  $('#myList').append(newItem)
}

// 删除选中项
function removeSelectedItem() {
  $('#myList li.selected').remove()
}

// 修改列表项
function updateListItem(index, newText) {
  $('#myList li').eq(index).text(newText)
}

// 复制列表项
function duplicateItem(index) {
  var itemToCopy = $('#myList li').eq(index)
  itemToCopy.clone().insertAfter(itemToCopy)
}
```

#### 表格操作示例
```javascript
// 添加表格行
function addTableRow(data) {
  var newRow = $('<tr>')
  $.each(data, function(index, value) {
    newRow.append($('<td>').text(value))
  })
  $('#myTable tbody').append(newRow)
}

// 删除表格行
function deleteTableRow(rowIndex) {
  $('#myTable tbody tr').eq(rowIndex).remove()
}

// 更新表格单元格
function updateTableCell(rowIndex, cellIndex, newValue) {
  $('#myTable tbody tr').eq(rowIndex).find('td').eq(cellIndex).text(newValue)
}
```

这些是 jQuery 中最常用的增删改查和复制操作方法，通过这些方法可以方便地操作 DOM 元素。