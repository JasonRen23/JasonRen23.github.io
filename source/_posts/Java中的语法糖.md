---
title: Java中的语法糖
date: 2018-08-02
categories: Java
tags: JVM
---

> 语法糖可以看做编译器实现的一些「小把戏」，这些「小把戏」用得好，可能会使得代码效率提升喔

## 自动装箱的陷阱
先来看看《深入理解JVM虚拟机》的一道题：

```java
public class testInteger {
    public static void main(String[] args) {
        Integer a = 1;
        Integer b = 2;
        Integer c = 3;
        Integer d = 3;
        Integer e = 321;
        Integer f = 321;
        Long g = 3L;
        Long h = 3L;


        System.out.println(c == d);
        System.out.println(e == f);
        System.out.println(e.equals(f));
        System.out.println(c == (a + b));
        System.out.println(c.equals(a + b));
        System.out.println(g == (a + b));
        System.out.println(g.equals(a + b));
        System.out.println(g.equals(a + h));
    }
}
```
<!-- more -->

输出：

```java
true
false
true
true
true
true
false
true
```

- 首先`c == d`为true而`e == f`为false的原因是，Integer类有一个静态的内部类**IntegerCache**，专门用于缓存-128至127之间的值, 如果是则直接从缓存中返回对应的引用，否则新创建一个Integer的实例。所以说如果不在这个区间范围内，返回一个新创建的Long类型引用，用==判断就会理所当然的返回false，地址不一样。但是如果我们使用**equals**方法，则会返回true，数值是一样的。

