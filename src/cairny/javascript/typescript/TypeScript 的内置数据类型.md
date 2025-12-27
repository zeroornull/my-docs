---
title: TypeScript 的内置数据类型
---

## TypeScript 的内置数据类型

TypeScript 继承了 JavaScript 的所有原始数据类型，并在此基础上添加了一些额外的类型。以下是 TypeScript 中的主要内置数据类型：

### 1. 基本数据类型（Primitive Types）

#### string（字符串类型）
```typescript
let firstName: string = "Alice";
let lastName = "Smith"; // 类型推断为 string
let templateString = `Hello, ${firstName}!`; // 模板字符串
```

#### number（数值类型）
```typescript
let decimal: number = 42;
let hex: number = 0xf00d;
let binary: number = 0b1010;
let octal: number = 0o744;
let float: number = 3.14159;
```

#### boolean（布尔类型）
```typescript
let isDone: boolean = false;
let isCompleted = true; // 类型推断为 boolean
```

#### bigint（大整数类型，ES2020）
```typescript
let bigNumber: bigint = 100n;
let anotherBigNumber = 200n; // 类型推断为 bigint
```

#### symbol（符号类型，ES6）
```typescript
let sym1: symbol = Symbol("key");
let sym2 = Symbol("key"); // 类型推断为 symbol
```

#### null 和 undefined
```typescript
let u: undefined = undefined;
let n: null = null;

// 在 strictNullChecks 模式下
let nullableString: string | null = null;
let optionalValue: string | undefined = undefined;
```

### 2. 复杂数据类型（Complex Types）

#### array（数组类型）
```typescript
// 两种语法形式
let list1: number[] = [1, 2, 3];
let list2: Array<number> = [1, 2, 3];

// 联合类型数组
let mixedList: (string | number)[] = ["hello", 42, "world"];

// 只读数组
let readonlyList: readonly number[] = [1, 2, 3];
```

#### tuple（元组类型）
```typescript
// 基本元组
let tuple: [string, number] = ["hello", 10];

// 可选元素元组
let optionalTuple: [string, number?] = ["hello"];
let optionalTuple2: [string, number?] = ["hello", 42];

// 剩余元素元组
let restTuple: [string, ...number[]] = ["hello", 1, 2, 3, 4];

// 带标签的元组（TypeScript 4.0+）
type LabeledTuple = [name: string, age: number];
let person: LabeledTuple = ["Alice", 30];
```

#### enum（枚举类型）
```typescript
// 数字枚举
enum Direction {
    Up,    // 0
    Down,  // 1
    Left,  // 2
    Right  // 3
}

// 字符串枚举
enum HttpStatus {
    OK = "200",
    NotFound = "404",
    Error = "500"
}

// 异构枚举（不推荐）
enum MixedEnum {
    No = 0,
    Yes = "YES"
}

// 常量枚举
const enum Color {
    Red,
    Green,
    Blue
}
```

#### object（对象类型）
```typescript
// object 类型（表示非原始类型）
let obj: object = { name: "Alice" };

// 具体对象类型
let person: { name: string; age: number } = {
    name: "Bob",
    age: 25
};

// 空对象类型
let empty: {} = {};
```

#### void（无返回值类型）
```typescript
function warnUser(): void {
    console.log("This is my warning message");
}

let unusable: void = undefined; // void 类型只能赋值 undefined 或 null
```

#### never（永不返回类型）
```typescript
// 永远不会返回的函数
function error(message: string): never {
    throw new Error(message);
}

// 永远不会结束的函数
function infiniteLoop(): never {
    while (true) {
        // ...
    }
}

// 类型守卫中的 never
function assertNever(x: never): never {
    throw new Error("Unexpected object: " + x);
}
```

#### unknown（未知类型）
```typescript
let value: unknown;

value = "hello";     // 正确
value = 42;          // 正确
value = [];          // 正确

// unknown 类型在使用前必须进行类型检查
if (typeof value === "string") {
    console.log(value.toUpperCase()); // 正确
}

// 与 any 的区别
let anyValue: any;
anyValue.toFixed(); // 不会报错（运行时可能出错）

// value.toFixed(); // 错误：unknown 类型不能直接调用方法
```

