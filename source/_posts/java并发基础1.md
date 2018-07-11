---
title: java并发基础(一)
date: 2017-12-19 
categories: 并发
tags: java
---

## 线程的生命周期

在介绍线程前，有必要先介绍一下进程（Process），进程是计算机中的程序关于某数据集合上的一次运行活动，是系统进行资源分配和调度的基本单位，是程序的基本执行实体，可认为是线程的容器。

![简易线程状态图](http://p158wkz8m.bkt.clouddn.com/线程状态图.PNG "简易线程状态图")
<escape><!-- more --></escape>

线程的所有状态均在Thread中的State枚举中定义：

```java
public enum State{
	NEW,
  	RUNNABLE,
  	BLOCKED,
  	WAITING,
  	TIMED_WAITING,
  	TERMINATED;
}
```

说明：

* NEW状态表示创建一个新的线程对象，该线程处于创建状态，还未开始执行。
* 等到执行线程的`start()`方法，为县城分配必须的系统资源，安排其运行。并调用**线程体**—`run()`调用时，才表示线程开始执行。
* 当线程执行时，处于RUNNABLE可运行状态，这一状态并不是运行中状态（RUNNING），因为线程也许实际上并未真正运行。
* 当线程在执行过程中遇到了`synchronized`同步块，就会进入BLOCKED阻塞状态，这时线程就会暂停执行，直到获得请求的锁。
* WAITING和TIMED_WAITING都表示等待状态，它们的区别是WAITING会进入一个无时间限制的等待，TIMED_WAITING会进入一个有时限的等待。
* 从NEW状态出发后，线程不能再回到NEW状态，同理，处于TERMINATED的线程也不能再回到RUNNABLE状态。

## 线程的基本操作

### 新建线程

新建线程只需要new一个线程对象，并start()起来即可。但执行start方法的同时会调用相应的run()方法，若想让线程做点什么，只需要通过以下匿名内部类的方式重写run()方法即可。

```java
Thead t1 = new Thread(){
  @Override
  public void run(){
  	 System.out.println("I am jason!"); 
  }
};
t1.start();
```

但考虑当Java是单继承，这时候往往通过接口的方式来缓解尴尬，其中Runnable接口为实现了run()方法的单方法接口。

为配合工作，Thread类定义了一个非常重要的构造方法：

```java
public Thread(Runnable target)
```

它传入一个Runnable接口的实例，在start()方法调用时，新的线程就会执行`Runnable.run()`方法。默认的Thread.run()就是直接调用内部的Runnable接口。因此使用Runnable接口告诉线程该做什么，更为合理。

```java
public class CreateThread implements Runnable{
    public static void main(String[] args) {
        Thread t1 = new Thread(new CreateThread());
        t1.start();
    }
    @Override
    public void run() {
        System.out.println("I am jason!");
    }
}

```



### 终止线程

对于一些常驻系统的后台线程，我们有时候可能需要手动关闭。Thread提供了一个暴力方法stop()来暴力终止线程，由于其过于暴力，可能强行把执行到一半的线程终止，引起数据不一致的问题，故JDK在不远的将来可能将此方法废弃。

下图就是一个stop()方法导致终止线程导致数据不一致的例子：

![终止线程导致数据不一致](http://p158wkz8m.bkt.clouddn.com/threadstop.PNG)

上述方法过于暴力。故一般自定义一个stopMe方法操作标志位stopme，然后由标志位指示当前线程是否需要退出。



```java
public class StopThreadsafe {
    public static User u = new User();
    public static class User{
        private int id;
        private String name;
        public User(){
            id = 0;
            name = "0";
        }
        private void setId(int v){
            id = v;
        }
        private void setName(String u){
            name = u;
        }
        private int getId(){
            return this.id;
        }
        private String getName(){
            return this.name;
        }
        @Override
        public String toString() {
            return "User [id=" + id + ", name = " + name + "]";
        }

    }
    public static class ChangeObjectThread extends Thread {
        volatile boolean stopme = false;

        public void stopMe() {
            stopme = true;
        }
        @Override
        public void run() {
            while (true){
                if (stopme){
                    System.out.println("exit by stop me");
                    break;
                }
                synchronized (u){
                    int v = (int)(System.currentTimeMillis()/1000);
                    u.setId(v);                 
                    try {
                        Thread.sleep(100);
                    }catch (InterruptedException e){
                        e.printStackTrace();
                    }
                    u.setName(String.valueOf(v));
                }
                Thread.yield();
            }
        }

    }

    public static class ReadObjectThread extends Thread{
        @Override
        public void run() {
            while (true){
                synchronized (u){
                    if(u.getId() != Integer.parseInt(u.getName())){
                        System.out.println(u.toString());
                    }
                }
                Thread.yield();
            }

        }
    }

    public static void main(String[] args) throws InterruptedException{
        new ReadObjectThread().start();
        while (true){
            ChangeObjectThread t = new ChangeObjectThread();
            t.start();
            Thread.sleep(150);
            t.stopMe();
        }
        
    }
}
```

### 线程中断

相比终止线程，线程中断不会使线程立即退出，而是给线程发一个通知，至于目标线程接到后如何处理完全由目标线程自行决定。

线程中断有三种方法，注意区分：

```java
public void Thread.interrupt()                  //通知目标线程中断，置上中断标志位
public boolean Thread.isInterrupted()           //检查中断标志位，判断是否被中断
public static boolean Thread.interrupted()    //判断当前线程中断状态，并清除当前中断状态
```

中断通常需要加上自己的中断处理逻辑，若不加处理逻辑，则即使某线程被置上了中断状态，但是这个中断不会发生任何作用。下面这段代码表明了常用的中断处理逻辑：

```java
    public static void main(String[] args) throws InterruptedException{
        Thread t1 = new Thread(){
            @Override
            public void run() {
                while (true){
                    if(Thread.currentThread().isInterrupted()){
                        System.out.println("Interruted!");
                        break;
                    }
                    try {
                        Thread.sleep(2000);
                    }catch (InterruptedException e){
                        System.out.println("Interruted When Sleep");
                        //设置中断状态
                        Thread.currentThread().interrupt();
                    }
                    Thread.yield();
                }

            }
        };
        t1.start();
        Thread.sleep(2000);
        t1.interrupt();
    }
```

注意：假如第13行不执行interrupt()再次中断自己，置上中断标志位，则下次循环开始就无法捕获由于Thread.sleep()方法中断并清楚中断标志位这一动作。



## 参考链接

1. [http://blog.csdn.net/sinat_36246371/article/details/53005313](http://blog.csdn.net/sinat_36246371/article/details/53005313)
2. [http://www.cnblogs.com/skywang12345/p/3479024.html](http://www.cnblogs.com/skywang12345/p/3479024.html)
3. [http://ibruce.info/2013/12/19/how-to-stop-a-java-thread/](http://ibruce.info/2013/12/19/how-to-stop-a-java-thread/)