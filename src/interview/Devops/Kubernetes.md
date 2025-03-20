---
# dir:
#     text: Java全栈面试
#     icon: laptop-code
#     collapsible: true
#     expanded: true
#     link: true
#     index: true
title: Kubernetes
index: true
headerDepth: 3
order: 3
# icon: laptop-code
# sidebar: true
# toc: true
# editLink: false
---

### 14.2 Kubernetes

#### 什么是Kubernetes? Kubernetes与Docker有什么关系？

- **是什么**？

Kubernetes是一个开源容器管理工具，负责容器部署，容器扩缩容以及负载平衡。作为Google的创意之作，它提供了出色的社区，并与所有云提供商合作。因此，我们可以说Kubernetes不是一个容器化平台，而是一个多容器管理解决方案。

众所周知，Docker提供容器的生命周期管理，Docker镜像构建运行时容器。但是，由于这些单独的容器必须通信，因此使用Kubernetes。因此，我们说Docker构建容器，这些容器通过Kubernetes相互通信。因此，可以使用Kubernetes手动关联和编排在多个主机上运行的容器。

- **有哪些特性**？

1. **自我修复**: 在节点故障时可以删除失效容器，重新创建新的容器，替换和重新部署，保证预期的副本数量，kill掉健康检查失败的容器，并且在容器未准备好之前不会处理客户端情况，确保线上服务不会中断
2. **弹性伸缩**: 使用命令、UI或者k8s基于cpu使用情况自动快速扩容和缩容应用程序实例，保证应用业务高峰并发时的高可用性，业务低峰时回收资源，以最小成本运行服务
3. **自动部署和回滚**: k8s采用滚动更新策略更新应用，一次更新一个pod，而不是同时删除所有pod，如果更新过程中出现问题，将回滚恢复，确保升级不影响业务
4. **服务发现和负载均衡**: k8s为多个容器提供一个统一访问入口(内部IP地址和一个dns名称)并且负载均衡关联的所有容器，使得用户无需考虑容器IP问题
5. **机密和配置管理**: 管理机密数据和应用程序配置，而不需要把敏感数据暴露在径向力，提高敏感数据安全性，并可以将一些常用的配置存储在k8s中，方便应用程序调用
6. **存储编排**: 挂载外部存储系统，无论时来自本地存储、公有云(aws)、还是网络存储（nfs、GFS、ceph），都作为集群资源的一部分使用，极大提高存储使用灵活性
7. **批处理**: 提供一次性任务，定时任务：满足批量数据处理和分析的场景

#### Kubernetes的整体架构？

