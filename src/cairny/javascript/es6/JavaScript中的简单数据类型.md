---
title: JavaScript中的简单数据类型
---

## JavaScript 中的简单数据类型（原始数据类型）

JavaScript 中有两种类型的数据：**原始类型（Primitive Types）**和**引用类型（Reference Types）**。原始类型也被称为简单数据类型，它们是按值存储的。

## ES5 中的 5 种原始数据类型

### 1. Number（数字类型）

```javascript
// 整数和浮点数
let integer = 42;
let float = 3.14159;
let negative = -10;

// 特殊数值
let infinity = Infinity;
let negativeInfinity = -Infinity;
let notANumber = NaN;

// 数值表示法
let decimal = 42;           // 十进制
let binary = 0b101010;      // 二进制 (ES6)
let octal = 0o52;           // 八进制 (ES6)
let hexadecimal = 0x2A;     // 十六进制

console.log(typeof integer); // "number"
console.log(typeof NaN);     // "number" (NaN 也是数字类型)
```

### 2. String（字符串类型）

```javascript
// 字符串字面量
let singleQuote = '单引号字符串';
let doubleQuote = "双引号字符串";
let templateLiteral = `模板字符串`; // ES6

// 字符串方法
let str = "Hello, World!";
console.log(str.length);        // 13
console.log(str.toUpperCase()); // "HELLO, WORLD!"
console.log(str.indexOf('World')); // 7

// 模板字符串 (ES6)
let name = "张三";
let age = 25;
let message = `我的名字是${name}，今年${age}岁`;
console.log(message); // "我的名字是张三，今年25岁"

console.log(typeof str); // "string"
```

### 3. Boolean（布尔类型）

```javascript
// 布尔值
let isTrue = true;
let isFalse = false;

// 布尔转换
console.log(Boolean(1));        // true
console.log(Boolean(0));        // false
console.log(Boolean("hello"));  // true
console.log(Boolean(""));       // false
console.log(Boolean(null));     // false
console.log(Boolean(undefined)); // false

console.log(typeof isTrue); // "boolean"
```

### 4. Undefined（未定义类型）

```javascript
// 未定义的变量
let undefinedVariable;
console.log(undefinedVariable); // undefined

// 显式设置为 undefined
let explicitUndefined = undefined;
console.log(explicitUndefined); // undefined

// 函数没有返回值时
function noReturn() {}
console.log(noReturn()); // undefined

console.log(typeof undefinedVariable); // "undefined"
```

### 5. Null（空值类型）

```javascript
// null 表示"空值"
let emptyValue = null;
console.log(emptyValue); // null

// typeof null 的特殊情况
console.log(typeof null); // "object" (这是一个历史遗留的bug)

// 检查 null 的正确方式
console.log(null === null); // true
console.log(null == undefined); // true (类型转换)
console.log(null === undefined); // false (严格相等)
```

## ES6 新增的原始类型

### 6. Symbol（符号类型）- ES6

```javascript
// 创建 Symbol
let sym1 = Symbol();
let sym2 = Symbol('description');

// Symbol 是唯一的
let sym3 = Symbol('foo');
let sym4 = Symbol('foo');
console.log(sym3 === sym4); // false

// Symbol 作为对象属性名
let obj = {
    [sym1]: 'symbol value',
    name: '张三'
};

console.log(obj[sym1]); // "symbol value"
console.log(obj.name);  // "张三"

// 内置 Symbol
console.log(Symbol.iterator); // Symbol(Symbol.iterator)

console.log(typeof sym1); // "symbol"
```

## ES2020 新增的原始类型

### 7. BigInt（大整数类型）- ES2020

```javascript
// 创建 BigInt
let bigNumber = 123456789012345678901234567890n;
let bigIntFromNumber = BigInt(123);
let bigIntFromString = BigInt("9007199254740991");

// BigInt 运算
let result = bigNumber + 1n;
console.log(result); // 123456789012345678901234567891n

// 注意：BigInt 不能与 Number 直接运算
// let error = 1n + 1; // TypeError

console.log(typeof bigNumber); // "bigint"
```

