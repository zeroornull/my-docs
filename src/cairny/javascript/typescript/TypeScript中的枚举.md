---
title: TypeScript中的枚举
---

TypeScript 中的枚举（Enum）是一种定义命名常量集合的方式，它为一组相关的值提供有意义的名称，使代码更具可读性和可维护性。

## 基本语法

### 数字枚举（Numeric Enums）

这是最常见的枚举类型，默认从 0 开始自动递增：

```typescript
enum Direction {
  Up,    // 0
  Down,  // 1
  Left,  // 2
  Right  // 3
}

// 使用枚举
let move: Direction = Direction.Up;
console.log(move); // 输出: 0

// 通过数值获取枚举名称
console.log(Direction[0]); // 输出: "Up"
```

### 自定义起始值

```typescript
enum StatusCode {
  NotFound = 404,
  ServerError = 500,
  OK = 200,
  BadRequest = 400
}

console.log(StatusCode.OK); // 输出: 200
console.log(StatusCode.NotFound); // 输出: 404
```

### 连续递增

```typescript
enum Month {
  January = 1,
  February,  // 2
  March,     // 3
  April,     // 4
  May        // 5
}

console.log(Month.March); // 输出: 3
```

### 字符串枚举（String Enums）

每个成员都必须用字符串字面量初始化：

```typescript
enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE"
}

let method: HttpMethod = HttpMethod.POST;
console.log(method); // 输出: "POST"
```

### 异构枚举（Heterogeneous Enums）

混合数字和字符串成员（不推荐使用）：

```typescript
enum BooleanLike {
  No = 0,
  Yes = "YES"
}

console.log(BooleanLike.No);   // 输出: 0
console.log(BooleanLike.Yes);  // 输出: "YES"
```

## 枚举的编译结果

### 数字枚举编译后的 JavaScript

```typescript
// TypeScript
enum Direction {
  Up,
  Down,
  Left,
  Right
}

// 编译后的 JavaScript
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Down"] = 1] = "Down";
    Direction[Direction["Left"] = 2] = "Left";
    Direction[Direction["Right"] = 3] = "Right";
})(Direction || (Direction = {}));
```

注意：数字枚举会生成**反向映射**，即可以通过值获取键名。

### 字符串枚举编译后的 JavaScript

```typescript
// TypeScript
enum HttpMethod {
  GET = "GET",
  POST = "POST"
}

// 编译后的 JavaScript（更简洁）
var HttpMethod;
(function (HttpMethod) {
    HttpMethod["GET"] = "GET";
    HttpMethod["POST"] = "POST";
})(HttpMethod || (HttpMethod = {}));
```

## 常量枚举（Const Enums）

使用 `const` 关键字声明的枚举在编译时会被完全内联，不会生成额外的 JavaScript 代码：

```typescript
const enum Direction {
  Up,
  Down,
  Left,
  Right
}

let directions = [
  Direction.Up,
  Direction.Down,
  Direction.Left,
  Direction.Right
];

// 编译后的 JavaScript（优化后）
var directions = [0 /* Up */, 1 /* Down */, 2 /* Left */, 3 /* Right */];
```

## 枚举成员类型

每个枚举成员都可以作为类型使用：

```typescript
enum ShapeKind {
  Circle,
  Square
}

interface Circle {
  kind: ShapeKind.Circle;  // 使用枚举成员作为类型
  radius: number;
}

interface Square {
  kind: ShapeKind.Square;  // 使用枚举成员作为类型
  sideLength: number;
}

let circle: Circle = {
  kind: ShapeKind.Circle,  // 只能是 ShapeKind.Circle
  radius: 5
};
```

## 计算成员和常量成员

```typescript
enum FileAccess {
  // 常量成员
  None,
  Read = 1 << 1,
  Write = 1 << 2,
  ReadWrite = Read | Write,
  
  // 计算成员
  G = "123".length
}

console.log(FileAccess.Read);      // 2
console.log(FileAccess.Write);     // 4
console.log(FileAccess.ReadWrite); // 6
console.log(FileAccess.G);         // 3
```

## 实际应用示例

### 1. 状态管理

```typescript
enum OrderStatus {
  Pending,
  Processing,
  Shipped,
  Delivered,
  Cancelled
}

class Order {
  status: OrderStatus = OrderStatus.Pending;
  
  canCancel(): boolean {
    return this.status === OrderStatus.Pending || 
           this.status === OrderStatus.Processing;
  }
  
  ship(): void {
    if (this.status === OrderStatus.Processing) {
      this.status = OrderStatus.Shipped;
    }
  }
}
```

### 2. 配置选项

```typescript
enum LogLevel {
  DEBUG,
  INFO,
  WARN,
  ERROR
}

class Logger {
  constructor(private level: LogLevel) {}
  
  debug(message: string) {
    if (this.level <= LogLevel.DEBUG) {
      console.log(`[DEBUG] ${message}`);
    }
  }
  
  error(message: string) {
    if (this.level <= LogLevel.ERROR) {
      console.log(`[ERROR] ${message}`);
    }
  }
}

const logger = new Logger(LogLevel.INFO);
logger.debug("This won't be printed"); // 被过滤
logger.error("This will be printed");  // 会打印
```

### 3. 游戏开发中的方向控制

```typescript
enum Direction {
  North,
  South,
  East,
  West
}

class Player {
  x: number = 0;
  y: number = 0;
  
  move(direction: Direction) {
    switch (direction) {
      case Direction.North:
        this.y--;
        break;
      case Direction.South:
        this.y++;
        break;
      case Direction.East:
        this.x++;
        break;
      case Direction.West:
        this.x--;
        break;
    }
  }
}
```

## 最佳实践

### 1. 使用 PascalCase 命名

```typescript
// 推荐
enum HttpStatus {
  Ok = 200,
  NotFound = 404,
  InternalServerError = 500
}

// 不推荐
enum http_status {
  ok = 200,
  not_found = 404
}
```

### 2. 优先使用字符串枚举

```typescript
// 更清晰，调试友好
enum UserRole {
  Admin = "ADMIN",
  User = "USER",
  Guest = "GUEST"
}
```

### 3. 使用常量枚举提高性能

```typescript
// 在性能敏感的场景使用
const enum ScreenMode {
  Light,
  Dark,
  Auto
}

// 编译时会被内联，没有运行时开销
```

## 总结

TypeScript 枚举提供了以下优势：

1. **类型安全**：编译时检查，避免无效值
2. **可读性**：有意义的名称替代魔术数字
3. **维护性**：集中管理相关常量
4. **智能提示**：IDE 可以提供自动补全
5. **反向映射**：数字枚举支持通过值获取名称

枚举是 TypeScript 中非常有用的特性，特别适合表示固定集合的值，如状态、选项、方向等场景。