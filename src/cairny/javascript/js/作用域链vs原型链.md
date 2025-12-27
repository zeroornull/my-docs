---
title: 作用域链vs原型链
--- 


###### 作用域链 (Scope Chain)
**定义：**
* 作用域链是JavaScript中用于解析变量和函数访问权限的机制。当代码在一个执行上下文中访问变量时，JavaScript引擎会沿着作用域链从内向外查找该变量。

**特点：**
  1. 与函数调用和变量访问相关
  2. 决定变量的可见性和生命周期
  3. 在函数定义时就已经确定（词法作用域）
  4. 由执行上下文的变量对象(VO)或活动对象(AO)构成

**示例:**
```javascript
function outer() {
    var outerVar = 'outer';
    
    function inner() {
        var innerVar = 'inner';
        console.log(outerVar); // 可以访问outerVar
    }
    
    inner();
}

outer();
```

**在这个例子中：**
* inner函数的作用域链包含：inner的活动对象 → outer的活动对象 → 全局对象
* 当inner访问outerVar时，会沿着这条链查找


##### 原型链 (Prototype Chain)
**定义:**
* 原型链是JavaScript实现继承的机制。当访问一个对象的属性时，如果对象本身没有该属性，JavaScript会沿着原型链向上查找。

**特点:**
  1. 与对象属性和方法继承相关
  2. 用于实现基于原型的继承
  3. 每个对象都有一个内部属性[[Prototype]]（可通过__proto__或Object.getPrototypeOf()访问）
  4. 构造函数有prototype属性，实例对象的__proto__指向构造函数的prototype

**示例:**
```javascript
function Person(name) {
    this.name = name;
}

Person.prototype.sayHello = function() {
    console.log('Hello, ' + this.name);
};

var john = new Person('John');
john.sayHello(); // 调用继承的方法
```

**在这个例子中：**
  1. john对象本身没有sayHello方法
  2. JavaScript会查找john.__proto__（即Person.prototype）找到该方法
  3. 如果还没找到，会继续查找Person.prototype.__proto__（即Object.prototype）


##### 区别对比
| 特性         | 作用域链                    | 原型链                           |
| ------------ | --------------------------- | -------------------------------- |
| **目的**     | 确定变量的可访问性          | 实现对象属性的继承               |
| **创建时机** | 函数定义时                  | 对象创建时                       |
| **组成**     | 变量对象/活动对象链         | 对象原型链                       |
| **查找方向** | 从内向外（当前作用域→外层） | 从下向上（对象→原型→原型的原型） |
| **应用场景** | 变量和函数访问              | 对象属性和方法访问               |
| **修改方式** | 通过函数嵌套                | 通过修改`prototype`或`__proto__` |


##### 综合示例
```javascript
// 作用域链示例
var globalVar = 'global';

function createCounter() {
    var count = 0;
    
    return function() {
        count++;
        console.log(count);
    };
}

var counter = createCounter();
counter(); // 1
counter(); // 2

// 原型链示例
function Animal(name) {
    this.name = name;
}

Animal.prototype.speak = function() {
    console.log(this.name + ' makes a noise.');
};

function Dog(name) {
    Animal.call(this, name);
}

Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.speak = function() {
    console.log(this.name + ' barks.');
};

var dog = new Dog('Rex');
dog.speak(); // Rex barks.
```
**在这个综合示例中：**
* createCounter函数展示了作用域链：内部函数可以访问外部函数的count变量
* Dog继承自Animal展示了原型链：Dog实例可以访问Animal原型上的方法

##### 总结
* 作用域链和原型链是JavaScript中两个核心机制，虽然它们都涉及"链式查找"，但解决的问题完全不同：
    1. 作用域链解决的是"在哪里可以找到这个变量"的问题
    2. 原型链解决的是"这个对象如何继承属性和方法"的问题

