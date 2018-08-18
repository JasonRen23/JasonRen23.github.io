---
title: 高性能UDP QUIC
date: 2018-04-15 
categories: 计算机网络
tags: TCP/UDP
---

 > 源自于一道面试题，面试官问我是否了解高性能UDP
 
 ## 基本概念
 QUIC是Quick UDP Internet Connection的简称，是Google制定的一种基于UDP的低时延的互联网传输层协议。TCP/IP协议族是互联网的基础。其中传输层协议包括TCP和UDP协议。与TCP协议相比，UDP更为轻量，但是错误校验也要少得多。这意味着UDP往往效率更高（不经常跟服务器端通信查看数据包是否送达或者按序），但是可靠性比不上TCP。通常游戏、流媒体以及VoIP等应用均采用UDP，而网页、邮件、远程登录等大部分的应用均采用TCP。
 
 ![网络分层](https://raw.githubusercontent.com/JasonRen23/imgs/master/QUIC-Figure-1.png)

 <!--more-->
 
 Google想到能否把这两种协议的优势结合起来，同时实现低时延和高可靠并将其应用到更高安全的协议上，于是就有了QUIC。
 
 以往典型的安全TCP连接（TCP + TLS）往往需要在发送与接收端先进行2、3轮的握手通信才能正式开始数据传输。而利用QUIC协议，如果双方此前通信过的话马上就可以对话（即便双方此前未通信时延也只有100毫秒，是TCP+TLS用时的1/3）。此外，QUIC还增加了拥塞控制和自动重传等功能，所以可靠性上要比UDP更高。
 
 从目标上看，QUIC跟SPDY（HTTP/2基础）很多方面是类似的，但是后者仍然基于TCP，所以仍然会存在部分相同的时延问题。
 
 为什么不干脆改进TCP，因为TCP往往直接内置到了操作系统内核当中。
 
 ![image](https://ws1.sinaimg.cn/large/73d640f7gy1ftl9uru2trj20m80bydgn.jpg)