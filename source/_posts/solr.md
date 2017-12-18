---
title: Apache Solr
date: 2017-09-15 
categories: 搜索引擎
tags: [Python,Solr]	
---

## Solr简介
<img src="http://p158wkz8m.bkt.clouddn.com/solr-logo-on-orange-21.png" width = "500" height = "200"  align=center >

[Solr](http://lucene.apache.org/solr/)是一个用Java编写、运行在Serlet容器（如Apache Tomcat或Jetty）的一个独立的全文搜索服务器。它采用了[Lucene](http://lucene.apache.org/) Java搜索库为核心的全文索引和搜索，并具有类似REST的HTTP/XML和JSON的API。
<!-- more -->

## Solr更新检索库

### start

```
java -Dsolr.solr.home=book/solr -jar start.jar
```

### add

```
java -Durl=http://127.0.0.1:8983/solr/book/update -jar post.jar ~/ren/backend/book*.xml
```
### delete

```
java -Durl=http://127.0.0.1:8983/solr/book/update -Ddata=args -Dcommit=false -jar post.jar "<delete><query>id:20170912</query></delete>"
```

## pysolr搜索

```python
import pysolr
class search:	
  def __init__(self, solr_address):
      self._solr = pysolr.Solr(solr_address + '/solr/book', timeout=10)
  def searchdata(self):
      data = self._solr.search(q='name:red and black', fl='id,name,time', start=0, rows=10)
```
## pysolr更新检索库

```python
def adddata(self, data):
  #data can be a json file or xml file
	self._solr.add(data)
```

## pysolr更新/添加字段值

注意给需要变动的域添加属性，常用的属性有`add`, `set`, `remove`

```python
def updatefield(self, id, new_name，heat):
	doc = {'id':id, 'name':new_name, 'heat': heat}
	fields = {'name':set, 'heat': add, 'time':remove}
 	self._solr.add([doc], fieldUpdates=fields)
  
```

## 参考链接

1. https://lucene.apache.org/solr/guide/6_6/updating-parts-of-documents.html

