---
title: redis-cluster踩坑指南
date: 2018-08-20
categories: 数据库
tags: redis
---

## 版本
> redis 4.0.11
> ruby 2.0.0

<img src="https://blog.octo.com/wp-content/uploads/2017/08/screen-shot-2017-08-11-at-14-34-48.png" width="40%" height="40%" style="display:block;margin:auto"/>


<!-- more -->
## 创建目录和配置


```bash
cd ~
mkdir redisCluster
cd redisCluster
mkdir 7000 7001 7002 7003 7004 7005 
```

然后将<你的redis安装目录>/redis.conf拷贝到这六个文件夹，并将redis.conf文件的内容改为如下：


```bash
# 端口号，每个目录都不同
port 700X
# 开启集群模式
cluster-enabled yes
#节点超时实际，单位毫秒
cluster-node-timeout 5000
#集群内部配置文件(默认为 nodes.conf)
cluster-config-file nodes.conf
# 启动 AOF
appendonly yes
```
按照上述配置修改端口号之后，在每个目录下执行命令：

```bash
redis-server redis.conf
```

起一个redis服务然后再中断后，会产生如下文件：

```bash
➜  7000 ls
appendonly.aof  dump.rdb  nodes.conf  redis.conf
```
可使用脚本后台启动六个节点服务

```bash
for i in $(seq 0 5)
do
    cd 700${i}
    redis-server redis.conf &
    cd ..
done
```

检验一下启动情况：

![](https://ws1.sinaimg.cn/large/73d640f7ly1fufjlr24d2j20rc04zdhb.jpg)

Redis提供了redis-trib.rb这个ruby脚本来帮助我们构建cluster，下面我们就使用它

## 安装gem-redis (ruby的redis接口)

若直接使用`gem install redis`，会出现redis版本过高，或者如下下载源连接不上的情况：

![](https://ws1.sinaimg.cn/large/73d640f7ly1fufjumhiuxj20sa03e74z.jpg)

可使用如下命令安装:

```bash
sudo gem install redis 
--version 3.0.0 
--source http://rubygems.org
```

注意指定下载源和下载的gem-redis版本

## 解决哈希slot被占用的问题

准备条件就绪了之后，可直接使用如下命令构建集群：


```bash
# --replicas 则指定了为Redis Cluster中的每个Master节点配备几个Slave节点  
# 节点角色由顺序决定,先master之后是slave
ruby redis-trib.rb create --replicas 1 
127.0.0.1:7000 
127.0.0.1:7001 
127.0.0.1:7002 
127.0.0.1:7003 
127.0.0.1:7004 
127.0.0.1:7005
```
但是会报如下错误：

```bash
ERR Slot 0 is already busy (Redis::CommandError)
```
解决方法：

可进入每个节点的client，然后先后执行`flushall`和`cluster reset soft`

## 构建集群并测试

再次执行：


```bash
ruby redis-trib.rb create --replicas 1 
127.0.0.1:7000 
127.0.0.1:7001 
127.0.0.1:7002 
127.0.0.1:7003 
127.0.0.1:7004 
127.0.0.1:7005
```
master-slave的关系按照顺序分配：

![](https://ws1.sinaimg.cn/large/73d640f7ly1fufkb95092j20jv0fu77o.jpg)

总共16384个slot也全部分配好了：

![](https://ws1.sinaimg.cn/large/73d640f7ly1fufkceqaiaj20jz0g2n0k.jpg)

这下我们可以测试一下主从之间的数据一致性：

```bash
➜  src redis-cli -c -p 7000

127.0.0.1:7000> set myname jason
-> Redirected to slot [12807] located at 127.0.0.1:7002
OK
127.0.0.1:7002> get myname
"jason"
```

## 参考链接
1. [Mac搭建redis集群](http://thinkinjava.cn/2018/08/Mac-%E6%90%AD%E5%BB%BA-Redis-%E9%9B%86%E7%BE%A4/)
2. [redis-cluster的研究和使用](http://hot66hot.iteye.com/blog/2050676?page=2)
3. [mac环境下redis集群的搭建](https://blog.csdn.net/yangbo19891/article/details/73200740)