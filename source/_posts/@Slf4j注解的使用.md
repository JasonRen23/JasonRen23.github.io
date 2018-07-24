---
title: Slf4j注解的使用
date: 2018-07-21
categories: Maven
tags: Java
---
***本文转自[blog](https://blog.csdn.net/wangjie123end/article/details/77235853)***
# @Slf4j注解的正确使用

1. 对于一个Maven项目，首先要在pom.xml中加入以下依赖项：
```xml
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-api</artifactId>
            <version>1.7.5</version>
        </dependency>
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-log4j12</artifactId>
            <version>1.7.5</version>
        </dependency>
        <dependency>
            <groupId>log4j</groupId>
            <artifactId>log4j</artifactId>
            <version>1.2.17</version>
        </dependency>

        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.16.18</version>
            <scope>provided</scope>
        </dependency>
```

- `slf4j`就是众多接口的集合，它不负责具体的日志实现，只在编译时负责寻找合适的日志系统进行绑定。具体有哪些接口，全部都定义在slf4j-api中。
- `slf4j-log4j12`是链接slf4j-api和log4j中间的适配器。它实现了slf4j-apiz中StaticLoggerBinder接口，从而使得在编译时绑定的是slf4j-log4j12的getSingleton()方法。
- `log4j`是具体的日志系统。通过slf4j-log4j12初始化Log4j，达到最终的日志输出。
- `lombok`：一个插件，封装了log的get和set，可以直接使用log来输出日志信息。
2. 打开idea插件下载频道，下载Lombok Plugin这个插件，也可以移步[这里](http://plugins.jetbrains.com/plugin/6317-lombok-plugin )。
![Lombok Plugin](https://ws1.sinaimg.cn/large/73d640f7gy1ftl9vy87a5j20vq0mgjuu.jpg)
3. 可以在代码中像如下例子中一样使用@Slf4j注解
```java
@Slf4j
public final class ClassUtil {
    public static Class<?> loadClass(String className){
        try{
            return Class.forName(className);
        }catch(Exception e){
            log.error("load class error", e);
            throw new RuntimeException(e);
        }
    }
}

```
