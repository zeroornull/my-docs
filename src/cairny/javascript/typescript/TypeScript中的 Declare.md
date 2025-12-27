---
title: TypeScript中的 Declare
---

在 TypeScript 中，`declare` 关键字用于声明类型定义，它告诉编译器某个变量、函数、类或其他实体在运行时是存在的，但不需要 TypeScript 编译器生成实际的 JavaScript 代码。这在处理第三方库、全局变量或环境声明时非常有用。

## 主要用途

### 1. 声明全局变量

当你需要使用全局变量但 TypeScript 不知道它们存在时：

```typescript
// 声明全局变量
declare var jQuery: (selector: string) => any;
declare const MY_GLOBAL_CONSTANT: string;

// 现在可以安全使用这些变量，TypeScript 不会报错
jQuery('#myElement');
console.log(MY_GLOBAL_CONSTANT);
```

### 2. 声明全局函数

```typescript
// 声明全局函数
declare function greet(name: string): void;

// 使用函数
greet("World"); // TypeScript 知道这个函数的签名
```

### 3. 声明全局类

```typescript
// 声明全局类
declare class MyExternalLibrary {
  constructor(name: string);
  doSomething(): void;
  getValue(): string;
}

// 使用类
const instance = new MyExternalLibrary("test");
instance.doSomething();
```

### 4. 声明模块

当使用没有类型定义的第三方库时：

```typescript
// 声明模块
declare module 'my-third-party-library' {
  export function doSomething(): void;
  export const version: string;
}

// 使用模块
import { doSomething, version } from 'my-third-party-library';
```

### 5. 扩展现有类型（Declaration Merging）

```typescript
// 扩展 Window 接口
interface Window {
  myCustomProperty: string;
  myCustomFunction(): void;
}

// 现在可以在 window 对象上使用自定义属性
window.myCustomProperty = "Hello";
window.myCustomFunction = () => console.log("Custom function");
```

## 常见应用场景

### 1. 处理 CDN 引入的库

```html
<!-- 在 HTML 中通过 CDN 引入 -->
<script src="https://cdn.example.com/some-library.js"></script>
```

```typescript
// 在 TypeScript 中声明
declare const SomeLibrary: {
  init(): void;
  doSomething(param: string): number;
};

// 使用库
SomeLibrary.init();
const result = SomeLibrary.doSomething("test");
```

### 2. 声明环境变量

```typescript
// 声明 Node.js 环境变量
declare const process: {
  env: {
    NODE_ENV: 'development' | 'production' | 'test';
    [key: string]: string | undefined;
  };
};

// 使用环境变量
if (process.env.NODE_ENV === 'development') {
  console.log('Running in development mode');
}
```

### 3. 声明命名空间

```typescript
// 声明命名空间
declare namespace MyNamespace {
  function log(message: string): void;
  const version: string;
  
  interface Config {
    debug: boolean;
    timeout: number;
  }
}

// 使用命名空间
MyNamespace.log("Hello");
console.log(MyNamespace.version);
```

### 4. 声明文件模块

```typescript
// 声明文件模块
declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// 现在可以导入这些文件
import logo from './logo.png';
import styles from './app.css';
```

## 与普通声明的区别

```typescript
// 普通声明 - 会生成 JavaScript 代码
const myVar: string = "Hello";

// 声明 - 不会生成 JavaScript 代码，只是告诉编译器存在这个变量
declare const myVar: string;
```

## 声明文件 (.d.ts)

通常将 `declare` 语句放在 `.d.ts` 文件中：

```typescript
// types/global.d.ts
declare global {
  interface Window {
    MyApp: {
      version: string;
      init(): void;
    };
  }
}

export {}; // 让文件成为模块
```

## 实际示例：为第三方库创建声明

```typescript
// 假设有一个简单的第三方库 simple-lib.js
// declare module 'simple-lib' {
//   export function add(a: number, b: number): number;
//   export function subtract(a: number, b: number): number;
//   export const PI: number;
// }

// 使用
import { add, subtract, PI } from 'simple-lib';

const sum = add(2, 3); // TypeScript 知道返回 number
const diff = subtract(5, 2);
console.log(PI); // TypeScript 知道这是 number 类型
```

## 总结

`declare` 关键字的主要作用是：

1. **类型声明**：告诉编译器某些变量或函数存在
2. **避免编译错误**：在使用外部库或全局变量时不报错
3. **提供类型信息**：为编译器提供类型检查所需的信息
4. **不生成代码**：只在编译时使用，不会生成实际的 JavaScript 代码

这是 TypeScript 与 JavaScript 生态系统集成的重要机制，特别是在使用没有类型定义的库时非常有用。