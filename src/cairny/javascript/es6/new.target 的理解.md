---
title: new.target 的理解
---

# new.target 的理解

`new.target` 是 ES6 引入的一个元属性（meta property），用于检测函数或构造器是否通过 `new` 运算符被调用。它在构造函数中特别有用，可以帮助我们实现更灵活的构造函数行为。

## 1. 基本概念

### 什么是 new.target？

`new.target` 是一个类似属性的元属性，它指向通过 `new` 调用的构造函数。如果函数不是通过 `new` 调用的，`new.target` 的值为 `undefined`。

### 工作原理

```javascript
function exampleFunction() {
  console.log('new.target:', new.target);
}

// 直接调用
exampleFunction(); // new.target: undefined

// 通过 new 调用
new exampleFunction(); // new.target: [Function: exampleFunction]
```

## 2. 在构造函数中的应用

### 基本用法

```javascript
function Person(name) {
  if (!new.target) {
    // 如果没有使用 new 调用，抛出错误或重定向
    throw new Error('Person must be called with new');
  }
  this.name = name;
}

// 正确调用
const person1 = new Person('Alice'); // 正常工作

// 错误调用
try {
  const person2 = Person('Bob'); // 抛出错误
} catch (error) {
  console.log(error.message); // Person must be called with new
}
```

### 提供更友好的调用方式

```javascript
function User(name, email) {
  // 如果没有使用 new 调用，自动加上 new
  if (!new.target) {
    return new User(name, email);
  }
  
  this.name = name;
  this.email = email;
}

// 两种调用方式都可以
const user1 = new User('Alice', 'alice@example.com');
const user2 = User('Bob', 'bob@example.com');

console.log(user1 instanceof User); // true
console.log(user2 instanceof User); // true
```

## 3. 在类中的应用

### 基本类用法

```javascript
class Animal {
  constructor(name) {
    if (!new.target) {
      throw new Error('Animal must be instantiated with new');
    }
    this.name = name;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }
}

// 正确使用
const dog = new Dog('Buddy', 'Golden Retriever');
console.log(dog.name);  // Buddy
console.log(dog.breed); // Golden Retriever

// 错误使用
try {
  const animal = Animal('Generic'); // 抛出错误
} catch (error) {
  console.log(error.message); // Animal must be instantiated with new
}
```

### 检测具体的构造函数

```javascript
class Vehicle {
  constructor(brand) {
    console.log('new.target in Vehicle:', new.target.name);
    this.brand = brand;
  }
}

class Car extends Vehicle {
  constructor(brand, model) {
    console.log('new.target in Car:', new.target.name);
    super(brand);
    this.model = model;
  }
}

class ElectricCar extends Car {
  constructor(brand, model, batteryCapacity) {
    console.log('new.target in ElectricCar:', new.target.name);
    super(brand, model);
    this.batteryCapacity = batteryCapacity;
  }
}

// 创建实例
const tesla = new ElectricCar('Tesla', 'Model S', '100kWh');

// 输出:
// new.target in ElectricCar: ElectricCar
// new.target in Car: ElectricCar
// new.target in Vehicle: ElectricCar
```

## 4. 实现抽象类模式

```javascript
class AbstractDatabase {
  constructor() {
    if (new.target === AbstractDatabase) {
      throw new Error('Cannot instantiate abstract class AbstractDatabase directly');
    }
    
    // 确保子类实现了必要的方法
    if (this.connect === undefined) {
      throw new Error('Must implement connect method');
    }
  }
  
  // 抽象方法（应该由子类实现）
  connect() {
    throw new Error('Abstract method connect() must be implemented');
  }
}

class MySQLDatabase extends AbstractDatabase {
  constructor(config) {
    super();
    this.config = config;
  }
  
  connect() {
    console.log(`Connecting to MySQL with config: ${JSON.stringify(this.config)}`);
  }
}

class PostgreSQLDatabase extends AbstractDatabase {
  constructor(config) {
    super();
    this.config = config;
  }
  
  connect() {
    console.log(`Connecting to PostgreSQL with config: ${JSON.stringify(this.config)}`);
  }
}

// 尝试直接实例化抽象类
try {
  const db = new AbstractDatabase(); // 抛出错误
} catch (error) {
  console.log(error.message); // Cannot instantiate abstract class AbstractDatabase directly
}

// 正确使用子类
const mysql = new MySQLDatabase({ host: 'localhost', port: 3306 });
mysql.connect(); // Connecting to MySQL with config: {"host":"localhost","port":3306}

const postgres = new PostgreSQLDatabase({ host: 'localhost', port: 5432 });
postgres.connect(); // Connecting to PostgreSQL with config: {"host":"localhost","port":5432}
```

## 5. 工厂模式实现

