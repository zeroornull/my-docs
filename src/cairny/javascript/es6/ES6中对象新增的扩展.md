---
title: ES6中对象新增的扩展
---

## ES6 中对象的新增扩展

ES6 为 JavaScript 对象带来了许多重要的新特性和语法糖，使对象操作更加简洁和强大。

## 1. 属性简写（Property Shorthand）

### ES5 方式
```javascript
// ES5 中对象属性赋值
var name = '张三';
var age = 25;
var city = '北京';

var person = {
    name: name,
    age: age,
    city: city,
    introduce: function() {
        return '大家好，我是' + this.name;
    }
};

console.log(person);
```

### ES6 属性简写
```javascript
// ES6 属性简写
const name = '张三';
const age = 25;
const city = '北京';

const person = {
    name,  // 等同于 name: name
    age,   // 等同于 age: age
    city,  // 等同于 city: city
    
    // 方法简写
    introduce() {  // 等同于 introduce: function()
        return `大家好，我是${this.name}`;
    },
    
    // 计算属性名
    [name + 'Info']() {
        return `${this.name}今年${this.age}岁，住在${this.city}`;
    }
};

console.log(person.introduce()); // 大家好，我是张三
console.log(person.张三Info()); // 张三今年25岁，住在北京
```

## 2. 计算属性名（Computed Property Names）

```javascript
// 使用变量作为属性名
const prefix = 'user_';
const id = 123;

const obj = {
    [prefix + 'id']: id,
    [prefix + 'name']: '张三',
    [prefix + 'email']: 'zhangsan@example.com'
};

console.log(obj); 
// { user_id: 123, user_name: '张三', user_email: 'zhangsan@example.com' }

// 使用表达式作为属性名
const obj2 = {
    ['prop_' + Math.random()]: '随机属性',
    [new Date().getFullYear()]: '年份属性'
};

console.log(obj2);

// 在方法名中使用计算属性
const methodName = 'calculate';
const calculator = {
    [methodName + 'Sum'](a, b) {
        return a + b;
    },
    
    [methodName + 'Product'](a, b) {
        return a * b;
    }
};

console.log(calculator.calculateSum(2, 3)); // 5
console.log(calculator.calculateProduct(2, 3)); // 6
```

## 3. Object.assign()

```javascript
// 浅拷贝对象
const target = { a: 1, b: 2 };
const source1 = { b: 4, c: 5 };
const source2 = { c: 6, d: 7 };

const result = Object.assign(target, source1, source2);
console.log(result); // { a: 1, b: 4, c: 6, d: 7 }
console.log(target === result); // true (修改了目标对象)

// 创建新对象而不修改原对象
const newObj = Object.assign({}, target, source1, source2);
console.log(newObj); // { a: 1, b: 4, c: 6, d: 7 }

// 合并对象
const defaultConfig = {
    theme: 'light',
    language: 'zh',
    notifications: true
};

const userConfig = {
    theme: 'dark',
    language: 'en'
};

const finalConfig = Object.assign({}, defaultConfig, userConfig);
console.log(finalConfig); 
// { theme: 'dark', language: 'en', notifications: true }

// 处理数组（会转换为对象）
console.log(Object.assign([1, 2, 3], [4, 5])); // [4, 5, 3]
```

## 4. Object.is()

```javascript
// 更严格的相等性比较
console.log(Object.is('foo', 'foo')); // true
console.log(Object.is({}, {})); // false

// 与 === 的区别
console.log(+0 === -0); // true
console.log(Object.is(+0, -0)); // false

console.log(NaN === NaN); // false
console.log(Object.is(NaN, NaN)); // true

// 实现 Object.is (如果环境不支持)
if (!Object.is) {
    Object.is = function(x, y) {
        // 处理 +0 和 -0
        if (x === 0 && y === 0) {
            return 1 / x === 1 / y;
        }
        // 处理 NaN
        if (x !== x && y !== y) {
            return true;
        }
        return x === y;
    };
}
```

## 5. 对象属性的遍历

