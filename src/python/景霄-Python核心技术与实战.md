---
# dir:
#     text: Java全栈面试
#     icon: laptop-code
#     collapsible: true
#     expanded: true
#     link: true
#     index: true
title: jingxiao-Python核心技术与实战
index: true
headerDepth: 3
# icon: laptop-code
# sidebar: true
# toc: true
# editLink: false
---

![image-20250324235242585](https://b2files.173114.xyz/blogimg/2025/03/f28af7155beada8b06e457238bfbe96f.png)

第一步：大厦之基，勤加练习

第二步：代码规范，必不可少

第三步：开发经验，质的突破

```python
import numpy as np
import matplotlib.pyplot as plt
%matplotlib inline
plt.plot(*np.random.randn(2, 1000))
```

## 02丨Jupyter Notebook为什么是现代Python的必学技术？

另外，我还推荐下面这些 Jupyter Notebook，作为你实践的第一站。
第一个是 Jupyter 官方：https://mybinder.org/v2/gh/binder-examples/matplotlibversions/
mpl-v2.0/?filepath=matplotlib_versions_demo.ipynb
第二个是 Google Research 提供的 Colab 环境，尤其适合机器学习的实践应用：
https://colab.research.google.com/notebooks/basic_features_overview.ipynb
如果你想在本地或者远程的机器上安装 Jupyter Notebook，可以参考下面
的两个文档。
安装：https://jupyter.org/install.html

运行：https://jupyter.readthedocs.io/en/latest/running.html#running

## 03丨列表和元组，到底用哪一个？

### 列表和元组基础

列表是动态的，长度大小不固定，可以随意地增加、删减或者改变元素（mutable）。
而元组是静态的，长度大小固定，无法增加删减或者改变（immutable）。

```python
l = [1, 2, 'hello', 'world'] # 列表中同时含有 int 和 string 类型的元素
l
[1, 2, 'hello', 'world']
tup = ('jason', 22) # 元组中同时含有 int 和 string 类型的元素
tup
('jason', 22)
```



```python
l = [1, 2, 3, 4]
l[3] = 40 # 和很多语言类似，python 中索引同样从 0 开始，l[3] 表示访问列表的第四个元素
l
[1, 2, 3, 40]
tup = (1, 2, 3, 4)
tup[3] = 40
Traceback (most recent call last):
File "<stdin>", line 1, in <module>
TypeError: 'tuple' object does not support item assignment
```



```python
tup = (1, 2, 3, 4)
new_tup = tup + (5, ) # 创建新的元组 new_tup，并依次填充原元组的值
new_tup
(1, 2, 3, 4, 5)
l = [1, 2, 3, 4]
l.append(5) # 添加元素 5 到原列表的末尾
l
[1, 2, 3, 4, 5]
```

Python 中的列表和元组都支持负数索引，-1 表示最后一个元
素，-2 表示倒数第二个元素，以此类推。

```python
l = [1, 2, 3, 4]
l[-1]
4

tup = (1, 2, 3, 4)
tup[-1]
4
```

除了基本的初始化，索引外，列表和元组都支持切片操作：

```python
l = [1, 2, 3, 4]
l[1:3] # 返回列表中索引从 1 到 2 的子列表
[2, 3]

tup = (1, 2, 3, 4)
tup[1:3] # 返回元组中索引从 1 到 2 的子元组
(2, 3)
```

另外，列表和元组都可以随意嵌套：

```python
l = [[1, 2, 3], [4, 5]] # 列表的每一个元素也是一个列表
tup = ((1, 2, 3), (4, 5, 6)) # 元组的每一个元素也是一元组
```

当然，两者也可以通过 list() 和 tuple() 函数相互转换：

```python
list((1, 2, 3))
[1, 2, 3]
tuple([1, 2, 3])
(1, 2, 3)
```

最后，我们来看一些列表和元组常用的内置函数：

```python
l = [3, 2, 3, 7, 8, 1]
l.count(3)
2
l.index(7)
3
l.reverse()
l
[1, 8, 7, 3, 2, 3]
l.sort()
l
[1, 2, 3, 3, 7, 8]
tup = (3, 2, 3, 7, 8, 1)
tup.count(3)
2
tup.index(7)
3
list(reversed(tup))
[1, 8, 7, 3, 2, 3]
sorted(tup)
[1, 2, 3, 3, 7, 8]
```

count(item) 表示统计列表 / 元组中 item 出现的次数。
index(item) 表示返回列表 / 元组中 item 第一次出现的索引。
list.reverse() 和 list.sort() 分别表示原地倒转列表和排序（注意，元组没有内置的这两个
函数)。
reversed() 和 sorted() 同样表示对列表 / 元组进行倒转和排序，但是会返回一个倒转后
或者排好序的新的列表 / 元组。

