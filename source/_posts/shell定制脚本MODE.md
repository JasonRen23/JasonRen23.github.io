---
title: Shell MODE
date: 2017-12-07 21:43:51
categories: linux
tags: shell脚本
---

# Shell MODE定制脚本模式

&emsp;&emsp;在运行环境脚本时，我们时常需要切换不同的调试环境，这个此时为不同的运行环境定制不同的MODE就有了需求。
请看下面的shell脚本`start.sh`：
```bash
#!/bin/bash

#   -m MODE, --mode MODE  Mode of operation. Default value is debug

＃　Default values
MODE="debug"
usage() {
  printf "Doing debug"
}
if [ "$MODE" = "debug"]; then
	usage
elif [ "$MODE" = "prod"]; then
	cd /jasonren/backend && python flask.py &
fi
```
其中我们设定默认模式为debug，当不定制MODE时其默认为debug，将打印我们在usage函数中的提示，进入调试模式；若设定MODE为prod，则将运行正式版本的后端。
&emsp;&emsp;假如我们现在要启动一个装有pymongo和Flask的容器`container`，dockerfile如下：
```dockerfile
From python:2
ENV http_proxy http://proxy.xxx.com:8000
ENV no_proxy 127.0.0.1

WORKDIR /jasonren

COPY backend /jasonren/backend
COPY start.sh /start.sh
RUN pip install pymongo --proxy=http://proxy.xxx.com:8000
RUN pip install Flask --proxy=http://proxy.xxx.com:8000
RUN ["chmod","+x","/start.sh"]
ENTRYPOINT ["/start.sh"]

EXPOSE 8181

```

可见在container运行之后会执行`start.sh`这个脚本。

&emsp;&emsp;下面我们编写Makefile运行我们的定制容器，假如需要进入正式运行版本的后端环境，则注入MODE=prod这个环境变量即可。

```makefile
final:
	-docker rm -f $@
	docker run -it \
		-p 8181:8181
		-e MODE=prod \
		--name $@ \
		jasonren:flask \
		bash
debug:
    -docker rm -f $@
        docker run -it \
            -p 8181:8181 \
            --name $@ \
            -v ${PWD}/backend:/jasonren/backend \
            jasonren:flask \
            bash
```






