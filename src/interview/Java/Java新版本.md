---
# dir:
#     text: Java全栈面试
#     icon: laptop-code
#     collapsible: true
#     expanded: true
#     link: true
#     index: true
title: Java 新版本
index: true
headerDepth: 3
order: 6
# icon: laptop-code
# sidebar: true
# toc: true
# editLink: false
---
## 6 Java 新版本

> Java 8版本特性，及Java8+版本特性。

### 6.1 Java 8 特性

#### 什么是函数式编程？Lambda表达式？

- **函数式编程**

面向对象编程是对数据进行抽象；函数式编程是对行为进行抽象。

核心思想: 使用不可变值和函数，函数对一个值进行处理，映射成另一个值。

- **Lambda表达式**

lambda表达式仅能放入如下代码: 预定义使用了 `@Functional` 注释的函数式接口，自带一个抽象函数的方法，或者SAM(Single Abstract Method 单个抽象方法)类型。这些称为lambda表达式的目标类型，可以用作返回类型，或lambda目标代码的参数。例如，若一个方法接收Runnable、Comparable或者 Callable 接口，都有单个抽象方法，可以传入lambda表达式。类似的，如果一个方法接受声明于 java.util.function 包内的接口，例如 Predicate、Function、Consumer 或 Supplier，那么可以向其传lambda表达式

#### Stream中常用方法？

- `stream()`, `parallelStream()`
- `filter()`
- `findAny()` `findFirst()`
- `sort`
- `forEach` void
- `map(), reduce()`
- `flatMap()` - 将多个Stream连接成一个Stream
- `collect(Collectors.toList())`
- `distinct`, `limit`
- `count`
- `min`, `max`, `summaryStatistics`

#### 什么是FunctionalInterface？

```java
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface FunctionalInterface{}
```