### 列表和元组存储方式的差异

```python
l = [1, 2, 3]
l.__sizeof__()
64
tup = (1, 2, 3)
tup.__sizeof__()
48
```

由于列表是动态的，所以它需要存储指针，来指向对应的元素（上述例子中，对于int 型，8 字节）。另外，由于列表可变，所以需要额外存储已经分配的长度大小（8 字节），这样才可以实时追踪列表空间的使用情况，当空间不足时，及时分配额外空间。

```python
l = []
l.__sizeof__() // 空列表的存储空间为 40 字节
40
l.append(1)
l.__sizeof__()
72 // 加入了元素 1 之后，列表为其分配了可以存储 4 个元素的空间 (72 - 40)/8 = 4
l.append(2)
l.__sizeof__()
72 // 由于之前分配了空间，所以加入元素 2，列表空间不变
l.append(3)
l.__sizeof__()
72 // 同上
l.append(4)
l.__sizeof__()
72 // 同上
l.append(5)
l.__sizeof__()
104 // 加入元素 5 之后，列表的空间不足，所以又额外分配了可以存储 4 个元素的空间
```

为了减小每次增加 / 删减操作时空间分配的开销，Python 每次分配空间时都会额外多分配一些，这样的机制（over-allocating）保证了其操作的高效性：增加 / 删除的时间复杂度均为 O(1)。

但是对于元组，情况就不同了。元组长度大小固定，元素不可变，所以存储空间固定。

### 列表和元组的性能

总体上来说，元组的性能速度要略优于列表。

Python 会在后台，对静态数据做一些资源缓存（resource caching）。通常来说，因为垃圾回收机制的存在，如果一些变量不被使用了，Python 就会回收它们所占用的内存，返还给操作系统，以便其他变量或其他应用使用。

但是对于一些静态变量，比如元组，如果它不被使用并且占用空间不大时，Python 会暂时缓存这部分内存。这样，下次我们再创建同样大小的元组时，Python 就可以不用再向操作系统发出请求，去寻找内存，而是可以直接分配之前缓存的内存空间，这样就能大大加快程序的运行速度。

下面的例子，是计算初始化一个相同元素的列表和元组分别所需的时间。我们可以看到，元
组的初始化速度，要比列表快 5 倍。

```python
python3 -m timeit 'x=(1,2,3,4,5,6)'
20000000 loops, best of 5: 9.97 nsec per loop
python3 -m timeit 'x=[1,2,3,4,5,6]'
5000000 loops, best of 5: 50.1 nsec per loop
```

但如果是索引操作的话，两者的速度差别非常小，几乎可以忽略不计。

```python
python3 -m timeit -s 'x=[1,2,3,4,5,6]' 'y=x[3]'
10000000 loops, best of 5: 22.2 nsec per loop
python3 -m timeit -s 'x=(1,2,3,4,5,6)' 'y=x[3]'
10000000 loops, best of 5: 21.9 nsec per loop
```

当然，如果你想要增加、删减或者改变元素，那么列表显然更优。原因你现在肯定知道了，那就是对于元组，你必须得通过新建一个元组来完成。

### 列表和元组的使用场景

