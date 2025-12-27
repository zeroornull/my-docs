---
# dir:
#     text: Java全栈面试
#     icon: laptop-code
#     collapsible: true
#     expanded: true
#     link: true
#     index: true
title: MongoDB
index: true
toc:
  levels: 3
# icon: laptop-code
# sidebar: true
# toc: true
# editLink: false
---

### 8.4 MongoDB

#### 什么是MongoDB？为什么使用MongoDB？

MongoDB是面向文档的NoSQL数据库，用于大量数据存储。MongoDB是一个在2000年代中期问世的数据库。属于NoSQL数据库的类别。以下是一些为什么应该开始使用MongoDB的原因

- **面向文档的**–由于MongoDB是NoSQL类型的数据库，它不是以关系类型的格式存储数据，而是将数据存储在文档中。这使得MongoDB非常灵活，可以适应实际的业务环境和需求。
- **临时查询**-MongoDB支持按字段，范围查询和正则表达式搜索。可以查询返回文档中的特定字段。
- **索引**-可以创建索引以提高MongoDB中的搜索性能。MongoDB文档中的任何字段都可以建立索引。
- **复制**-MongoDB可以提供副本集的高可用性。副本集由两个或多个mongo数据库实例组成。每个副本集成员可以随时充当主副本或辅助副本的角色。主副本是与客户端交互并执行所有读/写操作的主服务器。辅助副本使用内置复制维护主数据的副本。当主副本发生故障时，副本集将自动切换到辅助副本，然后它将成为主服务器。
- **负载平衡**-MongoDB使用分片的概念，通过在多个MongoDB实例之间拆分数据来水平扩展。MongoDB可以在多台服务器上运行，以平衡负载或复制数据，以便在硬件出现故障时保持系统正常运行。

#### MongoDB与RDBMS区别？有哪些术语？

下表将帮助您更容易理解Mongo中的一些概念：

| SQL术语/概念 | MongoDB术语/概念 | 解释/说明                           |
| ------------ | ---------------- | ----------------------------------- |
| database     | database         | 数据库                              |
| table        | collection       | 数据库表/集合                       |
| row          | document         | 数据记录行/文档                     |
| column       | field            | 数据字段/域                         |
| index        | index            | 索引                                |
| table joins  |                  | 表连接,MongoDB不支持                |
| primary key  | primary key      | 主键,MongoDB自动将_id字段设置为主键 |

