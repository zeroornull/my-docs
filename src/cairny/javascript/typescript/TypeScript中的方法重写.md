---
title: TypeScript中的方法重写
---

在 TypeScript 中，方法重写（Method Overriding）是指子类重新定义从父类继承的方法，以提供特定于子类的实现。这是面向对象编程中继承机制的重要组成部分。

## 基本概念

当子类需要修改或扩展父类中某个方法的行为时，可以通过重写该方法来实现。重写的方法必须与父类中的方法具有相同的名称、参数列表和返回类型（或其子类型）。

## 基本语法示例

```typescript
// 父类
class Animal {
  name: string;
  
  constructor(name: string) {
    this.name = name;
  }
  
  // 父类方法
  makeSound(): void {
    console.log("Some generic animal sound");
  }
  
  move(): void {
    console.log(`${this.name} is moving`);
  }
}

// 子类重写父类方法
class Dog extends Animal {
  constructor(name: string) {
    super(name); // 调用父类构造函数
  }
  
  // 重写父类的 makeSound 方法
  makeSound(): void {
    console.log(`${this.name} barks: Woof! Woof!`);
  }
  
  // 重写父类的 move 方法
  move(): void {
    console.log(`${this.name} runs on four legs`);
  }
}

// 使用示例
const dog = new Dog("Buddy");
dog.makeSound(); // 输出: Buddy barks: Woof! Woof!
dog.move();      // 输出: Buddy runs on four legs
```

## 使用 super 关键字

在重写方法中，可以使用 `super` 关键字调用父类的原始实现：

```typescript
class Bird extends Animal {
  constructor(name: string) {
    super(name);
  }
  
  // 重写并扩展父类方法
  makeSound(): void {
    super.makeSound(); // 先调用父类方法
    console.log(`${this.name} chirps: Tweet! Tweet!`);
  }
  
  move(): void {
    console.log(`${this.name} flies in the sky`);
  }
}

const bird = new Bird("Tweety");
bird.makeSound();
// 输出:
// Some generic animal sound
// Tweety chirps: Tweet! Tweet!
```

## 参数类型和返回类型的重写规则

### 协变返回类型（Covariant Return Types）

子类可以返回父类方法返回类型的子类型：

```typescript
class Shape {
  getColor(): string {
    return "white";
  }
}

class Circle extends Shape {
  // 返回更具体的类型
  getColor(): "red" | "blue" | "green" {
    return "red";
  }
}

class Rectangle extends Shape {
  getColor(): string {
    return "blue";
  }
}
```

### 严格函数类型检查

在严格模式下，参数类型必须匹配：

```typescript
class Vehicle {
  start(engine: string): void {
    console.log(`Starting ${engine} engine`);
  }
}

class Car extends Vehicle {
  // 参数类型必须兼容父类
  start(engine: string): void {
    console.log(`Car starting ${engine} engine`);
    super.start(engine);
  }
}
```

## 抽象类中的方法重写

抽象类强制子类实现特定方法：

```typescript
abstract class AbstractAnimal {
  name: string;
  
  constructor(name: string) {
    this.name = name;
  }
  
  // 具体方法可以被继承
  sleep(): void {
    console.log(`${this.name} is sleeping`);
  }
  
  // 抽象方法必须被子类实现
  abstract makeSound(): void;
  
  // 抽象方法也可以被重写
  abstract move(): void;
}

class Cat extends AbstractAnimal {
  constructor(name: string) {
    super(name);
  }
  
  // 必须实现抽象方法
  makeSound(): void {
    console.log(`${this.name} meows: Meow! Meow!`);
  }
  
  move(): void {
    console.log(`${this.name} walks gracefully`);
  }
}

const cat = new Cat("Whiskers");
cat.makeSound(); // 输出: Whiskers meows: Meow! Meow!
cat.move();      // 输出: Whiskers walks gracefully
cat.sleep();     // 输出: Whiskers is sleeping
```

## 接口实现中的"重写"

虽然接口没有方法实现，但实现接口的类需要提供具体实现：

