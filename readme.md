## Picov - Pixiv图片收集网站系统
- 基于JavaScript、Node、Koa与Vue
- 根据作者的习惯制作
##
- 本质是一个服务器程序，可运行在本地或远程服务器上
- 因为HTML容易制作UI界面，所以选择了B/S模式，使用Vue+Flex布局搭建
##
- 如果我的习惯成为了你的习惯，是我的荣幸
- 如果我的习惯就是你的习惯，是你我的缘分

## 界面截图
![](https://wx1.sinaimg.cn/large/627ab2d1ly1ffhfb3rme3j21130hvqj7.jpg)

## 运行环境
1. 安装[Node](https://nodejs.org) v7.6.0或以上版本

2. 检出并切换到工作目录
```
$ git clone git@github.com:zheung/picov.git 代码目录
$ cd 代码目录
```
3. 安装模块依赖
```
$ npm i
```
4. 复制`config_default.js`为`config.js`，填写你的配置（注意格式，和保证图片目录已创建）
```javascript
module.exports = {
	cookie: 'Your PHPSESSID',

	ip: '127.0.0.1',
	port: 910,

	retry: 5,

	path: {
		large: 'Your Large Picture Path',
		cache: 'Your Cache Path'
	}
};
```
5. 运行程序
```
$ node app.js
```
6. 打开浏览器，输入地址 [http://127.0.0.1:910/](http://127.0.0.1:910/)

7. Enjoy Pixiv!

## 当前特性
- 浏览关注的作品
- 根据关键词搜索作品
- 双击图片后台下载，单击动图打开链接
- 快捷键：
```
	Shift+C 清除控制台记录
	Shift+G 聚焦到页码
	Shift+S 聚焦到搜索框
	PageDown 下一页
	PageUp 上一页
```

## 计划特性
- 浏览某一作家的列表
- 保存动图（Ugoria）
- 更多操作模式
- 界面里查看大图
- 自动下载
- 大图管理
- 缓存定期清除
- 多图作品预览