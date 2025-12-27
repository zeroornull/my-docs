---
title: jquery怎么实现动画
---

## jQuery 动画实现详解

### 1. 基本动画方法

#### 显示和隐藏动画
```javascript
// 基本显示/隐藏
$('#element').show();     // 立即显示
$('#element').hide();     // 立即隐藏
$('#element').toggle();   // 切换显示/隐藏

// 带动画效果的显示/隐藏
$('#element').show(1000);           // 1秒内显示
$('#element').hide('slow');         // 慢速隐藏
$('#element').toggle('fast');       // 快速切换

// 指定回调函数
$('#element').show(1000, function() {
  console.log('显示完成');
});
```

#### 淡入淡出动画
```javascript
// 淡入淡出
$('#element').fadeIn();           // 淡入显示
$('#element').fadeOut();          // 淡出隐藏
$('#element').fadeToggle();       // 切换淡入淡出

// 自定义速度
$('#element').fadeIn(2000);       // 2秒内淡入
$('#element').fadeOut('slow');    // 慢速淡出

// 自定义透明度
$('#element').fadeTo(1000, 0.5);  // 1秒内淡入到50%透明度

// 带回调函数
$('#element').fadeOut(1000, function() {
  console.log('淡出完成');
});
```

#### 滑动动画
```javascript
// 滑动效果
$('#element').slideDown();        // 向下滑入显示
$('#element').slideUp();          // 向上滑出隐藏
$('#element').slideToggle();      // 切换滑动效果

// 自定义速度
$('#element').slideDown(2000);    // 2秒内滑入
$('#element').slideUp('fast');    // 快速滑出

// 带回调函数
$('#element').slideToggle(500, function() {
  console.log('滑动切换完成');
});
```

### 2. 自定义动画 - animate()

```javascript
// 基本语法
$('#element').animate({
  // CSS 属性
  opacity: 0.5,
  left: '+=50',
  height: 'toggle'  // 切换高度
}, {
  duration: 1000,     // 动画时长
  easing: 'swing',    // 缓动函数
  complete: function() {
    console.log('动画完成');
  }
});

// 简化语法
$('#element').animate({
  width: '200px',
  height: '100px',
  opacity: 0.5
}, 1000, 'linear', function() {
  console.log('动画结束');
});
```

#### animate() 常用属性示例
```javascript
// 位置移动
$('#box').animate({
  left: '100px',
  top: '50px'
}, 1000);

// 尺寸变化
$('#box').animate({
  width: '+=100',
  height: '-=50'
}, 500);

// 多属性同时动画
$('#box').animate({
  opacity: 0.25,
  left: '+=50',
  height: 'toggle'
}, 1000);
```

### 3. 动画队列和控制

#### 动画队列
```javascript
// 动画会按顺序执行（队列）
$('#box').animate({left: '100px'}, 1000)
         .animate({top: '100px'}, 1000)
         .animate({left: '0px'}, 1000)
         .animate({top: '0px'}, 1000);

// 并行执行动画
$('#box').animate({left: '100px'}, 1000);
$('#box').animate({top: '100px'}, 1000);
$('#box').animate({width: '200px'}, 1000);
```

#### 动画控制
```javascript
// 停止动画
$('#element').stop();                    // 停止当前动画
$('#element').stop(true);                // 停止所有动画
$('#element').stop(true, true);          // 停止并跳到动画末尾

// 延迟执行
$('#element').delay(1000)                // 延迟1秒
             .fadeIn()
             .delay(500)
             .fadeOut();

// 清空动画队列
$('#element').clearQueue();

// 跳到动画末尾
$('#element').finish();                  // 停止并完成所有动画
```

### 4. 缓动函数

#### 内置缓动
```javascript
// swing（默认）- 先慢后快再慢
$('#element').animate({
  left: '100px'
}, 1000, 'swing');

// linear - 匀速
$('#element').animate({
  left: '100px'
}, 1000, 'linear');
```

