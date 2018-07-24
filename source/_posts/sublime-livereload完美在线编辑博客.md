---
title: sublime+livereload完美在线编辑博客
date: 2017-07-21 12:01:56
categories: IDE
tags: sublime
---


<escape><img src="http://p158wkz8m.bkt.clouddn.com/sublime.jpeg" width = "500" height = "300"  align=center ></escape>

&emsp;&emsp;第一次搭建博客，对`Markdown`还不是很熟悉，于是特别希望找到一套在线编辑能实时显示编辑效果的工具，`ST3+livereload`很好的满足了我的需求。
<escape><!-- more --></escape>
## 准备工作
* 安装好`node.js`和`hexo`，可使用`npm -v`和`hexo -v`查看是否已安装好

```shell
npm install -g hexo
npm install hexo-deployer-git -save(将博客与github关联需执行这步)
```

* 使用`hexo init blog`生成博客模板
* 运行`hexo g`本地生成静态文件,接着运行`hexo s -g`可在本地生成链接`localhost:4000`,端口为4000

## 在ST3上安装livereload插件
`ctrl+p` -> `install package` -> `LiveReload`
* 手动安装，可以执行以下命令：

```shell
  cd ~/.config/sublime-text-3/Packages
  rm -rf LiveReload
  git clone https://github.com/alepez/LiveReload-sublimetext3 LiveReload
```

* 进入到`Preferences -> Package Settings -> LiveRload`将`Settings-User`设为：

```shell
{
      "enabled_plugins": [
      	"SimpleReloadPluginDelay",
       "SimpleRefreshDelay"
      ] 
     
}
```

## 在google chrome上安装[livereload插件](https://chrome.google.com/webstore/search/livereload?hl=zh-CN)
* 安装好以后可以在地址栏旁边看到如下按钮：

![未开启监听](https://ws1.sinaimg.cn/large/73d640f7gy1ftl9vvhtnxj2019019wea.jpg "未开启监听")

* 右键单击按钮选择"管理扩展程序"，把"允许访问网址文件"这一选项勾选上：
  ![允许访问文件网址打开](https://ws1.sinaimg.cn/large/73d640f7gy1ftl9vvfy6xj20l904laa7.jpg "允许访问文件网址打开")

* 最后，如果你的博客已经在4000端口运行起来了，请点击livereload按钮让其开启监听，按钮会变成实心，如图：
  ![已开始监听](https://ws1.sinaimg.cn/large/73d640f7gy1ftl9vvealwj20120110ce.jpg "已开始监听")

## 刷新延迟问题
* 这里遇到一个比较纠结的问题，就是一旦编辑sublime之后，保存一次网页会随之刷新一次，但是网页上的内容没有随之变化，保存两次网页上的内容却可以发生变化。这样纠结的问题当然需要解决啊，而且我认为一定是文件保存和网页刷新之间出现先后竞争问题，于是开始了一段漫长的问题解决之旅。
  最后找到原因如下：
  ![LiveReload Delay](https://ws1.sinaimg.cn/large/73d640f7gy1ftl9vvu5gbj20tb09c75r.jpg "LiveReload Delay")
* 于是我们进行如下操作：
   `shift+ctrl+p` -> `LiveReload: Enable/disable plugins` -> `Enable-Simple Reload with delay(400ms)`
    问题完美解决！enjoy it~

## 参考链接
1. [https://packagecontrol.io/packages/LiveReload](https://packagecontrol.io/packages/LiveReload)
2. [http://www.jianshu.com/p/f4ec41257206](http://www.jianshu.com/p/f4ec41257206)
3. [https://github.com/revolunet/sublimetext-markdown-preview/issues/119](https://github.com/revolunet/sublimetext-markdown-preview/issues/119)
