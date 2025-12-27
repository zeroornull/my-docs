---
title: ES6中 Decorator
---

## ES6 中 Decorator（装饰器）

Decorator（装饰器）是一种特殊类型的声明，可以被附加到类声明、方法、访问符、属性或参数上。装饰器使用 `@expression` 这种形式，其中 `expression` 求值后必须为一个函数，它会在运行时被调用，被装饰的声明信息作为参数传入。

**注意**：装饰器目前还不是正式的 ECMAScript 标准，属于 Stage 3 提案，需要使用 Babel 等工具进行转换才能使用。

## 装饰器的基本语法

```javascript
// 类装饰器
@decorator
class MyClass {
  // ...
}

// 方法装饰器
class MyClass {
  @decorator
  method() {
    // ...
  }
}

// 属性装饰器
class MyClass {
  @decorator
  property;
}
```

## 装饰器的实现原理

```javascript
// 装饰器本质上是一个函数
function decorator(target, propertyKey, descriptor) {
  // target: 被装饰的目标
  // propertyKey: 被装饰的属性名
  // descriptor: 属性描述符
  console.log('装饰器被调用');
  return descriptor;
}
```

## 各种类型的装饰器

### 1. 类装饰器

类装饰器应用于类构造函数，可以用来监视、修改或替换类定义。

```javascript
// 类装饰器示例
function logClass(target) {
  console.log('类装饰器:', target.name);
  // 可以修改类的构造函数或原型
  target.prototype.addedProperty = '这是通过装饰器添加的属性';
}

@logClass
class Person {
  constructor(name) {
    this.name = name;
  }
}

const person = new Person('张三');
console.log(person.addedProperty); // 这是通过装饰器添加的属性
```

### 2. 方法装饰器

方法装饰器应用于方法的属性描述符，可以用来监视、修改或替换方法定义。

```javascript
// 方法装饰器示例
function readonly(target, propertyKey, descriptor) {
  console.log(`方法 ${propertyKey} 被设为只读`);
  descriptor.writable = false;
  return descriptor;
}

function log(target, propertyKey, descriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args) {
    console.log(`调用方法 ${propertyKey}`);
    const result = originalMethod.apply(this, args);
    console.log(`方法 ${propertyKey} 执行完成`);
    return result;
  };
  
  return descriptor;
}

class Calculator {
  @readonly
  @log
  add(a, b) {
    return a + b;
  }
}

const calc = new Calculator();
console.log(calc.add(2, 3)); // 调用方法 add -> 方法 add 执行完成 -> 5

// calc.add = function() {}; // 由于 readonly 装饰器，这会失败（在严格模式下抛出错误）
```

### 3. 访问器装饰器

访问器装饰器应用于访问器的属性描述符，可以用来监视、修改或替换访问器的定义。

```javascript
function configurable(value) {
  return function(target, propertyKey, descriptor) {
    descriptor.configurable = value;
  };
}

class Point {
  constructor(x, y) {
    this._x = x;
    this._y = y;
  }
  
  @configurable(false)
  get x() {
    return this._x;
  }
  
  @configurable(false)
  get y() {
    return this._y;
  }
}
```

### 4. 属性装饰器

属性装饰器应用于类的属性声明，可以用来监视、修改或替换属性定义。

```javascript
function format(formatString) {
  return function(target, propertyKey) {
    // 属性装饰器的返回值会被忽略
    // 通常用于记录元数据
    console.log(`属性 ${propertyKey} 使用格式: ${formatString}`);
  };
}

class User {
  @format("YYYY-MM-DD")
  createdAt;
  
  @format("email")
  email;
}
```

### 5. 参数装饰器

参数装饰器应用于类构造函数或方法的参数，可以用来监视、修改或替换参数定义。

```javascript
function required(target, propertyKey, parameterIndex) {
  console.log(`参数 ${parameterIndex} 在方法 ${propertyKey} 中是必需的`);
}

class UserService {
  getUser(@required id) {
    // ...
  }
}
```

## 实际使用场景

### 1. 日志记录

```javascript
// 方法执行日志装饰器
function logExecution(target, propertyKey, descriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args) {
    console.log(`[${new Date().toISOString()}] 调用 ${target.constructor.name}.${propertyKey}`);
    console.log(`参数:`, args);
    
    const result = originalMethod.apply(this, args);
    
    console.log(`返回值:`, result);
    return result;
  };
  
  return descriptor;
}

class BankAccount {
  constructor(balance = 0) {
    this.balance = balance;
  }
  
  @logExecution
  deposit(amount) {
    this.balance += amount;
    return this.balance;
  }
  
  @logExecution
  withdraw(amount) {
    if (amount <= this.balance) {
      this.balance -= amount;
      return this.balance;
    }
    throw new Error('余额不足');
  }
}

const account = new BankAccount(1000);
account.deposit(500); // 会输出详细的日志
account.withdraw(200); // 会输出详细的日志
```

### 2. 权限验证

```javascript
// 权限验证装饰器
function requireRole(role) {
  return function(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = function(...args) {
      // 假设 this.currentUser 存在
      if (!this.currentUser || !this.currentUser.roles.includes(role)) {
        throw new Error(`需要 ${role} 权限`);
      }
      
      return originalMethod.apply(this, args);
    };
    
    return descriptor;
  };
}

class AdminPanel {
  constructor(currentUser) {
    this.currentUser = currentUser;
  }
  
  @requireRole('admin')
  deleteUser(userId) {
    console.log(`删除用户 ${userId}`);
  }
  
  @requireRole('moderator')
  moderatePost(postId) {
    console.log(`审核帖子 ${postId}`);
  }
}

const adminUser = { roles: ['user', 'admin'] };
const moderatorUser = { roles: ['user', 'moderator'] };

const adminPanel1 = new AdminPanel(adminUser);
adminPanel1.deleteUser(123); // 成功

const adminPanel2 = new AdminPanel(moderatorUser);
// adminPanel2.deleteUser(123); // 抛出错误: 需要 admin 权限
adminPanel2.moderatePost(456); // 成功
```

