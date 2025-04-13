---
# dir:
#     text: Java全栈面试
#     icon: laptop-code
#     collapsible: true
#     expanded: true
#     link: true
#     index: true
title: Python核心技术与实战-jingxiao
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

使用加法操作符'+='的字符串拼接方法。因为它是一个例外，打破了字符串不可变的特性。

```python
str1 += str2 # 表示 str1 = str1 + str2
```

```python
s = ''
for n in range(0, 100000):
    s += str(n)
```

除了使用加法操作符，我们还可以使用字符串内置的 join 函数。string.join(iterable)，表示把每个元素都按照指定的格式连接起来。

```python
l = []
for n in range(0, 100000):
    l.append(str(n))
l = ' '.join(l)
```

由于列表的 append 操作是 O(1) 复杂度，字符串同理。因此，这个含有 for 循环例子的时间复杂度为 n*O(1)=O(n)。

字符串的分割函数 split()。string.split(separator)，表示把字符串按照 separator 分割成子字符串，并返回一个分割后子字符串组合的列表。它常常应用于对数据的解析处理，比如我们读取了某个文件的路径，想要调用数据库的 API，去读取对应的数据，我们通常会写成下面这样：

```python
def query_data(namespace, table):
    """
    given namespace and table, query database to get corresponding
    data
    """
path = 'hive://ads/training_table'
namespace = path.split('//')[1].split('/')[0] # 返回'ads'
table = path.split('//')[1].split('/')[1] # 返回 'training_table'
data = query_data(namespace, table)
```

此外，常见的函数还有：

string.strip(str)，表示去掉首尾的 str 字符串；
string.lstrip(str)，表示只去掉开头的 str 字符串；
string.rstrip(str)，表示只去掉尾部的 str 字符串。

这些在数据的解析处理中同样很常见。比如很多时候，从文件读进来的字符串中，开头和结尾都含有空字符，我们需要去掉它们，就可以用 strip() 函数：

```python
s = ' my name is jason '
s.strip()
'my name is jason'
```

Python 中字符串还有很多常用操作，比如，string.find(sub, start, end)，表示从start 到 end 查找字符串中子字符串 sub 的位置等等。

### 字符串的格式化

举一个常见的例子。比如我们有一个任务，给定一个用户的 userid，要去数据库中查询该用户的一些信息，并返回。而如果数据库中没有此人的信息，我们通常会记录下来，这样有利于往后的日志分析，或者是线上 bug 的调试等等。

我们通常会用下面的方法来表示：

```python
print('no data available for person with id: {}, name: {}'.format(id, name))
```

其中的 string.format()，就是所谓的格式化函数；而大括号{}就是所谓的格式符，用来为后面的真实值——变量 name 预留位置。如果id = '123'、name='jason'，那么输出便是：

```python
'no data available for person with id: 123, name: jason'
```

string.format() 是最新的字符串格式函数与规范。自然，我们还有其他的表示方法，比如在 Python 之前版本中，字符串格式化通常用 % 来表示，那么上述的例子，就可以写成下面这样：

```python
print('no data available for person with id: %s, name: %s' % (id, name))
```

其中 %s 表示字符串型，%d 表示整型等等

推荐使用 format 函数，毕竟这是最新规范，也是官方文档推荐的规范。

在新版本的 Python（2.5+）中，下面的两个字符串拼接操作，你觉得哪个更优呢？

```python
for n in range(0, 100000):
    s += str(n)	
    
536ms
```

```python
l = []
for n in range(0, 100000):
    l.append(str(n))
s = ' '.join(l)

26ms
```

## 06 | Python “黑箱”：输入与输出

### 输入输出基础

```python
name = input('your name:')
gender = input('you are a boy?(y/n)')
###### 输入 ######
your name:Jack
you are a boy?

welcome_str = 'Welcome to the matrix {prefix} {name}.'
welcome_dic = {
    'prefix': 'Mr.' if gender == 'y' else 'Mrs',
    'name': name
}
print('authorizing...')
print(welcome_str.format(**welcome_dic))

########## 输出 ##########
authorizing...
Welcome to the matrix Mr. Jack.
```

```python
a = input()
1
b = input()
2
print('a + b = {}'.format(a + b))
########## 输出 ##############
a + b = 12
print('type of a is {}, type of b is {}'.format(type(a), type(b)))
########## 输出 ##############
type of a is <class 'str'>, type of b is <class 'str'>
print('a + b = {}'.format(int(a) + int(b)))
########## 输出 ##############
a + b = 3
```

