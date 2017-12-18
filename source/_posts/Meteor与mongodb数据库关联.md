---
title: Meteor与mongodb数据库关联
date: 2017-12-07 21:43:51
categories: 前端
tags: [Meteor, mongodb]	
vistors: true
---

![](http://p158wkz8m.bkt.clouddn.com/first-meteorjs-application.png)

<!-- more -->

## Flow Router

```javascript
FlowRouter.route('/dataSearch',{
	subscriptions: function(params, queryParams) {
        this.register('dataSearch', Meteor.subscribe('testdata'));
    },
  action: function() {
    BlazeLayout.render("mainLayout",{content: "dataSearch"});
  }
  	
});
```
## Publish data

```javascript
Testdata = new Mongo.Collection('testdata',{
  	idGeneration: 'MONGO'
});

if(Meteor.isServer){
  //指定访问权限
  var db_str = {
    'insert' : (userId, doc) => {
      return true;//true if you want, else false
    }
    , 'remove' : (userId, doc) => {
      return true;
    }
    ，'update' : (userId, doc) => {
      return true;
    }
  };
	
Testdata.allow(db_str);
Meteor.publish('testdata', function tasksPublication() {
   return Testdata.find();            
   });
	
}
```


## 参考链接

1. [FlowRouter-中文文档](https://github.com/kadirahq/flow-router/wiki/FlowRouter-中文文档#subscription-management)