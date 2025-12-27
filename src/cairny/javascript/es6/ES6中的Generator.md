---
title: ES6中的Generator
---

## ES6 中 Generator（生成器）详解

Generator 是 ES6 引入的一种特殊函数，它可以在执行过程中暂停和恢复，提供了一种强大的异步编程和迭代控制方式。

## Generator 的基本语法

```javascript
// Generator 函数使用 * 号定义
function* generatorFunction() {
    yield 1;
    yield 2;
    yield 3;
    return 4;
}

// 创建生成器对象
const generator = generatorFunction();

// 使用 next() 方法控制执行
console.log(generator.next()); // { value: 1, done: false }
console.log(generator.next()); // { value: 2, done: false }
console.log(generator.next()); // { value: 3, done: false }
console.log(generator.next()); // { value: 4, done: true }
```

## Generator 的核心特性

### 1. 暂停和恢复执行

```javascript
function* countdown(start) {
    console.log('开始倒计时');
    while (start > 0) {
        yield start;
        start--;
    }
    console.log('倒计时结束');
    return '完成';
}

const counter = countdown(3);
console.log(counter.next()); // 开始倒计时 -> { value: 3, done: false }
console.log(counter.next()); // { value: 2, done: false }
console.log(counter.next()); // { value: 1, done: false }
console.log(counter.next()); // 倒计时结束 -> { value: '完成', done: true }
```

### 2. 参数传递

```javascript
function* echo() {
    let value = yield '请输入值';
    yield `你输入了: ${value}`;
    value = yield '请再次输入值';
    yield `你再次输入了: ${value}`;
}

const gen = echo();
console.log(gen.next());           // { value: '请输入值', done: false }
console.log(gen.next('Hello'));    // { value: '你输入了: Hello', done: false }
console.log(gen.next('World'));    // { value: '请再次输入值', done: false }
console.log(gen.next('ES6'));      // { value: '你再次输入了: ES6', done: false }
```

### 3. 错误处理

```javascript
function* errorHandling() {
    try {
        yield 1;
        yield 2;
        throw new Error('发生错误');
        yield 3; // 这行不会执行
    } catch (error) {
        yield `捕获到错误: ${error.message}`;
    }
    yield 4;
}

const gen = errorHandling();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.throw(new Error('外部错误'))); // { value: '捕获到错误: 外部错误', done: false }
console.log(gen.next()); // { value: 4, done: false }
console.log(gen.next()); // { value: undefined, done: true }
```

## 实际使用场景

### 1. 异步操作控制

```javascript
// 使用 Generator 处理异步操作
function* asyncGenerator() {
    try {
        console.log('开始获取用户数据');
        const user = yield fetch('/api/user/1');
        console.log('用户数据获取完成:', user);
        
        console.log('开始获取用户订单');
        const orders = yield fetch(`/api/orders/${user.id}`);
        console.log('订单数据获取完成:', orders);
        
        return { user, orders };
    } catch (error) {
        console.error('操作失败:', error);
        throw error;
    }
}

// 执行器函数
function runGenerator(generator) {
    const gen = generator();
    
    function handle(result) {
        if (result.done) {
            return Promise.resolve(result.value);
        }
        
        return Promise.resolve(result.value)
            .then(data => handle(gen.next(data)))
            .catch(error => handle(gen.throw(error)));
    }
    
    return handle(gen.next());
}

// 模拟 fetch 函数
function fetch(url) {
    return new Promise(resolve => {
        setTimeout(() => {
            if (url === '/api/user/1') {
                resolve({ id: 1, name: '张三' });
            } else if (url === '/api/orders/1') {
                resolve([{ id: 101, product: '商品1' }]);
            }
        }, 1000);
    });
}

// 使用
runGenerator(asyncGenerator)
    .then(result => console.log('最终结果:', result))
    .catch(error => console.error('错误:', error));
```

### 2. 自定义迭代器

```javascript
// 创建自定义范围迭代器
function* range(start, end, step = 1) {
    for (let i = start; i <= end; i += step) {
        yield i;
    }
}

// 使用
for (const num of range(1, 10, 2)) {
    console.log(num); // 1, 3, 5, 7, 9
}

// 斐波那契数列生成器
function* fibonacci() {
    let prev = 0;
    let curr = 1;
    
    yield prev;
    yield curr;
    
    while (true) {
        [prev, curr] = [curr, prev + curr];
        yield curr;
    }
}

// 使用斐波那契生成器
const fib = fibonacci();
for (let i = 0; i < 10; i++) {
    console.log(fib.next().value);
}
// 0, 1, 1, 2, 3, 5, 8, 13, 21, 34
```

