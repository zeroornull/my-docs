---
title: ES6中的Proxy
---

## ES6 中 Proxy（代理）详解

Proxy 是 ES6 引入的一个强大特性，它允许你创建一个代理对象，用来拦截并自定义 JavaScript 对象的基本操作（如属性查找、赋值、枚举、函数调用等）。

## Proxy 的基本语法

```javascript
const proxy = new Proxy(target, handler);
```

- `target`: 要代理的目标对象
- `handler`: 包含拦截方法的对象（也称为陷阱，traps）

## Proxy 支持的拦截操作

```javascript
const handler = {
  // 属性读取拦截
  get(target, property, receiver) {
    return target[property];
  },
  
  // 属性设置拦截
  set(target, property, value, receiver) {
    target[property] = value;
    return true;
  },
  
  // in 操作符拦截
  has(target, property) {
    return property in target;
  },
  
  // delete 操作符拦截
  deleteProperty(target, property) {
    delete target[property];
    return true;
  },
  
  // 函数调用拦截
  apply(target, thisArg, argumentsList) {
    return target.apply(thisArg, argumentsList);
  },
  
  // new 操作符拦截
  construct(target, argumentsList, newTarget) {
    return new target(...argumentsList);
  }
};

const obj = { name: '张三' };
const proxy = new Proxy(obj, handler);
```

## 实际使用场景

### 1. 数据验证和类型检查

```javascript
// 创建一个带验证的用户对象
function createUser(data) {
  return new Proxy(data, {
    set(target, property, value) {
      switch (property) {
        case 'age':
          if (typeof value !== 'number' || value < 0 || value > 150) {
            throw new Error('年龄必须是0-150之间的数字');
          }
          break;
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            throw new Error('邮箱格式不正确');
          }
          break;
        case 'name':
          if (typeof value !== 'string' || value.length === 0) {
            throw new Error('姓名必须是非空字符串');
          }
          break;
      }
      
      target[property] = value;
      return true;
    }
  });
}

const user = createUser({ name: '张三', age: 25, email: 'zhangsan@example.com' });

try {
  user.age = -5; // 抛出错误: 年龄必须是0-150之间的数字
} catch (error) {
  console.error(error.message);
}

try {
  user.email = 'invalid-email'; // 抛出错误: 邮箱格式不正确
} catch (error) {
  console.error(error.message);
}

user.age = 30; // 正常设置
console.log(user.age); // 30
```

### 2. 访问日志和监控

```javascript
// 创建一个带访问日志的对象
function createLoggedObject(obj, objectName = 'Object') {
  return new Proxy(obj, {
    get(target, property, receiver) {
      console.log(`[${new Date().toISOString()}] 读取 ${objectName}.${property}`);
      return Reflect.get(target, property, receiver);
    },
    
    set(target, property, value, receiver) {
      console.log(`[${new Date().toISOString()}] 设置 ${objectName}.${property} = ${value}`);
      return Reflect.set(target, property, value, receiver);
    }
  });
}

const user = createLoggedObject({
  name: '李四',
  age: 28
}, 'User');

console.log(user.name); // 记录读取日志
user.age = 29; // 记录设置日志
```

### 3. 负索引数组（类似 Python）

```javascript
// 创建支持负索引的数组
function createNegativeIndexArray(...elements) {
  const arr = [...elements];
  
  return new Proxy(arr, {
    get(target, property) {
      // 处理负索引
      if (typeof property === 'string' && /^-?\d+$/.test(property)) {
        const index = parseInt(property);
        if (index < 0) {
          const positiveIndex = target.length + index;
          if (positiveIndex >= 0) {
            return target[positiveIndex];
          }
        }
      }
      return target[property];
    },
    
    set(target, property, value) {
      if (typeof property === 'string' && /^-?\d+$/.test(property)) {
        const index = parseInt(property);
        if (index < 0) {
          const positiveIndex = target.length + index;
          if (positiveIndex >= 0) {
            target[positiveIndex] = value;
            return true;
          }
        }
      }
      target[property] = value;
      return true;
    }
  });
}

const arr = createNegativeIndexArray('a', 'b', 'c', 'd');
console.log(arr[0]);  // 'a'
console.log(arr[-1]); // 'd' (最后一个元素)
console.log(arr[-2]); // 'c' (倒数第二个元素)

arr[-1] = 'z';
console.log(arr); // ['a', 'b', 'c', 'z']
```

