---
title: 一台设备的dpr，是否是可变的
---

设备的 `dpr`（devicePixelRatio）通常情况下是**固定的**，但在某些特定场景下可能会发生变化。

## 基本情况

- **物理特性决定**：`dpr` 主要由设备的物理像素和逻辑像素比例决定，对于大多数设备来说这是一个固定值
- **设备出厂时确定**：例如 iPhone 的 Retina 屏幕具有固定的 `dpr` 值（如 2 或 3）

## 可能变化的场景

### 1. 用户缩放设置
```javascript
// 用户改变显示缩放比例时可能影响 dpr
window.devicePixelRatio // 可能在某些情况下发生变化
```

### 2. 浏览器缩放
- 当用户在浏览器中进行页面缩放时，可能会影响 `window.devicePixelRatio` 的值
- 不同浏览器对此的处理方式可能不同

### 3. 动态监听变化
```javascript
// 可以监听 dpr 的变化
const mediaQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
mediaQuery.addEventListener('change', (e) => {
    console.log('DPR changed:', window.devicePixelRatio);
});
```

## 总结

虽然理论上 `dpr` 是设备的固有属性，但在实际使用中可能会因为用户设置、浏览器行为或系统调整而发生改变，因此在开发中应该动态获取而不是假设它是固定值。
