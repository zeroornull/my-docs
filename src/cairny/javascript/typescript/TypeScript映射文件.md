---
title: TypeScript映射文件
---

TypeScript 映射文件（Source Map）是一种将编译后的 JavaScript 代码映射回原始 TypeScript 代码的机制。它使得开发者可以在浏览器或其他调试工具中直接调试 TypeScript 源代码，而不是编译后的 JavaScript 代码。

## 基本概念

Source Map 是一个 JSON 文件，包含了编译后代码与源代码之间的映射关系。它记录了每一行、每一列在编译前后的对应关系，使调试工具能够准确地将运行时错误和断点映射到原始源代码位置。

## 工作原理

### 1. 编译过程中的映射生成

当 TypeScript 编译器将 `.ts` 文件编译为 `.js` 文件时，如果启用了 source map 选项，会同时生成一个 `.js.map` 文件：

```typescript
// example.ts
class Greeter {
  greeting: string;
  
  constructor(message: string) {
    this.greeting = message;
  }
  
  greet(): string {
    return `Hello, ${this.greeting}`;
  }
}

const greeter = new Greeter("World");
console.log(greeter.greet());
```

编译后生成：

```javascript
// example.js
var Greeter = /** @class */ (function () {
    function Greeter(message) {
        this.greeting = message;
    }
    Greeter.prototype.greet = function () {
        return "Hello, " + this.greeting;
    };
    return Greeter;
}());
var greeter = new Greeter("World");
console.log(greeter.greet());
//# sourceMappingURL=example.js.map
```

### 2. Source Map 文件结构

```json
// example.js.map
{
  "version": 3,
  "file": "example.js",
  "sourceRoot": "",
  "sources": ["example.ts"],
  "names": [],
  "mappings": "AAAA,IA...（编码的映射数据）"
}
```

## 配置选项

在 `tsconfig.json` 中可以配置 source map 相关选项：

```json
{
  "compilerOptions": {
    "sourceMap": true,           // 生成 source map 文件
    "inlineSourceMap": false,    // 内联 source map 到 js 文件
    "inlineSources": false,      // 内联源代码到 source map 文件
    "mapRoot": "./sourcemaps",   // source map 文件的根路径
    "sourceRoot": "./src"        // 源文件的根路径
  }
}
```

### 主要配置项说明

1. **sourceMap**: 启用 source map 生成
2. **inlineSourceMap**: 将 source map 数据内联到生成的 `.js` 文件中
3. **inlineSources**: 将原始 TypeScript 源代码包含在 `.map` 文件中
4. **mapRoot**: 指定 source map 文件的位置
5. **sourceRoot**: 指定源文件的位置

## 不同的 Source Map 配置示例

### 1. 标准 Source Map

```json
{
  "compilerOptions": {
    "sourceMap": true
  }
}
```

生成文件：
- `example.js`
- `example.js.map`

### 2. 内联 Source Map

```json
{
  "compilerOptions": {
    "inlineSourceMap": true
  }
}
```

生成文件：
- `example.js`（包含内联的 source map 数据）

### 3. 内联源代码

```json
{
  "compilerOptions": {
    "sourceMap": true,
    "inlineSources": true
  }
}
```

生成的 `.map` 文件会包含原始源代码：

```json
{
  "version": 3,
  "file": "example.js",
  "sources": ["example.ts"],
  "sourcesContent": [
    "class Greeter {\n  greeting: string;\n  \n  constructor(message: string) {\n    this.greeting = message;\n  }\n  \n  greet(): string {\n    return `Hello, ${this.greeting}`;\n  }\n}\n\nconst greeter = new Greeter(\"World\");\nconsole.log(greeter.greet());"
  ],
  "mappings": "AAAA,IA..."
}
```

## 实际使用场景

### 1. 浏览器调试

启用 source map 后，在浏览器开发者工具中：

```typescript
// math.ts
export function add(a: number, b: number): number {
  debugger; // 断点会正确定位到这行 TypeScript 代码
  return a + b;
}

export function multiply(a: number, b: number): number {
  return a * b; // 错误会映射到这行 TypeScript 代码
}
```

在浏览器中，你可以：
- 在 TypeScript 源代码中设置断点
- 查看调用堆栈时显示 TypeScript 文件名和行号
- 查看变量时显示 TypeScript 中的变量名

### 2. 错误追踪

当运行时发生错误时，错误堆栈会显示 TypeScript 文件信息：

```typescript
// utils.ts
export function divide(a: number, b: number): number {
  if (b === 0) {
    throw new Error("Division by zero"); // 错误会映射到这行
  }
  return a / b;
}
```

错误堆栈会显示：
```
Error: Division by zero
    at divide (utils.ts:3:11)
```

而不是编译后的 JavaScript 位置。

### 3. Node.js 环境调试

在 Node.js 中使用 source map：

```bash
# 安装 source map 支持
npm install source-map-support

# 在应用入口启用
node -r source-map-support/register app.js
```

或者在代码中启用：

```javascript
// app.js
require('source-map-support').install();

// 你的应用代码
```

## 高级用法

### 1. 复杂项目结构

对于包含多个源目录的项目：

```json
{
  "compilerOptions": {
    "sourceMap": true,
    "rootDir": "./src",
    "outDir": "./dist",
    "sourceRoot": "./src"
  },
  "include": ["src/**/*"]
}
```

### 2. 与构建工具集成

#### Webpack 配置

```javascript
// webpack.config.js
module.exports = {
  devtool: 'source-map', // 或 'inline-source-map', 'cheap-module-source-map' 等
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: path.resolve(__dirname, 'tsconfig.json'),
          }
        },
        exclude: /node_modules/,
      }
    ]
  }
};
```

#### Rollup 配置

```javascript
// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs',
    sourcemap: true // 启用 source map
  },
  plugins: [
    typescript(),
    terser({
      sourcemap: true // 保持 source map
    })
  ]
};
```

## Source Map 格式详解

Source Map v3 格式包含以下主要字段：

```json
{
  "version": 3,
  "file": "compiled.js",
  "sourceRoot": "",
  "sources": ["source.ts"],
  "sourcesContent": ["/* 源代码内容 */"],
  "names": ["variableName"],
  "mappings": "AAAA,IAA..."
}
```

- **version**: Source Map 版本号
- **file**: 生成的文件名
- **sourceRoot**: 源文件根路径
- **sources**: 源文件列表
- **sourcesContent**: 源文件内容（可选）
- **names**: 符号名称列表
- **mappings**: 编码的映射数据

## 最佳实践

### 1. 开发环境

```json
{
  "compilerOptions": {
    "sourceMap": true,
    "inlineSources": true
  }
}
```

### 2. 生产环境

```json
{
  "compilerOptions": {
    "sourceMap": false // 减少文件大小
  }
}
```

或者：

```json
{
  "compilerOptions": {
    "sourceMap": true,
    "inlineSources": false // 不包含源代码以保护隐私
  }
}
```

### 3. 库开发

```json
{
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true, // 为 .d.ts 文件生成 source map
    "sourceMap": true
  }
}
```

## 总结

TypeScript Source Map 的主要作用和优势：

1. **调试友好**：可以在原始 TypeScript 代码中调试
2. **错误定位**：运行时错误指向源代码位置
3. **开发效率**：提升开发和调试体验
4. **工具支持**：现代浏览器和编辑器都支持
5. **灵活性**：多种配置选项适应不同场景

Source Map 是现代前端开发中不可或缺的工具，它让开发者能够享受 TypeScript 的类型安全优势，同时保持良好的调试体验。