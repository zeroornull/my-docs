---
title: ES6中的Promise
---

## ES6 中 Promise 详解

Promise 是 ES6 引入的用于处理异步操作的重要特性，它提供了一种更加优雅和可控的方式来处理异步代码，避免了传统的回调地狱问题。

## Promise 的基本概念

Promise 是一个代表异步操作最终完成或失败的对象。它有三种状态：

1. **Pending（待定）**：初始状态，既没有被兑现，也没有被拒绝
2. **Fulfilled（已兑现）**：操作成功完成
3. **Rejected（已拒绝）**：操作失败

## Promise 的基本语法

```javascript
// 创建 Promise
const promise = new Promise((resolve, reject) => {
    // 异步操作
    setTimeout(() => {
        const success = true;
        if (success) {
            resolve('操作成功');
        } else {
            reject('操作失败');
        }
    }, 1000);
});

// 使用 Promise
promise
    .then(result => {
        console.log(result); // 操作成功
    })
    .catch(error => {
        console.error(error); // 操作失败
    })
    .finally(() => {
        console.log('操作完成'); // 无论成功失败都会执行
    });
```

## 实际使用场景

### 1. API 请求处理

```javascript
// 封装 fetch 请求为 Promise
function apiRequest(url, options = {}) {
    return fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error('API 请求失败:', error);
            throw error;
        });
}

// 使用示例
apiRequest('/api/users')
    .then(users => {
        console.log('用户列表:', users);
        return apiRequest(`/api/users/${users[0].id}`);
    })
    .then(user => {
        console.log('用户详情:', user);
        return apiRequest(`/api/users/${user.id}/posts`);
    })
    .then(posts => {
        console.log('用户文章:', posts);
    })
    .catch(error => {
        console.error('请求链失败:', error);
    });
```

### 2. 并行和串行执行

```javascript
// 并行执行多个 Promise
function fetchUserData(userId) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ id: userId, name: `用户${userId}` });
        }, Math.random() * 1000);
    });
}

function fetchUserPosts(userId) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([`用户${userId}的文章1`, `用户${userId}的文章2`]);
        }, Math.random() * 1000);
    });
}

// 并行执行 - Promise.all
Promise.all([
    fetchUserData(1),
    fetchUserData(2),
    fetchUserData(3)
]).then(users => {
    console.log('所有用户数据:', users);
});

// 并行执行 - Promise.allSettled（ES2020）
Promise.allSettled([
    fetchUserData(1),
    Promise.reject('用户2获取失败'),
    fetchUserData(3)
]).then(results => {
    results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
            console.log(`用户${index + 1}获取成功:`, result.value);
        } else {
            console.log(`用户${index + 1}获取失败:`, result.reason);
        }
    });
});

// 串行执行
function fetchUsersSerially(userIds) {
    return userIds.reduce((promise, userId) => {
        return promise.then(results => {
            return fetchUserData(userId).then(user => {
                results.push(user);
                return results;
            });
        });
    }, Promise.resolve([]));
}

fetchUsersSerially([1, 2, 3]).then(users => {
    console.log('串行获取的用户:', users);
});
```

### 3. 超时控制

```javascript
// 为 Promise 添加超时控制
function withTimeout(promise, timeoutMs) {
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error(`操作超时 (${timeoutMs}ms)`));
        }, timeoutMs);
    });
    
    return Promise.race([promise, timeoutPromise]);
}

// 使用示例
function slowOperation() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('慢操作完成');
        }, 3000);
    });
}

withTimeout(slowOperation(), 2000)
    .then(result => {
        console.log(result);
    })
    .catch(error => {
        console.error(error.message); // 操作超时 (2000ms)
    });
```

### 4. 重试机制

