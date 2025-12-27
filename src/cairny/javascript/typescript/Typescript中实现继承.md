---
title: Typescript中实现继承
---

在 TypeScript 中，继承是面向对象编程的重要特性，允许一个类（子类）继承另一个类（父类）的属性和方法。以下是详细的实现方式：

## 1. 基本继承语法

使用 `extends` 关键字实现继承：

```typescript
// 父类（基类）
class Animal {
  name: string;
  age: number;
  
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
  
  move(): void {
    console.log(`${this.name} is moving`);
  }
  
  getInfo(): string {
    return `${this.name} is ${this.age} years old`;
  }
}

// 子类（派生类）
class Dog extends Animal {
  breed: string;
  
  constructor(name: string, age: number, breed: string) {
    super(name, age); // 调用父类构造函数
    this.breed = breed;
  }
  
  bark(): void {
    console.log(`${this.name} is barking`);
  }
}

// 使用示例
const dog = new Dog("Buddy", 3, "Golden Retriever");
dog.move();     // 继承自父类
dog.bark();     // 子类自己的方法
console.log(dog.getInfo()); // 继承自父类
```

## 2. 构造函数和 super 关键字

### 调用父类构造函数
```typescript
class Vehicle {
  brand: string;
  model: string;
  
  constructor(brand: string, model: string) {
    this.brand = brand;
    this.model = model;
    console.log("Vehicle constructor called");
  }
}

class Car extends Vehicle {
  doors: number;
  
  constructor(brand: string, model: string, doors: number) {
    super(brand, model); // 必须在使用 this 之前调用
    this.doors = doors;
    console.log("Car constructor called");
  }
}

const car = new Car("Toyota", "Camry", 4);
// 输出:
// Vehicle constructor called
// Car constructor called
```

### 多层继承
```typescript
class Animal {
  name: string;
  
  constructor(name: string) {
    this.name = name;
  }
  
  move(): void {
    console.log(`${this.name} is moving`);
  }
}

class Mammal extends Animal {
  warmBlooded: boolean = true;
  
  constructor(name: string) {
    super(name);
  }
  
  feedMilk(): void {
    console.log(`${this.name} is feeding milk`);
  }
}

class Dog extends Mammal {
  breed: string;
  
  constructor(name: string, breed: string) {
    super(name);
    this.breed = breed;
  }
  
  bark(): void {
    console.log(`${this.name} is barking`);
  }
}

const dog = new Dog("Buddy", "Labrador");
dog.move();      // 来自 Animal
dog.feedMilk();  // 来自 Mammal
dog.bark();      // 来自 Dog
```

## 3. 方法重写（Override）

子类可以重写父类的方法：

```typescript
class Shape {
  color: string;
  
  constructor(color: string) {
    this.color = color;
  }
  
  getArea(): number {
    return 0; // 基类返回 0
  }
  
  getDescription(): string {
    return `A ${this.color} shape`;
  }
}

class Circle extends Shape {
  radius: number;
  
  constructor(color: string, radius: number) {
    super(color);
    this.radius = radius;
  }
  
  // 重写父类方法
  getArea(): number {
    return Math.PI * this.radius * this.radius;
  }
  
  // 重写并调用父类方法
  getDescription(): string {
    return `${super.getDescription()} with radius ${this.radius}`;
  }
}

class Rectangle extends Shape {
  width: number;
  height: number;
  
  constructor(color: string, width: number, height: number) {
    super(color);
    this.width = width;
    this.height = height;
  }
  
  getArea(): number {
    return this.width * this.height;
  }
  
  getDescription(): string {
    return `${super.getDescription()} with dimensions ${this.width}x${this.height}`;
  }
}

// 使用示例
const circle = new Circle("red", 5);
console.log(circle.getArea()); // 78.53981633974483
console.log(circle.getDescription()); // "A red shape with radius 5"

const rectangle = new Rectangle("blue", 4, 6);
console.log(rectangle.getArea()); // 24
console.log(rectangle.getDescription()); // "A blue shape with dimensions 4x6"
```

## 4. 访问修饰符与继承