![](https://ws1.sinaimg.cn/large/73d640f7ly1ftwv1vakgnj21dq09edjb.jpg)

- 总结一下：
- 使用`==`的情况
    - 默认比较的是地址，如果使用了运算符，类似于（a+b），则比较的是数值
    - 当比较地址时，若位于-127~128之间，则直接从缓存里返回已有的引用，也即值相等的话就相等，否则会生成一个Integer实例再进行比较。
- 使用`equals()`的情况
    - 无论是哪种包装类中的equals()默认比较的是数值
    - 需要注意的是，Long的equals()的实现逻辑先判断是不是Long的实例

```java
public boolean equals(Object obj) {
        if (obj instanceof Long) {
            return value == ((Long)obj).longValue();
        }
        return false;
    }
```

常使用[jd-gui](https://github.com/java-decompiler/jd-gui/releases)玩一把反编译

先打成jar包然后再用jd-gui反编译

1. 生成字节码类文件

```bash
javac -d <dir> *.java
```

2. 将字节码类文件打成jar包

```bash
jar cvf YourJar.jar *
```

```java
import java.io.PrintStream;

public class testInteger
{
  public static void main(String[] paramArrayOfString)
  {
    Integer localInteger1 = Integer.valueOf(1);
    Integer localInteger2 = Integer.valueOf(2);
    Integer localInteger3 = Integer.valueOf(3);
    Integer localInteger4 = Integer.valueOf(3);
    Integer localInteger5 = Integer.valueOf(321);
    Integer localInteger6 = Integer.valueOf(321);
    Long localLong1 = Long.valueOf(3L);
    Long localLong2 = Long.valueOf(2L);
    
    // 在缓存池范围内，返回true
    System.out.println(localInteger3 == localInteger4); 
    
    //不在范围内，返回false
    System.out.println(localInteger5 == localInteger6);
    
    //equals()比较的是包装类的数值，返回true
    System.out.println(localInteger5.equals(localInteger6));
    
    //存在数值表达式，比较数值，返回true
    System.out.println(localInteger3.intValue() == localInteger1.intValue() + localInteger2.intValue());
    
    //equals()，返回true
    System.out.println(localInteger3.equals(Integer.valueOf(localInteger1.intValue() + localInteger2.intValue())));
    
    //存在数值表达式，返回true
    System.out.println(localLong1.longValue() == localInteger1.intValue() + localInteger2.intValue());
    
    //Long的equals()先判断是不是Long的实例，返回false
    System.out.println(localLong1.equals(Integer.valueOf(localInteger1.intValue() + localInteger2.intValue())));
    
    //数值相等且同为Long类型，返回true
    System.out.println(localLong1.equals(Long.valueOf(localInteger1.intValue() + localLong2.longValue())));
  }
}
```

## 泛型擦除
> 泛型就是类型参数化，处理的数据类型不是固定的，而是可以作为参数传入，也即把类型明确的工作推迟到创建对象或调用方法的时候才去明确的特殊类型。

参数化类型(Parametersized Type)：

- 把类型当做是参数一样传递
- <数据类型>只能是引用类型

**泛型擦除**：Java语言中的泛型与其他语言不大一样，它只在程序源码中存在，在编译后的字节码文件中，就已经替换为原来的原生类型（Raw Type，也成为裸类型）了，并且在相应的地方加入了强制转换代码。

### 例子一
> 字节码文件通过javap命令查看，如 javap -c demo1.class > bytecode.txt

字节码：
```java
// demo1.java
public class demo1 {
    public static void main(String[] args) {
        List<String> stringList = new ArrayList<>();
        stringList.add("jason");
        stringList.add("ren");
        String str1 = stringList.get(0);
        stringList.get(1);
    }
}

//demo1.class
public static void main(java.lang.String[]);
    descriptor: ([Ljava/lang/String;)V
    flags: ACC_PUBLIC, ACC_STATIC
    Code:
      stack=2, locals=3, args_size=1
         0: new           #2                  // class java/util/ArrayList
         3: dup
         4: invokespecial #3                  // Method java/util/ArrayList."<init>":()V
         7: astore_1
         8: aload_1
         9: ldc           #4                  // String jason
        11: invokeinterface #5,  2            // InterfaceMethod java/util/List.add:(Ljava/lang/Object;)Z (add的是Object类型)
        16: pop
        17: aload_1
        18: ldc           #6                  // String ren
        20: invokeinterface #5,  2            // InterfaceMethod java/util/List.add:(Ljava/lang/Object;)Z (add的是Object类型)
        25: pop
        26: aload_1
        27: iconst_0
        28: invokeinterface #7,  2            // InterfaceMethod java/util/List.get:(I)Ljava/lang/Object;
        33: checkcast     #8                  // class java/lang/String(检查操作数栈顶的值的类型，get(0)然后进行了强转)
        36: astore_2
        37: aload_1
        38: iconst_1
        39: invokeinterface #7,  2            // InterfaceMethod java/util/List.get:(I)Ljava/lang/Object;
        44: pop
        45: return
      LineNumberTable:
        line 13: 0
        line 14: 8
        line 15: 17
        line 16: 26
        line 17: 37
        line 18: 45
```

反编译后的代码：

```java
public class demo1
{
  public static void main(String[] paramArrayOfString)
  {
    ArrayList localArrayList = new ArrayList();
    localArrayList.add("jason");
    localArrayList.add("ren");
    String str = (String)localArrayList.get(0); //强转
    localArrayList.get(1);
  }
}
```
字节码可以看出两个问题：

1. 由字节码的11和20行可以看出，`locaArrayList.add()`方法接收的是Object类型，而不是指定的泛型String，说明泛型信息在编译后不存在了
2. 由字节码的33行和反编译可以看出，`localArrayList.get(0)`方法取出的也是个Object类型，当进行赋值操作的时候会强转为泛型类型，注意是赋值操作时才会强转，因为可以观察到`localArrayList.get(1)`并没有强转

- 一些常见的字节码指令
    - `xloadi`：将局部变量区中的第i个变量/引用压入操作数栈区
    - `xstorei`：将操作数栈区栈顶的变量/引用提出栈并存入局部变量区的第i个位置
    - `invokexxx`：调用方法
    - `getfield`：获取非静态字段值
    - `getstatic`：获取静态字段值

### 例子二（带泛型上界的擦除）：

源码：

```java
//Human.java
public interface Human<T> {
    public void say();
}
```

```java
// HumanSay.java
public class HumanSay<T extends Human> {
    private T t;

    public HumanSay(final T t) {
        this.t = t;
    }

    public void proxySay() {
        t.say();
    }

    public T get() {
        return t;
    }

}

//HumanSay.class

 public cn.jasonren.javalearn.generic.HumanSay(T);
    descriptor: (Lcn/jasonren/javalearn/generic/Human;)V
    flags: ACC_PUBLIC
    Code:
      stack=2, locals=2, args_size=2
         0: aload_0
         1: invokespecial #1                  // Method java/lang/Object."<init>":()V
         4: aload_0
         5: aload_1
         6: putfield      #2                  // Field (替换泛型为上界) t:Lcn/jasonren/javalearn/generic/Human;
         9: return
      LineNumberTable:
        line 11: 0
        line 12: 4
        line 13: 9
    Signature: #14                          // (TT;)V

  public void proxySay();
    descriptor: ()V
    flags: ACC_PUBLIC
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0
         1: getfield      #2                  // Field（替换反省为上界） t:Lcn/jasonren/javalearn/generic/Human;
         4: invokeinterface #3,  1            // InterfaceMethod cn/jasonren/javalearn/generic/Human.say:()V
         9: return
      LineNumberTable:
        line 16: 0
        line 17: 9

  public T get();
    descriptor: ()Lcn/jasonren/javalearn/generic/Human;
    flags: ACC_PUBLIC
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0
         1: getfield      #2                  // Field（替换泛型为上界） t:Lcn/jasonren/javalearn/generic/Human;
         4: areturn
      LineNumberTable:
        line 20: 0
    Signature: #19                          // ()TT;
```

反编译后的代码：

```java
public class HumanSay<T extends Human>
{
  private T t;
  
  public HumanSay(T paramT)
  {
    this.t = paramT;
  }
  
  public void proxySay()
  {
    this.t.say();
  }
  
  public T get()
  {
    return this.t;
  }
}
```

从上面的字节码和反编译结果可以看出，虽然泛型信息都被擦除了，但是和之前不同是擦除为Human类型，并非之前的Object类型。

## 参考链接
1. [几道让你拿offer的面试题](https://juejin.im/post/5b624f4d518825068302aee9)
2. [泛型擦除分析](https://blog.csdn.net/u012706811/article/details/53464612)
3. [Java字节码(Bytecode)与ASM简单说明](http://blog.hakugyokurou.net/?p=409)