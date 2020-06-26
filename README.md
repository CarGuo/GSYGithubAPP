![](./logo.png)


### [English Readme](https://github.com/CarGuo/GSYGithubApp/blob/master/README_EN.md)

## 一款跨平台的开源Github客户端App，提供更丰富的功能，更好体验，旨在更好的日常管理和维护个人Github，提供更好更方便的驾车体验～～Σ(￣。￣ﾉ)ﾉ。在开发学习过程中，提供丰富的同款对比：

> ### [如果克隆太慢或者图片看不到，可尝试从码云地址下载](https://gitee.com/CarGuo/GSYGithubAPP)

* ### 同款Weex版本 （ https://github.com/CarGuo/GSYGithubAppWeex ）
* ### 同款Flutter版本 （ https://github.com/CarGuo/GSYGithubAppFlutter ）
* ### 同款Android Kotlin版本（ https://github.com/CarGuo/GSYGithubAppKotlin ）

```
基于React Native开发，适配Android与IOS。

项目的目的是为方便个人日常维护和查阅Github，更好的沉浸于码友之间的互基，Github就是你的家。

项目同时适合react native的练手学习，覆盖了各种框架的使用，与原生的交互等。

随着项目的使用情况和反馈，将时不时根据更新并完善用户体验与功能优化吗，欢迎提出问题。
```
-----

[![GitHub stars](https://img.shields.io/github/stars/CarGuo/GSYGithubAPP.svg)](https://github.com/CarGuo/GSYGithubAPP/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/CarGuo/GSYGithubAPP.svg)](https://github.com/CarGuo/GSYGithubAPP/network)
[![GitHub issues](https://img.shields.io/github/issues/CarGuo/GSYGithubAPP.svg)](https://github.com/CarGuo/GSYGithubAPP/issues)
[![GitHub license](https://img.shields.io/github/license/CarGuo/GSYGithubAPP.svg)](https://github.com/CarGuo/GSYGithubAPP/blob/master/LICENSE)

### 因升级到RN 0.61.3 版本，整个工程模板被重构。


| 公众号   | 掘金     |  知乎    |  CSDN   |   简书   
|---------|---------|--------- |---------|---------|
| GSYTech  |  [点我](https://juejin.im/user/582aca2ba22b9d006b59ae68/posts)    |   [点我](https://www.zhihu.com/people/carguo)       |   [点我](https://blog.csdn.net/ZuoYueLiang)  |   [点我](https://www.jianshu.com/u/6e613846e1ea)  


![公众号](http://img.cdn.guoshuyu.cn/WeChat-Code)

### 编译运行流程

1、配置好react native开发环境，可参阅 [【搭建环境】](http://reactnative.cn/docs/0.51/getting-started.html) | [【React Native开发（一、入门）】](http://www.jianshu.com/p/97692b1c451d)

2、clone代码，根目录下执行`npm install`安装node_modules(太慢建议科学上网或使用淘宝镜像)

>### 3、重点：你需要自己在app/config目录下 创建一个ignoreConfig.js文件，然后输入你申请的Github client_id 和 client_secret。

     export const CLIENT_ID = "xxxx";

     export const CLIENT_SECRET = "xxxx";


     //如果需要上传七牛
     export const ACCESS_KEY = "xxxx";
     export const SECRET_KEY = "xxx";
     export const QN_HOST = "xxxx";
     export const SCOPE = "xxxx";


   [      注册 Github APP 传送门](https://github.com/settings/applications/new)，当然，前提是你现有一个github账号(～￣▽￣)～ 。
 
### 3、如果使用安全登录（授权登录），那么在上述注册 Github App 的 Authorization callback URL 一栏必须填入 `gsygithubapp://authed`

<div>
<img src="http://img.cdn.guoshuyu.cn/register0.png" width="426px"/>
<img src="http://img.cdn.guoshuyu.cn/register1.jpg" width="426px"/>
</div>

4、打开xcode运行或执行`react-native run-android`

### 5、重点：请使用github用户名登录，不是邮箱。


### 下载

#### [Apk下载链接](https://www.pgyer.com/GSYGithubApp)

#### Apk二维码

| 类型          | 二维码                                      |
| ----------- | ---------------------------------------- |
| **Apk二维码**  | ![](./download.png) |
| **IOS暂无下载** | **残念(╯‵□′)╯︵┻━┻，第三方太贵，没企业证书。**![](./ios_wait.png) |





```

已有ipa，不过不是企业ipa，需要udid，所以目前ios自用╮(╯▽╰)╭

```

## 相关文章

- ### [1、从Android到React Native开发（一、入门）](https://juejin.im/post/58ac5b4c8ac2474faab25d1c)

- ### [2、从Android到React Native开发（二、通信与模块实现）](https://juejin.im/post/58bc07c5ac502e006b07f434)

- ### [3、从Android到React Native开发（三、自定义原生控件支持）](https://juejin.im/post/5946253561ff4b006cee4d65)

- ### [4、从Android到React Native开发（四、打包流程和发布为Maven库）](https://juejin.im/post/5b2116466fb9a01e3128359f)

- ### [React Native 的未来与React Hooks](https://juejin.im/post/5cb34404f265da0384127fcd)

- ### [移动端跨平台开发的深度解析](https://juejin.im/post/5b395eb96fb9a00e556123ef)

- ### [全网最全 Flutter 与 React Native 深入对比分析](https://juejin.im/post/5d0bac156fb9a07ec56e7f15)


### 示例图片

![](./1.gif)

<img src="http://img.cdn.guoshuyu.cn/showapp1.jpg" width="426px"/>

<img src="http://img.cdn.guoshuyu.cn/showapp2.jpg" width="426px"/>

<img src="http://img.cdn.guoshuyu.cn/showapp3.jpg" width="426px"/>

### 第三方框架

* [react-native(0.61.3)](http://reactnative.cn/docs/0.51/getting-started.html)
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
* [lottie](https://github.com/airbnb/lottie-react-native)

### 常见问题

* 1、xcode的运行，第一次下载 react native 和 realm 相关包比较耗时。[iOS RN 0.45以上版本所需的第三方编译库(boost等)解决](http://reactnative.cn/post/4301)

* 2、win下在npm出现问题时，再次npm时可以删除.lock文件先（如果是mac就简单很多了）。

![](http://img.cdn.guoshuyu.cn/thanks.jpg)

### LICENSE
```
CarGuo/GSYGithubAPP is licensed under the
Apache License 2.0

A permissive license whose main conditions require preservation of copyright and license notices.
Contributors provide an express grant of patent rights.
Licensed works, modifications, and larger works may be distributed under different terms and without source code.
```
