---
title: Python Flask Web简介(二)
date: 2017-08-11
categories: Web技术
tags: [Python,Meteor,JavaScript]
---
<escape><img src="http://p158wkz8m.bkt.clouddn.com/flask.svg" width = "400" height = "300"  align=center ></escape>
上一节聊了一下如何快速构建一个外部可访问的Flask服务器，这节主要演示一下如何快速构建前后端的交互功能。
<escape><!-- more --></escape>
## 路由和HTTP方法

如上一节所见，Flask主要通过`route()装饰器`把一个函数绑定在对应的URL上。并且你可以为你的装饰器添加**HTTP方法**。
**HTTP 方法**（也经常被叫做“谓词”）告知服务器，客户端想对请求的页面 *做* 些什么。下面的都是非常常见的方法：

- GET

  浏览器告知服务器：只 **获取** 页面上的信息并发给我。这是最常用的方法。

- HEAD

  浏览器告诉服务器：欲获取信息，但是只关心 **消息头** 。应用应像处理 GET 请求一样来处理它，但是不分发实际内容。在 Flask 中你完全无需 人工 干预，底层的 Werkzeug 库已经替你打点好了。

- POST

  浏览器告诉服务器：想在 URL 上 **发布** 新信息。并且，服务器必须确保 数据已存储且仅存储一次。这是 HTML 表单通常发送数据到服务器的方法。

- PUT

  类似 POST 但是服务器可能触发了存储过程多次，多次覆盖掉旧值。你可 能会问这有什么用，当然这是有原因的。考虑到传输中连接可能会丢失，在 这种 情况下浏览器和服务器之间的系统可能安全地第二次接收请求，而 不破坏其它东西。因为 POST它只触发一次，所以用 POST 是不可能的。

- DELETE

  删除给定位置的信息。

- OPTIONS

  给客户端提供一个敏捷的途径来弄清这个 URL 支持哪些 HTTP 方法。 从 Flask 0.6 开始，实现了自动处理。

  这里我们仅以POST方法为例，给search指定POST方法，前端可以通过POST请求对其发送信息。

```python
from flask import Flask
from flask import request
@app.route('/search',methods=['POST'])
def search():
    date=request.values.get("date")
    card_id=request.values.get("id")
    print "date is %s, card id is %s" % (date,card_id)

if __name__ == '__main__':
    app.run(host="0.0.0.0",debug=True, port=8181)
```

## 编写Meteor方法

前端我们采用Meteor简单编写一个方法，其主要通过POST提交数据，id和date的内容以application/x-www-form-urlencoded方式提交：

```javascript
Meteor.methods({
  'search':(date,id) => {
    var cmd= "curl -d \"date=" + date + "&id=" + id + "\" -H \"Content-Type: application/x-www-form-urlencoded\" -X POST http://127.0.0.1:8181/search";
    console.log("CMD:" + log);
    if(Meteor.isServer){
      exec = Npm.require('child_process').exec;
      exec(cmd, (err, stdout, stderr) => {
        if(err){
          console.log("ERR:" + err);
        }else{
          console.log("OUTPUT:" + stdout);
        }
      });
    }
  },
});
```

我们调用以下代码执行此方法:

```javascript
Meteor.call("search",date,id,(error,result) => {
  	console.log("ERROR:" + error);
});
```

如果运行正常，则python服务console应打印如下形式的数据：

```python
date is 20170821, card id is 1672
```

## 参考链接
1. [http://docs.jinkan.org/docs/flask/quickstart.html](http://docs.jinkan.org/docs/flask/quickstart.html)
2. [https://forums.meteor.com/t/exec-command-run-in-meteor-server/10695](https://forums.meteor.com/t/exec-command-run-in-meteor-server/10695)
3. [http://www.cnblogs.com/chyingp/p/node-learning-guide-child_process.html](http://www.cnblogs.com/chyingp/p/node-learning-guide-child_process.html)



















