---
title: 'Vue2'
icon: house
---

<!-- ## 数字叠加器：
<CountUp :endVal="2024"/>
<<< @/docs/.vuepress/components/CountUp.vue


## 图片放大
<img class="zoom" :src="$withBase('/favicon.ico')" alt="favicon">

![favicon](/favicon.ico)


<Vssue title="评论区"/> -->



## vue2的生命周期

vue2总共有八个生命周期：   
### beforeCreate：
在实例初始化之后，但在数据观测和事件配置之前被调用。此时，data和methods等选项尚未初始化，并且无法访问this。      
created：实例已经完成数据观测和事件配置，但挂载阶段还未开始。在这个阶段，可以访问data和methods，并且可以进行一些异步操作。    
beforeMount：在挂载开始之前被调用。此时，模板编译已经完成，但尚未将模板渲染到DOM中。   
mounted：   
beforeUpdate：   
updated：   
beforeDestroy：   
destroyed：   
   
## 虚拟DOM
## diff算法
## vue的是如何编译template模板的
## update和watch的区别
## nextTick的原理和使用原理
## vue的组件缓存keep-alive
## vue初始化页面闪动的问题如何解决
## Vue.use和Vue.prototype的区别
## vue中data对象和方法的区别
## watch和computed的区别
## v-if和v-for优先级
## v-for中key的作用
## mixin的理解
## vue常见的性能优化
## SPA单页应用优缺点
## vue2响应式原理
核心原理：通过definedProperty对对象已有属性值的读取和修改进行劫持（监视和拦截）
###### 15.Vue中，created和mounted两个钩子之间调用时间差值受什么影响?
###### 16.vue中，推荐在哪个生命周期发起请求?