### Object.keys()
```javascript
const obj = {
    name: '张三',
    age: 25,
    city: '北京'
};

console.log(Object.keys(obj)); // ['name', 'age', 'city']
```

### Object.values() (ES2017)
```javascript
console.log(Object.values(obj)); // ['张三', 25, '北京']

// 数组对象
const scores = {
    math: 95,
    english: 87,
    science: 92
};

const average = Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.values(scores).length;
console.log(average); // 91.33333333333333
```

### Object.entries() (ES2017)
```javascript
console.log(Object.entries(obj)); 
// [['name', '张三'], ['age', 25], ['city', '北京']]

// 转换为 Map
const map = new Map(Object.entries(obj));
console.log(map); // Map { 'name' => '张三', 'age' => 25, 'city' => '北京' }

// 从键值对数组创建对象
const entries = [['a', 1], ['b', 2], ['c', 3]];
const newObj = Object.fromEntries(entries);
console.log(newObj); // { a: 1, b: 2, c: 3 }
```

## 6. 对象属性描述符相关方法

### Object.getOwnPropertyDescriptor()
```javascript
const obj = {
    name: '张三'
};

Object.defineProperty(obj, 'age', {
    value: 25,
    writable: false,
    enumerable: false,
    configurable: false
});

console.log(Object.getOwnPropertyDescriptor(obj, 'name'));
// { value: '张三', writable: true, enumerable: true, configurable: true }

console.log(Object.getOwnPropertyDescriptor(obj, 'age'));
// { value: 25, writable: false, enumerable: false, configurable: false }
```

### Object.getOwnPropertyDescriptors()
```javascript
const obj = {
    name: '张三',
    get age() {
        return 25;
    }
};

console.log(Object.getOwnPropertyDescriptors(obj));
// {
//   name: { value: '张三', writable: true, enumerable: true, configurable: true },
//   age: { get: [Function: get age], set: undefined, enumerable: true, configurable: true }
// }
```

## 7. 原型相关方法

### Object.setPrototypeOf()
```javascript
const animal = {
    type: '动物',
    speak() {
        console.log(`${this.name} 发出声音`);
    }
};

const dog = {
    name: '旺财'
};

// 设置原型
Object.setPrototypeOf(dog, animal);

dog.speak(); // 旺财 发出声音
console.log(dog.type); // 动物
```

### Object.getPrototypeOf()
```javascript
console.log(Object.getPrototypeOf(dog) === animal); // true
```

## 8. 实际应用场景

### 配置对象合并
```javascript
// 创建配置管理器
class ConfigManager {
    constructor() {
        this.defaultConfig = {
            apiUrl: 'https://api.example.com',
            timeout: 5000,
            retries: 3,
            debug: false
        };
    }
    
    mergeConfig(userConfig) {
        // 使用 Object.assign 合并配置
        return Object.assign({}, this.defaultConfig, userConfig);
    }
    
    // 使用 Object.assign 的另一种方式
    mergeConfigWithSpread(userConfig) {
        return { ...this.defaultConfig, ...userConfig };
    }
    
    // 深度合并配置
    deepMergeConfig(userConfig) {
        const merge = (target, source) => {
            Object.keys(source).forEach(key => {
                if (typeof source[key] === 'object' && source[key] !== null) {
                    if (!target[key]) target[key] = {};
                    merge(target[key], source[key]);
                } else {
                    target[key] = source[key];
                }
            });
            return target;
        };
        
        return merge({ ...this.defaultConfig }, userConfig);
    }
}

const configManager = new ConfigManager();
const userConfig = {
    timeout: 10000,
    debug: true,
    features: {
        analytics: true,
        notifications: false
    }
};

console.log(configManager.mergeConfig(userConfig));
```

