---
title: 生成器(Generator)与迭代器(Iterator)
---


::: note
生成器实际上是迭代器的语法糖，提供了一种更简单的方式来创建迭代器。
:::

##### 核心关系
1. 生成器是迭代器的工厂：
    * 调用生成器函数会返回一个迭代器对象
    * 这个迭代器对象实现了迭代器协议

2. 生成器实现了迭代器协议：
    * 生成器对象本身就是一个迭代器
    * 它有 next() 方法
    * 它遵循 { value: any, done: boolean } 的返回值格式


##### 迭代器协议简介
迭代器协议要求对象实现一个 next() 方法，该方法返回包含两个属性的对象：
  * value：当前迭代的值
  * done：布尔值，表示迭代是否完成


##### 手动实现迭代器示例
```javascript
const myIterable = {
  [Symbol.iterator]: function() {
    let step = 0;
    return {
      next: function() {
        step++;
        if (step === 1) return { value: '第一步', done: false };
        if (step === 2) return { value: '第二步', done: false };
        return { value: undefined, done: true };
      }
    };
  }
};
```
##### 使用生成器实现相同功能
```javascript
function* myGenerator() {
  yield '第一步';
  yield '第二步';
}

const myIterable = {
  [Symbol.iterator]: myGenerator
};
```


##### 关键区别
| 特性         | 迭代器                     | 生成器                          |
|--------------|---------------------------|---------------------------------|
| 创建方式     | 手动实现 `next()` 方法     | 使用 `function*` 和 `yield`     |
| 复杂性       | 需要手动管理状态          | 自动管理状态                   |
| 可读性       | 较低                      | 较高                           |
| 功能         | 基础功能                  | 额外功能（如双向通信）         |


##### 生成器提供的额外能力
1. 双向通信：可以通过 next(value) 向生成器传递值
2. 错误处理：可以使用 throw() 方法向生成器抛出错误
3. 提前终止：可以使用 return() 方法提前结束生成器


##### 实际关系体现
1. 生成器对象是可迭代的：
```javascript
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}

// 可以用for...of循环
for (const value of gen()) {
  console.log(value); // 1 2 3
}
```

2. 生成器可以委托给其他可迭代对象：
```javascript
function* gen() {
  yield* [1, 2, 3]; // 使用yield*委托给数组迭代器
}
```

##### 总结
* 生成器是创建迭代器的语法糖，简化了迭代器的实现
* 所有生成器都是迭代器，但并非所有迭代器都是生成器
* 生成器提供了比基础迭代器更丰富的功能和控制能力
* 生成器使得实现可迭代对象变得更加简洁和易读
