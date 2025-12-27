---
title: async、await错误处理
---

# async/await 错误处理详解

async/await 提供了更直观的异步代码编写方式，同时也需要相应的错误处理机制。下面详细介绍各种错误处理方法。

## 1. 基本的 try/catch 错误处理

### 基础用法

```javascript
async function fetchData(id) {
  try {
    const response = await fetch(`/api/users/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('获取数据失败:', error.message);
    throw error; // 可以重新抛出错误
  }
}

// 使用
async function main() {
  try {
    const user = await fetchData(123);
    console.log('用户数据:', user);
  } catch (error) {
    console.error('主函数中捕获的错误:', error.message);
  }
}
```

### 多个 await 操作的错误处理

```javascript
async function processUserData(userId) {
  try {
    // 多个异步操作
    const user = await fetchUser(userId);
    const posts = await fetchUserPosts(user.id);
    const comments = await fetchUserComments(user.id);
    
    return {
      user,
      posts,
      comments
    };
  } catch (error) {
    console.error('处理用户数据时出错:', error);
    
    // 根据错误类型进行不同处理
    if (error.name === 'NotFoundError') {
      throw new Error(`用户 ${userId} 不存在`);
    } else if (error.name === 'NetworkError') {
      throw new Error('网络连接失败，请稍后重试');
    } else {
      throw new Error('处理数据时发生未知错误');
    }
  }
}

async function fetchUser(id) {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) {
    const error = new Error('用户不存在');
    error.name = 'NotFoundError';
    throw error;
  }
  return response.json();
}

async function fetchUserPosts(userId) {
  const response = await fetch(`/api/users/${userId}/posts`);
  if (!response.ok) {
    const error = new Error('获取用户文章失败');
    error.name = 'NetworkError';
    throw error;
  }
  return response.json();
}

async function fetchUserComments(userId) {
  const response = await fetch(`/api/users/${userId}/comments`);
  if (!response.ok) {
    const error = new Error('获取用户评论失败');
    error.name = 'NetworkError';
    throw error;
  }
  return response.json();
}
```

## 2. 分别处理每个 await 的错误

### 使用 try/catch 包装每个操作

```javascript
async function processUserDataWithIndividualHandling(userId) {
  let user, posts, comments;
  
  // 处理用户获取
  try {
    user = await fetchUser(userId);
  } catch (error) {
    console.error('获取用户信息失败:', error.message);
    return { error: '获取用户信息失败', partialData: null };
  }
  
  // 处理文章获取
  try {
    posts = await fetchUserPosts(user.id);
  } catch (error) {
    console.error('获取用户文章失败:', error.message);
    posts = []; // 提供默认值
  }
  
  // 处理评论获取
  try {
    comments = await fetchUserComments(user.id);
  } catch (error) {
    console.error('获取用户评论失败:', error.message);
    comments = []; // 提供默认值
  }
  
  return {
    user,
    posts,
    comments,
    message: '处理完成（部分数据可能缺失）'
  };
}
```

### 创建错误处理工具函数

```javascript
// 工具函数：将 Promise 包装成返回 [error, data] 的数组
async function to(promise) {
  try {
    const data = await promise;
    return [null, data];
  } catch (error) {
    return [error, null];
  }
}

// 使用示例
async function processUserDataWithTo(userId) {
  const [userError, user] = await to(fetchUser(userId));
  if (userError) {
    console.error('获取用户失败:', userError.message);
    return { error: '获取用户失败' };
  }
  
  const [postsError, posts] = await to(fetchUserPosts(user.id));
  if (postsError) {
    console.warn('获取文章失败:', postsError.message);
  }
  
  const [commentsError, comments] = await to(fetchUserComments(user.id));
  if (commentsError) {
    console.warn('获取评论失败:', commentsError.message);
  }
  
  return {
    user,
    posts: posts || [],
    comments: comments || [],
    hasErrors: !!(postsError || commentsError)
  };
}
```

## 3. 自定义错误类型

```javascript
// 自定义错误类
class APIError extends Error {
  constructor(message, status, code) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.code = code;
  }
}

class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

class NetworkError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NetworkError';
  }
}

