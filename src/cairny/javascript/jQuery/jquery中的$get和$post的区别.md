---
title: jquery中的$get和$post的区别
---

## jQuery 中 $.get() 和 $.post() 的区别

### 1. HTTP 请求方法不同

#### $.get()
- 使用 **GET** 请求方法
- 数据附加在 URL 后面作为查询字符串传递
- 适用于获取数据的请求

#### $.post()
- 使用 **POST** 请求方法
- 数据在请求体中传递
- 适用于提交数据的请求

### 2. 数据传输方式

#### $.get() 数据传输
```javascript
// 数据作为查询参数附加在 URL 上
$.get('api/users.php', {id: 123, name: 'John'}, function(data) {
  console.log(data);
});

// 实际请求 URL: api/users.php?id=123&name=John
```

#### $.post() 数据传输
```javascript
// 数据在请求体中发送
$.post('api/users.php', {id: 123, name: 'John'}, function(data) {
  console.log(data);
});

// 数据在请求体中，不会显示在 URL 中
```

### 3. 数据长度限制

#### $.get()
- 受 URL 长度限制（通常 2048 字符）
- 不适合传输大量数据
- 数据在浏览器历史记录中可见

#### $.post()
- 理论上没有数据长度限制
- 适合传输大量数据
- 数据不会显示在 URL 中

### 4. 缓存行为

#### $.get()
- 默认会被浏览器缓存
- 可通过添加时间戳等参数避免缓存

```javascript
// 避免缓存的 get 请求
$.get('api/data.php', {_: new Date().getTime()}, function(data) {
  console.log(data);
});
```

#### $.post()
- 默认不会被缓存
- 每次请求都会发送到服务器

### 5. 安全性考虑

#### $.get()
- 数据在 URL 中可见，安全性较低
- 不适合传输敏感信息
- 数据会被记录在服务器日志中

#### $.post()
- 数据在请求体中，相对安全
- 适合传输敏感信息
- 不会在 URL 中暴露数据

### 6. 使用场景对比

#### $.get() 适用场景
```javascript
// 获取用户信息
$.get('api/getUser.php', {userId: 123}, function(user) {
  console.log(user);
});

// 搜索功能
$.get('api/search.php', {query: 'keyword'}, function(results) {
  displayResults(results);
});

// 获取配置信息
$.get('api/config.php', function(config) {
  initApp(config);
});
```

#### $.post() 适用场景
```javascript
// 用户登录
$.post('api/login.php', {
  username: 'john',
  password: 'secret123'
}, function(response) {
  if(response.success) {
    // 登录成功处理
  }
});

// 提交表单数据
$.post('api/submitForm.php', {
  name: $('#name').val(),
  email: $('#email').val(),
  message: $('#message').val()
}, function(response) {
  showSuccessMessage();
});

// 创建新记录
$.post('api/createUser.php', {
  userData: {
    name: 'John Doe',
    email: 'john@example.com'
  }
}, function(result) {
  handleCreateResult(result);
});
```

### 7. 语法对比

#### $.get() 语法
```javascript
// 基本语法
$.get(url, data, successCallback, dataType);

// 示例
$.get('api/data.php', 
  {param1: 'value1'}, 
  function(data) { console.log(data); }, 
  'json'
);
```

#### $.post() 语法
```javascript
// 基本语法
$.post(url, data, successCallback, dataType);

// 示例
$.post('api/data.php', 
  {param1: 'value1'}, 
  function(data) { console.log(data); }, 
  'json'
);
```

### 8. Promise 风格使用

#### $.get() Promise 风格
```javascript
$.get('api/data.php', {id: 123})
  .done(function(data) {
    console.log('成功:', data);
  })
  .fail(function(xhr, status, error) {
    console.log('失败:', error);
  })
  .always(function() {
    console.log('请求完成');
  });
```

#### $.post() Promise 风格
```javascript
$.post('api/data.php', {name: 'John', age: 30})
  .done(function(data) {
    console.log('提交成功:', data);
  })
  .fail(function(xhr, status, error) {
    console.log('提交失败:', error);
  })
  .always(function() {
    console.log('请求完成');
  });
```

### 9. 选择建议

#### 使用 $.get() 当：
- 需要从服务器获取数据
- 数据量较小
- 不涉及敏感信息
- 希望请求可以被缓存
- 需要书签或分享 URL

#### 使用 $.post() 当：
- 需要向服务器发送数据
- 数据量较大
- 涉及敏感信息（密码、个人信息等）
- 不希望数据出现在 URL 中
- 需要修改服务器状态

### 10. 性能考虑

#### $.get()
- 可能被缓存，提高性能
- URL 中的数据可以被 CDN 缓存
- 适合读取操作

#### $.post()
- 每次都发送到服务器
- 适合写入操作
- 不会被中间代理缓存

总结来说，`$.get()` 适合获取数据，而 `$.post()` 适合提交数据，选择哪种方法主要取决于 HTTP 方法的语义和具体的应用场景。