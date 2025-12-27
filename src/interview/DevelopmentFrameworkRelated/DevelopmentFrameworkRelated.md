---
# dir:
#     text: Java全栈面试
#     icon: laptop-code
#     collapsible: true
#     expanded: true
#     link: true
#     index: true
title: 开发框架和中间件
index: true
toc:
  levels: 3
# icon: laptop-code
# sidebar: true
# toc: true
# editLink: false

---

## 10 开发框架和中间件

> 开发框架相关

### 10.1 Spring

#### 什么是Spring框架？

Spring是一种轻量级框架，旨在提高开发人员的开发效率以及系统的可维护性。

我们一般说的Spring框架就是Spring Framework，它是很多模块的集合，使用这些模块可以很方便地协助我们进行开发。这些模块是核心容器、数据访问/集成、Web、AOP（面向切面编程）、工具、消息和测试模块。比如Core Container中的Core组件是Spring所有组件的核心，Beans组件和Context组件是实现IOC和DI的基础，AOP组件用来实现面向切面编程。

Spring官网列出的Spring的6个特征：

- 核心技术：依赖注入（DI），AOP，事件（Events），资源，i18n，验证，数据绑定，类型转换，SpEL。
- 测试：模拟对象，TestContext框架，Spring MVC测试，WebTestClient。
- 数据访问：事务，DAO支持，JDBC，ORM，编组XML。
- Web支持：Spring MVC和Spring WebFlux Web框架。
- 集成：远程处理，JMS，JCA，JMX，电子邮件，任务，调度，缓存。
- 语言：Kotlin，Groovy，动态语言。

#### 列举一些重要的Spring模块？

下图对应的是Spring 4.x的版本，目前最新的5.x版本中Web模块的Portlet组件已经被废弃掉，同时增加了用于异步响应式处理的WebFlux组件。

- Spring Core：基础，可以说Spring其他所有的功能都依赖于该类库。主要提供IOC和DI功能。
- Spring Aspects：该模块为与AspectJ的集成提供支持。
- Spring AOP：提供面向切面的编程实现。
- Spring JDBC：Java数据库连接。
- Spring JMS：Java消息服务。
- Spring ORM：用于支持Hibernate等ORM工具。
- Spring Web：为创建Web应用程序提供支持。
- Spring Test：提供了对JUnit和TestNG测试的支持。

