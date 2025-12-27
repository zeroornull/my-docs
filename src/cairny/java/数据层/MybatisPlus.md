---
title: 'Mybatisplus'
---

MyBatis-Plus 是一个 MyBatis 的增强工具，在 MyBatis 的基础上只做增强不做改变，为简化开发、提高效率而生。

## 核心特性

### 1. 无侵入
只做增强不做改变，引入它不会对现有工程产生影响

### 2. 损耗小
启动即会自动注入基本 CRUD，性能基本无损耗

### 3. 强大的 CRUD 操作
内置通用 Mapper、通用 Service，通过少量配置即可实现单表大部分 CRUD 操作

### 4. 支持 Lambda 形式调用
通过 Lambda 表达式，方便的编写各类查询条件

### 5. 支持主键自动生成
支持多达 4 种主键策略（内含分布式唯一 ID 生成器 - Sequence）

## 快速入门 Demo

### 1. 添加依赖

```xml
<!-- pom.xml -->
<dependencies>
    <dependency>
        <groupId>com.baomidou</groupId>
        <artifactId>mybatis-plus-boot-starter</artifactId>
        <version>3.5.3.1</version>
    </dependency>
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>
```

### 2. 配置文件

```yaml
# application.yml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/test?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=GMT%2B8
    username: root
    password: root

mybatis-plus:
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
  global-config:
    db-config:
      id-type: auto
```

### 3. 创建实体类

```java
// User.java
import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("user") // 指定表名
public class User {
    /**
     * 主键ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 姓名
     */
    private String name;

    /**
     * 年龄
     */
    private Integer age;

    /**
     * 邮箱
     */
    private String email;

    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    /**
     * 逻辑删除标识(0-未删除，1-已删除)
     */
    @TableLogic
    private Integer deleted;
}
```

### 4. 创建 Mapper 接口

```java
// UserMapper.java
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper extends BaseMapper<User> {
    // 继承 BaseMapper 后，无需编写基本的 CRUD 方法
}
```

### 5. 创建 Service 层

```java
// UserService.java
import com.baomidou.mybatisplus.extension.service.IService;

public interface UserService extends IService<User> {
    // 继承 IService 后，获得常用的业务方法
}

// UserServiceImpl.java
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {
    // 实现类继承 ServiceImpl 并实现自定义接口
}
```

### 6. 创建 Controller

```java
// UserController.java
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * 新增用户
     */
    @PostMapping
    public boolean save(@RequestBody User user) {
        return userService.save(user);
    }

    /**
     * 根据ID更新用户
     */
    @PutMapping
    public boolean update(@RequestBody User user) {
        return userService.updateById(user);
    }

    /**
     * 根据ID删除用户
     */
    @DeleteMapping("/{id}")
    public boolean delete(@PathVariable Long id) {
        return userService.removeById(id);
    }

    /**
     * 查询所有用户
     */
    @GetMapping
    public List<User> findAll() {
        return userService.list();
    }

    /**
     * 根据ID查询用户
     */
    @GetMapping("/{id}")
    public User findById(@PathVariable Long id) {
        return userService.getById(id);
    }

    /**
     * 分页查询
     */
    @GetMapping("/page")
    public Page<User> findPage(@RequestParam(defaultValue = "1") Integer pageNum,
                               @RequestParam(defaultValue = "10") Integer pageSize) {
        Page<User> page = new Page<>(pageNum, pageSize);
        return userService.page(page);
    }

    /**
     * 条件查询
     */
    @GetMapping("/search")
    public List<User> search(@RequestParam(required = false) String name,
                             @RequestParam(required = false) Integer age) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        if (name != null && !name.isEmpty()) {
            queryWrapper.like("name", name);
        }
        if (age != null) {
            queryWrapper.eq("age", age);
        }
        return userService.list(queryWrapper);
    }
}
```

### 7. 配置自动填充

```java
// MyMetaObjectHandler.java
import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
public class MyMetaObjectHandler implements MetaObjectHandler {

    @Override
    public void insertFill(MetaObject metaObject) {
        this.strictInsertFill(metaObject, "createTime", LocalDateTime.class, LocalDateTime.now());
        this.strictInsertFill(metaObject, "updateTime", LocalDateTime.class, LocalDateTime.now());
    }

    @Override
    public void updateFill(MetaObject metaObject) {
        this.strictUpdateFill(metaObject, "updateTime", LocalDateTime.class, LocalDateTime.now());
    }
}
```

### 8. 启动类

```java
// Application.java
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.example.mapper") // 扫描 Mapper 接口
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

## 高级功能示例

### 1. Lambda 查询

```java
// LambdaQueryExample.java
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/lambda")
public class LambdaQueryExample {

    @Autowired
    private UserService userService;

    /**
     * 使用 Lambda 查询年龄大于等于18的用户
     */
    @GetMapping("/adults")
    public List<User> getAdults() {
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.ge(User::getAge, 18);
        return userService.list(queryWrapper);
    }

    /**
     * 使用 Lambda 查询特定邮箱域名的用户
     */
    @GetMapping("/gmail")
    public List<User> getGmailUsers() {
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.likeRight(User::getEmail, "gmail");
        return userService.list(queryWrapper);
    }
}
```

### 2. 分页插件配置

```java
// MybatisPlusConfig.java
import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MybatisPlusConfig {

    /**
     * 分页插件
     */
    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.MYSQL));
        return interceptor;
    }
}
```

### 3. 自定义 SQL

```java
// UserMapper.java (扩展)
import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.toolkit.Constants;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import java.util.List;

public interface UserMapper extends BaseMapper<User> {
    
    /**
     * 自定义 SQL 查询
     */
    @Select("SELECT * FROM user ${ew.customSqlSegment}")
    List<User> selectByCustomWrapper(@Param(Constants.WRAPPER) Wrapper<User> wrapper);
    
    /**
     * 根据年龄范围查询用户
     */
    @Select("SELECT * FROM user WHERE age BETWEEN #{minAge} AND #{maxAge}")
    List<User> selectByAgeRange(@Param("minAge") Integer minAge, @Param("maxAge") Integer maxAge);
}
```

### 4. 乐观锁

```java
// User.java (添加版本字段)
import com.baomidou.mybatisplus.annotation.Version;

public class User {
    // ... 其他字段
    
    /**
     * 乐观锁版本号
     */
    @Version
    private Integer version;
}

// OptimisticLockerConfig.java
import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.OptimisticLockerInnerInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OptimisticLockerConfig {
    
    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        interceptor.addInnerInterceptor(new OptimisticLockerInnerInterceptor());
        return interceptor;
    }
}
```

## 主要优势

1. **简化开发**: 大量减少重复代码，只需要继承相应的接口即可获得完整的 CRUD 功能
2. **强大的条件构造器**: 提供链式调用的查询条件构造器
3. **代码生成器**: 可以根据数据库表自动生成实体类、Mapper、Service 等
4. **分页插件**: 内置分页插件，支持多种数据库
5. **性能分析插件**: 可以输出 SQL 语句及相关执行信息
6. **乐观锁插件**: 支持乐观锁机制

MyBatis-Plus 在保持 MyBatis 灵活性的同时，大大简化了开发工作，特别适合单表操作较多的项目，能显著提高开发效率。