### public、private、protected 修饰符
```typescript
class Animal {
  public name: string;        // 可以被任何地方访问
  protected species: string;  // 可以被子类访问
  private id: number;         // 只能在定义的类中访问
  
  constructor(name: string, species: string, id: number) {
    this.name = name;
    this.species = species;
    this.id = id;
  }
  
  public getInfo(): string {
    // 可以访问所有属性
    return `${this.name} (${this.species}) - ID: ${this.id}`;
  }
}

class Dog extends Animal {
  breed: string;
  
  constructor(name: string, species: string, id: number, breed: string) {
    super(name, species, id);
    this.breed = breed;
  }
  
  public getDogInfo(): string {
    // 可以访问 name 和 species，但不能访问 id
    return `${this.name} is a ${this.breed} (${this.species})`;
    // return this.id; // 错误：无法访问 private 属性
  }
}

const dog = new Dog("Buddy", "Canine", 123, "Labrador");
console.log(dog.name);       // OK - public
// console.log(dog.species); // 错误 - protected
// console.log(dog.id);      // 错误 - private
```

### readonly 修饰符
```typescript
class Person {
  readonly id: number;
  name: string;
  
  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}

class Employee extends Person {
  department: string;
  
  constructor(id: number, name: string, department: string) {
    super(id, name);
    this.department = department;
    // this.id = 456; // 错误：无法修改 readonly 属性
  }
}
```

## 5. 抽象类和继承

抽象类不能被实例化，只能被继承：

```typescript
abstract class Animal {
  name: string;
  
  constructor(name: string) {
    this.name = name;
  }
  
  // 具体方法
  move(): void {
    console.log(`${this.name} is moving`);
  }
  
  // 抽象方法 - 必须在子类中实现
  abstract makeSound(): void;
  
  // 抽象方法
  abstract getSpecies(): string;
}

class Dog extends Animal {
  constructor(name: string) {
    super(name);
  }
  
  // 实现抽象方法
  makeSound(): void {
    console.log(`${this.name} says Woof!`);
  }
  
  getSpecies(): string {
    return "Canine";
  }
}

class Cat extends Animal {
  constructor(name: string) {
    super(name);
  }
  
  makeSound(): void {
    console.log(`${this.name} says Meow!`);
  }
  
  getSpecies(): string {
    return "Feline";
  }
}

// const animal = new Animal("Generic"); // 错误：不能实例化抽象类
const dog = new Dog("Buddy");
dog.makeSound(); // "Buddy says Woof!"
dog.move();      // "Buddy is moving"
```

## 6. 静态成员继承

```typescript
class BaseClass {
  static baseProperty: string = "Base";
  
  static baseMethod(): string {
    return "Base method";
  }
}

class DerivedClass extends BaseClass {
  static derivedProperty: string = "Derived";
  
  static derivedMethod(): string {
    return "Derived method";
  }
}

console.log(DerivedClass.baseProperty);  // "Base"
console.log(DerivedClass.baseMethod());  // "Base method"
console.log(DerivedClass.derivedProperty); // "Derived"
console.log(DerivedClass.derivedMethod()); // "Derived method"
```

## 7. 泛型继承

```typescript
class GenericBase<T> {
  value: T;
  
  constructor(value: T) {
    this.value = value;
  }
  
  getValue(): T {
    return this.value;
  }
}

class StringContainer extends GenericBase<string> {
  constructor(value: string) {
    super(value);
  }
  
  getUpperCase(): string {
    return this.value.toUpperCase();
  }
}

class NumberContainer extends GenericBase<number> {
  constructor(value: number) {
    super(value);
  }
  
  getSquared(): number {
    return this.value * this.value;
  }
}

const stringContainer = new StringContainer("hello");
console.log(stringContainer.getUpperCase()); // "HELLO"

const numberContainer = new NumberContainer(5);
console.log(numberContainer.getSquared()); // 25
```

## 8. 接口继承与类实现

### 接口继承接口
```typescript
interface Shape {
  color: string;
  getArea(): number;
}

interface Polygon extends Shape {
  sides: number;
  getPerimeter(): number;
}

class Triangle implements Polygon {
  color: string;
  sides: number = 3;
  side1: number;
  side2: number;
  side3: number;
  
  constructor(color: string, side1: number, side2: number, side3: number) {
    this.color = color;
    this.side1 = side1;
    this.side2 = side2;
    this.side3 = side3;
  }
  
  getArea(): number {
    // 使用海伦公式计算面积
    const s = this.getPerimeter() / 2;
    return Math.sqrt(s * (s - this.side1) * (s - this.side2) * (s - this.side3));
  }
  
  getPerimeter(): number {
    return this.side1 + this.side2 + this.side3;
  }
}
```

