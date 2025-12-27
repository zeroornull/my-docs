---
title: 'SpringBoot'
---

Spring Boot 是 Spring 框架的一个扩展，它简化了基于 Spring 的应用程序的初始搭建以及开发过程。它采用"约定优于配置"的理念，让开发者能够快速构建独立的、生产级别的 Spring 应用程序。

## Spring Boot 核心特性

### 1. 自动配置 (Auto Configuration)
根据类路径中的依赖自动配置 Spring 应用程序。

### 2. 起步依赖 (Starter Dependencies)
提供一系列便捷的依赖描述符，简化 Maven/Gradle 配置。

### 3. 内嵌服务器 (Embedded Servers)
内嵌 Tomcat、Jetty 或 Undertow，无需部署 WAR 文件。

### 4. 生产就绪特性 (Production-ready Features)
提供健康检查、指标监控、外部化配置等生产环境所需功能。

## 快速入门 Demo

### 1. 项目结构

```
spring-boot-demo/
├── src/
│   └── main/
│       ├── java/
│       │   └── com/
│       │       └── example/
│       │           └── demo/
│       │               ├── DemoApplication.java
│       │               ├── controller/
│       │               │   ├── UserController.java
│       │               │   └── HomeController.java
│       │               ├── model/
│       │               │   └── User.java
│       │               ├── repository/
│       │               │   └── UserRepository.java
│       │               ├── service/
│       │               │   ├── UserService.java
│       │               │   └── impl/
│       │               │       └── UserServiceImpl.java
│       │               └── config/
│       │                   └── WebConfig.java
│       └── resources/
│           ├── application.yml
│           ├── static/
│           └── templates/
└── pom.xml
```

### 2. Maven 依赖配置

```xml
<!-- pom.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.1.0</version>
        <relativePath/>
    </parent>

    <groupId>com.example</groupId>
    <artifactId>spring-boot-demo</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>

    <properties>
        <java.version>17</java.version>
    </properties>

    <dependencies>
        <!-- Web 起步依赖 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- 数据 JPA 起步依赖 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>

        <!-- H2 数据库 -->
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- 验证 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- 测试 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>

        <!-- Lombok (可选) -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

### 3. 配置文件

```yaml
# application.yml
server:
  port: 8080
  servlet:
    context-path: /api

spring:
  application:
    name: spring-boot-demo
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
    properties:
      hibernate:
        format_sql: true
  h2:
    console:
      enabled: true
      path: /h2-console

logging:
  level:
    com.example.demo: DEBUG
    org.springframework.web: INFO
    org.hibernate.SQL: DEBUG
    org.hibernate.type.descriptor.sql.BasicBinder: TRACE

# 自定义配置
app:
  name: Spring Boot Demo Application
  version: 1.0.0
  description: A sample Spring Boot application
```

### 4. 实体类

```java
// User.java
package com.example.demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "姓名不能为空")
    @Column(nullable = false)
    private String name;
    
    @Email(message = "邮箱格式不正确")
    @NotBlank(message = "邮箱不能为空")
    @Column(unique = true, nullable = false)
    private String email;
    
    @NotNull(message = "年龄不能为空")
    @Min(value = 0, message = "年龄必须大于等于0")
    @Column(nullable = false)
    private Integer age;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // 构造函数
    public User() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public User(String name, String email, Integer age) {
        this();
        this.name = name;
        this.email = email;
        this.age = age;
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
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
```

### 5. Repository 层

```java
// UserRepository.java
package com.example.demo.repository;

import com.example.demo.model.User;
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
    
    // 根据姓名查找用户（模糊查询）
    List<User> findByNameContainingIgnoreCase(String name);
    
    // 自定义查询
    @Query("SELECT u FROM User u WHERE u.age BETWEEN :minAge AND :maxAge")
    List<User> findByAgeRange(@Param("minAge") Integer minAge, @Param("maxAge") Integer maxAge);
    
    // 统计用户数量
    long countByAgeGreaterThan(Integer age);
}
```

### 6. Service 层

```java
// UserService.java
package com.example.demo.service;

import com.example.demo.model.User;
import java.util.List;
import java.util.Optional;

public interface UserService {
    List<User> getAllUsers();
    Optional<User> getUserById(Long id);
    User createUser(User user);
    User updateUser(Long id, User userDetails);
    void deleteUser(Long id);
    Optional<User> getUserByEmail(String email);
    List<User> getAdultUsers();
    List<User> searchUsersByName(String name);
    List<User> getUsersByAgeRange(Integer minAge, Integer maxAge);
}

// UserServiceImpl.java
package com.example.demo.service.impl;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    @Override
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
    
    @Override
    public User createUser(User user) {
        return userRepository.save(user);
    }
    
    @Override
    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        user.setName(userDetails.getName());
        user.setEmail(userDetails.getEmail());
        user.setAge(userDetails.getAge());
        
        return userRepository.save(user);
    }
    
    @Override
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        userRepository.delete(user);
    }
    
    @Override
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    @Override
    public List<User> getAdultUsers() {
        return userRepository.findByAgeGreaterThan(18);
    }
    
    @Override
    public List<User> searchUsersByName(String name) {
        return userRepository.findByNameContainingIgnoreCase(name);
    }
    
    @Override
    public List<User> getUsersByAgeRange(Integer minAge, Integer maxAge) {
        return userRepository.findByAgeRange(minAge, maxAge);
    }
}
```

### 7. Controller 层

```java
// HomeController.java
package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
public class HomeController {
    
