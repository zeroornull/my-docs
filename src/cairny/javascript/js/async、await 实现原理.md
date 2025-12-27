---
title: async、await 实现原理
---


##### 概述
async/await 是 JavaScript 中处理异步操作的语法糖，基于 Promise 和 Generator 实现。下面我将解释其原理并手写一个简化版的实现。


##### 实现原理
1. async 函数：本质上是一个返回 Promise 的 Generator 函数的语法糖

2. await 表达式：可以看作是在 yield 表达式基础上的改进，自动处理 Promise 的 resolve/reject

3. 执行器：需要一个执行器函数来自动迭代 Generator，处理 Promise 并恢复执行

##### 手写实现
```javascript
// 手写 async/await 核心原理（基于 Generator + Promise）

function asyncToGenerator(generatorFunc) {
  return function() {
    const gen = generatorFunc.apply(this, arguments)
    
    return new Promise((resolve, reject) => {
      function step(key, arg) {
        let generatorResult
        try {
          generatorResult = gen[key](arg)
        } catch (error) {
          return reject(error)
        }
        
        const { value, done } = generatorResult
        
        if (done) {
          return resolve(value)
        } else {
          // value 不一定是 Promise，可能是一个普通值，使用 Promise.resolve 包装
          return Promise.resolve(value).then(
            val => step('next', val),
            err => step('throw', err)
          )
        }
      }
      
      step('next')
    })
  }
}

// 使用示例
function* mockAsyncFn() {
  try {
    const result1 = yield Promise.resolve('first result')
    console.log(result1) // => 'first result'
    
    const result2 = yield Promise.resolve('second result')
    console.log(result2) // => 'second result'
    
    return 'final result'
  } catch (error) {
    console.error(error)
  }
}

const wrappedFn = asyncToGenerator(mockAsyncFn)

wrappedFn().then(result => {
  console.log(result) // => 'final result'
})
```

##### 原理解释
1. asyncToGenerator 函数接收一个 Generator 函数，返回一个新的函数

2. 当新函数被调用时：
    * 创建一个 Generator 对象
    * 返回一个 Promise
    * 开始执行 Generator (调用 step('next'))
  
3. step 函数：
    * 执行 gen[key](arg) (key 是 'next' 或 'throw')
    * 检查 Generator 是否完成 (done)
    * 如果未完成，用 Promise.resolve 包装 value，然后：
        * 成功时继续下一步 (step('next', val))
        * 失败时抛出错误 (step('throw', err))
    * 如果完成，resolve 最终结果


##### 完整 async/await 转换示例
```javascript
// async/await 版本
async function example() {
  try {
    const a = await Promise.resolve('a')
    const b = await Promise.resolve('b')
    return a + b
  } catch (e) {
    console.error(e)
  }
}

// 转换为 Generator 版本
function* exampleGenerator() {
  try {
    const a = yield Promise.resolve('a')
    const b = yield Promise.resolve('b')
    return a + b
  } catch (e) {
    console.error(e)
  }
}

const example = asyncToGenerator(exampleGenerator)
example().then(result => console.log(result)) // => 'ab'
```

:::note
这个实现展示了 async/await 的核心原理，实际 JavaScript 引擎的实现会更复杂，包含更多优化和边缘情况处理。
:::