把 str 强制转换为 int 请用 int()，转为浮点数请用 float()。而在生产环境中使用强制转换时，请记得加上 try except

Python 对 int 类型没有最大限制（相比之下， C++ 的 int 最大为 2147483647，超过这个数字会产生溢出），但是对 float 类型依然有精度限制。这些特点，除了在一些算法竞赛中要注意，在生产环境中也要时刻提防，避免因为对边界条件判断不清而造成 bug 甚至0day（危重安全漏洞）。

2018 年 4 月 23 日中午 11 点 30 分左右，BEC 代币智能合约被黑客攻击。黑客利用数据溢出的漏洞，攻击与美图合作的公司美链 BEC 的智能合约，成功地向两个地址转出了天量级别的 BEC 代币，导致市场上的海量 BEC 被抛售，该数字货币的价值也几近归零，给 BEC 市场交易带来了毁灭性的打击

### 文件输入输出

做一个简单的 NLP（自然语言处理）任务。

NLP 任务的基本步骤，也就是下面的四步：
1. 读取文件；
2. 去除所有标点符号和换行符，并把所有大写变成小写；
3. 合并相同的词，统计每个词出现的频率，并按照词频从大到小排序；
4. 将结果按行输出到文件 out.txt。

```python
import re
# 你不用太关心这个函数
def parse(text):
    # 使用正则表达式去除标点符号和换行符
    text = re.sub(r'[^\w ]', ' ', text)
    # 转为小写
    text = text.lower()
    # 生成所有单词的列表
    word_list = text.split(' ')
    # 去除空白单词
    word_list = filter(None, word_list)
    # 生成单词和词频的字典
    word_cnt = {}
    for word in word_list:
        if word not in word_cnt:
            word_cnt[word] = 0
        word_cnt[word] += 1
    # 按照词频排序
    sorted_word_cnt = sorted(word_cnt.items(), key=lambda kv: kv[1], reverse=True)
    return sorted_word_cnt
with open('in.txt', 'r') as fin:
    text = fin.read()
word_and_freq = parse(text)
with open('out.txt', 'w') as fout:
    for word, freq in word_and_freq:
        fout.write('{} {}\n'.format(word, freq))
        
########## 输出 (省略较长的中间结果) ##########
and 15
be 13
will 11
to 11
the 10
of 10
a 8
we 8
day 6
...
old 1
negro 1
spiritual 1
thank 1
god 1
almighty 1
are 1
```

先要用 open() 函数拿到文件的指针。其中，第一个参数指定文件位置（相对位置或者绝对位置）；第二个参数，如果是 'r'表示读取，如果是'w' 则表示写入，当然也可以用'rw' ，表示读写都要。a 则是一个不太常用（但也很有用）的参数，表示追加（append），这样打开的文件，如果需要写入，会从原始文件的最末尾开始写入。

在拿到指针后，我们可以通过 read() 函数，来读取文件的全部内容。代码 text = fin.read() ，即表示把文件所有内容读取到内存中，并赋值给变量 text。这么做自然也是有利有弊：

优点是方便，接下来我们可以很方便地调用 parse 函数进行分析；
缺点是如果文件过大，一次性读取可能造成内存崩溃。

这时，我们可以给 read 指定参数 size ，用来表示读取的最大长度。还可以通过 readline()函数，每次读取一行，这种做法常用于数据挖掘（Data Mining）中的数据清洗，在写一些小的程序时非常轻便。如果每行之间没有关联，这种做法也可以降低内存的压力。而write() 函数，可以把参数中的字符串输出到文件中，也很容易理解。

open() 函数对应于 close() 函数，也就是说，如果你打开了文件，在完成读取任务后，就应该立刻关掉它。而如果你使用了with 语句，就不需要显式调用 close()。在 with 的语境下任务执行完毕后，close() 函数会被自动调用，代码也简洁很多。
最后需要注意的是，所有 I/O 都应该进行错误处理。因为 I/O 操作可能会有各种各样的情况出现，而一个健壮（robust）的程序，需要能应对各种情况的发生，而不应该崩溃（故意设计的情况除外）。

### JSON 序列化与实战

设想一个情景，你要向交易所购买一定数额的股票。那么，你需要提交股票代码、方向（买入 / 卖出）、订单类型（市价 / 限价）、价格（如果是限价单）、数量等一系列参数，而这些数据里，有字符串，有整数，有浮点数，甚至还有布尔型变量，全部混在一起并不方便
交易所解包。

你可以把它简单地理解为两种黑箱：

第一种，输入这些杂七杂八的信息，比如 Python 字典，输出一个字符串；
第二种，输入这个字符串，可以输出包含原始信息的 Python 字典。

