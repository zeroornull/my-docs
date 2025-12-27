---
title: JUnit单元测试
---

JUnit 是 Java 中最流行的单元测试框架，用于编写和运行可重复的测试。它帮助开发者验证代码的正确性，确保代码变更不会破坏现有功能。

## JUnit 核心概念

### 1. 基本注解

- `@Test`: 标记测试方法
- `@BeforeEach`: 在每个测试方法执行前运行
- `@AfterEach`: 在每个测试方法执行后运行
- `@BeforeAll`: 在所有测试方法执行前运行一次
- `@AfterAll`: 在所有测试方法执行后运行一次
- `@DisplayName`: 为测试类或方法提供自定义显示名称

### 2. 断言机制

JUnit 提供丰富的断言方法来验证预期结果：
- `assertEquals(expected, actual)`: 验证两个值是否相等
- `assertTrue(condition)`: 验证条件为真
- `assertFalse(condition)`: 验证条件为假
- `assertNull(object)`: 验证对象为 null
- `assertThrows(exceptionClass, executable)`: 验证是否抛出指定异常

## 实际示例

下面通过一个简单的计算器类来演示 JUnit 的使用：

```java
// Calculator.java - 被测试的类
public class Calculator {
    public int add(int a, int b) {
        return a + b;
    }
    
    public int subtract(int a, int b) {
        return a - b;
    }
    
    public int divide(int a, int b) {
        if (b == 0) {
            throw new IllegalArgumentException("除数不能为零");
        }
        return a / b;
    }
    
    public boolean isEven(int number) {
        return number % 2 == 0;
    }
}
```

```java
// CalculatorTest.java - JUnit 测试类
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

@DisplayName("计算器测试")
public class CalculatorTest {
    
    private Calculator calculator;
    
    @BeforeEach
    void setUp() {
        calculator = new Calculator();
    }
    
    @Test
    @DisplayName("测试加法功能")
    void testAdd() {
        assertEquals(5, calculator.add(2, 3), "2 + 3 应该等于 5");
        assertEquals(-1, calculator.add(2, -3), "2 + (-3) 应该等于 -1");
    }
    
    @Test
    @DisplayName("测试减法功能")
    void testSubtract() {
        assertEquals(1, calculator.subtract(3, 2), "3 - 2 应该等于 1");
        assertEquals(5, calculator.subtract(2, -3), "2 - (-3) 应该等于 5");
    }
    
    @Test
    @DisplayName("测试除法功能")
    void testDivide() {
        assertEquals(2, calculator.divide(6, 3), "6 / 3 应该等于 2");
        
        // 测试异常情况
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            calculator.divide(5, 0);
        });
        
        assertEquals("除数不能为零", exception.getMessage());
    }
    
    @Test
    @DisplayName("测试偶数判断")
    void testIsEven() {
        assertTrue(calculator.isEven(4), "4 应该是偶数");
        assertFalse(calculator.isEven(3), "3 应该是奇数");
        assertTrue(calculator.isEven(0), "0 应该是偶数");
    }
    
    @Test
    @DisplayName("禁用的测试示例")
    @Disabled("暂时禁用此测试")
    void disabledTest() {
        fail("这个测试被禁用了");
    }
}
```

## 高级特性

### 1. 参数化测试

JUnit 5 支持参数化测试，允许使用不同参数多次运行同一个测试方法：

```java
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.junit.jupiter.params.provider.CsvSource;

public class ParameterizedTestExample {
    
    private Calculator calculator = new Calculator();
    
    @ParameterizedTest
    @ValueSource(ints = {2, 4, 6, 8, 10})
    @DisplayName("测试偶数")
    void testEvenNumbers(int number) {
        assertTrue(calculator.isEven(number));
    }
    
    @ParameterizedTest
    @CsvSource({
        "1, 2, 3",
        "2, 3, 5",
        "3, 5, 8"
    })
    @DisplayName("测试加法参数化")
    void testAddWithParameters(int a, int b, int expected) {
        assertEquals(expected, calculator.add(a, b));
    }
}
```

### 2. 嵌套测试

JUnit 5 支持嵌套测试类，可以更好地组织相关测试：

```java
@DisplayName("计算器完整测试")
public class NestedCalculatorTest {
    
    private Calculator calculator;
    
    @Test
    @DisplayName("创建计算器实例")
    void createCalculator() {
        calculator = new Calculator();
        assertNotNull(calculator);
    }
    
    @Nested
    @DisplayName("加法测试组")
    class AddTests {
        
        @BeforeEach
        void createCalculator() {
            calculator = new Calculator();
        }
        
        @Test
        @DisplayName("正数相加")
        void addPositiveNumbers() {
            assertEquals(5, calculator.add(2, 3));
        }
        
        @Test
        @DisplayName("负数相加")
        void addNegativeNumbers() {
            assertEquals(-5, calculator.add(-2, -3));
        }
    }
    
    @Nested
    @DisplayName("除法测试组")
    class DivideTests {
        
        @BeforeEach
        void createCalculator() {
            calculator = new Calculator();
        }
        
        @Test
        @DisplayName("正常除法")
        void normalDivision() {
            assertEquals(2, calculator.divide(6, 3));
        }
        
        @Test
        @DisplayName("除零异常")
        void divideByZero() {
            assertThrows(IllegalArgumentException.class, 
                () -> calculator.divide(5, 0));
        }
    }
}
```

## 运行测试

JUnit 测试可以通过以下方式运行：

1. **IDE 集成**: 大多数现代 IDE（如 IntelliJ IDEA、Eclipse）都支持直接运行 JUnit 测试
2. **Maven**: 使用 `mvn test` 命令
3. **Gradle**: 使用 `gradle test` 命令
4. **命令行**: 使用 JUnit Platform Launcher

## 最佳实践

1. **测试方法命名**: 使用描述性的名称，说明测试的目的
2. **单一职责**: 每个测试方法应该只测试一个功能点
3. **独立性**: 测试之间不应该有依赖关系
4. **可重复性**: 测试应该可以在任何环境下重复运行
5. **快速执行**: 测试应该尽可能快地执行
6. **断言信息**: 为断言提供清晰的错误信息

通过使用 JUnit，开发者可以构建可靠的测试套件，提高代码质量和可维护性，同时支持持续集成和交付流程。