### 4. 私有属性模拟

```javascript
// 创建支持私有属性的对象
function createPrivateObject(obj) {
  const privateProperties = new WeakMap();
  privateProperties.set(obj, {});
  
  return new Proxy(obj, {
    get(target, property) {
      // 检查是否为私有属性（以 _ 开头）
      if (property.startsWith('_')) {
        throw new Error(`无法访问私有属性: ${property}`);
      }
      
      return target[property];
    },
    
    set(target, property, value) {
      // 私有属性存储在 WeakMap 中
      if (property.startsWith('_')) {
        const privateData = privateProperties.get(target);
        privateData[property] = value;
        return true;
      }
      
      target[property] = value;
      return true;
    }
  });
}

const obj = createPrivateObject({ publicProp: '公开属性' });
obj.publicProp = '新值'; // 正常
console.log(obj.publicProp); // '新值'

// obj._privateProp = '私有属性'; // 这样会报错
// console.log(obj._privateProp); // 这样也会报错
```

### 5. 缓存和记忆化

```javascript
// 创建带缓存功能的函数
function createMemoizedFunction(fn) {
  const cache = new Map();
  
  const handler = {
    apply(target, thisArg, argumentsList) {
      const key = JSON.stringify(argumentsList);
      
      if (cache.has(key)) {
        console.log('从缓存返回结果');
        return cache.get(key);
      }
      
      console.log('计算结果并缓存');
      const result = target.apply(thisArg, argumentsList);
      cache.set(key, result);
      return result;
    }
  };
  
  return new Proxy(fn, handler);
}

// 斐波那契数列示例
const fibonacci = createMemoizedFunction(function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
});

console.log(fibonacci(10)); // 计算并缓存 -> 55
console.log(fibonacci(10)); // 从缓存返回 -> 55
console.log(fibonacci(8));  // 部分从缓存返回 -> 21
```

### 6. 响应式数据（简化版 Vue）

```javascript
// 创建简单的响应式对象
function createReactiveObject(obj, callback) {
  function createReactive(target) {
    if (typeof target !== 'object' || target === null) {
      return target;
    }
    
    // 递归处理嵌套对象
    for (const key in target) {
      if (typeof target[key] === 'object' && target[key] !== null) {
        target[key] = createReactive(target[key]);
      }
    }
    
    return new Proxy(target, {
      get(target, property, receiver) {
        const value = Reflect.get(target, property, receiver);
        console.log(`获取属性: ${property}`);
        return value;
      },
      
      set(target, property, value, receiver) {
        const oldValue = target[property];
        const result = Reflect.set(target, property, value, receiver);
        
        // 如果值发生变化，触发回调
        if (oldValue !== value) {
          console.log(`设置属性: ${property} = ${value}`);
          callback && callback(property, value, oldValue);
        }
        
        return result;
      }
    });
  }
  
  return createReactive(obj);
}

// 使用示例
const reactiveData = createReactiveObject(
  { 
    name: '张三', 
    age: 25,
    profile: {
      city: '北京'
    }
  },
  (property, newValue, oldValue) => {
    console.log(`数据变化: ${property} 从 ${oldValue} 变为 ${newValue}`);
  }
);

reactiveData.name = '李四'; // 触发响应
reactiveData.profile.city = '上海'; // 触发响应
```

### 7. API 请求代理

```javascript
// 创建 API 客户端代理
function createApiClient(baseURL) {
  const apiClient = {};
  
  return new Proxy(apiClient, {
    get(target, property) {
      // 动态创建 API 方法
      return async function(data) {
        const endpoint = `/${property.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        const url = `${baseURL}${endpoint}`;
        
        console.log(`请求 ${url}`, data);
        
        // 模拟 API 调用
        return new Promise(resolve => {
          setTimeout(() => {
            resolve({ 
              success: true, 
              data: { 
                id: Math.floor(Math.random() * 1000),
                ...data 
              } 
            });
          }, 1000);
        });
      };
    }
  });
}