1. 如果存储的数据和数量不变，比如你有一个函数，需要返回的是一个地点的经纬度，然后直接传给前端渲染，那么肯定选用元组更合适。

```python
def get_location():
.....
return (longitude, latitude)
```

2. 如果存储的数据或数量是可变的，比如社交平台上的一个日志功能，是统计一个用户在一周之内看了哪些用户的帖子，那么则用列表更合适。

```python
viewer_owner_id_list = [] # 里面的每个元素记录了这个 viewer 一周内看过的所有 owner 的 id
records = queryDB(viewer_id) # 索引数据库，拿到某个 viewer 一周内的日志
for record in records:
viewer_owner_id_list.append(record.id)
```

## 04 | 字典、集合，你真的了解吗？

### 字典和集合基础

在 Python3.7+，字典被确定为有序（注意：在 3.6 中，字典有序是一个implementation detail，在 3.7 才正式成为语言特性，因此 3.6 中无法 100% 确保其有序性），而 3.6 之前是无序的，其长度大小可变，元素可以任意地删减和改变。

相比于列表和元组，字典的性能更优，特别是对于查找、添加和删除操作，字典都能在常数时间复杂度内完成。

而集合和字典基本相同，唯一的区别，就是集合没有键和值的配对，是一系列无序的、唯一的元素组合。

```python
d1 = {'name': 'jason', 'age': 20, 'gender': 'male'}
d2 = dict({'name': 'jason', 'age': 20, 'gender': 'male'})
d3 = dict([('name', 'jason'), ('age', 20), ('gender', 'male')])
d4 = dict(name='jason', age=20, gender='male')
d1 == d2 == d3 ==d4
True
s1 = {1, 2, 3}
s2 = set([1, 2, 3])
s1 == s2
True
```

字典访问可以直接索引键，如果不存在，就会抛出异常：

```python
d = {'name': 'jason', 'age': 20}
d['name']
'jason'
d['location']
Traceback (most recent call last):
File "<stdin>", line 1, in <module>
KeyError: 'location'
```

也可以使用 get(key, default) 函数来进行索引。如果键不存在，调用 get() 函数可以返回一个默认值。比如下面这个示例，返回了'null'。

```python
d = {'name': 'jason', 'age': 20}
d.get('name')
'jason'
d.get('location', 'null')
'null'
```

集合并不支持索引操作，因为集合本质上是一个哈希表，和列表不一样。所以，下面这样的操作是错误的，Python 会抛出异常：

```python
s = {1, 2, 3}
s[0]
Traceback (most recent call last):
File "<stdin>", line 1, in <module>
TypeError: 'set' object does not support indexing
```

想要判断一个元素在不在字典或集合内，我们可以用 value in dict/set 来判断。

```python
s = {1, 2, 3}
1 in s
True
10 in s
False
d = {'name': 'jason', 'age': 20}
'name' in d
True
'location' in d
False
```

除了创建和访问，字典和集合也同样支持增加、删除、更新等操作。

```python
d = {'name': 'jason', 'age': 20}
d['gender'] = 'male' # 增加元素对'gender': 'male'
d['dob'] = '1999-02-01' # 增加元素对'dob': '1999-02-01'
d
{'name': 'jason', 'age': 20, 'gender': 'male', 'dob': '1999-02-01'}
d['dob'] = '1998-01-01' # 更新键'dob'对应的值
d.pop('dob') # 删除键为'dob'的元素对
'1998-01-01'
d
{'name': 'jason', 'age': 20, 'gender': 'male'}
s = {1, 2, 3}
s.add(4) # 增加元素 4 到集合
s
{1, 2, 3, 4}
s.remove(4) # 从集合中删除元素 4
s
{1, 2, 3}
```

集合的 pop() 操作是删除集合中最后一个元素，可是集合本身是无序的，你无法知道会删除哪个元素，因此这个操作得谨慎使用。

很多情况下，我们需要对字典或集合进行排序，比如，取出值最大的 50 对。对于字典，我们通常会根据键或值，进行升序或降序排序：

