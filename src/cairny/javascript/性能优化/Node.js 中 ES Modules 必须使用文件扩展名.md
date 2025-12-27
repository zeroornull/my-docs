---
title: Node.js 中 ES Modules 必须使用文件扩展名
---


##### 1. 遵循浏览器行为
ES Modules 的设计初衷是与浏览器行为保持一致。在浏览器中：
```javascript
<script type="module" src="./module.js"></script>
```

必须明确指定完整的 URL（包括扩展名）。Node.js 的 ESM 实现遵循了这一原则，以保持与浏览器环境的一致性。


##### 2. 明确的模块解析
**扩展名要求使得模块解析更加明确和可预测：**
* 消除了解析时的歧义
* 避免了不必要的文件系统查找
* 使模块解析算法更简单高效

##### 3. 性能优化
省略扩展名会导致性能开销，因为 Node.js 需要尝试多种可能的扩展名组合：
```javascript
// CommonJS 中可能会尝试查找这些文件：
require('./module') → 
  ./module.js
  ./module.json
  ./module.node
  ./module/index.js
  ...
```
ESM 通过强制扩展名避免了这种试探性查找。

##### 4. 类型安全
明确的扩展名有助于确保加载正确类型的文件：
* .js - JavaScript 模块
* .mjs - 明确标记为 ESM 的模块
* .cjs - CommonJS 模块
* .json - JSON 文件
* .node - 原生插件

##### 5. 与 CommonJS 的区别
CommonJS 的 require() 有更复杂的解析算法，但 ESM 选择了更简单、更明确的方式：
| 特性     | ES Modules   | CommonJS            |
| -------- | ------------ | ------------------- |
| 扩展名   | 必须明确     | 可省略              |
| 目录引用 | 必须完整路径 | 可自动查找 index.js |
| 解析算法 | 简单明确     | 复杂试探性          |

##### 实际示例
**有效用法:**
```javascript
import './module.js';
import '../json/data.json';
import { func } from '/absolute/path/module.js';
```

**无效用法:**
```javascript
import './module'; // 错误: 必须包含扩展名
import './directory'; // 错误: 不能自动查找 index.js
```

**解决方法:**
如果确实需要省略扩展名，可以考虑：
* 使用 --experimental-specifier-resolution=node 标志（不推荐用于生产）
* 使用自定义加载器
* 使用构建工具（如 Webpack、Rollup）处理导入

###### 总结
Node.js 对 ES Modules 的扩展名要求是为了实现更简单、更一致、更高效的模块系统，同时保持与浏览器行为的兼容性。虽然这增加了一些编码时的严格性，但带来了更好的长期可维护性和性能。
