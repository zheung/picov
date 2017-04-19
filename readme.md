## Picov - Pixiv图片收集网站系统
- 基于JavaScript、Node与Koa
- 根据作者的习惯制作
##
- 本质是一个服务器程序，可运行在本地或远程服务器上
- 因为HTML容易制作UI界面，所以选择了B/S模式
##
- 如果我的习惯成为了你的习惯，是我的荣幸
- 如果我的习惯就是你的习惯，是你我的缘分

## 运行环境
1. 安装[Node](https://nodejs.org) v7.6.0或以上版本

2. 切换到工作目录
```
$ cd 代码目录
```
3. 安装模块依赖
```
$ npm i
```
4. 复制`config_default.js`为`config.js`，填写你的配置（注意格式）
```
module.exports = {
	cookie: 'Your PHPSESSID',

	address: '127.0.0.1',
	port: 910
};
```
5. 运行程序
```
$ node app.js
```
6. 打开浏览器，输入地址 [http://127.0.0.1:910/](http://127.0.0.1:910/)

7. Enjoy Pixiv!