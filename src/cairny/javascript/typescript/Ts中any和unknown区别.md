---
title: Ts中any和unknown区别
---

## TypeScript 中 any 和 unknown 的区别

`any` 和 `unknown` 是 TypeScript 中两个重要的类型，虽然它们都表示"任意类型"，但在类型安全性和使用方式上有显著区别。

### 1. 基本概念

#### any 类型
- **定义**：完全跳过类型检查的类型
- **特点**：关闭了 TypeScript 的类型安全机制
- **目的**：与 JavaScript 兼容，方便迁移

#### unknown 类型
- **定义**：表示未知类型的类型
- **特点**：类型安全的 `any` 替代品
- **目的**：在保持类型安全的前提下处理未知类型

### 2. 类型安全性对比

```typescript
// any 类型 - 完全没有类型安全
let anyValue: any = "hello";
anyValue = 42;
anyValue = true;
anyValue = {};

// 可以对 any 类型执行任何操作（但运行时可能出错）
console.log(anyValue.toUpperCase()); // 编译时不会报错
console.log(anyValue.toFixed(2));    // 编译时不会报错
anyValue();                          // 编译时不会报错
new anyValue();                      // 编译时不会报错
anyValue[0];                         // 编译时不会报错

// unknown 类型 - 类型安全
let unknownValue: unknown = "hello";
unknownValue = 42;
unknownValue = true;
unknownValue = {};

// 对 unknown 类型执行操作需要先进行类型检查
// console.log(unknownValue.toUpperCase()); // 错误！
// unknownValue();                          // 错误！
// new unknownValue();                      // 错误！
// unknownValue[0];                         // 错误！
```

### 3. 类型缩小（Type Narrowing）

```typescript
// any 类型 - 不需要类型检查
function processAny(value: any) {
    // 可以直接使用，没有任何限制
    console.log(value.length);
    console.log(value.toUpperCase());
    value();
}

// unknown 类型 - 必须进行类型检查
function processUnknown(value: unknown) {
    // 直接使用会报错
    // console.log(value.length); // 错误！

    // 需要类型缩小
    if (typeof value === "string") {
        // 在这个代码块中，value 被缩小为 string 类型
        console.log(value.toUpperCase());
        console.log(value.length);
    } else if (typeof value === "number") {
        // 在这个代码块中，value 被缩小为 number 类型
        console.log(value.toFixed(2));
    } else if (Array.isArray(value)) {
        // 在这个代码块中，value 被缩小为 any[] 类型
        console.log(value.length);
    } else if (typeof value === "function") {
        // 在这个代码块中，value 被缩小为 Function 类型
        value();
    }
}
```

### 4. 与其他类型的赋值关系

```typescript
// any 可以赋值给任何类型
let anyValue: any = "hello";
let stringValue: string = anyValue;    // 正确
let numberValue: number = anyValue;    // 正确
let booleanValue: boolean = anyValue;  // 正确

// unknown 只能赋值给 unknown 和 any
let unknownValue: unknown = "hello";
let unknownValue2: unknown = unknownValue;  // 正确
let anyValue2: any = unknownValue;          // 正确
// let stringValue2: string = unknownValue; // 错误！

// any 和 unknown 的相互赋值
let value1: any = unknownValue;      // 正确
let value2: unknown = anyValue;      // 正确
```

### 5. 实际应用场景

#### 使用 any 的场景（应尽量避免）
```typescript
// 第三方库没有类型定义
declare const someLibrary: any;

// 快速原型开发（不推荐在生产环境使用）
function quickHack(data: any) {
    return data.someMethod().anotherMethod();
}
```

#### 使用 unknown 的场景（推荐）
```typescript
// 处理 API 响应
async function fetchUserData(url: string): Promise<unknown> {
    const response = await fetch(url);
    return response.json();
}

// 类型安全地处理响应
async function processUserData() {
    const userData = await fetchUserData("/api/user");
    
    if (isUserObject(userData)) {
        console.log(`User: ${userData.name}`);
    } else {
        console.log("Invalid user data");
    }
}

interface User {
    name: string;
    age: number;
}

function isUserObject(obj: unknown): obj is User {
    return obj != null && 
           typeof obj === "object" && 
           "name" in obj && 
           "age" in obj &&
           typeof (obj as any).name === "string" &&
           typeof (obj as any).age === "number";
}

// 错误处理
function handleError(error: unknown) {
    if (error instanceof Error) {
        // TypeScript 知道这是 Error 类型
        console.log(`Error: ${error.message}`);
    } else if (typeof error === "string") {
        // TypeScript 知道这是 string 类型
        console.log(`Error string: ${error}`);
    } else {
        console.log("Unknown error type");
    }
}
```

