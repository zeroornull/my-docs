---
title: TypeScript 的主要特点
---

TypeScript 是 JavaScript 的超集，添加了静态类型系统和其他高级特性。以下是 TypeScript 的主要特点：

## 1. 静态类型系统

TypeScript 最核心的特点是提供了静态类型检查，可以在编译时发现类型错误。

```typescript
// 类型注解
let message: string = "Hello World";
let count: number = 42;
let isActive: boolean = true;

// 函数参数和返回值类型
function add(a: number, b: number): number {
  return a + b;
}

// 错误会在编译时被发现
// add("1", "2"); // 编译错误：参数类型不匹配
```

## 2. 类型推断

TypeScript 可以自动推断变量类型，减少显式类型注解的需要。

```typescript
let numbers = [1, 2, 3]; // 推断为 number[]
let person = {
  name: "Alice",
  age: 30
}; // 推断为 { name: string; age: number }

// 函数返回值类型推断
function greet(name: string) {
  return `Hello, ${name}!`; // 推断为 string
}
```

## 3. 接口（Interfaces）

接口用于定义对象的结构，提供契约保证。

```typescript
interface User {
  id: number;
  name: string;
  email?: string; // 可选属性
  readonly createdAt: Date; // 只读属性
}

function printUser(user: User) {
  console.log(`${user.name} (${user.id})`);
  // user.createdAt = new Date(); // 错误：只读属性不能修改
}
```

## 4. 类和面向对象编程

TypeScript 支持类、继承、访问修饰符等面向对象特性。

```typescript
class Animal {
  protected name: string;
  
  constructor(name: string) {
    this.name = name;
  }
  
  move(distance: number = 0): void {
    console.log(`${this.name} moved ${distance}m.`);
  }
}

class Dog extends Animal {
  private breed: string;
  
  constructor(name: string, breed: string) {
    super(name);
    this.breed = breed;
  }
  
  bark(): void {
    console.log("Woof! Woof!");
  }
  
  move(distance: number = 5): void {
    console.log(`${this.name} runs ${distance}m.`);
  }
}
```

## 5. 泛型（Generics）

泛型提供了创建可重用组件的能力，同时保持类型安全。

```typescript
// 泛型函数
function identity<T>(arg: T): T {
  return arg;
}

let output1 = identity<string>("hello");
let output2 = identity<number>(42);

// 泛型接口
interface GenericIdentityFn<T> {
  (arg: T): T;
}

// 泛型类
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}
```

## 6. 联合类型和交叉类型

TypeScript 支持复杂的类型组合。

```typescript
// 联合类型
let value: string | number;
value = "hello"; // OK
value = 42;      // OK

// 交叉类型
interface Identifiable {
  id: number;
}

interface Timestamped {
  createdAt: Date;
}

type Model = Identifiable & Timestamped;

const model: Model = {
  id: 1,
  createdAt: new Date()
};
```

## 7. 类型守卫和类型谓词

提供运行时类型检查的能力。

```typescript
// typeof 类型守卫
function padLeft(value: string, padding: string | number) {
  if (typeof padding === "number") {
    return " ".repeat(padding) + value;
  }
  if (typeof padding === "string") {
    return padding + value;
  }
  throw new Error(`Expected string or number, got '${padding}'.`);
}

// 自定义类型谓词
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
```

## 8. 装饰器（Decorators）

实验性特性，用于注解或修改类和类成员。

```typescript
function readonly(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  descriptor.writable = false;
}

class Greeter {
  greeting: string;
  
  constructor(message: string) {
    this.greeting = message;
  }
  
  @readonly
  greet() {
    return "Hello, " + this.greeting;
  }
}
```

## 9. 模块系统

支持 ES6 模块和 CommonJS 模块。

```typescript
// math.ts
export const PI = 3.14159;
export function add(a: number, b: number): number {
  return a + b;
}

// 默认导出
export default class Calculator {
  // ...
}

// 使用
import { PI, add } from './math';
import Calculator from './math';
```

## 10. 命名空间（Namespaces）

组织代码的另一种方式（推荐使用模块）。

```typescript
namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean;
  }
  
  const lettersRegexp = /^[A-Za-z]+$/;
  
  export class LettersOnlyValidator implements StringValidator {
    isAcceptable(s: string) {
      return lettersRegexp.test(s);
    }
  }
}
```

## 11. 高级类型特性

### 映射类型
```typescript
type Partial<T> = {
  [P in keyof T]?: T[P];
};

type Required<T> = {
  [P in keyof T]-?: T[P];
};
```

### 条件类型
```typescript
type NonNullable<T> = T extends null | undefined ? never : T;

type MyType<T> = T extends string ? string : number;
```

## 12. 与 JavaScript 的兼容性

- TypeScript 是 JavaScript 的超集，所有 JavaScript 代码都是有效的 TypeScript 代码
- 可以逐步迁移现有 JavaScript 项目
- 支持最新的 ECMAScript 特性

## 13. 编译时配置

通过 `tsconfig.json` 文件可以灵活配置编译选项：

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true
  }
}
```

## 14. 丰富的工具支持

- 智能代码补全
- 实时错误检查
- 重构支持
- 跳转到定义
- 查找所有引用

## 总结

TypeScript 的主要优势包括：

1. **类型安全**：在编译时捕获错误
2. **更好的开发体验**：IDE 支持和智能提示
3. **可维护性**：大型项目的结构化开发
4. **渐进式采用**：可以逐步迁移到 TypeScript
5. **生态系统兼容**：与现有 JavaScript 生态系统完全兼容
6. **现代 JavaScript 特性**：支持最新的 ECMAScript 特性

这些特点使得 TypeScript 成为开发大型、复杂前端应用的理想选择。