#### any（任意类型）
```typescript
let notSure: any = 4;
notSure = "maybe a string instead";
notSure = false; // 也可以是布尔值

// any 类型会跳过类型检查
notSure.toFixed(); // 允许调用任何方法（但运行时可能出错）
```

### 3. 函数类型

#### 函数类型注解
```typescript
// 函数类型变量
let myAdd: (x: number, y: number) => number = 
    function(x: number, y: number): number { return x + y; };

// 箭头函数类型
let myAdd2: (baseValue: number, increment: number) => number = 
    (x, y) => x + y;

// 函数接口
interface SearchFunc {
    (source: string, subString: string): boolean;
}

let mySearch: SearchFunc = function(source, subString) {
    return source.search(subString) > -1;
};
```

### 4. 特殊类型

#### 字面量类型
```typescript
// 字符串字面量类型
let direction: "up" | "down" | "left" | "right" = "up";

// 数字字面量类型
let diceRoll: 1 | 2 | 3 | 4 | 5 | 6 = 1;

// 布尔字面量类型
let isTrue: true = true;
let isFalse: false = false;

// 对象字面量类型
let config: {
    readonly env: "development" | "production";
    debug: true;
} = {
    env: "development",
    debug: true
};
```

#### 模板字面量类型（TypeScript 4.1+）
```typescript
type World = "world";
type Greeting = `hello ${World}`; // "hello world"

type EmailLocaleIDs = "welcome_email" | "email_heading";
type FooterLocaleIDs = "footer_title" | "footer_sendoff";
type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
```

### 5. 类型操作符和工具类型

#### 联合类型和交叉类型
```typescript
// 联合类型
let value: string | number = "hello";
value = 42; // 也正确

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

#### 索引类型
```typescript
interface Person {
    name: string;
    age: number;
}

// keyof 操作符
type PersonKeys = keyof Person; // "name" | "age"

// 索引访问类型
type PersonName = Person["name"]; // string
type PersonProp = Person[keyof Person]; // string | number
```

### 6. 内置工具类型

```typescript
// Partial<T> - 将所有属性变为可选
interface User {
    name: string;
    age: number;
    email: string;
}

type PartialUser = Partial<User>;
// 等价于: { name?: string; age?: number; email?: string; }

// Required<T> - 将所有属性变为必需
type RequiredUser = Required<PartialUser>;

// Readonly<T> - 将所有属性变为只读
type ReadonlyUser = Readonly<User>;

// Pick<T, K> - 选择特定属性
type UserName = Pick<User, "name">;

// Omit<T, K> - 忽略特定属性
type UserWithoutEmail = Omit<User, "email">;

// Record<K, T> - 创建键值对类型
type PageInfo = {
    id: string;
    title: string;
};

type Pages = Record<string, PageInfo>;
```

### 7. 类型断言

```typescript
// 尖括号语法
let someValue: any = "this is a string";
let strLength: number = (<string>someValue).length;

// as 语法（推荐，尤其在 JSX 中）
let strLength2: number = (someValue as string).length;

// 非空断言操作符
function processElement(element: HTMLElement | null) {
    element!.style.color = "red"; // 告诉编译器 element 不为 null
}

// 可选链和空值合并
let user: { address?: { street?: string } } = {};
let street = user.address?.street ?? "No address";
```

### 总结

TypeScript 的类型系统提供了丰富的内置类型，从基本的原始类型到复杂的泛型和工具类型，能够满足各种编程需求。合理使用这些类型可以大大提高代码的安全性和可维护性。

选择合适的类型原则：
1. **优先使用具体类型**而非 `any`
2. **使用 `unknown`** 代替 `any` 进行安全的类型检查
3. **利用联合类型和字面量类型**提高类型精确度
4. **使用内置工具类型**简化常见类型操作
5. **合理使用类型断言**，但要确保类型安全