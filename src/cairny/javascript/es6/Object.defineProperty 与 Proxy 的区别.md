---
title: Object.defineProperty 与 Proxy 的区别
---

# Object.defineProperty 与 Proxy 的区别

`Object.defineProperty` 和 `Proxy` 都是 JavaScript 中用于拦截和自定义对象行为的机制，但它们在功能、使用方式和能力上有显著差异。

## 1. 基本概念

### Object.defineProperty
- ES5 引入的 API
- 直接在对象上定义或修改单个属性
- 可以控制属性的描述符（configurable、enumerable、writable、value 或 getter/setter）

### Proxy
- ES6 引入的 API
- 创建一个代理对象，拦截对目标对象的各种操作
- 可以拦截更多种类的操作（get、set、has、deleteProperty 等 13 种陷阱）

## 2. 基本用法对比

### Object.defineProperty 示例

```javascript
const obj = {};

// 定义单个属性
Object.defineProperty(obj, 'name', {
  value: 'Alice',
  writable: true,
  enumerable: true,
  configurable: true
});

// 定义带 getter/setter 的属性
Object.defineProperty(obj, 'age', {
  get() {
    return this._age || 0;
  },
  set(value) {
    if (value < 0) {
      throw new Error('Age cannot be negative');
    }
    this._age = value;
  },
  enumerable: true,
  configurable: true
});

console.log(obj.name); // Alice
obj.age = 25;
console.log(obj.age); // 25

// 无法直接设置负年龄
try {
  obj.age = -5;
} catch (error) {
  console.log(error.message); // Age cannot be negative
}
```

### Proxy 示例

```javascript
const target = {
  name: 'Bob',
  age: 30
};

const proxy = new Proxy(target, {
  get(target, property) {
    console.log(`Getting property: ${property}`);
    return target[property];
  },
  
  set(target, property, value) {
    console.log(`Setting property: ${property} = ${value}`);
    if (property === 'age' && value < 0) {
      throw new Error('Age cannot be negative');
    }
    target[property] = value;
    return true; // 表示设置成功
  }
});

console.log(proxy.name); // Getting property: name \n Bob
proxy.age = 35;          // Setting property: age = 35
console.log(proxy.age);   // Getting property: age \n 35

try {
  proxy.age = -5;
} catch (error) {
  console.log(error.message); // Age cannot be negative
}
```

## 3. 功能范围对比

### Object.defineProperty 的局限性

```javascript
const obj = {};

// 只能定义单个属性
Object.defineProperty(obj, 'prop1', {
  value: 'value1',
  writable: true
});

// 需要多次调用来定义多个属性
Object.defineProperty(obj, 'prop2', {
  value: 'value2',
  writable: true
});

// 无法拦截对象级别的操作
obj.newProp = 'new value'; // 无法拦截这个操作

// 无法拦截删除操作
delete obj.prop1; // 无法拦截这个操作

console.log(obj); // { prop1: 'value1', prop2: 'value2', newProp: 'new value' }
```

### Proxy 的全面拦截能力

```javascript
const target = { existing: 'value' };

const proxy = new Proxy(target, {
  // 拦截属性读取
  get(target, property, receiver) {
    console.log(`[GET] ${property}`);
    return Reflect.get(target, property, receiver);
  },
  
  // 拦截属性设置
  set(target, property, value, receiver) {
    console.log(`[SET] ${property} = ${value}`);
    return Reflect.set(target, property, value, receiver);
  },
  
  // 拦截属性删除
  deleteProperty(target, property) {
    console.log(`[DELETE] ${property}`);
    return Reflect.deleteProperty(target, property);
  },
  
  // 拦截 in 操作符
  has(target, property) {
    console.log(`[HAS] ${property}`);
    return Reflect.has(target, property);
  },
  
  // 拦截 Object.keys() 等
  ownKeys(target) {
    console.log(`[OWN_KEYS]`);
    return Reflect.ownKeys(target);
  }
});

// 测试各种操作
proxy.newProp = 'test';        // [SET] newProp = test
console.log(proxy.newProp);    // [GET] newProp \n test
console.log('newProp' in proxy); // [HAS] newProp \n true
delete proxy.newProp;          // [DELETE] newProp
console.log(Object.keys(proxy)); // [OWN_KEYS] \n ['existing']
```

## 4. 拦截能力详细对比

### Object.defineProperty 可拦截的操作