// 带自定义错误的异步函数
async function login(username, password) {
  try {
    // 验证输入
    if (!username) {
      throw new ValidationError('用户名不能为空', 'username');
    }
    
    if (!password) {
      throw new ValidationError('密码不能为空', 'password');
    }
    
    // 发送登录请求
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new APIError(
        errorData.message || '登录失败',
        response.status,
        errorData.code
      );
    }
    
    return await response.json();
  } catch (error) {
    // 如果是网络错误
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new NetworkError('网络连接失败，请检查网络设置');
    }
    
    // 重新抛出自定义错误
    throw error;
  }
}

// 使用自定义错误处理
async function handleLogin() {
  try {
    const result = await login('user@example.com', 'password123');
    console.log('登录成功:', result);
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error(`验证错误 - ${error.field}: ${error.message}`);
    } else if (error instanceof APIError) {
      console.error(`API 错误 (${error.status}): ${error.message}`);
    } else if (error instanceof NetworkError) {
      console.error('网络错误:', error.message);
    } else {
      console.error('未知错误:', error.message);
    }
  }
}
```

## 4. 错误重试机制

```javascript
// 带重试机制的异步函数
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  let lastError;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      lastError = error;
      
      // 如果不是最后一次尝试，等待后重试
      if (i < maxRetries) {
        console.log(`请求失败，${1000 * (i + 1)}ms 后进行第 ${i + 1} 次重试...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }
  
  // 所有重试都失败了
  throw new Error(`请求失败，已重试 ${maxRetries} 次。最后错误: ${lastError.message}`);
}

// 使用示例
async function fetchUserData(userId) {
  try {
    const userData = await fetchWithRetry(`/api/users/${userId}`);
    return userData;
  } catch (error) {
    console.error('获取用户数据最终失败:', error.message);
    throw error;
  }
}
```

## 5. 并行操作的错误处理

```javascript
// 处理并行 Promise 的错误
async function fetchMultipleResources() {
  try {
    // 使用 Promise.all - 任何一个失败都会导致整体失败
    const [user, posts, comments] = await Promise.all([
      fetchUser(1),
      fetchUserPosts(1),
      fetchUserComments(1)
    ]);
    
    return { user, posts, comments };
  } catch (error) {
    console.error('并行获取资源失败:', error.message);
    throw error;
  }
}

// 使用 Promise.allSettled - 即使部分失败也能获取成功的结果
async function fetchMultipleResourcesGracefully() {
  const results = await Promise.allSettled([
    fetchUser(1),
    fetchUserPosts(1),
    fetchUserComments(1)
  ]);
  
  const [userResult, postsResult, commentsResult] = results;
  
  return {
    user: userResult.status === 'fulfilled' ? userResult.value : null,
    posts: postsResult.status === 'fulfilled' ? postsResult.value : [],
    comments: commentsResult.status === 'fulfilled' ? commentsResult.value : [],
    errors: results
      .filter(result => result.status === 'rejected')
      .map(result => result.reason)
  };
}

// 使用 Promise.all 并单独处理每个 Promise 的错误
async function fetchMultipleResourcesWithIndividualHandling() {
  const userPromise = fetchUser(1).catch(error => {
    console.error('获取用户失败:', error.message);
    return null;
  });
  
  const postsPromise = fetchUserPosts(1).catch(error => {
    console.error('获取文章失败:', error.message);
    return [];
  });
  
  const commentsPromise = fetchUserComments(1).catch(error => {
    console.error('获取评论失败:', error.message);
    return [];
  });
  
  const [user, posts, comments] = await Promise.all([
    userPromise,
    postsPromise,
    commentsPromise
  ]);
  
  return { user, posts, comments };
}
```

## 6. 全局错误处理

```javascript
// 全局未处理的 Promise 拒绝处理
window.addEventListener('unhandledrejection', event => {
  console.error('未处理的 Promise 拒绝:', event.reason);
  
  // 可以阻止默认的错误处理
  // event.preventDefault();
});

// 全局异步错误处理函数
async function globalAsyncHandler(asyncFunction, errorHandler) {
  try {
    return await asyncFunction();
  } catch (error) {
    if (errorHandler) {
      errorHandler(error);
    } else {
      console.error('未处理的异步错误:', error);
    }
    throw error;
  }
}

// 使用全局处理器
async function safeFetchUserData(userId) {
  return globalAsyncHandler(
    () => fetchUser(userId),
    (error) => {
      console.error(`获取用户 ${userId} 数据时出错:`, error.message);
      // 可以在这里添加通知用户、记录日志等逻辑
    }
  );
}
```

## 7. 实际应用示例

```javascript
// 完整的用户服务示例
class UserService {
  constructor(apiBaseUrl) {
    this.apiBaseUrl = apiBaseUrl;
  }
  
  async getUserProfile(userId) {
    try {
      // 验证输入
      if (!userId) {
        throw new ValidationError('用户ID不能为空', 'userId');
      }
      
      // 获取用户基本信息
      const user = await this.fetchFromAPI(`/users/${userId}`);
      
      // 并行获取附加信息
      const [postsResult, followersResult] = await Promise.allSettled([
        this.fetchFromAPI(`/users/${userId}/posts`).catch(error => {
          console.warn('获取用户文章失败:', error.message);
          return [];
        }),
        this.fetchFromAPI(`/users/${userId}/followers`).catch(error => {
          console.warn('获取用户关注者失败:', error.message);
          return [];
        })
      ]);
      
      return {
        ...user,
        posts: postsResult.status === 'fulfilled' ? postsResult.value : [],
        followers: followersResult.status === 'fulfilled' ? followersResult.value : [],
        profileComplete: postsResult.status === 'fulfilled' && followersResult.status === 'fulfilled'
      };
    } catch (error) {
      this.handleError(error, `获取用户 ${userId} 信息`);
      throw error;
    }
  }
  
  async fetchFromAPI(endpoint) {
    const url = `${this.apiBaseUrl}${endpoint}`;
    let lastError;
    
    // 最多重试3次
    for (let i = 0; i <= 3; i++) {
      try {
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.getAuthToken()}`
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new APIError(
            errorData.message || `请求失败: ${response.status}`,
            response.status,
            errorData.code
          );
        }
        
        return await response.json();
      } catch (error) {
        lastError = error;
        
        // 如果是客户端错误(4xx)，不重试
        if (error instanceof APIError && error.status >= 400 && error.status < 500) {
          throw error;
        }
        
        // 如果不是最后一次尝试，等待后重试
        if (i < 3) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
      }
    }
    
    throw lastError;
  }
  
  getAuthToken() {
    // 模拟获取认证令牌
    return localStorage.getItem('authToken') || '';
  }
  
  handleError(error, context) {
    if (error instanceof ValidationError) {
      console.error(`${context} - 验证错误: ${error.message}`);
    } else if (error instanceof APIError) {
      console.error(`${context} - API错误 (${error.status}): ${error.message}`);
    } else if (error instanceof NetworkError) {
      console.error(`${context} - 网络错误: ${error.message}`);
    } else {
      console.error(`${context} - 未知错误:`, error);
    }
  }
}

