---
title: jquery获取或设置HTML、文本和值
---

## jQuery 获取和设置 HTML、文本和值的方法

### 1. HTML 内容操作 - html() 方法

#### 获取 HTML 内容
```javascript
// 获取元素的 HTML 内容（包含标签）
var htmlContent = $('#element').html();
console.log(htmlContent); // '<p>段落内容</p><span>文本</span>'

// 获取空元素返回空字符串
var emptyHtml = $('#emptyElement').html(); // ''

// 获取不存在元素返回 undefined
var nonExistHtml = $('#nonExist').html(); // undefined
```

#### 设置 HTML 内容
```javascript
// 设置 HTML 内容
$('#element').html('<strong>新内容</strong>');

// 设置多个元素
$('.item').html('<p>统一内容</p>');

// 使用 HTML 字符串
$('#container').html('<div class="new-item"><span>新项目</span></div>');

// 清空内容
$('#element').html(''); // 或者 $('#element').empty();
```

#### 使用函数设置 HTML
```javascript
// 使用函数动态生成内容
$('#list li').html(function(index, oldHtml) {
  return '<strong>第' + (index + 1) + '项:</strong> ' + oldHtml;
});

// 根据条件设置不同内容
$('#element').html(function(index, oldHtml) {
  if (oldHtml.length > 10) {
    return '<em>内容较长</em>';
  } else {
    return '<strong>内容较短</strong>';
  }
});
```

### 2. 文本内容操作 - text() 方法

#### 获取文本内容
```javascript
// 获取纯文本内容（去除 HTML 标签）
var textContent = $('#element').text();
console.log(textContent); // '段落内容文本'

// 获取包含子元素的文本
// <div id="element"><p>段落1</p><p>段落2</p></div>
var allText = $('#element').text(); // '段落1段落2'

// 获取表单元素文本
var inputText = $('#input').val(); // 获取输入值
var divText = $('#input').text();  // 获取显示文本（通常为空）
```

#### 设置文本内容
```javascript
// 设置纯文本（HTML 标签会被转义）
$('#element').text('<strong>这不是 HTML 标签</strong>');
// 显示为: &lt;strong&gt;这不是 HTML 标签&lt;/strong&gt;

// 设置普通文本
$('#element').text('这是纯文本内容');

// 设置多个元素
$('.item').text('统一文本内容');
```

#### 使用函数设置文本
```javascript
// 动态生成文本
$('#list li').text(function(index, oldText) {
  return '项目 ' + (index + 1) + ': ' + oldText;
});

// 格式化文本
$('.price').text(function(index, oldText) {
  return '¥' + parseFloat(oldText).toFixed(2);
});
```

### 3. 表单值操作 - val() 方法

#### 获取表单元素值
```javascript
// 获取输入框值
var inputValue = $('#textInput').val();

// 获取文本域值
var textareaValue = $('#textarea').val();

// 获取下拉框选中值
var selectValue = $('#select').val();

// 获取复选框值
var checkboxValue = $('#checkbox').val(); // 获取 value 属性值
var isChecked = $('#checkbox').prop('checked'); // 获取选中状态

// 获取单选框值
var radioValue = $('input[name="radioGroup"]:checked').val();

// 获取多选下拉框值（返回数组）
var multiSelectValues = $('#multiSelect').val();
```

#### 设置表单元素值
```javascript
// 设置输入框值
$('#textInput').val('新值');

// 设置文本域值
$('#textarea').val('多行文本内容');

// 设置下拉框选中值
$('#select').val('option2');

// 设置复选框状态
$('#checkbox').prop('checked', true);
$('#checkbox').val('newValue'); // 设置 value 属性

// 设置单选框选中
$('input[name="radioGroup"]').val(['radio2']); // 数组形式

// 设置多选下拉框值
$('#multiSelect').val(['option1', 'option3']);
```

#### 使用函数设置值
```javascript
// 动态设置值
$('#input').val(function(index, oldValue) {
  return oldValue.toUpperCase();
});

// 格式化数值
$('#numberInput').val(function(index, oldValue) {
  return parseFloat(oldValue).toFixed(2);
});
```

### 4. 方法对比和使用场景

#### html() vs text() vs val()

| 方法 | 用途 | 返回/设置内容 | 适用元素 |
|------|------|---------------|----------|
| `html()` | HTML 内容 | 包含标签的 HTML | 所有元素 |
| `text()` | 纯文本内容 | 去除标签的文本 | 所有元素 |
| `val()` | 表单值 | 表单元素的值 | 表单元素 |