    @Value("${app.name}")
    private String appName;
    
    @Value("${app.version}")
    private String appVersion;
    
    @GetMapping("/")
    public Map<String, String> home() {
        Map<String, String> info = new HashMap<>();
        info.put("application", appName);
        info.put("version", appVersion);
        info.put("message", "Welcome to Spring Boot Demo Application!");
        info.put("status", "Running");
        return info;
    }
    
    @GetMapping("/health")
    public Map<String, String> health() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        status.put("timestamp", java.time.LocalDateTime.now().toString());
        return status;
    }
}

// UserController.java
package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users")
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
    public ResponseEntity<User> createUser(@Valid @RequestBody User user) {
        try {
            User createdUser = userService.createUser(user);
            return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // 更新用户
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @Valid @RequestBody User userDetails) {
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
    
    // 搜索用户
    @GetMapping("/search")
    public List<User> searchUsers(@RequestParam(required = false) String name,
                                  @RequestParam(required = false) Integer minAge,
                                  @RequestParam(required = false) Integer maxAge) {
        if (name != null && !name.isEmpty()) {
            return userService.searchUsersByName(name);
        }
        
        if (minAge != null && maxAge != null) {
            return userService.getUsersByAgeRange(minAge, maxAge);
        }
        
        return userService.getAllUsers();
    }
}
```

### 8. 配置类

```java
// WebConfig.java
package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    // 配置跨域请求
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .maxAge(3600);
    }
}
```

### 9. 启动类

```java
// DemoApplication.java
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
```

### 10. 初始化数据

```java
// DataInitializer.java
package com.example.demo;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
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
        userRepository.save(new User("钱七", "qianqi@example.com", 28));
    }
}
```

## 高级特性示例

### 1. 配置属性

```java
// AppProperties.java
package com.example.demo.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    private String name;
    private String version;
    private String description;
    private boolean debug = false;
    
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
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public boolean isDebug() {
        return debug;
    }
    
    public void setDebug(boolean debug) {
        this.debug = debug;
    }
}
```

### 2. 异常处理

```java
// GlobalExceptionHandler.java
package com.example.demo.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException e) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.NOT_FOUND.value(),
            e.getMessage(),
            LocalDateTime.now()
        );
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception e) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "系统内部错误: " + e.getMessage(),
            LocalDateTime.now()
        );
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    // 错误响应类
    public static class ErrorResponse {
        private int status;
        private String message;
        private LocalDateTime timestamp;
        
        public ErrorResponse(int status, String message, LocalDateTime timestamp) {
            this.status = status;
            this.message = message;
            this.timestamp = timestamp;
        }
        
        // Getters
        public int getStatus() { return status; }
        public String getMessage() { return message; }
        public LocalDateTime getTimestamp() { return timestamp; }
    }
}
```

### 3. 自定义 Starter

```java
// DemoAutoConfiguration.java
package com.example.demo.starter;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConditionalOnProperty(prefix = "demo", name = "enabled", havingValue = "true", matchIfMissing = true)
@EnableConfigurationProperties(DemoProperties.class)
public class DemoAutoConfiguration {
    
    @Bean
    @ConditionalOnMissingBean
    public DemoService demoService(DemoProperties properties) {
        return new DemoService(properties.getMessage());
    }
}

// DemoProperties.java
package com.example.demo.starter;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "demo")
public class DemoProperties {
    private String message = "Hello from Demo Starter!";
    private boolean enabled = true;
    
    // Getters and Setters
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public boolean isEnabled() {
        return enabled;
    }
    
    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
}

// DemoService.java
package com.example.demo.starter;

public class DemoService {
    private final String message;
    
    public DemoService(String message) {
        this.message = message;
    }
    
    public String getMessage() {
        return message;
    }
}
```

## 运行和测试

### 1. 启动应用

```bash
# 使用 Maven 启动
mvn spring-boot:run

# 或者打包后运行
mvn clean package
java -jar target/spring-boot-demo-1.0.0.jar
```

### 2. API 测试示例

```bash
# 获取所有用户
curl -X GET http://localhost:8080/api/users

# 根据ID获取用户
curl -X GET http://localhost:8080/api/users/1

# 创建用户
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"测试用户","email":"test@example.com","age":25}'

# 更新用户
curl -X PUT http://localhost:8080/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"更新用户","email":"updated@example.com","age":30}'

# 删除用户
curl -X DELETE http://localhost:8080/api/users/1

# 搜索用户
curl -X GET "http://localhost:8080/api/users/search?name=张"

# 获取成年用户
curl -X GET http://localhost:8080/api/users/adults
```

## Spring Boot 主要优势

1. **快速开发**: 通过自动配置和起步依赖，大大减少配置工作
2. **内嵌服务器**: 无需部署到外部服务器，可直接运行
3. **生产就绪**: 内置健康检查、指标监控、外部化配置等功能
4. **无代码生成**: 不需要生成额外的代码或XML配置
5. **灵活部署**: 可以打包成可执行JAR文件，便于部署和运行
6. **丰富的生态系统**: 与大量第三方库无缝集成

Spring Boot 使得 Spring 应用的开发变得更加简单和高效，是现代 Java Web 开发的首选框架。