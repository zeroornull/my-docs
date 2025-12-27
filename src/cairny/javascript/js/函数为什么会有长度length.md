---
title: 函数为什么会有长度length
---

::: note
在 JavaScript 中，函数的 length 属性表示该函数期望接收的参数个数（即其形参的数量）。
:::

1、length 是函数对象的属性，它反映的是声明的形参数量，而不是实际调用时传入的参数个数。
```javascript
function foo(a, b) {}
console.log(foo.length); // 2，即使调用时传 0 个或 10 个参数，length 仍然是 2
```

2、默认参数和剩余参数的影响：
* 如果参数有默认值，length 只计算到第一个有默认值的参数之前：
```javascript
function bar(a, b = 2, c) {}
console.log(bar.length); // 1（因为 b 有默认值，只计算 a）
```

* 剩余参数（...args）不计入 length：
```javascript
function baz(a, ...rest) {}
console.log(baz.length); // 1（...rest 不计入）
```

##### 为什么函数会有 length 属性？
* JavaScript 的函数是一等公民（可以像变量一样传递），因此函数本身也是对象，具有一些内置属性（如 name、length）。

* length 的主要用途是让开发者能够检查函数的预期参数个数，这在元编程（如高阶函数、柯里化等场景）中很有用。


##### 示例：柯里化（Currying）利用 length
```javascript
function curry(fn) {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        } else {
            return function (...moreArgs) {
                return curried.apply(this, args.concat(moreArgs));
            };
        }
    };
}

const curriedSum = curry(sum);
console.log(curriedSum(1)(2)(3)); // 6
```
:::warn
这里 fn.length 用于判断是否收集了足够的参数。
:::

##### 总结
* sum.length === 3 是因为 sum 声明了 3 个形参。

* length 是函数对象的固有属性，表示其声明的参数个数（不包括默认参数和剩余参数）。

* 这一特性在函数式编程和反射（Reflection）中非常有用。