```javascript
class Shape {
  constructor() {
    if (new.target === Shape) {
      throw new Error('Shape is abstract and cannot be instantiated directly');
    }
  }
  
  static create(type, ...args) {
    switch (type) {
      case 'circle':
        return new Circle(...args);
      case 'rectangle':
        return new Rectangle(...args);
      case 'triangle':
        return new Triangle(...args);
      default:
        throw new Error(`Unknown shape type: ${type}`);
    }
  }
}

class Circle extends Shape {
  constructor(radius) {
    super();
    this.radius = radius;
  }
  
  get area() {
    return Math.PI * this.radius ** 2;
  }
}

class Rectangle extends Shape {
  constructor(width, height) {
    super();
    this.width = width;
    this.height = height;
  }
  
  get area() {
    return this.width * this.height;
  }
}

class Triangle extends Shape {
  constructor(base, height) {
    super();
    this.base = base;
    this.height = height;
  }
  
  get area() {
    return 0.5 * this.base * this.height;
  }
}

// 使用工厂方法
const circle = Shape.create('circle', 5);
const rectangle = Shape.create('rectangle', 4, 6);
const triangle = Shape.create('triangle', 3, 8);

console.log(circle.area);      // 78.53981633974483
console.log(rectangle.area);   // 24
console.log(triangle.area);    // 12

// 直接实例化会报错
try {
  const shape = new Shape(); // 抛出错误
} catch (error) {
  console.log(error.message); // Shape is abstract and cannot be instantiated directly
}
```

## 6. 单例模式实现

```javascript
class Singleton {
  constructor() {
    if (new.target !== Singleton) {
      throw new Error('Singleton must be instantiated through Singleton.getInstance()');
    }
    
    if (Singleton.instance) {
      return Singleton.instance;
    }
    
    this.createdAt = new Date();
    Singleton.instance = this;
  }
  
  static getInstance() {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }
  
  static reset() {
    Singleton.instance = null;
  }
}

// 正确使用单例
const instance1 = Singleton.getInstance();
const instance2 = Singleton.getInstance();

console.log(instance1 === instance2); // true
console.log(instance1.createdAt === instance2.createdAt); // true

// 尝试直接实例化会报错
try {
  const directInstance = new Singleton(); // 抛出错误
} catch (error) {
  console.log(error.message); // Singleton must be instantiated through Singleton.getInstance()
}
```

## 7. 与箭头函数的差异

```javascript
function RegularFunction() {
  console.log('Regular function new.target:', new.target);
}

const ArrowFunction = () => {
  // 箭头函数没有自己的 this、arguments、super 或 new.target
  // console.log('Arrow function new.target:', new.target); // SyntaxError
};

// Regular function
RegularFunction(); // Regular function new.target: undefined
new RegularFunction(); // Regular function new.target: [Function: RegularFunction]

// Arrow function (不能用 new 调用)
try {
  new ArrowFunction(); // TypeError: ArrowFunction is not a constructor
} catch (error) {
  console.log(error.message); // ArrowFunction is not a constructor
}
```

## 8. 实际应用场景

### 防止误用的构造函数

```javascript
class ConfigManager {
  constructor(config = {}) {
    // 确保通过 new 调用
    if (!new.target) {
      console.warn('ConfigManager should be instantiated with new keyword');
      return new ConfigManager(config);
    }
    
    this.config = { ...config };
  }
  
  get(key) {
    return this.config[key];
  }
  
  set(key, value) {
    this.config[key] = value;
    return this;
  }
}

// 两种方式都可以工作
const config1 = new ConfigManager({ api: 'https://api.example.com' });
const config2 = ConfigManager({ debug: true });

console.log(config1.get('api'));   // https://api.example.com
console.log(config2.get('debug')); // true
```

### 版本兼容性检查

```javascript
class ModernClass {
  constructor(options = {}) {
    // 检查是否使用了新的调用方式
    if (new.target) {
      console.log('Using modern instantiation');
      this.options = options;
    } else {
      // 向后兼容旧的工厂函数调用
      console.log('Using legacy factory pattern');
      return ModernClass.create(options);
    }
  }
  
  static create(options) {
    return new ModernClass(options);
  }
}

// 现代方式
const instance1 = new ModernClass({ modern: true });

// 兼容方式
const instance2 = ModernClass.create({ legacy: true });
const instance3 = ModernClass({ auto: true });
```

## 总结

`new.target` 是一个强大的元属性，主要用途包括：

1. **构造函数验证** - 确保函数通过 `new` 调用
2. **抽象类实现** - 防止直接实例化基类
3. **灵活的实例化** - 提供多种调用方式
4. **继承链检测** - 识别实际被调用的构造函数
5. **设计模式实现** - 支持单例、工厂等模式

它为 JavaScript 提供了更精细的构造函数控制能力，使得面向对象编程更加灵活和安全。