---
title: bind、call 和 apply
---

:::note
bind、call 和 apply 都是用于改变函数执行时 this 指向的方法
:::

##### 1. 基本概念
**call 方法**: call() 方法立即调用函数，并允许你指定函数的 this 值和参数列表。
```javascript
func.call(thisArg, arg1, arg2, ...)
```

**apply 方法**: apply() 方法与 call() 类似，也是立即调用函数，但参数是以数组（或类数组对象）的形式传递。
```javascript
func.apply(thisArg, [argsArray])
```

**bind 方法**: bind() 方法创建一个新的函数，当被调用时，将其 this 关键字设置为提供的值，并在调用新函数时提供给定的参数序列。
```javascript
func.bind(thisArg, arg1, arg2, ...)
```

##### 2. 主要区别
| 方法   | 调用时机   | 参数传递方式 | 返回值                     |
|--------|------------|--------------|----------------------------|
| call   | 立即调用   | 参数列表     | 函数的返回值               |
| apply  | 立即调用   | 参数数组     | 函数的返回值               |
| bind   | 不调用     | 参数列表     | 返回绑定后的新函数         |


##### 3. 使用示例
**示例 1：基本使用**
```javascript
const person = {
  name: 'John',
  greet: function(greeting, punctuation) {
    return `${greeting}, ${this.name}${punctuation}`;
  }
};

// call 使用
console.log(person.greet.call({name: 'Alice'}, 'Hello', '!')); 
// 输出: "Hello, Alice!"

// apply 使用
console.log(person.greet.apply({name: 'Bob'}, ['Hi', '!!'])); 
// 输出: "Hi, Bob!!"

// bind 使用
const greetJane = person.greet.bind({name: 'Jane'}, 'Hey');
console.log(greetJane('...')); 
// 输出: "Hey, Jane..."
```

**示例 2：函数借用**
```javascript
// 类数组对象使用数组方法
const arrayLike = {0: 'a', 1: 'b', length: 2};

// 使用 apply 将数组方法应用到类数组对象
const realArray = Array.prototype.slice.apply(arrayLike);
console.log(realArray); // 输出: ['a', 'b']
```

**示例 3：参数预设**
```javascript
function multiply(a, b) {
  return a * b;
}

// 使用 bind 预设参数
const double = multiply.bind(null, 2);
console.log(double(5)); // 输出: 10
console.log(double(10)); // 输出: 20
```

##### 实现一个 bind 方法
```javascript
Function.prototype.myBind = function(context, ...args) {
  const self = this; // 保存原函数
  
  // 返回一个新函数
  return function(...innerArgs) {
    // 合并两次传入的参数
    const finalArgs = [...args, ...innerArgs];
    
    // 使用 apply 改变 this 指向并执行函数
    return self.apply(context, finalArgs);
  };
};
```

##### 更完整的实现（考虑 new 操作符）
```javascript
Function.prototype.myBind = function(context, ...args) {
  const self = this;
  
  const boundFunction = function(...innerArgs) {
    // 判断是否是通过 new 调用的
    const isNewCall = this instanceof boundFunction;
    
    return self.apply(
      isNewCall ? this : context,
      [...args, ...innerArgs]
    );
  };
  
  // 保持原型链
  boundFunction.prototype = Object.create(self.prototype);
  
  return boundFunction;
};
```

##### 使用示例
```javascript
function greet(greeting, punctuation) {
  console.log(greeting + ' ' + this.name + punctuation);
}

const person = { name: 'Alice' };

const boundGreet = greet.myBind(person, 'Hello');
boundGreet('!'); // 输出: Hello Alice!
```

这个实现涵盖了 bind 的主要功能：
* 改变 this 指向
* 支持参数预设
* 保持原型链
* 正确处理 new 操作符调用的情况

##### 4. 实际应用场景
1. call 的典型用途：
   
    * 明确指定函数执行时的 this 值

    * 实现对象方法的"借用"
  
2. apply 的典型用途：

    * 将数组元素作为函数参数传递

    * 与可变参数函数配合使用

3. bind 的典型用途：
   
    * 事件处理函数中保持正确的 this 指向

    * 函数柯里化（预设部分参数）

    * 需要延迟执行函数时

##### 5. 性能考虑
* bind 会创建一个新函数，有一定的内存开销

* 在不需要创建新函数的场景下，优先使用 call 或 apply

* 现代 JavaScript 中，箭头函数可以替代部分 bind 的使用场景

##### 6. 现代替代方案
在 ES6+ 中，可以使用箭头函数和展开运算符部分替代这些方法：
```javascript
// 替代 apply
const args = [1, 2, 3];
someFunction(...args); // 替代 someFunction.apply(null, args)

// 替代 bind
document.addEventListener('click', () => button.click()); // 替代 button.click.bind(button)
```
不过，call、apply 和 bind 仍然是 JavaScript 中非常重要的方法，理解它们的区别和适用场景对于编写高质量的 JavaScript 代码至关重要。


