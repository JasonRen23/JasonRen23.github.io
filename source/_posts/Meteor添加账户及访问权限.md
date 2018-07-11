---
title: Meteor添加账户及访问权限
date: 2017-12-04
categories: 前端
tags: [Meteor, mongodb]	
---


![](http://p158wkz8m.bkt.clouddn.com/METEOR-JS.png)

在多个用户自定自己的用户查询模板后，可能存在有用户不希望其他用户更改自己的模板，于是就有了添加账户和模板访问权限这个需求。

meteor提供了一个accounts-ui模板，只需要运行如下命令即可加入账户模板：

```shell
meteor add accounts-ui accounts-password
```

在html中，可添加如下代码弹出登录下拉框：

```shell
{{> loginButtons}}
```

<escape><!-- more --></escape>

实现登陆操作后，如果不给非法登陆用户添加权限限制，那么这个账户模块显得毫无意义。接下来我们通过一个小demo演示下：

## 在task对应的js中添加账户信息

在执行添加查询模板的js文件加入以下代码，即添加模板的同时把当前登录用户的id和和email也写入database，这样我们一会就可以对用户登陆与否进行判断

```javascript
Template.addTemplateModal.events({
  'click .add_template'(){
    //...
    template.insert({
      "owner": Meteor.userId(),
      "email": Meteor.user() ? Meteor.user().email[0].address : "",
      "template_name": template_name
    });
  }
});
```
## 通过helper将userId取出

通过helper辅助函数用于对数据库的一些操作，这里使用它取出template对应的userId，将逻辑值赋值给templateDisableButton，下面return的逻辑可以理解为：当且仅当某个查询模板属于某个登陆用户，或者存在非登陆用户定制的模板时，才返回true。

```javascript
Template.Search.helpers({
  templateDisableButton : (owner) => {
    	return (((undefined === owner || null === owner) && null === Meteor.userId()) || owner === Meteor.userId()) ;
  }
});
```

## html加入访问权限判断

如下述代码所示，如果当前templateDisableButton的owner值为true时，用户才可以操作查询模板。

```html
{{#if templateDisableButton owner}}
	<button type="button" class="update btn btn-success">
      <span class="fa fa-pencil"></span>
	</button>
	<button type="button" class="delete btn btn-danger">
      <span class="fa fa-trash-o"></span>
	</button>
{{/if}}
```

## 参考链接

1. [https://guide.meteor.com/accounts.html#useraccounts-customizing-routes](https://guide.meteor.com/accounts.html#useraccounts-customizing-routes)
2. [https://www.meteor.com/tutorials/blaze/adding-user-accounts](https://www.meteor.com/tutorials/blaze/adding-user-accounts)