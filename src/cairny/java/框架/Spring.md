---
title: 'Spring'
---

Spring 是一个开源的 Java 平台应用程序框架，是现代 Java 开发的核心技术之一。它提供了全面的编程和配置模型，简化了企业级应用开发。

## Spring 核心概念

### 1. 控制反转 (IoC - Inversion of Control)
控制权由程序代码转移到外部容器，由容器创建和管理对象。

### 2. 依赖注入 (DI - Dependency Injection)
对象之间的依赖关系由容器在运行时自动注入，而不是在代码中硬编码。

### 3. 面向切面编程 (AOP - Aspect Oriented Programming)
将横切关注点（如日志、事务、安全等）与业务逻辑分离。

### 4. 容器
Spring 容器负责创建、配置和管理应用程序中的对象（称为 Bean）。

## Spring 核心模块

1. **Spring Core Container**: 核心容器，提供 IoC 和 DI 功能
2. **Spring AOP**: 面向切面编程模块
3. **Spring Data Access/Integration**: 数据访问和集成模块
4. **Spring Web**: Web 开发模块
5. **Spring Test**: 测试模块

## Spring Boot 示例

Spring Boot 是基于 Spring 的快速开发框架，简化了 Spring 应用的配置和部署。

### 1. 项目依赖

```xml
<!-- pom.xml -->
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>com.h2database</groupId>
        <artifactId>h2</artifactId>
        <scope>runtime</scope>
    </dependency>
</dependencies>
```

### 2. 配置文件

```yaml
# application.yml
spring:
  datasource:
    url: jdbc:h2:mem:testdb
    driver-class-name: org.h2.Driver
    username: sa
    password: 
  jpa:
    database-platform: org.hibernate.dialect.H2Dialect
    hibernate:
      ddl-auto: create-drop
    show-sql: true
  h2:
    console:
      enabled: true

logging:
  level:
    org.springframework.web: DEBUG
    org.hibernate: DEBUG
```

### 3. 实体类

```java
// User.java
import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private Integer age;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // 构造函数
    public User() {}
    
    public User(String name, String email, Integer age) {
        this.name = name;
        this.email = email;
        this.age = age;
        this.createdAt = LocalDateTime.now();
    }
    
    // Getter 和 Setter 方法
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public Integer getAge() {
        return age;
    }
    
    public void setAge(Integer age) {
        this.age = age;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
```

### 4. Repository 层

```java
// UserRepository.java
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    
    // 根据邮箱查找用户
    Optional<User> findByEmail(String email);
    
    // 根据年龄查找用户
    List<User> findByAgeGreaterThan(Integer age);
    
    // 自定义查询
    @Query("SELECT u FROM User u WHERE u.name LIKE %:name%")
    List<User> findByNameContaining(@Param("name") String name);
    
    // 统计用户数量
    long countByAgeGreaterThan(Integer age);
}
```

### 5. Service 层

```java
// UserService.java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
    
    public User createUser(User user) {
        return userRepository.save(user);
    }
    
    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        user.setName(userDetails.getName());
        user.setEmail(userDetails.getEmail());
        user.setAge(userDetails.getAge());
        
        return userRepository.save(user);
    }
    
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        userRepository.delete(user);
    }
    
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public List<User> getAdultUsers() {
        return userRepository.findByAgeGreaterThan(18);
    }
}
```

### 6. Controller 层

```java
// UserController.java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    // 获取所有用户
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }
    
    // 根据ID获取用户
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userService.getUserById(id);
        return user.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }
    
    // 创建用户
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        try {
            User createdUser = userService.createUser(user);
            return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // 更新用户
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        try {
            User updatedUser = userService.updateUser(id, userDetails);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // 删除用户
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // 根据邮箱查找用户
    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        Optional<User> user = userService.getUserByEmail(email);
        return user.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }
    
    // 获取成年用户
    @GetMapping("/adults")
    public List<User> getAdultUsers() {
        return userService.getAdultUsers();
    }
}
```

### 7. 配置类

```java
// AppConfig.java
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class AppConfig implements WebMvcConfigurer {
    
    // 配置跨域请求
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*");
    }
}
```

### 8. 启动类

```java
// Application.java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

### 9. 初始化数据

```java
// DataInitializer.java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public void run(String... args) throws Exception {
        // 初始化一些测试数据
        userRepository.save(new User("张三", "zhangsan@example.com", 25));
        userRepository.save(new User("李四", "lisi@example.com", 30));
        userRepository.save(new User("王五", "wangwu@example.com", 17));
        userRepository.save(new User("赵六", "zhaoliu@example.com", 22));
    }
}
```

## 高级特性示例

### 1. AOP 切面编程

```java
// LoggingAspect.java
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LoggingAspect {
    
    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);
    
    @Around("execution(* com.example.service.*.*(..))")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();
        
        Object result = joinPoint.proceed();
        
        long endTime = System.currentTimeMillis();
        logger.info("{} 执行时间: {} ms", joinPoint.getSignature(), endTime - startTime);
        
        return result;
    }
}
```

### 2. 异常处理

```java
// GlobalExceptionHandler.java
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException e) {
        return new ResponseEntity<>("错误: " + e.getMessage(), HttpStatus.NOT_FOUND);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGenericException(Exception e) {
        return new ResponseEntity<>("系统错误: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
```

### 3. 配置属性

```java
// AppProperties.java
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    private String name;
    private String version;
    private boolean debug;
    
    // Getters and Setters
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getVersion() {
        return version;
    }
    
    public void setVersion(String version) {
        this.version = version;
    }
    
    public boolean isDebug() {
        return debug;
    }
    
    public void setDebug(boolean debug) {
        this.debug = debug;
    }
}
```

```yaml
# application.yml 中添加配置
app:
  name: "Spring Demo Application"
  version: "1.0.0"
  debug: true
```

## 主要优势

1. **轻量级**: Spring 是轻量级框架，基本版本非常小
2. **控制反转**: 通过 IoC 容器管理对象生命周期和配置
3. **面向切面**: 提供声明式事务管理等功能
4. **容器**: Spring 容器管理应用对象的配置和生命周期
5. **框架集成**: 可以与其他流行框架无缝集成
6. **测试友好**: 提供了很好的测试支持

这个示例展示了 Spring Boot 如何简化企业级应用开发，通过自动配置和约定优于配置的原则，大大减少了样板代码和配置工作。