```python
import json
params = {
    'symbol': '123456',
    'type': 'limit',
    'price': 123.4,
    'amount': 23
}
params_str = json.dumps(params)
print('after json serialization')
print('type of params_str = {}, params_str = {}'.format(type(params_str), params_str))  # 修复为 params_str
original_params = json.loads(params_str)
print('after json deserialization')
print('type of original_params = {}, original_params = {}'.format(type(original_params), original_params))  # 添加 original_params

# 输出
after json serialization
type of params_str = <class 'str'>, params_str = {"symbol": "123456", "type": "limit", "price": 123.4, "amount": 23}
after json deserialization
type of original_params = <class 'dict'>, original_params = {'symbol': '123456', 'type': 'limit', 'price': 123.4, 'amount': 23}
```

json.dumps() 这个函数，接受 Python 的基本数据类型，然后将其序列化为 string；
而 json.loads() 这个函数，接受一个合法字符串，然后将其反序列化为 Python 的基本数据类型。

记得加上错误处理。不然，哪怕只是给 json.loads() 发送了一个非法字符串，而你没有 catch 到，程序就会崩溃了。

如果我要输出字符串到文件，或者从文件中读取 JSON 字符串，又该怎么办呢？

你仍然可以使用上面提到的 open() 和 read()/write() ，先将字符串读取 / 输出到内存，再进行 JSON 编码 / 解码，当然这有点麻烦。

```python
import json
params = {
    'symbol': '123456',
    'type': 'limit',
    'price': 123.4,
    'amount': 23
}
with open('params.json', 'w') as fout:
    params_str = json.dump(params, fout)
with open('params.json', 'r') as fin:
    original_params = json.load(fin)
print('after json deserialization')
print('type of original_params = {}, original_params = {}'.format(type(original_params), original_params))  # 添加 original_params

# 输出
after json deserialization
type of original_params = <class 'dict'>, original_params = {'symbol': '123456', 'type': 'limit', 'price': 123.4, 'amount': 23}
```

当开发一个第三方应用程序时，你可以通过 JSON 将用户的个人配置输出到文件，方便下次程序启动时自动读取。这也是现在普遍运用的成熟做法。

在 Google，有类似的工具叫做 Protocol Buffer，当然，Google 已经完全开源了这个工具，你可以自己了解一下使用方法。

相比于 JSON，它的优点是生成优化后的二进制文件，因此性能更好。但与此同时，生成的二进制序列，是不能直接阅读的。它在 TensorFlow 等很多对性能有要求的系统中都有广泛的应用。

第一问：你能否把 NLP 例子中的 word count 实现一遍？不过这次，in.txt 可能非常非常大（意味着你不能一次读取到内存中），而 output.txt 不会很大（意味着重复的单词数量很多）。

提示：你可能需要每次读取一定长度的字符串，进行处理，然后再读取下一次的。但是如果
单纯按照长度划分，你可能会把一个单词隔断开，所以需要细心处理这种边界情况。

```python
```

第二问：你应该使用过类似百度网盘、Dropbox 等网盘，但是它们可能空间有限（比如5GB）。如果有一天，你计划把家里的 100GB 数据传送到公司，可惜你没带 U 盘，于是你想了一个主意：

每次从家里向 Dropbox 网盘写入不超过 5GB 的数据，而公司电脑一旦侦测到新数据，就立即拷贝到本地，然后删除网盘上的数据。等家里电脑侦测到本次数据全部传入公司电脑后，再进行下一次写入，直到所有数据都传输过去。

根据这个想法，你计划在家写一个 server.py，在公司写一个 client.py 来实现这个需求。

提示：我们假设每个文件都不超过 5GB。

你可以通过写入一个控制文件（config.json）来同步状态。不过，要小心设计状态，这里有可能产生 race condition。
你也可以通过直接侦测文件是否产生，或者是否被删除来同步状态，这是最简单的做法。

## 07 | 修炼基本功：条件与循环

