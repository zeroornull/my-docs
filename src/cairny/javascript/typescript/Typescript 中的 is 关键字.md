---
title: Typescript 中的 is 关键字
---

## TypeScript 中的 `is` 关键字

### 什么是 `is`关键字？

`is` 关键字是 TypeScript 中用于**类型谓词**（Type Predicate）的关键字，主要用于创建**类型守卫**（Type Guards）函数。它允许我们在运行时检查变量的类型，并向 TypeScript 编译器提供类型信息，从而在条件块中缩小变量的类型范围。

### 基本语法

```typescript
function isTypeName(parameter: any): parameter is TypeName {
    // 返回 boolean 值的表达式
    return /* 条件判断 */;
}
```

### 基本示例

#### 1. 简单的类型守卫

```typescript
// 检查变量是否为字符串
function isString(value: any): value is string {
    return typeof value === 'string';
}

// 使用类型守卫
function processValue(value: unknown) {
    if (isString(value)) {
        // 在这个代码块中，TypeScript 知道 value 是 string 类型
        console.log(value.toUpperCase()); // 可以安全调用 string 方法
    } else {
        console.log('Not a string');
    }
}
```

#### 2. 检查对象类型

```typescript
interface User {
    name: string;
    age: number;
    email: string;
}

interface Product {
    title: string;
    price: number;
    category: string;
}

// 类型守卫函数
function isUser(obj: any): obj is User {
    return obj && 
           typeof obj.name === 'string' && 
           typeof obj.age === 'number' && 
           typeof obj.email === 'string';
}

function isProduct(obj: any): obj is Product {
    return obj && 
           typeof obj.title === 'string' && 
           typeof obj.price === 'number' && 
           typeof obj.category === 'string';
}

// 使用类型守卫
function displayInfo(item: User | Product) {
    if (isUser(item)) {
        // 在这里 TypeScript 知道 item 是 User 类型
        console.log(`User: ${item.name}, Age: ${item.age}`);
        console.log(`Email: ${item.email}`);
    } else {
        // 在这里 TypeScript 知道 item 是 Product 类型
        console.log(`Product: ${item.title}, Price: $${item.price}`);
        console.log(`Category: ${item.category}`);
    }
}
```

### 复杂示例

#### 1. 处理联合类型

```typescript
type Shape = 
    | { kind: 'circle'; radius: number }
    | { kind: 'rectangle'; width: number; height: number }
    | { kind: 'square'; side: number };

// 类型守卫函数
function isCircle(shape: Shape): shape is { kind: 'circle'; radius: number } {
    return shape.kind === 'circle';
}

function isRectangle(shape: Shape): shape is { kind: 'rectangle'; width: number; height: number } {
    return shape.kind === 'rectangle';
}

function isSquare(shape: Shape): shape is { kind: 'square'; side: number } {
    return shape.kind === 'square';
}

// 使用类型守卫
function calculateArea(shape: Shape): number {
    if (isCircle(shape)) {
        // TypeScript 知道这是 circle 类型
        return Math.PI * shape.radius ** 2;
    } else if (isRectangle(shape)) {
        // TypeScript 知道这是 rectangle 类型
        return shape.width * shape.height;
    } else {
        // TypeScript 知道这是 square 类型
        return shape.side ** 2;
    }
}
```

#### 2. 数组类型守卫

```typescript
// 检查数组元素类型
function isStringArray(arr: any[]): arr is string[] {
    return arr.every(item => typeof item === 'string');
}

function isNumberArray(arr: any[]): arr is number[] {
    return arr.every(item => typeof item === 'number');
}

// 使用示例
function processArray(data: unknown[]) {
    if (isStringArray(data)) {
        // data 被识别为 string[]
        data.forEach(str => console.log(str.toUpperCase()));
    } else if (isNumberArray(data)) {
        // data 被识别为 number[]
        const sum = data.reduce((acc, num) => acc + num, 0);
        console.log(`Sum: ${sum}`);
    } else {
        console.log('Array contains mixed types');
    }
}
```