### 6. 在函数参数中的使用

```typescript
// any 参数 - 不安全
function processAnyData(data: any) {
    // 可以对 data 做任何操作
    return data.map(item => item.toUpperCase()); // 危险！
}

// unknown 参数 - 安全
function processUnknownData(data: unknown) {
    // 必须先检查类型
    if (Array.isArray(data)) {
        return data.map(item => 
            typeof item === "string" ? item.toUpperCase() : item
        );
    }
    throw new Error("Expected array data");
}

// 使用示例
const stringArray = ["hello", "world"];
const mixedArray = ["hello", 42, true];

console.log(processAnyData(stringArray));    // 正常工作
// console.log(processAnyData("not array")); // 运行时错误！

console.log(processUnknownData(stringArray)); // 正常工作
// console.log(processUnknownData("not array")); // 抛出错误，但类型安全
```

### 7. 类型谓词中的使用

```typescript
// 使用 any 的类型守卫（不推荐）
function isValidData(data: any): boolean {
    return data && data.length > 0; // 不够安全
}

// 使用 unknown 的类型守卫（推荐）
function isValidDataSafe(data: unknown): data is { length: number } {
    return data != null && 
           typeof data === "object" && 
           "length" in data && 
           typeof (data as any).length === "number";
}

// 使用示例
function processData(input: unknown) {
    if (isValidDataSafe(input)) {
        // TypeScript 知道 input 有 length 属性
        console.log(`Length: ${input.length}`);
    }
}
```

### 8. 与泛型的结合使用

```typescript
// 使用 any（不推荐）
function parseJsonAny(jsonString: string): any {
    return JSON.parse(jsonString);
}

// 使用 unknown（推荐）
function parseJsonUnknown(jsonString: string): unknown {
    return JSON.parse(jsonString);
}

// 更好的泛型版本
function parseJson<T>(jsonString: string): T {
    return JSON.parse(jsonString);
}

// 使用示例
interface User {
    name: string;
    age: number;
}

// const user1 = parseJsonAny('{"name":"Alice","age":30}'); // any 类型
const user2 = parseJsonUnknown('{"name":"Alice","age":30}'); // unknown 类型
const user3 = parseJson<User>('{"name":"Alice","age":30}'); // User 类型
```

### 总结对比表

| 特性 | any | unknown |
|------|-----|---------|
| **类型安全性** | 无（跳过所有检查） | 高（需要类型检查） |
| **赋值给其他类型** | 可以赋值给任何类型 | 只能赋值给 unknown 和 any |
| **属性访问** | 可以访问任何属性 | 需要先进行类型检查 |
| **方法调用** | 可以调用任何方法 | 需要先进行类型检查 |
| **类型缩小** | 不需要 | 必须进行类型缩小 |
| **使用建议** | 尽量避免使用 | 推荐作为安全替代 |

### 最佳实践建议

1. **优先使用 `unknown`**：当处理未知类型的数据时
2. **避免使用 `any`**：除非确实需要完全跳过类型检查
3. **使用类型守卫**：将 `unknown` 类型缩小到具体类型
4. **渐进式迁移**：在现有代码中逐步将 `any` 替换为 `unknown`
5. **合理使用泛型**：在可能的情况下使用泛型而不是 `any` 或 `unknown`

```typescript
// 推荐的实践示例
class DataProcessor {
    // 接收未知数据，返回类型安全的结果
    static process(data: unknown): string {
        if (data === null || data === undefined) {
            return "No data";
        }
        
        if (typeof data === "string") {
            return data.toUpperCase();
        }
        
        if (typeof data === "number") {
            return data.toString();
        }
        
        if (Array.isArray(data)) {
            return `[${data.join(", ")}]`;
        }
        
        if (typeof data === "object") {
            return JSON.stringify(data);
        }
        
        return String(data);
    }
}
```

总的来说，`unknown` 是 `any` 的类型安全替代品，在保持灵活性的同时提供了更好的类型安全性。