### 类实现多个接口
```typescript
interface Flyable {
  fly(): void;
}

interface Swimmable {
  swim(): void;
}

class Duck extends Animal implements Flyable, Swimmable {
  constructor(name: string) {
    super(name);
  }
  
  fly(): void {
    console.log(`${this.name} is flying`);
  }
  
  swim(): void {
    console.log(`${this.name} is swimming`);
  }
  
  move(): void {
    console.log(`${this.name} is moving in water`);
  }
}
```

## 9. 实际应用示例

### 游戏角色系统
```typescript
abstract class Character {
  protected name: string;
  protected health: number;
  protected maxHealth: number;
  
  constructor(name: string, maxHealth: number) {
    this.name = name;
    this.maxHealth = maxHealth;
    this.health = maxHealth;
  }
  
  takeDamage(damage: number): void {
    this.health = Math.max(0, this.health - damage);
    console.log(`${this.name} takes ${damage} damage. Health: ${this.health}`);
  }
  
  heal(amount: number): void {
    this.health = Math.min(this.maxHealth, this.health + amount);
    console.log(`${this.name} heals ${amount} HP. Health: ${this.health}`);
  }
  
  isAlive(): boolean {
    return this.health > 0;
  }
  
  abstract attack(target: Character): void;
}

class Warrior extends Character {
  private weapon: string;
  private strength: number;
  
  constructor(name: string, weapon: string) {
    super(name, 100);
    this.weapon = weapon;
    this.strength = 15;
  }
  
  attack(target: Character): void {
    const damage = this.strength + Math.floor(Math.random() * 5);
    console.log(`${this.name} attacks with ${this.weapon}!`);
    target.takeDamage(damage);
  }
}

class Mage extends Character {
  private spell: string;
  private magicPower: number;
  
  constructor(name: string, spell: string) {
    super(name, 80);
    this.spell = spell;
    this.magicPower = 20;
  }
  
  attack(target: Character): void {
    const damage = this.magicPower + Math.floor(Math.random() * 10);
    console.log(`${this.name} casts ${this.spell}!`);
    target.takeDamage(damage);
  }
}

// 使用示例
const warrior = new Warrior("Conan", "Sword");
const mage = new Mage("Gandalf", "Fireball");

warrior.attack(mage);
mage.attack(warrior);
```

## 10. 继承的注意事项

### 1. 构造函数调用顺序
```typescript
class A {
  constructor() {
    console.log("A constructor");
  }
}

class B extends A {
  constructor() {
    console.log("B constructor - before super");
    super();
    console.log("B constructor - after super");
  }
}

class C extends B {
  constructor() {
    console.log("C constructor - before super");
    super();
    console.log("C constructor - after super");
  }
}

new C();
// 输出顺序：
// C constructor - before super
// B constructor - before super
// A constructor
// B constructor - after super
// C constructor - after super
```

### 2. 方法解析顺序（Method Resolution Order）
```typescript
class Base {
  method(): string {
    return "Base";
  }
}

class Middle extends Base {
  method(): string {
    return "Middle -> " + super.method();
  }
}

class Derived extends Middle {
  method(): string {
    return "Derived -> " + super.method();
  }
}

const obj = new Derived();
console.log(obj.method()); // "Derived -> Middle -> Base"
```

## 总结

TypeScript 中继承的主要特点：

1. **语法简单**：使用 `extends` 关键字实现继承
2. **构造函数调用**：子类构造函数必须调用 `super()`
3. **方法重写**：子类可以重写父类方法
4. **访问控制**：支持 public、private、protected 修饰符
5. **抽象类支持**：可以定义抽象类和抽象方法
6. **多层继承**：支持多层继承结构
7. **接口实现**：类可以实现接口并继承其他类
8. **静态成员继承**：静态属性和方法可以被继承

继承是 TypeScript 面向对象编程的核心特性，合理使用可以提高代码的复用性和可维护性。