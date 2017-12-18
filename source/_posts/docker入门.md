---
title: docker入门
date: 2017-08-20 21:43:51
categories: 容器云
tags: docker
---
<img src="http://p158wkz8m.bkt.clouddn.com/docker1.png" width = "500" height = "200"  align=center >

<!-- more -->

容器的典型生命周期：创建、管理、停止，直到最终删除

# docker 命令行

## 运行docker守护进程

```
sudo service docker start
```
## 查看docker程序是否正常工作

```
sudo docker info 
```
## 运行第一个ubuntu容器并进入shell交互界面

```
sudo docker run -it ubuntu /bin/bash
```
## 查看所有容器(包括没有运行的)和查看所有正在运行的容器

```
sudo docker ps -a 
sudo docker ps
```
退出当前交互式容器的方法有两种：

1.  用ctrl+p和ctrl+q可以推出shell并且不停止该容器的运行;
2.  也可以用 `exit` 命令，重新进入的话需要先`start` 再 `attach`:

![](http://p158wkz8m.bkt.clouddn.com/2017-09-30 start_attach.png"exit后如何重新进入容器shell")

## 想要在容器内运行多个进程

直接运行`sudo docker attach [container name]`，容器始终在同一个进程下运行，无法进行异步操作，如下图所示：

![](http://p158wkz8m.bkt.clouddn.com/2017-09-30 dockerattach.png "docker attach 结果")
![](http://p158wkz8m.bkt.clouddn.com/2017-09-30 dockerexec.png "docker exec 结果")

## 在容器内部运行进程

```
shell: sudo docker exec -it <container name> /bin/bash
add a new file: sudo docker exec -d <container name> touch /etc/new_config_file 
```
Docker存在一个名为`scratch`的特殊镜像，其并不实际存在，它表示一个空白的镜像。若你以`scratch`为基础镜像的话，意味着你不以任何镜像为基础，接下来所写的指令将作为镜像第一层开始存在。对于Linux下静态编译的程序来说，并不需要有操作系统提供运行时支持，所需的一切库都已经在可执行文件里了，因此直接`FROM scratch`会让镜像体积更加小巧，`Go语言开发`的应用很多会使用这种方式来制作镜像，因此`Go`被认为是特别适合容器微服务架构的语言。

# docker 构建镜像
## 构建docker镜像有以下两种方法:

*  使用docker commit命令
*  使用docker build命令和Dockerfile文件

docker commit提交的只是创建容器的镜像与容器的当前状态之间的有差异的部分，这使得该更新非常轻量。
一般情况下并不推荐使用`docker commit`的方法来构建镜像。相反，推荐使用被称为`Dockerfile`的定义文件和`docker build`命令来构建镜像。

## docker分配端口方法:

*  docker 可以在宿主机上随机选择一个位于32768~61000的一个比较大的端口号来映射到容器的80端口上。
*  可以在docker宿主机中指定一个具体的端口号来映射到容器中的80端口上。

可使用`sudo docker port [container ID] [port ID]`查看指定容器端口映射情况。