// 使用示例
const userService = new UserService('https://api.example.com');

async function displayUserProfile(userId) {
  try {
    const profile = await userService.getUserProfile(userId);
    
    console.log('用户资料:', profile);
    
    if (!profile.profileComplete) {
      console.warn('部分用户数据获取失败，显示不完整');
    }
    
    // 更新UI
    updateProfileUI(profile);
  } catch (error) {
    // 显示错误信息给用户
    showErrorMessage('获取用户信息失败，请稍后重试');
  }
}

function updateProfileUI(profile) {
  // 更新用户界面的实现
  console.log('更新用户界面:', profile);
}

function showErrorMessage(message) {
  // 显示错误消息的实现
  console.log('显示错误消息:', message);
}
```

## 总结

async/await 的错误处理要点：

1. **使用 try/catch** - 最基本和常用的方法
2. **分别处理** - 对每个 await 操作单独处理错误
3. **自定义错误类型** - 创建特定的错误类以便更好地处理
4. **重试机制** - 对于网络请求等可重试的操作
5. **并行处理** - 根据需求选择合适的 Promise 组合方式
6. **全局处理** - 捕获未处理的异步错误
7. **工具函数** - 创建辅助函数简化错误处理

选择合适的错误处理策略取决于具体的应用场景和错误恢复需求。