### 对象验证和处理
```javascript
// 创建对象工具类
class ObjectUtils {
    // 过滤对象属性
    static filter(obj, predicate) {
        const result = {};
        Object.keys(obj).forEach(key => {
            if (predicate(obj[key], key)) {
                result[key] = obj[key];
            }
        });
        return result;
    }
    
    // 映射对象值
    static mapValues(obj, mapper) {
        const result = {};
        Object.keys(obj).forEach(key => {
            result[key] = mapper(obj[key], key);
        });
        return result;
    }
    
    // 拾取指定属性
    static pick(obj, keys) {
        const result = {};
        keys.forEach(key => {
            if (key in obj) {
                result[key] = obj[key];
            }
        });
        return result;
    }
    
    // 排除指定属性
    static omit(obj, keys) {
        const result = {};
        Object.keys(obj).forEach(key => {
            if (!keys.includes(key)) {
                result[key] = obj[key];
            }
        });
        return result;
    }
    
    // 深拷贝对象
    static deepClone(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        
        if (obj instanceof Date) {
            return new Date(obj.getTime());
        }
        
        if (obj instanceof Array) {
            return obj.map(item => ObjectUtils.deepClone(item));
        }
        
        if (typeof obj === 'object') {
            const clonedObj = {};
            Object.keys(obj).forEach(key => {
                clonedObj[key] = ObjectUtils.deepClone(obj[key]);
            });
            return clonedObj;
        }
    }
}

// 使用示例
const userData = {
    name: '张三',
    age: 25,
    email: 'zhangsan@example.com',
    password: 'secret123',
    createdAt: new Date(),
    isActive: true
};

// 过滤出活跃用户
const activeUsers = ObjectUtils.filter(
    { user1: { isActive: true }, user2: { isActive: false } },
    user => user.isActive
);

// 映射值
const userAges = ObjectUtils.mapValues(
    { user1: { age: 25 }, user2: { age: 30 } },
    user => user.age
);

// 拾取特定属性
const publicProfile = ObjectUtils.pick(userData, ['name', 'age', 'createdAt']);

// 排除敏感属性
const safeData = ObjectUtils.omit(userData, ['password']);

console.log(publicProfile);
console.log(safeData);
```

### 动态对象创建
```javascript
// 使用计算属性名创建动态对象
function createApiEndpoints(baseURL) {
    const endpoints = ['users', 'posts', 'comments'];
    
    const api = {
        baseURL,
        // 使用计算属性名创建方法
        ...endpoints.reduce((acc, endpoint) => {
            acc[`get${endpoint.charAt(0).toUpperCase() + endpoint.slice(1)}`] = function(id) {
                const url = `${this.baseURL}/${endpoint}${id ? `/${id}` : ''}`;
                console.log(`GET ${url}`);
                return fetch(url).then(res => res.json());
            };
            return acc;
        }, {})
    };
    
    return api;
}

const api = createApiEndpoints('https://api.example.com');
// api.getUsers(), api.getPosts(), api.getComments() 方法已创建
```

### 对象属性监控
```javascript
// 创建可观察对象
function createObservableObject(obj, onChange) {
    return new Proxy(obj, {
        set(target, property, value, receiver) {
            const oldValue = target[property];
            const result = Reflect.set(target, property, value, receiver);
            
            if (oldValue !== value) {
                onChange && onChange(property, value, oldValue);
            }
            
            return result;
        }
    });
}

const observableUser = createObservableObject(
    { name: '张三', age: 25 },
    (property, newValue, oldValue) => {
        console.log(`属性 ${property} 从 ${oldValue} 变为 ${newValue}`);
    }
);

observableUser.name = '李四'; // 属性 name 从 张三 变为 李四
observableUser.age = 26; // 属性 age 从 25 变为 26
```

## 总结

ES6 为对象带来的主要扩展包括：

1. **属性简写**：简化对象字面量的书写
2. **计算属性名**：支持动态属性名
3. **方法简写**：简化方法定义语法
4. **Object.assign()**：对象合并和拷贝
5. **Object.is()**：更严格的相等性比较
6. **Object.values() 和 Object.entries()**：对象值和键值对的遍历
7. **原型操作方法**：更方便的原型链操作
8. **属性描述符方法**：更完整的属性描述符支持

这些扩展使 JavaScript 对象操作更加直观、强大和灵活，大大提升了开发效率和代码质量。