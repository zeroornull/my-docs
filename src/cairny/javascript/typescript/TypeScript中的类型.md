---
title: TypeScript中的类型
---

TypeScript 提供了丰富的类型系统，包括基本类型、复杂类型和高级类型。以下是 TypeScript 中的主要类型分类：

## 1. 基本类型（Primitive Types）

### boolean（布尔值）
```typescript
let isDone: boolean = false;
let isActive: boolean = true;
```

### number（数字）
```typescript
let decimal: number = 42;
let hex: number = 0xf00d;
let binary: number = 0b1010;
let octal: number = 0o744;
```

### string（字符串）
```typescript
let color: string = "blue";
let fullName: string = `Bob Bobbington`;
let sentence: string = `Hello, my name is ${fullName}`;
```

### bigint（大整数）
```typescript
let bigNumber: bigint = 100n;
let anotherBigNumber: bigint = BigInt(100);
```

### symbol（符号）
```typescript
let sym1: symbol = Symbol("key");
let sym2: symbol = Symbol("key");
// sym1 === sym2 // false，每个 Symbol 都是唯一的
```

### null 和 undefined
```typescript
let u: undefined = undefined;
let n: null = null;

// 在严格模式下，null 和 undefined 只能赋值给对应的类型
let num: number = null; // 错误（strictNullChecks 启用时）
let num2: number | null = null; // 正确
```

### void（无返回值）
```typescript
function warnUser(): void {
  console.log("This is my warning message");
}

let unusable: void = undefined; // void 类型只能赋值 undefined 或 null
```

### any（任意类型）
```typescript
let notSure: any = 4;
notSure = "maybe a string instead";
notSure = false; // 也可以是布尔值

// any 类型会跳过类型检查
notSure.ifItExists(); // 运行时可能出错
```

### unknown（未知类型）
```typescript
let value: unknown;

value = true;             // OK
value = 42;               // OK
value = "Hello World";    // OK

// unknown 类型在使用前必须进行类型检查
if (typeof value === "string") {
  console.log(value.toUpperCase()); // OK
}
```

### never（永不返回）
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

// 类型保护中不可能存在的类型
function assertNever(x: never): never {
  throw new Error("Unexpected object: " + x);
}
```

## 2. 对象类型（Object Types）

### 数组（Array）
```typescript
// 方式1：使用类型 + []
let list1: number[] = [1, 2, 3];

// 方式2：使用 Array<类型>
let list2: Array<number> = [1, 2, 3];

// 多维数组
let matrix: number[][] = [[1, 2], [3, 4]];

// 只读数组
let readonlyList: readonly number[] = [1, 2, 3];
// readonlyList[0] = 12; // 错误！
```

### 元组（Tuple）
```typescript
// 固定长度和类型的数组
let tuple: [string, number] = ["hello", 10];

// 访问元素
console.log(tuple[0].substring(1)); // OK
// console.log(tuple[1].substring(1)); // 错误，number 没有 substring 方法

// 可选元素
let tupleWithOptional: [string, number?] = ["hello"];
let tupleWithOptional2: [string, number?] = ["hello", 42];

// 剩余元素
let tupleWithRest: [number, ...string[]] = [1, "hello", "world"];
```

### 枚举（Enum）
```typescript
// 数字枚举
enum Direction {
  Up,
  Down,
  Left,
  Right
}

// 字符串枚举
enum HttpStatus {
  OK = "OK",
  NotFound = "NOT_FOUND",
  Error = "ERROR"
}

let dir: Direction = Direction.Up;
let status: HttpStatus = HttpStatus.OK;
```

### 对象（Object）
```typescript
// 普通对象
let obj: object = { name: "Alice" };

// 对象字面量类型
let person: { name: string; age: number } = {
  name: "Alice",
  age: 30
};
```

## 3. 接口和自定义类型

### 接口（Interface）
```typescript
interface Person {
  name: string;
  age: number;
  email?: string;        // 可选属性
  readonly id: number;   // 只读属性
}

interface FunctionInterface {
  (source: string, subString: string): boolean;
}

interface IndexInterface {
  [index: number]: string;
}
```

### 类型别名（Type Alias）
```typescript
type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;

type Container<T> = { value: T };

// 与接口类似，但更灵活
type Point = {
  x: number;
  y: number;
};

// 交叉类型
type Named = { name: string };
type Aged = { age: number };
type NamedPerson = Named & Aged;
```

## 4. 函数类型

### 函数声明
```typescript
function add(x: number, y: number): number {
  return x + y;
}

// 可选参数
function buildName(firstName: string, lastName?: string): string {
  if (lastName) return firstName + " " + lastName;
  else return firstName;
}

// 默认参数
function buildName2(firstName: string, lastName = "Smith"): string {
  return firstName + " " + lastName;
}

// 剩余参数
function buildName3(firstName: string, ...restOfName: string[]): string {
  return firstName + " " + restOfName.join(" ");
}
```

### 函数表达式
```typescript
let myAdd: (x: number, y: number) => number = 
  function(x: number, y: number): number { return x + y; };

// 简化写法
let myAdd2: (x: number, y: number) => number = (x, y) => x + y;
```

## 5. 类类型

```typescript
class Greeter {
  greeting: string;
  
  constructor(message: string) {
    this.greeting = message;
  }
  
