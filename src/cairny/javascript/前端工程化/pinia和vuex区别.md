---
title: pinia和vuex区别
---

## Pinia 与 Vuex 的主要区别

### 1. 基本概念对比

- **Vuex**：Vue.js 的官方状态管理库，采用集中式存储管理应用的所有组件的状态
- **Pinia**：Vue.js 的轻量级状态管理库，是 Vuex 的继任者，提供更简洁的 API

### 2. 语法差异

#### Vuex 示例
```javascript
// store/index.js
import { createStore } from 'vuex'

const store = createStore({
  state: {
    count: 0
  },
  mutations: {
    increment(state) {
      state.count++
    }
  },
  actions: {
    incrementAsync({ commit }) {
      setTimeout(() => {
        commit('increment')
      }, 1000)
    }
  },
  getters: {
    doubleCount: (state) => state.count * 2
  }
})
```

#### Pinia 示例
```javascript
// stores/counter.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0
  }),
  getters: {
    doubleCount: (state) => state.count * 2
  },
  actions: {
    increment() {
      this.count++
    },
    incrementAsync() {
      setTimeout(() => {
        this.increment()
      }, 1000)
    }
  }
})
```

### 3. 主要区别点

#### 结构组织
- **Vuex**：单一状态树，所有状态集中在一个 `store` 对象中
- **Pinia**：支持多个 `store`，每个 store 独立定义，更模块化

#### Mutation 处理
- **Vuex**：需要通过 `mutations` 来修改状态，严格模式下直接修改会报错
- **Pinia**：直接通过 `actions` 修改状态，无需 `mutations`

#### TypeScript 支持
- **Vuex 4**：TypeScript 支持有限，需要额外的类型定义
- **Pinia**：原生支持 TypeScript，提供完整的类型推断

#### 开发者体验
- **Vuex**：API 相对复杂，需要理解 state、getters、mutations、actions 的概念
- **Pinia**：API 更简洁直观，学习成本更低

#### 性能优化
- **Vuex**：打包后体积较大
- **Pinia**：体积更小，性能更好，支持 tree-shaking

#### Devtools 支持
- **Vuex**：内置完整的 Devtools 集成
- **Pinia**：同样提供 Devtools 支持，并且时间旅行调试体验更好

### 4. 迁移考虑

- **Vuex**：适合大型项目，生态系统成熟稳定
- **Pinia**：推荐新项目使用，Vue 3 官方推荐的状态管理方案

### 5. 使用建议

- 如果是新项目，建议直接使用 **Pinia**
- 如果是现有 Vuex 项目，可以根据团队情况和项目复杂度决定是否迁移
- **Pinia** 是 Vue 团队推荐的未来方向，具有更好的开发体验和性能表现