```python
d = {'b': 1, 'a': 2, 'c': 10}
d_sorted_by_key = sorted(d.items(), key=lambda x: x[0]) # 根据字典键的升序排序
d_sorted_by_value = sorted(d.items(), key=lambda x: x[1]) # 根据字典值的升序排序
d_sorted_by_key
[('a', 2), ('b', 1), ('c', 10)]
d_sorted_by_value
[('b', 1), ('a', 2), ('c', 10)]
```

而对于集合，其排序和前面讲过的列表、元组很类似，直接调用 sorted(set) 即可，结果会
返回一个排好序的列表。

```python
s = {3, 4, 2, 1}
sorted(s) # 对集合的元素进行升序排序
[1, 2, 3, 4]
```

### 字典和集合性能

字典和集合是进行过性能高度优化的数据结构，特别是对于查找、添加和删除操作。

比如电商企业的后台，存储了每件产品的 ID、名称和价格。现在的需求是，给定某件商品的 ID，我们要找出其价格。
如果我们用列表来存储这些数据结构，并进行查找，相应的代码如下：

```python
def find_product_price(products, product_id):
    for id, price in products:
        if id == product_id:
            return price
            return None
products = [
(143121312, 100),
(432314553, 30),
(32421912367, 150)
]
print('The price of product 432314553 is {}'.format(find_product_price(products, 432314553)))
The price of product 432314553 is 30
```

假设列表有 n 个元素，而查找的过程要遍历列表，那么时间复杂度就为 O(n)。即使我们先对列表进行排序，然后使用二分查找，也会需要 O(logn) 的时间复杂度，更何况，列表的排序还需要 O(nlogn) 的时间。

但如果我们用字典来存储这些数据，那么查找就会非常便捷高效，只需 O(1) 的时间复杂度就可以完成。原因也很简单，刚刚提到过的，字典的内部组成是一张哈希表，你可以直接通过键的哈希值，找到其对应的值。

```python
products = {
143121312: 100,
432314553: 30,
32421912367: 150
}
print('The price of product 432314553 is {}'.format(products[432314553]))
# 输出
The price of product 432314553 is 30
```

类似的，现在需求变成，要找出这些商品有多少种不同的价格。我们还用同样的方法来比较一下。
如果还是选择使用列表，对应的代码如下，其中，A 和 B 是两层循环。同样假设原始列表有 n 个元素，那么，在最差情况下，需要 O(n^2) 的时间复杂度。

```python
# list version
def find_unique_price_using_list(products):
    unique_price_list = []
    for _, price in products: # A
        if price not in unique_price_list: #B
            unique_price_list.append(price)
    return len(unique_price_list)
products = [
(143121312, 100),
(432314553, 30),
(32421912367, 150),
(937153201, 30)
]
print('number of unique price is: {}'.format(find_unique_price_using_list(products)))
# 输出
number of unique price is: 3
```

但如果我们选择使用集合这个数据结构，由于集合是高度优化的哈希表，里面元素不能重复，并且其添加和查找操作只需 O(1) 的复杂度，那么，总的时间复杂度就只有 O(n)。

```python
# set version
def find_unique_price_using_set(products):
    unique_price_set = set()
    for _, price in products:
        unique_price_set.add(price)
    return len(unique_price_set)
products = [
(143121312, 100),
(432314553, 30),
(32421912367, 150),
(937153201, 30)
]
print('number of unique price is: {}'.format(find_unique_price_using_set(products)))

number of unique price is: 3
```

可能你对这些时间复杂度没有直观的认识，我可以举一个实际工作场景中的例子，让你来感受一下。
下面的代码，初始化了含有 100,000 个元素的产品，并分别计算了使用列表和集合来统计产品价格数量的运行时间：

