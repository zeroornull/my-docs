---
title: ES6中函数新增的扩展
---

## ES6 中函数的新增扩展

ES6 为函数带来了许多重要的新特性和扩展，使 JavaScript 函数更加灵活和强大。

## 1. 默认参数（Default Parameters）

### ES5 方式
```javascript
// ES5 中设置默认参数
function greetES5(name, greeting) {
    name = name || '陌生人';
    greeting = greeting || '你好';
    return greeting + '，' + name + '！';
}

console.log(greetES5()); // 你好，陌生人！
console.log(greetES5('张三')); // 你好，张三！
```

### ES6 默认参数
```javascript
// ES6 默认参数
function greetES6(name = '陌生人', greeting = '你好') {
    return `${greeting}，${name}！`;
}

console.log(greetES6()); // 你好，陌生人！
console.log(greetES6('张三')); // 你好，张三！
console.log(greetES6('李四', '欢迎')); // 欢迎，李四！

// 复杂默认参数
function createUser(name, age = 18, profile = {}) {
    return {
        name,
        age,
        profile: {
            city: '未知',
            ...profile
        }
    };
}

console.log(createUser('王五')); 
// { name: '王五', age: 18, profile: { city: '未知' } }

// 默认参数可以引用前面的参数
function multiply(a, b = a) {
    return a * b;
}

console.log(multiply(5)); // 25 (5 * 5)
console.log(multiply(5, 3)); // 15 (5 * 3)
```

## 2. 剩余参数（Rest Parameters）

### ES5 处理不定参数
```javascript
// ES5 使用 arguments 对象
function sumES5() {
    var total = 0;
    for (var i = 0; i < arguments.length; i++) {
        total += arguments[i];
    }
    return total;
}

console.log(sumES5(1, 2, 3, 4, 5)); // 15
```

### ES6 剩余参数
```javascript
// ES6 剩余参数
function sumES6(...numbers) {
    return numbers.reduce((total, num) => total + num, 0);
}

console.log(sumES6(1, 2, 3, 4, 5)); // 15

// 结合普通参数使用
function introduce(name, ...hobbies) {
    return `${name} 的爱好有：${hobbies.join('、')}`;
}

console.log(introduce('张三', '读书', '游泳', '编程'));
// 张三 的爱好有：读书、游泳、编程

// 数组操作
function findMax(first, ...rest) {
    return Math.max(first, ...rest);
}

console.log(findMax(1, 5, 3, 9, 2)); // 9
```

## 3. 扩展运算符（Spread Operator）

```javascript
// 数组扩展
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]

// 复制数组
const arrCopy = [...arr1]; // 浅拷贝

// 字符串扩展
const str = 'hello';
const chars = [...str]; // ['h', 'e', 'l', 'l', 'o']

// 函数调用
function add(a, b, c) {
    return a + b + c;
}

const numbers = [1, 2, 3];
console.log(add(...numbers)); // 6

// 构造函数调用
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
}

const personData = ['张三', 25];
const person = new Person(...personData);
console.log(person); // Person { name: '张三', age: 25 }
```

## 4. 箭头函数（Arrow Functions）

```javascript
// 基本语法
const add = (a, b) => a + b;
const square = x => x * x;
const greet = () => 'Hello!';

// 多行箭头函数
const processData = (data) => {
    const processed = data.map(item => item * 2);
    return processed.filter(item => item > 10);
};

// 数组方法中的应用
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
const evens = numbers.filter(n => n % 2 === 0);
const sum = numbers.reduce((acc, n) => acc + n, 0);

// 事件处理
class Button {
    constructor(element) {
        this.clickCount = 0;
        element.addEventListener('click', () => {
            this.clickCount++;
            console.log(`点击了 ${this.clickCount} 次`);
        });
    }
}
```

## 5. 函数属性和方法扩展

### name 属性
```javascript
// 函数的 name 属性
function myFunction() {}
console.log(myFunction.name); // "myFunction"

const anonymousFunc = function() {};
console.log(anonymousFunc.name); // "anonymousFunc"

const arrowFunc = () => {};
console.log(arrowFunc.name); // "arrowFunc"

// bind 后的函数名
const boundFunc = myFunction.bind({});
console.log(boundFunc.name); // "bound myFunction"
```

## 6. 块级函数
```javascript
// ES6 允许在块级作用域中声明函数
{
    function blockFunction() {
        return '块级函数';
    }
    
    console.log(blockFunction()); // 正常工作
}

// 在严格模式下，块级函数有块级作用域
'use strict';
{
    function strictBlockFunction() {
        return '严格模式下的块级函数';
    }
}

// console.log(strictBlockFunction()); // ReferenceError
```

## 7. 参数解构
```javascript
// 对象解构参数
function createUser({ name, age, email = 'unknown@example.com' }) {
    return {
        name,
        age,
        email,
        createdAt: new Date()
    };
}

const userData = { name: '张三', age: 25 };
console.log(createUser(userData));
// { name: '张三', age: 25, email: 'unknown@example.com', createdAt: ... }

// 数组解构参数
function processCoordinates([x, y, z = 0]) {
    return { x, y, z, magnitude: Math.sqrt(x*x + y*y + z*z) };
}

console.log(processCoordinates([3, 4])); // { x: 3, y: 4, z: 0, magnitude: 5 }

// 复杂解构
function configureApp({
    theme = 'light',
    language = 'zh',
    features: {
        notifications = true,
        analytics = false
    } = {}
} = {}) {
    return {
        theme,
        language,
        features: {
            notifications,
            analytics
        }
    };
}

console.log(configureApp({
    theme: 'dark',
    features: { notifications: false }
}));
// { theme: 'dark', language: 'zh', features: { notifications: false, analytics: false } }
```

