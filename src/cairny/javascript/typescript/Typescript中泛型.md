---
title: Typescript中泛型
---

## TypeScript 中的泛型 (Generics)

### 什么是泛型？

泛型（Generics）是 TypeScript 中一种创建可重用组件的工具，它允许我们在定义函数、接口或类时不预先指定具体的类型，而在使用时再指定类型。泛型提供了在编译时确保类型安全的方法，同时保持了代码的灵活性和可重用性。

### 泛型的基本语法

使用 `<T>` 语法来定义泛型，其中 `T` 是类型变量（可以是任何标识符，但 `T` 是约定俗成的）。

### 泛型的使用场景

#### 1. 泛型函数

**没有泛型的问题**：
```javascript
// JavaScript 风格 - 类型不安全
function identity(arg) {
    return arg;
}

let result = identity("hello"); // result 的类型是 any
```

**使用泛型解决**：
```typescript
// 泛型函数
function identity<T>(arg: T): T {
    return arg;
}

// 使用方式1：显式指定类型
let output1 = identity<string>("hello");

// 使用方式2：类型推断（推荐）
let output2 = identity("hello"); // TypeScript 自动推断为 string 类型
```

#### 2. 泛型接口

```typescript
// 定义泛型接口
interface GenericIdentityFn<T> {
    (arg: T): T;
}

// 使用泛型接口
function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: GenericIdentityFn<number> = identity;
```

#### 3. 泛型类

```typescript
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
    
    constructor(zeroValue: T, addFn: (x: T, y: T) => T) {
        this.zeroValue = zeroValue;
        this.add = addFn;
    }
}

// 使用数字类型
let myGenericNumber = new GenericNumber<number>(
    0,
    (x, y) => x + y
);

// 使用字符串类型
let stringNumeric = new GenericNumber<string>(
    "",
    (x, y) => x + y
);
```

#### 4. 泛型约束

使用 `extends` 关键字来约束泛型类型：

```typescript
// 约束泛型必须有 length 属性
interface Lengthwise {
    length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length); // 现在可以安全地访问 length 属性
    return arg;
}

// 正确使用
loggingIdentity("hello"); // string 有 length 属性
loggingIdentity([1, 2, 3]); // array 有 length 属性

// 错误使用
loggingIdentity(3); // 错误：number 没有 length 属性
```

#### 5. 在泛型约束中使用类型参数

```typescript
// 约束一个类型参数是另一个类型参数的属性
function getProperty<T, K extends keyof T>(obj: T, key: K) {
    return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, "a"); // 正确
getProperty(x, "m"); // 错误：m 不是 x 的属性
```

### 多个泛型参数

```typescript
function swap<T, U>(tuple: [T, U]): [U, T] {
    return [tuple[1], tuple[0]];
}

let result = swap(["hello", 123]); // [number, string]
```

### 泛型的实际应用示例

#### 1. 数组操作函数

```typescript
// 泛型数组函数
function firstElement<T>(arr: T[]): T | undefined {
    return arr[0];
}

const numbers = [1, 2, 3];
const firstNumber = firstElement(numbers); // 类型为 number

const strings = ["a", "b", "c"];
const firstString = firstElement(strings); // 类型为 string
```

#### 2. API 响应处理

```typescript
interface ApiResponse<T> {
    data: T;
    status: number;
    message: string;
}

// 使用泛型定义不同类型的 API 响应
interface User {
    id: number;
    name: string;
}

interface Product {
    id: number;
    title: string;
    price: number;
}

// 可以创建特定类型的响应
type UserResponse = ApiResponse<User>;
type ProductResponse = ApiResponse<Product[]>;

// 泛型函数处理响应
async function handleApiResponse<T>(url: string): Promise<ApiResponse<T>> {
    const response = await fetch(url);
    return response.json();
}
```

#### 3. 容器类

```typescript
class Stack<T> {
    private items: T[] = [];
    
    push(item: T): void {
        this.items.push(item);
    }
    
    pop(): T | undefined {
        return this.items.pop();
    }
    
    peek(): T | undefined {
        return this.items[this.items.length - 1];
    }
    
    isEmpty(): boolean {
        return this.items.length === 0;
    }
    
    size(): number {
        return this.items.length;
    }
}

// 使用不同类型的栈
const numberStack = new Stack<number>();
numberStack.push(1);
numberStack.push(2);

const stringStack = new Stack<string>();
stringStack.push("hello");
stringStack.push("world");
```

### 泛型的高级用法

#### 1. 条件类型

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;

type A = NonNullable<string | null>; // string
type B = NonNullable<number | undefined>; // number
```

#### 2. 映射类型

```typescript
type Partial<T> = {
    [P in keyof T]?: T[P];
};

type Required<T> = {
    [P in keyof T]-?: T[P];
};

interface User {
    name: string;
    age: number;
    email?: string;
}

type PartialUser = Partial<User>; // 所有属性变为可选
type RequiredUser = Required<User>; // 所有属性变为必需
```

### 总结

泛型是 TypeScript 中一个强大的特性，它提供了：

1. **类型安全**：在编译时确保类型正确
2. **代码重用**：编写一次，适用于多种类型
3. **灵活性**：保持代码的通用性
4. **更好的工具支持**：IDE 可以提供更准确的智能提示

泛型让 TypeScript 在保持 JavaScript 灵活性的同时，提供了强类型语言的优势，是构建可维护、可扩展应用程序的重要工具。