![img](https://b2files.173114.xyz/blogimg/2025/03/1530fa2dda5c32de7fdad2c211306e11.png)

#### 什么是IOC? 如何实现的？

IOC（Inversion Of Controll，控制反转）是一种设计思想，就是将原本在程序中手动创建对象的控制权，交给IOC容器来管理，并由IOC容器完成对象的注入。这样可以很大程度上简化应用的开发，把应用从复杂的依赖关系中解放出来。IOC容器就像是一个工厂一样，当我们需要创建一个对象的时候，只需要配置好配置文件/注解即可，完全不用考虑对象是如何被创建出来的。

Spring 中的 IoC 的实现原理就是工厂模式加反射机制。

示例：

```java
interface Fruit {
     public abstract void eat();
}
class Apple implements Fruit {
    public void eat(){
        System.out.println("Apple");
    }
}
class Orange implements Fruit {
    public void eat(){
        System.out.println("Orange");
    }
}
class Factory {
    public static Fruit getInstance(String ClassName) {
        Fruit f=null;
        try {
            f=(Fruit)Class.forName(ClassName).newInstance();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return f;
    }
}
class Client {
    public static void main(String[] a) {
        Fruit f=Factory.getInstance("io.github.dunwu.spring.Apple");
        if(f!=null){
            f.eat();
        }
    }
}
```

#### 什么是AOP? 有哪些AOP的概念？

AOP（Aspect-Oriented Programming，面向切面编程）能够将那些与业务无关，却为业务模块所共同调用的逻辑或责任（例如事务处理、日志管理、权限控制等）封装起来，便于减少系统的重复代码，降低模块间的耦合度，并有利于未来的可扩展性和可维护性。

Spring AOP是基于动态代理的，如果要代理的对象实现了某个接口，那么Spring AOP就会使用JDK动态代理去创建代理对象；而对于没有实现接口的对象，就无法使用JDK动态代理，转而使用CGlib动态代理生成一个被代理对象的子类来作为代理。

![img](https://b2files.173114.xyz/blogimg/2025/03/2fe8e2da1581b092c0f32df7728be4b1.png)

当然也可以使用AspectJ，Spring AOP中已经集成了AspectJ，AspectJ应该算得上是Java生态系统中最完整的AOP框架了。使用AOP之后我们可以把一些通用功能抽象出来，在需要用到的地方直接使用即可，这样可以大大简化代码量。我们需要增加新功能也方便，提高了系统的扩展性。日志功能、事务管理和权限管理等场景都用到了AOP。

**AOP包含的几个概念**

1. Jointpoint（连接点）：具体的切面点点抽象概念，可以是在字段、方法上，Spring中具体表现形式是PointCut（切入点），仅作用在方法上。
2. Advice（通知）: 在连接点进行的具体操作，如何进行增强处理的，分为前置、后置、异常、最终、环绕五种情况。
3. 目标对象：被AOP框架进行增强处理的对象，也被称为被增强的对象。
4. AOP代理：AOP框架创建的对象，简单的说，代理就是对目标对象的加强。Spring中的AOP代理可以是JDK动态代理，也可以是CGLIB代理。
5. Weaving（织入）：将增强处理添加到目标对象中，创建一个被增强的对象的过程

总结为一句话就是：在目标对象（target object）的某些方法（jointpoint）添加不同种类的操作（通知、增强操处理），最后通过某些方法（weaving、织入操作）实现一个新的代理目标对象。

#### AOP 有哪些应用场景？

举几个例子：

- 记录日志(调用方法后记录日志)
- 监控性能(统计方法运行时间)
- 权限控制(调用方法前校验是否有权限)
- 事务管理(调用方法前开启事务，调用方法后提交关闭事务 )
- 缓存优化(第一次调用查询数据库，将查询结果放入内存对象， 第二次调用，直接从内存对象返回，不需要查询数据库 )

#### 有哪些AOP Advice通知的类型？

特定 JoinPoint 处的 Aspect 所采取的动作称为 Advice。Spring AOP 使用一个 Advice 作为拦截器，在 JoinPoint “周围”维护一系列的拦截器。

- **前置通知**（Before advice） ： 这些类型的 Advice 在 joinpoint 方法之前执行，并使用 @Before 注解标记进行配置。
- **后置通知**（After advice） ：这些类型的 Advice 在连接点方法之后执行，无论方法退出是正常还是异常返回，并使用 @After 注解标记进行配置。
- **返回后通知**（After return advice） ：这些类型的 Advice 在连接点方法正常执行后执行，并使用@AfterReturning 注解标记进行配置。
- **环绕通知**（Around advice） ：这些类型的 Advice 在连接点之前和之后执行，并使用 @Around 注解标记进行配置。
- **抛出异常后通知**（After throwing advice） ：仅在 joinpoint 方法通过抛出异常退出并使用 @AfterThrowing 注解标记配置时执行。

#### AOP 有哪些实现方式？

实现 AOP 的技术，主要分为两大类：

- 静态代理

  \- 指使用 AOP 框架提供的命令进行编译，从而在编译阶段就可生成 AOP 代理类，因此也称为编译时增强；

  - 编译时编织（特殊编译器实现）
  - 类加载时编织（特殊的类加载器实现）。

- 动态代理

  \- 在运行时在内存中“临时”生成 AOP 动态代理类，因此也被称为运行时增强。

  - JDK 动态代理
    - JDK Proxy 是 Java 语言自带的功能，无需通过加载第三方类实现；
    - Java 对 JDK Proxy 提供了稳定的支持，并且会持续的升级和更新，Java 8 版本中的 JDK Proxy 性能相比于之前版本提升了很多；
    - JDK Proxy 是通过拦截器加反射的方式实现的；
    - JDK Proxy 只能代理实现接口的类；
    - JDK Proxy 实现和调用起来比较简单；
  - CGLIB
    - CGLib 是第三方提供的工具，基于 ASM 实现的，性能比较高；
    - CGLib 无需通过接口来实现，它是针对类实现代理，主要是对指定的类生成一个子类，它是通过实现子类的方式来完成调用的。

#### 谈谈你对CGLib的理解？

JDK 动态代理机制只能代理实现接口的类，一般没有实现接口的类不能进行代理。使用 CGLib 实现动态代理，完全不受代理类必须实现接口的限制。

CGLib 的原理是对指定目标类生成一个子类，并覆盖其中方法实现增强，但因为采用的是继承，所以不能对 final 修饰的类进行代理。

举例：

```java
public class CGLibDemo {

    // 需要动态代理的实际对象
    static class Sister  {
        public void sing() {
            System.out.println("I am Jinsha, a little sister.");
        }
    }

    static class CGLibProxy implements MethodInterceptor {

        private Object target;

        public Object getInstance(Object target){
            this.target = target;
            Enhancer enhancer = new Enhancer();
            // 设置父类为实例类
            enhancer.setSuperclass(this.target.getClass());
            // 回调方法
            enhancer.setCallback(this);
            // 创建代理对象
            return enhancer.create();
        }

        @Override
        public Object intercept(Object o, Method method, Object[] objects, MethodProxy methodProxy) throws Throwable {
            System.out.println("introduce yourself...");
            Object result = methodProxy.invokeSuper(o,objects);
            System.out.println("score...");
            return result;
        }
    }

    public static void main(String[] args) {
        CGLibProxy cgLibProxy = new CGLibProxy();
        //获取动态代理类实例
        Sister proxySister = (Sister) cgLibProxy.getInstance(new Sister());
        System.out.println("CGLib Dynamic object name: " + proxySister.getClass().getName());
        proxySister.sing();
    }
}
```

CGLib 的调用流程就是通过调用拦截器的 intercept 方法来实现对被代理类的调用。而拦截逻辑可以写在 intercept 方法的 invokeSuper(o, objects);的前后实现拦截。

#### Spring AOP和AspectJ AOP有什么区别？

Spring AOP是属于运行时增强，而AspectJ是编译时增强。Spring AOP基于代理（Proxying），而AspectJ基于字节码操作（Bytecode Manipulation）。

Spring AOP已经集成了AspectJ，AspectJ应该算得上是Java生态系统中最完整的AOP框架了。AspectJ相比于Spring AOP功能更加强大，但是Spring AOP相对来说更简单。

如果我们的切面比较少，那么两者性能差异不大。但是，当切面太多的话，最好选择AspectJ，它比SpringAOP快很多。

#### Spring中的bean的作用域有哪些？

1. singleton：唯一bean实例，Spring中的bean默认都是单例的。
2. prototype：每次请求都会创建一个新的bean实例。
3. request：每一次HTTP请求都会产生一个新的bean，该bean仅在当前HTTP request内有效。
4. session：每一次HTTP请求都会产生一个新的bean，该bean仅在当前HTTP session内有效。
5. global-session：全局session作用域，仅仅在基于Portlet的Web应用中才有意义，Spring5中已经没有了。Portlet是能够生成语义代码（例如HTML）片段的小型Java Web插件。它们基于Portlet容器，可以像Servlet一样处理HTTP请求。但是与Servlet不同，每个Portlet都有不同的会话。

#### Spring中的单例bean的线程安全问题了解吗？

大部分时候我们并没有在系统中使用多线程，所以很少有人会关注这个问题。单例bean存在线程问题，主要是因为当多个线程操作同一个对象的时候，对这个对象的非静态成员变量的写操作会存在线程安全问题。

有两种常见的解决方案：

1.在bean对象中尽量避免定义可变的成员变量（不太现实）。

2.在类中定义一个ThreadLocal成员变量，将需要的可变成员变量保存在ThreadLocal中（推荐的一种方式）。

#### Spring中的bean生命周期？

**Bean的完整生命周期经历了各种方法调用，这些方法可以划分为以下几类**：

- **Bean自身的方法**： 这个包括了Bean本身调用的方法和通过配置文件中`<bean>`的init-method和destroy-method指定的方法
- **Bean级生命周期接口方法**： 这个包括了BeanNameAware、BeanFactoryAware、ApplicationContextAware；当然也包括InitializingBean和DiposableBean这些接口的方法（可以被@PostConstruct和@PreDestroy注解替代)
- **容器级生命周期接口方法**： 这个包括了InstantiationAwareBeanPostProcessor 和 BeanPostProcessor 这两个接口实现，一般称它们的实现类为“后处理器”。
- **工厂后处理器接口方法**： 这个包括了AspectJWeavingEnabler, ConfigurationClassPostProcessor, CustomAutowireConfigurer等等非常有用的工厂后处理器接口的方法。工厂后处理器也是容器级的。在应用上下文装配配置文件之后立即调用。

![img](https://b2files.173114.xyz/blogimg/2025/03/348544793b4b6871e421b623c94afb3c.png)

**具体而言，流程如下**

- 如果 BeanFactoryPostProcessor 和 Bean 关联, 则调用postProcessBeanFactory方法.(即首**先尝试从Bean工厂中获取Bean**)

- 如果 InstantiationAwareBeanPostProcessor 和 Bean 关联，则调用postProcessBeforeInstantiation方法

- 根据配置情况调用 Bean 构造方法**实例化 Bean**。

- 利用依赖注入完成 Bean 中所有**属性值的配置注入**。

- 如果 InstantiationAwareBeanPostProcessor 和 Bean 关联，则调用postProcessAfterInstantiation方法和postProcessProperties

- 调用xxxAware接口

   

  (上图只是给了几个例子)

  - 第一类Aware接口
    - 如果 Bean 实现了 BeanNameAware 接口，则 Spring 调用 Bean 的 setBeanName() 方法传入当前 Bean 的 id 值。
    - 如果 Bean 实现了 BeanClassLoaderAware 接口，则 Spring 调用 setBeanClassLoader() 方法传入classLoader的引用。
    - 如果 Bean 实现了 BeanFactoryAware 接口，则 Spring 调用 setBeanFactory() 方法传入当前工厂实例的引用。
  - 第二类Aware接口
    - 如果 Bean 实现了 EnvironmentAware 接口，则 Spring 调用 setEnvironment() 方法传入当前 Environment 实例的引用。
    - 如果 Bean 实现了 EmbeddedValueResolverAware 接口，则 Spring 调用 setEmbeddedValueResolver() 方法传入当前 StringValueResolver 实例的引用。
    - 如果 Bean 实现了 ApplicationContextAware 接口，则 Spring 调用 setApplicationContext() 方法传入当前 ApplicationContext 实例的引用。
    - ...

- 如果 BeanPostProcessor 和 Bean 关联，则 Spring 将调用该接口的预初始化方法 postProcessBeforeInitialzation() 对 Bean 进行加工操作，此处非常重要，Spring 的 AOP 就是利用它实现的。

- 如果 Bean 实现了 InitializingBean 接口，则 Spring 将调用 afterPropertiesSet() 方法。(或者有执行@PostConstruct注解的方法)

- 如果在配置文件中通过 **init-method** 属性指定了初始化方法，则调用该初始化方法。

- 如果 BeanPostProcessor 和 Bean 关联，则 Spring 将调用该接口的初始化方法 postProcessAfterInitialization()。此时，Bean 已经可以被应用系统使用了。

- 如果在 `<bean>` 中指定了该 Bean 的作用范围为 scope="singleton"，则将该 Bean 放入 Spring IoC 的缓存池中，将触发 Spring 对该 Bean 的生命周期管理；如果在 `<bean>` 中指定了该 Bean 的作用范围为 scope="prototype"，则将该 Bean 交给调用者，调用者管理该 Bean 的生命周期，Spring 不再管理该 Bean。

- 如果 Bean 实现了 DisposableBean 接口，则 Spring 会调用 destory() 方法将 Spring 中的 Bean 销毁；(或者有执行@PreDestroy注解的方法)

- 如果在配置文件中通过 **destory-method** 属性指定了 Bean 的销毁方法，则 Spring 将调用该方法对 Bean 进行销毁。

#### 说说自己对于Spring MVC的了解？

MVC是一种设计模式，Spring MVC是一款很优秀的MVC框架。Spring MVC可以帮助我们进行更简洁的Web层的开发，并且它天生与Spring框架集成。Spring MVC下我们一般把后端项目分为Service层（处理业务）、Dao层（数据库操作）、Entity层（实体类）、Controller层（控制层，返回数据给前台页面）。

Spring MVC的简单原理图如下：

![img](https://b2files.173114.xyz/blogimg/2025/03/3e46fd8b65a31076184692161d48df70.png)

#### Spring MVC的工作原理了解嘛？

![img](https://b2files.173114.xyz/blogimg/2025/03/6afb0b72b8e6d5b4feccecd60a7d5d3a.png)

流程说明：

1.客户端（浏览器）发送请求，直接请求到DispatcherServlet。

2.DispatcherServlet根据请求信息调用HandlerMapping，解析请求对应的Handler。

3.解析到对应的Handler（也就是我们平常说的Controller控制器）。

4.HandlerAdapter会根据Handler来调用真正的处理器来处理请求和执行相对应的业务逻辑。

5.处理器处理完业务后，会返回一个ModelAndView对象，Model是返回的数据对象，View是逻辑上的View。

6.ViewResolver会根据逻辑View去查找实际的View。

7.DispatcherServlet把返回的Model传给View（视图渲染）。

8.把View返回给请求者（浏览器）。

#### Spring框架中用到了哪些设计模式？

举几个例子

1.工厂设计模式：Spring使用工厂模式通过BeanFactory和ApplicationContext创建bean对象。

2.代理设计模式：Spring AOP功能的实现。

3.单例设计模式：Spring中的bean默认都是单例的。

4.模板方法模式：Spring中的jdbcTemplate、hibernateTemplate等以Template结尾的对数据库操作的类，它们就使用到了模板模式。

5.包装器设计模式：我们的项目需要连接多个数据库，而且不同的客户在每次访问中根据需要会去访问不同的数据库。这种模式让我们可以根据客户的需求能够动态切换不同的数据源。

6.观察者模式：Spring事件驱动模型就是观察者模式很经典的一个应用。

7.适配器模式：Spring AOP的增强或通知（Advice）使用到了适配器模式、Spring MVC中也是用到了适配器模式适配Controller。

#### @Component和@Bean的区别是什么？

1.作用对象不同。@Component注解作用于类，而@Bean注解作用于方法。

2.@Component注解通常是通过类路径扫描来自动侦测以及自动装配到Spring容器中（我们可以使用@ComponentScan注解定义要扫描的路径）。@Bean注解通常是在标有该注解的方法中定义产生这个bean，告诉Spring这是某个类的实例，当我需要用它的时候还给我。

3.@Bean注解比@Component注解的自定义性更强，而且很多地方只能通过@Bean注解来注册bean。比如当引用第三方库的类需要装配到Spring容器的时候，就只能通过@Bean注解来实现。

@Bean注解的使用示例：

```java
@Configuration
public class AppConfig {
    @Bean
    public TransferService transferService() {
        return new TransferServiceImpl();
    }
}
```

上面的代码相当于下面的XML配置：

```xml
<beans>
    <bean id="transferService" class="com.yanggb.TransferServiceImpl"/>
</beans>
```

下面这个例子是无法通过@Component注解实现的：

```java
@Bean
public OneService getService(status) {
    case (status)  {
        when 1:
                return new serviceImpl1();
        when 2:
                return new serviceImpl2();
        when 3:
                return new serviceImpl3();
    }
}
```

#### 将一个类声明为Spring的bean的注解有哪些？

我们一般使用@Autowired注解去自动装配bean。而想要把一个类标识为可以用@Autowired注解自动装配的bean，可以采用以下的注解实现：

1.@Component注解。通用的注解，可标注任意类为Spring组件。如果一个Bean不知道属于哪一个层，可以使用@Component注解标注。

2.@Repository注解。对应持久层，即Dao层，主要用于数据库相关操作。

3.@Service注解。对应服务层，即Service层，主要涉及一些复杂的逻辑，需要用到Dao层（注入）。

4.@Controller注解。对应Spring MVC的控制层，即Controller层，主要用于接受用户请求并调用Service层的方法返回数据给前端页面。

#### Spring事务管理的方式有几种？

1.编程式事务：在代码中硬编码（不推荐使用）。

2.声明式事务：在配置文件中配置（推荐使用），分为基于XML的声明式事务和基于注解的声明式事务。

#### Spring事务中的隔离级别有哪几种？

在TransactionDefinition接口中定义了五个表示隔离级别的常量：

ISOLATION_DEFAULT：使用后端数据库默认的隔离级别，Mysql默认采用的REPEATABLE_READ隔离级别；Oracle默认采用的READ_COMMITTED隔离级别。

ISOLATION_READ_UNCOMMITTED：最低的隔离级别，允许读取尚未提交的数据变更，可能会导致脏读、幻读或不可重复读。

ISOLATION_READ_COMMITTED：允许读取并发事务已经提交的数据，可以阻止脏读，但是幻读或不可重复读仍有可能发生

ISOLATION_REPEATABLE_READ：对同一字段的多次读取结果都是一致的，除非数据是被本身事务自己所修改，可以阻止脏读和不可重复读，但幻读仍有可能发生。

ISOLATION_SERIALIZABLE：最高的隔离级别，完全服从ACID的隔离级别。所有的事务依次逐个执行，这样事务之间就完全不可能产生干扰，也就是说，该级别可以防止脏读、不可重复读以及幻读。但是这将严重影响程序的性能。通常情况下也不会用到该级别。

#### Spring事务中有哪几种事务传播行为？

在TransactionDefinition接口中定义了7个表示事务传播行为的常量。

支持当前事务的情况：

PROPAGATION_REQUIRED：如果当前存在事务，则加入该事务；如果当前没有事务，则创建一个新的事务。

PROPAGATION_SUPPORTS： 如果当前存在事务，则加入该事务；如果当前没有事务，则以非事务的方式继续运行。

PROPAGATION_MANDATORY： 如果当前存在事务，则加入该事务；如果当前没有事务，则抛出异常。（mandatory：强制性）。

不支持当前事务的情况：

PROPAGATION_REQUIRES_NEW： 创建一个新的事务，如果当前存在事务，则把当前事务挂起。

PROPAGATION_NOT_SUPPORTED： 以非事务方式运行，如果当前存在事务，则把当前事务挂起。

PROPAGATION_NEVER： 以非事务方式运行，如果当前存在事务，则抛出异常。

其他情况：

PROPAGATION_NESTED： 如果当前存在事务，则创建一个事务作为当前事务的嵌套事务来运行；如果当前没有事务，则该取值等价于PROPAGATION_REQUIRED。

#### Bean Factory和ApplicationContext有什么区别？

ApplicationContex提供了一种解析文本消息的方法，一种加载文件资源（如图像）的通用方法，它们可以将事件发布到注册为侦听器的bean。此外，可以在应用程序上下文中以声明方式处理容器中的容器或容器上的操作，这些操作必须以编程方式与Bean Factory一起处理。ApplicationContext实现MessageSource，一个用于获取本地化消息的接口，实际的实现是可插入的。

#### 如何定义bean的范围？

在Spring中定义一个时，我们也可以为bean声明一个范围。它可以通过bean定义中的scope属性定义。例如，当Spring每次需要生成一个新的bean实例时，bean'sscope属性就是原型。另一方面，当每次需要Spring都必须返回相同的bean实例时，bean scope属性必须设置为singleton。

#### 可以通过多少种方式完成依赖注入？

通常，依赖注入可以通过三种方式完成，即：

- 构造函数注入
- setter 注入
- 接口注入

### 10.2 Spring Boot

#### 什么是SpringBoot？

Spring Boot 是 Spring 开源组织下的子项目，是 Spring 组件一站式解决方案，主要是简化了使用 Spring 的难度，简省了繁重的配置，提供了各种启动器，开发者能快速上手。

- 用来简化Spring应用的初始搭建以及开发过程，使用特定的方式来进行配置
- 创建独立的Spring引用程序main方法运行
- 嵌入的tomcat无需部署war文件
- 简化maven配置
- 自动配置Spring添加对应的功能starter自动化配置
- SpringBoot来简化Spring应用开发，约定大于配置，去繁化简

#### 为什么使用SpringBoot？

- 独立运行

Spring Boot 而且内嵌了各种 servlet 容器，Tomcat、Jetty 等，现在不再需要打成war 包部署到容器中，Spring Boot 只要打成一个可执行的 jar 包就能独立运行，所有的依赖包都在一个 jar 包内。

- 简化配置

spring-boot-starter-web 启动器自动依赖其他组件，简少了 maven 的配置。

- 自动配置

Spring Boot 能根据当前类路径下的类、jar 包来自动配置 bean，如添加一个 spring

boot-starter-web 启动器就能拥有 web 的功能，无需其他配置。

- 无代码生成和XML配置

Spring Boot 配置过程中无代码生成，也无需 XML 配置文件就能完成所有配置工作，这一切都是借助于条件注解完成的，这也是 Spring4.x 的核心功能之一。

- 应用监控

Spring Boot 提供一系列端点可以监控服务及应用，做健康检测。

#### Spring、Spring MVC和SpringBoot有什么区别？

- Spring

Spring最重要的特征是依赖注入。所有Spring Modules不是依赖注入就是IOC控制反转。

当我们恰当的使用DI或者是IOC的时候，可以开发松耦合应用。

- Spring MVC

Spring MVC提供了一种分离式的方法来开发Web应用。通过运用像DispatcherServelet，ModelAndView 和 ViewResolver 等一些简单的概念，开发 Web 应用将会变的非常简单。

- SpringBoot

Spring和Spring MVC的问题在于需要配置大量的参数。

SpringBoot通过一个自动配置和启动的项来解决这个问题。

#### SpringBoot自动配置的原理?

在Spring程序main方法中，添加@SpringBootApplication或者@EnableAutoConfiguration会自动去maven中读取每个starter中的spring.factories文件，该文件里配置了所有需要被创建的Spring容器中的bean

#### Spring Boot的核心注解是哪些？他主由哪几个注解组成的？

启动类上面的注解是@SpringBootApplication，他也是SpringBoot的核心注解，主要组合包含了以下3个注解：

- @SpringBootConfiguration：组合了@Configuration注解，实现配置文件的功能；
- @EnableAutoConfiguration：打开自动配置的功能，也可以关闭某个自动配置的选项，如关闭数据源自动配置的功能：
- @SpringBootApplication(exclude={DataSourceAutoConfiguration.class})；
- @ComponentScan：Spring组件扫描。

#### SpringBoot的核心配置文件有哪几个？他们的区别是什么？

SpringBoot的核心配置文件是application和bootstrap配置文件。

application配置文件这个容易理解，主要用于Spring Boot项目的自动化配置。

bootstrap配置文件有以下几个应用场景：

- 使用Spring Cloud Config配置中心时，这时需要在bootstrap配置文件中添加连接到配置中心的配置属性来加载外部配置中心的配置信息；
- 一些固定的不能被覆盖的属性；
- 一些加密/解密的场景；

#### 什么是Spring Boot Starter？有哪些常用的？

和自动配置一样，Spring Boot Starter的目的也是简化配置，而Spring Boot Starter解决的是依赖管理配置复杂的问题，有了它，当我需要构建一个Web应用程序时，不必再遍历所有的依赖包，一个一个地添加到项目的依赖管理中，而是只需要一个配置spring-boot-starter-web, 同理，如果想引入持久化功能，可以配置spring-boot-starter-data-jpa：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

Spring Boot 也提供了其它的启动器项目包括，包括用于开发特定类型应用程序的典型依赖项。

spring-boot-starter-web-services - SOAP Web Services

spring-boot-starter-web - Web 和 RESTful 应用程序

spring-boot-starter-test - 单元测试和集成测试

spring-boot-starter-jdbc - 传统的 JDBC

spring-boot-starter-hateoas - 为服务添加 HATEOAS 功能

spring-boot-starter-security - 使用 SpringSecurity 进行身份验证和授权

spring-boot-starter-data-jpa - 带有 Hibernate 的 Spring Data JPA

spring-boot-starter-data-rest - 使用 Spring Data REST 公布简单的 REST 服务

#### spring-boot-starter-parent有什么作用？

我们知道，新建一个SpringBoot项目，默认都是有parent的，这个parent就是spring-boot-starter-parent，spring-boot-starter-parent主要有如下作用：

- 定义了Java编译版本
- 使用UTF-8格式编码
- 继承自spring-boor-dependencies，这里面定义了依赖的版本，也正是因为继承了这个依赖，所以我们在写依赖时才不需要写版本号
- 执行打包操作的配置
- 自动化的资源过滤
- 自动化的插件配置

#### 如何自定义Spring Boot Starter？

- 实现功能
- 添加Properties

```java
@Data
@ConfigurationProperties(prefix = "com.pdai")
public class DemoProperties {
    private String version;
    private String name;
}
```

- 添加AutoConfiguration

```java
@Configuration
@EnableConfigurationProperties(DemoProperties.class)
public class DemoAutoConfiguration {

    @Bean
    public com.pdai.demo.module.DemoModule demoModule(DemoProperties properties){
        com.pdai.demo.module.DemoModule demoModule = new com.pdai.demo.module.DemoModule();
        demoModule.setName(properties.getName());
        demoModule.setVersion(properties.getVersion());
        return demoModule;

    }
}
```

- 添加spring.factory

在META-INF下创建spring.factory文件

```bash
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
com.pdai.demospringbootstarter.DemoAutoConfiguration
```

- install

![img](https://b2files.173114.xyz/blogimg/2025/03/c05daffb9d2b005bbd5378920ccfc177.png)

#### 为什么需要spring-boot-maven-plugin？

spring-boot-maven-plugin提供了一些像jar一样打包或者运行应用程序的命令。

1. spring-boot:run 运行SpringBoot应用程序；
2. spring-boot:repackage 重新打包你的jar包或者是war包使其可执行
3. spring-boot:start和spring-boot:stop管理Spring Boot应用程序的生命周期
4. spring-boot:build-info生成执行器可以使用的构造信息

#### SpringBoot 打成jar和普通的jar有什么区别？

Spring Boot 项目最终打包成的 jar 是可执行 jar ，这种 jar 可以直接通过java -jar xxx.jar命令来运行，这种 jar 不可以作为普通的 jar 被其他项目依赖，即使依赖了也无法使用其中的类。

Spring Boot 的 jar 无法被其他项目依赖，主要还是他和普通 jar 的结构不同。普通的 jar 包，解压后直接就是包名，包里就是我们的代码，而 Spring Boot 打包成的可执行 jar 解压后，在 \BOOT-INF\classes目录下才是我们的代码，因此无法被直接引用。如果非要引用，可以在 pom.xml 文件中增加配置，将 Spring Boot 项目打包成两个 jar ，一个可执行，一个可引用。

#### 如何使用Spring Boot实现异常处理？

Spring提供了一种使用ControllerAdvice处理异常的非常有用的方法。通过实现一个ControlerAdvice类，来处理控制类抛出的所有异常。

#### SpringBoot 实现热部署有哪几种方式？

主要有两种方式：

- Spring Loaded
- Spring-boot-devtools

#### Spring Boot中的监视器是什么？

Spring boot actuator是spring启动框架中的重要功能之一。Spring boot监视器可帮助您访问生产环境中正在运行的应用程序的当前状态。

有几个指标必须在生产环境中进行检查和监控。即使一些外部应用程序可能正在使用这些服务来向相关人员触发警报消息。监视器模块公开了一组可直接作为HTTP URL访问的REST端点来检查状态。

#### Spring Boot 可以兼容老 Spring 项目吗？

可以兼容，使用 @ImportResource 注解导入老 Spring 项目配置文件。

### 10.3 Spring Security

#### 什么是Spring Security？核心功能？

Spring Security是基于Spring的安全框架.它提供全面的安全性解决方案,同时在Web请求级别和调用级别确认和授权.在Spring Framework基础上,Spring Security充分利用了依赖注入(DI)和面向切面编程(AOP)功能,为应用系统提供声明式的安全访问控制功能,建晒了为企业安全控制编写大量重复代码的工作,是一个轻量级的安全框架,并且很好集成Spring MVC

spring security 的核心功能主要包括：

- 认证(Authentication)：指的是验证某个用户是否为系统中的合法主体，也就是说用户能否访问该系统。
- 授权(Authorization)：指的是验证某个用户是否有权限执行某个操作
- 攻击防护：指的是防止伪造身份

#### Spring Security的原理?

简单谈谈其中的要点

- **基于Filter技术实现?**

首先SpringSecurity是基于Filter技术实现的。Spring通过DelegatingFilterProxy建立Web容器和Spring ApplicationContext的联系，而SpringSecurity使用FilterChainProxy 注册SecurityFilterChain。

#### Spring Security基于用户名和密码的认证模式流程？

请求的用户名密码可以通过表单登录，基础认证，数字认证三种方式从HttpServletRequest中获得，用于认证的数据源策略有内存，数据库，ldap,自定义等。

拦截未授权的请求，重定向到登录页面

![img](https://b2files.173114.xyz/blogimg/2025/03/9d1485657db7319e3926f09e197fd74f.png)

表单登录的过程，进行账号密码认证

![img](https://b2files.173114.xyz/blogimg/2025/03/9a1faf4adc048ae5ffea02b20e76ee5f.png)

### 10.4 MyBatis

### 10.5 JPA

### 10.6 日志框架

#### 什么是日志系统和日志门面？分别有哪些框架？

日志系统是具体的日志框架，日志门面是不提供日志的具体实现，而是在运行时动态的绑定日志实现组件来工作，是一种外观模式。

- **日志系统**
  - java.util.logging (**JUL**)，JDK1.4 开始，通过 java.util.logging 提供日志功能。虽然是官方自带的log lib，JUL的使用确不广泛。
  - **Log4j**，Log4j 是 apache 的一个开源项目，创始人 Ceki Gulcu。Log4j 应该说是 Java 领域资格最老，应用最广的日志工具。Log4j 是高度可配置的，并可通过在运行时的外部文件配置。它根据记录的优先级别，并提供机制，以指示记录信息到许多的目的地，诸如：数据库，文件，控制台，UNIX 系统日志等。Log4j 的短板在于性能，在Logback 和 Log4j2 出来之后，Log4j的使用也减少了。
  - **Logback**，Logback 是由 log4j 创始人 Ceki Gulcu 设计的又一个开源日志组件，是作为 Log4j 的继承者来开发的，提供了性能更好的实现，异步 logger，Filter等更多的特性。
  - **Log4j2**，维护 Log4j 的人为了性能又搞出了 Log4j2。Log4j2 和 Log4j1.x 并不兼容，设计上很大程度上模仿了 SLF4J/Logback，性能上也获得了很大的提升。Log4j2 也做了 Facade/Implementation 分离的设计，分成了 log4j-api 和 log4j-core。
- **日志门面**
  - **common-logging**，common-logging 是 apache 的一个开源项目。也称Jakarta Commons Logging，缩写 JCL。
  - **slf4j**, 全称为 Simple Logging Facade for Java，即 java 简单日志门面。作者又是 Ceki Gulcu！这位大神写了 Log4j、Logback 和 slf4j。类似于 Common-Logging，slf4j 是对不同日志框架提供的一个 API 封装，可以在部署的时候不修改任何配置即可接入一种日志实现方案。但是，slf4j 在编译时静态绑定真正的 Log 库。使用 SLF4J 时，如果你需要使用某一种日志实现，那么你必须选择正确的 SLF4J 的 jar 包的集合（各种桥接包）。

#### 日志库中使用桥接模式解决什么问题？

- 什么是桥接呢？

假如你正在开发应用程序所调用的组件当中已经使用了 common-logging，这时你需要 jcl-over-slf4j.jar 把日志信息输出重定向到 slf4j-api，slf4j-api 再去调用 slf4j 实际依赖的日志组件。这个过程称为桥接。下图是官方的 slf4j 桥接策略图：

![img](https://b2files.173114.xyz/blogimg/2025/03/50103e5dc92e215b9e5bb42f07d60f77.png)

从图中应该可以看出，无论你的老项目中使用的是 common-logging 或是直接使用 log4j、java.util.logging，都可以使用对应的桥接 jar 包来解决兼容问题。

- slf4j 兼容 common-logging

```xml
<dependency>
  <groupId>org.slf4j</groupId>
  <artifactId>jcl-over-slf4j</artifactId>
  <version>1.7.12</version>
</dependency>
```

- slf4j 兼容 log4j

```xml
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>log4j-over-slf4j</artifactId>
    <version>1.7.12</version>
</dependency>
```

#### 在日志配置时会考虑哪些点？

- 支持日志路径，日志level等配置
- 日志控制配置通过application.yml下发
- 按天生成日志，当天的日志>50MB回滚
- 最多保存10天日志
- 生成的日志中Pattern自定义
- Pattern中添加用户自定义的MDC字段，比如用户信息(当前日志是由哪个用户的请求产生)，request信息。此种方式可以通过AOP切面控制，在MDC中添加requestID，在spring-logback.xml中配置Pattern。
- 根据不同的运行环境设置Profile - dev，test，product
- 对控制台，Err和全量日志分别配置
- 对第三方包路径日志控制

#### 对Java日志组件选型的建议？

slf4j已经成为了Java日志组件的明星选手，可以完美替代JCL，使用JCL桥接库也能完美兼容一切使用JCL作为日志门面的类库，现在的新系统已经没有不使用slf4j作为日志API的理由了。

日志记录服务方面，log4j在功能上输于logback和log4j2，在性能方面log4j2则全面超越log4j和logback。所以新系统应该在logback和log4j2中做出选择，对于性能有很高要求的系统，应优先考虑log4j2。

#### 对日志架构使用比较好的实践？

说几个点：

- 总是使用Log Facade，而不是具体Log Implementation
- 只添加一个 Log Implementation依赖
- 具体的日志实现依赖应该设置为optional和使用runtime scope
- 如果有必要, 排除依赖的第三方库中的Log Impementation依赖
- 避免为不会输出的log付出代价
- 日志格式中最好不要使用行号，函数名等字段

#### 对现有系统日志架构的改造建议？

如果现有系统使用JCL作为日志门面，又确实面临着JCL的ClassLoader机制带来的问题，完全可以引入slf4j并通过桥接库将JCL api输出的日志桥接至slf4j，再通过适配库适配至现有的日志输出服务（如log4j），如下图：

![img](https://b2files.173114.xyz/blogimg/2025/03/cc00fa5dd2729bd01252aeae9389df5d.png)

这样做不需要任何代码级的改造，就可以解决JCL的ClassLoader带来的问题，但没有办法享受日志模板等slf4j的api带来的优点。不过之后在现系统上开发的新功能就可以使用slf4j的api了，老代码也可以分批进行改造。

如果现有系统使用JCL作为日志门面，又头疼JCL不支持logback和log4j2等新的日志服务，也可以通过桥接库以slf4j替代JCL，但同样无法直接享受slf4j api的优点。

如果想要使用slf4j的api，那么就不得不进行代码改造了，当然改造也可以参考1中提到的方式逐步进行。

如果现系统面临着log4j的性能问题，可以使用Apache Logging提供的log4j到log4j2的桥接库log4j-1.2-api，把通过log4j api输出的日志桥接至log4j2。这样可以最快地使用上log4j2的先进性能，但组件中缺失了slf4j，对后续进行日志架构改造的灵活性有影响。另一种办法是先把log4j桥接至slf4j，再使用slf4j到log4j2的适配库。这样做稍微麻烦了一点，但可以逐步将系统中的日志输出标准化为使用slf4j的api，为后面的工作打好基础。

### 10.7 Tomcat

#### Tomcat 整体架构的设计？

从组件的角度看

![img](https://pdai.tech/images/tomcat/tomcat-x-design-2-1.jpeg)

- **Server**: 表示服务器，它提供了一种优雅的方式来启动和停止整个系统，不必单独启停连接器和容器；它是Tomcat构成的顶级构成元素，所有一切均包含在Server中；
- **Service**: 表示服务，Server可以运行多个服务。比如一个Tomcat里面可运行订单服务、支付服务、用户服务等等；Server的实现类StandardServer可以包含一个到多个Services, Service的实现类为StandardService调用了容器(Container)接口，其实是调用了Servlet Engine(引擎)，而且StandardService类中也指明了该Service归属的Server;
- **Container**: 表示容器，可以看做Servlet容器；引擎(Engine)、主机(Host)、上下文(Context)和Wraper均继承自Container接口，所以它们都是容器。
  - Engine -- 引擎
  - Host -- 主机
  - Context -- 上下文
  - Wrapper -- 包装器
- **Connector**: 表示连接器, **它将Service和Container连接起来**，首先它需要注册到一个Service，它的作用就是把来自客户端的请求转发到Container(容器)，这就是它为什么称作连接器, 它支持的协议如下：
  - 支持AJP协议
  - 支持Http协议
  - 支持Https协议
- **Service内部**还有各种支撑组件，下面简单罗列一下这些组件
  - Manager -- 管理器，用于管理会话Session
  - Logger -- 日志器，用于管理日志
  - Loader -- 加载器，和类加载有关，只会开放给Context所使用
  - Pipeline -- 管道组件，配合Valve实现过滤器功能
  - Valve -- 阀门组件，配合Pipeline实现过滤器功能
  - Realm -- 认证授权组件

#### Tomcat 一个请求的处理流程？

假设来自客户的请求为：http://localhost:8080/test/index.jsp 请求被发送到本机端口8080，被在那里侦听的Coyote HTTP/1.1 Connector,然后

- Connector把该请求交给它所在的Service的Engine来处理，并等待Engine的回应
- Engine获得请求localhost:8080/test/index.jsp，匹配它所有虚拟主机Host
- Engine匹配到名为localhost的Host(即使匹配不到也把请求交给该Host处理，因为该Host被定义为该Engine的默认主机)
- localhost Host获得请求/test/index.jsp，匹配它所拥有的所有Context
- Host匹配到路径为/test的Context(如果匹配不到就把该请求交给路径名为""的Context去处理)
- path="/test"的Context获得请求/index.jsp，在它的mapping table中寻找对应的servlet
- Context匹配到URL PATTERN为*.jsp的servlet，对应于JspServlet类，构造HttpServletRequest对象和HttpServletResponse对象，作为参数调用JspServlet的doGet或doPost方法
- Context把执行完了之后的HttpServletResponse对象返回给Host
- Host把HttpServletResponse对象返回给Engine
- Engine把HttpServletResponse对象返回给Connector
- Connector把HttpServletResponse对象返回给客户browser

#### Tomcat 中类加载机制？

在Bootstrap中我们可以看到有如下三个classloader

```java
ClassLoader commonLoader = null;
ClassLoader catalinaLoader = null;
ClassLoader sharedLoader = null;
```

- **为什么要设计多个类加载器**？

> 如果所有的类都使用一个类加载器来加载，会出现什么问题呢？

假如我们自己编写一个类`java.util.Object`，它的实现可能有一定的危险性或者隐藏的bug。而我们知道Java自带的核心类里面也有`java.util.Object`，如果JVM启动的时候先行加载的是我们自己编写的`java.util.Object`，那么就有可能出现安全问题！

所以，Sun（后被Oracle收购）采用了另外一种方式来保证最基本的、也是最核心的功能不会被破坏。你猜的没错，那就是双亲委派模式！

- **什么是双亲委派模型**？

> 双亲委派模型解决了类错乱加载的问题，也设计得非常精妙。

双亲委派模式对类加载器定义了层级，每个类加载器都有一个父类加载器。在一个类需要加载的时候，首先委派给父类加载器来加载，而父类加载器又委派给祖父类加载器来加载，以此类推。如果父类及上面的类加载器都加载不了，那么由当前类加载器来加载，并将被加载的类缓存起来。

![img](https://b2files.173114.xyz/blogimg/2025/03/fb3ff60c80c5b96d109be59e46e7fb30.png)

所以上述类是这么加载的

- Java自带的核心类 -- 由启动类加载器加载
- Java支持的可扩展类 -- 由扩展类加载器加载
- 我们自己编写的类 -- 默认由应用程序类加载器或其子类加载
- **为什么Tomcat的类加载器也不是双亲委派模型**？

Java默认的类加载机制是通过双亲委派模型来实现的，而Tomcat实现的方式又和双亲委派模型有所区别。

**原因在于一个Tomcat容器允许同时运行多个Web程序，每个Web程序依赖的类又必须是相互隔离的**。因此，如果Tomcat使用双亲委派模式来加载类的话，将导致Web程序依赖的类变为共享的。

举个例子，假如我们有两个Web程序，一个依赖A库的1.0版本，另一个依赖A库的2.0版本，他们都使用了类xxx.xx.Clazz，其实现的逻辑因类库版本的不同而结构完全不同。那么这两个Web程序的其中一个必然因为加载的Clazz不是所使用的Clazz而出现问题！而这对于开发来说是非常致命的！

#### Tomcat Container设计？

我们看下几个Container之间的关系：

![img](https://pdai.tech/images/tomcat/tomcat-x-container-1.jpg)

从上图上，我们也可以看出Container顶层也是基于Lifecycle的组件设计的。

- **在设计Container组件层次组件时，上述4个组件分别做什么的呢？为什么要四种组件呢？**

**Engine** - 表示整个catalina的servlet引擎，多数情况下包含**一个或多个**子容器，这些子容器要么是Host，要么是Context实现，或者是其他自定义组。

**Host** - 表示包含多个Context的虚拟主机的。

**Context** — 表示一个ServletContext，表示一个webapp，它通常包含一个或多个wrapper。

**Wrapper** - 表示一个servlet定义的（如果servlet本身实现了SingleThreadModel，则可能支持多个servlet实例）。

- **结合整体的框架图中上述组件部分，我们看下包含了什么**？

![img](https://pdai.tech/images/tomcat/tomcat-x-container-3.png)

很明显，除了四个组件的嵌套关系，Container中还包含了Realm，Cluster，Listeners, Pipleline等支持组件。

这一点，还可以通过相关注释可以看出：

```html
**Loader** - Class loader to use for integrating new Java classes for this Container into the JVM in which Catalina is running.

**Logger** - Implementation of the log() method signatures of the ServletContext interface.

**Manager** - Manager for the pool of Sessions associated with this Container.

**Realm** - Read-only interface to a security domain, for authenticating user identities and their corresponding roles.

**Resources** - JNDI directory context enabling access to static resources, enabling custom linkages to existing server components when Catalina is embedded in a larger server.
```

#### Tomcat LifeCycle机制？

- Server及其它组件

![img](https://b2files.173114.xyz/blogimg/2025/03/de6620e716e9438c241be13926ca21aa.png)

- Server后续组件生命周期及初始化

![img](https://b2files.173114.xyz/blogimg/2025/03/c5a902529d66eed9949d668bbee1188f.png)

- Server的依赖结构

![img](https://b2files.173114.xyz/blogimg/2025/03/8cb00883061b1c2097633d6cb7580228.png)

```java
public interface Lifecycle {
    /** 第1类：针对监听器 **/
    // 添加监听器
    public void addLifecycleListener(LifecycleListener listener);
    // 获取所以监听器
    public LifecycleListener[] findLifecycleListeners();
    // 移除某个监听器
    public void removeLifecycleListener(LifecycleListener listener);
    
    /** 第2类：针对控制流程 **/
    // 初始化方法
    public void init() throws LifecycleException;
    // 启动方法
    public void start() throws LifecycleException;
    // 停止方法，和start对应
    public void stop() throws LifecycleException;
    // 销毁方法，和init对应
    public void destroy() throws LifecycleException;
    
    /** 第3类：针对状态 **/
    // 获取生命周期状态
    public LifecycleState getState();
    // 获取字符串类型的生命周期状态
    public String getStateName();
}
```

#### Tomcat 中Executor?

- 1.Tomcat希望将Executor也纳入Lifecycle**生命周期管理**，所以让它实现了Lifecycle接口
- 2.**引入超时机制**：也就是说当work queue满时，会等待指定的时间，如果超时将抛出RejectedExecutionException，所以这里增加了一个`void execute(Runnable command, long timeout, TimeUnit unit)`方法; 其实本质上，它构造了JUC中ThreadPoolExecutor，通过它调用ThreadPoolExecutor的`void execute(Runnable command, long timeout, TimeUnit unit)`方法。

#### Tomcat 中的设计模式？

- **责任链模式：管道机制**

在软件开发的常接触的责任链模式是FilterChain，它体现在很多软件设计中：

1. **比如Spring Security框架中**

![img](https://pdai.tech/images/tomcat/tomcat-x-pipline-6.jpg)

1. **比如HttpServletRequest处理的过滤器中**

当一个request过来的时候，需要对这个request做一系列的加工，使用责任链模式可以使每个加工组件化，减少耦合。也可以使用在当一个request过来的时候，需要找到合适的加工方式。当一个加工方式不适合这个request的时候，传递到下一个加工方法，该加工方式再尝试对request加工。

网上找了图，这里我们后文将通过Tomcat请求处理向你阐述。

![img](https://pdai.tech/images/tomcat/tomcat-x-pipline-5.jpg)

- **外观模式：request请求**
- **观察者模式：事件监听**

java中的事件机制的参与者有**3种角色**

1. `Event Eource`：事件源，发起事件的主体。
2. `Event Object`：事件状态对象，传递的信息载体，就好比Watcher的update方法的参数，可以是事件源本身，一般作为参数存在于listerner 的方法之中。
3. `Event Listener`：事件监听器，当它监听到event object产生的时候，它就调用相应的方法，进行处理。

其实还有个东西比较重要：事件环境，在这个环境中，可以添加事件监听器，可以产生事件，可以触发事件监听器。

![img](https://pdai.tech/images/tomcat/tomcat-x-listener-3.png)

- **模板方式： Lifecycle**

LifecycleBase是使用了**状态机**+**模板模式**来实现的。模板方法有下面这几个：

```java
// 初始化方法
protected abstract void initInternal() throws LifecycleException;
// 启动方法
protected abstract void startInternal() throws LifecycleException;
// 停止方法
protected abstract void stopInternal() throws LifecycleException;
// 销毁方法
protected abstract void destroyInternal() throws LifecycleException;
```

#### Tomcat JMX拓展机制？