### 3. 数据流处理

```javascript
// 创建数据处理管道
function* processData(data) {
    console.log('开始处理数据');
    for (const item of data) {
        console.log(`处理项目: ${item}`);
        yield item.toUpperCase();
    }
    console.log('数据处理完成');
}

function* filterData(data) {
    console.log('开始过滤数据');
    for (const item of data) {
        if (item.length > 3) {
            console.log(`过滤通过: ${item}`);
            yield item;
        } else {
            console.log(`过滤拒绝: ${item}`);
        }
    }
    console.log('数据过滤完成');
}

// 组合使用
const rawData = ['hello', 'hi', 'world', 'es6', 'generator'];
const processed = processData(rawData);
const filtered = filterData(processed);

for (const item of filtered) {
    console.log(`最终结果: ${item}`);
}
```

### 4. 状态机实现

```javascript
// 使用 Generator 实现有限状态机
function* trafficLight() {
    while (true) {
        console.log('红灯亮');
        yield 'red';
        
        console.log('黄灯亮');
        yield 'yellow';
        
        console.log('绿灯亮');
        yield 'green';
    }
}

const light = trafficLight();
console.log(light.next()); // 红灯亮 -> { value: 'red', done: false }
console.log(light.next()); // 黄灯亮 -> { value: 'yellow', done: false }
console.log(light.next()); // 绿灯亮 -> { value: 'green', done: false }
console.log(light.next()); // 红灯亮 -> { value: 'red', done: false }
```

### 5. 惰性求值

```javascript
// 创建惰性求值的无限序列
function* infiniteSequence(start = 0, step = 1) {
    let current = start;
    while (true) {
        yield current;
        current += step;
    }
}

// 只计算需要的值
function* take(iterator, count) {
    let index = 0;
    for (const value of iterator) {
        if (index >= count) break;
        yield value;
        index++;
    }
}

function* filter(iterator, predicate) {
    for (const value of iterator) {
        if (predicate(value)) {
            yield value;
        }
    }
}

function* map(iterator, transform) {
    for (const value of iterator) {
        yield transform(value);
    }
}

// 组合使用
const numbers = infiniteSequence(1);
const evenNumbers = filter(numbers, x => x % 2 === 0);
const squaredNumbers = map(evenNumbers, x => x * x);
const firstFive = take(squaredNumbers, 5);

for (const num of firstFive) {
    console.log(num); // 4, 16, 36, 64, 100
}
```

### 6. 异步迭代

```javascript
// 异步数据源生成器
function* asyncDataSource() {
    console.log('获取第1批数据');
    yield fetch('/api/data/1');
    
    console.log('获取第2批数据');
    yield fetch('/api/data/2');
    
    console.log('获取第3批数据');
    yield fetch('/api/data/3');
}

// 模拟异步数据获取
function fetch(url) {
    return new Promise(resolve => {
        setTimeout(() => {
            const data = url.split('/').pop();
            resolve(`数据${data}`);
        }, Math.random() * 1000);
    });
}

// 异步迭代处理
async function processAsyncData() {
    const dataSource = asyncDataSource();
    
    for (const promise of dataSource) {
        try {
            const data = await promise;
            console.log('处理数据:', data);
        } catch (error) {
            console.error('处理失败:', error);
        }
    }
}

// 使用
processAsyncData();
```

### 7. 递归算法优化

```javascript
// 使用 Generator 优化递归算法（避免栈溢出）
function* deepTraversal(tree) {
    if (!tree) return;
    
    yield tree.value;
    
    if (tree.children) {
        for (const child of tree.children) {
            yield* deepTraversal(child); // 使用 yield* 委托给另一个生成器
        }
    }
}

// 深度优先遍历非常深的树结构
const deepTree = {
    value: 1,
    children: [
        {
            value: 2,
            children: [
                { value: 3, children: [] },
                { value: 4, children: [] }
            ]
        },
        {
            value: 5,
            children: [
                { value: 6, children: [] }
            ]
        }
    ]
};

for (const value of deepTraversal(deepTree)) {
    console.log(value); // 1, 2, 3, 4, 5, 6
}
```

