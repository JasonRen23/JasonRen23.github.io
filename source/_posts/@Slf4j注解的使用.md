---
title: 常用日志系统的配置
date: 2018-07-21
categories: Java
tags: Maven
---

## @Slf4j注解的正确使用

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

<!-- more -->

2. 打开idea插件下载频道，下载Lombok Plugin这个插件，也可以移步[这里](http://plugins.jetbrains.com/plugin/6317-lombok-plugin )。
![Lombok Plugin](https://ws1.sinaimg.cn/large/73d640f7gy1ftl9vy87a5j20vq0mgjuu.jpg)
3. 在resource目录下加入log4j.properties
基本配置如下：

```bash
### 设置###
log4j.rootLogger = debug,stdout

### 输出信息到控制抬 ###
log4j.appender.stdout = org.apache.log4j.ConsoleAppender
log4j.appender.stdout.Target = System.out
log4j.appender.stdout.layout = org.apache.log4j.PatternLayout
log4j.appender.stdout.layout.ConversionPattern = %c %d{ISO8601} -- %p -- %m%n
```
4. 可以在代码中像如下例子中一样使用@Slf4j注解
```Java
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

## logback日志系统的使用

1. 对于一个Maven项目，首先要在pom.xml中加入以下依赖项：

```xml
<dependency>
    <groupId>ch.qos.logback</groupId>
    <artifactId>logback-classic</artifactId>
    <version>1.1.7</version>
</dependency>
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-api</artifactId>
    <version>1.7.21</version>
</dependency>
```

2. 在resource目录下加入配置logback.xml

基本配置如下：

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<configuration>

    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <!-- encoders are assigned the type
             ch.qos.logback.classic.encoder.PatternLayoutEncoder by default -->
        <encoder>
            <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>

    <root level="debug">
        <appender-ref ref="STDOUT" />
    </root>
</configuration>
```

3. 可在代码中使用logger对象

```java
public class MyTask implements Runnable {

    /** logger */
    private static final Logger LOGGER = LoggerFactory.getLogger(MyTask.class);
    public static void main(String[] args) throws InterruptedException {
        while(/**/){
            LOGGER.info("线程还在执行呢...");
        }
    }
```

## 参考链接
1. [JavaWeb日志管理---@Slf4j注解](https://blog.csdn.net/wangjie123end/article/details/77235853)



