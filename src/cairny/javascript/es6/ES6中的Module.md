---
title: ES6中的Module
---

## ES6 Module（模块）详解

ES6 Module 是 JavaScript 语言级别的模块系统，它提供了一种标准化的方式来组织和管理代码，使得代码更加模块化、可维护和可复用。

## ES6 Module 的基本语法

### 1. 导出（Export）

```javascript
// 命名导出
export const PI = 3.14159;
export function add(a, b) {
    return a + b;
}
export class Calculator {
    // ...
}

// 或者统一导出
const MAX_SIZE = 100;
function subtract(a, b) {
    return a - b;
}
export { MAX_SIZE, subtract };

// 重命名导出
export { MAX_SIZE as maxSize, subtract as minus };

// 默认导出
export default function multiply(a, b) {
    return a * b;
}

// 或者
function divide(a, b) {
    return a / b;
}
export default divide;
```

### 2. 导入（Import）

```javascript
// 导入命名导出
import { PI, add, Calculator } from './math.js';

// 导入并重命名
import { PI as pi, add as sum } from './math.js';

// 导入所有命名导出
import * as mathUtils from './math.js';

// 导入默认导出
import multiply from './math.js';

// 同时导入默认和命名导出
import divide, { PI, add } from './math.js';

// 仅导入副作用（不导入任何值，但执行模块代码）
import './side-effects.js';
```

## ES6 Module 的核心特性

### 1. 静态分析
```javascript
// ES6 Module 是静态的，可以在编译时分析依赖关系
import { add } from './math.js'; // 在编译时就知道要导入什么

// 这在运行时是不允许的
// if (condition) {
//     import { add } from './math.js'; // 语法错误
// }
```

### 2. 值的引用（而不是值的拷贝）
```javascript
// counter.js
export let count = 0;
export function increment() {
    count++;
}
export function getCount() {
    return count;
}

// main.js
import { count, increment, getCount } from './counter.js';

console.log(count); // 0
increment();
console.log(count); // 1
console.log(getCount()); // 1
```

### 3. 单例模式
```javascript
// config.js
let config = {
    apiUrl: 'https://api.example.com',
    timeout: 5000
};

export function updateConfig(newConfig) {
    config = { ...config, ...newConfig };
}

export default config;

// 在多个模块中导入同一个模块，得到的是同一个实例
// module1.js
import config, { updateConfig } from './config.js';

// module2.js
import config from './config.js';
// config 与 module1 中的是同一个对象
```

## 实际使用场景

### 1. 工具函数库

```javascript
// utils/string.js
export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function truncate(str, length) {
    return str.length > length ? str.slice(0, length) + '...' : str;
}

export function slugify(str) {
    return str.toLowerCase().replace(/\s+/g, '-');
}

// utils/array.js
export function chunk(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}

export function unique(array) {
    return [...new Set(array)];
}

export function shuffle(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

// utils/index.js
export { capitalize, truncate, slugify } from './string.js';
export { chunk, unique, shuffle } from './array.js';

// 使用
import { capitalize, chunk } from './utils/index.js';
```

### 2. 配置管理

```javascript
// config/app.js
const appConfig = {
    name: 'MyApp',
    version: '1.0.0',
    debug: process.env.NODE_ENV !== 'production'
};

export default appConfig;

// config/database.js
export const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'myapp'
};

export const redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
};

// config/index.js
import appConfig from './app.js';
import { dbConfig, redisConfig } from './database.js';

export {
    appConfig,
    dbConfig,
    redisConfig
};

// 使用
import { appConfig, dbConfig } from './config/index.js';
```

### 3. 组件模块化（前端框架）

```javascript
// components/Button/Button.jsx
import React from 'react';
import './Button.css';

export const Button = ({ children, variant = 'primary', onClick, disabled }) => {
    return (
        <button 
            className={`btn btn-${variant}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;

// components/Button/index.js
export { Button } from './Button.jsx';
export { default } from './Button.jsx';

// components/index.js
export { default as Button } from './Button';
export { default as Card } from './Card';
export { default as Modal } from './Modal';

// 使用
import { Button, Card } from './components/index.js';
// 或者
import Button from './components/Button/index.js';
```

### 4. API 服务模块

```javascript
// services/api.js
class ApiClient {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }
    
    async get(endpoint) {
        const response = await fetch(`${this.baseURL}${endpoint}`);
        return response.json();
    }
    
    async post(endpoint, data) {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return response.json();
    }
}

const apiClient = new ApiClient('https://api.example.com');
export default apiClient;

// services/userService.js
import apiClient from './api.js';

export class UserService {
    static async getUsers() {
        return await apiClient.get('/users');
    }
    
    static async getUserById(id) {
        return await apiClient.get(`/users/${id}`);
    }
    