### 8. 生产者-消费者模式

```javascript
// 使用 Generator 实现生产者-消费者模式
function* producer() {
    let id = 1;
    while (true) {
        console.log(`生产任务 ${id}`);
        yield { id: id++, timestamp: Date.now() };
    }
}

function* consumer(producerGen) {
    for (const item of producerGen) {
        console.log(`消费任务 ${item.id} (时间: ${new Date(item.timestamp)})`);
        yield `已处理任务 ${item.id}`;
    }
}

// 使用
const prod = producer();
const cons = consumer(prod);

console.log(cons.next()); // 生产任务 1 -> 消费任务 1 -> { value: '已处理任务 1', done: false }
console.log(cons.next()); // 生产任务 2 -> 消费任务 2 -> { value: '已处理任务 2', done: false }
console.log(cons.next()); // 生产任务 3 -> 消费任务 3 -> { value: '已处理任务 3', done: false }
```

### 9. 配置和设置生成

```javascript
// 使用 Generator 生成配置组合
function* configGenerator(baseConfig) {
    const themes = ['light', 'dark', 'auto'];
    const languages = ['zh', 'en', 'ja'];
    const sizes = ['small', 'medium', 'large'];
    
    for (const theme of themes) {
        for (const language of languages) {
            for (const size of sizes) {
                yield {
                    ...baseConfig,
                    theme,
                    language,
                    size
                };
            }
        }
    }
}

const baseConfig = { version: '1.0' };
const configs = configGenerator(baseConfig);

// 按需获取配置
for (let i = 0; i < 5; i++) {
    const config = configs.next().value;
    console.log(`配置 ${i + 1}:`, config);
}
```

### 10. 测试数据生成

```javascript
// 使用 Generator 生成测试数据
function* userGenerator() {
    const names = ['张三', '李四', '王五', '赵六'];
    const ages = [20, 25, 30, 35, 40];
    const cities = ['北京', '上海', '广州', '深圳'];
    
    let id = 1;
    while (true) {
        const user = {
            id: id++,
            name: names[Math.floor(Math.random() * names.length)],
            age: ages[Math.floor(Math.random() * ages.length)],
            city: cities[Math.floor(Math.random() * cities.length)],
            createdAt: new Date()
        };
        yield user;
    }
}

// 生成测试用户
function* generateUsers(count) {
    const userGen = userGenerator();
    for (let i = 0; i < count; i++) {
        yield userGen.next().value;
    }
}

// 使用
for (const user of generateUsers(3)) {
    console.log('测试用户:', user);
}
```

## Generator 与 async/await 的关系

```javascript
// Generator 是 async/await 的基础
// async/await 实际上是 Generator 的语法糖

// 使用 Generator 和 Promise 实现类似 async/await 的效果
function asyncWrapper(generatorFunction) {
    return function(...args) {
        const generator = generatorFunction(...args);
        
        return new Promise((resolve, reject) => {
            function step(result) {
                if (result.done) {
                    resolve(result.value);
                    return;
                }
                
                Promise.resolve(result.value)
                    .then(value => step(generator.next(value)))
                    .catch(error => step(generator.throw(error)));
            }
            
            step(generator.next());
        });
    };
}

// 使用示例
const asyncFunc = asyncWrapper(function* () {
    const user = yield fetch('/api/user/1');
    const orders = yield fetch(`/api/orders/${user.id}`);
    return { user, orders };
});
```

## Generator 的优势和使用建议

### 优势：
1. **控制流**：可以精确控制函数的执行流程
2. **惰性求值**：只在需要时计算值，节省内存
3. **状态管理**：天然支持状态保存和恢复
4. **组合性**：生成器可以轻松组合使用
5. **异步处理**：提供优雅的异步编程方式

### 使用建议：
1. **适合场景**：复杂的异步流程、数据处理管道、迭代器实现
2. **性能考虑**：对于简单场景，普通函数可能更高效
3. **可读性**：合理使用，避免过度复杂化代码
4. **错误处理**：注意 Generator 中的错误处理机制

Generator 是 ES6 中一个非常强大的特性，它为 JavaScript 提供了独特的控制流能力，特别适合处理复杂的异步操作和数据处理场景。