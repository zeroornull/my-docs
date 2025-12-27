---
title: devDependencies 和 dependencies
---


:::note
在 Node.js 项目中，package.json 文件中的 dependencies 和 devDependencies 都是用来声明项目依赖的，但它们有不同的用途和适用场景。
:::

##### 1. dependencies（生产依赖）
* 定义：项目运行时（生产环境）必须的依赖包。
* 安装方式：
```bash
npm install <package-name> --save
# 或简写（npm 5+ 默认）
npm install <package-name>
```

* 特点：
    * 这些依赖会被打包到最终的生产代码中（如部署到服务器或发布为 npm 包时）。
    * 通常是项目的核心功能依赖，例如：
        1. 框架：react, express, vue
        2. 工具库：lodash, axios
        3. 运行时需要的模块：dotenv（读取环境变量）
```json
"dependencies": {
  "express": "^4.18.2",
  "lodash": "^4.17.21"
}
```

##### 2. devDependencies（开发依赖）
* 定义：仅在开发阶段需要的依赖包，生产环境不需要。
* 安装方式：
```bash
npm install <package-name> --save-dev
# 或简写
npm install <package-name> -D
```

* 特点：
  * 这些依赖不会被打包到生产环境中。
  * 通常是开发工具、测试库、构建工具等，例如：
    1. 构建工具：webpack, vite, babel
    2. 测试框架：jest, mocha
    3. 代码格式化：eslint, prettier
    4. 类型定义：@types/react（TypeScript 类型支持）
```json
"devDependencies": {
  "eslint": "^8.56.0",
  "webpack": "^5.89.0"
}
```

**3. 核心区别**
| 特性     | dependencies       | devDependencies       |
| -------- | ------------------ | --------------------- |
| 环境     | 生产环境           | 开发环境              |
| 打包部署 | 包含               | 不包含                |
| 安装命令 | npm install <包名> | npm install <包名> -D |
| 典型用途 | 项目核心功能       | 开发工具、测试、构建  |

**4. 为什么需要区分？**
 * 减少生产环境体积：避免将不必要的开发工具打包到生产代码中。
 * 安全性：生产环境不需要的开发工具可能包含潜在漏洞。
 * 清晰的项目结构：明确区分核心功能和开发辅助工具。

**5. 特殊情况**
* **peerDependencies：** 当开发插件或库时，声明其需要宿主环境提供的依赖（如 react 插件需要宿主项目安装 react）。
* **optionalDependencies：** 可选依赖，即使安装失败也不会影响项目运行。

**6. 常见问题**
* **误将生产依赖装到 devDependencies：** 会导致生产环境运行时报错（如未安装 express）。
* **误将开发依赖装到 dependencies：** 会增加生产环境的体积，但通常不会影响运行（如 webpack 被打包进去）。

**7. 最佳实践**
* **开发工具、测试框架、构建工具 → devDependencies。**
* **项目运行必需的库 → dependencies。**
* **不确定时：**
    * 如果是项目功能的一部分（如 axios 发请求），用 dependencies；
    * 如果是工具（如 eslint 校验代码），用 devDependencies。

