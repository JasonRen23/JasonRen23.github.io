---
title: java反编译工具箱
date: 2018-08-28
categories: Java
tags: JVM
---

之前[java中的语法糖](https://jasonren.top/2018/08/02/Java%E4%B8%AD%E7%9A%84%E8%AF%AD%E6%B3%95%E7%B3%96/)一文使用过jd-gui来完成我们的反编译，它和`javap`的反编译不同，`javap`不是生成java文件，而是生成字节码。


## 编译和反编译的基本概念

在正式介绍工具之前，还是得过一遍基础，介绍啰嗦一下编译和反编译。

**编译**：将便于人编写、阅读、维护的高级计算机语言所写作的源代码程序，翻译为计算机能解读、运行的低阶机器语言的程序的过程就是编译。负责这一过程的处理的工具叫做编译器。编译给我们带来就是编出来的代码可读性更强，出了错也方便及时定位和修改。

**反编译**:反编译的过程与编译刚好相反，就是将已编译好的编程语言还原到未编译的状态，也就是找出程序语言的源代码。就是将机器看得懂的语言转换成程序员可以看得懂的语言。Java语言中的反编译一般指将class文件转换成java文件。而反编译给我们带来的就是在使用各种语法糖带来的好处时，方便我们探究代码底层的原理。



## 常用反编译工具的基本用法

`javap`的基本用法

```bash
javac HelloWorld.java //生成字节码class文件
javap -c HelloWord.class / javap -verbose HelloWorld.class
```

`jd-gui`的基本用法

```bash
javac HelloWorld.java //生成字节码class文件
jar cvf HelloWorld.jar HelloWorld.class //打成jar包
```
然后通过[jd-gui](https://github.com/java-decompiler/jd-gui/releases)的gui导入查看反编译结果即可

## CFR（Class File Reader）反编译探索

目前jd-gui在对Java7生成的字节码进行反编译时，偶尔会出现不支持的问题，比如java8 lamda表达式的一些语法。

下载[传送门](http://www.benf.org/other/cfr/)

```java
public class switchDemoString {
    public static void main(String[] args) {
        String str = "world";
        switch (str) {
            case "hello":
                System.out.println("hello");
                break;
            case "world":
                System.out.println("world");
            default:
                break;
        }
    }
}

```
### switch语法糖

使用cfr进行反编译

```bash
javac switchDemoString.java 
java -jar ~/cfr_0_132.jar switchDemoString.class --decodestringswitch false > result.txt
```

其中`decodestringswitch`表示对switch支持String的细节进行解码


```java
public class switchDemoString {
    public static void main(String[] arrstring) {
        String string;
        String string2 = string = "world";
        int n = -1;
        switch (string2.hashCode()) {
            case 99162322: {
                if (!string2.equals("hello")) break;
                n = 0;
                break;
            }
            case 113318802: {
                if (!string2.equals("world")) break;
                n = 1;
            }
        }
        switch (n) {
            case 0: {
                System.out.println("hello");
                break;
            }
            case 1: {
                System.out.println("world");
            }
        }
    }
}

```

可以看到switch底层是使用了`hashCode()`和`equals()`来判断字符串是否相等。

### lamda语法糖

```java
public class LamdaTest {
    public static void main(String[] args) {
        List<Integer> list = Arrays.asList(1, 2, 3, 4, 5, 6, 7);
        list.forEach(n -> System.out.println(n));
    }
}
```

我们使用参数``查看lambda脱糖后的效果：

```java
/*
 * Decompiled with CFR 0_132.
 */


public class LamdaTest {
    public static void main(String[] arrstring) {
        List<Integer> list = Arrays.asList(1, 2, 3, 4, 5, 6, 7);
        list.forEach((Consumer<Integer>)LambdaMetafactory.metafactory(null, null, null, (Ljava/lang/Object;)V, lambda$main$0(java.lang.Integer ), (Ljava/lang/Integer;)V)());
    }

    private static /* synthetic */ void lambda$main$0(Integer n) {
        System.out.println(n);
    }
}

```


lambdaMetafactory（如上所述）采用MethodHandles和MethodTypes，它们不能很好地表示，前三个参数由JVM填充，因此我将它们视为null，可以看到底层实际重新封装了一个打印函数对list内的元素遍历打印。


### try-with-resources

```java
public class tryresourcesDemo {
    public void testEnhancedTryEmpty() throws IOException {
        try (final StringWriter writer = new StringWriter();
             final StringWriter writer2 = new StringWriter()) {
            writer.write("This is only a test 2.");
            writer2.write("Also");
        }
    }
}
```


```java
/*
 * Decompiled with CFR 0_132.
 */

public class tryresourcesDemo {
    public void testEnhancedTryEmpty() throws IOException {
        StringWriter stringWriter = new StringWriter();
        Throwable throwable = null;
        try {
            StringWriter stringWriter2 = new StringWriter();
            Throwable throwable2 = null;
            try {
                stringWriter.write("This is only a test 2.");
                stringWriter2.write("Also");
            }
            catch (Throwable throwable3) {
                throwable2 = throwable3;
                throw throwable3;
            }
            finally {
                if (stringWriter2 != null) {
                    if (throwable2 != null) {
                        try {
                            stringWriter2.close();
                        }
                        catch (Throwable throwable4) {
                            throwable2.addSuppressed(throwable4);
                        }
                    } else {
                        stringWriter2.close();
                    }
                }
            }
        }
        catch (Throwable throwable5) {
            throwable = throwable5;
            throw throwable5;
        }
        finally {
            if (stringWriter != null) {
                if (throwable != null) {
                    try {
                        stringWriter.close();
                    }
                    catch (Throwable throwable6) {
                        throwable.addSuppressed(throwable6);
                    }
                } else {
                    stringWriter.close();
                }
            }
        }
    }
}

```

可以看到反编译之后产生了大量的代码，包括异常类的定义和关闭资源的操作，这也是代码脱糖后的结果，这里同样需要加上参数`--tryresources false`。


更多的关于java8和java9反编译的区别可以进[这里](http://www.benf.org/other/cfr/java9observations.html)。










## 参考链接
1. [Java开发必会的反编译知识](https://mp.weixin.qq.com/s?__biz=MzI3NzE0NjcwMg==&mid=2650120609&idx=1&sn=5659f96310963ad57d55b48cee63c788&chksm=f36bbc80c41c3596a1e4bf9501c6280481f1b9e06d07af354474e6f3ed366fef016df673a7ba&scene=21#wechat_redirect)
