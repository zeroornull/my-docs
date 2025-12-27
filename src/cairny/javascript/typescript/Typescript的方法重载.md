---
title: Typescript的方法重载
---

## TypeScript 中的方法重载

### 什么是方法重载？

方法重载（Method Overloading）是指为同一个函数提供多个函数类型定义，使得函数可以以不同的参数类型或数量被调用。TypeScript 中的方法重载允许我们定义一个函数的多种调用方式，编译器会根据传入参数的类型和数量来决定使用哪个函数签名。

### 基本语法

TypeScript 中的方法重载通过声明多个函数签名（没有函数体）来实现，然后提供一个实现签名（包含函数体）。

```typescript
// 函数签名（重载声明）
function functionName(param1: type1): returnType1;
function functionName(param1: type2): returnType2;
// 实现签名（包含函数体）
function functionName(param1: any): any {
    // 函数实现
}
```

### 实际示例

#### 1. 基本方法重载

```typescript
// 重载声明
function sayHello(name: string): string;
function sayHello(names: string[]): string[];

// 实现
function sayHello(name: string | string[]): string | string[] {
    if (typeof name === "string") {
        return `Hello, ${name}!`;
    } else {
        return name.map(n => `Hello, ${n}!`);
    }
}

// 使用示例
const greeting1 = sayHello("Alice");        // 返回 string
const greetings = sayHello(["Bob", "Charlie"]); // 返回 string[]
```

#### 2. 参数数量不同的重载

```typescript
// 重载声明
function makeDate(timestamp: number): Date;
function makeDate(year: number, month: number, day: number): Date;

// 实现
function makeDate(timestampOrYear: number, month?: number, day?: number): Date {
    if (month !== undefined && day !== undefined) {
        return new Date(timestampOrYear, month, day);
    } else {
        return new Date(timestampOrYear);
    }
}

// 使用示例
const date1 = makeDate(1234567890);           // 使用时间戳
const date2 = makeDate(2023, 11, 25);         // 使用年月日
// const date3 = makeDate(2023, 11);          // 错误：不匹配任何重载
```

#### 3. 复杂对象参数重载

```typescript
interface User {
    name: string;
    age: number;
}

interface Product {
    title: string;
    price: number;
}

// 重载声明
function processItem(item: User): string;
function processItem(item: Product): string;
function processItem(items: User[]): string;
function processItem(items: Product[]): string;

// 实现
function processItem(item: User | Product | User[] | Product[]): string {
    if (Array.isArray(item)) {
        if (item.length === 0) return "Empty array";
        
        // 类型守卫判断数组元素类型
        if ("name" in item[0]) {
            return `Processed ${item.length} users`;
        } else {
            return `Processed ${item.length} products`;
        }
    } else {
        if ("name" in item) {
            return `Processed user: ${item.name}`;
        } else {
            return `Processed product: ${item.title}`;
        }
    }
}

// 使用示例
const user: User = { name: "Alice", age: 30 };
const product: Product = { title: "Laptop", price: 1000 };

processItem(user);                    // 处理单个用户
processItem(product);                 // 处理单个产品
processItem([user, { name: "Bob", age: 25 }]);        // 处理用户数组
processItem([product, { title: "Phone", price: 500 }]); // 处理产品数组
```

#### 4. 类中的方法重载

```typescript
class Calculator {
    // 重载声明
    add(a: number): number;
    add(a: number, b: number): number;
    add(a: number, b: number, c: number): number;
    
    // 实现
    add(a: number, b?: number, c?: number): number {
        if (b === undefined && c === undefined) {
            return a;
        } else if (c === undefined) {
            return a + b;
        } else {
            return a + b + c;
        }
    }
}

const calc = new Calculator();
console.log(calc.add(5));           // 5
console.log(calc.add(5, 3));        // 8
console.log(calc.add(5, 3, 2));     // 10
```

#### 5. 带选项对象的重载

```typescript
interface ConfigOptions {
    timeout?: number;
    retries?: number;
}

interface AdvancedConfigOptions extends ConfigOptions {
    logger?: (msg: string) => void;
}

// 重载声明
function configure(url: string): void;
function configure(url: string, options: ConfigOptions): void;
function configure(url: string, options: AdvancedConfigOptions): void;

// 实现
function configure(url: string, options?: ConfigOptions | AdvancedConfigOptions): void {
    console.log(`Configuring with URL: ${url}`);
    
    if (options) {
        if (options.timeout) {
            console.log(`Timeout: ${options.timeout}`);
        }
        if (options.retries) {
            console.log(`Retries: ${options.retries}`);
        }
        // 类型守卫检查高级选项
        if ('logger' in options && options.logger) {
            options.logger("Configuration complete");
        }
    }
}

// 使用示例
configure("https://api.example.com");
configure("https://api.example.com", { timeout: 5000 });
configure("https://api.example.com", { 
    timeout: 5000, 
    retries: 3,
    logger: (msg) => console.log(`LOG: ${msg}`)
});
```

### 重载与联合类型的对比

有时候可以用联合类型代替重载，但重载提供了更精确的类型检查：

```typescript
// 使用联合类型（较简单但类型信息较少）
function format(value: string | number): string {
    return String(value);
}

// 使用重载（类型信息更丰富）
function formatOverload(value: string): string;
function formatOverload(value: number): number;
function formatOverload(value: string | number): string | number {
    if (typeof value === "string") {
        return value.toUpperCase();
    } else {
        return value.toFixed(2);
    }
}

const result1 = formatOverload("hello"); // 类型为 string
const result2 = formatOverload(42);      // 类型为 number
```

### 注意事项和最佳实践

#### 1. 实现签名不可调用

```typescript
function greet(name: string): string;
function greet(names: string[]): string[];
function greet(name: string | string[]): string | string[] {
    // 实现
    if (typeof name === "string") {
        return `Hello, ${name}!`;
    } else {
        return name.map(n => `Hello, ${n}!`);
    }
}

// greet("Alice" as string | string[]); // 实现签名不能直接调用
```

#### 2. 重载顺序很重要

```typescript
// 错误的顺序 - 更具体的重载应该在前面
function processValue(value: string | number): string;
function processValue(value: string): string; // 这个永远不会被匹配

// 正确的顺序
function processValue(value: string): string;
function processValue(value: string | number): string;
function processValue(value: string | number): string {
    return String(value);
}
```

#### 3. 避免过多重载

```typescript
// 不推荐：过多重载
function handleData(data: string): void;
function handleData(data: number): void;
function handleData(data: boolean): void;
function handleData(data: object): void;
function handleData(data: any[]): void;
function handleData(data: any): void {
    // 复杂的实现
}

// 推荐：使用类型守卫
function handleData(data: string | number | boolean | object | any[]): void {
    if (typeof data === "string") {
        // 处理字符串
    } else if (typeof data === "number") {
        // 处理数字
    }
    // ... 其他类型处理
}
```

### 总结

方法重载是 TypeScript 中一个强大的特性，它允许：

1. **更精确的类型定义**：为函数的不同调用方式提供准确的类型信息
2. **更好的开发体验**：IDE 可以提供更准确的智能提示
3. **编译时类型检查**：确保函数调用的正确性
4. **向后兼容**：支持不同的 API 使用方式

使用方法重载时要注意：
- 重载声明只定义签名，不包含实现
- 实现签名需要兼容所有重载声明
- 重载顺序很重要，具体类型应该在前面
- 避免过度使用，保持简洁性