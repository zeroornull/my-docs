---
title: animation、transition、 transform 有什么区别
---

## CSS 动画属性详解

### 1. `transform` - 变换属性

`transform` 用于对元素进行**空间变换**，包括平移、旋转、缩放、倾斜等操作，它本身不产生动画效果，只是改变元素的外观和位置。

```css
.transform-example {
  /* 平移 */
  transform: translate(50px, 30px);
  
  /* 旋转 */
  transform: rotate(45deg);
  
  /* 缩放 */
  transform: scale(1.5);
  
  /* 倾斜 */
  transform: skew(30deg);
  
  /* 组合变换 */
  transform: translate(20px, 10px) rotate(30deg) scale(1.2);
}
```

### 2. `transition` - 过渡效果

`transition` 用于在**两个状态之间创建平滑过渡**，需要触发条件（如:hover）才会生效，适用于简单的状态切换动画。

```css
.transition-example {
  width: 100px;
  height: 100px;
  background-color: blue;
  /* 定义过渡效果 */
  transition: all 0.3s ease-in-out;
}

.transition-example:hover {
  width: 150px;
  height: 150px;
  background-color: red;
  transform: rotate(45deg);
}
```

**特点：**
- 需要触发条件（如:hover、:focus或JS改变样式）
- 只能定义开始和结束两个状态
- 适用于简单的状态切换

### 3. `animation` - 关键帧动画

`animation` 通过 `@keyframes` 规则可以创建**复杂的多阶段动画**，可以自动播放，无需触发条件。

```css
/* 定义关键帧动画 */
@keyframes slide-and-fade {
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  50% {
    transform: translateX(100px);
    opacity: 0.5;
  }
  100% {
    transform: translateX(200px);
    opacity: 1;
  }
}

.animation-example {
  width: 100px;
  height: 100px;
  background-color: green;
  /* 应用动画 */
  animation: slide-and-fade 2s infinite alternate;
}
```

**特点：**
- 可以自动播放
- 支持多个关键帧，可以定义复杂动画路径
- 可以控制播放次数、方向、延迟等

### 三者关系总结

```css
/* 综合示例：结合使用三个属性 */
.combined-example {
  width: 50px;
  height: 50px;
  background-color: purple;
  /* 使用transform进行初始变换 */
  transform: rotate(0deg);
  
  /* 使用transition定义hover时的过渡 */
  transition: all 0.5s ease;
}

.combined-example:hover {
  /* hover时改变transform */
  transform: rotate(180deg) scale(1.5);
  background-color: orange;
}

/* 独立的animation动画 */
.animated-element {
  width: 50px;
  height: 50px;
  background-color: teal;
  /* animation中通常会使用transform */
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-50px);
  }
}
```

### 核心区别对比

| 属性 | 作用 | 是否产生动画 | 触发方式 | 复杂度 |
|------|------|-------------|----------|--------|
| `transform` | 对元素进行空间变换 | 否 | 直接应用 | 简单 |
| `transition` | 在两个状态间创建过渡 | 是（需要触发） | 需要状态改变 | 简单 |
| `animation` | 创建复杂的关键帧动画 | 是（自动播放） | 自动或通过控制 | 复杂 |

**实际应用建议：**
- 仅需改变元素外观时使用 `transform`
- 简单的状态切换动画使用 `transition`
- 复杂的自动播放动画使用 `animation`