```javascript
const obj = {};

// 只能拦截属性的读取和写入（通过 getter/setter）
Object.defineProperty(obj, 'computedProp', {
  get() {
    console.log('Getter called');
    return this._value || 'default';
  },
  set(value) {
    console.log('Setter called with:', value);
    this._value = value.toUpperCase();
  }
});

console.log(obj.computedProp); // Getter called \n default
obj.computedProp = 'hello';    // Setter called with: hello
console.log(obj.computedProp); // Getter called \n HELLO
```

### Proxy 可拦截的 13 种操作

```javascript
const target = {};
const handlers = {
  // 1. get - 属性读取
  get(target, property, receiver) {
    console.log(`拦截 get: ${property}`);
    return target[property];
  },
  
  // 2. set - 属性设置
  set(target, property, value, receiver) {
    console.log(`拦截 set: ${property} = ${value}`);
    target[property] = value;
    return true;
  },
  
  // 3. has - in 操作符
  has(target, property) {
    console.log(`拦截 has: ${property}`);
    return property in target;
  },
  
  // 4. deleteProperty - delete 操作符
  deleteProperty(target, property) {
    console.log(`拦截 delete: ${property}`);
    return delete target[property];
  },
  
  // 5. ownKeys - Object.getOwnPropertyNames, Object.getOwnPropertySymbols, Object.keys, for...in
  ownKeys(target) {
    console.log('拦截 ownKeys');
    return Reflect.ownKeys(target);
  },
  
  // 6. getOwnPropertyDescriptor - Object.getOwnPropertyDescriptor
  getOwnPropertyDescriptor(target, property) {
    console.log(`拦截 getOwnPropertyDescriptor: ${property}`);
    return Object.getOwnPropertyDescriptor(target, property);
  },
  
  // 7. defineProperty - Object.defineProperty
  defineProperty(target, property, descriptor) {
    console.log(`拦截 defineProperty: ${property}`);
    return Object.defineProperty(target, property, descriptor);
  },
  
  // 8. preventExtensions - Object.preventExtensions
  preventExtensions(target) {
    console.log('拦截 preventExtensions');
    return Object.preventExtensions(target);
  },
  
  // 9. getPrototypeOf - Object.getPrototypeOf
  getPrototypeOf(target) {
    console.log('拦截 getPrototypeOf');
    return Object.getPrototypeOf(target);
  },
  
  // 10. setPrototypeOf - Object.setPrototypeOf
  setPrototypeOf(target, prototype) {
    console.log('拦截 setPrototypeOf');
    return Object.setPrototypeOf(target, prototype);
  },
  
  // 11. isExtensible - Object.isExtensible
  isExtensible(target) {
    console.log('拦截 isExtensible');
    return Object.isExtensible(target);
  },
  
  // 12. apply - 函数调用
  apply(target, thisArg, argumentsList) {
    console.log('拦截 apply');
    return target.apply(thisArg, argumentsList);
  },
  
  // 13. construct - new 操作符
  construct(target, argumentsList, newTarget) {
    console.log('拦截 construct');
    return new target(...argumentsList);
  }
};

const proxy = new Proxy(target, handlers);

// 测试各种操作
proxy.test = 'value';           // 拦截 set: test = value
console.log(proxy.test);        // 拦截 get: test \n value
'test' in proxy;                // 拦截 has: test
delete proxy.test;              // 拦截 delete: test
Object.keys(proxy);             // 拦截 ownKeys
```

## 5. 实际应用场景对比

### 使用 Object.defineProperty 的场景

```javascript
// 1. 创建只读属性
const config = {};
Object.defineProperty(config, 'API_KEY', {
  value: 'secret-key-123',
  writable: false,
  enumerable: false, // 不在 for...in 中显示
  configurable: false
});

console.log(config.API_KEY); // secret-key-123
config.API_KEY = 'new-key';
console.log(config.API_KEY); // secret-key-123 (未改变)

// 2. 计算属性
const user = {
  firstName: 'Alice',
  lastName: 'Smith'
};

Object.defineProperty(user, 'fullName', {
  get() {
    return `${this.firstName} ${this.lastName}`;
  },
  set(value) {
    const parts = value.split(' ');
    this.firstName = parts[0] || '';
    this.lastName = parts[1] || '';
  },
  enumerable: true,
  configurable: true
});

console.log(user.fullName); // Alice Smith
user.fullName = 'Bob Johnson';
console.log(user.firstName); // Bob
console.log(user.lastName);  // Johnson

// 3. 数据验证
const product = {};
Object.defineProperty(product, 'price', {
  get() {
    return this._price;
  },
  set(value) {
    if (typeof value !== 'number' || value < 0) {
      throw new Error('Price must be a positive number');
    }
    this._price = value;
  }
});

product.price = 29.99;
console.log(product.price); // 29.99

try {
  product.price = -10;
} catch (error) {
  console.log(error.message); // Price must be a positive number
}
```

