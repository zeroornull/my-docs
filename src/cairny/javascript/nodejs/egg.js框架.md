---
title: egg.js框架
---

## Egg.js 框架详解

### 什么是 Egg.js

Egg.js 是阿里巴巴开源的企业级 Node.js 框架，基于 Koa 封装，提供了更好的插件机制和约定优于配置的理念。

### 核心特性

- **约定优于配置**：按照框架约定的目录结构组织代码
- **插件机制**：强大的插件系统，可扩展性强
- **多进程管理**：内置多进程管理能力
- **错误处理**：统一的错误处理机制
- **安全防护**：内置多种安全防护机制

### 目录结构

```
app/
  ├── controller/     # 控制器层
  ├── service/        # 服务层
  ├── model/          # 数据模型层
  ├── middleware/     # 中间件
  ├── router.js       # 路由配置
  └── extend/         # 扩展
config/
  ├── config.default.js  # 默认配置
  ├── config.prod.js     # 生产环境配置
  └── plugin.js          # 插件配置
```

### 示例 Demo：用户管理系统

#### 1. 初始化项目

```bash
mkdir egg-demo
cd egg-demo
npm init egg --type=simple
npm install
```

#### 2. 配置文件

**config/config.default.js**
```javascript
module.exports = appInfo => {
  const config = exports = {};

  // 应用基本信息
  config.keys = appInfo.name + '_1628764035678_3456';

  // 中间件配置
  config.middleware = [];

  // 安全配置
  config.security = {
    csrf: {
      enable: false,
    },
  };

  // 数据库配置（示例）
  config.mysql = {
    client: {
      host: 'localhost',
      port: '3306',
      user: 'root',
      password: 'password',
      database: 'test',
    },
    app: true,
    agent: false,
  };

  return config;
};
```

#### 3. 路由配置

**app/router.js**
```javascript
module.exports = app => {
  const { router, controller } = app;
  
  // 用户相关路由
  router.get('/users', controller.user.index);
  router.get('/users/:id', controller.user.show);
  router.post('/users', controller.user.create);
  router.put('/users/:id', controller.user.update);
  router.delete('/users/:id', controller.user.destroy);
  
  // 首页
  router.get('/', controller.home.index);
};
```

#### 4. 控制器层

**app/controller/home.js**
```javascript
const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = {
      message: 'Welcome to Egg.js Demo',
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = HomeController;
```

**app/controller/user.js**
```javascript
const Controller = require('egg').Controller;

class UserController extends Controller {
  // 获取用户列表
  async index() {
    const { ctx } = this;
    try {
      const users = await ctx.service.user.list();
      ctx.body = {
        code: 200,
        data: users,
        message: 'success'
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        message: error.message
      };
    }
  }

  // 获取单个用户
  async show() {
    const { ctx } = this;
    try {
      const id = ctx.params.id;
      const user = await ctx.service.user.find(id);
      
      if (!user) {
        ctx.body = {
          code: 404,
          message: 'User not found'
        };
        return;
      }
      
      ctx.body = {
        code: 200,
        data: user,
        message: 'success'
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        message: error.message
      };
    }
  }

  // 创建用户
  async create() {
    const { ctx } = this;
    try {
      // 验证参数
      ctx.validate({
        name: { type: 'string', required: true },
        email: { type: 'email', required: true }
      });
      
      const user = await ctx.service.user.create(ctx.request.body);
      ctx.body = {
        code: 201,
        data: user,
        message: 'User created successfully'
      };
    } catch (error) {
      ctx.body = {
        code: 400,
        message: error.message
      };
    }
  }

  // 更新用户
  async update() {
    const { ctx } = this;
    try {
      const id = ctx.params.id;
      const user = await ctx.service.user.update(id, ctx.request.body);
      
      if (!user) {
        ctx.body = {
          code: 404,
          message: 'User not found'
        };
        return;
      }
      
      ctx.body = {
        code: 200,
        data: user,
        message: 'User updated successfully'
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        message: error.message
      };
    }
  }

  // 删除用户
  async destroy() {
    const { ctx } = this;
    try {
      const id = ctx.params.id;
      const result = await ctx.service.user.delete(id);
      
      if (!result) {
        ctx.body = {
          code: 404,
          message: 'User not found'
        };
        return;
      }
      
      ctx.body = {
        code: 200,
        message: 'User deleted successfully'
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        message: error.message
      };
    }
  }
}

module.exports = UserController;
```