## 8. 函数参数的尾逗号
```javascript
// 函数参数支持尾逗号（ES2017）
function myFunction(
    param1,
    param2,
    param3, // 尾逗号
) {
    // 函数体
}

// 调用时也支持
myFunction(
    'arg1',
    'arg2',
    'arg3', // 尾逗号
);
```

## 9. 实际应用场景

### 配置函数
```javascript
// 使用默认参数和解构创建灵活的配置函数
function createChart({
    type = 'line',
    width = 800,
    height = 600,
    colors = ['#ff6b6b', '#4ecdc4', '#45b7d1'],
    data = [],
    options = {}
} = {}) {
    return {
        type,
        dimensions: { width, height },
        colors,
        data,
        options: {
            responsive: true,
            animation: true,
            ...options
        }
    };
}

// 简单调用
const chart1 = createChart();
console.log(chart1);

// 复杂配置
const chart2 = createChart({
    type: 'bar',
    width: 1000,
    data: [1, 2, 3, 4, 5],
    options: {
        title: '销售数据',
        animation: false
    }
});
console.log(chart2);
```

### 工具函数库
```javascript
// 使用剩余参数和扩展运算符创建工具函数
const utils = {
    // 合并对象（深度合并）
    merge: function(target, ...sources) {
        sources.forEach(source => {
            Object.keys(source).forEach(key => {
                if (typeof source[key] === 'object' && source[key] !== null) {
                    if (!target[key]) target[key] = {};
                    this.merge(target[key], source[key]);
                } else {
                    target[key] = source[key];
                }
            });
        });
        return target;
    },
    
    // 创建带验证的函数
    validate: function(validator, ...args) {
        if (!validator(...args)) {
            throw new Error('参数验证失败');
        }
        return args;
    },
    
    // 批量处理
    batch: function(processor, ...items) {
        return items.map(item => processor(item));
    }
};

// 使用示例
const result = utils.merge(
    { a: 1 },
    { b: 2 },
    { c: { d: 3 } }
);
console.log(result); // { a: 1, b: 2, c: { d: 3 } }
```

### 高阶函数
```javascript
// 使用箭头函数创建高阶函数
const compose = (...functions) => (value) => 
    functions.reduceRight((acc, fn) => fn(acc), value);

const pipe = (...functions) => (value) => 
    functions.reduce((acc, fn) => fn(acc), value);

// 使用示例
const addOne = x => x + 1;
const double = x => x * 2;
const square = x => x * x;

const addOneThenDoubleThenSquare = compose(square, double, addOne);
console.log(addOneThenDoubleThenSquare(3)); // ((3+1)*2)^2 = 64

const squareThenDoubleThenAddOne = pipe(square, double, addOne);
console.log(squareThenDoubleThenAddOne(3)); // (3^2)*2+1 = 19
```

### 事件处理器
```javascript
// 使用箭头函数和默认参数处理事件
class EventManager {
    constructor() {
        this.handlers = new Map();
    }
    
    // 注册事件处理器
    on(event, handler, options = { once: false, priority: 0 }) {
        if (!this.handlers.has(event)) {
            this.handlers.set(event, []);
        }
        
        this.handlers.get(event).push({
            handler,
            ...options
        });
        
        // 按优先级排序
        this.handlers.get(event).sort((a, b) => b.priority - a.priority);
    }
    
    // 触发事件
    emit(event, ...args) {
        const handlers = this.handlers.get(event) || [];
        const remainingHandlers = [];
        
        handlers.forEach(({ handler, once }) => {
            handler(...args);
            if (!once) {
                remainingHandlers.push({ handler, once });
            }
        });
        
        this.handlers.set(event, remainingHandlers);
    }
}

// 使用示例
const eventManager = new EventManager();

eventManager.on('click', (x, y) => {
    console.log(`点击位置: (${x}, ${y})`);
}, { priority: 1 });

eventManager.on('click', () => {
    console.log('记录点击事件');
}, { once: true });

eventManager.emit('click', 100, 200);
eventManager.emit('click', 150, 250); // once 的处理器不会再次执行
```

## 总结

ES6 为函数带来的主要扩展包括：

1. **默认参数**：简化函数参数的默认值设置
2. **剩余参数**：优雅处理不定数量的参数
3. **扩展运算符**：方便地展开数组和对象
4. **箭头函数**：更简洁的函数语法和词法 this
5. **参数解构**：直接在参数中解构对象和数组
6. **函数属性**：如 name 属性的标准化
7. **块级函数**：在块级作用域中声明函数
8. **尾逗号支持**：提高代码维护性

这些扩展使 JavaScript 函数更加灵活、强大和易用，大大提升了开发体验和代码质量。