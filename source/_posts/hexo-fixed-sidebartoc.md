---
title: melody sidebar侧栏toc显示问题
date: 2017-12-26 
categories: 前端
tags: hexo
---

## 问题描述

一时兴起，换了个漂亮点的hexo主题[melody](https://molunerfinn.com/hexo-theme-melody-doc/#/)。

一波插件及风格化调好之后，发现sidebar出现了问题。如下图所示：

![sidebar目录](http://p158wkz8m.bkt.clouddn.com/sidebartoc.PNG "sidebar catalog")

<escape><!-- more --></escape><escape><br></escape>

就是锚点和标题始终不在同一行，用chrome开发者工具发现渲染后sidebar被解析为了如下内容：

```html
<li class="toc-item toc-level-2">
  <a class="toc-link" href="#线程的生命周期">
    <span class="toc-number">1.</span> <span class="toc-text"></span>
  </a>
  <a href="#线程的生命周期" class="headerlink" title="线程的生命周期"></a>
  线程的生命周期
</li>
```

显然这个解析是有问题的。

## 问题解决

起初怀疑是跨标题级别的问题，于是把不符合规则的博文都格式化了一遍，发现问题依旧没有解决。后来发现是markdown渲染插件的问题，需要安装`hexo-renderer-markdown-it`这个[插件](https://github.com/hexojs/hexo-renderer-markdown-it)，步骤如下：

先卸载已有的默认渲染插件

```shell
 $ npm un hexo-renderer-marked --save
```

再安装新的插件

```shell
 $ npm i hexo-renderer-markdown-it --save
```

以为问题解决了，但是点击到小标题上会出现undefined报错，并且点击无法跳转。

![服务器端文章目录只能显示一级标题，并且无法点击跳转](http://p158wkz8m.bkt.clouddn.com/sidebartoc-error.PNG "服务器端文章目录只能显示一级标题，并且无法点击跳转")

最后google到解决方案如下，只需要在node_modules\hexo-render-markdown-it\lib\renderer.js 添加一行代码，让我们新安装的插件work起来即可：

```javascript
'use strict';

module.exports = function (data, options) {
  var MdIt = require('markdown-it');
  var cfg = this.config.markdown;
  var opt = (cfg) ? cfg : 'default';
  var parser = (opt === 'default' || opt === 'commonmark' || opt === 'zero') ?
    new MdIt(opt) :
    new MdIt(opt.render);

  parser.use(require('markdown-it-named-headings')) //new add

 if (opt.plugins) {
    parser = opt.plugins.reduce(function (parser, pugs) {
      return parser.use(require(pugs));
    }, parser);
  }

  if (opt.anchors) {
    parser = parser.use(require('./anchors'), opt.anchors);
  }

  return parser.render(data.text);
};
```

## 后记
直接采用hexo-render-markdown-it这个解析插件还有问题，若你正在使用<!-- more -->实现阅读全文功能，它会直接对`<` 和 `>`编码导致阅读全文功能不能正常work，有个小哥用escape嵌套解决了这个问题：

![escape块](http://p158wkz8m.bkt.clouddn.com/escape.PNG)

## 参考链接

1. [https://github.com/iissnan/hexo-theme-next/issues/974](https://github.com/iissnan/hexo-theme-next/issues/974)
2. [https://github.com/hexojs/hexo-renderer-markdown-it/wiki/Getting-Started](https://github.com/hexojs/hexo-renderer-markdown-it/wiki/Getting-Started)
3. [https://github.com/hexojs/hexo-renderer-markdown-it/issues/40](https://github.com/hexojs/hexo-renderer-markdown-it/issues/40)
4. [https://github.com/hexojs/hexo/issues/2316#issuecomment-277344775](https://github.com/hexojs/hexo/issues/2316#issuecomment-277344775)