![image-20250326135105837](https://b2files.173114.xyz/blogimg/2025/03/89c56913bf12dbfdb6ca56f9dc6bfa99.png)

### 循环语句

```python
l = [1, 2, 3, 4]
for item in l:
    print(item)

# 输出
1
2
3
4
```

字典本身只有键是可迭代的，如果我们要遍历它的值或者是键值对，就需要通过其内置的函数 values() 或者 items() 实现。其中，values() 返回字典的值的集合，items() 返回键值对的集合。

```python
d = {'name': 'jason', 'dob': '2000-01-01', 'gender': 'male'}
for k in d: # 遍历字典的键
    print(k)
    
name
dob
gender
```

```python
for v in d.values(): # 遍历字典的值
    print(v)
    
jason
2000-01-01
male
```

```python
for k, v in d.items(): # 遍历字典的键值对
    print('key: {}, value: {}'.format(k, v))

key: name, value: jason
key: dob, value: 2000-01-01
key: gender, value: male
```

我们通常通过 range() 这个函数，拿到索引，再去遍历访问集合中的元素。比如下面的代码，遍历一个列表中的元素，当索引小于 5 时，打印输出：

```python
l = [1, 2, 3, 4, 5, 6, 7]
for index in range(0, len(l)):
    if index < 5:
        print(l[index])
        
1
2
3
4
5
```

当我们同时需要索引和元素时，还有一种更简洁的方式，那就是通过 Python 内置的函数enumerate()。

```python
l = [1, 2, 3, 4, 5, 6, 7]
for index, item in enumerate(l):
    if index < 5:
        print(item)
        
1
2
3
4
5
```

在循环语句中，我们还常常搭配 continue 和 break 一起使用。所谓 continue，就是让程序跳过当前这层循环，继续执行下面的循环；而 break 则是指完全跳出所在的整个循环体。在循环中适当加入 continue 和 break，往往能使程序更加简洁、易读。

比如，给定两个字典，分别是产品名称到价格的映射，和产品名称到颜色列表的映射。我们要找出价格小于 1000，并且颜色不是红色的所有产品名称和颜色的组合。如果不用continue，代码应该是下面这样的：

```python
# name_price: 产品名称 (str) 到价格 (int) 的映射字典
# name_color: 产品名字 (str) 到颜色 (list of str) 的映射字典
for name, price in name_price.items():
    if price < 1000:
        if name in name_color:
            for color in name_color[name]:
                if color != 'red':
                    print('name: {}, color: {}'.format(name, color))
                else:
                    print('name: {}, color: {}'.format(name, 'None'))
```

而加入 continue 后，代码显然清晰了很多：

```python
# name_price: 产品名称 (str) 到价格 (int) 的映射字典
# name_color: 产品名字 (str) 到颜色 (list of str) 的映射字典
for name, price in name_price.items():
    if price >= 1000:
        continue
    if name not in name_color:
        print('name: {}, color: {}'.format(name, 'None'))
        continue
    for color in name_color[name]:
        if color == 'red':
            continue
        print('name: {}, color: {}'.format(name, color))
```

通常来说，如果你只是遍历一个已知的集合，找出满足条件的元素，并进行相应的操作，那么使用 for 循环更加简洁。但如果你需要在满足某个条件前，不停地重复某些操作，并且没有特定的集合需要去遍历，那么一般则会使用 while 循环。
比如，某个交互式问答系统，用户输入文字，系统会根据内容做出相应的回答。为了实现这个功能，我们一般会使用 while 循环，大致代码如下：

```python
while True:
    try:
        text = input('Please enter your questions, enter "q" to exit')
        if text == 'q':
            print('Exit system')
            break
        ...
        ...
        print(response)
    except as err:
        print('Encountered error: {}'.format(err))
    break
```

同时需要注意的是，for 循环和 while 循环的效率问题。比如下面的 while 循环：

```python
i = 0
while i < 1000000:
    i += 1
```

```python
for i in range(0, 1000000):
    pass
```

要知道，range() 函数是直接由 C 语言写的，调用它速度非常快。而 while 循环中的“i+= 1”这个操作，得通过 Python 的解释器间接调用底层的 C 语言；并且这个简单的操作，又涉及到了对象的创建和删除（因为 i 是整型，是 immutable，i += 1 相当于 i =new int(i + 1)）。所以，显然，for 循环的效率更胜一筹。

### 条件与循环的复用

给定下面两个列表 attributes 和 values，要求针对 values 中每一组子列表 value，输出其和 attributes 中的键对应后的字典，最后返回字典组成的列表。

```python
attributes = ['name', 'dob', 'gender']
values = [['jason', '2000-01-01', 'male'],
['mike', '1999-01-01', 'male'],
['nancy', '2001-02-01', 'female']
]
# expected outout:
[{'name': 'jason', 'dob': '2000-01-01', 'gender': 'male'},
{'name': 'mike', 'dob': '1999-01-01', 'gender': 'male'},
{'name': 'nancy', 'dob': '2001-02-01', 'gender': 'female'}]
```

```python
attributes = ['name', 'dob', 'gender']
values = [['jason', '2000-01-01', 'male'],
['mike', '1999-01-01', 'male'],
['nancy', '2001-02-01', 'female']
]

# Method 1: Using list comprehension with zip
result1 = [dict(zip(attributes, value)) for value in values]

# Print the result
print(result1)

# Method 2: Using a loop
result2 = []
for value in values:
    person = {}
    for i in range(len(attributes)):
        person[attributes[i]] = value[i]
    result2.append(person)

# Print the result
print(result2)

```

## 08 | 异常处理：如何提高程序的稳定性？

下面两种写法，你觉得哪种更好呢？

第一种：

```py
try:
    db = DB.connect('<db path>') # 可能会抛出异常
	raw_data = DB.queryData('<viewer_id>') # 可能会抛出异常
except (DBConnectionError, DBQueryDataError) err:
    print('Error: {}'.format(err))
```

第二种：

```python
try:
    db = DB.connect('<db path>') # 可能会抛出异常
    try:
        raw_data = DB.queryData('<viewer_id>')
    except DBQueryDataError as err:
        print('DB query data error: {}'.format(err))
except DBConnectionError as err:
    print('DB connection error: {}'.format(err))
```

第一种写法更加简洁，易于阅读。而且except后面的错误类型先抛出数据库连接错误，之后才抛出查询错误，实现的异常处理和第二种一样。

## 09 | 不可或缺的自定义函数

### 函数基础

```python
def my_func(message):
    print('Got a message: {}'.format(message))
# 调用函数 my_func()
my_func('Hello World')


# 输出
Got a message: Hello World
```

总结一下，大概是下面的这种形式：

```py
def name(param1, param2, ..., paramN):
    statements
    return/yield value # optional
```

```python
def my_sum(a, b):
    return a + b
result = my_sum(3, 5)
print(result)
print(my_sum([1, 2], [3, 4]))
print(my_sum('hello ', 'world'))


8
[1, 2, 3, 4]
hello world
```

```python
def find_largest_element(l):
    if not isinstance(l, list):
        print('input is not type of list')
        return
    if len(l) == 0:
        print('empty input')
        return
    largest_element = l[0]
    for item in l:
        if item > largest_element:
            largest_element = item
    print('largest element is: {}'.format(largest_element))
find_largest_element([8, 1,-3, 2, 0])


largest element is: 8
```

如果我们在函数内部调用其他函数，函数间哪个声明在前、哪个在后就无所谓，因为def 是可执行语句，函数在调用之前都不存在，我们只需保证调用时，所需的函数都已经声明定义：

```py
def my_func(message):
    my_sub_func(message) # 调用 my_sub_func() 在其声明之前不影响程序执行
def my_sub_func(message):
    print('Got a message: {}'.format(message))
my_func('hello world')

Got a message: hello world
```

Python 函数的参数可以设定默认值，比如下面这样的写法：

```python
def func(param = 0):
    ...
```



```python
def f1():
    print('hello')
    def f2():
        print('world')
    f2()
f1()

hello
world
```

函数的嵌套，主要有下面两个方面的作用。

第一，函数的嵌套能够保证内部函数的隐私。内部函数只能被外部函数所调用和访问，不会暴露在全局作用域，因此，如果你的函数内部有一些隐私数据（比如数据库的用户、密码等），不想暴露在外，那你就可以使用函数的的嵌套，将其封装在内部函数中，只通过外部函数来访问。比如：

```python
def connect_DB():
    def get_DB_configuration():
        ...
        return host, username, password
    conn = connector.connect(get_DB_configuration())
    return conn
```

这里的函数 get_DB_configuration，便是内部函数，它无法在 connect_DB() 函数以外被单独调用。也就是说，下面这样的外部直接调用是错误的：

```python
get_DB_configuration()
# 输出
NameError: name 'get_DB_configuration' is not defined
```

我们只能通过调用外部函数 connect_DB() 来访问它，这样一来，程序的安全性便有了很大的提高。

第二，合理的使用函数嵌套，能够提高程序的运行效率。我们来看下面这个例子：

```python
def factorial(input):
    # validation check
    if not isinstance(input, int):
        raise Exception('input must be an integer.')
    if input < 0:
        raise Exception('input must be greater or equal to 0' )
    ...
    def inner_factorial(input):
        if input <= 1:
            return 1
        return input * inner_factorial(input-1)
    return inner_factorial(input)
print(factorial(5))
```

这里，我们使用递归的方式计算一个数的阶乘。因为在计算之前，需要检查输入是否合法，所以我写成了函数嵌套的形式，这样一来，输入是否合法就只用检查一次。而如果我们不使用函数嵌套，那么每调用一次递归便会检查一次，这是没有必要的，也会降低程序的运行效率。
实际工作中，如果你遇到相似的情况，输入检查不是很快，还会耗费一定的资源，那么运用函数的嵌套就十分必要了。

### 函数变量作用域

如果变量是在函数内部定义的，就称为局部变量，只在函数内部有效。一旦函数执行完毕，局部变量就会被回收，无法访问，比如下面的例子：

```python
def read_text_from_file(file_path):
    with open(file_path) as file:
        ...
```

我们在函数内部定义了 file 这个变量，这个变量只在 read_text_from_file 这个函数里有效，在函数外部则无法访问。

相对应的，全局变量则是定义在整个文件层次上的，比如下面这段代码：

```python
MIN_VALUE = 1
MAX_VALUE = 10
def validation_check(value):
    if value < MIN_VALUE or value > MAX_VALUE:
        raise Exception('validation check fails')
```

### 闭包

闭包其实和刚刚讲的嵌套函数类似，不同的是，这里外部函数返回的是一个函数，而不是一个具体的值。返回的函数通常赋于一个变量，这个变量可以在后面被继续执行调用。

比如，我们想计算一个数的 n 次幂，用闭包可以写成下面的代码：

```python
def nth_power(exponent):
    def exponent_of(base):
        return base ** exponent
    return exponent_of # 返回值是 exponent_of 函数
square = nth_power(2) # 计算一个数的平方
cube = nth_power(3) # 计算一个数的立方
square
# 
<function __main__.nth_power.<locals>.exponent_of(base)>

cube
<function __main__.nth_power.<locals>.exponent_of(base)>

print(square(2)) # 计算 2 的平方
print(cube(2)) # 计算 2 的立方

4
8
```

## 10 | 简约不简单的匿名函数

```python
lambda argument1, argument2,... argumentN : expression
```

```python
square = lambda x: x**2
square(3)

9

def square(x):
    return x**2
square(3)

9
```

```python
[(lambda x: x*x)(x) for x in range(10)]
# 输出
[0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
```

```python
l = [(1, 20), (3, 0), (9, 10), (2, -1)]
l.sort(key=lambda x: x[1]) # 按列表中元祖的第二个元素排序
print(l)
# 输出
[(2, -1), (3, 0), (9, 10), (1, 20)]

```

```python
# 在 Python 的 Tkinter GUI 应用中，我们想实现这样一个简单的功能：创建显示一个按钮，每当用户点击时，就打印出一段文字。如果使用 lambda 函数可以表示成下面这样：
from tkinter import Button, mainloop
button = Button(
    text='This is a button',
    command=lambda: print('being pressed')) # 点击时调用 lambda 函数
button.pack()
mainloop()

# 而如果我们用常规函数 def，那么需要写更多的代码：
from tkinter import Button, mainloop
def print_message():
    print('being pressed')
button = Button(
    text='This is a button',
    command=print_message) # 点击时调用 lambda 函数
button.pack()
mainloop()
```

### Python 函数式编程

所谓函数式编程，是指代码中每一块都是不可变的（immutable），都由纯函数（purefunction）的形式组成。这里的纯函数，是指函数本身相互独立、互不影响，对于相同的输入，总会有相同的输出，没有任何副作用。

```python
l = [1, 2, 3, 4, 5]
new_list = map(lambda x: x * 2, l) # [2， 4， 6， 8， 10]
```

```python
python3 -mtimeit -s'xs=range(1000000)' 'map(lambda x: x*2, xs)'
2000000 loops, best of 5: 171 nsec per loop
python3 -mtimeit -s'xs=range(1000000)' '[x * 2 for x in xs]'
5 loops, best of 5: 62.9 msec per loop
python3 -mtimeit -s'xs=range(1000000)' 'l = []' 'for i in xs: l.append(i * 2)'
5 loops, best of 5: 92.7 msec per loop
```

map() 是最快的。因为 map() 函数直接由 C 语言写的，运行时不需要通过Python 解释器间接调用，并且内部做了诸多优化，所以运行速度最快。

filter() 函数表示对 iterable 中的每个元素，都使用 function 判断，并返回True 或者 False，最后将返回 True 的元素组成一个新的可遍历的集合。

```python
l = [1, 2, 3, 4, 5]
new_list = filter(lambda x: x % 2 == 0, l) # [2, 4]
```

举个例子，我想要计算某个列表元素的乘积，就可以用 reduce() 函数来表示：

```python
l = [1, 2, 3, 4, 5]
product = reduce(lambda x, y: x * y, l) # 1*2*3*4*5 = 120
```

当然，类似的，filter() 和 reduce() 的功能，也可以用 for 循环或者 list comprehension来实现。
通常来说，在我们想对集合中的元素进行一些操作时，如果操作非常简单，比如相加、累积这种，那么我们优先考虑 map()、filter()、reduce() 这类或者 list comprehension 的形式。至于这两种方式的选择：

在数据量非常多的情况下，比如机器学习的应用，那我们一般更倾向于函数式编程的表示，因为效率更高；
在数据量不多的情况下，并且你想要程序更加 Pythonic 的话，那么 listcomprehension 也不失为一个好选择。

如果你要对集合中的元素，做一些比较复杂的操作，那么，考虑到代码的可读性，我们通常会使用 for 循环，这样更加清晰明了。

如果让你对一个字典，根据值进行由高到底的排序，该怎么做呢？以下面这段代码为例，你可以思考一下。

```python
d = {'mike': 10, 'lucy': 2, 'ben': 30}
sorted_d = dict(sorted(d.items(), key=lambda x: x[1], reverse=True))
print(sorted_d)  # 输出: {'ben': 30, 'mike': 10, 'lucy': 2}
```

在实际工作学习中，你遇到过哪些使用匿名函数的场景呢？

## 11 | 面向对象（上）：从生活中的类比说起

### 对象，你找到了吗？

```python
class Document():
    def __init__(self, title, author, context):
        print('init function called')
        self.title = title
        self.author = author
        self.__context = context # __ 开头的属性是私有属性
    def get_context_length(self):
        return len(self.__context)
    def intercept_context(self, length):
        self.__context = self.__context[:length]
harry_potter_book = Document('Harry Potter', 'J. K. Rowling', '... Forever Do not believ')
print(harry_potter_book.title)
print(harry_potter_book.author)
print(harry_potter_book.get_context_length())
harry_potter_book.intercept_context(10)
print(harry_potter_book.get_context_length())
print(harry_potter_book.__context)


init function called
Harry Potter
J. K. Rowling
25
10

---------------------------------------------------------------------------
AttributeError                            Traceback (most recent call last)
Cell In[7], line 17
     15 harry_potter_book.intercept_context(10)
     16 print(harry_potter_book.get_context_length())
---> 17 print(harry_potter_book.__context)

AttributeError: 'Document' object has no attribute '__context'
```

如何在一个类中定义一些常量，每个对象都可以方便访问这些常量而不用重新构造？
如果一个函数不涉及到访问修改这个类的属性，而放到类外面有点不恰当，怎么做才能更优雅呢？
既然类是一群相似的对象的集合，那么可不可以是一群相似的类的集合呢？

```python
class Document():
    WELCOME_STR = 'Welcome! The context for this book is {}.'
    def __init__(self, title, author, context):
        print('init function called')
        self.title = title
        self.author = author
        self.__context = context
    # 类函数
    @classmethod
    def create_empty_book(cls, title, author):
        return cls(title=title, author=author, context='nothing')
# 成员函数
    def get_context_length(self):
        return len(self.__context)
# 静态函数
    @staticmethod
    def get_welcome(context):
        return Document.WELCOME_STR.format(context)
empty_book = Document.create_empty_book('What Every Man Thinks About Apart from Sex', 'Professor Sheridan Simove')
print(empty_book.get_context_length())
print(empty_book.get_welcome('indeed nothing'))

########## 输出 ##########

init function called
7
Welcome! The context for this book is indeed nothing.

```

### 继承，是每个富二代的梦想

```python
class Entity:
    def __init__(self, object_type):
        print('parent calss init called')
        self.object_type = object_type

    def get_context_length(self):
        raise Exception('get_context_length not implemented')

    def print_title(self):
        print(self.title)


class Document(Entity):
    def __init__(self, title, author, context):
        print('Document class init called')
        Entity.__init__(self, 'document')
        self.title = title
        self.author = author
        self.__context = context

    def get_context_length(self):
        return len(self.__context)


class Video(Entity):
    def __init__(self, title, author, video_length):
        print('Video class init called')
        Entity.__init__(self, 'video')
        self.title = title
        self.author = author
        self.__video_length = video_length

    def get_context_length(self):
        return self.__video_length


harry_potter_book = Document('Harry Potter(Book)', 'J. K. Rowling',
                             '... Forever Do not believe any thing is capable of thinking independently ...')
harry_potter_movie = Video('Harry Potter(Movie)', 'J. K. Rowling', 120)

print(harry_potter_book.object_type)
print(harry_potter_movie.object_type)

harry_potter_book.print_title()
harry_potter_movie.print_title()

print(harry_potter_book.get_context_length())
print(harry_potter_movie.get_context_length())

Document class init called
parent calss init called
Video class init called
parent calss init called
document
video
Harry Potter(Book)
Harry Potter(Movie)
77
120

```

每个类都有构造函数，继承类在生成对象的时候，是不会自动调用父类的构造函数的，因此你必须在 init() 函数中显式调用父类的构造函数。它们的执行顺序是 子类的构造函数 -> 父类的构造函数。

既然你能通过继承一个类，来获得父类的函数和属性，那么你能继承两个吗？答案自是能的，这就叫做多重继承。那么问题来了。
我们使用单一继承的时候，构造函数的执行顺序很好确定，即子类 -> 父类 -> 爷类 ->…的链式关系。不过，多重继承的时候呢？比如下面这个例子。

```
--->B---
A-   -->D
--->C---
```

这种继承方式，叫做菱形继承，BC 继承了 A，然后 D 继承了 BC，创造一个 D 的对象。那么，构造函数调用顺序又是怎样的呢？

```python
class A:
    def __init__(self):
        print("A 的构造函数被调用")

class BC(A):
    def __init__(self):
        super().__init__()  # 调用父类 A 的构造函数
        print("BC 的构造函数被调用")

class D(BC):
    def __init__(self):
        super().__init__()  # 调用父类 BC 的构造函数
        print("D 的构造函数被调用")

# 创建 D 的对象
d = D()


A 的构造函数被调用
BC 的构造函数被调用
D 的构造函数被调用

```

## 12 | 面向对象（下）：如何实现一个搜索引擎？

```
1.txt
I have a dream that my four little children will one day live in a nation where they will not be judged by the color of their skin but by the content of their character. I have a dream today.

2.txt
I have a dream that one day down in Alabama, with its vicious racists, . . . one day right there in Alabama little black boys and black girls will be able to join hands with little white boys and white girls as sisters and brothers. I have a dream today.

3.txt
I have a dream that one day every valley shall be exalted, every hill and mountain shall be made low, the rough places will be made plain, and the crooked places will be made straight, and the glory of the Lord shall be revealed, and all flesh shall see it together.

4.txt
This is our hope. . . With this faith we will be able to hew out of the mountain of despair a stone of hope. With this faith we will be able to transform the jangling discords of our nation into a beautiful symphony of brotherhood. With this faith we will be able to work together, to pray together, to struggle together, to go to jail together, to stand up for freedom together, knowing that we will be free one day. . . .

5.txt
And when this happens, and when we allow freedom ring, when we let it ring from every village and every hamlet, from every state and every city, we will be able to speed up that day when all of God's children, black men and white men, Jews and Gentiles, Protestants and Catholics, will be able to join hands and sing in the words of the old Negro spiritual: "Free at last! Free at last! Thank God Almighty, we are free at last!"
```

```python
class SearchEngineBase(object):
    def __init__(self):
        pass

    def add_corpus(self, file_path):
        with open(file_path, 'r') as fin:
            text = fin.read()
        self.process_corpus(file_path, text)

    def process_corpus(self, id, text):
        raise Exception('process_corpus not implemented')

    def search(self, query):
        raise Exception('search not implemented')


def main(search_engine):
    for file_path in ['1.txt', '2.txt', '3.txt', '4.txt', '5.txt']:
        search_engine.add_corpus(file_path)

    while True:
        query = input('请输入要搜索的关键词：')
        results = search_engine.search(query)
        print('found {} result(s):'.format(len(results)))
        for result in results:
            print(result)


class SimpleEngine(SearchEngineBase):
    def __init__(self):
        super(SimpleEngine, self).__init__()
        self.__id_to_texts = {}

    def process_corpus(self, id, text):
        self.__id_to_texts[id] = text

    def search(self, query):
        results = []
        for id, text in self.__id_to_texts.items():
            if query in text:
                results.append(id)
        return results


if __name__ == '__main__':
    search_engine = SimpleEngine()
    main(search_engine)
```

```python
class SimpleEngine(SearchEngineBase):
    def __init__(self):
        super(SimpleEngine, self).__init__()
        self.__id_to_texts = {}
    def process_corpus(self, id, text):
        self.__id_to_texts[id] = text
    def search(self, query):
        results = []
        for id, text in self.__id_to_texts.items():
            if query in text:
                results.append(id)
        return results
search_engine = SimpleEngine()
main(search_engine)
```

测试更新包
二次测试keel