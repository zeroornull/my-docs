---
title: jquery怎么获取或设置属性
---

## jQuery 获取和设置属性的方法详解

### 1. attr() 方法

#### 获取属性
```javascript
// 获取单个属性
var title = $('#element').attr('title');
var src = $('img').attr('src');
var href = $('a').attr('href');

// 获取不存在的属性返回 undefined
var nonExist = $('#element').attr('non-existent');
```

#### 设置属性
```javascript
// 设置单个属性
$('#element').attr('title', '新标题');
$('img').attr('src', 'new-image.jpg');
$('a').attr('href', 'https://example.com');

// 设置多个属性
$('#element').attr({
  'title': '新标题',
  'class': 'new-class',
  'data-id': '123'
});

// 使用函数设置属性值
$('#element').attr('title', function(index, oldValue) {
  return '第' + (index + 1) + '个元素，原值：' + oldValue;
});
```

### 2. prop() 方法

#### 获取属性
```javascript
// 获取布尔属性
var isChecked = $('#checkbox').prop('checked');
var isDisabled = $('#input').prop('disabled');
var isSelected = $('#option').prop('selected');

// 获取元素属性
var tagName = $('#element').prop('tagName');
var nodeName = $('#element').prop('nodeName');
```

#### 设置属性
```javascript
// 设置布尔属性
$('#checkbox').prop('checked', true);
$('#input').prop('disabled', false);
$('#option').prop('selected', true);

// 设置多个属性
$('#element').prop({
  'checked': true,
  'disabled': false
});
```

### 3. attr() 和 prop() 的区别

```javascript
// HTML
// <input type="checkbox" checked="checked" id="checkbox">

// attr() 获取的是 HTML 属性值
$('#checkbox').attr('checked');  // "checked"

// prop() 获取的是 DOM 属性值
$('#checkbox').prop('checked');  // true

// 取消选中后
$('#checkbox').prop('checked', false);

// attr() 仍然返回 "checked"
$('#checkbox').attr('checked');  // "checked"

// prop() 返回 false
$('#checkbox').prop('checked');  // false
```

#### 使用场景对比

| 方法 | 适用场景 | 特点 |
|------|----------|------|
| `attr()` | HTML 属性 | 获取/设置 HTML 中定义的属性 |
| `prop()` | DOM 属性 | 获取/设置 JavaScript 中的属性值 |

```javascript
// 使用 attr() 的场景
$('#link').attr('href');           // 获取链接地址
$('#image').attr('src');           // 获取图片路径
$('#element').attr('class');       // 获取 class 属性
$('#element').attr('data-custom'); // 获取自定义 data 属性

// 使用 prop() 的场景
$('#checkbox').prop('checked');    // 获取选中状态
$('#input').prop('disabled');      // 获取禁用状态
$('#select').prop('selectedIndex'); // 获取选中索引
$('#element').prop('tagName');     // 获取标签名
```

### 4. removeAttr() 和 removeProp()

#### 移除属性
```javascript
// 移除 HTML 属性
$('#element').removeAttr('title');
$('#element').removeAttr('class data-id title'); // 移除多个属性

// 移除 DOM 属性（不推荐用于布尔属性）
$('#element').removeProp('customProperty');
```

### 5. CSS 类操作

#### addClass(), removeClass(), toggleClass()
```javascript
// 添加类
$('#element').addClass('new-class');
$('#element').addClass('class1 class2 class3'); // 添加多个类

// 移除类
$('#element').removeClass('old-class');
$('#element').removeClass('class1 class2'); // 移除多个类
$('#element').removeClass(); // 移除所有类

// 切换类
$('#element').toggleClass('active');
$('#element').toggleClass('highlight', true); // 强制添加
$('#element').toggleClass('hidden', false);   // 强制移除

// 检查是否有类
if ($('#element').hasClass('active')) {
  console.log('元素有 active 类');
}
```

### 6. HTML 和文本内容

#### html() 方法
```javascript
// 获取 HTML 内容
var content = $('#element').html();

// 设置 HTML 内容
$('#element').html('<strong>新内容</strong>');
$('#element').html('<p>段落1</p><p>段落2</p>');

// 使用函数设置
$('#element').html(function(index, oldHtml) {
  return '<em>' + oldHtml + '</em>';
});
```

#### text() 方法
```javascript
// 获取文本内容
var text = $('#element').text();

// 设置文本内容（会转义 HTML 标签）
$('#element').text('<strong>这不是 HTML 标签</strong>');

// 使用函数设置
$('#element').text(function(index, oldText) {
  return '索引 ' + index + ': ' + oldText;
});
```

