---
title: TypeScript中的null和undefined
---

在 TypeScript 中检查 `null` 和 `undefined` 是确保代码健壮性的重要实践。TypeScript 提供了多种方式来处理这些值，以下是详细的检查方法：

## 1. 严格空值检查模式（Strict Null Checks）

首先，建议在 `tsconfig.json` 中启用严格空值检查：

```json
{
  "compilerOptions": {
    "strictNullChecks": true
  }
}
```

启用后，`null` 和 `undefined` 只能赋值给它们各自的类型（以及 `any` 类型）。

## 2. 基本的相等性检查

### 直接比较
```typescript
function checkValue(value: string | null) {
  if (value === null) {
    console.log("Value is null");
  } else {
    console.log("Value is:", value);
  }
}

function checkUndefined(value: string | undefined) {
  if (value === undefined) {
    console.log("Value is undefined");
  } else {
    console.log("Value is:", value);
  }
}
```

### 使用 == 检查 null 和 undefined
```typescript
function checkNullOrUndefined(value: string | null | undefined) {
  if (value == null) { // 同时检查 null 和 undefined
    console.log("Value is null or undefined");
  } else {
    console.log("Value is:", value);
  }
}
```

## 3. 类型守卫（Type Guards）

### typeof 检查
```typescript
function processValue(value: string | undefined) {
  if (typeof value === 'undefined') {
    console.log("Value is undefined");
    return;
  }
  // 在这个代码块中，TypeScript 知道 value 不是 undefined
  console.log("Length:", value.length);
}
```

### 自定义类型守卫
```typescript
function isNotNull<T>(value: T | null): value is T {
  return value !== null;
}

function isNotUndefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

function isNotNullOrUndefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

// 使用示例
function handleData(data: string | null | undefined) {
  if (isNotNullOrUndefined(data)) {
    // 在这里 TypeScript 知道 data 是 string 类型
    console.log("Data length:", data.length);
  } else {
    console.log("Data is null or undefined");
  }
}
```

## 4. 可选链操作符（Optional Chaining）

ES2020 引入的可选链操作符可以安全地访问嵌套对象属性：

```typescript
interface User {
  name: string;
  address?: {
    street?: string;
    city?: string;
  };
}

function getStreet(user: User | null) {
  // 安全访问嵌套属性
  return user?.address?.street;
}

const user: User | null = null;
console.log(getStreet(user)); // undefined，不会抛出错误

const user2: User = { name: "Alice" };
console.log(getStreet(user2)); // undefined，因为 address 不存在

const user3: User = { 
  name: "Bob", 
  address: { street: "123 Main St" } 
};
console.log(getStreet(user3)); // "123 Main St"
```

## 5. 空值合并操作符（Nullish Coalescing）

用于提供默认值，只在值为 `null` 或 `undefined` 时使用默认值：

```typescript
function getUsername(user: { name?: string } | null) {
  // 只有当 user?.name 是 null 或 undefined 时才使用默认值
  return user?.name ?? "Anonymous";
}

const user1 = { name: "" }; // 空字符串
const user2 = { name: null };
const user3 = null;

console.log(getUsername(user1)); // "" (空字符串不是 null/undefined)
console.log(getUsername(user2)); // "Anonymous"
console.log(getUsername(user3)); // "Anonymous"
```

## 6. 非空断言操作符（Non-null Assertion Operator）

当开发者确定值不为 `null` 或 `undefined` 时使用：

```typescript
function processElement(element: HTMLElement | null) {
  // 告诉 TypeScript element 不会是 null
  const width = element!.offsetWidth;
  
  // 或者先检查再使用
  if (element !== null) {
    const height = element.offsetHeight;
  }
}
```

> ⚠️ 注意：非空断言操作符应该谨慎使用，因为它会跳过类型检查。

## 7. 实际应用示例

### API 响应处理
```typescript
interface ApiResponse {
  data?: {
    user?: {
      name?: string;
      email?: string;
    };
  };
  error?: string;
}

function displayUserInfo(response: ApiResponse) {
  // 检查是否有错误
  if (response.error != null) {
    console.error("API Error:", response.error);
    return;
  }
  
  // 安全访问嵌套数据
  const userName = response.data?.user?.name ?? "Unknown User";
  const userEmail = response.data?.user?.email ?? "No Email";
  
  console.log(`User: ${userName}, Email: ${userEmail}`);
}
```

### 数组和对象检查
```typescript
function processArray(arr: number[] | null | undefined) {
  // 检查数组是否存在且不为空
  if (arr == null || arr.length === 0) {
    console.log("Array is null, undefined, or empty");
    return;
  }
  
  // 在这里 arr 被确认为非空数组
  console.log("Array sum:", arr.reduce((a, b) => a + b, 0));
}

function processObject(obj: Record<string, any> | null) {
  // 检查对象是否存在
  if (obj == null) {
    console.log("Object is null or undefined");
    return;
  }
  
  // 检查对象是否为空
  if (Object.keys(obj).length === 0) {
    console.log("Object is empty");
    return;
  }
  
  console.log("Object keys:", Object.keys(obj));
}
```

### 函数参数处理
```typescript
interface Config {
  apiUrl?: string;
  timeout?: number;
  retries?: number;
}

function createApiClient(config: Config | null) {
  // 提供默认配置
  const safeConfig = config ?? {};
  
  const apiUrl = safeConfig.apiUrl ?? "https://api.example.com";
  const timeout = safeConfig.timeout ?? 5000;
  const retries = safeConfig.retries ?? 3;
  
  console.log(`API Client: ${apiUrl}, Timeout: ${timeout}, Retries: ${retries}`);
}
```

## 8. 高级类型守卫

### 复杂对象的类型守卫
```typescript
interface User {
  id: number;
  name: string;
}

interface Product {
  id: number;
  title: string;
  price: number;
}

type Entity = User | Product | null | undefined;

function isUser(entity: Entity): entity is User {
  return entity != null && 'name' in entity;
}

function isProduct(entity: Entity): entity is Product {
  return entity != null && 'title' in entity && 'price' in entity;
}

function processEntity(entity: Entity) {
  if (isUser(entity)) {
    console.log("User:", entity.name);
  } else if (isProduct(entity)) {
    console.log("Product:", entity.title, entity.price);
  } else {
    console.log("Entity is null or undefined");
  }
}
```

## 9. 最佳实践

### 1. 启用严格模式
```json
{
  "compilerOptions": {
    "strict": true // 包含 strictNullChecks
  }
}
```

### 2. 明确声明可能为空的类型
```typescript
// 好的做法
function findUser(id: number): User | null {
  // ...
}

// 避免隐式的 undefined
function getUser(id: number): User | undefined {
  // ...
}
```

### 3. 使用可选属性而非 undefined 类型
```typescript
interface UserConfig {
  theme?: string;        // 可选属性
  // 而不是 theme: string | undefined
}
```

### 4. 早期返回模式
```typescript
function processData(data: Data | null) {
  if (data == null) {
    return; // 早期返回
  }
  
  // 处理数据的逻辑
  // 不需要嵌套的 if-else
}
```

## 总结

TypeScript 中检查 `null` 和 `undefined` 的主要方法：

1. **直接比较**：使用 `===`、`==` 或 `typeof` 进行检查
2. **类型守卫**：创建自定义守卫函数以提供类型安全
3. **可选链**：安全访问嵌套属性（`?.`）
4. **空值合并**：提供默认值（`??`）
5. **非空断言**：在确定不为空时使用（`!`）

这些方法帮助开发者编写更安全、更健壮的 TypeScript 代码，避免运行时错误。
