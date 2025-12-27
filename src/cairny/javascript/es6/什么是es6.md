---
title: 什么是es6
---

ES6（ECMAScript 2015）是JavaScript语言的一个重要版本，它引入了许多新特性和语法改进，使得JavaScript更加强大和现代化。

## ES6 主要特性详解

### 1. `let` 和 `const` 声明
ES6 引入了块级作用域变量声明：
- `let`: 声明可重新赋值的变量
- `const`: 声明不可重新赋值的常量

```javascript
// ES5
var name = "张三";
if (true) {
    var name = "李四";
    console.log(name); // 李四
}
console.log(name); // 李四 (var没有块级作用域)

// ES6
let age = 25;
if (true) {
    let age = 30;
    console.log(age); // 30
}
console.log(age); // 25 (let有块级作用域)

const PI = 3.14159;
// PI = 3.14; // 报错：不能重新赋值常量
```

### 2. 箭头函数（Arrow Functions）
简化函数语法，同时改变了 `this` 的绑定行为：

```javascript
// ES5 函数
function add(a, b) {
    return a + b;
}

var multiply = function(a, b) {
    return a * b;
};

// ES6 箭头函数
const add = (a, b) => a + b;
const multiply = (a, b) => {
    return a * b;
};

// 箭头函数中的this绑定
class Calculator {
    constructor() {
        this.result = 0;
    }
    
    // 普通函数
    addNormal(num) {
        setTimeout(function() {
            // this指向全局对象，不是Calculator实例
            this.result += num; // 错误
        }, 100);
    }
    
    // 箭头函数
    addArrow(num) {
        setTimeout(() => {
            // this继承自外层作用域，指向Calculator实例
            this.result += num; // 正确
        }, 100);
    }
}
```

### 3. 模板字符串（Template Literals）
使用反引号 `` ` `` 和 `${}` 语法：

```javascript
// ES5
var name = "王五";
var age = 28;
var message = "我的名字是" + name + "，今年" + age + "岁";

// ES6
const name = "王五";
const age = 28;
const message = `我的名字是${name}，今年${age}岁`;

// 支持多行字符串
const html = `
<div>
    <h1>${name}</h1>
    <p>年龄：${age}</p>
</div>
`;
```

### 4. 解构赋值（Destructuring）
从数组或对象中提取值并赋给变量：

```javascript
// 数组解构
const numbers = [1, 2, 3, 4, 5];
const [first, second, ...rest] = numbers;
console.log(first); // 1
console.log(second); // 2
console.log(rest); // [3, 4, 5]

// 对象解构
const person = {
    name: "赵六",
    age: 32,
    job: "工程师"
};

const { name, age, job } = person;
console.log(name); // 赵六
console.log(age); // 32

// 重命名
const { name: fullName, age: personAge } = person;
console.log(fullName); // 赵六
```

### 5. 类（Classes）
ES6 引入了更清晰的面向对象语法：

```javascript
// ES5 构造函数
function PersonES5(name, age) {
    this.name = name;
    this.age = age;
}

PersonES5.prototype.greet = function() {
    return "你好，我是" + this.name;
};

// ES6 类
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    
    greet() {
        return `你好，我是${this.name}`;
    }
    
    // 静态方法
    static getSpecies() {
        return "人类";
    }
}

// 继承
class Student extends Person {
    constructor(name, age, grade) {
        super(name, age); // 调用父类构造函数
        this.grade = grade;
    }
    
    study() {
        return `${this.name}正在学习`;
    }
    
    // 重写父类方法
    greet() {
        return super.greet() + `，我是${this.grade}年级学生`;
    }
}

const student = new Student("小明", 18, 12);
console.log(student.greet()); // 你好，我是小明，我是12年级学生
```

### 6. 模块（Modules）
ES6 提供了原生的模块系统：

```javascript
// math.js - 导出模块
export const PI = 3.14159;

export function add(a, b) {
    return a + b;
}

export function multiply(a, b) {
    return a * b;
}

// 默认导出
export default function subtract(a, b) {
    return a - b;
}

// 另一种导出方式
const divide = (a, b) => a / b;
export { divide };

// main.js - 导入模块
import subtract, { PI, add, multiply, divide } from './math.js';
import { add as sum } from './math.js'; // 重命名导入

console.log(PI); // 3.14159
console.log(add(2, 3)); // 5
console.log(subtract(5, 3)); // 2
```

### 7. Promise 和异步处理
更好的异步编程方式：

```javascript
// ES5 回调地狱
function fetchData(callback) {
    setTimeout(() => {
        callback(null, "数据");
    }, 1000);
}

fetchData((err, data) => {
    if (!err) {
        processData(data, (err, result) => {
            if (!err) {
                saveData(result, (err) => {
                    if (!err) {
                        console.log("完成");
                    }
                });
            }
        });
    }
});

// ES6 Promise
function fetchData() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("数据");
        }, 1000);
    });
}

fetchData()
    .then(data => processData(data))
    .then(result => saveData(result))
    .then(() => console.log("完成"))
    .catch(err => console.error(err));
```

### 8. 其他重要特性

#### 展开运算符（Spread Operator）
```javascript
// 数组展开
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]

// 对象展开
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
const merged = { ...obj1, ...obj2 }; // { a: 1, b: 2, c: 3, d: 4 }
```

#### 默认参数
```javascript
function greet(name = "陌生人", greeting = "你好") {
    return `${greeting}，${name}！`;
}

console.log(greet()); // 你好，陌生人！
console.log(greet("张三")); // 你好，张三！
```

## ES6 的重要性

1. **现代化语法**：使代码更简洁、易读
2. **功能增强**：提供了更多强大的语言特性
3. **开发效率**：减少样板代码，提高开发速度
4. **生态支持**：现代浏览器和Node.js都支持ES6
5. **工具链成熟**：Babel等工具可以将ES6转换为兼容性更好的ES5

ES6 是现代JavaScript开发的基础，掌握这些特性对于前端工程师来说至关重要。