```javascript
// 带重试机制的 Promise
function retryPromise(promiseFn, maxRetries = 3, delay = 1000) {
    return new Promise((resolve, reject) => {
        const attempt = (retriesLeft) => {
            promiseFn()
                .then(resolve)
                .catch(error => {
                    if (retriesLeft <= 0) {
                        reject(new Error(`重试${maxRetries}次后仍然失败: ${error.message}`));
                    } else {
                        console.log(`操作失败，${delay}ms后进行第${maxRetries - retriesLeft + 1}次重试`);
                        setTimeout(() => {
                            attempt(retriesLeft - 1);
                        }, delay);
                    }
                });
        };
        
        attempt(maxRetries);
    });
}

// 模拟不稳定的 API
function unstableApi() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() > 0.7) {
                resolve('API 调用成功');
            } else {
                reject(new Error('API 调用失败'));
            }
        }, 500);
    });
}

retryPromise(unstableApi, 3, 1000)
    .then(result => {
        console.log('最终成功:', result);
    })
    .catch(error => {
        console.error('最终失败:', error.message);
    });
```

### 5. 缓存机制

```javascript
// 带缓存的 Promise
class PromiseCache {
    constructor() {
        this.cache = new Map();
    }
    
    fetch(key, fetcher, ttl = 60000) {
        // 检查缓存
        if (this.cache.has(key)) {
            const cached = this.cache.get(key);
            if (Date.now() - cached.timestamp < ttl) {
                console.log(`从缓存获取: ${key}`);
                return Promise.resolve(cached.data);
            } else {
                // 缓存过期，删除
                this.cache.delete(key);
            }
        }
        
        // 执行获取操作
        console.log(`获取新数据: ${key}`);
        return fetcher().then(data => {
            // 缓存结果
            this.cache.set(key, {
                data,
                timestamp: Date.now()
            });
            return data;
        });
    }
    
    clear() {
        this.cache.clear();
    }
}

// 使用示例
const cache = new PromiseCache();

function fetchUserData(id) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ id, name: `用户${id}`, timestamp: Date.now() });
        }, 1000);
    });
}

// 第一次获取
cache.fetch('user:1', () => fetchUserData(1))
    .then(user => console.log('第一次:', user));

// 立即第二次获取（从缓存）
setTimeout(() => {
    cache.fetch('user:1', () => fetchUserData(1))
        .then(user => console.log('第二次:', user));
}, 500);

// 延迟获取（缓存过期）
setTimeout(() => {
    cache.fetch('user:1', () => fetchUserData(1))
        .then(user => console.log('第三次:', user));
}, 61000);
```

### 6. 批量处理

```javascript
// 批量处理 Promise（控制并发数）
function batchProcess(items, processor, concurrency = 3) {
    const results = [];
    const executing = [];
    
    for (const [index, item] of items.entries()) {
        const promise = Promise.resolve().then(() => processor(item, index));
        results.push(promise);
        
        if (items.length >= concurrency) {
            const e = promise.then(() => executing.splice(executing.indexOf(e), 1));
            executing.push(e);
            
            if (executing.length >= concurrency) {
                yield Promise.race(executing);
            }
        }
    }
    
    return Promise.all(results);
}

// 或者更简单的并发控制
function processWithConcurrency(items, processor, concurrency = 3) {
    return new Promise((resolve, reject) => {
        const results = [];
        let index = 0;
        let completed = 0;
        let failed = false;
        
        function processNext() {
            if (index >= items.length) return;
            
            const currentIndex = index++;
            processor(items[currentIndex], currentIndex)
                .then(result => {
                    if (failed) return;
                    results[currentIndex] = result;
                    completed++;
                    
                    if (completed === items.length) {
                        resolve(results);
                    } else {
                        processNext();
                    }
                })
                .catch(error => {
                    if (failed) return;
                    failed = true;
                    reject(error);
                });
        }
        
        // 启动指定数量的并发任务
        for (let i = 0; i < Math.min(concurrency, items.length); i++) {
            processNext();
        }
    });
}

// 使用示例
const items = Array.from({ length: 10 }, (_, i) => i + 1);

function processItem(item) {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log(`处理项目 ${item}`);
            resolve(`结果${item}`);
        }, Math.random() * 1000);
    });
}

processWithConcurrency(items, processItem, 3)
    .then(results => {
        console.log('所有项目处理完成:', results);
    })
    .catch(error => {
        console.error('处理失败:', error);
    });
```

