---
title: 使用 CSS3 实现动画
---

## CSS3 动画实现详解

CSS3 提供了强大的动画功能，主要通过 `@keyframes` 规则和 `animation` 属性来实现动画效果。

### 1. 基础动画实现

#### 创建关键帧动画

使用 `@keyframes` 规则定义动画的关键帧：

```css
@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* 或者使用百分比 */
@keyframes bounce {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0);
  }
}
```

#### 应用动画到元素

使用 `animation` 属性将动画应用到元素：

```css
.animated-element {
  animation-name: slideIn;
  animation-duration: 2s;
  animation-timing-function: ease-in-out;
  animation-delay: 0.5s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}
```

### 2. animation 属性详解

#### 简写语法
```css
.element {
  /* animation: name duration timing-function delay iteration-count direction fill-mode play-state */
  animation: slideIn 2s ease-in-out 0.5s infinite alternate both running;
}
```

#### 各个属性含义：

- `animation-name`: 动画名称（@keyframes定义的名称）
- `animation-duration`: 动画持续时间（必须设置）
- `animation-timing-function`: 时间函数（控制动画速度曲线）
- `animation-delay`: 动画延迟时间
- `animation-iteration-count`: 重复次数（infinite表示无限循环）
- `animation-direction`: 动画方向（normal|reverse|alternate|alternate-reverse）
- `animation-fill-mode`: 动画填充模式（none|forwards|backwards|both）
- `animation-play-state`: 播放状态（running|paused）

### 3. 实际动画示例

#### 示例1：淡入淡出效果

```html
<div class="fade-element">淡入淡出</div>
```

```css
@keyframes fadeInOut {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.fade-element {
  animation: fadeInOut 3s ease-in-out infinite;
  padding: 20px;
  background-color: #3498db;
  color: white;
  text-align: center;
  border-radius: 5px;
}
```

#### 示例2：旋转动画

```html
<div class="spinner"></div>
```

```css
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
```

#### 示例3：弹跳动画

```html
<div class="bounce-ball"></div>
```

```css
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-100px);
  }
}

.bounce-ball {
  width: 50px;
  height: 50px;
  background-color: #e74c3c;
  border-radius: 50%;
  animation: bounce 1s ease-in-out infinite;
}
```

#### 示例4：心跳效果

```html
<div class="heart">❤️</div>
```

```css
@keyframes heartbeat {
  0% {
    transform: scale(1);
  }
  14% {
    transform: scale(1.3);
  }
  28% {
    transform: scale(1);
  }
  42% {
    transform: scale(1.3);
  }
  70% {
    transform: scale(1);
  }
}

.heart {
  font-size: 50px;
  animation: heartbeat 1.2s ease-in-out infinite;
}
```

### 4. 高级动画技巧

#### 多个动画组合

```css
@keyframes move {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(200px);
  }
}

@keyframes changeColor {
  0% {
    background-color: red;
  }
  100% {
    background-color: blue;
  }
}

.multi-animation {
  width: 100px;
  height: 100px;
  animation: move 2s ease-in-out infinite alternate,
             changeColor 4s linear infinite alternate;
}
```

#### 动画填充模式（animation-fill-mode）

```css
@keyframes slideUp {
  from {
    transform: translateY(100px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.fill-forwards {
  animation: slideUp 1s ease-out forwards; /* 保持结束状态 */
}

.fill-backwards {
  animation: slideUp 1s ease-out 1s backwards; /* 应用起始状态 */
}

.fill-both {
  animation: slideUp 1s ease-out 1s both; /* 同时应用前后状态 */
}
```

#### 控制动画播放状态

```css
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.pausable-animation {
  animation: pulse 2s infinite;
}

.pausable-animation:hover {
  animation-play-state: paused;
}
```

### 5. 性能优化建议

#### 使用 transform 和 opacity

```css
/* 推荐：使用 transform 和 opacity */
@keyframes goodPerformance {
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(100px);
    opacity: 0.5;
  }
}

/* 不推荐：改变布局属性 */
@keyframes badPerformance {
  0% {
    left: 0;
    width: 100px;
  }
  100% {
    left: 100px;
    width: 200px;
  }
}
```

#### 使用 will-change 属性

```css
.optimized-animation {
  will-change: transform, opacity;
  animation: slideIn 0.5s ease-out;
}
```

### 6. 响应式动画

```css
@keyframes responsiveBounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-50px);
  }
}

.responsive-element {
  animation: responsiveBounce 1s ease-in-out infinite;
}

@media (max-width: 768px) {
  .responsive-element {
    animation: responsiveBounce 0.5s ease-in-out infinite;
  }
}
```

### 7. 动画事件处理

可以通过 JavaScript 监听动画事件：

```javascript
const element = document.querySelector('.animated-element');

element.addEventListener('animationstart', function() {
  console.log('动画开始');
});

element.addEventListener('animationend', function() {
  console.log('动画结束');
});

element.addEventListener('animationiteration', function() {
  console.log('动画重复');
});
```

CSS3 动画为网页提供了丰富的交互效果，合理使用可以大大提升用户体验。需要注意的是，在实现动画时要关注性能，优先使用 `transform` 和 `opacity` 属性，避免触发布局重排。