```python
import time
id = [x for x in range(0, 100000)]
price = [x for x in range(200000, 300000)]
products = list(zip(id, price))
# 计算列表版本的时间
start_using_list = time.perf_counter()
find_unique_price_using_list(products)
end_using_list = time.perf_counter()
print("time elapse using list: {}".format(end_using_list - start_using_list))

# 计算集合版本的时间
start_using_set = time.perf_counter()
find_unique_price_using_set(products)
end_using_set = time.perf_counter()
print("time elapse using set: {}".format(end_using_set - start_using_set))

time elapse using list: 28.31910729999072
time elapse using set: 0.008142899998347275
```

### 字典和集合的工作原理

对于字典而言，这张表存储了哈希值（hash）、键和值这 3 个元素。
而对集合来说，区别就是哈希表内没有键和值的配对，只有单一的元素了。

思考题

1. 下面初始化字典的方式，哪一种更高效？

```python
# Option A
d = {'name': 'jason', 'age': 20, 'gender': 'male'}
# Option B
d = dict({'name': 'jason', 'age': 20, 'gender': 'male'})
```

```python
import timeit

# 测试 Option A
print(timeit.timeit("d = {'name': 'jason', 'age': 20, 'gender': 'male'}", number=1000000))
# 输出示例：0.07965200000035111 秒

# 测试 Option B
print(timeit.timeit("d = dict({'name': 'jason', 'age': 20, 'gender': 'male'})", number=1000000))
# 输出示例：0.17129170001135208 秒
```

2. 字典的键可以是一个列表吗？下面这段代码中，字典的初始化是否正确呢？如果不正
  确，可以说出你的原因吗？

```python
d = {'name': 'jason', ['education']: ['Tsinghua University', 'Stanford University']}
```

```plain
---------------------------------------------------------------------------
TypeError                                 Traceback (most recent call last)
Cell In[53], line 1
----> 1 d = {'name': 'jason', ['education']: ['Tsinghua University', 'Stanford University']}

TypeError: unhashable type: 'list'
```

## 05 | 深入浅出字符串

### 字符串基础

字符串是由独立字符组成的一个序列，通常包含在单引号（''）双引号（""）或者三引号之中（''' '''或""" """，两者一样），比如下面几种写法。

```python
name = 'jason'
city = 'beijing'
text = "welcome to jike shijian"
```

Python 的三引号字符串，则主要应用于多行字符串的情境，比如函数的注释等等。

```python
def calculate_similarity(item1, item2):
"""
Calculate similarity between two items
Args:
item1: 1st item
item2: 2nd item
Returns:
similarity score between item1 and item2
"""
```

Python 也支持转义字符。所谓的转义字符，就是用反斜杠开头的字符串，来表示一些特定意义的字符。我把常见的的转义字符，总结成了下面这张表格。

![image-20250325223316523](https://b2files.173114.xyz/blogimg/2025/03/40c66b16c0a580ed28fef13c03406f23.png)

```py
s = 'a\nb\tc'
print(s)
a
b c
len(s)
5
```

这段代码中的'\n'，表示一个字符——换行符；'\t'也表示一个字符——横向制表符。所以，最后打印出来的输出，就是字符 a，换行，字符 b，然后制表符，最后打印字符 c。不过要注意，虽然最后打印的输出横跨了两行，但是整个字符串 s 仍然只有 5 个元素。

在转义字符的应用中，最常见的就是换行符'\n'的使用。比如文件读取，如果我们一行行地读取，那么每一行字符串的末尾，都会包含换行符'\n'。而最后做数据处理时，我们往往会丢掉每一行的换行符。

### 字符串的常用操作

索引，切片和遍历

```python
name = 'jason'
print(name[0])
print(name[1:3])
for char in name:
    print(char)

j
as
j
a
s
o
n
```

Python 的字符串是不可变的（immutable）。

```python
s = 'hello'
s[0] = 'H'
Traceback (most recent call last):
File "<stdin>", line 1, in <module>
TypeError: 'str' object does not support item assignment
```

Python 中字符串的改变，通常只能通过创建新的字符串来完成。比如上述例子中，想把'hello'的第一个字符'h'，改为大写的'H'，我们可以采用下面的做法：

```python
s = 'H' + s[1:]
s = s.replace('h', 'H')
```

