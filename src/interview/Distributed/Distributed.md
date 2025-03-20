---
# dir:
#     text: Java全栈面试
#     icon: laptop-code
#     collapsible: true
#     expanded: true
#     link: true
#     index: true
title: 分布式
index: true
headerDepth: 3
# icon: laptop-code
# sidebar: true
# toc: true
# editLink: false
---

## 13 分布式

> 分布式相关。

### 13.1 一致性算法

#### 什么是分布式系统的副本一致性？有哪些？

分布式系统通过副本控制协议，使得从系统外部读取系统内部各个副本的数据在一定的约束条件下相同，称之为副本一致性(consistency)。副本一致性是针对分布式系统而言的，不是针对某一个副本而言。

**强一致性(strong consistency)**：任何时刻任何用户或节点都可以读到最近一次成功更新的副本数据。强一致性是程度最高的一致性要求，也是实践中最难以实现的一致性。

**单调一致性(monotonic consistency)**：任何时刻，任何用户一旦读到某个数据在某次更新后的值，这个用户不会再读到比这个值更旧的值。单调一致性是弱于强一致性却非常实用的一种一致性级别。因为通常来说，用户只关心从己方视角观察到的一致性，而不会关注其他用户的一致性情况。

**会话一致性(session consistency)**：任何用户在某一次会话内一旦读到某个数据在某次更新后的值，这个用户在这次会话过程中不会再读到比这个值更旧的值。会话一致性通过引入会话的概念，在单调一致性的基础上进一步放松约束，会话一致性只保证单个用户单次会话内数据的单调修改，对于不同用户间的一致性和同一用户不同会话间的一致性没有保障。实践中有许多机制正好对应会话的概念，例如php 中的session 概念。

**最终一致性(eventual consistency)**：最终一致性要求一旦更新成功，各个副本上的数据最终将达 到完全一致的状态，但达到完全一致状态所需要的时间不能保障。对于最终一致性系统而言，一个用户只要始终读取某一个副本的数据，则可以实现类似单调一致性的效果，但一旦用户更换读取的副本，则无法保障任何一致性。

**弱一致性(week consistency)**：一旦某个更新成功，用户无法在一个确定时间内读到这次更新的值，且即使在某个副本上读到了新的值，也不能保证在其他副本上可以读到新的值。弱一致性系统一般很难在实际中使用，使用弱一致性系统需要应用方做更多的工作从而使得系统可用。

#### 在分布式系统中有哪些常见的一致性算法？

- 分布式算法 - 一致性Hash算法
  - 一致性Hash算法是个经典算法，Hash环的引入是为解决`单调性(Monotonicity)`的问题；虚拟节点的引入是为了解决`平衡性(Balance)`问题
- 分布式算法 - Paxos算法
  - Paxos算法是Lamport宗师提出的一种基于消息传递的分布式一致性算法，使其获得2013年图灵奖。自Paxos问世以来就持续垄断了分布式一致性算法，Paxos这个名词几乎等同于分布式一致性, 很多分布式一致性算法都由Paxos演变而来
- 分布式算法 - Raft算法
  - Paxos是出了名的难懂，而Raft正是为了探索一种更易于理解的一致性算法而产生的。它的首要设计目的就是易于理解，所以在选主的冲突处理等方式上它都选择了非常简单明了的解决方案
- 分布式算法 - ZAB算法
  - ZAB 协议全称：Zookeeper Atomic Broadcast（Zookeeper 原子广播协议）, 它应该是所有一致性协议中生产环境中应用最多的了。为什么呢？因为他是为 Zookeeper 设计的分布式一致性协议！

#### 谈谈你对一致性hash算法的理解？

判定哈希算法好坏的四个定义:

- `平衡性(Balance)`: 平衡性是指哈希的结果能够尽可能分布到所有的缓冲中去，这样可以使得所有的缓冲空间都得到利用。很多哈希算法都能够满足这一条件。
- `单调性(Monotonicity)`: 单调性是指如果已经有一些内容通过哈希分派到了相应的缓冲中，又有新的缓冲加入到系统中。哈希的结果应能够保证原有已分配的内容可以被映射到原有的或者新的缓冲中去，而不会被映射到旧的缓冲集合中的其他缓冲区。
- `分散性(Spread)`: 在分布式环境中，终端有可能看不到所有的缓冲，而是只能看到其中的一部分。当终端希望通过哈希过程将内容映射到缓冲上时，由于不同终端所见的缓冲范围有可能不同，从而导致哈希的结果不一致，最终的结果是相同的内容被不同的终端映射到不同的缓冲区中。这种情况显然是应该避免的，因为它导致相同内容被存储到不同缓冲中去，降低了系统存储的效率。分散性的定义就是上述情况发生的严重程度。好的哈希算法应能够尽量避免不一致的情况发生，也就是尽量降低分散性。
- `负载(Load)`: 负载问题实际上是从另一个角度看待分散性问题。既然不同的终端可能将相同的内容映射到不同的缓冲区中，那么对于一个特定的缓冲区而言，也可能被不同的用户映射为不同 的内容。与分散性一样，这种情况也是应当避免的，因此好的哈希算法应能够尽量降低缓冲的负荷。

