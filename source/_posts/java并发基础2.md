---
title: Java并发基础(二)
date: 2017-12-20
categories: 并发
tags: Java
---
## 前言
上节主要介绍了线程的生命周期和一些基本操作，这节主要描述一些多线程常用的API。

## 一些重要的API

### wait和notify

下图演示了notify()和wait()是如何工作的：

![notify()和wait()](https://ws1.sinaimg.cn/large/73d640f7gy1ftl9vw9e61j20kk0etmxo.jpg)
<escape><!-- more --></escape>
这两个方法属于`Object`类，可以被任何对象调用：

```java
public final void wait() throws InterruptedException
public final native void notify()
```
其次，Object.wait()不是随便可以调用的，它必须含在对应的`synchronized`语句中，因为无论是wait()和notify()都需要首先获得目标对象的一个监视器，其工作细节如下：

![wait()和notify()工作细节](https://ws1.sinaimg.cn/large/73d640f7gy1ftla8l9px9j20e30a33yn.jpg)

从这里就可以更好地区别Object.wait()和Thread.sleep()，前者会释放目标对象的锁，而后者不会释放任何资源。

### 查看线程信息

需要jps(JVM Process Status Tool)虚拟机进程状况工具和jstack堆栈跟踪工具进行配合。其中jps可以显示当前系统中所有的Java进程，而jstack可以打印给定Java进程的内部进程及其堆栈。

先运行jps获得LVMID(Local Virtual Machine Identifier, LVMID)，其对于本地虚拟机来说与PID是一致的。

```shell
$ jps
13552 Jps
8152 BadSuspend
5964
9916 Launcher

```

由上一部我们获得了进入临界区的程序的PID号为8152，接下来我们可以打印相应的线程信息：

```shell
$ jstack -l 8152
Full thread dump Java HotSpot(TM) 64-Bit Server VM (25.121-b13 mixed mode):

"t2" #13 prio=5 os_prio=0 tid=0x0000000019cd3000 nid=0x2934 runnable [0x1ab5f000]
   java.lang.Thread.State: RUNNABLE
        at java.lang.Thread.suspend0(Native Method)
        at java.lang.Thread.suspend(Thread.java:1029)
        at highConcurrency.BadSuspend$ChangeObjectThread.run(BadSuspend.java:18)
        - locked <0x00000000d5f877a8> (a java.lang.Object)
```

### join和yield

如果一个线程的输入非常依赖于另外一个或多个线程的输出，那么此线程必须等待依赖线程执行完毕，才能继续执行。JDK提供join()来实现此功能：

```java
public final void join() throws InterruptedException
public final synchronized void join(long millis) throws InterruptedException
```

第一个join()表示可能无限等待，它会一直阻塞当前线程直到目标线程执行完毕；第二个方法给出了最大等待时间，超过这个时间就算目标线程还未执行完，当前线程也会停止等待而继续往下执行。

另外一个可以经常使用的方法是Thread.yield()：

```java
public static native void yield()
```

如果你觉得一个线程优先级较低，或是它已经完成了一些重要的工作，不希望其占用太多的CPU资源，此时你可以适当地调用Thread.yield()给予其它线程更多的工作机会。但当前线程就算让出CPU后，还是会进行CPU资源的竞争，是否能够再次被分配到就不好说了！