#### 5. 服务层

**app/service/user.js**
```javascript
const Service = require('egg').Service;

class UserService extends Service {
  // 模拟数据存储
  constructor(ctx) {
    super(ctx);
    // 在实际项目中，这里应该是数据库操作
    if (!this.ctx.app.users) {
      this.ctx.app.users = [
        { id: 1, name: '张三', email: 'zhangsan@example.com' },
        { id: 2, name: '李四', email: 'lisi@example.com' }
      ];
      this.ctx.app.nextId = 3;
    }
  }

  // 获取用户列表
  async list() {
    return this.ctx.app.users;
  }

  // 根据ID查找用户
  async find(id) {
    const userId = parseInt(id);
    return this.ctx.app.users.find(user => user.id === userId);
  }

  // 创建用户
  async create(user) {
    const newUser = {
      id: this.ctx.app.nextId++,
      name: user.name,
      email: user.email
    };
    this.ctx.app.users.push(newUser);
    return newUser;
  }

  // 更新用户
  async update(id, updates) {
    const userId = parseInt(id);
    const index = this.ctx.app.users.findIndex(user => user.id === userId);
    
    if (index === -1) {
      return null;
    }
    
    const updatedUser = {
      ...this.ctx.app.users[index],
      ...updates
    };
    
    this.ctx.app.users[index] = updatedUser;
    return updatedUser;
  }

  // 删除用户
  async delete(id) {
    const userId = parseInt(id);
    const index = this.ctx.app.users.findIndex(user => user.id === userId);
    
    if (index === -1) {
      return false;
    }
    
    this.ctx.app.users.splice(index, 1);
    return true;
  }
}

module.exports = UserService;
```

#### 6. 启动应用

```bash
npm run dev
```

### API 接口测试

启动服务后，可以通过以下方式测试API：

1. **获取用户列表**
   ```
   GET http://localhost:7001/users
   ```

2. **创建用户**
   ```
   POST http://localhost:7001/users
   Content-Type: application/json
   
   {
     "name": "王五",
     "email": "wangwu@example.com"
   }
   ```

3. **获取单个用户**
   ```
   GET http://localhost:7001/users/1
   ```

4. **更新用户**
   ```
   PUT http://localhost:7001/users/1
   Content-Type: application/json
   
   {
     "name": "张三丰",
     "email": "zhangsanfeng@example.com"
   }
   ```

5. **删除用户**
   ```
   DELETE http://localhost:7001/users/1
   ```

### 核心概念说明

#### 1. Context (ctx)
Egg.js 中的 `ctx` 对象封装了 Koa 的 `request` 和 `response` 对象，并提供了许多便捷方法：
- `ctx.request` - 请求对象
- `ctx.response` - 响应对象
- `ctx.service` - 服务层访问
- `ctx.params` - 路由参数
- `ctx.query` - 查询参数
- `ctx.body` - 响应体

#### 2. Service 层
服务层用于处理业务逻辑，通常包括：
- 数据库操作
- 复杂业务逻辑
- 第三方服务调用

#### 3. Controller 层
控制器层负责：
- 解析用户输入
- 调用 Service 层处理业务
- 返回响应结果

#### 4. 插件机制
Egg.js 通过插件扩展功能：
```javascript
// config/plugin.js
exports.mysql = {
  enable: true,
  package: 'egg-mysql',
};
```

### 优势总结

1. **企业级特性**：经过阿里巴巴大规模应用验证
2. **插件生态**：丰富的插件生态支持
3. **约定优于配置**：减少配置复杂度
4. **高可扩展性**：良好的架构设计支持扩展
5. **开发效率**：提供了完整的开发工具链

这个 Demo 展示了 Egg.js 的基本用法，实际项目中可以结合数据库、缓存、消息队列等组件构建完整的企业级应用。