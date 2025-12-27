---
title: 将 unknown 类型指定为一个更具体的类型
---

## 如何将 unknown 类型指定为更具体的类型

将 `unknown` 类型转换为更具体的类型需要通过类型检查和类型断言来实现。以下是几种主要的方法：

### 1. 类型守卫（Type Guards）

类型守卫是最安全和推荐的方式，通过运行时检查来缩小类型范围。

#### 基本类型守卫

```typescript
function processUnknown(value: unknown) {
    // 字符串类型守卫
    if (typeof value === "string") {
        // 在这个代码块中，TypeScript 知道 value 是 string 类型
        console.log(value.toUpperCase());
        console.log(value.length);
    }
    
    // 数字类型守卫
    if (typeof value === "number") {
        // 在这个代码块中，TypeScript 知道 value 是 number 类型
        console.log(value.toFixed(2));
        console.log(value + 10);
    }
    
    // 布尔类型守卫
    if (typeof value === "boolean") {
        // 在这个代码块中，TypeScript 知道 value 是 boolean 类型
        console.log(value ? "是" : "否");
    }
    
    // 函数类型守卫
    if (typeof value === "function") {
        // 在这个代码块中，TypeScript 知道 value 是 Function 类型
        value();
    }
    
    // 对象类型守卫
    if (typeof value === "object" && value !== null) {
        // 在这个代码块中，TypeScript 知道 value 是 object 类型（非 null）
        console.log(Object.keys(value));
    }
}
```

#### 数组类型守卫

```typescript
function processArray(value: unknown) {
    // 检查是否为数组
    if (Array.isArray(value)) {
        // 在这个代码块中，TypeScript 知道 value 是 any[] 类型
        console.log(`数组长度: ${value.length}`);
        value.forEach(item => console.log(item));
    }
}

// 更具体的数组类型守卫
function isStringArray(value: unknown): value is string[] {
    return Array.isArray(value) && value.every(item => typeof item === "string");
}

function isNumberArray(value: unknown): value is number[] {
    return Array.isArray(value) && value.every(item => typeof item === "number");
}

function processSpecificArray(value: unknown) {
    if (isStringArray(value)) {
        // TypeScript 知道这里是 string[] 类型
        value.forEach(str => console.log(str.toUpperCase()));
    } else if (isNumberArray(value)) {
        // TypeScript 知道这里是 number[] 类型
        const sum = value.reduce((acc, num) => acc + num, 0);
        console.log(`总和: ${sum}`);
    }
}
```

### 2. instanceof 检查

对于类实例，可以使用 `instanceof` 进行类型检查：

```typescript
class User {
    constructor(public name: string, public age: number) {}
    
    greet() {
        console.log(`Hello, I'm ${this.name}`);
    }
}

class Product {
    constructor(public title: string, public price: number) {}
    
    display() {
        console.log(`${this.title}: $${this.price}`);
    }
}

function processObject(obj: unknown) {
    if (obj instanceof User) {
        // TypeScript 知道这里是 User 类型
        obj.greet();
        console.log(`Age: ${obj.age}`);
    } else if (obj instanceof Product) {
        // TypeScript 知道这里是 Product 类型
        obj.display();
        console.log(`Price: ${obj.price}`);
    }
}

const user = new User("Alice", 30);
const product = new Product("Laptop", 999);

processObject(user);    // 处理 User 对象
processObject(product); // 处理 Product 对象
```

### 3. 自定义类型守卫函数

创建专门的类型守卫函数来检查复杂对象：

```typescript
interface User {
    name: string;
    age: number;
    email?: string;
}

interface Product {
    title: string;
    price: number;
    category: string;
}

// 自定义类型守卫函数
function isUser(obj: unknown): obj is User {
    return obj != null &&
           typeof obj === "object" &&
           "name" in obj &&
           "age" in obj &&
           typeof (obj as any).name === "string" &&
           typeof (obj as any).age === "number";
}

function isProduct(obj: unknown): obj is Product {
    return obj != null &&
           typeof obj === "object" &&
           "title" in obj &&
           "price" in obj &&
           "category" in obj &&
           typeof (obj as any).title === "string" &&
           typeof (obj as any).price === "number" &&
           typeof (obj as any).category === "string";
}

function processData(data: unknown) {
    if (isUser(data)) {
        // TypeScript 知道这里是 User 类型
        console.log(`User: ${data.name}, Age: ${data.age}`);
    } else if (isProduct(data)) {
        // TypeScript 知道这里是 Product 类型
        console.log(`Product: ${data.title}, Price: $${data.price}`);
    } else {
        console.log("Unknown data type");
    }
}
```

### 4. 类型断言（Type Assertion）

当确定类型时，可以使用类型断言，但需要谨慎使用：

```typescript
function processString(value: unknown) {
    // 在确定类型后进行断言
    if (typeof value === "string") {
        // 不需要断言，类型守卫已经确定了类型
        console.log(value.toUpperCase());
    }
}

