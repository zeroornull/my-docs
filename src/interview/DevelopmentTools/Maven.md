---
# dir:
#     text: Java全栈面试
#     icon: laptop-code
#     collapsible: true
#     expanded: true
#     link: true
#     index: true
title: Maven
index: true
headerDepth: 3
# icon: laptop-code
# sidebar: true
# toc: true
# editLink: false

---

### 11.2 Maven

#### Maven中包的依赖原则？如何解决冲突？

- **依赖原则**？

1. 依赖路径最短优先原则

```html
A -> B -> C -> X(1.0)
A -> D -> X(2.0)
```

由于 X(2.0) 路径最短，所以使用 X(2.0)。

1. 声明顺序优先原则

```html
A -> B -> X(1.0)
A -> C -> X(2.0)
```

在 POM 中最先声明的优先，上面的两个依赖如果先声明 B，那么最后使用 X(1.0)。

1. 覆写优先原则

子 POM 内声明的依赖优先于父 POM 中声明的依赖。

- **如何解决冲突**？

1. 找到 Maven 加载的 Jar 包版本，使用 `mvn dependency:tree` 查看依赖树，根据依赖原则来调整依赖在 POM 文件的声明顺序。
2. 发现了冲突的包之后，剩下的就是选择一个合适版本的包留下，如果是传递依赖的包正确，那么把显示依赖的包exclude掉。如果是某一个传递依赖的包有问题，那么我们需要手动把这个传递依赖execlude掉

#### Maven 项目生命周期与构建原理？

Maven从项目的三个不同的角度，定义了单套生命周期，三套生命周期是相互独立的，它们之间不会相互影响。

- 默认构建生命周期(Default Lifeclyle): 该生命周期表示这项目的构建过程，定义了一个项目的构建要经过的不同的阶段。
- 清理生命周期(Clean Lifecycle): 该生命周期负责清理项目中的多余信息，保持项目资源和代码的整洁性。一般拿来清空directory(即一般的target)目录下的文件。
- 站点管理生命周期(Site Lifecycle) :向我们创建一个项目时，我们有时候需要提供一个站点，来介绍这个项目的信息，如项目介绍，项目进度状态、项目组成成员，版本控制信息，项目javadoc索引信息等等。站点管理生命周期定义了站点管理过程的各个阶段。

![img](https://b2files.173114.xyz/blogimg/2025/03/384337be70892f4dfc4efaa3e67bab7a.jpg)