// 使用示例
const api = createApiClient('https://api.example.com');

// 调用会自动转换为相应的 API 端点
api.createUser({ name: '张三' }).then(response => {
  console.log('创建用户:', response);
});

api.updateUser({ id: 1, name: '李四' }).then(response => {
  console.log('更新用户:', response);
});
```

### 8. 不可变对象

```javascript
// 创建不可变对象
function createImmutableObject(obj) {
  return new Proxy(obj, {
    set() {
      throw new Error('不能修改不可变对象');
    },
    
    deleteProperty() {
      throw new Error('不能删除不可变对象的属性');
    },
    
    defineProperty() {
      throw new Error('不能定义不可变对象的新属性');
    }
  });
}

const immutableUser = createImmutableObject({ name: '张三', age: 25 });

try {
  immutableUser.name = '李四'; // 抛出错误
} catch (error) {
  console.error(error.message); // 不能修改不可变对象
}

console.log(immutableUser.name); // '张三'
```

### 9. 枚举和默认值

```javascript
// 创建带默认值和枚举验证的对象
function createValidatedObject(schema, defaults = {}) {
  const obj = { ...defaults };
  
  return new Proxy(obj, {
    get(target, property) {
      // 返回默认值或 undefined
      if (!(property in target)) {
        return defaults[property];
      }
      return target[property];
    },
    
    set(target, property, value) {
      // 验证枚举值
      if (schema[property] && Array.isArray(schema[property].enum)) {
        if (!schema[property].enum.includes(value)) {
          throw new Error(`值 "${value}" 不在允许的枚举值中: [${schema[property].enum.join(', ')}]`);
        }
      }
      
      // 验证类型
      if (schema[property] && schema[property].type) {
        if (typeof value !== schema[property].type) {
          throw new Error(`属性 ${property} 必须是 ${schema[property].type} 类型`);
        }
      }
      
      target[property] = value;
      return true;
    }
  });
}

const userSchema = {
  status: { enum: ['active', 'inactive', 'pending'] },
  age: { type: 'number' },
  name: { type: 'string' }
};

const defaults = {
  status: 'pending',
  age: 0
};

const user = createValidatedObject(userSchema, defaults);

console.log(user.status); // 'pending' (默认值)
user.name = '张三'; // 正常
user.status = 'active'; // 正常

try {
  user.status = 'invalid'; // 抛出错误
} catch (error) {
  console.error(error.message);
}
```

### 10. 链式调用构建器

```javascript
// 创建链式调用构建器
function createQueryBuilder(initialQuery = {}) {
  const query = { ...initialQuery };
  
  const handler = {
    get(target, property) {
      if (property === 'build') {
        return () => ({ ...target });
      }
      
      return function(value) {
        target[property] = value;
        return new Proxy(target, handler);
      };
    }
  };
  
  return new Proxy(query, handler);
}

// 使用示例
const query = createQueryBuilder()
  .select('name, age')
  .from('users')
  .where('age > 18')
  .orderBy('name')
  .build();

console.log(query);
// { select: 'name, age', from: 'users', where: 'age > 18', orderBy: 'name' }
```

## Proxy 的优势和注意事项

### 优势：
1. **强大的拦截能力**：可以拦截几乎所有对象操作
2. **动态性**：可以在运行时动态地改变对象行为
3. **透明性**：对使用者来说，代理对象和普通对象没有区别
4. **灵活性**：可以实现各种高级功能，如响应式、缓存、验证等

### 注意事项：
1. **性能开销**：Proxy 会带来一定的性能开销
2. **兼容性**：IE 不支持 Proxy
3. **调试困难**：过度使用可能使代码难以调试
4. **this 指向**：需要注意 Proxy 中的 this 指向问题

Proxy 是一个非常强大的特性，合理使用可以让 JavaScript 代码更加灵活和强大，但也要注意不要过度使用，以免影响代码的可读性和性能。