// 在某些情况下需要类型断言
function handleApiResponse(response: unknown) {
    // 假设我们知道响应的结构
    const data = response as { users: User[]; total: number };
    // 注意：这种方式不安全，除非你非常确定类型
    console.log(`Total users: ${data.total}`);
}

// 更安全的方式
function handleApiResponseSafe(response: unknown) {
    if (isObjectWithProperties(response, ['users', 'total']) &&
        Array.isArray((response as any).users) &&
        typeof (response as any).total === "number") {
        
        const data = response as { users: User[]; total: number };
        console.log(`Total users: ${data.total}`);
    }
}

function isObjectWithProperties(obj: unknown, properties: string[]): obj is object {
    return obj != null && 
           typeof obj === "object" && 
           properties.every(prop => prop in obj);
}
```

### 5. 使用类型谓词进行复杂检查

```typescript
// 检查嵌套对象
interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

function isSuccessResponse<T>(response: unknown): response is ApiResponse<T> & { data: T } {
    return response != null &&
           typeof response === "object" &&
           "success" in response &&
           (response as any).success === true &&
           "data" in response &&
           (response as any).data !== undefined;
}

function handleApiResponse(response: unknown) {
    if (isSuccessResponse<User[]>(response)) {
        // TypeScript 知道 response.data 是 User[] 类型
        response.data.forEach(user => {
            console.log(`User: ${user.name}`);
        });
    } else {
        console.log("API request failed");
    }
}
```

### 6. 联合类型和类型缩小

```typescript
type ValidTypes = string | number | boolean | User | Product;

function processValidType(value: unknown) {
    // 先检查是否为 ValidTypes 中的类型
    if (isValidType(value)) {
        // 现在 value 的类型是 ValidTypes
        if (typeof value === "string") {
            console.log(value.toUpperCase());
        } else if (typeof value === "number") {
            console.log(value.toFixed(2));
        } else if (typeof value === "boolean") {
            console.log(value ? "true" : "false");
        } else if (isUser(value)) {
            console.log(`User: ${value.name}`);
        } else if (isProduct(value)) {
            console.log(`Product: ${value.title}`);
        }
    }
}

function isValidType(value: unknown): value is ValidTypes {
    return typeof value === "string" ||
           typeof value === "number" ||
           typeof value === "boolean" ||
           isUser(value) ||
           isProduct(value);
}
```

### 7. 处理 JSON 解析结果

```typescript
// 安全地处理 JSON 解析
function parseAndValidateUser(jsonString: string): User | null {
    try {
        const parsed = JSON.parse(jsonString);
        
        if (isUser(parsed)) {
            return parsed;
        }
        
        return null;
    } catch (error) {
        console.error("Invalid JSON:", error);
        return null;
    }
}

// 更复杂的验证
function validateUser(user: unknown): user is User {
    if (user == null || typeof user !== "object") {
        return false;
    }
    
    const u = user as Record<string, unknown>;
    
    // 检查必需属性
    if (typeof u.name !== "string" || typeof u.age !== "number") {
        return false;
    }
    
    // 检查可选属性
    if ("email" in u && u.email !== undefined && typeof u.email !== "string") {
        return false;
    }
    
    // 检查年龄范围
    if (u.age < 0 || u.age > 150) {
        return false;
    }
    
    return true;
}

// 使用示例
const jsonString = '{"name": "Alice", "age": 30, "email": "alice@example.com"}';
const user = parseAndValidateUser(jsonString);

if (user) {
    // TypeScript 知道这里是 User 类型
    console.log(`Valid user: ${user.name}`);
} else {
    console.log("Invalid user data");
}
```

### 8. 使用泛型类型守卫

```typescript
// 泛型类型守卫
function isDefined<T>(value: T | null | undefined): value is T {
    return value !== null && value !== undefined;
}

function isNonEmptyArray<T>(value: unknown): value is T[] {
    return Array.isArray(value) && value.length > 0;
}

function processValue(value: unknown) {
    // 检查值是否存在
    if (isDefined(value)) {
        console.log("Value is defined");
    }
    
    // 检查是否为非空数组
    if (isNonEmptyArray<string>(value)) {
        // TypeScript 知道这里是 string[] 类型且非空
        console.log(`First item: ${value[0]}`);
    }
}
```

### 总结

将 `unknown` 类型转换为具体类型的最佳实践：

1. **优先使用类型守卫**：最安全的方式
2. **避免直接类型断言**：除非你完全确定类型
3. **创建自定义类型守卫**：处理复杂对象类型
4. **组合多种检查方式**：确保类型安全
5. **使用类型谓词**：提供编译时类型信息

这些方法可以帮助你在保持类型安全的同时，将 `unknown` 类型转换为具体类型进行处理。