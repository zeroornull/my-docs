---
title: TypeScript中有哪些声明变量
---

## TypeScript 中声明变量的方式

TypeScript 继承了 JavaScript 的变量声明方式，并添加了类型注解功能。主要有以下几种声明变量的方式：

### 1. var 声明

这是 JavaScript 传统的方式，但在现代 TypeScript 中不推荐使用。

```typescript
var x = 10;
var name: string = "Alice";
```

**问题**：
- 作用域问题（函数作用域而非块级作用域）
- 变量提升可能导致意外行为
- 可以重复声明

### 2. let 声明

ES6 引入的块级作用域声明方式，是现代 TypeScript 推荐的方式。

```typescript
let x = 10;
let name: string = "Alice";

// 块级作用域示例
function example() {
    if (true) {
        let blockScoped = "只在 if 块中有效";
    }
    // console.log(blockScoped); // 错误：无法访问
}
```

### 3. const 声明

用于声明常量，值不能被重新赋值。

```typescript
const PI = 3.14159;
const user: { name: string } = { name: "Bob" };

// PI = 3.14; // 错误：不能重新赋值常量
user.name = "Alice"; // 正确：可以修改对象属性
```

### 4. 类型注解 vs 类型推断

#### 显式类型注解：

```typescript
let name: string = "Alice";
let age: number = 30;
let isActive: boolean = true;
let hobbies: string[] = ["reading", "swimming"];
let user: { name: string; age: number } = {
    name: "Bob",
    age: 25
};
```

#### 类型推断（推荐）：

```typescript
let name = "Alice";        // 推断为 string
let age = 30;              // 推断为 number
let isActive = true;       // 推断为 boolean
let hobbies = ["reading", "swimming"]; // 推断为 string[]
```

### 5. 不同数据类型的声明示例

#### 基本类型：

```typescript
// string
let firstName: string = "John";
let lastName = "Doe"; // 类型推断

// number
let decimal: number = 6;
let hex: number = 0xf00d;
let binary: number = 0b1010;
let octal: number = 0o744;

// boolean
let isDone: boolean = false;

// bigint (ES2020)
let bigNumber: bigint = 100n;

// symbol
let sym: symbol = Symbol("key");

// null 和 undefined
let u: undefined = undefined;
let n: null = null;
```

#### 复杂类型：

```typescript
// array
let list1: number[] = [1, 2, 3];
let list2: Array<number> = [1, 2, 3];
let list3: (number | string)[] = [1, "two", 3]; // 联合类型数组

// tuple（元组）
let tuple: [string, number] = ["hello", 10];
let complexTuple: [string, number, boolean?] = ["world", 20]; // 可选元素

// enum
enum Color { Red, Green, Blue }
let c: Color = Color.Green;

enum Direction { Up = "UP", Down = "DOWN", Left = "LEFT", Right = "RIGHT" }
let dir: Direction = Direction.Up;

// any（避免使用）
let notSure: any = 4;
notSure = "maybe a string instead";
notSure = false;

// unknown（更安全的 any 替代）
let value: unknown = 4;
value = "hello"; // 正确
// let valStr: string = value; // 错误：不能将 unknown 赋值给 string

// void
function warnUser(): void {
    console.log("This is my warning message");
}

// never
function error(message: string): never {
    throw new Error(message);
}

// object
let obj: object = { name: "Alice" };
let obj2: { name: string; age: number } = { name: "Bob", age: 30 };

// Function
let myFunc: Function = () => console.log("Hello");
let myTypedFunc: () => void = () => console.log("Hello");
```

### 6. 解构声明

```typescript
// 数组解构
let [first, second] = [1, 2];
let [head, ...tail] = [1, 2, 3, 4];

// 对象解构
let { name, age } = { name: "Alice", age: 30 };
let { name: userName, age: userAge }: { name: string; age: number } = 
    { name: "Bob", age: 25 };

// 解构带默认值
let [x, y = 10] = [1];
let { a, b = 20 } = { a: 1 };
```

### 7. 联合类型和交叉类型

```typescript
// 联合类型
let value: string | number = "hello";
value = 42; // 正确

// 交叉类型
interface Person {
    name: string;
}

interface Serializable {
    serialize(): string;
}

let obj: Person & Serializable = {
    name: "Alice",
    serialize() {
        return JSON.stringify(this);
    }
};
```

### 8. 字面量类型

```typescript
// 字符串字面量类型
let direction: "up" | "down" | "left" | "right" = "up";

// 数字字面量类型
let diceRoll: 1 | 2 | 3 | 4 | 5 | 6 = 1;

// 布尔字面量类型
let isTrue: true = true;
```

### 9. 类型别名

```typescript
type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;

let userName: Name = "Alice";
let resolver: NameResolver = () => "Bob";
```

### 10. 接口声明

```typescript
interface User {
    name: string;
    age: number;
    email?: string; // 可选属性
}

let user: User = {
    name: "Alice",
    age: 30
};
```

### 最佳实践建议

1. **优先使用 `let` 和 `const`**：避免使用 `var`
2. **优先使用 `const`**：对于不会重新赋值的变量
3. **依赖类型推断**：除非必要，否则不要显式声明类型
4. **使用具体类型而非 `any`**：提高类型安全性
5. **合理使用联合类型**：处理多种可能的值类型

```typescript
// 推荐的声明方式
const userName = "Alice";           // 字符串字面量推断
let userAge = 30;                   // number 类型推断
const hobbies = ["reading", "swimming"]; // string[] 类型推断

// 需要显式声明的情况
let userData: User | null = null;   // 联合类型
const config: AppConfig = {         // 复杂对象类型
    apiUrl: "https://api.example.com",
    timeout: 5000
};
```

这些声明方式让 TypeScript 既保持了 JavaScript 的灵活性，又提供了强类型系统的安全保障。