### 7. 错误恢复和降级

```javascript
// Promise 错误恢复和降级处理
function withFallback(primaryPromise, fallbackPromise) {
    return primaryPromise.catch(error => {
        console.warn('主操作失败，使用降级方案:', error.message);
        return fallbackPromise;
    });
}

// 多级降级
function withMultipleFallbacks(promises) {
    return promises.reduce((chain, promise) => {
        return chain.catch(() => promise());
    }, Promise.reject());
}

// 使用示例
function primaryService() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() > 0.5) {
                resolve('主服务数据');
            } else {
                reject(new Error('主服务不可用'));
            }
        }, 1000);
    });
}

function backupService() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('备份服务数据');
        }, 500);
    });
}

function localCache() {
    return Promise.resolve('本地缓存数据');
}

// 单级降级
withFallback(primaryService(), backupService())
    .then(data => console.log('获取数据:', data));

// 多级降级
withMultipleFallbacks([
    () => primaryService(),
    () => backupService(),
    () => localCache()
]).then(data => {
    console.log('最终获取数据:', data);
});
```

### 8. 进度监控

```javascript
// 带进度监控的 Promise
function createProgressPromise(task, totalSteps) {
    return new Promise((resolve, reject) => {
        let completedSteps = 0;
        
        function updateProgress() {
            completedSteps++;
            const progress = (completedSteps / totalSteps) * 100;
            console.log(`进度: ${progress.toFixed(1)}%`);
            
            if (completedSteps >= totalSteps) {
                resolve('任务完成');
            }
        }
        
        task(updateProgress, reject);
    });
}

// 使用示例
const longTask = (updateProgress, reject) => {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            try {
                // 模拟任务步骤
                console.log(`执行步骤 ${i + 1}`);
                updateProgress();
            } catch (error) {
                reject(error);
            }
        }, (i + 1) * 1000);
    }
};

createProgressPromise(longTask, 5)
    .then(result => console.log(result))
    .catch(error => console.error('任务失败:', error));
```

### 9. 事务处理

```javascript
// Promise 事务处理（类似数据库事务）
class PromiseTransaction {
    constructor() {
        this.operations = [];
        this.rollbackOperations = [];
    }
    
    add(operation, rollback) {
        this.operations.push(operation);
        this.rollbackOperations.push(rollback);
        return this;
    }
    
    execute() {
        return this.operations.reduce((chain, operation, index) => {
            return chain.then(results => {
                return operation().then(result => {
                    results.push(result);
                    return results;
                }).catch(error => {
                    // 执行回滚
                    return this.rollback(index).then(() => {
                        throw error;
                    });
                });
            });
        }, Promise.resolve([]));
    }
    
    rollback(failedIndex) {
        console.log(`开始回滚到步骤 ${failedIndex}`);
        const rollbackPromises = [];
        
        for (let i = failedIndex; i >= 0; i--) {
            if (this.rollbackOperations[i]) {
                rollbackPromises.push(this.rollbackOperations[i]());
            }
        }
        
        return Promise.all(rollbackPromises)
            .then(() => console.log('回滚完成'))
            .catch(error => console.error('回滚失败:', error));
    }
}

// 使用示例
const transaction = new PromiseTransaction();

transaction
    .add(
        () => Promise.resolve('步骤1完成'),
        () => Promise.resolve('步骤1回滚')
    )
    .add(
        () => Promise.resolve('步骤2完成'),
        () => Promise.resolve('步骤2回滚')
    )
    .add(
        () => Promise.reject(new Error('步骤3失败')),
        () => Promise.resolve('步骤3回滚')
    )
    .execute()
    .then(results => {
        console.log('事务完成:', results);
    })
    .catch(error => {
        console.error('事务失败:', error.message);
    });
```

