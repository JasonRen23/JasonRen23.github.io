---
title: Python Flask Web简介(一)
date: 2017-08-10
categories: Web技术
tags: Python
---
Flask是一个使用Python编写的轻量级Web应用框架，由于它能快速的构建一个外部可访问的服务器，所以如果想实现前后端的交互，Flask是个性价比较高的选择。

## 一个最小的应用

一个最小的flask应用，它拥有欢迎界面和所有程序猿最熟悉不过的Hello World：

```python
from flask import Flask

app = Flask(__name__)

@app.route('/')
def index():
    return 'Index Page'

@app.route('/hello')
def hello():
    return 'Hello World!'

if __name__ == '__main__':
    app.run(host="127.0.0.1", port=8181)
```

## 服务器如何外部可访问

如果你禁用了 debug 或信任你所在网络的用户，你可以简单修改调用 [run()](http://docs.jinkan.org/docs/flask/api.html#flask.Flask.run) 的方法使你的服务器公开可用，如下:

```python
app.run(host='0.0.0.0')
```

这会让操作系统监听所有公网 IP。

## 调试模式

默认如果不指定debug值，则其默认为false，此时debug开关是关闭的。并且，一旦你对代码做了任何修改，为了让修改生效，需要手动重启它，神烦！如果我们开启调试模式，则其会在我们修改代码自动重新载入；并且代码发生错误后它能及时提示错误。

```python
if __name__ =='__main__':
    port = int(os.environ.get('PORT', 8181))
    app.run(host='0.0.0.0', port=port, debug=True, use_debugger=False)
```

