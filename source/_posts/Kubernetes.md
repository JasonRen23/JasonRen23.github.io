---
title: Kubernetes部署指南
date: 2018-03-08
categories: 容器云
tags: kubernetes
---

最近忙于面试，为了缓解紧张的备战心情，更新一下之前总结的一些关于k8s的部署指南，包括**单机版**和**集群版**。
![](http://p158wkz8m.bkt.clouddn.com/kubernetes.jpg)
<escape><!-- more --></escape>
## 单机版 kubernetes
即 Master 和 Node （Minion）为同一台机器<escape><br></escape>

关闭防火墙
```bash
   systemctl disable firewalld.service
   systemctl stop firewalld.service
```
安装启用 iptabels
```bash
yum install -y iptables-services
systemctl enable iptables.service
systemctl start iptables.service
```
配置 kubernetes yum 源
```vim
vim /etc/yum.repos.d/kubernetes.repo

[kubernetes]
name=Kubernetes
baseurl=http://yum.kubernetes.io/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=0
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg
https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
```
安装etcd 和k8s
```bash
yum install -y etcd kubernetes
```
安装过程中会安装 docker，为了防止与已有 docker 版本冲突，安装之前最好卸载掉已有的 docker。
修改配置文件
- Docker 配置文件 /etc/sysconfig/docker
`vim /etc/sysconfig/docker`<escape><br></escape>
其中的OPTIONS的内容设置为如下
`OPTIONS='--selinux-enabled=false --insecure-registry gcr.io'`
- apiserver 配置文件 /etc/kubernetes/apiserver
`vim /etc/kubernetes/apiserver`<escape><br></escape>
删除 KUBE_ADMISSION_CONTROL 中的 ServiceAccount
```bash
KUBE_ADMISSION_CONTROL="--admission_control=NamespaceLifecycle,NamespaceExists,LimitRanger,SecurityContextDeny,ServiceAccount,ResourceQuota"
```
- 改为：
    ```bash
    KUBE_ADMISSION_CONTROL="--admission_control=NamespaceLifecycle,NamespaceExists,LimitRanger,SecurityContextDeny,ResourceQuota"
    ```
按照顺序启动服务
```bash
systemctl start etcd
systemctl start docker
systemctl start kube-apiserver.service
systemctl start kube-controller-manager.service
systemctl start kube-scheduler.service
systemctl start kubelet.service
systemctl start kube-proxy.service
```
## 单机版k8s的小例子
以上步骤完成了单机版 kubernetes 的安装启动，以下为一个简单的小例子来测试运行。
### 启动 MySQL 容器服务

- 先拉取所需的 docker image 方便 rc 进行 pod 创建时使用
`docker pull mysql`
- 创建文件 mysql-rc.yaml
```yaml
apiVersion: v1
kind: ReplicationController
metadata:
  name: mysql
spec:
  replicas: 1
  selector:
    app: mysql
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
      - name: mysql
        image: mysql
        ports:
        - containerPort: 3306
        env:
        - name: MYSQL_ROOT_PASSWORD
          value: "123456"
```
- 创建 rc
```bash
$ kubectl create -f mysql-rc.yaml
replicationcontroller 'mysql' created
```

- 查看 rc
```bash
$ kubectl get rc
NAME DESIRED CURRENT READY AGE
mysql 1 1 0 14s
```
- 查看 pod
```bash
$ kubectl get pods
NAME READY STATUS RESTARTS AGE
mysql-b0gk0 0/1 ContainerCreating 0 3s
```
- 此时pod 的状态处于 ContainerCreating，需要等待一下，直到状态变为Running
```bash
NAME READY STATUS RESTARTS AGE
mysql-b0gk0 1/1 Running 0 6m
```
- 创建文件 mysql-svc.yaml
```yaml
apiVersion: v1
kind: Service
metadata:
  name: mysql
spec:
  ports:
    - port: 3306
  selector:
    app: mysql
```
- 创建 service
```bash
$ kubectl create -f mysql-svc.yaml
service "mysql" created
```
- 查看service状态
```bash 
$ kubectl get svc
NAME CLUSTER-IP EXTERNAL-IP PORT(S) AGE
kubernetes 10.254.0.1 <none> 443/TCP 18m
mysql 10.254.185.20 <none> 3306/TCP 14s
```
- **注意到MySQL服务被分配了一个值为 10.254.185.20 的 CLUSTER-IP，这是一个虚地址，随后，Kubernetes 集群中的其他新创建的 Pod 就可以通过Service 的 CLUSTER-IP + 端口 6379 来连接和访问它了。**

### 启动 Web 容器服务

- 先拉取所需的 docker image 方便 rc 进行 pod 创建时使用
`docker pull kubeguide/tomcat-app:v1`
- 创建文件 myweb-rc.yaml
```yaml
apiVersion: v1
kind: ReplicationController
metadata:
  name: myweb
spec:
  replicas: 1
  selector:
    app: myweb
  template:
    metadata:
      labels:
        app: myweb
    spec:
      containers:
        - name: myweb
          image: kubeguide/tomcat-app:v1
          ports:
          - containerPort: 8080
```
- 创建rc
```bash
$ kubectl create -f myweb-rc.yaml
replicationcontroller "myweb" created
```
- 查看rc
```bash
$ kubectl get rc
NAME DESIRED CURRENT READY AGE
mysql 1 1 1 43m
myweb 5 5 0 21s
```
- 查看 pod，根据 rc 中的设置，有 5 个 replicas
```bash
$ kubectl get pods
NAME READY STATUS RESTARTS AGE
mysql-wk349 1/1 Running 0 44m
myweb-dlfwg 1/1 Running 0 58s
myweb-m0j9c 1/1 Running 0 58s
myweb-tss55 1/1 Running 0 58s
myweb-v9p21 1/1 Running 0 58s
myweb-w5bs4 1/1 Running 0 58s
```
- 创建文件myweb-svc.yaml
```yaml
apiVersion: v1
kind: Service
metadata:
  name: myweb
spec:
  type: NodePort
  ports:
    - port: 8080
      nodePort: 30001
  selector:
    app: myweb
```
- 创建service
```bash
$ kubectl create -f myweb-svc.yaml
service "myweb" created
```
- 查看 service
```bash
$ kubectl get services
NAME CLUSTER-IP EXTERNAL-IP PORT(S) AGE
kubernetes 10.254.0.1 <none> 443/TCP 5h
mysql 10.254.201.141 <none> 3306/TCP 45m
myweb 10.254.90.94 <nodes> 8080:30001/TCP 23s
```
**至此，完成了一个简单的 kubernetes 单机版例子，可以在浏览器输入 http://ip:30001/demo/ 来测试发布的web应用**

## 多 Node（Minion）的 kubernetes cluster
为上述单机版的添加一个新的 node。
以下没有特别说明的时候，都是在 node 上进行的操作。

关闭防火墙
```bash
systemctl disable firewalld.service
systemctl stop firewalld.service
```

安装启用 iptabels
```bash
yum install -y iptables-services
systemctl start iptables.service
systemctl enable iptables.service
```

配置 yum 源
```vim
vim /etc/yum.repos.d/kubernetes.repo

[kubernetes]
name=Kubernetes
baseurl=http://yum.kubernetes.io/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=0
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg
https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
```

安装 kubernetes
```bash
yum install -y kubernetes
```
- **安装过程中会安装 docker，为了防止与已有 docker 版本冲突，安装之前最好卸载掉已有的 docker**
- **与 Master 不同，Node 不用安装 etcd，在后面配置中指向 Master 的 etcd server 即可**<escape><br></escape>

修改配置文件

- Master 上
 修改配置 Master 和 etcd server 信息
 ```bash
vim /etc/kubernetes/config
KUBE_MASTER="--master=http://10.75.12.117:8080"
KUBE_ETCD_SERVERS="--etcd-servers=http://10.75.12.117:2379"
```
- 默认值是 127.0.0.1 ，换成 Master 的具体 IP，与 /etc/etcd/etcd.conf 中的设置一致<escape><br></escape>
` ETCD_LISTEN_CLIENT_URLS="http://10.75.12.117:2379"  `<escape><br></escape>
- 如果有修改 etcd.conf 要重启 etcd， `systemctl restart etcd`

- 修改配置 api server 信息
```bash
vim /etc/kubernetes/apiserver
KUBE_API_ADDRESS="--insecure-bind-address=0.0.0.0"
KUBE_API_PORT="--port=8080"
# KUBE_ETCD_SERVERS="--etcd-servers=http://127.0.0.1:2379"
```
- 注释掉 KUBE_ETCD_SERVERS，config 中已经设置过了

- 重启 Master 服务
```bash
systemctl restart etcd
systemctl restart kube-apiserver.service
systemctl restart kube-controller-manager.service
systemctl restart kube-scheduler.service
 ```
- Node 上
单机版的 Master 作为 Node 时，配置文件修改方式和单独作为 Node 节点的配置文件修改一样。
 
- 设置指向 Master 和 etcd server
```vim
vim /etc/kubernetes/config
KUBE_MASTER="--master=http://10.75.12.117:8080"
KUBE_ETCD_SERVERS="--etcd-servers=http://10.75.12.117:2379"
10.75.12.117 为 Master IP
 ```

- 修改 kubelet
```vim
vim /etc/kubernetes/kubelet
KUBELET_ADDRESS="--address=0.0.0.0"
KUBELET_PORT="--port=10250"
KUBELET_HOSTNAME="--hostname-override=10.75.12.120" 
KUBELET_API_SERVER="--api-servers=http://10.75.12.117:8080"
```
- KUBELET_HOSTNAME 为具体的当前 node hostname/IP， 确保是能够解析的 hostname，否则找不到是不能向 Master 注册 Node 的。<escape><br></escape>
 
 启动 Node 的服务

```bash
systemctl start docker
systemctl start kubelet.service
systemctl start kube-proxy.service
```
在` /var/log/messages` 中提取查看 kube 的信息，可以看到 Node 向 Master 注册自己。
```bash
Aug  2 21:55:28 localhost kubelet: I0802 21:55:28.449019   24104 kubelet_node_status.go:77] Successfully registered node 10.75.12.120
```
在 Master 上查看 Node，可以看到新注册进去的 Node。
```bash
$ kubectl get nodes
NAME STATUS AGE
127.0.0.1 NotReady 2m
10.75.12.120 Ready 5m
10.75.12.117 Ready 6m
```
`10.75.12.120` 是新添加的 node，`10.75.12.117` 是 Master 上进行修改添加的 node，所以原来的 `127.0.0.1 `被替换注册后，处于` NotReady `状态。

**如果出现 node 注册失败，请检查 Master 和 node 网络是否联通，iptables 的设置中是否有相应的 rule 进行阻拦。**

## rc 创建 pod 时访问 private registry 获取 docker image
非 public registry 获取 docker image 时，需要使用 `Secret`
- 创建 Secret
使用 kubectl create secret 命令创建 secret，指定 private registry 名称，对应的访问地址，以及访问使用的用户名和密码，最后是邮箱
`kubectl create secret docker-registry regsecret --docker-server=<your-registry-server> --docker-username=<your-name> --docker-password=<your-pword> --docker-email=<your-email>`
比如：
```
kubectl create secret docker-registry mysecret --docker-server=yourRegistry.com --docker-username=sdn --docker-password=sdn123 --docker-email=zhicheng_ren@163.com
```
- 查看创建的 secret
```
# kubectl get secret
NAME        TYPE                      DATA      AGE
sdnsecret   kubernetes.io/dockercfg   1         3m
```

- rc 中使用 Secret
获取 private registry 中的 docker image 时，需要使用对应的 secret 提供访问权限
在 rc 中 spec.template.spec 下添加  imagePullSecrets 指定使用的 secret
比如：
```yaml
apiVersion: v1
kind: ReplicationController
metadata:
  name: lab-cloud-controller
spec:
  replicas: 1
  selector:
    app: lab-cloud-controller
  template:
    metadata:
      labels:
        app: lab-cloud-controller
    spec:
      containers:
      - name: lab-cloud-controller
        image: lab-cloud/lab-cloud-controller:latest
        ports:
        - containerPort: 8080
          hostPort: 8082
        - containerPort: 5005
          hostPort: 5005
        env:
        - name: NSO_SERVICE_HOST
          value: "nso-service"
        - name: NSO_SERVICE_PORT
          value: "8080"
        - name: CASSANDRA_HOST
          value: "cassandra"
        - name: CASSANDRA_PORT
          value: "9042"
      imagePullSecrets:
        - name: sdnsecret
 ```

## 外部系统访问Service的问题
Kubernetes中有三种IP：
  -  Node IP：Node节点的IP地址
  -  Pod IP：Pod的IP地址
  -  Cluster IP：Service的IP地址
Service的Cluster IP属于Kubernetes集群内部的地址，无法在集群外部直接使用这个地址。
采用`NodePort`是解决此问题最直接有效的办法，具体做法如下，以部署mongodb service(mongo-svc.yaml)为例：
```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    name: mongo
  name: mongo
spec:
  type: NodePort
  ports:
    - port: 27017
      nodePort: 27017
  selector:
    name: mongo
  sessionAffinity: None
```
NodePort的实现方式是在Kubernetes集群里的每个Node上为需要外部访问的Service开启一个对应的TCP监听端口，外部系统只要用任意一个Node的IP地址+具体的NodePort端口号即可访问此服务。下面为在任意节点netstat运行后的结果：
```bash
tcp6       0      0 [::]:27017              [::]:*                  LISTEN      4015/kube-proxy
```
注意：请查看docker已正确启动后再启动服务，否则服务将无法访问，可使用如下命令查看：
`kubectl logs <PodName>`
 
若一直卡在“waiting for connection”这个进程，可能是端口冲突导致container无法创建，这样即使服务创建好外部也无法访问。
```bash
2017-11-01T20:11:38.314+0000 I CONTROL  [initandlisten] MongoDB starting : pid=1 port=27017 dbpath=/data/db 64-bit host=mongo-controller-nbgsr
2017-11-01T20:11:38.314+0000 I CONTROL  [initandlisten] db version v3.4.10
2017-11-01T20:11:38.314+0000 I CONTROL  [initandlisten] git version: 078f28920cb24de0dd479b5ea6c66c644f6326e9
2017-11-01T20:11:38.314+0000 I CONTROL  [initandlisten] OpenSSL version: OpenSSL 1.0.1t  3 May 2016
2017-11-01T20:11:38.314+0000 I CONTROL  [initandlisten] allocator: tcmalloc
2017-11-01T20:11:38.314+0000 I CONTROL  [initandlisten] modules: none
2017-11-01T20:11:38.314+0000 I CONTROL  [initandlisten] build environment:
2017-11-01T20:11:38.314+0000 I CONTROL  [initandlisten]     distmod: debian81
2017-11-01T20:11:38.314+0000 I CONTROL  [initandlisten]     distarch: x86_64
2017-11-01T20:11:38.314+0000 I CONTROL  [initandlisten]     target_arch: x86_64
2017-11-01T20:11:38.314+0000 I CONTROL  [initandlisten] options: {}
2017-11-01T20:11:38.318+0000 I -        [initandlisten] Detected data files in /data/db created by the 'wiredTiger' storage engine, so setting the active storage engine to 'wiredTiger'.
2017-11-01T20:11:38.318+0000 I STORAGE  [initandlisten] wiredtiger_open config: create,cache_size=31621M,session_max=20000,eviction=(threads_min=4,threads_max=4),config_base=false,statistics=(fast),log=(enabled=true,archive=true,path=journal,compressor=snappy),file_manager=(close_idle_time=100000),checkpoint=(wait=60,log_size=2GB),statistics_log=(wait=0),
2017-11-01T20:11:38.935+0000 I CONTROL  [initandlisten] 
2017-11-01T20:11:38.936+0000 I CONTROL  [initandlisten] ** WARNING: Access control is not enabled for the database.
2017-11-01T20:11:38.936+0000 I CONTROL  [initandlisten] **          Read and write access to data and configuration is unrestricted.
2017-11-01T20:11:38.936+0000 I CONTROL  [initandlisten] 
2017-11-01T20:11:38.936+0000 I CONTROL  [initandlisten] 
2017-11-01T20:11:38.936+0000 I CONTROL  [initandlisten] ** WARNING: /sys/kernel/mm/transparent_hugepage/enabled is 'always'.
2017-11-01T20:11:38.936+0000 I CONTROL  [initandlisten] **        We suggest setting it to 'never'
2017-11-01T20:11:38.936+0000 I CONTROL  [initandlisten] 
2017-11-01T20:11:38.936+0000 I CONTROL  [initandlisten] ** WARNING: /sys/kernel/mm/transparent_hugepage/defrag is 'always'.
2017-11-01T20:11:38.936+0000 I CONTROL  [initandlisten] **        We suggest setting it to 'never'
2017-11-01T20:11:38.936+0000 I CONTROL  [initandlisten] 
2017-11-01T20:11:38.938+0000 I FTDC     [initandlisten] Initializing full-time diagnostic data capture with directory '/data/db/diagnostic.data'
2017-11-01T20:11:38.938+0000 I NETWORK  [thread1] waiting for connections on port 27017
```
 
## 存储卷本地挂载实现
在一般情况下，若不进行存储卷设置，Pod或者rc一旦被删除，之前数据库存储的数据便会丢失。`Volume`的使用比较简单，在大多数情况下，先在Pod上声明一个Volume，然后在容器内引用该Volume并挂载mount到容器内的某个目录上。例子mongo-rc.yaml如下(注意缩进问题)：
```yaml
spec:
   containers:
   - image: mongo
     name: mongo
     ports:
     - name: mongo
       containerPort: 27017
     volumeMounts:
         - mountPath: /data/db
           name: mongo-persistent-storage
    volumes:
         - name: mongo-persistent-storage
           hostPath:
              path: /data/db/mongo_data
```
这样便将宿主机上`/data/db/mongo_data`的本地存储卷挂载到了容器内的`/data/db`目录上，这样MongoDB一旦进行写入数据操作，本地即会进行相应的缓存操作。就算rc、pod、service挂了，当服务重启时，它会加载本地缓存数据，及时的恢复数据。