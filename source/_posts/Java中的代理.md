---
title: 将Java中的代理一网打尽
date: 2018-07-28
categories: Java
tags: Spring
---

> 代理模式(Proxy Pattern)：给某个对象提供一个代理，并由代理对象控制对原对象的引用

用通俗一点的话来说就是当前对象不愿意干的，没法干的东西委托给别的对象来做，我只要做好本职工作就好了！

按照代理类的创建时期，代理类分为两种：

- 静态代理类：由程序员创建或者由特定工具自动生成源代码，再对其编译。在程序运行前，代理类的.class文件就已经存在了。
- 动态代理类：在程序运行时，运用反射机制动态创建而成。

<!-- more -->

## 静态代理（用代码描述代理模式）
首先有个程序员接口，他们每天的工作就是写代码

```java
public interface Programmer {
    //程序员们每天写代码
    void coding();
}
```
Jason也是个程序员，他也每天写代码，每个程序员写的代码功能都不一样，所以分为接口和实现类


```java
public class Jason implements Programmer {
    @Override
    public void coding() {
        System.out.println("Jason最新文章:......什么是代理模式......");
    }
}
```
为了让自己写的文章让更多的人看到，他需要成为一个网红，但是很多平台并不支持自己给自己点赞（**当前对象无法自己做**）
于是他想请程序员大佬给自己点赞、评论、支持自己的文章。


```java
public class ProgrammerBigV implements Programmer {
    
    //指定程序员大佬要让谁先发文章
    private Jason jason;

    public ProgrammerBigV(Jason jason) {
        this.jason = jason;
    }
    
    //大佬点赞评论收藏转发
    public void upvote() {
        System.out.println("程序员大V点赞评论收藏转发！");
    }

    public void addMoney() {
        System.out.println("这次我要加100块");
    }

    @Override
    public void coding() {
        //让Jason发文章
        jason.coding();

        //程序员大V点赞评论收藏转发！
        upvote();

    }
    
}
```

文章还是由Jason来写，但是每次发送程序员大佬都会点赞。


```java
public class Main {

    @Test
    public void testProxy(){
    
        //想要发达的jason
        Jason jason = new Jason();
        
        //拜托程序员大V
        Programmer programmer = new ProgrammerBigV(jason);
        
        //大V让jason发文章，大V来点赞转发
        programmer.coding();
    }

}
```

![](https://ws1.sinaimg.cn/large/73d640f7ly1ftpyhpvyxqj213403a0tr.jpg)

这样一来，不明真相的吃瓜群众觉得jason真的强，为知识买单。

## 动态代理

过了一段时间，jason靠着点赞还是没能发家致富，他觉得一定是自己的点赞技巧被识破了，光靠大佬给自己点赞远远不够，他需要雇一波水军：

```java
public class ProgrammerBigV implements Programmer {

    public static void main(String[] args) {
        Jason jason = new Jason();

        Programmer programmerWaterArmy = (Programmer) Proxy.newProxyInstance(jason.getClass().getClassLoader(),
            jason.getClass().getInterfaces(), (proxy, method, args1) -> {

            //如果是调用coding方法，那么水军就要点赞了
            if (method.getName().equals("coding")) {
                method.invoke(jason, args);
                System.out.println("我是水军，我来点赞了！");
            } else {
                //如果不是调用coding方法，那么调用原对象的方法
                return method.invoke(jason, args);
            }

            return null;
        });

        //每当jason写完文章，水军都会点赞
        programmerWaterArmy.coding();
    }
}
```

每次jason发完文章后，水军就开始点赞：
![](https://ws1.sinaimg.cn/large/73d640f7ly1ftpyhpv26cj20z003cq3r.jpg)

## 动态代理调用过程

Java提供了一个Proxy类，调用它的newProxyInstance方法可以生成某个对象的代理对象，该方法签名如下：

```java
@CallerSensitive
    public static Object newProxyInstance(ClassLoader loader,
                                          Class<?>[] interfaces,
                                          InvocationHandler h)
        throws IllegalArgumentException
```
- 参数一：生成代理对象使用哪个类装载器【一般我们使用的是被代理类的装载器】
- 参数二：生成哪个对象的代理对象，通过接口指定【指定要被代理类的接口】
- 参数三：生成的代理对象的方法里干什么事【实现handler接口，我们想怎么实现就怎么实现】

在编写动态代理之前，要明确几个概念：

- 代理对象拥有与目标对象完全相同的方法【因为参数二制定了对象的接口，代理对象会实现接口所有方法】
- 用户调用代理对象的什么方法，都是在调用处理器的invoke方法。【被拦截】
- 使用JDK动态代理必须要有接口【参数二需要接口】
代理对象会实现接口的所有方法，这些实现的方法交给我们的handler来处理，所有通过动态代理实现的方法全部通过`invoke`调用

![](https://ws1.sinaimg.cn/large/73d640f7ly1ftpznrwmxpj21cu0kgdpz.jpg)

**动态代理调用的整个流程**如下图所示：

![动态代理调用过程](https://ws1.sinaimg.cn/large/73d640f7ly1ftpykt6di5j214c0bgq3z.jpg)

## 实现动态代理的方式
- JDK动态代理：java.lang.reflect包中的Proxy类和InvocationHandler接口提供了生成动态代理类的能力，其是基于接口来代理的（实现接口的所有方法），如果没有接口的话我们可以考虑cglib代理。
- cglib代理：Code Generation Library，也叫子类代理，运行时在内存中动态生成一个子类对象从而实现对目标对象功能的扩展。

两者最大的区别：

> 使用JDK动态代理的对象必须实现一个或多个接口使用
> 
> 使用cglib代理的对象则无需实现接口，达到代理类无侵入

## 动态代理的应用场景
1. servlet的filter
2. spring的aop及struts2的拦截器
3. mybatis分页插件
4. 日志拦截、事务拦截、权限拦截

## 参考链接
1. [Java3y给女朋友讲解什么是代理模式](https://juejin.im/post/5af0335c6fb9a07ace58cc8f)
2. [所有和Java中代理有关的知识点都在这了](http://www.hollischuang.com/archives/2601)