![img](https://b2files.173114.xyz/blogimg/2025/03/f1b33c06dc232070dc4ace356412d663.png)

Kubernetes主要由以下几个核心组件组成：

1. **etcd**：提供数据库服务保存了整个集群的状态
2. **kube-apiserver**：提供了资源操作的唯一入口，并提供认证、授权、访问控制、API注册和发现等机制
3. **kube-controller-manager**：负责维护集群的状态，比如故障检测、自动扩展、滚动更新等
4. **cloud-controller-manager**：是与底层云计算服务商交互的控制器
5. **kub-scheduler**：负责资源的调度，按照预定的调度策略将Pod调度到相应的机器上
6. **kubelet**：负责维护容器的生命周期，同时也负责Volume（CVI）和网络（CNI）的管理；
7. **kube-proxy**：负责为Service提供内部的服务发现和负载均衡，并维护网络规则
8. **container-runtime**：是负责管理运行容器的软件，比如docker

除了核心组件，还有一些推荐的Add-ons：

1. kube-dns负责为整个集群提供DNS服务
2. Ingress Controller为服务提供外网入口
3. Heapster提供资源监控
4. Dashboard提供GUI
5. Federation提供跨可用区的集群
6. Fluentd-elasticsearch提供集群日志采集、存储与查询

#### Kubernetes中有哪些核心概念？

- **Cluster、Master、Node**

1. Cluster
   1. Cluster（集群） 是计算、存储和网络资源的集合，Kubernetes 利用这些资源运行各种基于容器的应用。最简单的 Cluster 可以只有一台主机（它既是 Mater 也是 Node）
2. Master
   1. Master 是 Cluster 的大脑，它的主要职责是调度，即决定将应用放在哪里运行。
   2. Master 运行 Linux 操作系统，可以是物理机或者虚拟机。
   3. 为了实现高可用，可以运行多个 Master。
3. Node
   1. Node 的职责是运行容器应用。
   2. Node 由 Master 管理，Node 负责监控并汇报容器的状态，并根据 Master 的要求管理容器的生命周期。
   3. Node 运行在 Linux 操作系统，可以是物理机或者是虚拟机。

- **Pod**

1. 基本概念
   1. Pod 是 Kubernetes 的最小工作单元。
   2. 每个 Pod 包含一个或多个容器。Pod 中的容器会作为一个整体被 Master 调度到一个 Node 上运行。
2. 引入 Pod 的目的
   1. `可管理性`: 有些容器天生就是需要紧密联系，一起工作。Pod 提供了比容器更高层次的抽象，将它们封装到一个部署单元中。Kubernetes 以 Pod 为最小单位进行调度、扩展、共享资源、管理生命周期。
   2. `通信和资源共享`: Pod 中的所有容器使用同一个网络 namespace，即相同的 IP 地址和 Port 空间。它们可以直接用 localhost 通信。同样的，这些容器可以共享存储，当 Kubernetes 挂载 volume 到 Pod，本质上是将 volume 挂载到 Pod 中的每一个容器。
3. Pod 的使用方式
   1. `运行单一容器`: one-container-per-Pod 是 Kubernetes 最常见的模型，这种情况下，只是将单个容器简单封装成 Pod。即便是只有一个容器，Kubernetes 管理的也是 Pod 而不是直接管理容器。
   2. `运行多个容器`: 对于那些联系非常紧密，而且需要直接共享资源的容器，应该放在一个 Pod 中。比如下面这个 Pod 包含两个容器：一个 File Puller，一个是 Web Server。File Puller 会定期从外部的 Content Manager 中拉取最新的文件，将其存放在共享的 volume 中。Web Server 从 volume 读取文件，响应 Consumer 的请求。这两个容器是紧密协作的，它们一起为 Consumer 提供最新的数据；同时它们也通过 volume 共享数据。所以放到一个 Pod 是合适的。

- **Controller**

1. **基本概念**
   1. Kubernetes 通常不会直接创建 Pod，而是通过 Controller 来管理 Pod 的。Controller 中定义了 Pod 的部署特性，比如有几个副本，在什么样的 Node 上运行等。为了满足不同的业务场景，Kubernetes 提供了多种 Controller，包括 Deployment、ReplicaSet、DaemonSet、StatefuleSet、Job 等。
2. **各个 Controller**
   1. `Deployment`： Deployment 是最常用的 Controller，比如我们可以通过创建 Deployment 来部署应用的。Deployment 可以管理 Pod 的多个副本，并确保 Pod 按照期望的状态运行。
   2. `ReplicaSet`： ReplicaSet 实现了 Pod 的多副本管理。使用 Deployment 时会自动创建 ReplicaSet，也就是说 Deployment 是通过 ReplicaSet 来管理 Pod 的多个副本，我们通常不需要直接使用 ReplicaSet。
   3. `DaemonSet`： DaemonSet 用于每个 Node 最多只运行一个 Pod 副本的场景。正如其名称所揭示的，DaemonSet 通常用于运行 daemon。
   4. `StatefuleSet`： StatefuleSet 能够保证 Pod 的每个副本在整个生命周期中名称是不变的。而其他 Controller 不提供这个功能，当某个 Pod 发生故障需要删除并重新启动时，Pod 的名称会发生变化。同时 StatefuleSet 会保证副本按照固定的顺序启动、更新或者删除。
   5. `Job`： Job 用于运行结束就删除的应用。而其他 Controller 中的 Pod 通常是长期持续运行。

- **Service、Namespace**

1. **Service**
   1. Deployment 可以部署多个副本，每个 Pod 都有自己的 IP。而 Pod 很可能会被频繁地销毁和重启，它们的 IP 会发生变化，用 IP 来访问 Deployment 副本不太现实。
   2. Service 定义了外界访问一组特定 Pod 的方式。Service 有自己的 IP 和端口，Service 为 Pod 提供了负载均衡。
2. **Namespace**
   1. Namespace 可以将一个物理的 Cluster 逻辑上划分成多个虚拟 Cluster，每个 Cluster 就是一个 Namespace。不同 Namespace 里的资源是完全隔离的。
   2. Kubernetes 默认创建了两个 Namespace：
      1. default：创建资源时如果不指定，将被放到这个 Namespace 中。
      2. kube-system：Kubernetes 自己创建的系统资源将放到这个 Namespace 中。

#### 什么是Heapster？

Heapster是由每个节点上运行的Kubelet提供的集群范围的数据聚合器。此容器管理工具在Kubernetes集群上本机支持，并作为pod运行，就像集群中的任何其他pod一样。因此，它基本上发现集群中的所有节点，并通过机上Kubernetes代理查询集群中Kubernetes节点的使用信息。

#### 什么是Minikube？

Minikube是一种工具，可以在本地轻松运行Kubernetes。这将在虚拟机中运行单节点Kubernetes群集。

#### 什么是Kubectl？

Kubectl是一个平台，您可以使用该平台将命令传递给集群。因此，它基本上为CLI提供了针对Kubernetes集群运行命令的方法，以及创建和管理Kubernetes组件的各种方法。

#### kube-apiserver和kube-scheduler的作用是什么？

kube -apiserver遵循横向扩展架构，是主节点控制面板的前端。这将公开Kubernetes主节点组件的所有API，并负责在Kubernetes节点和Kubernetes主组件之间建立通信。

kube-scheduler负责工作节点上工作负载的分配和管理。因此，它根据资源需求选择最合适的节点来运行未调度的pod，并跟踪资源利用率。它确保不在已满的节点上调度工作负载。

#### 请你说一下kubenetes针对pod资源对象的健康监测机制？

K8s中对于pod资源对象的健康状态检测，提供了三类probe（探针）来执行对pod的健康监测：

- livenessProbe探针

可以根据用户自定义规则来判定pod是否健康，如果livenessProbe探针探测到容器不健康，则kubelet会根据其重启策略来决定是否重启，如果一个容器不包含livenessProbe探针，则kubelet会认为容器的livenessProbe探针的返回值永远成功。

- ReadinessProbe探针 同样是可以根据用户自定义规则来判断pod是否健康，如果探测失败，控制器会将此pod从对应service的endpoint列表中移除，从此不再将任何请求调度到此Pod上，直到下次探测成功。
- startupProbe探针 启动检查机制，应用一些启动缓慢的业务，避免业务长时间启动而被上面两类探针kill掉，这个问题也可以换另一种方式解决，就是定义上面两类探针机制时，初始化时间定义的长一些即可。

#### K8s中镜像的下载策略是什么？

可通过命令`kubectl explain pod.spec.containers`来查看imagePullPolicy这行的解释。

K8s的镜像下载策略有三种：Always、Never、IFNotPresent；

- Always：镜像标签为latest时，总是从指定的仓库中获取镜像；
- Never：禁止从仓库中下载镜像，也就是说只能使用本地镜像；
- IfNotPresent：仅当本地没有对应镜像时，才从目标仓库中下载。

默认的镜像下载策略是：当镜像标签是latest时，默认策略是Always；当镜像标签是自定义时（也就是标签不是latest），那么默认策略是IfNotPresent。

#### image的状态有哪些？

- Running：Pod所需的容器已经被成功调度到某个节点，且已经成功运行，
- Pending：APIserver创建了pod资源对象，并且已经存入etcd中，但它尚未被调度完成或者仍然处于仓库中下载镜像的过程
- Unknown：APIserver无法正常获取到pod对象的状态，通常是其无法与所在工作节点的kubelet通信所致。

#### 如何控制滚动更新过程？

可以通过下面的命令查看到更新时可以控制的参数：

```bash
[root@master yaml]# kubectl explain deploy.spec.strategy.rollingUpdate
```

- **maxSurge** ：此参数控制滚动更新过程，副本总数超过预期pod数量的上限。可以是百分比，也可以是具体的值。默认为1。 （上述参数的作用就是在更新过程中，值若为3，那么不管三七二一，先运行三个pod，用于替换旧的pod，以此类推）
- **maxUnavailable**：此参数控制滚动更新过程中，不可用的Pod的数量。 （这个值和上面的值没有任何关系，举个例子：我有十个pod，但是在更新的过程中，我允许这十个pod中最多有三个不可用，那么就将这个参数的值设置为3，在更新的过程中，只要不可用的pod数量小于或等于3，那么更新过程就不会停止）。

#### DaemonSet资源对象的特性？

DaemonSet这种资源对象会在每个k8s集群中的节点上运行，并且每个节点只能运行一个pod，这是它和deployment资源对象的最大也是唯一的区别。所以，在其yaml文件中，不支持定义replicas，除此之外，与Deployment、RS等资源对象的写法相同。

它的一般使用场景如下：

1. 在去做每个节点的日志收集工作；
2. 监控每个节点的的运行状态；

#### 说说你对Job这种资源对象的了解？

Job与其他服务类容器不同，Job是一种工作类容器（一般用于做一次性任务）。使用常见不多，可以忽略这个问题。

```yaml
#提高Job执行效率的方法：
spec:
  parallelism: 2           #一次运行2个
  completions: 8           #最多运行8个
  template:
metadata:
```

#### pod的重启策略是什么？

可以通过命令`kubectl explain pod.spec`查看pod的重启策略。（restartPolicy字段）

- Always：但凡pod对象终止就重启，此为默认策略。
- OnFailure：仅在pod对象出现错误时才重启

#### 描述一下pod的生命周期有哪些状态？

- Pending：表示pod已经被同意创建，正在等待kube-scheduler选择合适的节点创建，一般是在准备镜像；
- Running：表示pod中所有的容器已经被创建，并且至少有一个容器正在运行或者是正在启动或者是正在重启；
- Succeeded：表示所有容器已经成功终止，并且不会再启动；
- Failed：表示pod中所有容器都是非0（不正常）状态退出；
- Unknown：表示无法读取Pod状态，通常是kube-controller-manager无法与Pod通信。

#### 创建一个pod的流程是什么？

1） 客户端提交Pod的配置信息（可以是yaml文件定义好的信息）到kube-apiserver； 2） Apiserver收到指令后，通知给controller-manager创建一个资源对象； 3） Controller-manager通过api-server将pod的配置信息存储到ETCD数据中心中； 4） Kube-scheduler检测到pod信息会开始调度预选，会先过滤掉不符合Pod资源配置要求的节点，然后开始调度调优，主要是挑选出更适合运行pod的节点，然后将pod的资源配置单发送到node节点上的kubelet组件上。 5） Kubelet根据scheduler发来的资源配置单运行pod，运行成功后，将pod的运行信息返回给scheduler，scheduler将返回的pod运行状况的信息存储到etcd数据中心。

#### 删除一个Pod会发生什么事情？

Kube-apiserver会接受到用户的删除指令，默认有30秒时间等待优雅退出，超过30秒会被标记为死亡状态，此时Pod的状态Terminating，kubelet看到pod标记为Terminating就开始了关闭Pod的工作；

关闭流程如下：

1. pod从service的endpoint列表中被移除；
2. 如果该pod定义了一个停止前的钩子，其会在pod内部被调用，停止钩子一般定义了如何优雅的结束进程；
3. 进程被发送TERM信号（kill -14）
4. 当超过优雅退出的时间后，Pod中的所有进程都会被发送SIGKILL信号（kill -9）。

#### K8s的Service是什么？

Pod每次重启或者重新部署，其IP地址都会产生变化，这使得pod间通信和pod与外部通信变得困难，这时候，就需要Service为pod提供一个固定的入口。

Service的Endpoint列表通常绑定了一组相同配置的pod，通过负载均衡的方式把外界请求分配到多个pod上

#### k8s是怎么进行服务注册的？

Pod启动后会加载当前环境所有Service信息，以便不同Pod根据Service名进行通信。

#### k8s集群外流量怎么访问Pod？

可以通过Service的NodePort方式访问，会在所有节点监听同一个端口，比如：30000，访问节点的流量会被重定向到对应的Service上面。

#### k8s数据持久化的方式有哪些？

- **EmptyDir(空目录)**：

没有指定要挂载宿主机上的某个目录，直接由Pod内保部映射到宿主机上。类似于docker中的manager volume。

主要使用场景：

1. 只需要临时将数据保存在磁盘上，比如在合并/排序算法中；
2. 作为两个容器的共享存储，使得第一个内容管理的容器可以将生成的数据存入其中，同时由同一个webserver容器对外提供这些页面。

emptyDir的特性： 同个pod里面的不同容器，共享同一个持久化目录，当pod节点删除时，volume的数据也会被删除。如果仅仅是容器被销毁，pod还在，则不会影响volume中的数据。 总结来说：emptyDir的数据持久化的生命周期和使用的pod一致。一般是作为临时存储使用。

- **Hostpath**：

将宿主机上已存在的目录或文件挂载到容器内部。类似于docker中的bind mount挂载方式。

这种数据持久化方式，运用场景不多，因为它增加了pod与节点之间的耦合。

一般对于k8s集群本身的数据持久化和docker本身的数据持久化会使用这种方式，可以自行参考apiService的yaml文件，位于：/etc/kubernetes/main…目录下。

- **PersistentVolume**（简称PV）：

基于NFS服务的PV，也可以基于GFS的PV。它的作用是统一数据持久化目录，方便管理。

在一个PV的yaml文件中，可以对其配置PV的大小，

指定PV的访问模式：

1. ReadWriteOnce：只能以读写的方式挂载到单个节点；
2. ReadOnlyMany：能以只读的方式挂载到多个节点；
3. ReadWriteMany：能以读写的方式挂载到多个节点。，

以及指定pv的回收策略(这里的回收策略指的是在PV被删除后，在这个PV下所存储的源文件是否删除)：

1. recycle：清除PV的数据，然后自动回收；
2. Retain：需要手动回收；
3. delete：删除云存储资源，云存储专用；

若需使用PV，那么还有一个重要的概念：PVC，PVC是向PV申请应用所需的容量大小，K8s集群中可能会有多个PV，PVC和PV若要关联，其定义的访问模式必须一致。定义的storageClassName也必须一致，若群集中存在相同的（名字、访问模式都一致）两个PV，那么PVC会选择向它所需容量接近的PV去申请，或者随机申请。

#### Replica Set 和 Replication Controller 之间有什么区别？

Replica Set 和 Replication Controller 几乎完全相同。它们都确保在任何给定时间运行指定数量的 Pod 副本。不同之处在于复制 Pod 使用的选择器。Replica Set 使用基于集合的选择器，而 Replication Controller 使用基于权限的选择器。

Equity-Based 选择器：这种类型的选择器允许按标签键和值进行过滤。因此，在外行术语中，基于 Equity 的选择器将仅查找与标签具有完全相同短语的 Pod。示例：假设您的标签键表示 app = nginx，那么使用此选择器，您只能查找标签应用程序等于 nginx 的那些 Pod。

Selector-Based 选择器：此类型的选择器允许根据一组值过滤键。因此，换句话说，基于 Selector 的选择器将查找已在集合中提及其标签的 Pod。示例：假设您的标签键在（nginx、NPS、Apache）中显示应用程序。然后，使用此选择器，如果您的应用程序等于任何 nginx、NPS或 Apache，则选择器将其视为真实结果。

#### kubernetes包含几个组件。各个组件的功能是什么。组件之间是如何交互的。

Kubernetes 包含以下几个主要组件：API Server、etcd、Controller Manager、Scheduler、Kubelet 和 Kube-Proxy。

1. **核心组件及功能**

(1) **API Server**

- **功能**：API Server 是 Kubernetes 的核心组件，充当系统的控制平面前端。它暴露了 Kubernetes 的 RESTful API，接收来自用户、客户端或kubectl的请求，并负责与集群内的其他组件通信。它是所有操作的入口点，例如创建 Pod、查询状态等。
- **特点**：无状态设计，所有数据都存储在 etcd 中。

(2) **etcd**

- **功能**：etcd 是一个分布式键值存储数据库，用于存储 Kubernetes 集群的所有状态数据，例如 Pod 的配置、节点信息、命名空间等。它是 Kubernetes 的“真相之源”，保证数据的高一致性和可靠性。
- **特点**：仅与 API Server 直接交互，其他组件通过 API Server 间接访问 etcd。

(3) **Controller Manager**

- **功能**：Controller Manager 负责运行各种控制器，监控集群的当前状态，并将其调整到期望状态。例如，Replication Controller 确保 Pod 的副本数符合预期，Node Controller 管理节点的生命周期。
- **特点**：它通过 API Server 获取集群状态，并根据需要执行调整操作。

(4) **Scheduler**

- **功能**：Scheduler 负责将 Pod 调度到合适的节点上。它根据资源需求（如 CPU、内存）、节点状态、亲和性规则等因素，决定 Pod 应该运行在哪个节点上。
- **特点**：只负责调度决策，不直接操作节点，具体执行由 Kubelet 完成。

(5) **Kubelet**

- **功能**：Kubelet 运行在每个工作节点上，负责管理节点上的 Pod。它通过 API Server 接收 Pod 的定义（PodSpec），确保 Pod 中的容器按预期运行，并报告节点和 Pod 的状态。
- **特点**：直接与容器运行时（如 Docker）交互。

(6) **Kube-Proxy**

- **功能**：Kube-Proxy 运行在每个节点上，负责管理网络规则，实现 Service 的负载均衡和 Pod 间的通信。它通过 IPTables 或 IPVS 配置虚拟 IP，确保请求能够路由到正确的 Pod。
- **特点**：支持集群内外的网络访问。

(7) **容器运行时（Container Runtime）** *(可选提及)*

- **功能**：容器运行时（如 Docker、containerd）负责实际拉取镜像、创建和运行容器，是 Kubelet 的执行层。
- **特点**：Kubernetes 通过 CRI（容器运行时接口）与其交互。

2. **组件之间的交互**

Kubernetes 的组件通过松耦合的方式协作，主要围绕 API Server 进行通信。以下是它们之间的交互流程：

1. **用户操作**：用户通过 kubectl 或客户端向 API Server 发送请求（如创建 Pod）。
2. **API Server 与 etcd**：API Server 验证请求后，将配置数据写入 etcd，更新集群状态。
3. **Controller Manager 监控**：Controller Manager 通过 API Server 监听 etcd 的变化，检测到新任务后执行控制循环（如调整 Pod 数量）。
4. **Scheduler 调度**：Scheduler 监听 API Server 中未调度的 Pod，根据策略选择节点，并通过 API Server 更新 Pod 的绑定信息。
5. **Kubelet 执行**：Kubelet 监听到 API Server 中分配给本节点的 PodSpec，调用容器运行时创建容器，并定期向 API Server 报告状态。
6. **Kube-Proxy 网络**：Kube-Proxy 监听 API Server 中的 Service 和 Endpoints 更新，配置网络规则以支持 Pod 间的通信和负载均衡。

#### k8s的pause容器有什么用。是否可以去掉

1. **Pause 容器的作用**

Pause 容器是每个 Pod 中的一个基础设施容器（Infrastructure Container），它的主要功能有以下几点：

(1) **占位并管理 Pod 的网络和命名空间**

- Pause 容器是一个轻量级容器，其主要任务是创建并持有 Pod 的网络命名空间（Network Namespace）和 IPC 命名空间（IPC Namespace）。在 Kubernetes 中，一个 Pod 内的所有容器共享相同的网络栈（例如 IP 地址和端口空间）和 IPC 机制，而 Pause 容器正是这个共享命名空间的“锚点”。
- 具体来说，Pause 容器启动后会初始化网络配置（如分配 IP），其他业务容器通过加入 Pause 容器的命名空间来共享这些资源。

(2) **保持 Pod 的生命周期**

- Pause 容器的生命周期与 Pod 的生命周期绑定。它会一直处于运行状态（通过一个简单的 pause() 系统调用保持睡眠），从而确保 Pod 不会因为缺少运行中的容器而被销毁。如果没有 Pause 容器，当 Pod 内的业务容器全部退出时，Pod 会被认为已完成并终止，而 Pause 容器的存在避免了这种情况。

(3) **简化容器管理**

- Pause 容器作为一个“占位符”，使得 Pod 内的业务容器可以独立启动、停止或重启，而不会影响 Pod 的整体状态或网络配置。这种设计降低了容器管理的复杂性。

2. **Pause 容器的实现**

- Pause 容器是一个极小的镜像（通常只有几百 KB），由一个简单的 Go 程序编译而成。它运行后调用 pause() 系统调用进入休眠状态，几乎不消耗 CPU 或内存资源。
- 在 Pod 的配置文件中，Pause 容器通常由 Kubernetes 自动注入，用户无需显式声明。

3. **是否可以去掉 Pause 容器**

(1) **理论上可以，但不建议**

- 从技术角度看，Pause 容器的功能并非不可替代。可以通过自定义 CRI（容器运行时接口）或修改 Kubernetes 的实现，让 Pod 直接管理网络命名空间和生命周期，而无需依赖 Pause 容器。例如，可以由 Kubelet 或容器运行时（如 containerd）接管这些职责。
- 然而，这种替代方案需要对 Kubernetes 的核心代码进行大量修改，会增加复杂性和维护成本。

(2) **实际中不可去掉的原因**

- **设计一致性**：Pause 容器是 Kubernetes Pod 模型的核心部分，去掉它会打破现有架构的统一性，影响 Pod 的语义（即“一组共享资源的容器”）。
- **兼容性问题**：现有工具链（如 CNI 网络插件）和生态系统都依赖 Pause 容器的存在，去掉它可能导致网络插件无法正常工作。
- **资源开销低**：Pause 容器本身非常轻量，去掉它带来的收益微乎其微，而保留它却能保证系统的稳定性和简单性。

(3) **替代场景**

- 在一些极简的容器编排系统中（非 Kubernetes），可能不需要类似 Pause 容器的设计。但在 Kubernetes 的上下文中，Pause 容器是经过深思熟虑的最佳实践，去掉它得不偿失。

4. **总结**

Pause 容器在 Kubernetes 中扮演了占位、管理命名空间和维持 Pod 生命周期的关键角色。它的存在简化了 Pod 的设计和容器管理，同时保持了系统的稳定性和一致性。虽然理论上可以通过重构去掉它，但在实际生产环境中，保留 Pause 容器是更合理且经济的选择。因此，在标准的 Kubernetes 部署中，Pause 容器不可去掉，也无需去掉。

#### k8s中的pod内几个容器之间的关系是什么。

在 Kubernetes 中，一个 Pod 是最小的调度单位，Pod 内的多个容器之间是一种**紧密协作、资源共享**的关系。具体来说，它们的关系体现在以下几个方面：

1. 共享命名空间

   ：

   - Pod 内的所有容器共享相同的网络命名空间（Network Namespace），包括 IP 地址和端口空间。这意味着它们通过 localhost 相互通信。
   - 它们还共享 IPC 命名空间（IPC Namespace），可以通过进程间通信机制（如信号量）交互。
   - 这些命名空间由 Pod 中的 Pause 容器创建并维护。

2. 共享存储卷

   ：

   - Pod 内的容器可以挂载相同的 Volume，实现数据共享和持久化。例如，一个容器写日志，另一个容器读取日志。

3. 协作运行

   ：

   - Pod 内的容器通常是互补的，共同完成一个功能。例如，一个主容器运行 Web 服务，另一个 Sidecar 容器负责日志收集或代理。

4. 生命周期绑定

   ：

   - Pod 内的容器作为一个整体被调度和管理。如果 Pod 被删除，所有容器都会被销毁。Pause 容器确保 Pod 在业务容器退出后仍保持运行状态。

**总结**：Pod 内的容器是紧密耦合的，它们共享网络、存储和生命周期，设计目的是协作完成一个应用场景。这种关系区别于 Pod 间的松散耦合，体现了 Kubernetes 的容器编排理念。

#### 一个经典pod的完整生命周期

1. Pending（等待）

   ：

   - Pod 已被 API Server 接受，但尚未完全调度或启动。
   - 此时，Scheduler 正在根据资源需求和调度策略选择合适的节点，容器镜像可能也在拉取中。

2. Running（运行）

   ：

   - Pod 被调度到节点上，Kubelet 启动所有容器（包括 Pause 容器和业务容器）。
   - 容器进入运行状态，Pod 被认为“就绪”（Ready），可以通过就绪探针（Readiness Probe）确认。

3. Succeeded 或 Failed（成功或失败）

   ：

   - 如果 Pod 中的所有容器正常退出（退出码为 0），Pod 状态变为 Succeeded，通常见于一次性任务（如 Job）。
   - 如果有容器异常退出（非 0 退出码），Pod 状态变为 Failed。

4. Terminating（终止中）

   ：

   - 当 Pod 被删除（例如通过 kubectl delete 或控制器调整副本数）时，进入此阶段。
   - API Server 标记 Pod 为删除状态，Kubelet 收到信号后，先发送 SIGTERM 给容器，等待优雅关闭（默认 30 秒），超时后强制杀掉（SIGKILL）。

5. Deleted（已删除）

   ：

   - Pod 从集群中完全移除，相关资源被释放，不再出现在 kubectl get pods 输出中。

**关键点**：

- **生命周期管理**：由 Kubelet 和 Controller Manager（例如 Deployment）协同控制。
- **探针作用**：存活探针（Liveness Probe）和就绪探针（Readiness Probe）影响容器重启和 Pod 状态。
- **重启策略**：Pod 本身不重启，容器可根据 RestartPolicy（Always、OnFailure、Never）重启。

**总结**：Pod 的生命周期从 Pending 开始，经过 Running，可能以 Succeeded 或 Failed 结束，最终通过 Terminating 被删除。这体现了 Kubernetes 对容器化任务的精细管理。

#### k8s的service和ep是如何关联和相互影响的

在 Kubernetes 中，Service 和 Endpoints（EP）是紧密关联的网络抽象，它们共同实现服务发现和负载均衡。以下是它们的关系和相互影响：

1. **Service 和 Endpoints 的关系**

- **Service**：Service 是 Kubernetes 中的逻辑抽象，定义了一组 Pod 的访问策略（如 ClusterIP、NodePort），通过标签选择器（Selector）关联到后端 Pod。
- **Endpoints**：Endpoints 是 Service 的具体实现，表示与 Service 关联的 Pod 的实际 IP 和端口列表。每个 Endpoints 对象记录了当前符合 Service 标签选择器的 Pod 的网络端点。

**关联机制**：

- 当 Service 定义了标签选择器时，Kubernetes 控制器会自动根据选择器匹配 Pod，并动态生成或更新对应的 Endpoints 对象。
- 如果 Service 没有选择器（例如外部服务），需要手动创建 Endpoints 对象，指定 IP 和端口。

2. **相互影响**

(1) **Service 对 Endpoints 的影响**

- **动态更新**：Service 的选择器变化（例如修改标签）会导致 Endpoints 自动更新，反映匹配的新 Pod 列表。
- **服务类型**：Service 的类型（如 ClusterIP、LoadBalancer）决定了 Endpoints 的访问方式，但不影响其内容。

(2) **Endpoints 对 Service 的影响**

- **负载均衡**：Service 通过 Endpoints 中的 IP 和端口列表实现流量分发。如果 Endpoints 为空（无匹配 Pod），Service 无法转发流量。
- **就绪状态**：Endpoints 只包含通过就绪探针（Readiness Probe）的 Pod 端点，未就绪的 Pod 会被移除，确保 Service 只转发到健康实例。

3. **工作流程**

1. Service 创建时，指定标签选择器。
2. Controller Manager 监控 Pod 状态，生成或更新 Endpoints 对象。
3. Kube-Proxy 监听 Service 和 Endpoints 变化，配置 IPTables 或 IPVS 规则，实现流量路由。
4. Pod 增删或状态变化时，Endpoints 动态调整，Service 随之更新负载均衡目标。

4. **特殊情况**

- **无选择器 Service**：需手动维护 Endpoints，例如连接外部服务。
- **Headless Service**：ClusterIP 设置为 None，Service 不创建 VIP，直接返回 Endpoints 中的 Pod IP，适用于状态服务（如数据库）。

**总结**：Service 定义访问策略，Endpoints 提供具体端点，二者通过标签选择器关联。Service 驱动 Endpoints 的生成，Endpoints 决定 Service 的流量目标，共同实现动态服务发现和负载均衡。

#### 详述kube-proxy原理，一个请求是如何经过层层转发落到某个pod上的整个过程,请求可能来自pod也可能来自外部

1. **kube-proxy 原理**

kube-proxy 的核心功能是将 Service 的抽象（例如 ClusterIP）映射到具体的 Pod 端点（Endpoints）。它有三种工作模式：

- **Userspace 模式**（早期，已弃用）：通过用户空间代理转发，性能较低。
- **IPTables 模式**（默认）：利用内核 IPTables 规则实现转发，高效且稳定。
- **IPVS 模式**（高性能替代）：基于内核 IPVS（IP Virtual Server），支持更多负载均衡算法（如轮询、最少连接）。

目前主流使用 IPTables 或 IPVS 模式，以下以 IPTables 模式为例展开。

**工作机制**：

1. kube-proxy 监听 API Server，获取 Service 和 Endpoints 的变化。
2. 根据 Service 的 VIP 和 Endpoints 中的 Pod IP、端口，动态生成 IPTables 规则。
3. 这些规则定义了从 Service VIP 到后端 Pod 的流量转发路径。

2. **请求转发到 Pod 的完整过程**

假设有一个 Service（ClusterIP 为 10.96.0.1:80），关联到两个后端 Pod（IP 为 192.168.1.10:8080 和 192.168.1.11:8080），以下是请求从客户端到 Pod 的分步过程：

(1) **客户端发起请求**

- 客户端（可能是集群内 Pod 或外部用户）向 Service 的 ClusterIP 发送请求，例如 10.96.0.1:80。
- 如果是集群内请求，DNS 解析 Service 名称（如 my-service.default.svc.cluster.local）到此 VIP。

(2) **请求到达节点**

- 请求通过网络到达某个节点（可能是客户端所在节点或通过 CNI 网络插件路由到的节点）。
- 节点的内核网络栈接收到目标为 10.96.0.1:80 的数据包。

(3) **IPTables 规则匹配**

- kube-proxy 已在节点上配置了 IPTables 规则，典型规则如下：

  - **PREROUTING 链**：检测目标地址为 Service VIP（10.96.0.1:80）。
  - **NAT 表规则**：将数据包的目标地址 DNAT（目标地址转换）到后端 Pod 的 IP 和端口。
  - **负载均衡**：通过随机或轮询策略（由 IPTables 的 statistic 模块实现），选择一个 Pod，例如 192.168.1.10:8080。

- 示例规则：

  ```text
  -A KUBE-SERVICES -d 10.96.0.1/32 -p tcp --dport 80 -j KUBE-SVC-XXX
  -A KUBE-SVC-XXX -m statistic --mode random --probability 0.5 -j KUBE-SEP-192.168.1.10
  -A KUBE-SEP-192.168.1.10 -j DNAT --to-destination 192.168.1.10:8080
  ```

(4) **数据包转发到 Pod**

- DNAT 后，数据包的目标地址变为 Pod IP（192.168.1.10:8080）。
- 如果目标 Pod 在当前节点：
  - 数据包通过 veth 设备（CNI 创建的虚拟网卡）进入 Pod 的网络命名空间，交给 Pod 内的容器处理。
- 如果目标 Pod 在其他节点：
  - 数据包通过 CNI 网络插件（如 Flannel、Calico）的 Overlay 网络（例如 VXLAN）转发到目标节点，再进入 Pod 的网络命名空间。

(5) **Pod 处理并返回响应**

- Pod 内的容器（如 Nginx）接收请求，处理后生成响应。
- 响应数据包的源地址为 Pod IP（192.168.1.10:8080），通过 IPTables 的 SNAT（源地址转换）规则，将源地址伪装回 Service VIP（10.96.0.1），确保客户端感知不到后端 Pod 的真实地址。
- 响应沿原路返回客户端。

3. **关键细节**

- **动态更新**：当 Endpoints 变化（Pod 增删或就绪状态变化），kube-proxy 监听到后更新 IPTables 规则，流量目标实时调整。
- **CNI 协作**：kube-proxy 依赖 CNI 插件（如 Flannel、Calico）实现跨节点通信。
- **IPVS 模式差异**：IPVS 使用内核哈希表而非 IPTables，支持更高效的负载均衡，但转发逻辑类似。

4. **总结**

kube-proxy 通过 IPTables 或 IPVS 将 Service VIP 的请求映射到后端 Pod。请求流程是：客户端访问 VIP → IPTables DNAT 到 Pod IP → CNI 转发到目标节点 → Pod 处理并返回。整个过程高效、动态，确保了 Kubernetes 服务的高可用性和负载均衡。

#### 同一个node上，pod之间互相通信会不会走网络插件

在同一个 Node 上，Pod 之间的通信**不会走网络插件**，而是通过本地网络直接完成。具体原因如下：

1. 共享网络命名空间：
   - Kubernetes 中，Pod 内的容器共享由 Pause 容器创建的网络命名空间，但不同 Pod 之间的网络命名空间是隔离的。
   - 同一个 Node 上的 Pod 使用该节点的网络栈，通过虚拟网卡（如 veth pair）连接到节点的网桥（如 cbr0 或自定义 CNI 网桥）。
2. 通信路径：
   - 当 Pod A 访问 Pod B（例如通过 Pod IP），数据包从 Pod A 的 veth 发出，到达节点网桥。
   - 网桥根据目标 IP（Pod B 的 IP）直接将数据包转发到 Pod B 的 veth，无需经过 Overlay 网络或跨节点路由。
3. 网络插件的作用：
   - CNI 网络插件（如 Flannel、Calico）主要负责跨节点通信（例如 VXLAN 或 IPIP 封装）和 IP 分配。
   - 在同一节点上，通信发生在本地网桥层，插件的 Overlay 功能不介入。
4. 例外情况：
   - 如果使用特殊网络策略（如 Calico 的 NetworkPolicy），可能会涉及 eBPF 或 IPTables 规则，但这属于流量控制，不改变“无需插件转发”的本质。

**总结**：同一个 Node 上，Pod 间通信通过本地网桥直接转发，不走网络插件的跨节点逻辑，效率更高。

#### 会不会走iptables

因为这些 Pod 共享同一个网络命名空间（通常通过主机网络或容器运行时的网络桥接实现），它们之间的通信是直接通过本地回环接口（localhost）或容器间的共享网络实现的，不需要经过外部网络层或 iptables 规则。

#### rc/rs功能是怎么实现的

在 Kubernetes 中，ReplicationController (RC) 和 ReplicaSet (RS) 的功能主要是通过控制器模式实现的。RC 和 RS 会根据定义的模板（如 Pod 模板）和期望的副本数，持续监控集群中 Pod 的运行状态。如果实际副本数与期望不符（例如 Pod 宕机或手动删除），控制器会自动创建或删除 Pod，确保副本数始终保持一致。RS 是 RC 的升级版，支持更灵活的选择器（基于标签的集合操作），但核心实现逻辑都是通过 Kubernetes 的控制循环（Controller Loop）和 API Server 协调完成的。

#### 详述从API接收到一个创建rc/rs的请求，到最终在节点上创建pod的全过程，尽可能详细

1. **API 请求提交**

- 用户通过 kubectl 或直接调用 Kubernetes API（例如 POST /api/v1/namespaces/{namespace}/replicationcontrollers 或 /apis/apps/v1/namespaces/{namespace}/replicasets）提交一个 RC 或 RS 的 YAML/JSON 配置文件。
- 这个配置文件中包含了关键信息：
  - spec.replicas：期望的 Pod 副本数。
  - spec.template：Pod 的模板（包括容器镜像、端口、标签等）。
  - spec.selector：选择器，用于匹配需要管理的 Pod（RS 支持更复杂的 matchLabels 和 matchExpressions）。
- API 请求经过认证（Authentication）和授权（Authorization）检查，确保用户有权限创建该资源。

------

2. **API Server 处理请求**

- Kubernetes API Server 接收到请求后，将其解析并验证 YAML/JSON 的合法性（例如字段是否符合规范）。
- 验证通过后，API Server 将 RC/RS 对象存储到 **etcd**（Kubernetes 的分布式键值存储数据库）中，作为集群状态的一部分。
- 存储完成后，API Server 返回一个成功的响应（例如 HTTP 201 Created）给客户端。

------

3. **控制器管理器启动工作**

- Kubernetes Controller Manager（运行在 Master 节点）中的 **Replication Controller** 或 **ReplicaSet Controller** 会通过 **Informer** 机制（基于 List-Watch）监听 etcd 中的资源变化。
- 当监听到新的 RC/RS 对象创建事件时，控制器会读取该对象的 spec，包括副本数和 Pod 模板。

------

4. **控制器对比期望状态与实际状态**

- 控制器通过 API Server 查询当前集群中与该 RC/RS 的选择器匹配的 Pod 数量（实际状态）。

- 然后将实际 Pod 数量与 

  spec.replicas

  （期望状态）进行对比：

  - 如果实际副本数 < 期望副本数，进入创建 Pod 的流程。
  - 如果实际副本数 > 期望副本数，删除多余的 Pod。
  - 如果相等，则无需操作。

- 假设这是一个新创建的 RC/RS，当前匹配的 Pod 数量为 0，因此需要创建 Pod。

------

5. **创建 Pod 对象**

- 控制器根据 RC/RS 的 spec.template 生成新的 Pod 对象。
- Pod 的元数据会自动添加一些信息，例如：
  - metadata.labels：继承 RC/RS 的选择器标签，确保 Pod 被该控制器管理。
  - metadata.ownerReferences：指向所属的 RC/RS，表示这个 Pod 的“所有者”。
- 控制器通过 API Server 将这些 Pod 对象提交到 etcd，触发 Pod 的创建。

------

6. **调度器分配节点**

- 新创建的 Pod 对象被存储到 etcd 后，Kubernetes Scheduler（调度器）通过 List-Watch 机制监听到这些未调度的 Pod（即 spec.nodeName 为空）。
- 调度器根据以下条件为每个 Pod 选择合适的节点：
  - 节点的资源可用性（CPU、内存等）。
  - Pod 的资源请求和限制（requests 和 limits）。
  - 节点选择器（nodeSelector）、污点（Taints）和容忍（Tolerations）。
  - 亲和性（Affinity）和反亲和性（Anti-Affinity）规则。
- 调度完成后，调度器通过 API Server 更新 Pod 对象的 spec.nodeName 字段，将 Pod 绑定到特定节点。

------

7. **Kubelet 创建 Pod**

- 每个节点上运行的 **Kubelet** 通过 API Server 监听与本节点相关的 Pod 变化。

- 当 Kubelet 检测到有新的 Pod 被调度到本节点（

  spec.nodeName

   匹配节点名称）时：

  - Kubelet 根据 Pod 的 spec（例如容器镜像、卷、环境变量等）调用容器运行时（如 containerd 或 Docker）。
  - 容器运行时从镜像仓库（如 Docker Hub）拉取镜像（如果本地没有缓存）。
  - 创建并启动容器，配置网络（通过 CNI 插件，如 Flannel 或 Calico）和存储（如挂载 Volume）。

- Kubelet 会持续监控 Pod 的状态，并通过 API Server 更新 Pod 的 status 字段（例如 Pending -> Running）。

------

8. **控制器验证与持续监控**

- Pod 创建完成后，RC/RS 控制器会再次检查实际运行的 Pod 数量是否达到 spec.replicas。
- 如果还有不足（例如某 Pod 创建失败），控制器会继续创建新的 Pod。
- 控制器会持续运行，监听 Pod 的变化（例如宕机、删除），并根据需要调整集群状态。

------

9. **网络与服务集成（可选）**

- 如果 RC/RS 的 Pod 需要对外暴露服务，Service 对象会通过标签选择器匹配这些 Pod，并通过 kube-proxy 配置负载均衡（例如 iptables 或 IPVS）。

------

总结流程

1. 用户提交 RC/RS 请求 → API Server 存储到 etcd。
2. 控制器发现新对象 → 检查副本数 → 创建 Pod。
3. 调度器分配节点 → Kubelet 创建容器。
4. 控制器持续监控和调整。

#### 另外，当一个pod失效时，kubernetes是如何发现并重启另一个pod的？

在Kubernetes中，当一个Pod失效时，Kubelet会首先检测到Pod的状态异常，例如进程崩溃或健康检查失败。Kubelet会将这一状态更新到API Server。随后，负责管理的Controller（通常是Deployment或ReplicaSet的Controller）会监听到Pod状态的变化，并根据定义的期望副本数，检测到当前运行的Pod数量不足。于是，Controller会创建一个新的Pod来替换失效的Pod。新的Pod会被调度到合适的节点上，由Kubelet启动，确保服务恢复正常。整个过程是自动化的，通常只需要几秒到几十秒。

#### deployment/rs有什么区别。其使用方式、使用条件和原理是什么。

**区别**

- **Deployment**：更高层次的抽象，管理ReplicaSet，支持声明式更新（如滚动更新、回滚），适合需要版本管理和持续部署的应用。
- **ReplicaSet**：较低层次的控制器，直接管理Pod，确保指定数量的Pod副本运行，专注于副本控制，不支持版本管理。

**使用方式**

- **Deployment**：通过kubectl apply -f deployment.yaml创建或更新，定义Pod模板和副本数，适合动态调整应用。
- **ReplicaSet**：通常不直接创建，而是由Deployment自动生成和管理，也可以通过kubectl apply -f rs.yaml手动定义。

**使用条件**

- **Deployment**：适用于需要频繁更新、回滚或自动扩展的应用，比如Web服务。
- **ReplicaSet**：适用于只需要维持Pod副本数、不关心版本管理的简单场景（但实际中很少单独使用）。

**原理**

- **Deployment**：通过控制ReplicaSet实现Pod的管理。当更新Deployment时，它会创建一个新的ReplicaSet，逐步调整旧RS和新RS的Pod数量，完成滚动更新。
- **ReplicaSet**：通过标签选择器监控Pod状态，与期望副本数对比，若不足则创建新Pod，若多余则删除，确保数量匹配。

总结：Deployment是ReplicaSet的上层封装，提供更高级的功能，实际工作中几乎都用Deployment。

####  cgroup中的cpu有哪几种限制方式。k8s是如何使用实现request和limit的。

**cgroup中的CPU限制方式**

在Linux的cgroup中，CPU资源的限制主要通过以下几种方式实现：

1. **cpu.shares**：设置CPU的相对权重，决定进程在竞争时的CPU分配比例，默认值为1024，适用于cpu子系统。
2. **cpu.cfs_quota_us 和 cpu.cfs_period_us**：通过CFS（完全公平调度器）限制CPU使用量。quota定义时间周期内可用CPU时间，period定义周期长度（如100ms内限20ms CPU时间）。
3. **cpuacct**：用于统计CPU使用情况，不直接限制，但常与上述结合使用。

**Kubernetes如何使用request和limit**

Kubernetes通过cgroup实现Pod的requests和limits：

- requests.cpu

  ：

  - 映射到cpu.shares，表示Pod的最小CPU需求。
  - 保证Pod在竞争时至少获得对应比例的CPU资源。
  - 例如，requests: 0.5转换为cpu.shares=512（默认1024的50%）。

- limits.cpu

  ：

  - 映射到cpu.cfs_quota_us和cpu.cfs_period_us，设置硬性上限。
  - 限制Pod使用的CPU时间，例如limits: 1可能配置为quota=100ms，period=100ms，即每100ms最多用1个核心。

- 实现原理

  ：

  - Kubelet在节点上为每个容器创建cgroup，写入cpu.shares（request）和cpu.cfs_quota_us（limit）。
  - 容器运行时（如containerd或Docker）根据这些cgroup设置调度和管理CPU资源。
  - 如果未设置limits，Pod可超用节点空闲CPU；若设置，则严格受限。

总结：requests用cpu.shares保证最低资源，limits用CFS限制上限，K8s通过Kubelet和cgroup实现精细控制。

#### ClusterIP访问不通是什么原因？

ClusterIP访问不通可能有以下原因：

1. 服务未正确定义或未启动，比如端口配置错误或Pod未运行。
2. 网络策略限制了流量，比如NetworkPolicy阻止了访问。
3. kube-proxy未正常工作，导致服务转发失败。
4. DNS解析问题，比如CoreDNS配置错误或不可用。
5. 集群内部网络故障，例如CNI插件问题。

我会先检查Pod状态、服务配置和网络策略，然后排查kube-proxy和DNS日志，逐步定位问题。

#### 宿主机能看到容器内的进程吗？

宿主机可以看到容器内的进程。容器本质上是宿主机上的进程，只是通过命名空间（namespace）隔离了资源和视图。在宿主机上，可以使用 ps 命令（如 ps aux）或 top 查看所有进程，包括容器内的进程。容器进程的PID是在宿主机的全局PID命名空间中分配的，因此会直接显示。不过，如果容器使用了独立的PID命名空间（默认Docker容器会开启），宿主机看到的进程PID会与容器内看到的有所不同，但仍然可见。

#### 如果在宿主机杀掉容器中的进程，会发生什么？

如果在宿主机上杀掉容器中的进程，会导致以下情况：

1. 如果杀掉的是容器主进程（PID 1），容器会停止运行，因为主进程是容器的生命周期核心，类似于Docker或Kubernetes会检测到容器退出。
2. 如果杀掉的是容器内的非主进程，容器可能继续运行，但具体影响取决于该进程的作用，比如某些功能可能失效。
3. 容器管理工具（如Docker或Kubernetes）可能会根据配置重启容器，尤其是Kubernetes如果有健康检查（liveness probe），会检测到异常并重启Pod。

#### k8s有几种健康检查的方式

Kubernetes 有三种健康检查方式：

1. **Liveness Probe（存活探针）**
    用于检测容器是否存活，如果检查失败，kubelet 会重启容器。常见方式包括 HTTP 请求、TCP 连接或执行命令。
2. **Readiness Probe（就绪探针）**
    用于检测容器是否准备好接收流量，如果失败，容器会被移出服务负载均衡，直到检查通过。支持与 Liveness 相同的检查方法。
3. **Startup Probe（启动探针）**
    用于检测容器应用是否启动完成，适用于启动较慢的应用。在启动完成前，Liveness 和 Readiness 不会生效。支持相同检查方式。

这三种探针可以单独或组合使用，通过配置检查参数（如超时、周期）来满足不同场景需求。

#### 怎么在k8s集群上部署mysql

写development呀，定义好mycnf以及pv和pvc即可

还有通过helm的方式

有oracle官方的operator，也有mariadb的等等

#### 要部署mysql，怎么给他指定一个node

nodeselector

affinity 软硬亲和

podaffinity 软硬亲和

#### 用过集中k8s的网络插件

flannel vxlan wireguard

calico vxlan bgp

cilium ebpf bgp等等





#### 设想一个一千台物理机，上万规模的容器的kubernetes集群，请详述使用kubernetes时需要注意哪些问题？应该怎样解决？（提示可以从高可用，高性能等方向，覆盖到从镜像中心到kubernetes各个组件等）

#### 设想kubernetes集群管理从一千台节点到五千台节点，可能会遇到什么样的瓶颈。应该如何解决。

#### kubernetes的运营中有哪些注意的要点。 

#### 集群发生雪崩的条件，以及预防手段。 

#### 设计一种可以替代kube-proxy的实现 sidecar的设计模式如何在k8s中进行应用。有什么意义。

####  灰度发布是什么。如何使用k8s现有的资源实现灰度发布。 

#### 介绍k8s实践中踩过的比较大的一个坑和解决方式。

#### 其它

基础篇 基础篇主要面向的初级、中级开发工程师职位，主要考察对k8s本身的理解。

kubernetes包含几个组件。各个组件的功能是什么。组件之间是如何交互的。 k8s的pause容器有什么用。是否可以去掉。 k8s中的pod内几个容器之间的关系是什么。 一个经典pod的完整生命周期。 k8s的service和ep是如何关联和相互影响的。 详述kube-proxy原理，一个请求是如何经过层层转发落到某个pod上的整个过程。请求可能来自pod也可能来自外部。 rc/rs功能是怎么实现的。详述从API接收到一个创建rc/rs的请求，到最终在节点上创建pod的全过程，尽可能详细。另外，当一个pod失效时，kubernetes是如何发现并重启另一个pod的？ deployment/rs有什么区别。其使用方式、使用条件和原理是什么。 cgroup中的cpu有哪几种限制方式。k8s是如何使用实现request和limit的。

拓展实践篇 拓展实践篇主要面向的高级开发工程师、架构师职位，主要考察实践经验和技术视野。

设想一个一千台物理机，上万规模的容器的kubernetes集群，请详述使用kubernetes时需要注意哪些问题？应该怎样解决？（提示可以从高可用，高性能等方向，覆盖到从镜像中心到kubernetes各个组件等） 设想kubernetes集群管理从一千台节点到五千台节点，可能会遇到什么样的瓶颈。应该如何解决。 kubernetes的运营中有哪些注意的要点。 集群发生雪崩的条件，以及预防手段。 设计一种可以替代kube-proxy的实现 sidecar的设计模式如何在k8s中进行应用。有什么意义。 灰度发布是什么。如何使用k8s现有的资源实现灰度发布。 介绍k8s实践中踩过的比较大的一个坑和解决方式。

# https://zhuanlan.zhihu.com/p/702112712

**Q1. Kubernetes的控制平面包括哪些核心组件？它们各自的作用是什么？**

**A1.** 控制平面包括：

- **API Server**：提供集群的前端接口，处理REST请求，存储数据到etcd，并与其他组件通信。
- **etcd**：分布式键值存储，保存集群的配置数据和状态。
- **Controller Manager**：管理控制器，如ReplicationController、Deployment Controller，确保实际状态与期望状态一致。
- **Scheduler**：根据资源情况，将待调度的Pod分配到合适的节点上。

**Q2.** Kubernetes的数据平面涉及哪些组件？它们如何协作？

**A2.** 数据平面主要包括：

- **kubelet**：在每个节点上运行，负责Pod的创建、启停等生命周期管理。
- **kube-proxy**：实现服务的网络代理功能，如负载均衡，确保 Pod 间通讯。
- **容器运行时**（如Docker或containerd）：在节点上执行容器。

**Q3. 什么是Pod？为什么它是Kubernetes的基本单元？**

**A3.** Pod是最小的可部署单元，可以包含一个或多个紧密相关的容器，共享存储和网络命名空间。Pod设计允许容器间紧密交互，简化配置管理，因此成为部署和管理的最小单位。

**Q4.** Service如何实现服务发现和负载均衡？

**A4.** Service定义了访问一组Pod的方式，通过Cluster IP、NodePort、LoadBalancer或Ingress等，提供稳定的访问地址和负载均衡，确保请求均匀分配到后端Pod。

**Q5.** Kubernetes网络模型的核心原则是什么？

**A5.** 核心原则是 “每个Pod一个IP”，确保Pod间通信像在同一局域网内一样简单，且不依赖于Pod所在的节点。网络插件（如Flannel、Calico）实现此模型。

**Q6. Kubernetes如何管理持久化存储？**

**A6.** 通过Persistent Volumes (PV) 和 Persistent Volume Claims (PVC)。PV代表集群中的一块存储资源，而PVC是用户对存储的请求。Kubernetes自动或手动匹配PV和PVC，实现存储资源的动态分配和回收。

**Q7. Kubernetes如何实现访问控制和权限管理？**

**A7.** 使用Role-Based Access Control (RBAC)，通过角色和角色绑定来控制用户或服务账户对资源的操作权限，确保最小权限原则。

**1）Role（角色）**：Role 定义了一组操作权限的集合，可以授予指定命名空间内的用户或用户组。Role 只能用于授予命名空间内资源的权限，如 Pod、Service、Deployment 等。

**2）RoleBinding（角色绑定）**：RoleBinding 将 Role 与用户或用户组之间进行绑定，指定了哪些用户或用户组具有特定的权限。一个 RoleBinding 可以将多个用户或用户组与一个 Role 相关联。

**3）ClusterRole（集群角色）**：ClusterRole 类似于 Role，但作用范围更广泛，可以授予集群范围内资源的权限，如节点、命名空间、PersistentVolume 等。ClusterRole 不限于单个命名空间。

**4）ClusterRoleBinding（集群角色绑定）**：ClusterRoleBinding 将 ClusterRole 与用户或用户组之间进行绑定，指定了哪些用户或用户组具有特定的集群级别权限。一个 ClusterRoleBinding 可以将多个用户或用户组与一个 ClusterRole 相关联。

**Q8. 如何确保Kubernetes集群的安全性？**

**A8.** 安全措施包括：使用安全网络策略限制Pod间通信，加密通信（如TLS），使用安全的容器运行时，定期安全扫描，管理好Secrets和ConfigMaps，以及启用网络策略和Pod安全策略等。

**Q9. 在Kubernetes中，你如何管理持久化存储？**

**A9.** 在Kubernetes中，管理持久化存储通常使用PersistentVolumes (PV) 和 PersistentVolumeClaims (PVC)。PV是集群中一块可用的网络存储，而PVC是用户存储需求的声明。PVC和PV之间的关系是通过匹配PVC的需求与PV的属性来实现的。

用户通过创建PVC来请求特定大小和访问模式的存储，而集群管理员则负责创建PV，这些PV可以绑定到PVC上以满足用户的存储需求。此外，还可以使用StorageClass来实现动态的存储供应，即当PVC被创建时，会自动根据StorageClass的定义来创建PV。

**Q10. 描述Kubernetes的亲和性和反亲和性规则，并解释它们如何影响Pod的调度**。

**A10.** Kubernetes的亲和性和反亲和性规则用于影响Pod的调度。

- 亲和性 (Affinity)：指定Pod倾向于被调度到哪些Node上。这可以通过节点亲和性（基于Node的标签）或Pod亲和性（基于其他Pod的标签）来实现。例如，你可能希望将某些Pod调度到具有特定硬件或特定版本操作系统的节点上。
- 反亲和性 (Anti-Affinity)：指定Pod不应该被调度到哪些Node上。这通常用于确保Pod之间的高可用性。例如，你可以设置反亲和性规则，使得同一服务的Pod不会被调度到同一个节点上，从而防止节点故障导致服务中断。

**Q11. Kubernetes中的Ingress是什么，它如何工作？**

**A11.** Ingress是Kubernetes的一个API对象，用于管理外部对集群服务的HTTP和HTTPS访问。它提供了一个外部URL路由到集群内部服务的方式，可以基于域名、路径等规则进行路由。

Ingress控制器负责实现Ingress对象定义的路由规则。当Ingress对象被创建时，Ingress控制器会读取该对象的配置，并根据配置设置路由规则。常见的Ingress控制器有Nginx Ingress Controller、Traefik等。这些控制器会将Ingress规则转换为Nginx、HAProxy或其他负载均衡器的配置，以实现HTTP和HTTPS路由。

**Q12. 描述Kubernetes中Pod的生命周期以及常见的生命周期钩子？**

**A12.** Pod的生命周期从创建开始，经历运行、重启、终止等状态，最终可能被删除。在这个过程中，Kubernetes提供了多个生命周期钩子，允许用户在Pod的不同阶段执行自定义操作。

常见的生命周期钩子包括：

- **PostStart**：在容器创建后立即执行一次。常用于初始化容器环境或启动后台进程。
- **PreStop**：在容器终止之前执行。常用于优雅地关闭容器中的服务或清理资源。

**Q13. Kubernetes的自动伸缩（Autoscaling）是如何工作的？**

**A13.** Kubernetes支持两种自动伸缩机制：水平伸缩（Horizontal Pod Autoscaling, HPA）和垂直伸缩（Vertical Pod Autoscaling, VPA）。

- **水平伸缩（HPA）**：根据Pod的资源使用情况（如CPU、内存）或自定义指标（如应用特定的性能指标）自动增加或减少Pod的副本数量。HPA控制器会定期查询API服务器以获取Pod的资源使用情况，并根据配置的策略进行伸缩操作。
- **垂直伸缩（VPA）**：根据Pod的资源使用情况自动调整Pod的资源请求（requests）和限制（limits）。VPA控制器会分析Pod的历史资源使用情况，并预测其未来的资源需求，然后更新Pod的YAML配置文件以实现垂直伸缩。

**Q14. 什么是Kubernetes的Service Account，它有什么用途？**

**A14.** Service Account是Kubernetes中用于访问API服务器的身份凭证。每个Service Account都与一个或多个Secret相关联，这些Secret包含用于身份验证的令牌（token）和证书。

Service Account的主要用途是为运行在集群中的Pod提供API访问权限。与常规用户账户不同，Service Account与特定的命名空间相关联，并且只能在该命名空间内访问资源。这使得Service Account成为管理Pod对API服务器访问权限的便捷方式。

**Q15. 描述Kubernetes的滚动更新（Rolling Update）和重新创建（Recreate）策略？**

**A15.**

- **滚动更新（Rolling Update）**：滚动更新是Kubernetes中一种用于更新应用程序版本的策略，它可以在不中断服务的情况下逐步替换旧版本的Pod。在滚动更新过程中，新的Pod实例会逐步替换旧的Pod实例，同时确保服务始终可用。这种策略允许管理员控制更新的速度和进度，以便在必要时进行干预和调整。滚动更新可以通过Kubernetes的Deployment对象来实现，它会自动处理Pod的创建、更新和删除操作。
- **重新创建（Recreate）**：重新创建是一种更为直接和简单的部署策略，它首先会停止并删除所有旧的Pod实例，然后再创建新的Pod实例。在这个过程中，服务可能会经历短暂的中断。重新创建策略适用于那些可以容忍短暂中断的应用程序，或者当需要进行较大规模的结构性更改时。与滚动更新相比，重新创建策略更为简单和直接，但可能会导致服务的可用性下降。

**Q16. Kubernetes中的DaemonSet是什么，它通常用于什么场景？**

**A16.** DaemonSet确保在集群中的每个节点上运行一个Pod的副本。当节点加入集群时，DaemonSet会为其调度一个Pod。当节点从集群中移除时，DaemonSet也会清理该节点上的Pod。DaemonSet通常用于运行集群级别的守护进程，例如存储守护进程、日志收集器、网络插件等。

**Q17. Kubernetes中的StatefulSet和Deployment有什么区别？**

**A17.** StatefulSet用于管理有状态的应用程序，例如数据库、分布式存储系统等。StatefulSet提供了稳定的网络标识符、稳定的存储和有序的部署、扩展和删除。与Deployment不同，StatefulSet中的Pod不是完全可替换的，每个Pod都有一个唯一的标识。而Deployment主要用于管理无状态的应用程序，它提供了滚动更新、回滚和扩展等功能。

**Q18. Kubernetes中的ConfigMap和Secret如何用于应用程序配置？**

**A18.** ConfigMap和Secret都是Kubernetes中用于存储应用程序配置信息的资源对象。ConfigMap用于存储非敏感的配置信息，如配置文件、环境变量等。Secret则用于存储敏感的配置信息，如密码、密钥等。这些信息可以被挂载到Pod中的容器文件系统中，或者以环境变量的形式注入到容器中，供应用程序使用。

**Q19. Kubernetes中的Sidecar容器是什么，它有什么用途？**

**A19.** Sidecar容器是与主应用程序容器一起运行的辅助容器，它们共享相同的Pod和网络命名空间。Sidecar容器可以用于提供额外的功能或服务给主应用程序容器，例如日志收集、监控代理、服务发现等。由于它们与主应用程序容器共享相同的网络和存储资源，因此它们可以轻松地访问主应用程序的日志、环境变量和配置信息等。

**Q20. Kubernetes中的准入控制器（Admission Controllers）是什么，它们如何影响集群的行为？**

**A20.** 准入控制器是Kubernetes API服务器中的一段代码，用于拦截发送到API服务器的请求，在它们持久化到存储之前进行更改或拒绝。这些控制器允许集群管理员定义并强制执行自定义的策略，以确保请求满足集群的安全性和业务规则。例如，准入控制器可以用于限制对资源的访问、验证Pod的安全配置或实施配额。

**Q21. Kubernetes中的Taint和Toleration是什么，它们如何影响Pod的调度？**

**A21.** Taint是附加到节点的键值对，用于表示节点上的某些属性或条件，这些属性或条件可能会阻止Pod在该节点上运行。Toleration是Pod的规格中的字段，用于表示Pod可以容忍哪些Taint。当调度器尝试将Pod调度到节点时，它会检查节点的Taint和Pod的Toleration，以确保Pod可以容忍节点的所有Taint。这允许管理员更精细地控制Pod的调度，例如，将某些类型的Pod限制到具有特定硬件或软件配置的节点上。

**Q22. Kubernetes中的CNI（容器网络接口）是什么，它在集群中的作用是什么？**

**A22.** CNI（容器网络接口）是一个规范，用于定义容器如何连接到网络。在Kubernetes集群中，CNI允许使用各种网络插件来实现Pod之间的网络通信。这些插件负责设置网络接口、分配IP地址、配置路由等。通过使用CNI，Kubernetes可以支持多种网络解决方案，包括Flannel、Calico等。

**Q23. Kubernetes的Pod亲和性和反亲和性是什么，它们在调度中的作用是什么？**

**A23.** Pod亲和性和反亲和性是Kubernetes调度器中的两个概念，用于控制Pod在集群中的位置。亲和性规则允许管理员指定Pod应该运行（或不应该运行）在具有某些属性的节点上。这些属性可以包括节点的标签、其他Pod的存在或不存在等。通过使用亲和性和反亲和性规则，管理员可以确保Pod被调度到满足其需求的节点上，从而提高集群的可用性和性能。

**Q24. 在Kubernetes中，QoS类别是如何定义的？请解释Guaranteed、Burstable和BestEffort的区别**。

**A24.** 在Kubernetes中，QoS类别是根据Pod的资源请求（request）和限制（limit）来定义的。QoS类别有三种：

- **Guaranteed**：Pod中的每个容器都设置了CPU和内存的资源限制，并且限制值等于请求值。这种Pod的QoS最高，调度器会优先调度它们，并且在资源紧张的情况下，它们会被最后终止。
- **Burstable**：Pod中的至少一个容器设置了资源请求，但没有设置相应的限制，或者限制值大于请求值。这种Pod的QoS中等，调度器会正常调度它们，并在资源紧张时，根据资源使用情况来决定是否终止它们。
- **BestEffort**：Pod没有设置任何资源请求或限制。这种Pod的QoS最低，调度器在资源紧张时会优先终止它们。

**Q25. Kubernetes中的服务发现是如何工作的？**

**A25.** Kubernetes通过DNS和Service资源对象来实现服务发现。当Pod启动时，它会向集群的DNS服务器注册自己的IP地址和主机名。然后，其他Pod可以通过服务名来访问该Pod，DNS服务器会将服务名解析为对应的Pod IP地址。此外，Kubernetes还提供了Service对象来抽象Pod的集合，并为它们提供负载均衡和发现功能。管理员可以创建Service对象来定义服务的名称、端口和选择器等属性，并将它们与Pod关联起来。其他Pod可以通过Service的名称和端口来访问该服务。

**Q26. Kubernetes中的PodSecurityPolicy是什么？它如何帮助增强集群的安全性？**

**A26.** PodSecurityPolicy（PSP）是一种集群级别的资源，用于控制Pod创建的安全上下文。通过PSP，管理员可以定义一系列的安全策略，如限制容器的运行用户、限制容器的文件系统访问权限等。这些策略可以帮助增强集群的安全性，防止潜在的安全风险。

**Q27. Kubernetes中的Custom Resource Definition (CRD) 和 Operator 是什么？它们如何一起工作？**

**A27.** CRD允许用户定义自己的Kubernetes资源类型，而Operator则是一种控制循环，用于管理这些自定义资源的生命周期。Operator通过监听自定义资源的事件，并根据需要执行相应的操作，如创建、更新或删除相关的Kubernetes资源。这使得用户能够更灵活地扩展Kubernetes的功能，并管理自己的应用程序。

**Q28. Kubernetes中的Service Account是什么？它与User Account有何不同？**

**A28.** 在Kubernetes中，Service Account是用于为Pod中的进程提供身份和权限的一种机制。每个Pod在创建时都会自动关联一个Service Account，该Service Account具有一组默认的权限和角色绑定。与User Account不同，Service Account主要用于Pod内部的进程与Kubernetes API服务器进行交互，而User Account则用于外部用户或客户端与Kubernetes API服务器进行交互。此外，Service Account的生命周期与Pod相关联，当Pod被删除时，其关联的Service Account也会被自动删除。

**Q29. Kubernetes中的PodDisruptionBudget是什么？它如何帮助确保应用程序的高可用性？**

**A29.** PodDisruptionBudget（PDB）是Kubernetes中的一种资源对象，用于限制在自愿或非自愿中断（如节点维护、节点故障等）期间可以同时终止的Pod的数量。通过定义PDB，管理员可以指定在给定时间窗口内可以终止的Pod的最小数量或百分比。这有助于确保在发生中断时，应用程序仍然具有足够的容量来处理请求，从而保持高可用性。

**Q30. Kubernetes中的Ingress是什么？它如何与Service一起工作？**

**A30.** Ingress是Kubernetes的一个API对象，用于管理集群外部对集群内部服务的HTTP和HTTPS路由。Ingress提供了一种集中定义路由规则的方式，使得来自集群外部的请求能够被正确地转发到集群内部的服务上。Ingress需要配合Ingress Controller一起使用，Ingress Controller是一个负责监听Ingress对象并据其配置转发规则的组件。Service是Kubernetes中的另一个API对象，用于为Pod提供稳定的网络访问地址。Ingress通常会将请求转发到某个Service上，再由Service将请求分发到具体的Pod上。

# https://zhuanlan.zhihu.com/p/678551905

### 1、简述ETCD及其特点?

etcd是一个用于配置共享和服务发现的键值存储系统，能够为整个分布式集群存储关键数据，协助集群正常运转 服务端将配置信息存储在etcd中，客户端从etcd中得到配置信息，etcd监听配置信息的变化，发现配置变化通知到客户端 特点 - 安装、使用简单 - 数据分层存储在目录中，类似于文件系统 - watch机制 - 安装机制：支持ssl证书认证 - 高性能：etc支持2k/s的读操作 - 一致可靠：基于Raft共识算法实现数据存储、服务调用的一致性和高可用性 - Revision机制：每个key带有一个revision号，每次事物便加一。 -

### 2、简述ETCD适应的场景?

- 服务发现
- 消息发布与订阅
- 负载均衡
- 分布式通知与协调
- 分布式锁
- 集群监控与leader选举

### 3、简述什么是Kubernetes?

k8s是一个开源的容器管理工具，负责容器部署，容器扩缩容以及负载平衡。可以说k8s是一个多容器管理解决方案。

### 4、简述Kubernetes和Docker的关系?

docker提供容器的生命周期管理、镜像构建运行时容器。k8s关联和编排容器在多个主机上互相通信。

### 5、简述Kubernetes中什么是Minikube、Kubectl、Kubelet?

- 是一种可以在本地轻松运行k8s的工具。
- 是一个命令行工具，可以使用该工具控制Kubernetes集群管理器，如检查群集资源，创建、删除和更新组件，查看应用程序
- 是一个代理服务，它在每个节点上运行，并使从服务器与主服务器通信

### 6、简述Kubernetes常见的部署方式?

- 二进制部署
- kubeadm
- 源码安装部署

### 7、简述Kubernetes如何实现集群管理?

在集群管理方面，Kubernetes将集群中的机器划分为一个Master节点和一群工作节点Node。其中，在Master节点运行着集群管理相关的一组进程kube-apiserver、kube-controller-manager和kube-scheduler，这些进程实现了整个集群的资源管理、Pod调度、弹性伸缩、安全控制、系统监控和纠错等管理能力，并且都是全自动完成的

### 8、简述Kubernetes的优势、适应场景及其特点?

优势 - 容器编排 - 轻量级 - 开源 - 弹性伸缩 - 负载均衡

场景 - 快速部署 - 快速扩展 - 快速对接新的应用功能 - 优化资源，提升资源利用率

特点 - 可移植 - 可扩展 - 自动化

### 9、简述Kubernetes的缺点或当前的不足之处?

- 安装过程和配置相对困难复杂
- 管理服务相对繁琐
- 运行和编译需要很多时间
- 它比其他替代品更昂贵

### 10、简述Kubernetes相关基础概念

| 概念                                         | 描述                                                         |
| -------------------------------------------- | ------------------------------------------------------------ |
| Pod（Pod组）                                 | Pod是Kubernetes的最小调度单元，它可以包含一个或多个容器。容器在同一个Pod中共享网络和存储，它们之间可以通过localhost通信。 |
| Node（节点）                                 | 节点是Kubernetes集群中的一个工作机器，可以是物理机器或虚拟机。每个节点负责运行Pod中的容器，并由Master节点进行管理。 |
| Cluster（集群）                              | 集群是由一组工作节点和一个Master节点组成的Kubernetes系统。Master节点负责整个集群的控制和管理。 |
| Service（服务）                              | 服务是一种抽象，定义了一组Pod及其访问方式。它可以确保Pod的稳定网络标识和动态路由。 |
| ReplicaSet                                   | ReplicaSet是用于确保在集群中运行指定数量的Pod的控制器。当Pod数目发生变化时，ReplicaSet会启动或终止Pod，以维持所需的数量。 |
| Deployment（部署）                           | 部署是一种资源对象，它描述了应用程序的期望状态，并确保集群中的Pod数量符合这个状态。 |
| Namespace（命名空间）                        | 命名空间用于将集群划分为多个虚拟集群，每个命名空间中的资源相互隔离。 |
| ConfigMap和Secret                            | ConfigMap用于将配置数据提供给应用程序，而Secret用于存储敏感信息，如密码和API密钥。 |
| Service Discovery（服务发现）                | Kubernetes通过服务发现机制允许容器应用程序找到和通信其他应用程序的服务。 |
| Ingress                                      | Ingress是一种API对象，定义了从集群外部到集群内部服务的规则。 |
| Persistent Volumes和Persistent Volume Claims | Persistent Volumes（PV）提供了一种抽象，用于将存储资源与集群中的Pod分离开来。Persistent Volume Claims（PVC）是对Persistent Volumes的请求，用于绑定Pod中的存储资源。 |
| RBAC（Role-Based Access Control）            | RBAC用于定义对Kubernetes资源的访问权限，以及哪些用户或服务账户可以执行哪些操作。 |

### 11、简述Kubernetes集群相关组件?

- master
  - kube-controller-manager
  - kube-apiserver
  - kube-scheduler
  - etcd

 

- worker
  - kubelet
  - kube-proxy

### 12、简述Kubernetes RC的机制?

Replication Controller用来管理Pod的副本，保证集群中存在指定数量的Pod副本。当定义了RC并提交至Kubernetes集群中之后，Master节点上的Controller Manager组件获悉，并同时巡检系统中当前存活的目标Pod，并确保目标Pod实例的数量刚好等于此RC的期望值，若存在过多的Pod副本在运行，系统会停止一些Pod，反之则自动创建一些Pod

### 13、简述kube-proxy作用?

kube-proxy的作用主要是负责service的实现,具体来说,就是实现了内部从pod到service和外部的从node port向service的访问

### 14、简述kube-proxy iptables原理?

Kubernetes从1.2版本开始，将iptables作为kube-proxy的默认模式。iptables模式下的kube-proxy不再起到Proxy的作用，其核心功能：通过API Server的Watch接口实时跟踪Service与Endpoint的变更信息，并更新对应的iptables规则，Client的请求流量则通过iptables的NAT机制“直接路由”到目标Pod

### 15、简述kube-proxy ipvs原理?

答：IPVS 在 Kubernetes1.11 中升级为 GA 稳定版。IPVS 则专门用于高性能负载均衡，并使用更高效的数据结构（Hash 表），允许几乎无限的规模扩张，因此被 kube-proxy 采纳为最新模式。

在 IPVS 模式下，使用 iptables 的扩展 ipset，而不是直接调用 iptables 来生成规则链。iptables 规则链是一个线性的数据结构，ipset 则引入了带索引的数据结构，因此当规则很多时，也可以很高效地查找和匹配。

可以将 ipset 简单理解为一个 IP（段）的集合，这个集合的内容可以是 IP 地址、IP 网段、端口等，iptables 可以直接添加规则对这个“可变的集合”进行操作，这样做的好处在于可以大大减少 iptables 规则的数量，从而减少性能损耗。

### 16、简述kube-proxy ipvs和iptables的异同?

答：iptables 与 IPVS 都是基于 Netfilter 实现的，但因为定位不同，二者有着本质的

差别：iptables 是为防火墙而设计的；IPVS 则专门用于高性能负载均衡，并使用更高效的数据结构（Hash 表），允许几乎无限的规模扩张。

与 iptables 相比，IPVS 拥有以下明显优势：

```text
1、为大型集群提供了更好的可扩展性和性能；

2、支持比 iptables 更复杂的负载均衡算法（最小负载、最少连接、加权等）；

3、支持服务器健康检查和连接重试等功能；

4、可以动态修改 ipset 的集合，即使 iptables 的规则正在使用这个集合。
```

### 17、简述Kubernetes中什么是静态Pod?

答：静态 pod 是由 kubelet 进行管理的仅存在于特定 Node的Pod，他们不能通过 API Server 进行管理，无法与 ReplicationController、Deployment 或者DaemonSet 进行关联，并且 kubelet 无法对他们进行健康检查。静态 Pod 总是由kubelet 进行创建，并且总是在 kubelet 所在的 Node 上运行

### 18、简述Kubernetes中Pod可能位于的状态?

Pending API Server已经创建该Pod，且Pod内还有一个或多个容器的镜像没有创建，包括正在下载镜像的过程。 Running Pod内所有容器均已创建，且至少有一个容器处于运行状态、正在启动状态或正在重启状态。 Succeeded Pod内所有容器均成功执行退出，且不会重启。 Failed Pod内所有容器均已退出，但至少有一个容器退出为失败状态。 Unknown 由于某种原因无法获取该Pod状态，可能由于网络通信不畅导致。

### 19、简述Kubernetes创建一个Pod的主要流程?

Kubernetes中创建一个Pod涉及多个组件之间联动，主要流程如下：

- 客户端提交Pod的配置信息（可以是yaml文件定义的信息）到kube-apiserver。
- Apiserver收到指令后，通知给controller-manager创建一个资源对象。
- Controller-manager通过api-server将pod的配置信息存储到ETCD数据中心中。
- Kube-scheduler检测到pod信息会开始调度预选，会先过滤掉不符合Pod资源配置要求的节点，然后开始调度调优，主要是挑选出更适合运行pod的节点，然后将pod的资源配置单发送到node节点上的kubelet组件上。
- Kubelet根据scheduler发来的资源配置单运行pod，运行成功后，将pod的运行信息返回给scheduler，scheduler将返回的pod运行状况的信息存储到etcd数据中心。

### 20、简述Kubernetes中Pod的重启策略?

Pod的重启策略包括Always、OnFailure和Never，默认值为Always。

Always：当容器失效时，由kubelet自动重启该容器； OnFailure：当容器终止运行且退出码不为0时，由kubelet自动重启该容器； Never：不论容器运行状态如何，kubelet都不会重启该容器。 同时Pod的重启策略与控制方式关联，当前可用于管理Pod的控制器包括ReplicationController、Job、DaemonSet及直接管理kubelet管理（静态Pod）。 不同控制器的重启策略限制如下： RC和DaemonSet：必须设置为Always，需要保证该容器持续运行； Job：OnFailure或Never，确保容器执行完成后不再重启； kubelet：在Pod失效时重启，不论将RestartPolicy设置为何值，也不会对Pod进行健康检查。

### 21、简述Kubernetes中Pod的健康检查方式?

对Pod的健康检查可以通过两类探针来检查：LivenessProbe和ReadinessProbe。

LivenessProbe探针：用于判断容器是否存活（running状态），如果LivenessProbe探针探测到容器不健康，则kubelet将杀掉该容器，并根据容器的重启策略做相应处理。若一个容器不包含LivenessProbe探针，kubelet认为该容器的LivenessProbe探针返回值用于是“Success”。

ReadineeProbe探针：用于判断容器是否启动完成（ready状态）。如果ReadinessProbe探针探测到失败，则Pod的状态将被修改。Endpoint Controller将从Service的Endpoint中删除包含该容器所在Pod的Eenpoint。

startupProbe探针：启动检查机制，应用一些启动缓慢的业务，避免业务长时间启动而被上面两类探针kill掉。

### 22、简述Kubernetes Pod的LivenessProbe探针的常见方式?

ExecAction：在容器内执行一个命令，若返回码为0，则表明容器健康。

TCPSocketAction：通过容器的IP地址和端口号执行TCP检查，若能建立TCP连接，则表明容器健康。

HTTPGetAction：通过容器的IP地址、端口号及路径调用HTTP Get方法，若响应的状态码大于等于200且小于400，则表明容器健康。

### 23、简述Kubernetes Pod的常见调度方式?

Kubernetes中，Pod通常是容器的载体，主要有如下常见调度方式：

Deployment或RC：该调度策略主要功能就是自动部署一个容器应用的多份副本，以及持续监控副本的数量，在集群内始终维持用户指定的副本数量。

NodeSelector：定向调度，当需要手动指定将Pod调度到特定Node上，可以通过Node的标签（Label）和Pod的nodeSelector属性相匹配。

NodeAffinity亲和性调度：亲和性调度机制极大的扩展了Pod的调度能力，目前有两种节点亲和力表达：

requiredDuringSchedulingIgnoredDuringExecution：硬规则，必须满足指定的规则，调度器才可以调度Pod至Node上（类似nodeSelector，语法不同）。

preferredDuringSchedulingIgnoredDuringExecution：软规则，优先调度至满足的Node的节点，但不强求，多个优先级规则还可以设置权重值。

Taints和Tolerations（污点和容忍）：

Taint：使Node拒绝特定Pod运行；

Toleration：为Pod的属性，表示Pod能容忍（运行）标注了Taint的Node。

### 24、简述Kubernetes初始化容器（init container）?

init container的运行方式与应用容器不同，它们必须先于应用容器执行完成，当设置了多个init container时，将按顺序逐个运行，并且只有前一个init container运行成功后才能运行后一个init container。当所有init container都成功运行后，Kubernetes才会初始化Pod的各种信息，并开始创建和运行应用容器。

### 25、简述Kubernetes deployment升级过程?

初始创建Deployment时，系统创建了一个ReplicaSet，并按用户的需求创建了对应数量的Pod副本。

当更新Deployment时，系统创建了一个新的ReplicaSet，并将其副本数量扩展到1，然后将旧ReplicaSet缩减为2。

之后，系统继续按照相同的更新策略对新旧两个ReplicaSet进行逐个调整。

最后，新的ReplicaSet运行了对应个新版本Pod副本，旧的ReplicaSet副本数量则缩减为0。

### 26、简述Kubernetes deployment升级策略?

在Deployment的定义中，可以通过spec.strategy指定Pod更新的策略，目前支持两种策略：Recreate（重建）和RollingUpdate（滚动更新），默认值为RollingUpdate。

Recreate：设置spec.strategy.type=Recreate，表示Deployment在更新Pod时，会先杀掉所有正在运行的Pod，然后创建新的Pod。

RollingUpdate：设置spec.strategy.type=RollingUpdate，表示Deployment会以滚动更新的方式来逐个更新Pod。同时，可以通过设置spec.strategy.rollingUpdate下的两个参数（maxUnavailable和maxSurge）来控制滚动更新的过程。

### 27、简述Kubernetes DaemonSet类型的资源特性?

DaemonSet资源对象会在每个Kubernetes集群中的节点上运行，并且每个节点只能运行一个pod，这是它和deployment资源对象的最大也是唯一的区别。因此，在定义yaml文件中，不支持定义replicas。

它的一般使用场景如下：

在去做每个节点的日志收集工作。

监控每个节点的的运行状态。

### 28、简述Kubernetes自动扩容机制?

Kubernetes使用Horizontal Pod Autoscaler（HPA）的控制器实现基于CPU使用率进行自动Pod扩缩容的功能。HPA控制器周期性地监测目标Pod的资源性能指标，并与HPA资源对象中的扩缩容条件进行对比，在满足条件时对Pod副本数量进行调整。

HPA原理

Kubernetes中的某个Metrics Server（Heapster或自定义Metrics Server）持续采集所有Pod副本的指标数据。HPA控制器通过Metrics Server的API（Heapster的API或聚合API）获取这些数据，基于用户定义的扩缩容规则进行计算，得到目标Pod副本数量。

当目标Pod副本数量与当前副本数量不同时，HPA控制器就向Pod的副本控制器（Deployment、RC或ReplicaSet）发起scale操作，调整Pod的副本数量，完成扩缩容操作。

### 29、简述Kubernetes Service类型?

通过创建Service，可以为一组具有相同功能的容器应用提供一个统一的入口地址，并且将请求负载分发到后端的各个容器应用上。其主要类型有：

ClusterIP：虚拟的服务IP地址，该地址用于Kubernetes集群内部的Pod访问，在Node上kube-proxy通过设置的iptables规则进行转发；

NodePort：使用宿主机的端口，使能够访问各Node的外部客户端通过Node的IP地址和端口号就能访问服务；

LoadBalancer：使用外接负载均衡器完成到服务的负载分发，需要在spec.status.loadBalancer字段指定外部负载均衡器的IP地址，通常用于公有云。

### 30、简述Kubernetes Service分发后端的策略?

Service负载分发的策略有：RoundRobin和SessionAffinity

RoundRobin：默认为轮询模式，即轮询将请求转发到后端的各个Pod上。

SessionAffinity：基于客户端IP地址进行会话保持的模式，即第1次将某个客户端发起的请求转发到后端的某个Pod上，之后从相同的客户端发起的请求都将被转发到后端相同的Pod上。

### 31、简述Kubernetes Headless Service?

在某些应用场景中，若需要人为指定负载均衡器，不使用Service提供的默认负载均衡的功能，或者应用程序希望知道属于同组服务的其他实例。Kubernetes提供了Headless Service来实现这种功能，即不为Service设置ClusterIP（入口IP地址），仅通过Label Selector将后端的Pod列表返回给调用的客户端。

### 32、简述Kubernetes外部如何访问集群内的服务?

对于Kubernetes，集群外的客户端默认情况，无法通过Pod的IP地址或者Service的虚拟IP地址:虚拟端口号进行访问。通常可以通过以下方式进行访问Kubernetes集群内的服务：

映射Pod到物理机：将Pod端口号映射到宿主机，即在Pod中采用hostPort方式，以使客户端应用能够通过物理机访问容器应用。

映射Service到物理机：将Service端口号映射到宿主机，即在Service中采用nodePort方式，以使客户端应用能够通过物理机访问容器应用。

映射Sercie到LoadBalancer：通过设置LoadBalancer映射到云服务商提供的LoadBalancer地址。这种用法仅用于在公有云服务提供商的云平台上设置Service的场景。

### 33、简述Kubernetes ingress?

Kubernetes的Ingress资源对象，用于将不同URL的访问请求转发到后端不同的Service，以实现HTTP层的业务路由机制。

Kubernetes使用了Ingress策略和Ingress Controller，两者结合并实现了一个完整的Ingress负载均衡器。使用Ingress进行负载分发时，Ingress Controller基于Ingress规则将客户端请求直接转发到Service对应的后端Endpoint（Pod）上，从而跳过kube-proxy的转发功能，kube-proxy不再起作用，全过程为：ingress controller + ingress 规则 ----> services。

同时当Ingress Controller提供的是对外服务，则实际上实现的是边缘路由器的功能。

### 34、简述Kubernetes镜像的下载策略?

K8s的镜像下载策略有三种：Always、Never、IFNotPresent。

Always：镜像标签为latest时，总是从指定的仓库中获取镜像。

Never：禁止从仓库中下载镜像，也就是说只能使用本地镜像。

IfNotPresent：仅当本地没有对应镜像时，才从目标仓库中下载。默认的镜像下载策略是：当镜像标签是latest时，默认策略是Always；当镜像标签是自定义时（也就是标签不是latest），那么默认策略是IfNotPresent。

### 35、简述Kubernetes的负载均衡器?

负载均衡器是暴露服务的最常见和标准方式之一。

根据工作环境使用两种类型的负载均衡器，即内部负载均衡器或外部负载均衡器。内部负载均衡器自动平衡负载并使用所需配置分配容器，而外部负载均衡器将流量从外部负载引导至后端容器。负载均衡器是暴露服务的最常见和标准方式之一。

根据工作环境使用两种类型的负载均衡器，即内部负载均衡器或外部负载均衡器。内部负载均衡器自动平衡负载并使用所需配置分配容器，而外部负载均衡器将流量从外部负载引导至后端容器。

### 36、简述Kubernetes各模块如何与API Server通信?

Kubernetes API Server作为集群的核心，负责集群各功能模块之间的通信。集群内的各个功能模块通过API Server将信息存入etcd，当需要获取和操作这些数据时，则通过API Server提供的REST接口（用GET、LIST或WATCH方法）来实现，从而实现各模块之间的信息交互。

如kubelet进程与API Server的交互：每个Node上的kubelet每隔一个时间周期，就会调用一次API Server的REST接口报告自身状态，API Server在接收到这些信息后，会将节点状态信息更新到etcd中。

如kube-controller-manager进程与API Server的交互：kube-controller-manager中的Node Controller模块通过API Server提供的Watch接口实时监控Node的信息，并做相应处理。

如kube-scheduler进程与API Server的交互：Scheduler通过API Server的Watch接口监听到新建Pod副本的信息后，会检索所有符合该Pod要求的Node列表，开始执行Pod调度逻辑，在调度成功后将Pod绑定到目标节点上。

### 37、简述Kubernetes Scheduler作用及实现原理?

Kubernetes Scheduler是负责Pod调度的重要功能模块，Kubernetes Scheduler在整个系统中承担了“承上启下”的重要功能，“承上”是指它负责接收Controller Manager创建的新Pod，为其调度至目标Node；“启下”是指调度完成后，目标Node上的kubelet服务进程接管后继工作，负责Pod接下来生命周期。

Kubernetes Scheduler的作用是将待调度的Pod（API新创建的Pod、Controller Manager为补足副本而创建的Pod等）按照特定的调度算法和调度策略绑定（Binding）到集群中某个合适的Node上，并将绑定信息写入etcd中。

在整个调度过程中涉及三个对象，分别是待调度Pod列表、可用Node列表，以及调度算法和策略。

Kubernetes Scheduler通过调度算法调度为待调度Pod列表中的每个Pod从Node列表中选择一个最适合的Node来实现Pod的调度。随后，目标节点上的kubelet通过API Server监听到Kubernetes Scheduler产生的Pod绑定事件，然后获取对应的Pod清单，下载Image镜像并启动容器。

### 38、简述Kubernetes Scheduler使用哪两种算法将Pod绑定到worker节点?

预选（Predicates）：输入是所有节点，输出是满足预选条件的节点。kube-scheduler根据预选策略过滤掉不满足策略的Nodes。如果某节点的资源不足或者不满足预选策略的条件则无法通过预选。如“Node的label必须与Pod的Selector一致”。

优选（Priorities）：输入是预选阶段筛选出的节点，优选会根据优先策略为通过预选的Nodes进行打分排名，选择得分最高的Node。例如，资源越富裕、负载越小的Node可能具有越高的排名。

### 39、简述Kubernetes kubelet的作用?

在Kubernetes集群中，在每个Node（又称Worker）上都会启动一个kubelet服务进程。该进程用于处理Master下发到本节点的任务，管理Pod及Pod中的容器。每个kubelet进程都会在API Server上注册节点自身的信息，定期向Master汇报节点资源的使用情况，并通过cAdvisor监控容器和节点资源。

### 40、简述Kubernetes kubelet监控Worker节点资源是使用什么组件来实现的?

kubelet使用cAdvisor对worker节点资源进行监控。在 Kubernetes 系统中，cAdvisor 已被默认集成到 kubelet 组件内，当 kubelet 服务启动时，它会自动启动 cAdvisor 服务，然后 cAdvisor 会实时采集所在节点的性能指标及在节点上运行的容器的性能指标。

### 41、简述Kubernetes如何保证集群的安全性?

- 最小权限原则
- 用户权限：划分普通用户和管理员的角色
- API Server的认证授权
- API Server的授权管理
- 敏感数据引入Secret机制
- AdmissionControl（准入机制）

### 42、简述Kubernetes准入机制?

| Kubernetes准入机制           | 描述                                                         |
| ---------------------------- | ------------------------------------------------------------ |
| 准入控制插件                 |                                                              |
| - AlwaysAdmit                | 总是通过请求，不执行检查。                                   |
| - AlwaysDeny                 | 总是拒绝请求，不执行检查。                                   |
| - NamespaceLifecycle         | 确保命名空间存在，并根据策略允许或拒绝创建。                 |
| - ResourceQuota              | 实施资源配额，限制在命名空间内的资源使用。                   |
| - PodSecurityPolicy          | 强制执行容器安全策略。                                       |
| - ServiceAccount             | 确保Pod使用有效的ServiceAccount。                            |
| Webhook准入控制              |                                                              |
| - Webhook机制                | 将自定义的准入控制插件集成到API服务器中。                    |
| 动态准入控制配置             |                                                              |
| - 动态配置                   | 在Kubernetes 1.9版本及以上，引入了动态准入控制配置，管理员可以动态配置准入控制插件。 |
| Mutating和Validating准入控制 |                                                              |
| - MutatingAdmissionWebhook   | 在资源被持久化之前对其进行修改。例如，可以动态地注入sidecar容器。 |
| - ValidatingAdmissionWebhook | 对资源进行验证，确保其符合特定规则。例如，可以强制执行命名约定或其他策略。 |
| 默认准入控制配置             |                                                              |
| - 启用/禁用默认插件          | 集群管理员可以通过启用或禁用默认的准入控制插件来调整系统的默认行为。 |

### 43、简述Kubernetes RBAC及其特点（优势）?

- 对集群中的资源和非资源权限均有完整的覆盖。
- 整个RBAC完全由几个API对象完成， 同其他API对象一样， 可以用kubectl或API进行操作。
- 可以在运行时进行调整，无须重新启动API Server。

### 44、简述Kubernetes Secret作用?

Secret对象，主要作用是保管私密数据，比如密码、OAuth Tokens、SSH Keys等信息。将这些私密信息放在Secret对象中比直接放在Pod或Docker Image中更安全，也更便于使用和分发。

### 45、简述Kubernetes Secret有哪些使用方式?

在创建Pod时，通过为Pod指定Service Account来自动使用该Secret。

通过挂载该Secret到Pod来使用它。

在Docker镜像下载时使用，通过指定Pod的spc.ImagePullSecrets来引用它。

### 46、简述Kubernetes PodSecurityPolicy机制?

Kubernetes PodSecurityPolicy是为了更精细地控制Pod对资源的使用方式以及提升安全策略。在开启PodSecurityPolicy准入控制器后，Kubernetes默认不允许创建任何Pod，需要创建PodSecurityPolicy策略和相应的RBAC授权策略（Authorizing Policies），Pod才能创建成功。

### 47、简述Kubernetes PodSecurityPolicy机制能实现哪些安全策略?

- 特权模式：privileged是否允许Pod以特权模式运行。
- 宿主机资源：控制Pod对宿主机资源的控制，如hostPID：是否允许Pod共享宿主机的进程空间。
- 用户和组：设置运行容器的用户ID（范围）或组（范围）。
- 提升权限：AllowPrivilegeEscalation：设置容器内的子进程是否可以提升权限，通常在设置非root用户（MustRunAsNonRoot）时进行设置。
- SELinux：进行SELinux的相关配置。

### 48、简述Kubernetes网络模型?

Kubernetes网络模型中每个Pod都拥有一个独立的IP地址，并假定所有Pod都在一个可以直接连通的、扁平的网络空间中。所以不管它们是否运行在同一个Node（宿主机）中，都要求它们可以直接通过对方的IP进行访问。设计这个原则的原因是，用户不需要额外考虑如何建立Pod之间的连接，也不需要考虑如何将容器端口映射到主机端口等问题。

同时为每个Pod都设置一个IP地址的模型使得同一个Pod内的不同容器会共享同一个网络命名空间，也就是同一个Linux网络协议栈。这就意味着同一个Pod内的容器可以通过localhost来连接对方的端口。

在Kubernetes的集群里，IP是以Pod为单位进行分配的。一个Pod内部的所有容器共享一个网络堆栈（相当于一个网络命名空间，它们的IP地址、网络设备、配置等都是共享的）。

### 49、简述Kubernetes CNI模型?

CNI提供了一种应用容器的插件化网络解决方案，定义对容器网络进行操作和配置的规范，通过插件的形式对CNI接口进行实现。CNI仅关注在创建容器时分配网络资源，和在销毁容器时删除网络资源。在CNI模型中只涉及两个概念：容器和网络。

容器（Container）：是拥有独立Linux网络命名空间的环境，例如使用Docker或rkt创建的容器。容器需要拥有自己的Linux网络命名空间，这是加入网络的必要条件。

网络（Network）：表示可以互连的一组实体，这些实体拥有各自独立、唯一的IP地址，可以是容器、物理机或者其他网络设备（比如路由器）等。

对容器网络的设置和操作都通过插件（Plugin）进行具体实现，CNI插件包括两种类型：CNI Plugin和IPAM（IP Address Management）Plugin。CNI Plugin负责为容器配置网络资源，IPAM Plugin负责对容器的IP地址进行分配和管理。IPAM Plugin作为CNI Plugin的一部分，与CNI Plugin协同工作。

### 50、简述Kubernetes网络策略?

Network Policy的主要功能是对Pod间的网络通信进行限制和准入控制，设置允许访问或禁止访问的客户端Pod列表。Network Policy定义网络策略，配合策略控制器（Policy Controller）进行策略的实现。

### 51、简述Kubernetes网络策略原理?

Network Policy的工作原理主要为：policy controller需要实现一个API Listener，监听用户设置的Network Policy定义，并将网络访问规则通过各Node的Agent进行实际设置（Agent则需要通过CNI网络插件实现）。

### 52、简述Kubernetes中flannel的作用?

它能协助Kubernetes，给每一个Node上的Docker容器都分配互相不冲突的IP地址。

它能在这些IP地址之间建立一个覆盖网络（Overlay Network），通过这个覆盖网络，将数据包原封不动地传递到目标容器内。

### 53、简述Kubernetes Calico网络组件实现原理?

Calico是一个基于BGP的纯三层的网络方案 Calico在每个计算节点都利用Linux Kernel实现了一个高效的vRouter来负责数据转发。每个vRouter都通过BGP协议把在本节点上运行的容器的路由信息向整个Calico网络广播，并自动设置到达其他节点的路由转发规则。

Calico保证所有容器之间的数据流量都是通过IP路由的方式完成互联互通的。Calico节点组网时可以直接利用数据中心的网络结构（L2或者L3），不需要额外的NAT、隧道或者Overlay Network，没有额外的封包解包，能够节约CPU运算，提高网络效率。

### 54、简述Kubernetes共享存储的作用?

Kubernetes对于有状态的容器应用或者对数据需要持久化的应用，因此需要更加可靠的存储来保存应用产生的重要数据，以便容器应用在重建之后仍然可以使用之前的数据。因此需要使用共享存储。

### 55、简述Kubernetes数据持久化的方式有哪些?

EmptyDir（空目录）：没有指定要挂载宿主机上的某个目录，直接由Pod内保部映射到宿主机上。类似于docker中的manager volume。只需要临时将数据保存在磁盘上，比如在合并/排序算法中；作为两个容器的共享存储。同个pod里面的不同容器，共享同一个持久化目录，当pod节点删除时，volume的数据也会被删除。 Hostpath：将宿主机上已存在的目录或文件挂载到容器内部。类似于docker中的bind mount挂载方式 PersistentVolume（简称PV）：如基于NFS服务的PV，也可以基于GFS的PV。它的作用是统一数据持久化目录，方便管理。

### 56、简述Kubernetes PV和PVC?

PV是对底层网络共享存储的抽象，将共享存储定义为一种“资源”。

PVC则是用户对存储资源的一个“申请”。

### 57、简述Kubernetes PV生命周期内的阶段?

- Available：可用状态，还未与某个PVC绑定。
- Bound：已与某个PVC绑定。
- Released：绑定的PVC已经删除，资源已释放，但没有被集群回收。
- Failed：自动资源回收失败。

### 58、简述Kubernetes所支持的存储供应模式?

Kubernetes支持两种资源的存储供应模式：静态模式（Static）和动态模式（Dynamic）。

静态模式：集群管理员手工创建许多PV，在定义PV时需要将后端存储的特性进行设置。

动态模式：集群管理员无须手工创建PV，而是通过StorageClass的设置对后端存储进行描述，标记为某种类型。此时要求PVC对存储的类型进行声明，系统将自动完成PV的创建及与PVC的绑定。

### 59、简述Kubernetes CSI模型?

Kubernetes CSI是Kubernetes推出与容器对接的存储接口标准，存储提供方只需要基于标准接口进行存储插件的实现，就能使用Kubernetes的原生存储机制为容器提供存储服务。CSI使得存储提供方的代码能和Kubernetes代码彻底解耦，部署也与Kubernetes核心组件分离，显然，存储插件的开发由提供方自行维护，就能为Kubernetes用户提供更多的存储功能，也更加安全可靠。

CSI包括CSI Controller和CSI Node：

CSI Controller的主要功能是提供存储服务视角对存储资源和存储卷进行管理和操作。

CSI Node的主要功能是对主机（Node）上的Volume进行管理和操作。

### 60、简述Kubernetes Worker节点加入集群的过程?

```text
1、在该Node上安装Docker、kubelet和kube-proxy服务；

2、然后配置kubelet和kubeproxy的启动参数，将Master URL指定为当前Kubernetes集群Master的地址，最后启动这些服务；

3、通过kubelet默认的自动注册机制，新的Worker将会自动加入现有的Kubernetes集群中；

4、Kubernetes Master在接受了新Worker的注册之后，会自动将其纳入当前集群的调度范围。
```

### 61、简述Kubernetes Pod如何实现对节点的资源控制?

Kubernetes集群里的节点提供的资源主要是计算资源，计算资源是可计量的能被申请、分配和使用的基础资源。当前Kubernetes集群中的计算资源主要包括CPU、GPU及Memory。CPU与Memory是被Pod使用的，因此在配置Pod时可以通过参数CPU Request及Memory Request为其中的每个容器指定所需使用的CPU与Memory量，Kubernetes会根据Request的值去查找有足够资源的Node来调度此Pod。

通常，一个程序所使用的CPU与Memory是一个动态的量，确切地说，是一个范围，跟它的负载密切相关：负载增加时，CPU和Memory的使用量也会增加。

### 62、简述Kubernetes Requests和Limits如何影响Pod的调度?

当一个Pod创建成功时，Kubernetes调度器（Scheduler）会为该Pod选择一个节点来执行。对于每种计算资源（CPU和Memory）而言，每个节点都有一个能用于运行Pod的最大容量值。调度器在调度时，首先要确保调度后该节点上所有Pod的CPU和内存的Requests总和，不超过该节点能提供给Pod使用的CPU和Memory的最大容量值。

### 63、简述Kubernetes Metric Service?

在Kubernetes从1.10版本后采用Metrics Server作为默认的性能数据采集和监控，主要用于提供核心指标（Core Metrics），包括Node、Pod的CPU和内存使用指标。

对其他自定义指标（Custom Metrics）的监控则由Prometheus等组件来完成。

### 64、简述Kubernetes中，如何使用EFK实现日志的统一管理

在Kubernetes集群环境中，通常一个完整的应用或服务涉及组件过多，建议对日志系统进行集中化管理，通常采用EFK实现。

EFK是 Elasticsearch、Fluentd 和 Kibana 的组合，其各组件功能如下：

Elasticsearch：是一个搜索引擎，负责存储日志并提供查询接口；

Fluentd：负责从 Kubernetes 搜集日志，每个node节点上面的fluentd监控并收集该节点上面的系统日志，并将处理过后的日志信息发送给Elasticsearch；

Kibana：提供了一个 Web GUI，用户可以浏览和搜索存储在 Elasticsearch 中的日志。

通过在每台node上部署一个以DaemonSet方式运行的fluentd来收集每台node上的日志。Fluentd将docker日志目录/var/lib/docker/containers和/var/log目录挂载到Pod中，然后Pod会在node节点的/var/log/pods目录中创建新的目录，可以区别不同的容器日志输出，该目录下有一个日志文件链接到/var/lib/docker/contianers目录下的容器日志输出。

### 65、简述Kubernetes如何进行优雅的节点关机维护?

由于Kubernetes节点运行大量Pod，因此在进行关机维护之前，建议先使用kubectl drain将该节点的Pod进行驱逐，然后进行关机维护。

### 66、简述Kubernetes集群联邦?

Kubernetes集群联邦可以将多个Kubernetes集群作为一个集群进行管理。因此，可以在一个数据中心/云中创建多个Kubernetes集群，并使用集群联邦在一个地方控制/管理所有集群。

### 67、简述Helm及其优势?

| Helm及其优势   | 描述                                                         |
| -------------- | ------------------------------------------------------------ |
| 什么是Helm     | Helm是一个用于简化Kubernetes应用程序部署、更新和管理的包管理工具。 |
| Chart          | Helm使用Chart来定义、安装和升级Kubernetes应用程序。Chart是一个包含了所有部署Kubernetes应用所需信息的打包文件。 |
| 优势           |                                                              |
| - 模板引擎     | Helm使用Go语言的模板引擎，允许用户动态生成Kubernetes资源配置，实现配置的可重用性和参数化。 |
| - 版本控制     | Helm允许用户版本控制Chart，轻松管理不同应用程序版本的发布和回滚。 |
| - 包管理       | 通过Helm，用户可以轻松共享和重用应用程序定义，避免重复劳动。 |
| - 依赖管理     | Helm支持定义Chart之间的依赖关系，简化了多组件应用程序的部署。 |
| - 社区支持     | Helm拥有活跃的社区，用户可以从社区中获取Chart，共享经验和解决问题。 |
| - 插件系统     | Helm提供插件系统，允许用户扩展其功能，满足特定需求。         |
| - 安全发布     | Helm允许用户将应用程序作为一个整体发布，确保一致性和可重复性。 |
| - Charts存储库 | 用户可以配置Charts存储库，从中获取和发布Charts，便于管理和分发。 |
| - 自定义配置值 | Helm允许通过values文件自定义Chart的配置，提高了可配置性和灵活性。 |

### 69、容器和主机部署应用的区别是什么?

容器的中心思想就是秒级启动；一次封装、到处运行 容器部署可以将各个服务进行隔离，互不影响

### 70、请你说一下kubenetes针对pod资源对象的健康监测机制?

- livenessProbe
- readinessProbe
- startupProbe

### 71、如何控制滚动更新过程?

maxSurge：　此参数控制滚动更新过程，副本总数超过预期pod数量的上限。可以是百分比，也可以是具体的值。默认为1。

（上述参数的作用就是在更新过程中，值若为3，那么不管三七二一，先运行三个pod，用于替换旧的pod，以此类推）

maxUnavailable： 此参数控制滚动更新过程中，不可用的Pod的数量。

（这个值和上面的值没有任何关系，举个例子：我有十个pod，但是在更新的过程中，我允许这十个pod中最多有三个不可用，那么就将这个参数的值设置为3，在更新的过程中，只要不可用的pod数量小于或等于3，那么更新过程就不会停止）。

### 75、Service这种资源对象的作用是什么?

用来给相同的多个pod对象提供一个固定的统一访问接口，常用于服务发现和服务访问。

### 76、版本回滚相关的命令?
```
| 命令                                                         | 描述                   |
| ------------------------------------------------------------ | ---------------------- |
| kubectl rollout history deployment/<deployment-name>         | 查看滚动升级历史记录   |
| kubectl rollout history deployment/<deployment-name> --revision=<revision-number> | 查看特定版本的详细信息 |
| kubectl rollout undo deployment/<deployment-name>            | 回滚到上一个版本       |
| kubectl rollout undo deployment/<deployment-name> --to-revision=<revision-number> | 回滚到特定版本         |
```
### 77、标签与标签选择器的作用是什么?

| 名词                         | 描述                                                         |
| ---------------------------- | ------------------------------------------------------------ |
| 标签（Label）                | 标签是键值对，用于附加元数据到Kubernetes资源对象（如Pod、Service、Node等）。 |
| 标签选择器（Label Selector） | 标签选择器用于选择带有特定标签的资源对象，以便进行筛选和操作。 |
| 作用                         | 通过标签，可以对资源对象进行分类、组织和识别，提供更灵活的资源管理和调度方式。 |
|                              | 标签选择器允许用户根据标签的键值对对资源进行查询和选择，用于实现有选择性的操作。 |
| 示例                         | 一个Pod可以有标签app=web，允许使用标签选择器选择所有具有该标签的Pod进行管理。 |
|                              | Service可以使用标签选择器将请求路由到具有特定标签的Pod，实现服务发现和负载均衡。 |

### 78、常用的标签分类有哪些?

| 类别     | 描述                                            |
| -------- | ----------------------------------------------- |
| 环境     | 用于区分不同环境，如environment=production。    |
| 应用程序 | 用于标识属于哪个应用程序，如app=web。           |
| 版本     | 用于标识应用程序或组件的版本，如version=1.2.3。 |
| 部门     | 用于区分不同部门的资源，如department=finance。  |
| 客户     | 用于标识属于哪个客户，如customer=companyA。     |
| 组织     | 用于标识属于哪个组织，如organization=dev-team。 |
| 状态     | 用于标识资源的状态，如status=ready。            |
| 系统     | 用于标识系统级别的资源，如system=true。         |

### 79、有几种查看标签的方式?

| 方式                             | 命令/操作                                      |
| -------------------------------- | ---------------------------------------------- |
| 查看单个资源的标签               | kubectl get <资源类型> <资源名称> -o yaml      |
| 查看所有资源的标签               | kubectl get <资源类型> --show-labels           |
| 查看特定标签的资源               | kubectl get <资源类型> -l <标签选择器>         |
| 查看所有命名空间中的标签         | kubectl get all --all-namespaces --show-labels |
| 使用kubectl describe查看资源详情 | kubectl describe <资源类型> <资源名称>         |

### 80、添加、修改、删除标签的命令?

| 操作     | 命令                                                        | 示例                                                |
| -------- | ----------------------------------------------------------- | --------------------------------------------------- |
| 添加标签 | kubectl label <资源类型> <资源名称> <键>=<值>               | kubectl label pod nginx-app app=web                 |
| 修改标签 | kubectl label --overwrite <资源类型> <资源名称> <键>=<新值> | kubectl label --overwrite pod nginx-app app=backend |
| 删除标签 | kubectl label <资源类型> <资源名称> <键>-                   | kubectl label pod nginx-app app-                    |

### 82、说说你对Job这种资源对象的了解?

| 概念         | 描述                                                         |
| ------------ | ------------------------------------------------------------ |
| 任务类型     | Job主要用于管理一次性任务或批处理任务                        |
| Pod管理      | 创建一个或多个Pod，Pod包含执行任务所需的容器                 |
| 任务完成策略 | 有两种策略，Parallel允许多个Pod并行运行，Complete确保所有Pod成功完成 |
| 重试机制     | 支持任务的重试，启动新的Pod替代失败的Pod                     |
| 成功条件     | 配置成功的条件，如成功运行的Pod数量或成功完成的总任务数      |
| 示例         | 一个简单的Job定义包括容器镜像、命令和重试策略                |

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: example-job
spec:
  template:
    metadata:
      name: example-job-pod
    spec:
      containers:
      - name: example-container
        image: example-image
        command: ["echo", "Hello, Kubernetes!"]
  backoffLimit: 4
```

### 85、删除一个Pod会发生什么事情?

答：Kube-apiserver会接受到用户的删除指令，默认有30秒时间等待优雅退出，超过30秒会被标记为死亡状态，此时Pod的状态Terminating，kubelet看到pod标记为Terminating就开始了关闭Pod的工作；

关闭流程如下：

pod从service的endpoint列表中被移除； 如果该pod定义了一个停止前的钩子，其会在pod内部被调用，停止钩子一般定义了如何优雅的结束进程； 进程被发送TERM信号（kill -14） 当超过优雅退出的时间后，Pod中的所有进程都会被发送SIGKILL信号（kill -9）。

### 87、k8s是怎么进行服务注册的?

Pod启动后会加载当前环境所有Service信息，以便不同Pod根据Service名进行通信。

### 88、k8s集群外流量怎么访问Pod?

可以通过Service的NodePort方式访问，会在所有节点监听同一个端口，比如：30000，访问节点的流量会被重定向到对应的Service上面。

### 90、Kubernetes与Docker Swarm的区别如何?

Kubernetes有助于管理更复杂的软件应用容器；Docker Swarm只能编排简单的Docker容器 支持自动扩缩容；不支持自动扩缩容 滚动更新回滚；滚动更新不能自动回滚 仅能与同一pod的容器共享存储卷；可以和其他任何容器共享存储卷

### 94、什么是Container Orchestration（容器编排）?

意味着各个容器中的所有服务协同工作以满足单个服务器的需求

### 95、Container Orchestration需要什么?

| 组件/功能    | 描述                                                 |
| ------------ | ---------------------------------------------------- |
| 编排引擎     | 管理和调度容器的核心组件，负责实现自动化部署和伸缩   |
| 编排策略     | 决定容器如何分布、伸缩和调度的规则和算法             |
| 服务发现     | 动态发现和管理容器化应用程序中的服务和网络细节       |
| 负载均衡     | 将流量分发到不同的容器实例，确保应用程序高可用性     |
| 自动伸缩     | 根据应用程序负载和需求自动调整容器实例数量           |
| 健康检查     | 定期检查容器实例的健康状态，以确保高可用性           |
| 日志管理     | 收集、存储和管理容器产生的日志信息                   |
| 配置管理     | 管理应用程序配置的中心化系统，支持动态配置更新       |
| 安全性和权限 | 提供容器级别和集群级别的安全性和访问控制             |
| 存储编排     | 管理和调度容器中的数据存储，支持持久化和共享存储     |
| 版本控制     | 管理应用程序和容器镜像的版本，支持回滚和升级         |
| 跨节点通信   | 实现容器之间的通信，跨节点通信保障分布式应用正常运行 |
| 故障恢复     | 处理节点故障、容器故障，确保应用程序的高可用性       |

### 97、Kubernetes如何简化容器化部署?

由于典型应用程序将具有跨多个主机运行的容器集群，因此所有这些容器都需要相互通信。因此，要做到这一点，你需要一些能够负载平衡，扩展和监控容器的东西。由于Kubernetes与云无关并且可以在任何公共/私有提供商上运行，因此必须是您简化容器化部署的选择。

### 98、对Kubernetes的集群了解多少？

| 概念              | 描述                                                         |
| ----------------- | ------------------------------------------------------------ |
| Master节点        | Kubernetes集群的控制中心，负责整个集群的管理和控制。主要组件包括kube-apiserver、kube-controller-manager、kube-scheduler和etcd等。 |
| Node节点          | 集群中的工作节点，负责运行应用程序容器。每个Node节点上都运行有kubelet和kube-proxy，与Master节点协同工作。 |
| Pod               | Kubernetes中最小的部署单元，包含一个或多个容器。Pod共享网络和存储资源，它们在同一节点上运行，并可以直接通过localhost通信。 |
| Service           | 服务是一种抽象，定义了一组Pod及其访问方式。它确保了Pod的稳定网络标识和动态路由。 |
| Namespace         | 命名空间用于将集群划分为多个虚拟集群，每个命名空间中的资源相互隔离。 |
| ConfigMap和Secret | ConfigMap用于将配置数据提供给应用程序，而Secret用于存储敏感信息，如密码和API密钥。 |

### 99、什么是Google容器引擎?

Google Container Engine（GKE）是Docker容器和集群的开源管理平台。这个基于Kubernetes的引擎仅支持在Google的公共云服务中运行的群集。

### 100、什么是Heapster?

Heapster是由每个节点上运行的Kubelet提供的集群范围的数据聚合器。此容器管理工具在Kubernetes集群上本机支持，并作为pod运行，就像集群中的任何其他pod一样。因此，它基本上发现集群中的所有节点，并通过机上Kubernetes代理查询集群中Kubernetes节点的使用信息。

### 107、kube-apiserver和kube-scheduler的作用是什么?

kube-apiserver遵循横向扩展架构，是主节点控制面板的前端。这将公开Kubernetes主节点组件的所有API，并负责在Kubernetes节点和Kubernetes主组件之间建立通信。 kube-scheduler负责工作节点上工作负载的分配和管理。因此，它根据资源需求选择最合适的节点来运行未调度的pod，并跟踪资源利用率。它确保不在已满的节点上调度工作负载。

### 108、你能简要介绍一下Kubernetes控制管理器吗?

多个控制器进程在主节点上运行，但是一起编译为单个进程运行，即Kubernetes控制器管理器。因此，Controller Manager是一个嵌入控制器并执行命名空间创建和垃圾收集的守护程序。它拥有责任并与API服务器通信以管理端点。 常见控制器： - node controller - hpa controller - replication controller - service account & token controller - endpoints controller

### 112、什么是Ingress网络，它是如何工作的?

Ingress网络是一组规则，充当Kubernetes集群的入口点。这允许入站连接，可以将其配置为 通过可访问的URL，负载平衡流量或通过提供基于名称的虚拟主机从外部提供服务。因此， Ingress是一个API对象，通常通过HTTP管理集群中服务的外部访问，是暴露服务的最有效方 式。

现在，让我以一个例子向您解释Ingress网络的工作。

有2个节点具有带有Linux桥接器的pod和根网络命名空间。除此之外，还有一个名为 flannel0（网络插件）的新虚拟以太网设备被添加到根网络中。

现在，假设我们希望数据包从pod1流向pod 4。

因此，数据包将pod1的网络保留在eth0，并进入veth0的根网络。 然后它被传递给cbr0，这使得ARP请求找到目的地，并且发现该节点上没有人具有目的地IP地址。

因此，桥接器将数据包发送到flannel0，因为节点的路由表配置了flannel0。 现在，flannel守护程序与Kubernetes的API服务器通信，以了解所有pod IP及其各自的节 点，以创建pods IP到节点IP的映射。

网络插件将此数据包封装在UDP数据包中，其中额外的标头将源和目标IP更改为各自的节点， 并通过eth0发送此数据包。

现在，由于路由表已经知道如何在节点之间路由流量，因此它将数据包发送到目标节点2。 数据包到达node2的eth0并返回到flannel0以解封装并在根网络命名空间中将其发回。 同样，数据包被转发到Linux网桥以发出ARP请求以找出属于veth1的IP。 数据包最终穿过根网络并到达目标Pod4。

### 113、您对云控制器管理器有何了解?

Cloud Controller Manager负责持久存储，网络路由，从核心Kubernetes特定代码中抽象出特定于云的代码，以及管理与底层云服务的通信。它可能会分成几个不同的容器，具体取决于您运行的是哪个云平台，然后它可以使云供应商和Kubernetes代码在没有任何相互依赖的情况下开发。因此，云供应商开发他们的代码并在运行Kubernetes时与Kubernetes云控制器管理器连接。 - node controller - route controller - volume controller - service controller

### 114、什么是Container资源监控?

| 概念         | 描述                                                         |
| ------------ | ------------------------------------------------------------ |
| 容器资源监控 | 监控容器运行时的资源使用情况，包括CPU利用率、内存使用、网络IO等。用于性能分析、故障排查和资源优化。 |
| 监控指标     | 常见的容器监控指标包括CPU利用率、内存使用量、磁盘IO、网络IO、容器启动时间等。 |
| 监控工具     | 一些常用的容器监控工具包括Prometheus、Grafana、cAdvisor等。它们提供可视化和警报功能，帮助管理员实时监控和管理容器。 |
| 数据收集     | 监控工具通过在容器内运行代理或直接访问容器运行时API，收集实时的性能数据。 |
| 可视化和报警 | 容器监控工具通常提供仪表盘和报警功能，让管理员能够直观地查看容器集群的状态，并在发生异常时及时收到通知。 |

### 115、Replica Set和Replication Controller之间有什么区别?

Replica Set 和 Replication Controller几乎完全相同。它们都确保在任何给定时间运行指定数量的pod副本。不同之处在于复制pod使用的选择器。Replica Set使用基于集合的选择器，而Replication Controller使用基于权限的选择器。

### 117、使用Kubernetes时可以采取哪些最佳安全措施?

- 日志记录生产环境中的所有内容
- 定期对环境应用安全更新
- 实施网络分割
- 为资源制定严格的策略/规则
- 实施持续安全漏洞扫描
- 提供对 k8s 节点的有限直接访问
- 定义资源限制
- 使用私有镜像仓库