    static async createUser(userData) {
        return await apiClient.post('/users', userData);
    }
}

// services/index.js
export { UserService } from './userService.js';
export { default as apiClient } from './api.js';

// 使用
import { UserService } from './services/index.js';
```

### 5. 中间件和插件系统

```javascript
// middleware/logger.js
export const loggerMiddleware = (req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
};

// middleware/auth.js
export const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: '未授权' });
    }
    // 验证 token...
    next();
};

// middleware/index.js
export { loggerMiddleware } from './logger.js';
export { authMiddleware } from './auth.js';

// app.js
import { loggerMiddleware, authMiddleware } from './middleware/index.js';

app.use(loggerMiddleware);
app.use('/api', authMiddleware);
```

### 6. 常量和枚举管理

```javascript
// constants/statusCodes.js
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
};

export const USER_ROLES = {
    ADMIN: 'admin',
    MODERATOR: 'moderator',
    USER: 'user'
};

// constants/messages.js
export const ERROR_MESSAGES = {
    USER_NOT_FOUND: '用户不存在',
    INVALID_CREDENTIALS: '用户名或密码错误',
    PERMISSION_DENIED: '权限不足'
};

export const SUCCESS_MESSAGES = {
    USER_CREATED: '用户创建成功',
    DATA_UPDATED: '数据更新成功'
};

// constants/index.js
export { HTTP_STATUS, USER_ROLES } from './statusCodes.js';
export { ERROR_MESSAGES, SUCCESS_MESSAGES } from './messages.js';

// 使用
import { HTTP_STATUS, ERROR_MESSAGES } from './constants/index.js';
```

### 7. 主题和样式管理

```javascript
// themes/light.js
export default {
    colors: {
        primary: '#007bff',
        secondary: '#6c757d',
        success: '#28a745',
        danger: '#dc3545'
    },
    spacing: {
        small: '8px',
        medium: '16px',
        large: '24px'
    }
};

// themes/dark.js
export default {
    colors: {
        primary: '#0d6efd',
        secondary: '#6c757d',
        success: '#198754',
        danger: '#dc3545'
    },
    spacing: {
        small: '8px',
        medium: '16px',
        large: '24px'
    }
};

// themes/index.js
import lightTheme from './light.js';
import darkTheme from './dark.js';

export {
    lightTheme,
    darkTheme
};

export const themes = {
    light: lightTheme,
    dark: darkTheme
};

// 使用
import { themes } from './themes/index.js';
```

### 8. 错误处理模块

```javascript
// errors/CustomError.js
export class CustomError extends Error {
    constructor(message, code, statusCode = 500) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        this.statusCode = statusCode;
    }
}

// errors/ValidationError.js
import { CustomError } from './CustomError.js';

export class ValidationError extends CustomError {
    constructor(message, field) {
        super(message, 'VALIDATION_ERROR', 400);
        this.field = field;
    }
}

// errors/NotFoundError.js
import { CustomError } from './CustomError.js';

export class NotFoundError extends CustomError {
    constructor(resource) {
        super(`${resource} 未找到`, 'NOT_FOUND', 404);
    }
}

// errors/index.js
export { CustomError } from './CustomError.js';
export { ValidationError } from './ValidationError.js';
export { NotFoundError } from './NotFoundError.js';

// 使用
import { ValidationError, NotFoundError } from './errors/index.js';
```

## ES6 Module 的优势

### 1. 循环依赖处理
```javascript
// a.js
import { b } from './b.js';
export const a = 'a';
console.log('b:', b); // undefined (循环依赖时可能为 undefined)

// b.js
import { a } from './a.js';
export const b = 'b';
console.log('a:', a); // undefined (循环依赖时可能为 undefined)
```

### 2. Tree Shaking 支持
```javascript
// utils.js
export function usedFunction() {
    return 'used';
}

export function unusedFunction() {
    return 'unused';
}

// main.js
import { usedFunction } from './utils.js';
// unusedFunction 不会被打包到最终代码中
```

### 3. 异步加载
```javascript
// 动态导入
async function loadModule() {
    const { someFunction } = await import('./heavy-module.js');
    return someFunction();
}

// 条件加载
if (condition) {
    import('./module.js').then(module => {
        module.doSomething();
    });
}
```

## 最佳实践

1. **明确导出方式**：优先使用命名导出，只在必要时使用默认导出
2. **统一入口**：为相关模块创建 index.js 文件作为统一入口
3. **避免循环依赖**：设计时尽量避免模块间的循环依赖
4. **合理分组**：将相关的功能组织在同一个模块或目录下
5. **文档化**：为导出的函数和类提供清晰的文档说明

ES6 Module 为现代 JavaScript 开发提供了强大的模块化能力，使得大型应用的代码组织和维护变得更加容易。