  greet(): string {
    return "Hello, " + this.greeting;
  }
}

let greeter: Greeter = new Greeter("world");
```

## 6. 泛型类型

```typescript
// 泛型函数
function identity<T>(arg: T): T {
  return arg;
}

let output = identity<string>("myString");

// 泛型接口
interface GenericIdentityFn<T> {
  (arg: T): T;
}

// 泛型类
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}

// 泛型约束
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length); // 现在我们知道 arg 有 length 属性
  return arg;
}
```

## 7. 高级类型

### 联合类型（Union Types）
```typescript
let value: string | number;
value = "hello"; // OK
value = 42;      // OK

// 类型保护
function padLeft(value: string, padding: string | number) {
  if (typeof padding === "number") {
    return " ".repeat(padding) + value;
  }
  if (typeof padding === "string") {
    return padding + value;
  }
  throw new Error(`Expected string or number, got '${padding}'.`);
}
```

### 交叉类型（Intersection Types）
```typescript
interface ErrorHandling {
  success: boolean;
  error?: { message: string };
}

interface ArtworksData {
  artworks: { title: string }[];
}

interface ArtistsData {
  artists: { name: string }[];
}

// 交叉类型组合多个接口
type ArtworksResponse = ArtworksData & ErrorHandling;
type ArtistsResponse = ArtistsData & ErrorHandling;
```

### 条件类型（Conditional Types）
```typescript
type NonNullable<T> = T extends null | undefined ? never : T;

type MyType<T> = T extends string ? string : number;

type MessageOf<T> = T extends { message: unknown } ? T["message"] : never;
```

### 映射类型（Mapped Types）
```typescript
type Partial<T> = {
  [P in keyof T]?: T[P];
};

type Required<T> = {
  [P in keyof T]-?: T[P];
};

type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

// 自定义映射类型
type MyPartial<T> = {
  [P in keyof T]?: T[P] | null;
};
```

### 索引类型（Indexed Types）
```typescript
interface Person {
  name: string;
  age: number;
  location: string;
}

type PersonKeys = keyof Person; // "name" | "age" | "location"

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

### 模板字面量类型（Template Literal Types）
```typescript
type World = "world";
type Greeting = `hello ${World}`; // "hello world"

type EmailLocaleIDs = "welcome_email" | "email_heading";
type FooterLocaleIDs = "footer_title" | "footer_sendoff";

type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
// "welcome_email_id" | "email_heading_id" | "footer_title_id" | "footer_sendoff_id"
```

## 8. 类型操作符

### typeof 操作符
```typescript
let s = "hello";
let n: typeof s; // n 的类型是 string

function f() {
  return { x: 10, y: 3 };
}

type P = ReturnType<typeof f>; // { x: number; y: number }
```

### keyof 操作符
```typescript
type Point = { x: number; y: number };
type P = keyof Point; // "x" | "y"
```

### in 操作符
```typescript
type Keys = "option1" | "option2";
type Flags = { [K in Keys]: boolean };
// 等价于 { option1: boolean; option2: boolean }
```

## 9. 实用类型（Utility Types）

TypeScript 内置了许多实用类型：

```typescript
// Partial<T> - 将所有属性变为可选
type PartialPerson = Partial<Person>;

// Required<T> - 将所有属性变为必需
type RequiredPerson = Required<Partial<Person>>;

// Readonly<T> - 将所有属性变为只读
type ReadonlyPerson = Readonly<Person>;

// Record<K, T> - 创建一个由 K 类型的键和 T 类型的值组成的对象类型
type PageInfo = {
  id: string;
  title: string;
};

type Page = "home" | "about" | "contact";
const nav: Record<Page, PageInfo> = {
  home: { id: "1", title: "Home" },
  about: { id: "2", title: "About" },
  contact: { id: "3", title: "Contact" }
};

// Pick<T, K> - 从 T 中选择一组属性 K
type PersonName = Pick<Person, "name">;

// Omit<T, K> - 从 T 中排除属性 K
type PersonWithoutId = Omit<Person, "id">;

// Exclude<T, U> - 从 T 中排除可以赋值给 U 的类型
type T0 = Exclude<"a" | "b" | "c", "a">; // "b" | "c"

// Extract<T, U> - 从 T 中提取可以赋值给 U 的类型
type T1 = Extract<"a" | "b" | "c", "a" | "f">; // "a"

// NonNullable<T> - 从 T 中排除 null 和 undefined
type T2 = NonNullable<string | number | undefined>; // string | number

// ReturnType<T> - 获取函数类型的返回类型
type T3 = ReturnType<() => string>; // string

// InstanceType<T> - 获取构造函数类型的实例类型
class C {
  x = 0;
  y = 0;
}

type T4 = InstanceType<typeof C>; // C
```

## 总结

TypeScript 的类型系统提供了：

1. **基础类型安全**：基本类型提供编译时类型检查
2. **结构化类型**：通过接口和类型别名定义复杂数据结构
3. **泛型支持**：创建可重用的类型安全组件
4. **高级类型操作**：条件类型、映射类型等强大功能
5. **类型推断**：自动推断类型减少显式声明
6. **实用类型**：内置常用类型转换工具

这些类型系统特性使 TypeScript 成为开发大型、复杂应用程序的强大工具，提供了更好的代码可维护性和开发体验。