---
title: CSS 预编语言的理解，以及它们之间的区别
---

## CSS 预编译语言的理解及区别

### 1. 什么是 CSS 预编译语言

CSS 预编译语言是对 CSS 的扩展，添加了变量、嵌套、混合（Mixins）、函数等编程特性，让 CSS 的编写更加灵活和可维护。

**主要优势：**
- 提高代码复用性
- 增强可维护性
- 支持模块化开发
- 提供编程能力（变量、函数、条件语句等）
- 更好的代码组织结构

### 2. 主流 CSS 预编译语言

#### Sass (Syntactically Awesome Style Sheets)

Sass 有两种语法格式：
1. **SCSS** (Sassy CSS) - 与 CSS 语法兼容
2. **Sass** (缩进语法) - 使用缩进而非大括号

##### SCSS 示例：
```scss
// 变量
$primary-color: #3498db;
$font-size: 16px;

// 嵌套
.navbar {
  background-color: $primary-color;
  
  ul {
    margin: 0;
    padding: 0;
    
    li {
      list-style: none;
      
      a {
        color: white;
        text-decoration: none;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}

// Mixin
@mixin button-style($bg-color, $text-color: white) {
  background-color: $bg-color;
  color: $text-color;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
}

.primary-button {
  @include button-style($primary-color);
}

// 函数
@function calculate-rem($size) {
  @return $size / 16px * 1rem;
}

.text {
  font-size: calculate-rem(18px);
}
```

#### Less (Leaner Style Sheets)

Less 是另一种流行的 CSS 预处理器，语法与 CSS 更加相似。

##### Less 示例：
```less
// 变量
@primary-color: #3498db;
@font-size: 16px;

// 嵌套
.navbar {
  background-color: @primary-color;
  
  ul {
    margin: 0;
    padding: 0;
    
    li {
      list-style: none;
      
      a {
        color: white;
        text-decoration: none;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}

// Mixin
.button-style(@bg-color, @text-color: white) {
  background-color: @bg-color;
  color: @text-color;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
}

.primary-button {
  .button-style(@primary-color);
}

// 函数
.average(@a, @b) {
  @result: ((@a + @b) / 2);
}

.div {
  .average(16px, 24px);
  padding: @result;
}
```

#### Stylus

Stylus 是 Node.js 社区开发的 CSS 预处理器，语法更加灵活。

##### Stylus 示例：
```stylus
// 变量（不需要前缀）
primary-color = #3498db
font-size = 16px

// 嵌套
.navbar
  background-color: primary-color
  
  ul
    margin: 0
    padding: 0
    
    li
      list-style: none
      
      a
        color: white
        text-decoration: none
        
        &:hover
          text-decoration: underline

// Mixin
button-style(bg-color, text-color = white)
  background-color: bg-color
  color: text-color
  padding: 10px 20px
  border: none
  border-radius: 4px

.primary-button
  button-style(primary-color)

// 函数
calculate-rem(size)
  (size / 16px) * 1rem

.text
  font-size: calculate-rem(18px)
```

### 3. 三大预处理器详细对比

#### 语法差异对比表：

| 特性 | Sass/SCSS | Less | Stylus |
|------|-----------|------|--------|
| 变量声明 | `$var: value` | `@var: value` | `var = value` |
| 嵌套 | ✅ | ✅ | ✅ |
| Mixin | `@mixin` / `@include` | `.mixin()` | `mixin()` |
| 继承 | `@extend` | 不支持 | `@extend` |
| 条件语句 | `@if` / `@else` | `when` | `if` / `unless` |
| 循环 | `@for` / `@each` / `@while` | `each` / `for` | `for` / `while` |
| 函数 | `@function` | `@function` | 内置函数丰富 |
| 导入 | `@import` | `@import` | `@import` |

#### 功能特性对比：

```scss
// Sass 的强大功能示例
$colors: (
  primary: #3498db,
  secondary: #2ecc71,
  danger: #e74c3c
);

// 遍历 map
@each $name, $color in $colors {
  .btn-#{$name} {
    background-color: $color;
  }
}

// 条件语句
$theme: 'dark';

@if $theme == 'dark' {
  body {
    background-color: #333;
    color: white;
  }
} @else {
  body {
    background-color: white;
    color: #333;
  }
}
```

```less
// Less 的功能示例
@colors: {
  primary: #3498db;
  secondary: #2ecc71;
  danger: #e74c3c;
}

// Less 3.0+ 支持循环
.loop-colors(@i: 1) when (@i <= length(@colors)) {
  @key: extract(@colors, @i);
  .btn-@{key} {
    background-color: @key;
  }
  .loop-colors(@i + 1);
}

.loop-colors();
```

### 4. 编译和使用

#### Sass 编译：
```bash
# 安装
npm install -g sass

# 编译
sass input.scss output.css

# 监听文件变化
sass --watch input.scss output.css
```

#### Less 编译：
```bash
# 安装
npm install -g less

# 编译
lessc input.less output.css

# 监听文件变化
lessc input.less output.css --watch
```

#### Stylus 编译：
```bash
# 安装
npm install -g stylus

# 编译
stylus input.styl output.css

# 监听文件变化
stylus -w input.styl output.css
```

### 5. 实际项目应用示例

#### 使用 Sass 构建主题系统：

```scss
// _variables.scss
$themes: (
  light: (
    bg-color: #ffffff,
    text-color: #333333,
    accent-color: #3498db
  ),
  dark: (
    bg-color: #333333,
    text-color: #ffffff,
    accent-color: #2980b9
  )
);

// _mixins.scss
@mixin theme-styles($theme) {
  @each $name, $value in map-get($themes, $theme) {
    --#{$name}: #{$value};
  }
}

// styles.scss
.theme-light {
  @include theme-styles(light);
}

.theme-dark {
  @include theme-styles(dark);
}

.component {
  background-color: var(--bg-color);
  color: var(--text-color);
}
```

### 6. 选择建议

#### 选择 Sass/SCSS 的场景：
- 大型项目需要强类型和严格结构
- 团队熟悉 CSS 语法
- 需要丰富的生态系统和社区支持
- 要求严格的代码规范

#### 选择 Less 的场景：
- 项目相对简单
- 团队希望语法尽可能接近 CSS
- 需要快速上手
- Bootstrap 等框架使用 Less

#### 选择 Stylus 的场景：
- 喜欢简洁灵活的语法
- Node.js 项目环境
- 需要高度自定义的样式系统
- 对编译速度有要求

### 7. 现代 CSS 与预处理器

随着 CSS 的发展，原生 CSS 也增加了许多预处理器的特性：

```css
/* CSS 自定义属性（变量） */
:root {
  --primary-color: #3498db;
  --font-size: 16px;
}

.button {
  background-color: var(--primary-color);
}

/* CSS 嵌套（实验性） */
.container {
  color: blue;
  
  & .header {
    font-size: 1.5em;
  }
  
  & .footer {
    font-size: 0.8em;
  }
}
```

尽管如此，预处理器仍然在复杂项目中发挥重要作用，提供更强大的功能和更好的开发体验。选择哪种预处理器主要取决于团队偏好、项目需求和生态系统支持。