- interface做注解的注解类型，被定义成java语言规
- 一个被它注解的接口只能有一个抽象方法，有两种例外
- 第一是接口允许有实现的方法，这种实现的方法是用default关键字来标记的(java反射中java.lang.reflect.Method#isDefault()方法用来判断是否是default方法)
- 第二如果声明的方法和java.lang.Object中的某个方法一样，它可以不当做未实现的方法，不违背这个原则: 一个被它注解的接口只能有一个抽象方法, 比如: `java public interface Comparator<T> { int compare(T o1, T o2); boolean equals(Object obj); }`
- 如果一个类型被这个注解修饰，那么编译器会要求这个类型必须满足如下条件:
  - 这个类型必须是一个interface，而不是其他的注解类型、枚举enum或者类class
  - 这个类型必须满足function interface的所有要求，如你个包含两个抽象方法的接口增加这个注解，会有编译错误。
- 编译器会自动把满足function interface要求的接口自动识别为function interface。

#### 如何自定义函数接口？

```java
@FunctionalInterface
public interface IMyInterface {
    void study();
}

public class TestIMyInterface {
    public static void main(String[] args) {
        IMyInterface iMyInterface = () -> System.out.println("I like study");
        iMyInterface.study();
    }
}
```

#### 内置的四大函数接口及使用？

- **消费型接口: Consumer< T> void accept(T t)有参数，无返回值的抽象方法**；

```java
Consumer<Person> greeter = (p) -> System.out.println("Hello, " + p.firstName);
greeter.accept(new Person("Luke", "Skywalker"));
```

- **供给型接口: Supplier < T> T get() 无参有返回值的抽象方法**；

以stream().collect(Collector<? super T, A, R> collector)为例:

比如:

```java
Supplier<Person> personSupplier = Person::new;
personSupplier.get();   // new Person
```



```java
断定型接口: Predicate<T> boolean test(T t):有参，但是返回值类型是固定的boolean
比如: steam().filter()中参数就是Predicate

Predicate<String> predicate = (s) -> s.length() > 0;

predicate.test("foo");              // true
predicate.negate().test("foo");     // false

Predicate<Boolean> nonNull = Objects::nonNull;
Predicate<Boolean> isNull = Objects::isNull;

Predicate<String> isEmpty = String::isEmpty;
Predicate<String> isNotEmpty = isEmpty.negate();

函数型接口: Function<T,R> R apply(T t)有参有返回值的抽象方法；
比如: steam().map() 中参数就是Function<? super T, ? extends R>；reduce()中参数BinaryOperator<T> (ps: BinaryOperator<T> extends BiFunction<T,T,T>)
    
Function<String, Integer> toInteger = Integer::valueOf;
Function<String, String> backToString = toInteger.andThen(String::valueOf);

backToString.apply("123");     // "123"    
```

#### Optional要解决什么问题？

在调用一个方法得到了返回值却不能直接将返回值作为参数去调用别的方法，我们首先要判断这个返回值是否为null，只有在非空的前提下才能将其作为其他方法的参数。Java 8引入了一个新的Optional类：这是一个可以为null的容器对象，如果值存在则isPresent()方法会返回true，调用get()方法会返回该对象。

#### 如何使用Optional来解决嵌套对象的判空问题？

假设我们有一个像这样的类层次结构:

```java
class Outer {
    Nested nested;
    Nested getNested() {
        return nested;
    }
}
class Nested {
    Inner inner;
    Inner getInner() {
        return inner;
    }
}
class Inner {
    String foo;
    String getFoo() {
        return foo;
    }
}
```

解决这种结构的深层嵌套路径是有点麻烦的。我们必须编写一堆 null 检查来确保不会导致一个 NullPointerException:

```java
Outer outer = new Outer();
if (outer != null && outer.nested != null && outer.nested.inner != null) {
    System.out.println(outer.nested.inner.foo);
}
```

我们可以通过利用 Java 8 的 Optional 类型来摆脱所有这些 null 检查。map 方法接收一个 Function 类型的 lambda 表达式，并自动将每个 function 的结果包装成一个 Optional 对象。这使我们能够在一行中进行多个 map 操作。Null 检查是在底层自动处理的。

```java
Optional.of(new Outer())
    .map(Outer::getNested)
    .map(Nested::getInner)
    .map(Inner::getFoo)
    .ifPresent(System.out::println);
```

还有一种实现相同作用的方式就是通过利用一个 supplier 函数来解决嵌套路径的问题:

```java
Outer obj = new Outer();
resolve(() -> obj.getNested().getInner().getFoo())
    .ifPresent(System.out::println);
```

#### 什么是默认方法，为什么要有默认方法？

就是接口可以有实现方法，而且不需要实现类去实现其方法。只需在方法名前面加个default关键字即可。

```java
public interface A {
    default void foo(){
       System.out.println("Calling A.foo()");
    }
}

public class Clazz implements A {
    public static void main(String[] args){
       Clazz clazz = new Clazz();
       clazz.foo();//调用A.foo()
    }
}
```

- **为什么出现默认方法**？

首先，之前的接口是个双刃剑，好处是面向抽象而不是面向具体编程，缺陷是，当需要修改接口时候，需要修改全部实现该接口的类，目前的java 8之前的集合框架没有foreach方法，通常能想到的解决办法是在JDK里给相关的接口添加新的方法及实现。然而，对于已经发布的版本，是没法在给接口添加新方法的同时不影响已有的实现。所以引进的默认方法。他们的目的是为了解决接口的修改与现有的实现不兼容的问题。

#### 什么是类型注解？

类型注解**被用来支持在Java的程序中做强类型检查。配合插件式的check framework，可以在编译的时候检测出runtime error，以提高代码质量**。这就是类型注解的作用了。

1. 在java 8之前，注解只能是在声明的地方所使用，比如类，方法，属性；
2. java 8里面，注解可以应用在任何地方，比如:

创建类实例

```java
new @Interned MyObject();
```

类型映射

```java
myString = (@NonNull String) str;
```

implements 语句中

```java
class UnmodifiableList<T> implements @Readonly List<@Readonly T> { … }
```

throw exception声明

```java
void monitorTemperature() throws @Critical TemperatureException { … }
```

需要注意的是，**类型注解只是语法而不是语义，并不会影响java的编译时间，加载时间，以及运行时间，也就是说，编译成class文件的时候并不包含类型注解**。

#### 什么是重复注解？

允许在同一申明类型(类，属性，或方法)的多次使用同一个注解

- **JDK8之前**

java 8之前也有重复使用注解的解决方案，但可读性不是很好，比如下面的代码:

```java
public @interface Authority {
     String role();
}

public @interface Authorities {
    Authority[] value();
}

public class RepeatAnnotationUseOldVersion {

    @Authorities({@Authority(role="Admin"),@Authority(role="Manager")})
    public void doSomeThing(){
    }
}
```

由另一个注解来存储重复注解，在使用时候，用存储注解Authorities来扩展重复注解。

- **Jdk8重复注解**

我们再来看看java 8里面的做法:

```java
@Repeatable(Authorities.class)
public @interface Authority {
     String role();
}

public @interface Authorities {
    Authority[] value();
}

public class RepeatAnnotationUseNewVersion {
    @Authority(role="Admin")
    @Authority(role="Manager")
    public void doSomeThing(){ }
}
```

不同的地方是，创建重复注解Authority时，加上@Repeatable,指向存储注解Authorities，在使用时候，直接可以重复使用Authority注解。从上面例子看出，java 8里面做法更适合常规的思维，可读性强一点

### 6.2 Java 9+ 特性

#### Java 9后续版本发布是按照什么样的发布策略呢？

Java现在发布的版本很快，每年两个，但是真正会被大规模使用的是三年一个的TLS版本。@pdai

- 每3年发布一个TLS，长期维护版本。意味着Java 8 ，Java 11， Java 17 才可能被大规模使用。
- 每年发布两个正式版本，分别是3月份和9月份。

#### Java 9后续新版本中你知道哪些？

能够举几个即可：

- **Java10 - 并行全垃圾回收器 G1**

大家如果接触过 Java 性能调优工作，应该会知道，调优的最终目标是通过参数设置来达到快速、低延时的内存垃圾回收以提高应用吞吐量，尽可能的避免因内存回收不及时而触发的完整 GC（Full GC 会带来应用出现卡顿）。

G1 垃圾回收器是 Java 9 中 Hotspot 的默认垃圾回收器，是以一种低延时的垃圾回收器来设计的，旨在避免进行 Full GC，但是当并发收集无法快速回收内存时，会触发垃圾回收器回退进行 Full GC。之前 Java 版本中的 G1 垃圾回收器执行 GC 时采用的是基于单线程标记扫描压缩算法（mark-sweep-compact）。为了最大限度地减少 Full GC 造成的应用停顿的影响，Java 10 中将为 G1 引入多线程并行 GC，同时会使用与年轻代回收和混合回收相同的并行工作线程数量，从而减少了 Full GC 的发生，以带来更好的性能提升、更大的吞吐量。

Java 10 中将采用并行化 mark-sweep-compact 算法，并使用与年轻代回收和混合回收相同数量的线程。具体并行 GC 线程数量可以通过： `-XX：ParallelGCThreads` 参数来调节，但这也会影响用于年轻代和混合收集的工作线程数。

- **Java11 - ZGC：可伸缩低延迟垃圾收集器**

ZGC 即 Z Garbage Collector（垃圾收集器或垃圾回收器），这应该是 Java 11 中最为瞩目的特性，没有之一。ZGC 是一个可伸缩的、低延迟的垃圾收集器，主要为了满足如下目标进行设计：

1. GC 停顿时间不超过 10ms
2. 即能处理几百 MB 的小堆，也能处理几个 TB 的大堆
3. 应用吞吐能力不会下降超过 15%（与 G1 回收算法相比）
4. 方便在此基础上引入新的 GC 特性和利用 colord
5. 针以及 Load barriers 优化奠定基础
6. 当前只支持 Linux/x64 位平台

停顿时间在 10ms 以下，10ms 其实是一个很保守的数据，即便是 10ms 这个数据，也是 GC 调优几乎达不到的极值。根据 SPECjbb 2015 的基准测试，128G 的大堆下最大停顿时间才 1.68ms，远低于 10ms，和 G1 算法相比，改进非常明显。

![img](https://pdai.tech/images/java/java-11-1.png)

- **Java 14 - Switch 表达式**（正式版）

switch 表达式在之前的 Java 12 和 Java 13 中都是处于预览阶段，而在这次更新的 Java 14 中，终于成为稳定版本，能够正式可用。

switch 表达式带来的不仅仅是编码上的简洁、流畅，也精简了 switch 语句的使用方式，同时也兼容之前的 switch 语句的使用；之前使用 switch 语句时，在每个分支结束之前，往往都需要加上 break 关键字进行分支跳出，以防 switch 语句一直往后执行到整个 switch 语句结束，由此造成一些意想不到的问题。switch 语句一般使用冒号 ：来作为语句分支代码的开始，而 switch 表达式则提供了新的分支切换方式，即 -> 符号右则表达式方法体在执行完分支方法之后，自动结束 switch 分支，同时 -> 右则方法块中可以是表达式、代码块或者是手动抛出的异常。以往的 switch 语句写法如下：

```java
int dayOfWeek;
switch (day) {
    case MONDAY:
    case FRIDAY:
    case SUNDAY:
        dayOfWeek = 6;
        break;
    case TUESDAY:
        dayOfWeek = 7;
        break;
    case THURSDAY:
    case SATURDAY:
        dayOfWeek = 8;
        break;
    case WEDNESDAY:
        dayOfWeek = 9;
        break;
    default:
        dayOfWeek = 0;
        break;
}
```

而现在 Java 14 可以使用 switch 表达式正式版之后，上面语句可以转换为下列写法：

```java
int dayOfWeek = switch (day) {
    case MONDAY, FRIDAY, SUNDAY -> 6;
    case TUESDAY                -> 7;
    case THURSDAY, SATURDAY     -> 8;
case WEDNESDAY              -> 9;
    default              -> 0;

};
```

很明显，switch 表达式将之前 switch 语句从编码方式上简化了不少，但是还是需要注意下面几点：

1. 需要保持与之前 switch 语句同样的 case 分支情况。
2. 之前需要用变量来接收返回值，而现在直接使用 yield 关键字来返回 case 分支需要返回的结果。
3. 现在的 switch 表达式中不再需要显式地使用 return、break 或者 continue 来跳出当前分支。
4. 现在不需要像之前一样，在每个分支结束之前加上 break 关键字来结束当前分支，如果不加，则会默认往后执行，直到遇到 break 关键字或者整个 switch 语句结束，在 Java 14 表达式中，表达式默认执行完之后自动跳出，不会继续往后执行。
5. 对于多个相同的 case 方法块，可以将 case 条件并列，而不需要像之前一样，通过每个 case 后面故意不加 break 关键字来使用相同方法块。

使用 switch 表达式来替换之前的 switch 语句，确实精简了不少代码，提高了编码效率，同时也可以规避一些可能由于不太经意而出现的意想不到的情况，可见 Java 在提高使用者编码效率、编码体验和简化使用方面一直在不停的努力中，同时也期待未来有更多的类似 lambda、switch 表达式这样的新特性出来。

- **Java 14 - Records**

在 Java 14 中引入了 Record 类型，其效果有些类似 Lombok 的 @Data 注解、Kotlin 中的 data class，但是又不尽完全相同，它们的共同点都是类的部分或者全部可以直接在类头中定义、描述，并且这个类只用于存储数据而已。对于 Record 类型，具体可以用下面代码来说明：

```java
public record Person(String name, int age) {
    public static String address;

    public String getName() {
        return name;
    }
}
```

对上述代码进行编译，然后反编译之后可以看到如下结果：

```java
public final class Person extends java.lang.Record {
    private final java.lang.String name;
    private final java.lang.String age;

    public Person(java.lang.String name, java.lang.String age) { /* compiled code */ }

    public java.lang.String getName() { /* compiled code */ }

    public java.lang.String toString() { /* compiled code */ }

    public final int hashCode() { /* compiled code */ }

    public final boolean equals(java.lang.Object o) { /* compiled code */ }

    public java.lang.String name() { /* compiled code */ }

    public java.lang.String age() { /* compiled code */ }
}
```