#### 3. 错误处理中的应用

```typescript
interface HttpError {
    status: number;
    message: string;
}

interface ValidationError {
    field: string;
    error: string;
}

// 类型守卫函数
function isHttpError(error: any): error is HttpError {
    return error && 
           typeof error.status === 'number' && 
           typeof error.message === 'string';
}

function isValidationError(error: any): error is ValidationError {
    return error && 
           typeof error.field === 'string' && 
           typeof error.error === 'string';
}

// 错误处理函数
function handleError(error: unknown) {
    if (isHttpError(error)) {
        // 处理 HTTP 错误
        console.log(`HTTP Error ${error.status}: ${error.message}`);
    } else if (isValidationError(error)) {
        // 处理验证错误
        console.log(`Validation Error in ${error.field}: ${error.error}`);
    } else {
        // 处理未知错误
        console.log('Unknown error occurred');
    }
}
```

### 与 `instanceof` 的对比

```typescript
class Dog {
    bark() {
        console.log('Woof!');
    }
}

class Cat {
    meow() {
        console.log('Meow!');
    }
}

// 使用 instanceof
function handleAnimalWithInstanceof(animal: Dog | Cat) {
    if (animal instanceof Dog) {
        animal.bark(); // TypeScript 知道这是 Dog
    } else {
        animal.meow(); // TypeScript 知道这是 Cat
    }
}

// 使用类型谓词（适用于接口或普通对象）
interface DogInterface {
    type: 'dog';
    name: string;
}

interface CatInterface {
    type: 'cat';
    name: string;
}

function isDog(animal: DogInterface | CatInterface): animal is DogInterface {
    return animal.type === 'dog';
}

function handleAnimalWithPredicate(animal: DogInterface | CatInterface) {
    if (isDog(animal)) {
        console.log(`${animal.name} is a dog`);
    } else {
        console.log(`${animal.name} is a cat`);
    }
}
```

### 高级用法

#### 1. 泛型类型守卫

```typescript
// 泛型类型守卫
function isDefined<T>(value: T | undefined | null): value is T {
    return value !== undefined && value !== null;
}

// 使用示例
function processOptionalValue(value: string | undefined) {
    if (isDefined(value)) {
        // value 被识别为 string 类型（排除了 undefined）
        console.log(value.toUpperCase());
    } else {
        console.log('Value is not defined');
    }
}
```

#### 2. 复杂对象检查

```typescript
interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

// 检查 API 响应是否成功
function isSuccessResponse<T>(response: ApiResponse<T>): response is ApiResponse<T> & { data: T } {
    return response.success === true && response.data !== undefined;
}

// 使用示例
function handleApiResponse(response: ApiResponse<User>) {
    if (isSuccessResponse(response)) {
        // 在这里 response.data 是确定存在的
        console.log(`User name: ${response.data.name}`);
    } else {
        console.log(`Error: ${response.error}`);
    }
}
```

### 优势和使用场景

#### 优势：
1. **类型安全**：在编译时提供类型检查
2. **智能提示**：IDE 可以提供更准确的代码补全
3. **代码可读性**：使类型检查逻辑更加明确
4. **复用性**：类型守卫函数可以在多处复用

#### 使用场景：
1. **处理联合类型**：在联合类型的条件分支中缩小类型范围
2. **API 响应处理**：检查 API 返回数据的结构
3. **表单验证**：验证用户输入数据的类型和结构
4. **错误处理**：区分不同类型的错误对象
5. **运行时类型检查**：在运行时验证对象结构

### 总结

`is` 关键字是 TypeScript 中一个重要的类型系统特性，它通过类型谓词函数提供了强大的类型守卫能力。使用 `is` 关键字可以帮助我们在运行时安全地检查和缩小变量类型，提高代码的类型安全性和可维护性。