---
# dir:
#     text: Java全栈面试
#     icon: laptop-code
#     collapsible: true
#     expanded: true
#     link: true
#     index: true
title: Docker
index: true
headerDepth: 3
order: 2
# icon: laptop-code
# sidebar: true
# toc: true
# editLink: false
---

### 15.2 Docker

#### 什么是虚拟化技术？

在计算机技术中，虚拟化（Virtualization）是一种资源管理技术。它是将计算机的各种实体资源，如：服务器、网络、内存及存储等，予以抽象、转换后呈现出来，打破实体结构间的不可切割的障碍，使用户可以用更好的方式来利用这些资源。

虚拟化的目的是为了在同一个主机上运行多个系统或应用，从而提高系统资源的利用率，并带来降低成本、方便管理和容错容灾等好处。

- **硬件虚拟化**

硬件虚拟化就是硬件物理平台本身提供了对特殊指令的截获和重定向的支持。支持虚拟化的硬件，也是一些基于硬件实现软件虚拟化技术的关键。在基于硬件实现软件虚拟化的技术中，在硬件是实现虚拟化的基础，硬件(主要是CPU)会为虚拟化软件提供支持，从而实现硬件资源的虚拟化。

- **软件虚拟化**

软件虚拟化就是利用软件技术，在现有的物理平台上实现对物理平台访问的截获和模拟。在软件虚拟化技术中，有些技术不需要硬件支持，如：QEMU；而有些软件虚拟化技术，则依赖硬件支持，如：VMware、KVM。

#### 什么是Docker?

Docker是一个开源的应用容器引擎，它让开发者可以打包他们的应用以及依赖包到一个可移植的容器中，然后发布到安装了任何 Linux 发行版本的机器上。Docker基于LXC来实现类似VM的功能，可以在更有限的硬件资源上提供给用户更多的计算资源。与同VM等虚拟化的方式不同，LXC不属于全虚拟化、部分虚拟化或半虚拟化中的任何一个分类，而是一个操作系统级虚拟化。

Docker是直接运行在宿主操作系统之上的一个容器，使用沙箱机制完全虚拟出一个完整的操作，容器之间不会有任何接口，从而让容器与宿主机之间、容器与容器之间隔离的更加彻底。每个容器会有自己的权限管理，独立的网络与存储栈，及自己的资源管理能，使同一台宿主机上可以友好的共存多个容器。

Docker借助Linux的内核特性，如：控制组（Control Group）、命名空间（Namespace）等，并直接调用操作系统的系统调用接口。从而降低每个容器的系统开销，并实现降低容器复杂度、启动快、资源占用小等特征。

#### Docker和虚拟机的区别？

虚拟机Virtual Machine与容器化技术（代表Docker）都是虚拟化技术，两者的区别在于虚拟化的程度不同。

- **举个例子**

1. **服务器**：比作一个大型的仓管基地，包含场地与零散的货物——相当于各种服务器资源。
2. **虚拟机技术**：比作仓库，拥有独立的空间堆放各种货物或集装箱，仓库之间完全独立——仓库相当于各种系统，独立的应用系统和操作系统。
3. **Docker**：比作集装箱，操作各种货物的打包——将各种应用程序和他们所依赖的运行环境打包成标准的容器，容器之间隔离。

- **基于一个图解释**