### 10. 防抖和节流

```javascript
// Promise 防抖
function debouncePromise(func, delay) {
    let timeoutId = null;
    let resolveFunc = null;
    
    return function(...args) {
        return new Promise(resolve => {
            clearTimeout(timeoutId);
            resolveFunc = resolve;
            
            timeoutId = setTimeout(() => {
                resolveFunc(func.apply(this, args));
            }, delay);
        });
    };
}

// Promise 节流
function throttlePromise(func, delay) {
    let lastExecTime = 0;
    let pendingPromise = null;
    
    return function(...args) {
        const now = Date.now();
        
        if (pendingPromise && now - lastExecTime < delay) {
            return pendingPromise;
        }
        
        lastExecTime = now;
        pendingPromise = Promise.resolve(func.apply(this, args));
        
        return pendingPromise;
    };
}

// 使用示例
const debouncedSearch = debouncePromise((query) => {
    console.log(`搜索: ${query}`);
    return `搜索结果: ${query}`;
}, 300);

const throttledApiCall = throttlePromise(() => {
    console.log('API 调用');
    return 'API 响应';
}, 1000);

// 快速连续调用
debouncedSearch('a');
debouncedSearch('ab');
setTimeout(() => debouncedSearch('abc'), 100); // 只会执行最后一次

throttledApiCall();
throttledApiCall(); // 这次调用会被节流
```

## Promise 的现代用法

### 1. Promise 链的优化

```javascript
// 使用 async/await 简化 Promise 链
async function fetchUserProfile(userId) {
    try {
        const user = await fetch(`/api/users/${userId}`).then(res => res.json());
        const posts = await fetch(`/api/users/${userId}/posts`).then(res => res.json());
        const comments = await fetch(`/api/users/${userId}/comments`).then(res => res.json());
        
        return {
            user,
            posts,
            comments,
            totalInteractions: posts.length + comments.length
        };
    } catch (error) {
        console.error('获取用户资料失败:', error);
        throw error;
    }
}

// 并行处理优化
async function fetchUserProfileOptimized(userId) {
    try {
        const [user, posts, comments] = await Promise.all([
            fetch(`/api/users/${userId}`).then(res => res.json()),
            fetch(`/api/users/${userId}/posts`).then(res => res.json()),
            fetch(`/api/users/${userId}/comments`).then(res => res.json())
        ]);
        
        return {
            user,
            posts,
            comments,
            totalInteractions: posts.length + comments.length
        };
    } catch (error) {
        console.error('获取用户资料失败:', error);
        throw error;
    }
}
```

### 2. 错误边界处理

```javascript
// 创建错误边界 Promise
function createErrorBoundary(promise, errorHandler) {
    return promise.catch(error => {
        errorHandler(error);
        throw error; // 重新抛出错误供上层处理
    });
}

// 使用示例
function riskyOperation() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() > 0.5) {
                resolve('操作成功');
            } else {
                reject(new Error('操作失败'));
            }
        }, 1000);
    });
}

createErrorBoundary(
    riskyOperation(),
    error => console.log('记录错误到日志系统:', error.message)
)
.then(result => console.log(result))
.catch(error => console.error('最终处理:', error.message));
```

## Promise 的最佳实践

1. **始终处理错误**：使用 `.catch()` 或 `try/catch` 处理错误
2. **避免 Promise 地狱**：合理使用 `async/await` 简化代码
3. **合理使用并行**：使用 `Promise.all()` 提高效率
4. **设置超时**：为长时间运行的操作设置超时
5. **提供降级方案**：为失败的操作提供备选方案
6. **避免嵌套**：使用链式调用而不是嵌套
7. **正确返回 Promise**：在链中正确返回 Promise 以保持链式调用

Promise 是现代 JavaScript 异步编程的核心，掌握其各种使用场景能够帮助我们编写更加优雅、健壮和可维护的异步代码。