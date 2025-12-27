---
title: TypeScript支持的访问修饰符
---

## TypeScript 中的访问修饰符

TypeScript 提供了多种访问修饰符来控制类成员的可访问性，这些修饰符帮助我们实现封装和访问控制，这是面向对象编程的重要概念。

### 1. public（公共）

`public` 修饰符表示成员可以在任何地方访问，这是 TypeScript 中的默认访问级别。

#### 示例：

```typescript
class Animal {
    public name: string;           // 公共属性
    public age: number;
    
    public constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
    
    public speak(): void {
        console.log(`${this.name} makes a sound`);
    }
}

const dog = new Animal("Dog", 3);
console.log(dog.name);    // 可以访问
dog.speak();              // 可以调用
```

### 2. private（私有）

`private` 修饰符表示成员只能在声明它的类内部访问，不能在类外部或子类中访问。

#### 示例：

```typescript
class BankAccount {
    private accountNumber: string;
    private balance: number;
    
    constructor(accountNumber: string, initialBalance: number) {
        this.accountNumber = accountNumber;
        this.balance = initialBalance;
    }
    
    private generateAccountNumber(): string {
        // 只能在类内部使用
        return Math.random().toString(36).substring(2, 15);
    }
    
    public deposit(amount: number): void {
        if (amount > 0) {
            this.balance += amount;
            console.log(`Deposited $${amount}. New balance: $${this.balance}`);
        }
    }
    
    public getBalance(): number {
        return this.balance; // 可以访问私有属性
    }
}

const account = new BankAccount("123456789", 1000);
console.log(account.getBalance()); // 正确：通过公共方法访问
// console.log(account.balance);   // 错误：无法直接访问私有属性
// account.generateAccountNumber(); // 错误：无法访问私有方法
```

### 3. protected（受保护）

`protected` 修饰符表示成员可以在声明它的类及其子类中访问，但不能在类外部访问。

#### 示例：

```typescript
class Vehicle {
    protected brand: string;
    protected speed: number;
    
    constructor(brand: string, speed: number) {
        this.brand = brand;
        this.speed = speed;
    }
    
    protected startEngine(): void {
        console.log(`${this.brand} engine started`);
    }
    
    public getInfo(): void {
        console.log(`Brand: ${this.brand}, Speed: ${this.speed} km/h`);
    }
}

class Car extends Vehicle {
    private doors: number;
    
    constructor(brand: string, speed: number, doors: number) {
        super(brand, speed);
        this.doors = doors;
    }
    
    public startCar(): void {
        this.startEngine(); // 可以访问父类的 protected 方法
        console.log(`Car with ${this.doors} doors is ready`);
    }
    
    public displayInfo(): void {
        console.log(`Brand: ${this.brand}`); // 可以访问父类的 protected 属性
        console.log(`Speed: ${this.speed} km/h`);
        console.log(`Doors: ${this.doors}`);
    }
}

const car = new Car("Toyota", 180, 4);
car.startCar();        // 正确
car.getInfo();         // 正确
car.displayInfo();     // 正确
// console.log(car.brand); // 错误：无法在类外部访问 protected 属性
```

### 4. readonly（只读）

`readonly` 修饰符用于属性，表示该属性只能在声明时或构造函数中赋值，之后不能修改。

#### 示例：

```typescript
class Person {
    readonly id: number;
    readonly name: string;
    public age: number;
    
    constructor(id: number, name: string, age: number) {
        this.id = id;      // 可以在构造函数中赋值
        this.name = name;  // 可以在构造函数中赋值
        this.age = age;
    }
}

const person = new Person(1, "Alice", 30);
console.log(person.id);    // 正确：可以读取
// person.id = 2;          // 错误：不能修改只读属性
person.age = 31;           // 正确：age 不是只读的
```

### 5. 参数属性（Parameter Properties）

TypeScript 提供了参数属性的简写语法，可以在构造函数参数前直接使用访问修饰符。

#### 示例：

```typescript
class Student {
    // 传统的写法
    // private name: string;
    // public age: number;
    // protected grade: string;
    // readonly studentId: number;
    
    // constructor(name: string, age: number, grade: string, studentId: number) {
    //     this.name = name;
    //     this.age = age;
    //     this.grade = grade;
    //     this.studentId = studentId;
    // }
    
    // 参数属性的简写写法
    constructor(
        private name: string,
        public age: number,
        protected grade: string,
        readonly studentId: number
    ) {
        // 构造函数体可以为空
    }
    
    public getStudentInfo(): string {
        return `ID: ${this.studentId}, Name: ${this.name}, Age: ${this.age}, Grade: ${this.grade}`;
    }
}

const student = new Student("Bob", 18, "A", 12345);
console.log(student.age);          // 正确：public
console.log(student.studentId);    // 正确：readonly
// console.log(student.name);      // 错误：private
// console.log(student.grade);     // 错误：protected
```

### 6. 访问修饰符组合使用

可以将访问修饰符与其他修饰符组合使用：

```typescript
class DatabaseConnection {
    private static instance: DatabaseConnection;
    private readonly connectionString: string;
    protected isConnected: boolean = false;
    
    private constructor(connectionString: string) {
        this.connectionString = connectionString;
    }
    
    public static getInstance(connectionString: string): DatabaseConnection {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection(connectionString);
        }
        return DatabaseConnection.instance;
    }
    
    protected connect(): void {
        // 连接逻辑
        this.isConnected = true;
        console.log(`Connected to ${this.connectionString}`);
    }
    
    public disconnect(): void {
        this.isConnected = false;
        console.log('Disconnected');
    }
}
```

### 7. 存取器（Getters 和 Setters）

TypeScript 还支持使用 `get` 和 `set` 关键字创建存取器，它们也有访问修饰符：

```typescript
class Temperature {
    private _celsius: number = 0;
    
    constructor(celsius: number) {
        this._celsius = celsius;
    }
    
    // getter
    public get celsius(): number {
        return this._celsius;
    }
    
    // setter
    public set celsius(value: number) {
        if (value < -273.15) {
            throw new Error("Temperature below absolute zero!");
        }
        this._celsius = value;
    }
    
    // 只读属性
    public get fahrenheit(): number {
        return (this._celsius * 9/5) + 32;
    }
}

const temp = new Temperature(25);
console.log(temp.celsius);      // 25
console.log(temp.fahrenheit);   // 77
temp.celsius = 30;              // 通过 setter 设置
// temp.fahrenheit = 86;        // 错误：fahrenheit 没有 setter
```

### 访问修饰符总结表

| 修饰符 | 类内部 | 子类 | 类外部 | 说明 |
|--------|--------|------|--------|------|
| `public` | ✓ | ✓ | ✓ | 可以在任何地方访问（默认） |
| `private` | ✓ | ✗ | ✗ | 只能在声明的类内部访问 |
| `protected` | ✓ | ✓ | ✗ | 可以在类内部和子类中访问 |
| `readonly` | ✓ | ✓ | ✓ | 只能读取，不能修改（构造函数除外） |

### 最佳实践建议

1. **默认使用 `public`**：对于需要外部访问的成员
2. **使用 `private`**：隐藏实现细节，保护内部状态
3. **使用 `protected`**：当子类需要访问但外部不需要时
4. **使用 `readonly`**：对于初始化后不应改变的属性
5. **合理使用参数属性**：简化代码，提高可读性
6. **遵循最小权限原则**：尽可能限制成员的访问范围

这些访问修饰符帮助我们构建更安全、更易维护的面向对象代码，通过控制类成员的可访问性来实现良好的封装。