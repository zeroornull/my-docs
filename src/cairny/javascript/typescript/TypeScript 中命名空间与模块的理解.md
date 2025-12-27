---
title: TypeScript 中命名空间与模块的理解
---

## TypeScript 中的命名空间与模块

### 命名空间 (Namespace)

命名空间是 TypeScript 早期版本中组织代码的方式，用来解决全局作用域中命名冲突的问题。

#### 特点：
- 使用 `namespace` 关键字定义
- 主要用于组织代码，避免全局污染
- 可以嵌套使用
- 编译后会生成全局可访问的对象

#### 示例：

```typescript
namespace Validation {
    export interface StringValidator {
        isAcceptable(s: string): boolean;
    }
    
    const lettersRegexp = /^[A-Za-z]+$/;
    
    export class LettersOnlyValidator implements StringValidator {
        isAcceptable(s: string) {
            return lettersRegexp.test(s);
        }
    }
    
    export class ZipCodeValidator implements StringValidator {
        isAcceptable(s: string) {
            return s.length === 5 && /^[0-9]+$/.test(s);
        }
    }
}

// 使用命名空间中的类
let validator = new Validation.LettersOnlyValidator();
```

### 模块 (Module)

模块是 ES6 标准引入的概念，TypeScript 完全支持。模块具有自己的作用域，需要显式导入导出。

#### 特点：
- 使用 `import`/`export` 语法
- 每个文件都是一个模块
- 更好的依赖管理
- 支持按需加载
- 符合现代 JavaScript 标准

#### 示例：

```typescript
// validator.ts
export interface StringValidator {
    isAcceptable(s: string): boolean;
}

export class LettersOnlyValidator implements StringValidator {
    isAcceptable(s: string) {
        return /^[A-Za-z]+$/.test(s);
    }
}

export class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
        return s.length === 5 && /^[0-9]+$/.test(s);
    }
}

// 默认导出
export default class DefaultValidator implements StringValidator {
    isAcceptable(s: string) {
        return s.length > 0;
    }
}
```

```typescript
// main.ts
import { LettersOnlyValidator, ZipCodeValidator } from './validator';
import DefaultValidator from './validator';

let lettersValidator = new LettersOnlyValidator();
let zipValidator = new ZipCodeValidator();
let defaultValidator = new DefaultValidator();
```

### 主要区别

| 特性 | 命名空间 | 模块 |
|------|----------|------|
| **语法** | `namespace` 关键字 | `import/export` 语法 |
| **作用域** | 全局作用域，通过命名空间访问 | 模块作用域，需要显式导入 |
| **标准兼容性** | TypeScript 特有 | 符合 ES6 标准 |
| **依赖管理** | 需要通过 `<reference>` 标签或编译顺序 | 显式的导入导出声明 |
| **打包支持** | 较难进行代码分割 | 天然支持按需加载和代码分割 |
| **现代开发** | 逐渐被模块替代 | 现代前端开发主流方式 |

### 使用建议

1. **优先使用模块**：现代项目应该优先使用模块系统，因为它符合标准且有更好的工具支持。

2. **命名空间的适用场景**：
   - 为不支持模块的旧库提供类型定义
   - 全局库的定义文件
   - 需要扩展全局对象的情况

3. **混合使用示例**：

```typescript
// 在模块中使用命名空间来组织相关类型
namespace Geometry {
    export interface Point {
        x: number;
        y: number;
    }
    
    export class Circle {
        constructor(public center: Point, public radius: number) {}
    }
}

// 在模块系统中导出命名空间
export { Geometry };
```

总的来说，模块是现代 TypeScript 开发的推荐方式，而命名空间主要用于特定场景或向后兼容。