### 使用 Proxy 的场景

```javascript
// 1. 数据验证和类型检查
const createValidatedObject = (schema) => {
  return new Proxy({}, {
    set(target, property, value) {
      if (schema[property]) {
        const type = schema[property];
        if (typeof value !== type) {
          throw new TypeError(`Property ${property} must be of type ${type}`);
        }
      }
      target[property] = value;
      return true;
    }
  });
};

const userSchema = {
  name: 'string',
  age: 'number',
  active: 'boolean'
};

const user = createValidatedObject(userSchema);
user.name = 'Alice';  // 正确
user.age = 25;        // 正确
user.active = true;   // 正确

try {
  user.age = 'twenty-five'; // 错误
} catch (error) {
  console.log(error.message); // Property age must be of type number
}

// 2. 虚拟属性和计算属性
const person = {
  firstName: 'Bob',
  lastName: 'Wilson'
};

const personProxy = new Proxy(person, {
  get(target, property) {
    if (property === 'fullName') {
      return `${target.firstName} ${target.lastName}`;
    }
    if (property === 'initials') {
      return `${target.firstName[0]}.${target.lastName[0]}.`;
    }
    return target[property];
  }
});

console.log(personProxy.fullName);  // Bob Wilson
console.log(personProxy.initials);  // B.W.

// 3. 日志和调试
const createLoggingProxy = (target, name) => {
  return new Proxy(target, {
    get(target, property, receiver) {
      console.log(`[LOG] ${name}.${property} accessed`);
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      console.log(`[LOG] ${name}.${property} set to ${value}`);
      return Reflect.set(target, property, value, receiver);
    }
  });
};

const api = {
  baseUrl: 'https://api.example.com',
  timeout: 5000
};

const loggedApi = createLoggingProxy(api, 'API');
console.log(loggedApi.baseUrl); // [LOG] API.baseUrl accessed \n https://api.example.com
loggedApi.timeout = 10000;      // [LOG] API.timeout set to 10000

// 4. 缓存机制
const createCacheProxy = (target) => {
  const cache = new Map();
  
  return new Proxy(target, {
    get(target, property, receiver) {
      if (cache.has(property)) {
        console.log(`[CACHE] Returning cached value for ${property}`);
        return cache.get(property);
      }
      
      const value = Reflect.get(target, property, receiver);
      if (typeof value === 'function') {
        // 缓存方法结果
        const cachedMethod = function(...args) {
          const cacheKey = `${property}(${JSON.stringify(args)})`;
          if (cache.has(cacheKey)) {
            console.log(`[CACHE] Returning cached result for ${cacheKey}`);
            return cache.get(cacheKey);
          }
          
          const result = value.apply(this, args);
          cache.set(cacheKey, result);
          return result;
        };
        cache.set(property, cachedMethod);
        return cachedMethod;
      }
      
      cache.set(property, value);
      return value;
    }
  });
};
```

## 6. 性能对比

```javascript
// 性能测试示例
const testObj = {};
const testProxy = new Proxy({}, {});

// 测试 Object.defineProperty 性能
console.time('Object.defineProperty');
for (let i = 0; i < 100000; i++) {
  Object.defineProperty(testObj, `prop${i}`, {
    value: i,
    writable: true,
    enumerable: true,
    configurable: true
  });
}
console.timeEnd('Object.defineProperty');

// 测试直接属性赋值性能
const directObj = {};
console.time('Direct assignment');
for (let i = 0; i < 100000; i++) {
  directObj[`prop${i}`] = i;
}
console.timeEnd('Direct assignment');

// 测试 Proxy 性能
console.time('Proxy operations');
for (let i = 0; i < 100000; i++) {
  testProxy[`prop${i}`] = i;
}
console.timeEnd('Proxy operations');

// 读取操作性能测试
console.time('Proxy read operations');
for (let i = 0; i < 100000; i++) {
  const value = testProxy[`prop${i}`];
}
console.timeEnd('Proxy read operations');
```

## 7. 兼容性对比

