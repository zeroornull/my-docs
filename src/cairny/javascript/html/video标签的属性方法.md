---
title: video标签的属性方法
---

## HTML `<video>` 标签详解

HTML `<video>` 标签用于在网页中嵌入视频内容，是 HTML5 中引入的重要媒体元素。

### 主要属性

#### 基础属性
- `src`: 指定视频文件的 URL 路径
- `poster`: 指定视频播放前显示的封面图片
- `preload`: 指定视频预加载方式（`auto`/`metadata`/`none`）
- `autoplay`: 布尔属性，视频就绪后是否自动播放
- `loop`: 布尔属性，视频是否循环播放
- `muted`: 布尔属性，视频是否静音
- `controls`: 布尔属性，是否显示播放控件
- `width`/`height`: 设置视频播放器的尺寸

#### 兼容性相关属性
- `crossorigin`: 设置跨域资源共享策略
- `mediagroup`: 将多个媒体元素分组
- ` playsinline`: iOS Safari 中内联播放视频

### JavaScript 属性和方法

#### 常用属性
- `videoWidth`/`videoHeight`: 视频实际宽度和高度
- `currentTime`: 当前播放位置（秒）
- `duration`: 视频总时长（秒）
- `volume`: 音量（0.0-1.0）
- `playbackRate`: 播放速度
- `paused`: 是否处于暂停状态
- `ended`: 是否播放结束

#### 重要方法
- `play()`: 开始播放或恢复播放视频
- `pause()`: 暂停视频播放
- `load()`: 重新加载视频资源
- `canPlayType()`: 检测浏览器是否支持指定格式

#### 常用事件
- `loadstart`: 开始加载视频
- `loadedmetadata`: 已加载视频元数据
- `loadeddata`: 已加载视频数据
- `canplay`: 可以开始播放
- `play`: 开始播放时触发
- `pause`: 暂停时触发
- `ended`: 播放结束时触发
- `timeupdate`: 播放时间改变时触发
- `volumechange`: 音量改变时触发

### 使用示例

```html
<video width="640" height="480" controls poster="thumbnail.jpg">
  <source src="video.mp4" type="video/mp4">
  <source src="video.webm" type="video/webm">
  您的浏览器不支持视频播放。
</video>
```

```javascript
const video = document.querySelector('video');

// 播放控制
video.play();
video.pause();

// 监听事件
video.addEventListener('timeupdate', () => {
  console.log(`当前播放时间: ${video.currentTime}`);
});
```

### 浏览器兼容性注意事项

不同浏览器支持的视频格式不同，建议提供多种格式以确保兼容性：
- MP4 (H.264 编码) - 兼容性最好
- WebM - 现代浏览器广泛支持
- OGV - 开源格式，部分浏览器支持

