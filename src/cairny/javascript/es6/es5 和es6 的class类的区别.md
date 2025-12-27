---
title: es5 和es6 的class类的区别
---

## ES5 和 ES6 类的区别

ES5 和 ES6 中实现面向对象编程的方式有显著差异。ES6 引入了 `class` 语法，使 JavaScript 的类定义更加清晰和直观。

## ES5 中的类实现

在 ES5 中，类是通过构造函数和原型链来实现的：

```javascript
// ES5 构造函数
function PersonES5(name, age) {
    this.name = name;
    this.age = age;
}

// 在原型上添加方法
PersonES5.prototype.greet = function() {
    return "你好，我是" + this.name;
};

PersonES5.prototype.getInfo = function() {
    return this.name + "今年" + this.age + "岁";
};

// 静态方法
PersonES5.createAnonymous = function() {
    return new PersonES5("匿名", 0);
};

// 继承实现
function StudentES5(name, age, grade) {
    // 调用父构造函数
    PersonES5.call(this, name, age);
    this.grade = grade;
}

// 设置继承关系
StudentES5.prototype = Object.create(PersonES5.prototype);
StudentES5.prototype.constructor = StudentES5;

// 添加子类特有方法
StudentES5.prototype.study = function() {
    return this.name + "正在学习";
};

// 重写父类方法
StudentES5.prototype.greet = function() {
    return PersonES5.prototype.greet.call(this) + "，我是" + this.grade + "年级学生";
};

// 使用示例
var person = new PersonES5("张三", 25);
console.log(person.greet()); // 你好，我是张三

var student = new StudentES5("小明", 18, 12);
console.log(student.greet()); // 你好，我是小明，我是12年级学生
```

## ES6 中的 Class

ES6 引入了更简洁的 `class` 语法：

```javascript
// ES6 类
class PersonES6 {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    
    // 实例方法
    greet() {
        return `你好，我是${this.name}`;
    }
    
    getInfo() {
        return `${this.name}今年${this.age}岁`;
    }
    
    // 静态方法
    static createAnonymous() {
        return new PersonES6("匿名", 0);
    }
    
    // Getter 和 Setter
    get description() {
        return `${this.name} (${this.age}岁)`;
    }
    
    set nickname(value) {
        this.name = value;
    }
}

// 继承
class StudentES6 extends PersonES6 {
    constructor(name, age, grade) {
        super(name, age); // 调用父类构造函数
        this.grade = grade;
    }
    
    // 子类特有方法
    study() {
        return `${this.name}正在学习`;
    }
    
    // 重写父类方法
    greet() {
        return `${super.greet()}，我是${this.grade}年级学生`;
    }
}

// 使用示例
const person = new PersonES6("张三", 25);
console.log(person.greet()); // 你好，我是张三
console.log(person.description); // 张三 (25岁)
person.nickname = "三儿";
console.log(person.greet()); // 你好，我是三儿

const student = new StudentES6("小明", 18, 12);
console.log(student.greet()); // 你好，我是小明，我是12年级学生
```

## 主要区别详解

### 1. 语法差异

```javascript
// ES5 - 函数定义
function CarES5(brand, model) {
    this.brand = brand;
    this.model = model;
}

CarES5.prototype.start = function() {
    return `${this.brand} ${this.model} 启动了`;
};

// ES6 - 类定义
class CarES6 {
    constructor(brand, model) {
        this.brand = brand;
        this.model = model;
    }
    
    start() {
        return `${this.brand} ${this.model} 启动了`;
    }
}
```

### 2. 继承机制

```javascript
// ES5 继承 - 复杂且容易出错
function VehicleES5(type) {
    this.type = type;
}

VehicleES5.prototype.move = function() {
    return `${this.type} 正在移动`;
};

function CarES5(brand, model) {
    VehicleES5.call(this, "汽车"); // 调用父构造函数
    this.brand = brand;
    this.model = model;
}

CarES5.prototype = Object.create(VehicleES5.prototype);
CarES5.prototype.constructor = CarES5;

CarES5.prototype.start = function() {
    return `${this.brand} ${this.model} 启动了`;
};

// ES6 继承 - 简洁明了
class VehicleES6 {
    constructor(type) {
        this.type = type;
    }
    
    move() {
        return `${this.type} 正在移动`;
    }
}

class CarES6 extends VehicleES6 {
    constructor(brand, model) {
        super("汽车"); // 调用父类构造函数
        this.brand = brand;
        this.model = model;
    }
    
    start() {
        return `${this.brand} ${this.model} 启动了`;
    }
}
```

### 3. 静态方法和属性

