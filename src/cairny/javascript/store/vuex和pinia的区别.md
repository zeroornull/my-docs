---
title: vuex和pinia的区别
---

Vue 状态管理工具 **Vuex** 和 **Pinia** 都是为了解决 Vue 应用中组件之间的**状态共享**问题，但它们在设计理念、使用方式和性能上都有明显区别。下面我给你总结一下：

---

## 1. 生态地位

* **Vuex**：Vue 官方早期推荐的状态管理库（适用于 Vue2，也兼容 Vue3）。
* **Pinia**：Vue3 官方团队推出的新一代状态管理库，已经取代 Vuex，成为官方推荐。

---

## 2. API 风格

* **Vuex**

    * 需要严格遵循 **state、getters、mutations、actions** 四个模块。
    * **mutations** 是同步修改 state 的唯一入口。
    * 写法偏模板化，代码比较冗长。

* **Pinia**

    * 不再区分 `mutations` 和 `actions`，统一用 **actions** 修改 state。
    * 使用更接近 **组合式 API** 的写法，简单直观。
    * TypeScript 支持更好。

---

## 3. 使用方式

* **Vuex 示例**

  ```js
  // store.js
  import { createStore } from 'vuex'
  export default createStore({
    state: { count: 0 },
    mutations: {
      increment(state) {
        state.count++
      }
    },
    actions: {
      asyncIncrement({ commit }) {
        setTimeout(() => commit('increment'), 1000)
      }
    },
    getters: {
      doubleCount: (state) => state.count * 2
    }
  })
  ```

* **Pinia 示例**

  ```js
  // store/counter.js
  import { defineStore } from 'pinia'

  export const useCounterStore = defineStore('counter', {
    state: () => ({ count: 0 }),
    getters: {
      doubleCount: (state) => state.count * 2
    },
    actions: {
      increment() {
        this.count++
      },
      asyncIncrement() {
        setTimeout(() => this.increment(), 1000)
      }
    }
  })
  ```

---

## 4. 类型支持

* **Vuex**：TypeScript 需要额外写泛型和辅助函数，比较繁琐。
* **Pinia**：天然支持 TS，类型推导更优雅。

---

## 5. 性能和设计

* **Vuex**：基于 Vue 的响应式系统（Vue2 是 `Object.defineProperty`，Vue3 是 Proxy）。模块化和严格模式会带来一些开销。
* **Pinia**：完全基于 Vue3 的 **Composition API** 和 Proxy，性能更好。支持按需引入和 tree-shaking。

---

## 6. 学习曲线

* **Vuex**：规则多，结构复杂，学习成本高。
* **Pinia**：更贴近 Vue3 的写法，简单易学，代码量少。

---

✅ **总结：**

* Vue2 项目 → 继续用 **Vuex**。
* Vue3 项目 → 推荐用 **Pinia**（官方推荐，简单高效）。

---

要不要我给你整理一个 **对比表格**，让 Vuex 和 Pinia 的区别一目了然？
