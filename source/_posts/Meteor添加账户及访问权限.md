---
title: Meteor添加账户及访问权限
date: 2017-12-07 21:43:51
categories: 前端
tags: [Meteor, mongodb]	
---

Ｈtml

```html
<style>
  .select2-dropdown{
    z-index:9999;
  }
</style>
```

JS

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

```javascript
Template.Search.helpers({
  templateDisableButton : (owner) => {
    	return (((undefined === owner || null === owner) && null === Meteor.userId()) || owner === Meteor.userId()) ;
  }
});
```

Ｈtml

```html
{{#if templateDisableButton owener}}
	<button type="button" class="update btn btn-success">
      <span class="fa fa-pencil"></span>
	</button>
	<button type="button" class="delete btn btn-danger">
      <span class="fa fa-trash-o"></span>
	</button>
{{/if}}
```