![img](https://b2files.173114.xyz/blogimg/2025/03/87cd800c8a6485fbe41084d47fbeba79.jpg)

1. 虚拟机管理系统（Hypervisor）。利用Hypervisor，可以在主操作系统之上运行多个不同的从操作系统。类型1的Hypervisor有支持MacOS的HyperKit，支持Windows的Hyper-V以及支持Linux的KVM。类型2的Hypervisor有VirtualBox和VMWare。
2. Docker守护进程（Docker Daemon）。Docker守护进程取代了Hypervisor，它是运行在操作系统之上的后台进程，负责管理Docker容器。
3. vm多了一层guest OS，虚拟机的Hypervisor会对硬件资源也进行虚拟化，而容器Docker会直接使用宿主机的硬件资源

- **基于虚拟化角度**

1. **隔离性** 由于vm对操作系统也进行了虚拟化，隔离的更加彻底。而Docker共享宿主机的操作系统，隔离性较差。
2. **运行效率** 由于vm的隔离操作，导致生成虚拟机的速率大大低于容器Docker生成的速度，因为Docker直接利用宿主机的系统内核。因为虚拟机增加了一层虚拟硬件层，运行在虚拟机上的应用程序在进行数值计算时是运行在Hypervisor虚拟的CPU上的；另外一方面是由于计算程序本身的特性导致的差异。虚拟机虚拟的cpu架构不同于实际cpu架构，数值计算程序一般针对特定的cpu架构有一定的优化措施，虚拟化使这些措施作废，甚至起到反效果。
3. **资源利用率** 在资源利用率上虚拟机由于隔离更彻底，因此利用率也会相对较低。

#### Docker的架构？

Docker 使用客户端-服务器 (C/S) 架构模式，使用远程API来管理和创建Docker容器。

- **Docker 客户端(Client)** : Docker 客户端通过命令行或者其他工具使用 Docker SDK (https://docs.docker.com/develop/sdk/) 与 Docker 的守护进程通信。
- **Docker 主机(Host)** ：一个物理或者虚拟的机器用于执行 Docker 守护进程和容器。

Docker 包括三个基本概念:

- **镜像（Image）**：Docker 镜像（Image），就相当于是一个 root 文件系统。比如官方镜像 ubuntu:16.04 就包含了完整的一套 Ubuntu16.04 最小系统的 root 文件系统。
- **容器（Container）**：镜像（Image）和容器（Container）的关系，就像是面向对象程序设计中的类和实例一样，镜像是静态的定义，容器是镜像运行时的实体。容器可以被创建、启动、停止、删除、暂停等。
- **仓库（Repository）**：仓库可看着一个代码控制中心，用来保存镜像。

![img](https://b2files.173114.xyz/blogimg/2025/03/6e0c333ef30b9a19cdb6ef7dad83f4d3.png)

#### Docker镜像相关操作有哪些？

```bash
# 查找镜像
docker search mysql

# 拉取镜像
docker pull mysql

# 删除镜像
docker rmi hello-world

# 更新镜像
docker commit -m="update test" -a="pdai" 0a1556ca3c27  pdai/ubuntu:v1.0.1

# 生成镜像
docker build -t pdai/ubuntu:v2.0.1 .

# 镜像标签
docker tag a733d5a264b5 pdai/ubuntu:v3.0.1

# 镜像导出
docker save > pdai-ubuntu-v2.0.2.tar 57544a04cd1a

# 镜像导入
docker load < pdai-ubuntu-v2.0.2.tar
```

#### Docker容器相关操作有哪些？

```bash
# 容器查看
docker ps -a

# 容器启动
docker run -it pdai/ubuntu:v2.0.1 /bin/bash

# 容器停止
docker stop f5332ebce695

# 容器再启动
docker start f5332ebce695

# 容器重启
docker restart f5332ebce695

# 容器导出
docker export f5332ebce695 > ubuntu-pdai-v2.tar

# 容器导入
docker import ubuntu-pdai-v2.tar pdai/ubuntu:v2.0.2

# 容器强制停止并删除
docker rm -f f5332ebce695

# 容器清理
docker container prune

# 容器别名操作
docker run -itd --name pdai-ubuntu-202 pdai/ubuntu:v2.0.2 /bin/bash
```

#### 如何查看Docker容器的日志？

```bash
#例：实时查看docker容器名为user-uat的最后10行日志
docker logs -f -t --tail 10 user-uat

#例：查看指定时间后的日志，只显示最后100行：
docker logs -f -t --since="2018-02-08" --tail=100 user-uat

#例：查看最近30分钟的日志:
docker logs --since 30m user-uat

#例：查看某时间之后的日志：
docker logs -t --since="2018-02-08T13:23:37" user-uat

#例：查看某时间段日志：
docker logs -t --since="2018-02-08T13:23:37" --until "2018-02-09T12:23:37" user-uat

#例：将错误日志写入文件：
docker logs -f -t --since="2018-02-18" user-uat | grep error >> logs_error.txt
```

#### 如何启动Docker容器？参数含义？

```bash
[root@pdai docker-test]# docker run -itd pdai/ubuntu:v2.0.1 /bin/bash
```

- `-it` 可以连写的，表示 `-i -t`
- `-t`: 在新容器内指定一个伪终端或终端。
- `-i`: 允许你对容器内的标准输入 (STDIN) 进行交互
- `-d`: 后台模式

#### 如何进入Docker后台模式？有什么区别？

- 第一种：`docker attach`

```bash
[root@pdai ~]# docker ps
CONTAINER ID        IMAGE                COMMAND             CREATED             STATUS              PORTS               NAMES
f5332ebce695        pdai/ubuntu:v2.0.1   "/bin/bash"         38 minutes ago      Up 2 seconds        22/tcp, 80/tcp      jolly_kepler
[root@pdai ~]# docker attach f5332ebce695
root@f5332ebce695:/# echo 'pdai'
pdai
root@f5332ebce695:/# exit
exit
[root@pdai ~]# docker ps
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
```

看到没，使用`docker attach`进入后，exit便容器也停止了。

- 第二种：`docker exec`

```bash
[root@pdai ~]# docker exec -it f5332ebce695 /bin/bash
Error response from daemon: Container f5332ebce69520fba353f035ccddd4bd42055fbd1e595f916ba7233e26476464 is not running
[root@pdai ~]# docker restart f5332ebce695
f5332ebce695
[root@pdai ~]# docker exec -it f5332ebce695 /bin/bash
root@f5332ebce695:/# exit
exit
[root@pdai ~]# docker ps
CONTAINER ID        IMAGE                COMMAND             CREATED             STATUS              PORTS               NAMES
f5332ebce695        pdai/ubuntu:v2.0.1   "/bin/bash"         42 minutes ago      Up 8 seconds        22/tcp, 80/tcp      jolly_kepler
```

注意：

- 我特意在容器停止状态下执行了`docker exec`，是让你看到`docker exec`是在容器启动状态下用的，且注意下错误信息；
- 推荐大家使用 `docker exec` 命令，因为此退出容器终端，不会导致容器的停止。