```typescript
interface Flyable {
  fly(): void;
  altitude: number;
}

interface Swimmable {
  swim(): void;
}

class Duck extends Animal implements Flyable, Swimmable {
  altitude: number = 0;
  
  constructor(name: string) {
    super(name);
  }
  
  // 实现 Flyable 接口的方法
  fly(): void {
    this.altitude = 100;
    console.log(`${this.name} is flying at ${this.altitude} meters`);
  }
  
  // 实现 Swimmable 接口的方法
  swim(): void {
    console.log(`${this.name} is swimming in the pond`);
  }
  
  // 重写父类方法
  makeSound(): void {
    console.log(`${this.name} quacks: Quack! Quack!`);
  }
}
```

## 方法重写的访问修饰符规则

```typescript
class Parent {
  public publicMethod(): void {
    console.log("Public method");
  }
  
  protected protectedMethod(): void {
    console.log("Protected method");
  }
  
  private privateMethod(): void {
    console.log("Private method");
  }
}

class Child extends Parent {
  // 可以重写 public 方法
  public publicMethod(): void {
    console.log("Overridden public method");
  }
  
  // 可以重写 protected 方法，但不能改为更严格的访问级别
  protected protectedMethod(): void {
    console.log("Overridden protected method");
  }
  
  // 无法重写 private 方法，因为子类无法访问
  // private privateMethod(): void { } // 这会创建一个新方法，而不是重写
}
```

## 实际应用场景

### 1. 游戏开发中的角色系统

```typescript
abstract class Character {
  name: string;
  health: number;
  
  constructor(name: string) {
    this.name = name;
    this.health = 100;
  }
  
  abstract attack(): void;
  
  takeDamage(damage: number): void {
    this.health -= damage;
    console.log(`${this.name} takes ${damage} damage. Health: ${this.health}`);
  }
  
  // 通用的行为
  move(): void {
    console.log(`${this.name} moves to a new position`);
  }
}

class Warrior extends Character {
  weapon: string;
  
  constructor(name: string, weapon: string) {
    super(name);
    this.weapon = weapon;
  }
  
  // 重写攻击方法
  attack(): void {
    console.log(`${this.name} swings ${this.weapon} and deals 20 damage`);
  }
  
  // 重写移动方法，添加战士特色
  move(): void {
    console.log(`${this.name} charges forward`);
  }
}

class Mage extends Character {
  spell: string;
  
  constructor(name: string, spell: string) {
    super(name);
    this.spell = spell;
  }
  
  attack(): void {
    console.log(`${this.name} casts ${this.spell} and deals 25 damage`);
  }
  
  move(): void {
    console.log(`${this.name} teleports to a new location`);
  }
}
```

### 2. UI 组件系统

```typescript
abstract class Component {
  protected element: HTMLElement;
  
  constructor(tag: string) {
    this.element = document.createElement(tag);
  }
  
  render(): void {
    console.log("Rendering base component");
  }
  
  abstract mount(parent: HTMLElement): void;
}

class Button extends Component {
  private label: string;
  
  constructor(label: string) {
    super("button");
    this.label = label;
    this.element.textContent = label;
  }
  
  // 重写渲染方法
  render(): void {
    super.render(); // 调用父类方法
    console.log(`Rendering button with label: ${this.label}`);
  }
  
  mount(parent: HTMLElement): void {
    parent.appendChild(this.element);
    console.log("Button mounted");
  }
}
```

## 总结

TypeScript 中的方法重写具有以下特点：

1. **继承机制**：只能在继承关系中发生
2. **签名一致**：方法名、参数列表必须与父类一致
3. **访问控制**：不能降低访问级别（如 public 不能改为 private）
4. **super 调用**：可以调用父类的原始实现
5. **多态性**：支持运行时多态行为
6. **类型安全**：编译时检查重写的正确性

方法重写是面向对象编程的核心概念，它允许子类定制继承的行为，同时保持接口的一致性，是构建灵活、可扩展代码的重要工具。