```javascript
// 示例 HTML
// <div id="content"><p>Hello <strong>World</strong></p></div>
// <input type="text" id="input" value="初始值">

// html() 方法
$('#content').html(); // '<p>Hello <strong>World</strong></p>'
$('#content').html('<em>New Content</em>'); // 替换为 HTML

// text() 方法
$('#content').text(); // 'Hello World'
$('#content').text('New Text'); // 设置为纯文本

// val() 方法
$('#input').val(); // '初始值'
$('#input').val('新值'); // 设置表单值
```

### 5. 实际应用示例

#### 动态内容更新
```javascript
// 更新用户信息显示
function updateUserInfo(user) {
  $('#userName').text(user.name);
  $('#userEmail').html('<a href="mailto:' + user.email + '">' + user.email + '</a>');
  $('#userAvatar').attr('src', user.avatar);
}

// 更新产品列表
function updateProductList(products) {
  var html = '';
  products.forEach(function(product) {
    html += '<div class="product">';
    html += '<h3>' + product.name + '</h3>';
    html += '<p class="price">¥' + product.price + '</p>';
    html += '<p class="description">' + product.description + '</p>';
    html += '</div>';
  });
  $('#productList').html(html);
}
```

#### 表单处理
```javascript
// 表单数据获取
function getFormData() {
  return {
    name: $('#name').val(),
    email: $('#email').val(),
    phone: $('#phone').val(),
    message: $('#message').val(),
    subscribe: $('#subscribe').prop('checked')
  };
}

// 表单数据填充
function fillFormData(data) {
  $('#name').val(data.name);
  $('#email').val(data.email);
  $('#phone').val(data.phone);
  $('#message').val(data.message);
  $('#subscribe').prop('checked', data.subscribe);
}

// 表单重置
function resetForm() {
  $('#contactForm')[0].reset(); // 原生重置
  // 或者
  $('#contactForm input, #contactForm textarea, #contactForm select').val('');
  $('#contactForm input[type="checkbox"]').prop('checked', false);
}
```

#### 搜索结果展示
```javascript
// 显示搜索结果
function displaySearchResults(results) {
  if (results.length === 0) {
    $('#searchResults').html('<p class="no-results">未找到相关结果</p>');
    return;
  }
  
  var html = '<ul class="results-list">';
  results.forEach(function(item) {
    html += '<li class="result-item">';
    html += '<h4>' + item.title + '</h4>';
    html += '<p>' + item.description + '</p>';
    html += '</li>';
  });
  html += '</ul>';
  
  $('#searchResults').html(html);
}

// 更新搜索统计
function updateSearchStats(total, time) {
  $('#resultCount').text('找到 ' + total + ' 个结果');
  $('#searchTime').text('耗时 ' + time + ' 毫秒');
}
```

#### 实时内容编辑
```javascript
// 双击编辑功能
$('.editable').dblclick(function() {
  var currentText = $(this).text();
  var $input = $('<input type="text" class="edit-input">').val(currentText);
  $(this).html($input);
  $input.focus();
});

// 保存编辑内容
$(document).on('blur', '.edit-input', function() {
  var newText = $(this).val();
  $(this).parent().text(newText);
});

// Enter 键保存
$(document).on('keypress', '.edit-input', function(e) {
  if (e.which === 13) { // Enter 键
    $(this).blur();
  }
});
```

#### 数据绑定和模板渲染
```javascript
// 简单模板渲染
function renderTemplate(template, data) {
  var html = template;
  for (var key in data) {
    html = html.replace(new RegExp('{{' + key + '}}', 'g'), data[key]);
  }
  return html;
}

// 使用示例
var template = '<div class="user-card"><h3>{{name}}</h3><p>{{email}}</p></div>';
var userData = { name: '张三', email: 'zhangsan@example.com' };
var rendered = renderTemplate(template, userData);
$('#userContainer').html(rendered);
```

### 6. 性能优化建议

```javascript
// 批量操作时缓存 jQuery 对象
var $container = $('#container');
$container.html('<div>内容1</div>');
$container.find('.item').text('新文本');

// 链式调用
$('#element')
  .html('<p>新内容</p>')
  .addClass('updated')
  .fadeIn();

// 大量 HTML 构建时使用数组连接
var htmlParts = [];
for (var i = 0; i < 1000; i++) {
  htmlParts.push('<div class="item">项目 ' + i + '</div>');
}
$('#container').html(htmlParts.join(''));

// 使用文档片段处理复杂 DOM 操作
var $fragment = $(document.createDocumentFragment());
for (var i = 0; i < 100; i++) {
  $fragment.append('<div>项目 ' + i + '</div>');
}
$('#container').append($fragment);
```

这些方法是 jQuery 中最常用的 DOM 内容操作方法，掌握它们的区别和使用场景对于高效的前端开发非常重要。