```javascript
// 兼容性检查
const hasDefineProperty = typeof Object.defineProperty === 'function';
const hasProxy = typeof Proxy === 'function';

console.log('Object.defineProperty supported:', hasDefineProperty); // ES5+
console.log('Proxy supported:', hasProxy); // ES6+

// 兼容性处理
function createObservableObject(target) {
  if (typeof Proxy !== 'undefined') {
    // 使用 Proxy（现代浏览器）
    return new Proxy(target, {
      set(target, property, value) {
        console.log(`Property ${property} changed from ${target[property]} to ${value}`);
        target[property] = value;
        return true;
      }
    });
  } else if (typeof Object.defineProperty !== 'undefined') {
    // 使用 Object.defineProperty 作为降级方案
    return createObservableWithDefineProperty(target);
  } else {
    // 基础支持
    return target;
  }
}

function createObservableWithDefineProperty(target) {
  const observable = {};
  
  for (const key in target) {
    if (target.hasOwnProperty(key)) {
      Object.defineProperty(observable, key, {
        get() {
          return target[key];
        },
        set(value) {
          console.log(`Property ${key} changed from ${target[key]} to ${value}`);
          target[key] = value;
        },
        enumerable: true,
        configurable: true
      });
    }
  }
  
  return observable;
}
```

## 8. 使用建议

### 何时使用 Object.defineProperty

```javascript
// 1. 需要精确控制单个属性
class MyClass {
  constructor() {
    Object.defineProperty(this, '_privateData', {
      value: {},
      writable: true,
      enumerable: false, // 隐藏属性
      configurable: false
    });
  }
  
  getPrivateData(key) {
    return this._privateData[key];
  }
  
  setPrivateData(key, value) {
    this._privateData[key] = value;
  }
}

// 2. 向后兼容老版本浏览器
function createReadOnlyProperty(obj, name, value) {
  Object.defineProperty(obj, name, {
    value: value,
    writable: false,
    enumerable: true,
    configurable: false
  });
}

// 3. 与现有对象属性集成
const existingObj = { name: 'Alice' };
Object.defineProperty(existingObj, 'id', {
  value: Math.random().toString(36),
  writable: false
});
```

### 何时使用 Proxy

```javascript
// 1. 需要拦截多种操作
const createSmartObject = (target) => {
  return new Proxy(target, {
    get(target, property) {
      // 属性不存在时的处理
      if (!(property in target)) {
        return `Property '${property}' does not exist`;
      }
      return target[property];
    },
    
    set(target, property, value) {
      // 类型验证
      if (property === 'age' && typeof value !== 'number') {
        throw new TypeError('Age must be a number');
      }
      target[property] = value;
      return true;
    }
  });
};

// 2. 创建 DSL（领域特定语言）
const createQueryDSL = () => {
  return new Proxy({}, {
    get(target, property) {
      if (property === 'where') {
        return (condition) => {
          console.log(`Adding condition: ${condition}`);
          return target;
        };
      }
      if (property === 'select') {
        return (fields) => {
          console.log(`Selecting fields: ${fields}`);
          return target;
        };
      }
      return target[property];
    }
  });
};

// 使用示例
const query = createQueryDSL();
query.where('age > 18').select('name, email');

// 3. 实现响应式系统（如 Vue 3）
const createReactive = (target) => {
  return new Proxy(target, {
    get(target, property, receiver) {
      console.log(`Tracking: ${property}`);
      return Reflect.get(target, property, receiver);
    },
    
    set(target, property, value, receiver) {
      console.log(`Triggering update for: ${property}`);
      const result = Reflect.set(target, property, value, receiver);
      // 这里可以触发视图更新
      return result;
    }
  });
};
```

## 总结对比表

| 特性 | Object.defineProperty | Proxy |
|------|---------------------|-------|
| 引入版本 | ES5 | ES6 |
| 拦截范围 | 单个属性 | 整个对象 |
| 拦截操作数 | 2种（get/set） | 13种 |
| 性能 | 较高 | 较低 |
| 兼容性 | 更好 | 需要ES6支持 |
| 使用复杂度 | 简单 | 复杂 |
| 灵活性 | 有限 | 很高 |
| 适用场景 | 属性精确控制 | 对象行为全面拦截 |

选择使用哪个取决于具体需求：
- **精确控制属性**：使用 `Object.defineProperty`
- **全面拦截对象行为**：使用 `Proxy`
- **需要向后兼容**：优先考虑 `Object.defineProperty`
- **构建高级功能**：`Proxy` 提供更多可能性