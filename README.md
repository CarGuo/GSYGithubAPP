![](https://github.com/CarGuo/GSYGithubApp/blob/master/logo.png)

## 一款跨平台的开源Github客户端App，旨在更好的日常管理和维护个人Github，提供更好更方便的驾车体验～～Σ(￣。￣ﾉ)ﾉ。
```
基于React Native开发，适配Android与IOS。

项目的目的是为方便个人日常维护和查阅Github，更好的沉浸于码友之间的互基，Github就是你的家。

项目同时适合react native的练手学习，覆盖了各种框架的使用，与原生的交互等。

随着项目的使用情况和反馈，将时不时根据更新并完善用户体验与功能优化吗，欢迎提出问题。
```

### 编译运行流程

1、配置好react native开发环境，可参阅 [【搭建环境】](http://reactnative.cn/docs/0.51/getting-started.html) | [【React Native开发（一、入门）】](http://www.jianshu.com/p/97692b1c451d)

2、clone代码，根目录下执行`npm install`安装node_modules(太慢建议科学上网或使用淘宝镜像)

3、你需要自己在app/config目录下 创建一个ignoreConfig.js文件，然后输入你的client_id 和 client_secret

     export const CLIENT_ID = "xxxx";
 
     export const CLIENT_SECRET = "xxxx";

4、打开xcode运行或执行`react-native run-android`


### 下载

#### [Apk下载链接](http://osvlwlt4g.bkt.clouddn.com/GSYGithubApp-1.0-beat1.apk)

#### Apk二维码

<img src="https://github.com/CarGuo/GSYGithubApp/blob/master/download.png" width="220px"/>

```

目前没有IOS开发者证书（小贵），有谁能提供个不？Σ(￣。￣ﾉ)ﾉ

```


### 示例图片

<img src="https://github.com/CarGuo/GSYGithubApp/blob/master/1.jpg" width="426px"/>

<img src="https://github.com/CarGuo/GSYGithubApp/blob/master/2.jpg" width="426px"/>

<img src="https://github.com/CarGuo/GSYGithubApp/blob/master/3.jpg" width="426px"/>


### 第三方框架

* [react-native(0.50.1)](http://reactnative.cn/docs/0.51/getting-started.html)
* [react-native-router-flux 路由框架](https://github.com/aksonov/react-native-router-flux)
* [react-native-vector-icons 矢量字体库图标 ](https://github.com/oblador/react-native-vector-icons)
* [react-redux redux](https://github.com/reactjs/react-redux)
* [realm-js realm 数据库](https://github.com/realm/realm-js)
* [react-native-i18n 多语言](https://github.com/AlexanderZaytsev/react-native-i18n)
* [react-native-image-viewer 图片预览](https://github.com/ascoders/react-native-image-viewer)
* [react-native-modalbox 模态框](https://github.com/maxs15/react-native-modalbox)
* [react-native-spinkit loading](https://github.com/maxs15/react-native-spinkit)
* [react-native-textinput-effects 输入框](https://github.com/halilb/react-native-textinput-effects)
* [url-parse url解析](https://github.com/unshiftio/url-parse)

### 常见问题
```
1、xcode的运行，第一次下载 react native 和 realm 相关包比较耗时。

2、win下在npm出现问题时，再次npm时可以删除.lock文件先（如果是mac就简单很多了）。

```

<img src="https://github.com/CarGuo/GSYGithubApp/blob/master/thanks.jpg" width="426px"/>

### LICENSE
```
CarGuo/GSYGithubAPP is licensed under the
Apache License 2.0

A permissive license whose main conditions require preservation of copyright and license notices. 
Contributors provide an express grant of patent rights. 
Licensed works, modifications, and larger works may be distributed under different terms and without source code.
```