![img](https://b2files.173114.xyz/blogimg/2025/03/49c24aaf787351e522ca62bf136c0f12.jpg)

#### 什么是Paxos算法？ 如何实现的？

Paxos算法是Lamport宗师提出的一种基于消息传递的分布式一致性算法，使其获得2013年图灵奖。

- **三个角色**？ 可以理解为人大代表(Proposer)在人大向其它代表(Acceptors)提案，通过后让老百姓(Learner)落实

Paxos将系统中的角色分为`提议者 (Proposer)`，`决策者 (Acceptor)`，和`最终决策学习者 (Learner)`:

1. `Proposer`: 提出提案 (Proposal)。Proposal信息包括提案编号 (Proposal ID) 和提议的值 (Value)。
2. `Acceptor`: 参与决策，回应Proposers的提案。收到Proposal后可以接受提案，若Proposal获得多数Acceptors的接受，则称该Proposal被批准。
3. `Learner`: 不参与决策，从Proposers/Acceptors学习最新达成一致的提案(Value)。

在多副本状态机中，每个副本同时具有Proposer、Acceptor、Learner三种角色。

![img](https://pdai.tech/images/alg/alg-dst-paxos-1.jpg)

- **基于消息传递的3个阶段**

![img](https://pdai.tech/images/alg/alg-dst-paxos-2.jpg)

1. 第一阶段: Prepare阶段

   ；Proposer向Acceptors发出Prepare请求，Acceptors针对收到的Prepare请求进行Promise承诺。

   1. `Prepare`: Proposer生成全局唯一且递增的Proposal ID (可使用时间戳加Server ID)，向所有Acceptors发送Prepare请求，这里无需携带提案内容，只携带Proposal ID即可。

   2. ```
      Promise
      ```

      : Acceptors收到Prepare请求后，做出“两个承诺，一个应答”。

      1. 承诺1: 不再接受Proposal ID小于等于(注意: 这里是<= )当前请求的Prepare请求;
      2. 承诺2: 不再接受Proposal ID小于(注意: 这里是< )当前请求的Propose请求;
      3. 应答: 不违背以前作出的承诺下，回复已经Accept过的提案中Proposal ID最大的那个提案的Value和Proposal ID，没有则返回空值。

2. 第二阶段: Accept阶段

   ; Proposer收到多数Acceptors承诺的Promise后，向Acceptors发出Propose请求，Acceptors针对收到的Propose请求进行Accept处理。

   1. `Propose`: Proposer 收到多数Acceptors的Promise应答后，从应答中选择Proposal ID最大的提案的Value，作为本次要发起的提案。如果所有应答的提案Value均为空值，则可以自己随意决定提案Value。然后携带当前Proposal ID，向所有Acceptors发送Propose请求。
   2. `Accept`: Acceptor收到Propose请求后，在不违背自己之前作出的承诺下，接受并持久化当前Proposal ID和提案Value。

3. **第三阶段: Learn阶段**; Proposer在收到多数Acceptors的Accept之后，标志着本次Accept成功，决议形成，将形成的决议发送给所有Learners。

#### 什么是Raft算法？

**不同于Paxos算法直接从分布式一致性问题出发推导出来，Raft算法则是从多副本状态机的角度提出**。Raft实现了和Paxos相同的功能，它将一致性分解为多个子问题: Leader选举(Leader election)、日志同步(Log replication)、安全性(Safety)、日志压缩(Log compaction)、成员变更(Membership change)等。同时，**Raft算法使用了更强的假设来减少了需要考虑的状态，使之变的易于理解和实现**。

- **三个角色**

Raft将系统中的角色分为`领导者(Leader)`、`跟从者(Follower)`和`候选人(Candidate)`:

1. `Leader`: 接受客户端请求，并向Follower同步请求日志，当日志同步到大多数节点上后告诉Follower提交日志。
2. `Follower`: 接受并持久化Leader同步的日志，在Leader告之日志可以提交之后，提交日志。
3. `Candidate`: Leader选举过程中的临时角色。

![img](https://pdai.tech/images/alg/alg-dst-raft-1.jpg)

Raft要求系统在任意时刻最多只有一个Leader，正常工作期间只有Leader和Followers。

- **以子问题Leader选举为例**?

Raft 使用心跳(heartbeat)触发Leader选举。当服务器启动时，初始化为Follower。Leader向所有Followers周期性发送heartbeat。如果Follower在选举超时时间内没有收到Leader的heartbeat，就会等待一段随机的时间后发起一次Leader选举。

Follower将其当前term加一然后转换为Candidate。它首先给自己投票并且给集群中的其他服务器发送 RequestVote RPC (RPC细节参见八、Raft算法总结)。结果有以下三种情况:

- 赢得了多数的选票，成功选举为Leader；
- 收到了Leader的消息，表示有其它服务器已经抢先当选了Leader；
- 没有服务器赢得多数的选票，Leader选举失败，等待选举时间超时后发起下一次选举。

![img](https://b2files.173114.xyz/blogimg/2025/03/a9408793acc22b2902872c8ce9a58752.jpg)

选举出Leader后，Leader通过定期向所有Followers发送心跳信息维持其统治。若Follower一段时间未收到Leader的心跳则认为Leader可能已经挂了，再次发起Leader选举过程。

### 13.2 全局唯一ID

#### 全局唯一ID有哪些实现方案？

常见的分布式ID生成方式，大致分类的话可以分为两类：

1. **一种是类DB型的**，根据设置不同起始值和步长来实现趋势递增，需要考虑服务的容错性和可用性;
2. **另一种是类snowflake型**，这种就是将64位划分为不同的段，每段代表不同的涵义，基本就是时间戳、机器ID和序列数。这种方案就是需要考虑时钟回拨的问题以及做一些 buffer的缓冲设计提高性能。

#### 数据库方式实现方案？有什么缺陷？

- **MySQL为例**

我们将分布式系统中数据库的同一个业务表的自增ID设计成不一样的起始值，然后设置固定的步长，步长的值即为分库的数量或分表的数量。

以MySQL举例，利用给字段设置`auto_increment_increment`和`auto_increment_offset`来保证ID自增。

1. `auto_increment_offset`：表示自增长字段从那个数开始，他的取值范围是1 .. 65535。
2. `auto_increment_increment`：表示自增长字段每次递增的量，其默认值是1，取值范围是1 .. 65535。

缺点也很明显，首先它**强依赖DB**，当DB异常时整个系统不可用。虽然配置主从复制可以尽可能的增加可用性，但是**数据一致性在特殊情况下难以保证**。主从切换时的不一致可能会导致重复发号。还有就是**ID发号性能瓶颈限制在单台MySQL的读写性能**。

- **使用redis实现**

Redis实现分布式唯一ID主要是通过提供像 `INCR` 和 `INCRBY` 这样的自增原子命令，由于Redis自身的单线程的特点所以能保证生成的 ID 肯定是唯一有序的。

但是单机存在性能瓶颈，无法满足高并发的业务需求，所以可以采用集群的方式来实现。集群的方式又会涉及到和数据库集群同样的问题，所以也需要设置分段和步长来实现。

为了避免长期自增后数字过大可以通过与当前时间戳组合起来使用，另外为了保证并发和业务多线程的问题可以采用 Redis + Lua的方式进行编码，保证安全。

Redis 实现分布式全局唯一ID，它的性能比较高，生成的数据是有序的，对排序业务有利，但是同样它依赖于redis，**需要系统引进redis组件，增加了系统的配置复杂性**。

当然现在Redis的使用性很普遍，所以如果其他业务已经引进了Redis集群，则可以资源利用考虑使用Redis来实现。

#### 雪花算法如何实现的？

Snowflake，雪花算法是由Twitter开源的分布式ID生成算法，以划分命名空间的方式将 64-bit位分割成多个部分，每个部分代表不同的含义。而 Java中64bit的整数是Long类型，所以在 Java 中 SnowFlake 算法生成的 ID 就是 long 来存储的。

- **第1位**占用1bit，其值始终是0，可看做是符号位不使用。
- **第2位**开始的41位是时间戳，41-bit位可表示2^41个数，每个数代表毫秒，那么雪花算法可用的时间年限是`(1L<<41)/(1000L360024*365)`=69 年的时间。
- **中间的10-bit位**可表示机器数，即2^10 = 1024台机器，但是一般情况下我们不会部署这么台机器。如果我们对IDC（互联网数据中心）有需求，还可以将 10-bit 分 5-bit 给 IDC，分5-bit给工作机器。这样就可以表示32个IDC，每个IDC下可以有32台机器，具体的划分可以根据自身需求定义。
- **最后12-bit位**是自增序列，可表示2^12 = 4096个数。

这样的划分之后相当于**在一毫秒一个数据中心的一台机器上可产生4096个有序的不重复的ID**。但是我们 IDC 和机器数肯定不止一个，所以毫秒内能生成的有序ID数是翻倍的。

![img](https://b2files.173114.xyz/blogimg/2025/03/f229cc88350eba111e5391a1222afdb2.png)

#### 雪花算法有什么问题？有哪些解决思路？

- **有哪些问题**？

1. 时钟回拨问题；
2. 趋势递增，而不是绝对递增；
3. 不能在一台服务器上部署多个分布式ID服务；

- **如何解决时钟回拨**？

以百度的UidGenerator为例，CachedUidGenerator方式主要通过采取如下一些措施和方案规避了时钟回拨问题和增强唯一性：

1. **自增列**：UidGenerator的workerId在实例每次重启时初始化，且就是数据库的自增ID，从而完美的实现每个实例获取到的workerId不会有任何冲突。
2. **RingBuffer**：UidGenerator不再在每次取ID时都实时计算分布式ID，而是利用RingBuffer数据结构预先生成若干个分布式ID并保存。
3. **时间递增**：传统的雪花算法实现都是通过System.currentTimeMillis()来获取时间并与上一次时间进行比较，这样的实现严重依赖服务器的时间。而UidGenerator的时间类型是AtomicLong，且通过incrementAndGet()方法获取下一次的时间，从而脱离了对服务器时间的依赖，也就不会有时钟回拨的问题

（这种做法也有一个小问题，即分布式ID中的时间信息可能并不是这个ID真正产生的时间点，例如：获取的某分布式ID的值为3200169789968523265，它的反解析结果为{"timestamp":"2019-05-02 23:26:39","workerId":"21","sequence":"1"}，但是这个ID可能并不是在"2019-05-02 23:26:39"这个时间产生的）。

### 13.3 分布式锁

#### 有哪些方案实现分布式锁？

综合讲讲方案：

- 使用场景
  - 需要保证一个方法在同一时间内只能被同一个线程执行
- 实现方式:
  - 加锁和解锁
- 方案,考虑因素(性能,稳定,实现难度,死锁)
  - 基于数据库做分布式锁--乐观锁(基于版本号)和悲观锁(基于排它锁)
  - 基于 redis 做分布式锁:setnx(key,当前时间+过期时间)和Redlock机制
  - 基于 zookeeper 做分布式锁:临时有序节点来实现的分布式锁,Curator
  - 基于 Consul 做分布式锁

#### 基于数据库如何实现分布式锁？有什么缺陷？

- **基于数据库表**（锁表，很少使用）

最简单的方式可能就是直接创建一张锁表，然后通过操作该表中的数据来实现了。当我们想要获得锁的时候，就可以在该表中增加一条记录，想要释放锁的时候就删除这条记录。

为了更好的演示，我们先创建一张数据库表，参考如下：

```sql
CREATE TABLE database_lock (
	`id` BIGINT NOT NULL AUTO_INCREMENT,
	`resource` int NOT NULL COMMENT '锁定的资源',
	`description` varchar(1024) NOT NULL DEFAULT "" COMMENT '描述',
	PRIMARY KEY (id),
	UNIQUE KEY uiq_idx_resource (resource)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='数据库分布式锁表';
```

当我们想要获得锁时，可以插入一条数据：

```sql
INSERT INTO database_lock(resource, description) VALUES (1, 'lock');
```

当需要释放锁的时，可以删除这条数据：

```sql
DELETE FROM database_lock WHERE resource=1;
```

- **基于悲观锁**

**悲观锁实现思路**？

1. 在对任意记录进行修改前，先尝试为该记录加上排他锁（exclusive locking）。
2. 如果加锁失败，说明该记录正在被修改，那么当前查询可能要等待或者抛出异常。 具体响应方式由开发者根据实际需要决定。
3. 如果成功加锁，那么就可以对记录做修改，事务完成后就会解锁了。
4. 其间如果有其他对该记录做修改或加排他锁的操作，都会等待我们解锁或直接抛出异常。

**以MySQL InnoDB中使用悲观锁为例**？

要使用悲观锁，我们必须关闭mysql数据库的自动提交属性，因为MySQL默认使用autocommit模式，也就是说，当你执行一个更新操作后，MySQL会立刻将结果进行提交。set autocommit=0;

```sql
//0.开始事务
begin;/begin work;/start transaction; (三者选一就可以)
//1.查询出商品信息
select status from t_goods where id=1 for update;
//2.根据商品信息生成订单
insert into t_orders (id,goods_id) values (null,1);
//3.修改商品status为2
update t_goods set status=2;
//4.提交事务
commit;/commit work;
```

上面的查询语句中，我们使用了`select…for update`的方式，这样就通过开启排他锁的方式实现了悲观锁。此时在t_goods表中，id为1的 那条数据就被我们锁定了，其它的事务必须等本次事务提交之后才能执行。这样我们可以保证当前的数据不会被其它事务修改。

上面我们提到，使用`select…for update`会把数据给锁住，不过我们需要注意一些锁的级别，MySQL InnoDB默认行级锁。行级锁都是基于索引的，如果一条SQL语句用不到索引是不会使用行级锁的，会使用表级锁把整张表锁住，这点需要注意。

- **基于乐观锁**

乐观并发控制（又名“乐观锁”，Optimistic Concurrency Control，缩写“OCC”）是一种并发控制的方法。它假设多用户并发的事务在处理时不会彼此互相影响，各事务能够在不产生锁的情况下处理各自影响的那部分数据。在提交数据更新之前，每个事务会先检查在该事务读取数据后，有没有其他事务又修改了该数据。如果其他事务有更新的话，正在提交的事务会进行回滚。

**以使用版本号实现乐观锁为例？**

使用版本号时，可以在数据初始化时指定一个版本号，每次对数据的更新操作都对版本号执行+1操作。并判断当前版本号是不是该数据的最新的版本号。

```sql
1.查询出商品信息
select (status,status,version) from t_goods where id=#{id}
2.根据商品信息生成订单
3.修改商品status为2
update t_goods 
set status=2,version=version+1
where id=#{id} and version=#{version};
```

需要注意的是，乐观锁机制往往基于系统中数据存储逻辑，因此也具备一定的局限性。由于乐观锁机制是在我们的系统中实现的，对于来自外部系统的用户数据更新操作不受我们系统的控制，因此可能会造成脏数据被更新到数据库中。在系统设计阶段，我们应该充分考虑到这些情况，并进行相应的调整（如将乐观锁策略在数据库存储过程中实现，对外只开放基于此存储过程的数据更新途径，而不是将数据库表直接对外公开）。

- **缺陷**

对数据库依赖，开销问题，行锁变表锁问题，无法解决数据库单点和可重入的问题。

#### 基于redis如何实现分布式锁？有什么缺陷？

- **最基本的Jedis方案**

**加锁**： set NX PX + 重试 + 重试间隔

向Redis发起如下命令: SET productId:lock 0xx9p03001 NX PX 30000 其中，"productId"由自己定义，可以是与本次业务有关的id，"0xx9p03001"是一串随机值，必须保证全局唯一(原因在后文中会提到)，“NX"指的是当且仅当key(也就是案例中的"productId:lock”)在Redis中不存在时，返回执行成功，否则执行失败。"PX 30000"指的是在30秒后，key将被自动删除。执行命令后返回成功，表明服务成功的获得了锁。

```java
@Override
public boolean lock(String key, long expire, int retryTimes, long retryDuration) {
    // use JedisCommands instead of setIfAbsense
    boolean result = setRedis(key, expire);

    // retry if needed
    while ((!result) && retryTimes-- > 0) {
        try {
            log.debug("lock failed, retrying..." + retryTimes);
            Thread.sleep(retryDuration);
        } catch (Exception e) {
            return false;
        }

        // use JedisCommands instead of setIfAbsense
        result = setRedis(key, expire);
    }
    return result;
}

private boolean setRedis(String key, long expire) {
    try {
        RedisCallback<String> redisCallback = connection -> {
            JedisCommands commands = (JedisCommands) connection.getNativeConnection();
            String uuid = SnowIDUtil.uniqueStr();
            lockFlag.set(uuid);
            return commands.set(key, uuid, NX, PX, expire); // 看这里
        };
        String result = redisTemplate.execute(redisCallback);
        return !StringUtil.isEmpty(result);
    } catch (Exception e) {
        log.error("set redis occurred an exception", e);
    }
    return false;
}
```

**解锁**： 采用lua脚本： 在删除key之前，一定要判断服务A持有的value与Redis内存储的value是否一致。如果贸然使用服务A持有的key来删除锁，则会误将服务B的锁释放掉。

```lua
if redis.call("get", KEYS[1])==ARGV[1] then
	return redis.call("del", KEYS[1])
else
	return 0
end
```

- **基于RedLock实现分布式锁**

假设有两个服务A、B都希望获得锁，有一个包含了5个redis master的Redis Cluster，执行过程大致如下:

1. 客户端获取当前时间戳，单位: 毫秒
2. 服务A轮寻每个master节点，尝试创建锁。(这里锁的过期时间比较短，一般就几十毫秒) RedLock算法会尝试在大多数节点上分别创建锁，假如节点总数为n，那么大多数节点指的是n/2+1。
3. 客户端计算成功建立完锁的时间，如果建锁时间小于超时时间，就可以判定锁创建成功。如果锁创建失败，则依次(遍历master节点)删除锁。
4. 只要有其它服务创建过分布式锁，那么当前服务就必须轮寻尝试获取锁。

- **基于Redisson实现分布式锁**？

**过程**？

1. 线程去获取锁，获取成功: 执行lua脚本，保存数据到redis数据库。
2. 线程去获取锁，获取失败: 订阅了解锁消息，然后再尝试获取锁，获取成功后，执行lua脚本，保存数据到redis数据库。

**互斥**？

如果这个时候客户端B来尝试加锁，执行了同样的一段lua脚本。第一个if判断会执行“exists myLock”，发现myLock这个锁key已经存在。接着第二个if判断，判断myLock锁key的hash数据结构中，是否包含客户端B的ID，但明显没有，那么客户端B会获取到pttl myLock返回的一个数字，代表myLock这个锁key的剩余生存时间。此时客户端B会进入一个while循环，不听的尝试加锁。

**watch dog自动延时机制**？

客户端A加锁的锁key默认生存时间只有30秒，如果超过了30秒，客户端A还想一直持有这把锁，怎么办？其实只要客户端A一旦加锁成功，就会启动一个watch dog看门狗，它是一个后台线程，会每隔10秒检查一下，如果客户端A还持有锁key，那么就会不断的延长锁key的生存时间。

**可重入**？

每次lock会调用incrby，每次unlock会减一。

- **方案比较**

1. 借助Redis实现分布式锁时，有一个共同的缺陷: 当获取锁被决绝后，需要不断的循环，重新发送获取锁(创建key)的请求，直到请求成功。这就造成空转，浪费宝贵的CPU资源。
2. RedLock算法本身有争议，并不能保证健壮性。
3. Redisson实现分布式锁时，除了将key新增到某个指定的master节点外，还需要由master自动异步的将key和value等数据同步至绑定的slave节点上。那么问题来了，如果master没来得及同步数据，突然发生宕机，那么通过故障转移和主备切换，slave节点被迅速升级为master节点，新的客户端加锁成功，旧的客户端的watch dog发现key存在，误以为旧客户端仍然持有这把锁，这就导致同时存在多个客户端持有同名锁的问题了。

#### 基于zookeeper如何实现分布式锁？

说几个核心点：

- **顺序节点**

创建一个用于发号的节点“/test/lock”，然后以它为父亲节点的前缀为“/test/lock/seq-”依次发号：

![img](https://b2files.173114.xyz/blogimg/2025/03/9808ad458e0d00dd4ca79cce13f94e06.png)

- **获得最小号得锁**

由于序号的递增性，可以规定排号最小的那个获得锁。所以，每个线程在尝试占用锁之前，首先判断自己是排号是不是当前最小，如果是，则获取锁。

- **节点监听机制**

每个线程抢占锁之前，先抢号创建自己的ZNode。同样，释放锁的时候，就需要删除抢号的Znode。抢号成功后，如果不是排号最小的节点，就处于等待通知的状态。等谁的通知呢？不需要其他人，只需要等前一个Znode 的通知就可以了。当前一个Znode 删除的时候，就是轮到了自己占有锁的时候。第一个通知第二个、第二个通知第三个，击鼓传花似的依次向后。

### 13.4 分布式事务

#### 什么是ACID？

一个事务有四个基本特性，也就是我们常说的（ACID）：

1. **Atomicity（原子性）**：事务是一个不可分割的整体，事务内所有操作要么全做成功，要么全失败。
2. **Consistency（一致性）**：事务执行前后，数据从一个状态到另一个状态必须是一致的（A向B转账，不能出现A扣了钱，B却没收到）。
3. **Isolation（隔离性）**： 多个并发事务之间相互隔离，不能互相干扰。
4. **Durability（持久性）**：事务完成后，对数据库的更改是永久保存的，不能回滚。

#### 分布式事务有哪些解决方案？

#### 什么是分布式的XA协议？

XA协议是一个基于**数据库**的**分布式事务协议**，其分为两部分：**事务管理器**和**本地资源管理器**。事务管理器作为一个全局的调度者，负责对各个本地资源管理器统一号令提交或者回滚。`二阶提交协议（2PC）`和`三阶提交协议（3PC）`就是根据此协议衍生出来而来。主流的诸如Oracle、MySQL等数据库均已实现了XA接口。

XA接口是双向的系统接口，在事务管理器（Transaction Manager）以及一个或多个资源管理器（Resource Manager）之间形成通信桥梁。也就是说，在基于XA的一个事务中，我们可以针对多个资源进行事务管理，例如一个系统访问多个数据库，或即访问数据库、又访问像消息中间件这样的资源。这样我们就能够实现在多个数据库和消息中间件直接实现全部提交、或全部取消的事务。**XA规范不是java的规范，而是一种通用的规范**。

#### 什么是2PC？

两段提交顾名思义就是要进行两个阶段的提交：

- 第一阶段，准备阶段（投票阶段）；
- 第二阶段，提交阶段（执行阶段）。

![img](https://b2files.173114.xyz/blogimg/2025/03/880de5a3f1a4c689adc60d799dccf5ca.png)

下面还拿下单扣库存举例子，简单描述一下两段提交（2PC）的原理：

之前说过业务服务化（SOA）以后，一个下单流程就会用到多个服务，各个服务都无法保证调用的其他服务的成功与否，这个时候就需要一个全局的角色（**协调者**）对各个服务（**参与者**）进行协调。

![img](https://b2files.173114.xyz/blogimg/2025/03/c03c0f81f2d9a31d406f064ba43fea7b.png)

一个下单请求过来通过协调者，给每一个参与者发送Prepare消息，执行本地数据脚本但不提交事务。

如果协调者收到了参与者的失败消息或者超时，直接给每个参与者发送回滚(Rollback)消息；否则，发送提交（Commit）消息；参与者根据协调者的指令执行提交或者回滚操作，释放所有事务处理过程中被占用的资源，显然2PC做到了所有操作要么全部成功、要么全部失败。

**两段提交（2PC）的缺点**：

二阶段提交看似能够提供原子性的操作，但它存在着严重的缺陷：

- **网络抖动导致的数据不一致**：第二阶段中协调者向参与者发送commit命令之后，一旦此时发生网络抖动，导致一部分参与者接收到了commit请求并执行，可其他未接到commit请求的参与者无法执行事务提交。进而导致整个分布式系统出现了数据不一致。
- **超时导致的同步阻塞问题**：2PC中的所有的参与者节点都为事务阻塞型，当某一个参与者节点出现通信超时，其余参与者都会被动阻塞占用资源不能释放。
- **单点故障的风险**：由于严重的依赖协调者，一旦协调者发生故障，而此时参与者还都处于锁定资源的状态，无法完成事务commit操作。虽然协调者出现故障后，会重新选举一个协调者，可无法解决因前一个协调者宕机导致的参与者处于阻塞状态的问题。

#### 什么是3PC?

三段提交（3PC）是对两段提交（2PC）的一种升级优化，**3PC在2PC的第一阶段和第二阶段中插入一个准备阶段**。保证了在最后提交阶段之前，各参与者节点的状态都一致。同时在协调者和参与者中都引入超时机制，当参与者各种原因未收到协调者的commit请求后，会对本地事务进行commit，不会一直阻塞等待，解决了2PC的单点故障问题，但3PC还是没能从根本上解决数据一致性的问题。

![img](https://b2files.173114.xyz/blogimg/2025/03/511231d3fa725fc3b3ca1b45a1971231.png)

**3PC的三个阶段分别是CanCommit、PreCommit、DoCommit**：

- **CanCommit**：协调者向所有参与者发送CanCommit命令，询问是否可以执行事务提交操作。如果全部响应YES则进入下一个阶段。
- **PreCommit**：协调者向所有参与者发送PreCommit命令，询问是否可以进行事务的预提交操作，参与者接收到PreCommit请求后，如参与者成功的执行了事务操作，则返回Yes响应，进入最终commit阶段。一旦参与者中有向协调者发送了No响应，或因网络造成超时，协调者没有接到参与者的响应，协调者向所有参与者发送abort请求，参与者接受abort命令执行事务的中断。
- **DoCommit**：在前两个阶段中所有参与者的响应反馈均是YES后，协调者向参与者发送DoCommit命令正式提交事务，如协调者没有接收到参与者发送的ACK响应，会向所有参与者发送abort请求命令，执行事务的中断。

#### 什么是TCC？

TCC（Try-Confirm-Cancel）又被称补偿事务，TCC与2PC的思想很相似，事务处理流程也很相似，但**2PC是应用于在DB层面，TCC则可以理解为在应用层面的2PC，是需要我们编写业务逻辑来实现**。

TCC它的核心思想是："针对每个操作都要注册一个与其对应的确认（Try）和补偿（Cancel）"。

还拿下单扣库存解释下它的三个操作：

- **Try阶段**：下单时通过Try操作去扣除库存预留资源。
- **Confirm阶段**：确认执行业务操作，在只预留的资源基础上，发起购买请求。
- **Cancel阶段**：只要涉及到的相关业务中，有一个业务方预留资源未成功，则取消所有业务资源的预留请求。

![img](https://b2files.173114.xyz/blogimg/2025/03/837acff3eaa3defe4beecb409f9823d5.png)

**TCC的缺点**：

- 应用侵入性强：TCC由于基于在业务层面，至使每个操作都需要有try、confirm、cancel三个接口。
- 开发难度大：代码开发量很大，要保证数据一致性confirm和cancel接口还必须实现幂等性。

#### 什么是SAGA方案？

### 13.5 分布式缓存

#### 分布式系统中常用的缓存方案有哪些？

- 客户端缓存：页面和浏览器缓存，APP缓存，H5缓存，localStorage和sessionStorage
- CDN缓存：
  - 内存存储：数据的缓存
  - 内容分发：负载均衡
- nginx缓存：本地缓存，外部缓存
- 数据库缓存：持久层缓存（mybatis，hibernate多级缓存），Mysql查询缓存
- 操作系统缓存：Page Cache，Buffer Cache

#### 分布式系统缓存的更新模式？

- **Cache Aside模式**

1. 读取失效：cache数据没有命中，查询DB，成功后把数据写入缓存
2. 读取命中：读取cache数据
3. 更新：把数据更新到DB，失效缓存

![img](https://b2files.173114.xyz/blogimg/2025/03/60bd5f7146f8841dddd4489f621fa6bd.png)

```java
// Read
data = cache.get(id);
if (data == null) {
    data = db.get(id);
    cache.put(id, data);
}

// Write
db.save(data);
cache.invalid(data.id);
```

- **Read/Write Through模式**

缓存代理了DB读取、写入的逻辑，可以把缓存看成唯一的存储。

![img](https://b2files.173114.xyz/blogimg/2025/03/c49a36d14b251d4620f1954eaa82a3a9.png)

- Write Back模式

这种模式下所有的操作都走缓存，缓存里的数据再通过**异步的方式同步**到数据库里面。所以系统的写性能能够大大提升了。

![img](https://b2files.173114.xyz/blogimg/2025/03/684d3a1c52c8d3817b769a96c772b7de.png)

#### 分布式系统缓存淘汰策略

缓存淘汰，又称为缓存逐出(cache replacement algorithms或者cache replacement policies)，是指在存储空间不足的情况下，缓存系统主动释放一些缓存对象获取更多的存储空间。一般LRU用的比较多，可以重点了解一下。

- **FIFO** 先进先出（First In First Out）是一种简单的淘汰策略，缓存对象以队列的形式存在，如果空间不足，就释放队列头部的（先缓存）对象。一般用链表实现。
- **LRU** 最近最久未使用（Least Recently Used），这种策略是根据访问的时间先后来进行淘汰的，如果空间不足，会释放最久没有访问的对象（上次访问时间最早的对象）。比较常见的是通过优先队列来实现。
- **LFU** 最近最少使用（Least Frequently Used），这种策略根据最近访问的频率来进行淘汰，如果空间不足，会释放最近访问频率最低的对象。这个算法也是用优先队列实现的比较常见。

更进一步的谈谈Redis缓存淘汰的8个模式，可以参考上文Redis问答部分。

### 13.6 分布式任务

#### Java中定时任务是有些？如何演化的？

这里主要讲讲Java的定时任务是如何一步步发展而来的：

- **Timer**

```java
new Timer("testTimer").schedule(new TimerTask() {
    @Override
    public void run() {
        System.out.println("TimerTask");
    }
}, 1000,2000);
```

解释：1000ms是延迟启动时间，2000ms是定时任务周期，每2s执行一次

- **ScheduledExecutorService**

```java
ScheduledExecutorService scheduledExecutorService = Executors.newScheduledThreadPool(10);
scheduledExecutorService.scheduleAtFixedRate(new Runnable() {
    @Override
    public void run() {
        System.out.println("ScheduledTask");
    }
}, 1, 1, TimeUnit.SECONDS);
```

解释：延迟1s启动，每隔1s执行一次，是前一个任务开始时就开始计算时间间隔，但是会等上一个任务结束在开始下一个

- **SpringTask**

```java
@Service
public class SpringTask {
    private static final Logger log = LoggerFactory.getLogger(SpringTask.class);

    @Scheduled(cron = "1/5 * * * * *")
    public void task1(){
        log.info("springtask 定时任务！");
    }
	
	@Scheduled(initialDelay = 1000,fixedRate = 1*1000)
    public void task2(){
        log.info("springtask 定时任务！");
    }
}
```

解释：

1. task1是每隔5s执行一次，{秒} {分} {时} {日期}
2. task2是延迟1s,每隔1S执行一次

- **Quartz**

quartz 是一个开源的分布式调度库，它基于java实现。

![img](https://b2files.173114.xyz/blogimg/2025/03/bbf92ea9f0a0264c4afd7d3cfba837f8.png)

1. Job 表示一个任务，要执行的具体内容。
2. JobDetail 表示一个具体的可执行的调度程序，Job 是这个可执行程调度程序所要执行的内容，另外 JobDetail 还包含了这个任务调度的方案和策略。
3. Trigger 代表一个调度参数的配置，什么时候去调。
4. Scheduler 代表一个调度容器，一个调度容器中可以注册多个 JobDetail 和 Trigger。当 Trigger 与 JobDetail 组合，就可以被 Scheduler 容器调度了。

```java
//创建调度器Schedule
SchedulerFactory schedulerFactory = new StdSchedulerFactory();
Scheduler scheduler = schedulerFactory.getScheduler();
//创建JobDetail实例，并与HelloWordlJob类绑定
JobDetail jobDetail = JobBuilder.newJob(HelloWorldJob.class).withIdentity("job1", "jobGroup1")
        .build();
//创建触发器Trigger实例(立即执行，每隔1S执行一次)
Trigger trigger = TriggerBuilder.newTrigger()
        .withIdentity("trigger1", "triggerGroup1")
        .startNow()
        .withSchedule(SimpleScheduleBuilder.simpleSchedule().withIntervalInSeconds(1).repeatForever())
        .build();
//开始执行
scheduler.scheduleJob(jobDetail, trigger);
scheduler.start();
```

#### 常见的JOB实现方案？

基于上面Java任务演化出分布式Job方案：

- **quartz**

JDBCJobStore 支持集群所有触发器和job都存储在数据库中无论服务器停止和重启都可以恢复任务同时支持事务处理。

![img](https://b2files.173114.xyz/blogimg/2025/03/dab68a8b61e0f10b1a717018d2e8f183.png)

- **elastic-job**

elastic-job 是由当当网基于quartz 二次开发之后的分布式调度解决方案 ， 由两个相对独立的子项目Elastic-Job-Lite和Elastic-Job-Cloud组成 。

Elastic-Job-Lite定位为轻量级无中心化解决方案，使用jar包的形式提供分布式任务的协调服务。

Elastic-Job-Cloud使用Mesos + Docker(TBD)的解决方案，额外提供资源治理、应用分发以及进程隔离等服务

![img](https://b2files.173114.xyz/blogimg/2025/03/7bf3503675ede24bbadcbb46bb67a50f.jpg)

亮点：

1. 基于quartz 定时任务框架为基础的，因此具备quartz的大部分功能
2. 使用zookeeper做协调，调度中心，更加轻量级
3. 支持任务的分片
4. 支持弹性扩容 ， 可以水平扩展 ， 当任务再次运行时，会检查当前的服务器数量，重新分片，分片结束之后才会继续执行任务
5. 失效转移，容错处理，当一台调度服务器宕机或者跟zookeeper断开连接之后，会立即停止作业，然后再去寻找其他空闲的调度服务器，来运行剩余的任务
6. 提供运维界面，可以管理作业和注册中心。

- **xxl-job**

个轻量级分布式任务调度框架 ，主要分为 调度中心和执行器两部分 ， 调度中心在启动初始化的时候，会默认生成执行器的RPC代理

对象(http协议调用)， 执行器项目启动之后， 调度中心在触发定时器之后通过jobHandle 来调用执行器项目里面的代码，核心功能和elastic-job差不多

![img](https://b2files.173114.xyz/blogimg/2025/03/b2f0340ac1300291df2a2a3e227eee73.png)

### 13.7 分布式会话

#### Cookie和Session有什么区别？

cookie和session的方案虽然分别属于客户端和服务端，但是服务端的session的实现对客户端的cookie有依赖关系的，服务端执行session机制时候会生成session的id值，这个id值会发送给客户端，客户端每次请求都会把这个id值放到http请求的头部发送给服务端，而这个id值在客户端会保存下来，保存的容器就是cookie，因此当我们完全禁掉浏览器的cookie的时候，服务端的session也会不能正常使用。

#### 谈谈会话技术的发展？

- 单机 - Session + Cookie
- 多机器
  - 在负载均衡侧 - Session 粘滞
  - Session数据同步
- 多机器，集群 - session集中管理，比如redis；目前方案上用的最多的是SpringSession，早前也有用tomcat集成方式的。
- 无状态token，比如JWT

#### 分布式会话有哪些解决方案？

- Session Stick
- Session Replication
- Session 数据集中存储
- Cookie Based
- JWT

#### 什么是Session Stick?

方案即将客户端的每次请求都转发至同一台服务器，这就需要负载均衡器能够根据每次请求的会话标识（SessionId）来进行请求转发，如下图所示。

![img](https://b2files.173114.xyz/blogimg/2025/03/7423844b4466cf463507144a4d13053e.png)

这种方案实现比较简单，对于Web服务器来说和单机的情况一样。但是可能会带来如下问题：

- 如果有一台服务器宕机或者重启，那么这台机器上的会话数据会全部丢失。
- 会话标识是应用层信息，那么负载均衡要将同一个会话的请求都保存到同一个Web服务器上的话，就需要进行应用层（第7层）的解析，这个开销比第4层大。
- 负载均衡器将变成一个有状态的节点，要将会话保存到具体Web服务器的映射。和无状态节点相比，内存消耗更大，容灾方面也会更麻烦。

PS：为什么这种方案到目前还有很多项目使用呢？因为不需要在项目代码侧改动，而是只需要在负载均衡侧改动。

#### 什么是Session Replication？

Session Replication 的方案则不对负载均衡器做更改，而是在Web服务器之间增加了会话数据同步的功能，各个服务器之间通过同步保证不同Web服务器之间的Session数据的一致性，如下图所示。

![img](https://b2files.173114.xyz/blogimg/2025/03/48e3428a976de031b05217dc5000d2b6.png)

Session Replication 方案对负载均衡器不再有要求，但是同样会带来以下问题：

- 同步Session数据会造成额外的网络带宽的开销，只要Session数据有变化，就需要将新产生的Session数据同步到其他服务器上，服务器数量越多，同步带来的网络带宽开销也就越大。
- 每台Web服务器都需要保存全部的Session数据，如果整个集群的Session数量太多的话，则对于每台机器用于保存Session数据的占用会很严重。

#### 什么是Session 数据集中存储？

Session 数据集中存储方案则是将集群中的所有Session集中存储起来，Web服务器本身则并不存储Session数据，不同的Web服务器从同样的地方来获取Session，如下图所示。

![img](https://b2files.173114.xyz/blogimg/2025/03/ebe0b06018eb7abaea345a4bfbf3dbdc.png)

相对于Session Replication方案，此方案的Session数据将不保存在本机，并且Web服务器之间也没有了Session数据的复制，但是该方案存在的问题在于：

- 读写Session数据引入了网络操作，这相对于本机的数据读取来说，问题就在于存在时延和不稳定性，但是通信发生在内网，则问题不大。
- 如果集中存储Session的机器或集群出现问题，则会影响应用。

#### 什么是Cookie Based Session?

Cookie Based 方案是将**Session数据放在Cookie里**，访问Web服务器的时候，再由Web服务器生成对应的Session数据，如下图所示。

![img](https://b2files.173114.xyz/blogimg/2025/03/24b10761e6486f4d3f0272d01aefa44f.png)

但是Cookie Based 方案依然存在不足：

- Cookie长度的限制。这会导致Session长度的限制。
- 安全性。Seesion数据本来是服务端数据，却被保存在了客户端，即使可以加密，但是依然存在不安全性。
- 带宽消耗。这里不是指内部Web服务器之间的宽带消耗，而是数据中心的整体外部带宽的消耗。
- 性能影响。每次HTTP请求和响应都带有Seesion数据，对Web服务器来说，在同样的处理情况下，响应的结果输出越少，支持的并发就会越高。

#### 什么是JWT？使用JWT的流程？对比传统的会话有啥区别？

JSON Web Token，一般用它来替换掉Session实现数据共享。

使用基于 Token 的身份验证方法，在服务端不需要存储用户的登录记录。大概的流程是这样的：

- 1、客户端通过用户名和密码登录服务器；
- 2、服务端对客户端身份进行验证；
- 3、服务端对该用户生成Token，返回给客户端；
- 4、客户端将Token保存到本地浏览器，一般保存到cookie中；
- 5、客户端发起请求，需要携带该Token；
- 6、服务端收到请求后，首先验证Token，之后返回数据。

#### 什么是JWT？使用JWT的流程？对比传统的会话有啥区别？

JSON Web Token，一般用它来替换掉Session实现数据共享。

使用基于 Token 的身份验证方法，在服务端不需要存储用户的登录记录。大概的流程是这样的：

- 1、客户端通过用户名和密码登录服务器；
- 2、服务端对客户端身份进行验证；
- 3、服务端对该用户生成Token，返回给客户端；
- 4、客户端将Token保存到本地浏览器，一般保存到cookie中；
- 5、客户端发起请求，需要携带该Token；
- 6、服务端收到请求后，首先验证Token，之后返回数据。

![img](https://b2files.173114.xyz/blogimg/2025/03/12770d808a8c2449c4094ec155481379.png)

如上图为Token实现方式，浏览器第一次访问服务器，根据传过来的唯一标识userId，服务端会通过一些算法，如常用的HMAC-SHA256算法，然后加一个密钥，生成一个token，然后通过BASE64编码一下之后将这个token发送给客户端；客户端将token保存起来，下次请求时，带着token，服务器收到请求后，然后会用相同的算法和密钥去验证token，如果通过，执行业务操作，不通过，返回不通过信息。

可以对比下图session实现方式，流程大致一致。

![img](https://b2files.173114.xyz/blogimg/2025/03/e28f76c4d7edc4f0692a63cb2c816a78.png)

**优点**：

- 无状态、可扩展 ：在客户端存储的Token是无状态的，并且能够被扩展。基于这种无状态和不存储Session信息，负载均衡器能够将用户信息从一个服务传到其他服务器上。
- 安全：请求中发送token而不再是发送cookie能够防止CSRF(跨站请求伪造)。
- 可提供接口给第三方服务：使用token时，可以提供可选的权限给第三方应用程序。
- 多平台跨域

对应用程序和服务进行扩展的时候，需要介入各种各种的设备和应用程序。 假如我们的后端api服务器a.com只提供数据，而静态资源则存放在cdn 服务器b.com上。当我们从a.com请求b.com下面的资源时，由于触发浏览器的同源策略限制而被阻止。

**我们通过CORS（跨域资源共享）标准和token来解决资源共享和安全问题**。

举个例子，我们可以设置b.com的响应首部字段为：

```bash
// 第一行指定了允许访问该资源的外域 URI。
Access-Control-Allow-Origin: http://a.com

// 第二行指明了实际请求中允许携带的首部字段，这里加入了Authorization，用来存放token。
Access-Control-Allow-Headers: Authorization, X-Requested-With, Content-Type, Accept

// 第三行用于预检请求的响应。其指明了实际请求所允许使用的 HTTP 方法。
Access-Control-Allow-Methods: GET, POST, PUT,DELETE

// 然后用户从a.com携带有一个通过了验证的token访问B域名，数据和资源就能够在任何域上被请求到。
```

### 13.8 常见系统设计

#### 如何设计一个秒杀系统？

- **秒杀特点及思路？**

短时间内，大量用户涌入，集中读和写有限的库存。

1. 尽量将请求拦截在系统上游（越上游越好）；
2. 读多写少的多使用缓存（缓存抗读压力）；

- **从分层角度理解？**

层层拦截，将请求尽量拦截在系统上游，避免将锁冲落到数据库上。

- 第一层：客户端优化

产品层面，用户点击“查询”或者“购票”后，按钮置灰，禁止用户重复提交请求； JS层面，限制用户在x秒之内只能提交一次请求，比如微信摇一摇抢红包。 基本可以拦截80%的请求。

- 第二层：站点层面的请求拦截（nginx层，写流控模块）

怎么防止程序员写for循环调用，有去重依据么? IP? cookie-id? …想复杂了，这类业务都需要登录，用uid即可。在站点层面，对uid进行请求计数和去重，甚至不需要统一存储计数，直接站点层内存存储（这样计数会不准，但最简单，比如guava本地缓存）。一个uid，5秒只准透过1个请求，这样又能拦住99%的for循环请求。 对于5s内的无效请求，统一返回错误提示或错误页面。

这个方式拦住了写for循环发HTTP请求的程序员，有些高端程序员（黑客）控制了10w个肉鸡，手里有10w个uid，同时发请求（先不考虑实名制的问题，小米抢手机不需要实名制），这下怎么办，站点层按照uid限流拦不住了。

- 第三层：服务层拦截

方案一：写请求放到队列中，每次只透有限的写请求到数据层，如果成功了再放下一批，直到库存不够，队列里的写请求全部返回“已售完”。

方案二：或采用漏斗机制，只放一倍的流量进来，多余的返回“已售完”，把写压力转换成读压力。 读请求，用cache，redis单机可以抗10W QPS,用异步线程定时更新缓存里的库存值。

还有提示“模糊化”，比如火车余票查询，票剩了58张，还是26张，你真的关注么，其实我们只关心有票和无票。

- 第四层：数据库层

浏览器拦截了80%，站点层拦截了99.9%并做了页面缓存，服务层又做了写请求队列与数据缓存，每次透到数据库层的请求都是可控的。 db基本就没什么压力了，通过自身锁机制来控制，避免出现超卖。

- **从架构角度理解？**

1. 高性能

   1. 动静分离

       

      秒杀过程中你是不需要刷新整个页面的，只有时间在不停跳动。这是因为一般都会对大流量的秒杀系统做系统的静态化改造，即数据意义上的动静分离。动静分离三步走：

      1. 数据拆分；
      2. 静态缓存；
      3. 数据整合。

   2. **热点优化** 数据的热点优化与动静分离是不一样的，热点优化是基于二八原则对数据进行了纵向拆分，以便进行针对性地处理。热点识别和隔离不仅对“秒杀”这个场景有意义，对其他的高性能分布式系统也非常有参考价值。

   3. 系统优化

      1. 减少序列化：减少 Java 中的序列化操作可以很好的提升系统性能。序列化大部分是在 RPC 阶段发生，因此应该尽量减少 RPC 调用，一种可行的方案是将多个关联性较强的应用进行 “合并部署”，从而减少不同应用之间的 RPC 调用（微服务设计规范）
      2. 直接输出流数据：只要涉及字符串的I/O操作，无论是磁盘 I/O 还是网络 I/O，都比较耗费 CPU 资源，因为字符需要转换成字节，而这个转换又必须查表编码。所以对于常用数据，比如静态字符串，推荐提前编码成字节并缓存，具体到代码层面就是通过 OutputStream() 类函数从而减少数据的编码转换；另外，热点方法toString()不要直接调用ReflectionToString实现，推荐直接硬编码，并且只打印DO的基础要素和核心要素
      3. 裁剪日志异常堆栈：无论是外部系统异常还是应用本身异常，都会有堆栈打出，超大流量下，频繁的输出完整堆栈，只会加剧系统当前负载。可以通过日志配置文件控制异常堆栈输出的深度
      4. 去组件框架：极致优化要求下，可以去掉一些组件框架，比如去掉传统的 MVC 框架，直接使用 Servlet 处理请求。这样可以绕过一大堆复杂且用处不大的处理逻辑，节省毫秒级的时间，当然，需要合理评估你对框架的依赖程度

2. 高可用

   1. 流量削峰
      1. 答题：答题目前已经使用的非常普遍了，本质是通过在入口层削减流量，从而让系统更好地支撑瞬时峰值。
      2. MQ： 最为常见的削峰方案是使用消息队列，通过把同步的直接调用转换成异步的间接推送缓冲瞬时流量。
      3. 过滤
   2. **Plan B**： 为了保证系统的高可用，必须设计一个 Plan B 方案来进行兜底。

#### 接口设计要考虑哪些方面？

讲讲几个要点：

- 接口版本化
- 命名规范
- 请求参数的规范性及处理的统一性
- 返回数据类型、返回码及信息提示的规范性
- 接口安全验证及权限的控制
- 请求接口日志的记录
- 良好的接口说明文档和测试程序

#### 什么是接口幂等？如何保证接口的幂等性？

接口的幂等性实际上就是接口可重复调用，在调用方多次调用的情况下，接口最终得到的结果是一致的。有些接口可以天然的实现幂等性，比如查询接口，对于查询来说，你查询一次和两次，对于系统来说，没有任何影响，查出的结果也是一样。

除了查询功能具有天然的幂等性之外，增加、更新、删除都要保证幂等性。那么如何来保证幂等性呢？

- **全局唯一ID**

如果使用全局唯一ID，就是根据业务的操作和内容生成一个全局ID，在执行操作前先根据这个全局唯一ID是否存在，来判断这个操作是否已经执行。如果不存在则把全局ID，存储到存储系统中，比如数据库、redis等。如果存在则表示该方法已经执行。

从工程的角度来说，使用全局ID做幂等可以作为一个业务的基础的微服务存在，在很多的微服务中都会用到这样的服务，在每个微服务中都完成这样的功能，会存在工作量重复。另外打造一个高可靠的幂等服务还需要考虑很多问题，比如一台机器虽然把全局ID先写入了存储，但是在写入之后挂了，这就需要引入全局ID的超时机制。

使用全局唯一ID是一个通用方案，可以支持插入、更新、删除业务操作。但是这个方案看起来很美但是实现起来比较麻烦，下面的方案适用于特定的场景，但是实现起来比较简单。

- **去重表**

这种方法适用于在业务中有唯一标的插入场景中，比如在以上的支付场景中，如果一个订单只会支付一次，所以订单ID可以作为唯一标识。这时，我们就可以建一张去重表，并且把唯一标识作为唯一索引，在我们实现时，把创建支付单据和写入去去重表，放在一个事务中，如果重复创建，数据库会抛出唯一约束异常，操作就会回滚。

- **插入或更新**

这种方法插入并且有唯一索引的情况，比如我们要关联商品品类，其中商品的ID和品类的ID可以构成唯一索引，并且在数据表中也增加了唯一索引。这时就可以使用InsertOrUpdate操作。在mysql数据库中如下：

```sql
insert into goods_category (goods_id,category_id,create_time,update_time) 
       values(#{goodsId},#{categoryId},now(),now()) 
       on DUPLICATE KEY UPDATE
       update_time=now()
```

- **多版本控制**

这种方法适合在更新的场景中，比如我们要更新商品的名字，这时我们就可以在更新的接口中增加一个版本号，来做幂等

```java
boolean updateGoodsName(int id,String newName,int version);
```

在实现时可以如下

```sql
update goods set name=#{newName},version=#{version} where id=#{id} and version<${version}
```

- **状态机控制**

这种方法适合在有状态机流转的情况下，比如就会订单的创建和付款，订单的付款肯定是在之前，这时我们可以通过在设计状态字段时，使用int类型，并且通过值类型的大小来做幂等，比如订单的创建为0，付款成功为100。付款失败为99

在做状态机更新时，我们就这可以这样控制

```sql
update `order` set status=#{status} where id=#{id} and status<#{status}
```