```javascript
// ES5 静态方法
function MathUtilsES5() {}

MathUtilsES5.PI = 3.14159;
MathUtilsES5.add = function(a, b) {
    return a + b;
};

MathUtilsES5.prototype.calculateArea = function(radius) {
    return MathUtilsES5.PI * radius * radius;
};

// ES6 静态方法和属性
class MathUtilsES6 {
    static PI = 3.14159; // 静态属性（ES2022）
    
    static add(a, b) {
        return a + b;
    }
    
    calculateArea(radius) {
        return MathUtilsES6.PI * radius * radius;
    }
}

// ES2022之前定义静态属性的方式
class MathUtilsES6Old {
    static add(a, b) {
        return a + b;
    }
    
    calculateArea(radius) {
        return MathUtilsES6Old.PI * radius * radius;
    }
}
MathUtilsES6Old.PI = 3.14159;
```

### 4. Getter 和 Setter

```javascript
// ES5 Getter/Setter
function UserES5(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
}

Object.defineProperty(UserES5.prototype, 'fullName', {
    get: function() {
        return this.firstName + ' ' + this.lastName;
    },
    set: function(value) {
        var parts = value.split(' ');
        this.firstName = parts[0];
        this.lastName = parts[1];
    }
});

// ES6 Getter/Setter
class UserES6 {
    constructor(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }
    
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
    
    set fullName(value) {
        const parts = value.split(' ');
        this.firstName = parts[0];
        this.lastName = parts[1];
    }
}
```

### 5. 私有属性和方法

```javascript
// ES5 私有成员（通过闭包）
function BankAccountES5(initialBalance) {
    var balance = initialBalance; // 私有变量
    
    this.deposit = function(amount) {
        balance += amount;
        return balance;
    };
    
    this.getBalance = function() {
        return balance;
    };
}

// ES6 私有成员（通过命名约定或 WeakMap）
class BankAccountES6 {
    constructor(initialBalance) {
        this._balance = initialBalance; // 约定私有（但仍可访问）
    }
    
    deposit(amount) {
        this._balance += amount;
        return this._balance;
    }
    
    getBalance() {
        return this._balance;
    }
}

// 使用 WeakMap 实现真正的私有成员
const BankAccountPrivate = (function() {
    const privateData = new WeakMap();
    
    class BankAccountES6Private {
        constructor(initialBalance) {
            privateData.set(this, { balance: initialBalance });
        }
        
        deposit(amount) {
            const data = privateData.get(this);
            data.balance += amount;
            return data.balance;
        }
        
        getBalance() {
            const data = privateData.get(this);
            return data.balance;
        }
    }
    
    return BankAccountES6Private;
})();
```

### 6. 类提升行为

```javascript
// ES5 函数声明会被提升
console.log(PersonES5); // [Function: PersonES5]
function PersonES5(name) {
    this.name = name;
}

// ES6 类不会被提升
// console.log(PersonES6); // ReferenceError: Cannot access 'PersonES6' before initialization
class PersonES6 {
    constructor(name) {
        this.name = name;
    }
}
```

### 7. 严格模式

```javascript
// ES5 构造函数 - 非严格模式
function PersonES5(name) {
    this.name = name;
    // 在非严格模式下，this 可能是 undefined
    // 但不会抛出错误
}

// ES6 类 - 总是在严格模式下运行
class PersonES6 {
    constructor(name) {
        this.name = name;
        // 如果不使用 new 调用会抛出错误
    }
}

// const person = PersonES6("张三"); // TypeError: Class constructor PersonES6 cannot be invoked without 'new'
```

## 实际应用示例

```javascript
// 完整的示例：事件发射器

// ES5 实现
function EventEmitterES5() {
    this.events = {};
}

EventEmitterES5.prototype.on = function(event, callback) {
    if (!this.events[event]) {
        this.events[event] = [];
    }
    this.events[event].push(callback);
};

EventEmitterES5.prototype.emit = function(event, data) {
    if (this.events[event]) {
        this.events[event].forEach(callback => callback(data));
    }
};

// ES6 实现
class EventEmitterES6 {
    constructor() {
        this.events = new Map();
    }
    
    on(event, callback) {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        this.events.get(event).push(callback);
    }
    
    emit(event, data) {
        if (this.events.has(event)) {
            this.events.get(event).forEach(callback => callback(data));
        }
    }
}
```

## 总结

| 特性 | ES5 构造函数 | ES6 Class |
|------|-------------|-----------|
| 语法 | 复杂，需要原型操作 | 简洁，类似其他面向对象语言 |
| 继承 | 手动设置原型链 | 使用 `extends` 和 `super` |
| 静态方法 | 通过构造函数属性添加 | 使用 `static` 关键字 |
| Getter/Setter | 使用 `Object.defineProperty` | 使用 get/`set` 关键字 |
| 私有成员 | 通过闭包实现 | 需要特殊技巧或约定 |
| 提升 | 函数声明会被提升 | 类不会被提升 |
| 严格模式 | 需要显式声明 | 自动在严格模式下运行 |
| 可读性 | 较差 | 更好 |

ES6 的 `class` 语法并没有改变 JavaScript 基于原型的本质，而是提供了一种更清晰、更易于理解的语法糖，使面向对象编程在 JavaScript 中更加直观和易于维护。