### 3. 缓存实现

```javascript
// 简单缓存装饰器
function cache(target, propertyKey, descriptor) {
  const originalMethod = descriptor.value;
  const cache = new Map();
  
  descriptor.value = function(...args) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      console.log('从缓存返回结果');
      return cache.get(key);
    }
    
    const result = originalMethod.apply(this, args);
    cache.set(key, result);
    console.log('计算并缓存结果');
    return result;
  };
  
  return descriptor;
}

class MathService {
  @cache
  fibonacci(n) {
    if (n <= 1) return n;
    return this.fibonacci(n - 1) + this.fibonacci(n - 2);
  }
  
  @cache
  expensiveCalculation(a, b) {
    // 模拟耗时计算
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += (a * b) / (i + 1);
    }
    return result;
  }
}

const mathService = new MathService();
console.log(mathService.fibonacci(10)); // 计算并缓存结果 -> 55
console.log(mathService.fibonacci(10)); // 从缓存返回结果 -> 55
```

### 4. 防抖和节流

```javascript
// 防抖装饰器
function debounce(delay) {
  return function(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    let timeoutId = null;
    
    descriptor.value = function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        originalMethod.apply(this, args);
      }, delay);
    };
    
    return descriptor;
  };
}

// 节流装饰器
function throttle(delay) {
  return function(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    let lastExecTime = 0;
    
    descriptor.value = function(...args) {
      const now = Date.now();
      if (now - lastExecTime > delay) {
        originalMethod.apply(this, args);
        lastExecTime = now;
      }
    };
    
    return descriptor;
  };
}

class SearchComponent {
  constructor() {
    this.searchResults = [];
  }
  
  @debounce(300)
  handleSearch(query) {
    console.log(`搜索: ${query}`);
    // 实际的搜索逻辑
  }
  
  @throttle(1000)
  handleScroll() {
    console.log('处理滚动事件');
    // 实际的滚动处理逻辑
  }
}
```

### 5. 数据验证

```javascript
// 数据验证装饰器
function validate(...validators) {
  return function(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = function(...args) {
      for (let i = 0; i < validators.length; i++) {
        const validator = validators[i];
        if (!validator(args[i])) {
          throw new Error(`参数 ${i} 验证失败`);
        }
      }
      
      return originalMethod.apply(this, args);
    };
    
    return descriptor;
  };
}

// 验证函数
const isString = (value) => typeof value === 'string';
const isNumber = (value) => typeof value === 'number' && !isNaN(value);
const isPositive = (value) => value > 0;

class UserService {
  @validate(isString, isNumber)
  createUser(name, age) {
    return { name, age };
  }
  
  @validate(isString, isNumber, isPositive)
  createAccount(username, balance, minAmount) {
    return { username, balance, minAmount };
  }
}

const userService = new UserService();
userService.createUser('张三', 25); // 成功
// userService.createUser('李四', '不是数字'); // 抛出错误: 参数 1 验证失败
```

### 6. 性能监控

```javascript
// 性能监控装饰器
function performanceMonitor(target, propertyKey, descriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args) {
    const start = performance.now();
    const result = originalMethod.apply(this, args);
    const end = performance.now();
    
    console.log(`${target.constructor.name}.${propertyKey} 执行时间: ${end - start} 毫秒`);
    return result;
  };
  
  return descriptor;
}

class DataProcessor {
  @performanceMonitor
  processData(data) {
    // 模拟耗时操作
    let result = [];
    for (let i = 0; i < data.length; i++) {
      result.push(data[i] * 2);
    }
    return result;
  }
  
  @performanceMonitor
  complexCalculation(n) {
    let result = 0;
    for (let i = 0; i < n; i++) {
      result += Math.sqrt(i);
    }
    return result;
  }
}

const processor = new DataProcessor();
processor.processData(new Array(1000000).fill(1)); // 输出执行时间
processor.complexCalculation(100000); // 输出执行时间
```

## 装饰器工厂

装饰器工厂是可以接收参数并返回装饰器函数的函数：

```javascript
// 装饰器工厂示例
function logWithPrefix(prefix) {
  return function(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = function(...args) {
      console.log(`[${prefix}] 调用 ${propertyKey}`);
      return originalMethod.apply(this, args);
    };
    
    return descriptor;
  };
}

class ApiClient {
  @logWithPrefix('API')
  fetchData(url) {
    console.log(`获取数据: ${url}`);
  }
  
  @logWithPrefix('AUTH')
  authenticate(token) {
    console.log(`验证令牌: ${token}`);
  }
}

const client = new ApiClient();
client.fetchData('/api/users'); // [API] 调用 fetchData
client.authenticate('abc123'); // [AUTH] 调用 authenticate
```

## 总结

装饰器的主要使用场景包括：

1. **日志记录**：自动记录方法调用、参数和返回值
2. **权限控制**：在方法执行前检查用户权限
3. **缓存机制**：缓存方法的计算结果以提高性能
4. **防抖节流**：控制函数执行频率
5. **数据验证**：验证方法参数的有效性
6. **性能监控**：监控方法执行时间
7. **错误处理**：统一处理方法中的异常
8. **依赖注入**：自动注入依赖项
9. **路由定义**：在框架中定义路由处理函数
10. **序列化控制**：控制对象的序列化和反序列化行为

装饰器提供了一种声明式的方式来增强类和类成员的功能，使代码更加模块化和可复用。虽然目前还不是正式标准，但在 Angular、NestJS 等框架中得到了广泛应用。