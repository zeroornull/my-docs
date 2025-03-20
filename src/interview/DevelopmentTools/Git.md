---
# dir:
#     text: Java全栈面试
#     icon: laptop-code
#     collapsible: true
#     expanded: true
#     link: true
#     index: true
title: Git
index: true
headerDepth: 3
# icon: laptop-code
# sidebar: true
# toc: true
# editLink: false

---

## 11 开发工具

> 开发工具问题汇总。

### 11.1 Git

#### Git中5个区，和具体操作？

- 代码提交和同步代码

![img](https://b2files.173114.xyz/blogimg/2025/03/6fc2a8d8937d4c52dc93cd9012839f11.png)

- 代码撤销和撤销同步

![img](https://b2files.173114.xyz/blogimg/2025/03/403e8cda70fa212601904a127249e72e.png)

#### 平时是怎么提交代码的？

- 第零步: 工作区与仓库保持一致
- 第一步: 文件增删改，变为已修改状态
- 第二步: git add ，变为已暂存状态

```bash
$ git status
$ git add --all # 当前项目下的所有更改
$ git add .  # 当前目录下的所有更改
$ git add xx/xx.py xx/xx2.py  # 添加某几个文件
```

- 第三步: git commit，变为已提交状态

```bash
$ git commit -m "<这里写commit的描述>"
```

- 第四步: git push，变为已推送状态

```bash
$ git push -u origin master # 第一次需要关联上
$ git push # 之后再推送就不用指明应该推送的远程分支了
$ git branch # 可以查看本地仓库的分支
$ git branch -a # 可以查看本地仓库和本地远程仓库(远程仓库的本地镜像)的所有分支
```

在某个分支下，我最常用的操作如下

```bash
$ git status
$ git add -a
$ git status
$ git commit -m 'xxx'
$ git pull --rebase
$ git push origin xxbranch
```