### 7. 表单元素值操作

#### val() 方法
```javascript
// 获取表单元素值
var inputValue = $('#input').val();
var selectValue = $('#select').val();
var checkboxValue = $('#checkbox').val();
var textareaValue = $('#textarea').val();

// 获取多选下拉框值
var multiSelectValues = $('#multiSelect').val(); // 返回数组

// 设置表单元素值
$('#input').val('新值');
$('#select').val('option2');
$('#checkbox').val('checkboxValue');
$('#textarea').val('新文本内容');

// 设置多选值
$('#multiSelect').val(['option1', 'option3']);
```

### 8. 数据属性操作

#### data() 方法
```javascript
// 获取 data 属性
var dataId = $('#element').data('id');
var userData = $('#element').data('user-info');

// HTML5 data 属性
// <div id="element" data-user-name="John" data-user-age="30"></div>

var userName = $('#element').data('userName'); // 驼峰命名
var userAge = $('#element').data('userAge');

// 设置数据
$('#element').data('key', 'value');
$('#element').data({
  'name': 'John',
  'age': 30,
  'active': true
});

// 获取所有数据
var allData = $('#element').data();
```

### 9. 样式操作

#### css() 方法
```javascript
// 获取样式
var color = $('#element').css('color');
var fontSize = $('#element').css('font-size');

// 获取多个样式
var styles = $('#element').css(['color', 'font-size', 'margin']);

// 设置单个样式
$('#element').css('color', 'red');
$('#element').css('background-color', '#f0f0f0');

// 设置多个样式
$('#element').css({
  'color': 'blue',
  'font-size': '16px',
  'margin': '10px'
});

// 使用函数设置
$('#element').css('font-size', function(index, value) {
  return parseInt(value) + 2 + 'px';
});
```

### 10. 实际应用示例

#### 表单验证
```javascript
// 检查必填字段
function validateForm() {
  var isValid = true;
  
  $('.required').each(function() {
    if ($(this).val().trim() === '') {
      $(this).addClass('error');
      $(this).attr('title', '此字段为必填项');
      isValid = false;
    } else {
      $(this).removeClass('error');
      $(this).removeAttr('title');
    }
  });
  
  return isValid;
}

// 禁用/启用按钮
function toggleSubmitButton(disable) {
  $('#submitBtn').prop('disabled', disable);
}
```

#### 图片懒加载
```javascript
// 懒加载实现
function lazyLoadImages() {
  $('.lazy-image').each(function() {
    if (isInViewport($(this))) {
      var src = $(this).data('src');
      $(this).attr('src', src);
      $(this).removeClass('lazy-image').addClass('loaded');
    }
  });
}

// 检查元素是否在视口内
function isInViewport($element) {
  var elementTop = $element.offset().top;
  var elementBottom = elementTop + $element.outerHeight();
  var viewportTop = $(window).scrollTop();
  var viewportBottom = viewportTop + $(window).height();
  
  return elementBottom > viewportTop && elementTop < viewportBottom;
}
```

#### 动态导航菜单
```javascript
// 设置当前页面导航高亮
function setActiveNavigation() {
  var currentPage = window.location.pathname;
  
  $('.nav-link').each(function() {
    var linkHref = $(this).attr('href');
    if (currentPage.indexOf(linkHref) !== -1) {
      $(this).addClass('active');
      $(this).attr('aria-current', 'page');
    }
  });
}

// 禁用外部链接
function disableExternalLinks() {
  $('a[href^="http"]').each(function() {
    if (this.hostname !== location.hostname) {
      $(this).attr('rel', 'noopener noreferrer');
      $(this).attr('target', '_blank');
    }
  });
}
```

### 11. 性能优化建议

```javascript
// 缓存 jQuery 对象
var $element = $('#element');
$element.attr('title', '新标题');
$element.prop('disabled', false);
$element.addClass('active');

// 链式调用
$('#element')
  .attr('title', '新标题')
  .prop('disabled', false)
  .addClass('active')
  .css('color', 'red');

// 批量操作
$('#element').attr({
  'title': '新标题',
  'data-id': '123'
}).prop({
  'disabled': false
}).addClass('active highlight');
```

jQuery 提供了丰富的属性操作方法，合理使用这些方法可以轻松地获取和设置元素的各种属性。选择合适的方法对于正确操作 DOM 元素至关重要。