#### 自定义缓动（需要 jQuery UI）
```javascript
$('#element').animate({
  left: '100px'
}, 1000, 'easeInOutBounce');

$('#element').animate({
  top: '100px'
}, 1000, 'easeInElastic');
```

### 5. 实用动画示例

#### 弹跳效果
```javascript
function bounce(element) {
  element.animate({top: '-=20px'}, 100)
         .animate({top: '+=20px'}, 100)
         .animate({top: '-=10px'}, 100)
         .animate({top: '+=10px'}, 100);
}

bounce($('#ball'));
```

#### 脉冲效果
```javascript
function pulse(element) {
  element.animate({scale: 1.1}, 200)
         .animate({scale: 1.0}, 200)
         .animate({scale: 1.05}, 100)
         .animate({scale: 1.0}, 100);
}

pulse($('#button'));
```

#### 滑入菜单
```javascript
$('.menu-toggle').click(function() {
  $('.menu').slideToggle(300);
});

// 或者更复杂的动画
$('.menu-toggle').click(function() {
  if ($('.menu').is(':visible')) {
    $('.menu').animate({
      height: 'toggle',
      opacity: 'toggle'
    }, 300);
  } else {
    $('.menu').animate({
      height: 'toggle',
      opacity: 'toggle'
    }, 300);
  }
});
```

#### 图片轮播动画
```javascript
function slideToNext() {
  var $current = $('.slide.active');
  var $next = $current.next('.slide').length ? 
              $current.next('.slide') : 
              $('.slide').first();
  
  $current.fadeOut(500);
  $next.delay(500).fadeIn(500);
  
  $current.removeClass('active');
  $next.addClass('active');
}

// 自动轮播
setInterval(slideToNext, 3000);
```

#### 加载动画
```javascript
// 旋转加载图标
function rotateLoader() {
  $('#loader').animate({rotate: '+=360deg'}, 1000, 'linear', rotateLoader);
}

// 脉冲加载点
function pulseDots() {
  $('.dot').each(function(index) {
    $(this).delay(index * 200).animate({
      opacity: 0.2
    }, 500).animate({
      opacity: 1
    }, 500);
  });
  setTimeout(pulseDots, 1500);
}
```

### 6. CSS3 动画结合

```javascript
// 添加 CSS3 动画类
$('#element').addClass('animated bounce');

// 动画完成后移除类
$('#element').addClass('animated bounce')
             .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', 
                  function() {
                    $(this).removeClass('animated bounce');
                  });
```

### 7. 性能优化建议

#### 使用 transform 优化
```javascript
// 使用 CSS transform 而不是改变 left/top
$('#element').animate({
  transform: 'translateX(100px)'
}, 1000);

// 或者使用 CSS 类切换
$('#element').addClass('move-right');
```

#### 批量动画处理
```javascript
// 使用 requestAnimationFrame 优化
function animateBatch() {
  $('.item').each(function() {
    $(this).animate({
      opacity: 0.5
    }, 1000);
  });
}

// 或者延迟批量处理
setTimeout(animateBatch, 100);
```

### 8. 完整示例：模态框动画

```javascript
// 显示模态框动画
function showModal() {
  $('#modal-overlay').fadeIn(200);
  $('#modal-box').css({
    top: '-100px',
    opacity: 0
  }).animate({
    top: '100px',
    opacity: 1
  }, 300);
}

// 隐藏模态框动画
function hideModal() {
  $('#modal-box').animate({
    top: '-100px',
    opacity: 0
  }, 300, function() {
    $('#modal-overlay').fadeOut(200);
  });
}

// 绑定事件
$('.open-modal').click(showModal);
$('.close-modal, #modal-overlay').click(hideModal);
```

jQuery 动画提供了简单易用的 API 来创建各种视觉效果，从基本的显示隐藏到复杂的自定义动画都能轻松实现。合理使用动画可以大大提升用户体验，但要注意性能和适度原则。