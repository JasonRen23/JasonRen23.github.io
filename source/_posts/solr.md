---
title: Apache Solr
date: 2017-09-15 
categories: 搜索引擎
tags: [Python,Solr]	
---

## Solr简介
![](https://ws1.sinaimg.cn/large/73d640f7gy1ftl9vx234bj20fa08gtbk.jpg)

[Solr](http://lucene.apache.org/solr/)是一个用Java编写、运行在Serlet容器（如Apache Tomcat或Jetty）的一个独立的全文搜索服务器。它采用了[Lucene](http://lucene.apache.org/) Java搜索库为核心的全文索引和搜索，并具有类似REST的HTTP/XML和JSON的API。
<escape><!-- more --></escape>

## Solr启动方式

1. 老版本的是通过运行start.jar包来启动：

   ```shell
   java -Dsolr.solr.home=book/solr -jar start.jar
   ```

   其中book/solr就是我们指定的检索库路径

2. 新版本则是通过如下方式：

   ```shell
   bin/solr start -p 8983
   ```

## Solr更新检索库

### 命令行更新

1. 老版本是通过运行post.jar这个包来进行add和delete检索库内容：

   #### add

   ```shell
   java -Durl=http://127.0.0.1:8983/solr/book/update -jar post.jar ~/ren/backend/book*.xml
   ```

   #### delete

   ```shell
   java -Durl=http://127.0.0.1:8983/solr/book/update -Ddata=args -Dcommit=false -jar post.jar "<delete><query>id:20170912</query></delete>"
   ```

   经过上述命令行操作，就能够把id为201701912这一项从检索库里删除。

2. 新版本较为简洁：

   #### add documents

   ```shell
   bin/post -c gettingstarted example/exampledocs/*.xml
   ```

   #### delete documents

   ```shell
   bin/post -c gettingstarted -d '<delete><id>42</id></delete>'
   ```

### Solr API更新

Solr面向各种客户端应用提供了Client APIs，为开发者编写脚本提供了便利，比如SolrJ、PySolr，下面以pysolr为例说明如何进行脚本编写。

#### pysolr搜索

```python
import pysolr
class search:	
  def __init__(self, solr_address):
      self._solr = pysolr.Solr(solr_address + '/solr/book', timeout=10)
  def searchData(self):
      data = self._solr.search(q='name:red and black', fl='id,name,time', start=0, rows=10)
```
#### pysolr更新检索库

```python
def addData(self, data):
  #data can be a json file or xml file
	self._solr.add(data)
```

#### pysolr更新/添加字段值

注意给需要变动的域添加属性，常用的属性有`add`, `set`, `remove`

```python
def updateField(self, id, new_name，heat):
	doc = {'id':id, 'name':new_name, 'heat': heat}
	fields = {'name':set, 'heat': add, 'time':remove}
 	self._solr.add([doc], fieldUpdates=fields)
  
```

## 参考链接

1. [https://lucene.apache.org/solr/guide/6_6/updating-parts-of-documents.html](https://lucene.apache.org/solr/guide/6_6/updating-parts-of-documents.html)