![img](https://b2files.173114.xyz/blogimg/2025/03/32a568e4993f0bd1ede3ce9d01035124.png)

#### MongoDB聚合的管道方式？

Aggregation Pipline： 类似于将SQL中的group by + order by + left join ... 等操作管道化。MongoDB的聚合管道（Pipline）将MongoDB文档在一个阶段（Stage）处理完毕后将结果传递给下一个阶段（Stage）处理。**阶段（Stage）操作是可以重复的**。

![img](https://b2files.173114.xyz/blogimg/2025/03/9114e6a177eee6586e17fe02f7d583f5.png)

#### MongoDB聚合的Map Reduce方式？

![img](https://b2files.173114.xyz/blogimg/2025/03/b4195cb0f25d70c832a3c65edfbb3e87.png)

#### Spring Data 和MongoDB集成？

![img](https://b2files.173114.xyz/blogimg/2025/03/868978a30d0360f61cc69a81fdab790b.png)

- 引入`mongodb-driver`, 使用最原生的方式通过Java调用mongodb提供的Java driver;

- 引入

  ```
  spring-data-mongo
  ```

  , 自行配置使用spring data 提供的对MongoDB的封装

  - 使用`MongoTemplate` 的方式
  - 使用`MongoRespository` 的方式

- 引入`spring-data-mongo-starter`, 采用spring autoconfig机制自动装配，然后再使用`MongoTemplate`或者`MongoRespository`方式。

#### MongoDB 有哪几种存储引擎？

MongoDB一共提供了三种存储引擎：WiredTiger，MMAPV1和In Memory；在MongoDB3.2之前采用的是MMAPV1; 后续版本v3.2开始默认采用WiredTiger； 且在v4.2版本中移除了MMAPV1的引擎。

#### 谈谈你对MongoDB WT存储引擎的理解？

从几个方面回答，比如：

- **插件式存储引擎架构**

实现了Server层和存储引擎层的解耦，可以支持多种存储引擎，如MySQL既可以支持B-Tree结构的InnoDB存储引擎，还可以支持LSM结构的RocksDB存储引擎。

- **B-Tree + Page**

![img](https://b2files.173114.xyz/blogimg/2025/03/f884633be57807bb9eabc1e25e138e47.jpg)

上图是WiredTiger在内存里面的大概布局图，通过它我们可梳理清楚存储引擎是如何将数据加载到内存，然后如何通过相应数据结构来支持查询、插入、修改操作的。

内存里面B-Tree包含三种类型的page，即rootpage、internal page和leaf page，前两者包含指向其子页的page index指针，不包含集合中的真正数据，leaf page包含集合中的真正数据即keys/values和指向父页的home指针；

- **为什么是Page**？

数据以page为单位加载到cache、cache里面又会生成各种不同类型的page及为不同类型的page分配不同大小的内存、eviction触发机制和reconcile动作都发生在page上、page大小持续增加时会被分割成多个小page，所有这些操作都是围绕一个page来完成的。

Page的典型生命周期如下图所示：

![img](https://b2files.173114.xyz/blogimg/2025/03/33db414746d69a994c93958e5d4b934b.png)

- **什么是CheckPoint**?

本质上来说，Checkpoint相当于一个日志，记录了上次Checkpoint后相关数据文件的变化。作用： 一是将内存里面发生修改的数据写到数据文件进行持久化保存，确保数据一致性； 二是实现数据库在某个时刻意外发生故障，再次启动时，缩短数据库的恢复时间，WiredTiger存储引擎中的Checkpoint模块就是来实现这个功能的。

一个Checkpoint包含关键信息如下图所示：

![img](https://b2files.173114.xyz/blogimg/2025/03/dac09d58791be7db88b08fd1bbcb79e6.png)

每个checkpoint包含一个root page、三个指向磁盘具体位置上pages的列表以及磁盘上文件的大小。

- **如何理解WT事务机制**？

要了解实现先要知道它的事务的构造和使用相关的技术，WT在实现事务的时使用主要是使用了三个技术：**snapshot(事务快照)**、**MVCC (多版本并发控制)\**和\**redo log(重做日志)**，为了实现这三个技术，它还定义了一个基于这三个技术的事务对象和**全局事务管理器**。

- **如何理解WT缓存淘汰**？

eviction cache是一个LRU cache，即页面置换算法缓冲区，它对数据页采用的是**分段局部扫描和淘汰**，而不是对内存中所有的数据页做全局管理。基本思路是一个线程阶段性的去扫描各个btree，并把btree可以进行淘汰的数据页添加到一个lru queue中，当queue填满了后记录下这个过程当前的btree对象和btree的位置（这个位置是为了作为下次阶段性扫描位置）,然后对queue中的数据页按照访问热度排序，最后各个淘汰线程按照淘汰优先级淘汰queue中的数据页，整个过程是周期性重复。WT的这个evict过程涉及到多个eviction thread和hazard pointer技术。

**WT的evict过程都是以page为单位做淘汰，而不是以K/V。这一点和memcache、redis等常用的缓存LRU不太一样，因为在磁盘上数据的最小描述单位是page block，而不是记录**。

#### MongoDB为什么要引入复制集？有哪些成员？

- **什么是复制集**？

保证数据在生产部署时的**冗余和可靠性**，通过在不同的机器上保存副本来保证数据的不会因为单点损坏而丢失。能够随时应对数据丢失、机器损坏带来的风险。换一句话来说，还能提高读取能力，用户的读取服务器和写入服务器在不同的地方，而且，由不同的服务器为不同的用户提供服务，提高整个系统的负载。

在**MongoDB中就是复制集（replica set)**： 一组复制集就是一组mongod实例掌管同一个数据集，实例可以在不同的机器上面。实例中包含一个主导，接受客户端所有的写入操作，其他都是副本实例，从主服务器上获得数据并保持同步。

![img](https://b2files.173114.xyz/blogimg/2025/03/cd19cc58536cba58c4bda0662f629b48.png)

- 基本的成员

  ?

  - 主节点（Primary）

     

    包含了所有的写操作的日志。但是副本服务器集群包含有所有的主服务器数据，因此当主服务器挂掉了，就会在副本服务器上重新选取一个成为主服务器。MongoDB还细化将从节点（Primary）进行了细化

    - **Priority0** Priority0节点的选举优先级为0，不会被选举为Primary

    - Hidden

       

      隐藏节点将不会收到来自应用程序的请求, 可使用Hidden节点做一些数据备份、离线计算的任务，不会影响复制集的服务

      - **Delayed** Delayed节点必须是Hidden节点，并且其数据落后与Primary一段时间（可配置，比如1个小时）；当错误或者无效的数据写入Primary时，可通过Delayed节点的数据来恢复到之前的时间点。

  - **从节点（Seconary）** 正常情况下，复制集的Seconary会参与Primary选举（自身也可能会被选为Primary），并从Primary同步最新写入的数据，以保证与Primary存储相同的数据；增加Secondary节点可以提供复制集的读服务能力，同时提升复制集的可用性。

  - **仲裁节点（Arbiter）** Arbiter节点只参与投票，不能被选为Primary，并且不从Primary同步数据。比如你部署了一个2个节点的复制集，1个Primary，1个Secondary，任意节点宕机，复制集将不能提供服务了（无法选出Primary），这时可以给复制集添加一个Arbiter节点，即使有节点宕机，仍能选出Primary。

#### MongoDB复制集常见部署架构？

分别从三节点的单数据中心，和五节点的多数据中心来说：

三节点的单数据中心

- 三节点：一主两从方式
  - 一个主节点；
  - 两个从节点组成，主节点宕机时，这两个从节点都可以被选为主节点。

![img](https://b2files.173114.xyz/blogimg/2025/03/1a5de712b3aac2196c2c2e5d6c7e4057.png)

当主节点宕机后,两个从节点都会进行竞选，其中一个变为主节点，当原主节点恢复后，作为从节点加入当前的复制集群即可。

![img](https://b2files.173114.xyz/blogimg/2025/03/65707760a943b8bbd12dbc6dbb9be47b.png)

- 一主一从一仲裁方式
  - 一个主节点
  - 一个从节点，可以在选举中成为主节点
  - 一个仲裁节点，在选举中，只进行投票，不能成为主节点

![img](https://b2files.173114.xyz/blogimg/2025/03/30ffa87cd6ff43eb45428d80b995475d.png)

当主节点宕机时，将会选择从节点成为主，主节点修复后，将其加入到现有的复制集群中即可。

![img](https://b2files.173114.xyz/blogimg/2025/03/3f24548327012e21d10f139b80c9c927.png)

对于具有5个成员的复制集，成员的一些可能的分布包括（相关注意事项和三个节点一致，这里仅展示分布方案）：

- 两个数据中心

  ：数据中心1的三个成员和数据中心2的两个成员。

  - 如果数据中心1发生故障，则复制集将变为只读。
  - 如果数据中心2发生故障，则复制集将保持可写状态，因为数据中心1中的成员可以创建多数。

- 三个数据中心

  ：两个成员是数据中心1，两个成员是数据中心2，一个成员是站点数据中心3。

  - 如果任何数据中心发生故障，复制集将保持可写状态，因为其余成员可以举行选举。

例如，以下5个成员复制集将其成员分布在三个数据中心中。

![img](https://b2files.173114.xyz/blogimg/2025/03/a89a2286eb8fb34d0fa33280929eb48c.png)

#### MongoDB复制集是如何保证数据高可用的？

通过两方面阐述：一个是选举机制，另一个是故障转移期间的回滚。

- **如何选出Primary主节点的?**

假设复制集内**能够投票的成员**数量为N，则大多数为 N/2 + 1，当复制集内存活成员数量不足大多数时，整个复制集将**无法选举出Primary，复制集将无法提供写服务，处于只读状态**。

举例：3投票节点需要2个节点的赞成票，容忍选举失败次数为1；5投票节点需要3个节点的赞成票，容忍选举失败次数为2；通常投票节点为奇数，这样可以减少选举失败的概率。

在以下的情况将触发选举机制：

1. 往复制集中新加入节点
2. 初始化复制集时
3. 对复制集进行维护时，比如`rs.stepDown()`或者`rs.reconfig()`操作时
4. 从节点失联时，比如超时（默认是10秒）

- **故障转移期间的回滚**

当成员在故障转移后重新加入其复制集时，回滚将还原以前的主在数据库上的写操作。 **本质上就是保证数据的一致性**。

仅当主服务器接受了在主服务器降级之前辅助服务器未成功复制的写操作时，才需要回滚。 当主数据库作为辅助数据库重新加入集合时，它会还原或“回滚”其写入操作，以保持数据库与其他成员的一致性。

#### MongoDB复制集如何同步数据？

复制集中的数据同步是为了维护共享数据集的最新副本，包括复制集的辅助成员同步或复制其他成员的数据。 MongoDB使用两种形式的数据同步：

- 初始同步(Initial Sync)

   

  以使用完整的数据集填充新成员, 即

  全量同步

  - 新节点加入，无任何oplog，此时需先进性initial sync
  - initial sync开始时，会主动将_initialSyncFlag字段设置为true，正常结束后再设置为false；如果节点重启时，发现_initialSyncFlag为true，说明上次全量同步中途失败了，此时应该重新进行initial sync
  - 当用户发送resync命令时，initialSyncRequested会设置为true，此时会重新开始一次initial sync

- 复制(Replication)

   

  以将正在进行的更改应用于整个数据集, 即

  增量同步

  - initial sync结束后，接下来Secondary就会『不断拉取主上新产生的optlog并重放』

#### MongoDB为什么要引入分片？

高数据量和吞吐量的数据库应用会对单机的性能造成较大压力, 大的查询量会将单机的CPU耗尽, 大的数据量对单机的存储压力较大, 最终会耗尽系统的内存而将压力转移到磁盘IO上。

为了解决这些问题, 有两个基本的方法: 垂直扩展和水平扩展。

- 垂直扩展：增加更多的CPU和存储资源来扩展容量。
- 水平扩展：将数据集分布在多个服务器上。**MongoDB的分片就是水平扩展的体现**。

**分片设计思想**

分片为应对高吞吐量与大数据量提供了方法。使用分片减少了每个分片需要处理的请求数，因此，通过水平扩展，集群可以提高自己的存储容量和吞吐量。举例来说，当插入一条数据时，应用只需要访问存储这条数据的分片.

**分片目的**

- 读/写能力提升
- 存储容量扩容
- 高可用性

#### MongoDB分片集群的结构？

一个MongoDB的分片集群包含如下组件：

- `shard`: 即分片，真正的数据存储位置，以chunk为单位存数据；每个分片可以部署为一个复制集。
- `mongos`: 查询的路由, 提供客户端和分片集群之间的接口。
- `config servers`: 存储元数据和配置数据。

![img](https://b2files.173114.xyz/blogimg/2025/03/19191ca45c3308222fd9631e855e1b00.png)

这里要注意mongos提供的是客户端application与MongoDB分片集群的路由功能，这里分片集群包含了分片的collection和非分片的collection。如下展示了通过路由访问分片的collection和非分片的collection:

![img](https://b2files.173114.xyz/blogimg/2025/03/79e40b2612bb98c7923559b46f98d5f1.png)

#### MongoDB分片的内部是如何管理数据的呢？

在一个shard server内部，MongoDB还是会**把数据分为chunks**，每个chunk代表这个shard server内部一部分数据。chunk的产生，会有以下两个用途：

- `Splitting`：当一个chunk的大小超过配置中的chunk size时，MongoDB的后台进程会把这个chunk切分成更小的chunk，从而避免chunk过大的情况
- `Balancing`：在MongoDB中，balancer是一个后台进程，负责chunk的迁移，从而均衡各个shard server的负载，系统初始1个chunk，chunk size默认值64M,生产库上选择适合业务的chunk size是最好的。MongoDB会自动拆分和迁移chunks。

分片集群的数据分布（shard节点）

- 使用chunk来存储数据
- 进群搭建完成之后，默认开启一个chunk，大小是64M，
- 存储需求超过64M，chunk会进行分裂，如果单位时间存储需求很大，设置更大的chunk
- chunk会被自动均衡迁移。

**chunk分裂及迁移**

随着数据的增长，其中的数据大小超过了配置的chunk size，默认是64M，则这个chunk就会分裂成两个。数据的增长会让chunk分裂得越来越多。

![img](https://b2files.173114.xyz/blogimg/2025/03/b5187e05693b984aa8e5051474393cb1.png)

这时候，各个shard 上的chunk数量就会不平衡。这时候，mongos中的一个组件balancer 就会执行自动平衡。把chunk从chunk数量最多的shard节点挪动到数量最少的节点。

![img](https://b2files.173114.xyz/blogimg/2025/03/0c436abeeb12087f7596d92f9dbf58ba.png)

#### MongoDB 中Collection的数据是根据什么进行分片的呢？

MongoDB 中Collection的数据是根据什么进行分片的呢？这就是我们要介绍的**分片键（Shard key）**；那么又是采用过了什么算法进行分片的呢？这就是紧接着要介绍的**范围分片（range sharding）\**和\**哈希分片（Hash Sharding)**。

- **哈希分片（Hash Sharding)**

分片过程中利用哈希索引作为分片，基于哈希片键最大的好处就是保证数据在各个节点分布基本均匀。

对于基于哈希的分片，MongoDB计算一个字段的哈希值，并用这个哈希值来创建数据块。在使用基于哈希分片的系统中，拥有**相近分片键**的文档很可能不会存储在同一个数据块中，因此数据的分离性更好一些。

![img](https://b2files.173114.xyz/blogimg/2025/03/c29111c00d1a264a197d91cc735c0aa8.png)

- **范围分片（range sharding）**

将单个Collection的数据分散存储在多个shard上，用户可以指定根据集合内文档的某个字段即shard key来进行范围分片（range sharding）。

对于基于范围的分片，MongoDB按照片键的范围把数据分成不同部分:

![img](https://b2files.173114.xyz/blogimg/2025/03/da6cdf87e3b647f5019b07b595b1251c.png)

在使用片键做范围划分的系统中，拥有**相近分片键**的文档很可能存储在同一个数据块中，因此也会存储在同一个分片中。

- **哈希和范围的结合**

如下是基于X索引字段进行范围分片，但是随着X的增长，大于20的数据全部进入了Chunk C, 这导致了数据的不均衡。 ![img](https://b2files.173114.xyz/blogimg/2025/03/b784c38e1dd17983f6855a1750e805d5.png)

这时对X索引字段建哈希索引：

![img](https://b2files.173114.xyz/blogimg/2025/03/239a915d914ea4e3f4de585e8c303b32.png)

#### MongoDB如何做备份恢复？

- JSON格式：mongoexport/mongoimport

JSON可读性强但体积较大，JSON虽然具有较好的跨版本通用性，但其只保留了数据部分，不保留索引，账户等其他基础信息。

- BSON格式：mongoexport/mongoimport

BSON则是二进制文件，体积小但对人类几乎没有可读性。

#### MongoDB如何设计文档模型？

举几个例子：

- **多态模式**

当集合中的所有文档都具有**相似但不相同的结构**时，我们将其称为多态模式； 比如运动员的运动记录：

![img](https://b2files.173114.xyz/blogimg/2025/03/fb5e4ad4fd03c8efe178bc8449429129.png)

![img](https://b2files.173114.xyz/blogimg/2025/03/3f5d540e055ace46a86b7084b6ba20bf.gif)

- **属性模式**

出于性能原因考虑，为了优化搜索我们可能需要许多索引以照顾到所有子集。创建所有这些索引可能会降低性能。属性模式为这种情况提供了一个很好的解决方案。

假设现在有一个关于电影的集合。其中所有文档中可能都有类似的字段：标题、导演、制片人、演员等等。假如我们希望在上映日期这个字段进行搜索，这时面临的挑战是“哪个上映日期”？在不同的国家，电影通常在不同的日期上映。

```json
{
    title: "Star Wars",
    director: "George Lucas",
    ...
    release_US: ISODate("1977-05-20T01:00:00+01:00"),
    release_France: ISODate("1977-10-19T01:00:00+01:00"),
    release_Italy: ISODate("1977-10-20T01:00:00+01:00"),
    release_UK: ISODate("1977-12-27T01:00:00+01:00"),
    ...
}
```

使用属性模式，我们可以将此信息移至数组中并减少对索引需求。我们将这些信息转换成一个包含键值对的数组：

```json
{
    title: "Star Wars",
    director: "George Lucas",
    …
    releases: [
        {
        location: "USA",
        date: ISODate("1977-05-20T01:00:00+01:00")
        },
        {
        location: "France",
        date: ISODate("1977-10-19T01:00:00+01:00")
        },
        {
        location: "Italy",
        date: ISODate("1977-10-20T01:00:00+01:00")
        },
        {
        location: "UK",
        date: ISODate("1977-12-27T01:00:00+01:00")
        },
        … 
    ],
    … 
}
```

- **桶模式**

这种模式在处理物联网（IOT）、实时分析或通用时间序列数据时特别有效。通过将数据放在一起，我们可以更容易地将数据组织成特定的组，提高发现历史趋势或提供未来预测的能力，同时还能对存储进行优化。

随着数据在一段时间内持续流入（时间序列数据），我们可能倾向于将每个测量值存储在自己的文档中。然而，这种倾向是一种非常偏向于关系型数据处理的方式。如果我们有一个传感器每分钟测量温度并将其保存到数据库中，我们的数据流可能看起来像这样：

```json
{
   sensor_id: 12345,
   timestamp: ISODate("2019-01-31T10:00:00.000Z"),
   temperature: 40
}

{
   sensor_id: 12345,
   timestamp: ISODate("2019-01-31T10:01:00.000Z"),
   temperature: 40
}

{
   sensor_id: 12345,
   timestamp: ISODate("2019-01-31T10:02:00.000Z"),
   temperature: 41
}
```

通过将桶模式应用于数据模型，我们可以在节省索引大小、简化潜在的查询以及在文档中使用预聚合数据的能力等方面获得一些收益。获取上面的数据流并对其应用桶模式，我们可以得到：

```json
{
    sensor_id: 12345,
    start_date: ISODate("2019-01-31T10:00:00.000Z"),
    end_date: ISODate("2019-01-31T10:59:59.000Z"),
    measurements: [
       {
       timestamp: ISODate("2019-01-31T10:00:00.000Z"),
       temperature: 40
       },
       {
       timestamp: ISODate("2019-01-31T10:01:00.000Z"),
       temperature: 40
       },
       … 
       {
       timestamp: ISODate("2019-01-31T10:42:00.000Z"),
       temperature: 42
       }
    ],
   transaction_count: 42,
   sum_temperature: 2413
}
```

#### MongoDB如何进行性能优化？

- **慢查询**

为了定位查询，需要查看当前mongo profile的级别, profile的级别有0|1|2，分别代表意思: 0代表关闭，1代表记录慢命令，2代表全部

```json
db.getProfilingLevel()
```

显示为0， 表示默认下是没有记录的。

设置profile级别，设置为记录慢查询模式, 所有超过1000ms的查询语句都会被记录下来

```json
db.setProfilingLevel(1, 1000)
```