## 类型检测方法

### 1. typeof 操作符

```javascript
console.log(typeof 42);           // "number"
console.log(typeof 'hello');      // "string"
console.log(typeof true);         // "boolean"
console.log(typeof undefined);    // "undefined"
console.log(typeof null);         // "object" (bug)
console.log(typeof Symbol());     // "symbol"
console.log(typeof BigInt(123));  // "bigint"
```

### 2. 更精确的类型检测

```javascript
// 检测 null
function isNull(value) {
    return value === null;
}

// 检测 NaN
function isNaNValue(value) {
    return Number.isNaN(value);
}

// 综合类型检测函数
function getType(value) {
    if (value === null) return 'null';
    if (Number.isNaN(value)) return 'nan';
    return typeof value;
}

console.log(getType(null));      // "null"
console.log(getType(NaN));       // "nan"
console.log(getType(42));        // "number"
```

## 原始类型的特点

### 1. 不可变性（Immutable）

```javascript
// 原始类型的值是不可变的
let str = "hello";
str.toUpperCase(); // 返回新字符串，不改变原字符串
console.log(str); // "hello"

let num = 42;
num.toString(); // 返回新字符串，不影响原数字
console.log(num); // 42
```

### 2. 按值传递

```javascript
// 原始类型按值传递
function changeValue(value) {
    value = 100;
    console.log('函数内:', value); // 100
}

let original = 50;
changeValue(original);
console.log('函数外:', original); // 50 (没有改变)
```

### 3. 存储在栈内存中

```javascript
// 原始类型存储在栈中，访问速度快
let a = 10;
let b = a;  // b 是 a 的副本
a = 20;
console.log(b); // 10 (b 不受影响)
```

## 实际应用场景

### 1. 类型检查工具函数

```javascript
class TypeChecker {
    static isNumber(value) {
        return typeof value === 'number' && !Number.isNaN(value);
    }
    
    static isString(value) {
        return typeof value === 'string';
    }
    
    static isBoolean(value) {
        return typeof value === 'boolean';
    }
    
    static isNull(value) {
        return value === null;
    }
    
    static isUndefined(value) {
        return value === undefined;
    }
    
    static isSymbol(value) {
        return typeof value === 'symbol';
    }
    
    static isBigInt(value) {
        return typeof value === 'bigint';
    }
    
    static isPrimitive(value) {
        return value === null || 
               typeof value !== 'object' && 
               typeof value !== 'function';
    }
}

console.log(TypeChecker.isNumber(42));        // true
console.log(TypeChecker.isString("hello"));   // true
console.log(TypeChecker.isPrimitive({}));     // false
console.log(TypeChecker.isPrimitive(42));     // true
```

### 2. 数据验证

```javascript
function validateUser(userData) {
    const errors = [];
    
    if (!TypeChecker.isString(userData.name) || userData.name.length === 0) {
        errors.push('姓名必须是非空字符串');
    }
    
    if (!TypeChecker.isNumber(userData.age) || userData.age < 0 || userData.age > 150) {
        errors.push('年龄必须是0-150之间的数字');
    }
    
    if (!TypeChecker.isString(userData.email) || !userData.email.includes('@')) {
        errors.push('邮箱格式不正确');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}

const user = {
    name: "张三",
    age: 25,
    email: "zhangsan@example.com"
};

console.log(validateUser(user)); // { isValid: true, errors: [] }
```

## 总结

JavaScript 中的简单数据类型包括：

1. **Number**：数字类型（整数和浮点数）
2. **String**：字符串类型
3. **Boolean**：布尔类型
4. **Undefined**：未定义类型
5. **Null**：空值类型
6. **Symbol**：符号类型（ES6）
7. **BigInt**：大整数类型（ES2020）

这些原始类型具有不可变性、按值传递、存储在栈内存等特点，是 JavaScript 数据类型系统的基础。理解这些类型对于编写高质量的 JavaScript 代码非常重要。