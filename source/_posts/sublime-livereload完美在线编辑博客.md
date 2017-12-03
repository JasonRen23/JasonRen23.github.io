---
title: sublime+livereload完美在线编辑博客
date: 2017-08-20 12:01:56
tags:
---
&emsp;&emsp;第一次搭建博客，对Markdown还不是很熟悉，于是特别希望找到一套在线编辑能实时显示编辑效果的工具，ST3+livereload很好的满足了我的需求。
## 准备工作
* 安装好node.js和hexo，可使用npm -v和hexo -v查看是否已安装
```
npm install -g hexo
npm install hexo-deployer-git -save(将博客与github关联需执行这步)
```
* 使用hexo init blog生成博客模板
* 运行hexo g本地生成静态文件,接着运行hexo s -g可在本地生成链接localhost:4000,端口为4000

## 在ST3上安装livereload插件
* ctrl+p -> install package -> LiveReload
* 手动安装，可以执行以下命令：
  ```
  cd ~/.config/sublime-text-3/Packages
  rm -rf LiveReload
  git clone https://github.com/alepez/LiveReload-sublimetext3 LiveReload
  ```
* 进入到Preferences -> Package Settings -> LiveRload将Settings-User设为：
```
{
      "enabled_plugins": [
      	"SimpleReloadPluginDelay",
       "SimpleRefreshDelay"
      ] 
     
}
```
## 在google chrome上安装[livereload插件](https://chrome.google.com/webstore/search/livereload?hl=zh-CN)
* 安装好以后可以在地址栏旁边看到如下按钮：

![](/upload_image/livereload1.png "未开启监听")

* 右键单击按钮选择"管理扩展程序"，把"允许访问网址文件"这一选项勾选上：
![](/upload_image/livereload2.png "允许访问文件网址打开")

* 最后，如果你的博客已经在4000端口运行起来了，请点击livereload按钮让其开启监听，按钮会变成实心，如图：
![](/upload_image/livereload3.png "已开始监听")

## 刷新延迟问题
* 这里遇到一个比较纠结的问题，就是一旦编辑sublime之后，保存一次网页会随之刷新一次，但是网页上的内容没有随之变化，保存两次网页上的内容却可以发生变化。这样纠结的问题当然需要解决啊，而且我认为一定是文件保存和网页刷新之间出现先后竞争问题，于是开始了一段漫长的问题解决之旅。
最后找到原因如下：
![](/upload_image/simpleloaddelay.png "LiveReload Delay")
* 于是我们进行如下操作：
 shift+ctrl+p -> LiveReload: Enable/disable plugins -> Enable-Simple Reload with delay(400ms)
 问题完美解决！enjoy it~

## 参考链接
1. https://packagecontrol.io/packages/LiveReload
2. http://www.jianshu.com/p/f4ec41257206
3. https://github.com/revolunet/sublimetext-markdown-preview/issues/119
