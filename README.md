# TouchUI 组件库示例项目

## 准备工作

- 全局安装touchui-wx-cli
```
  npm install -g touchui-wx-cli
```

- 查看是否安装成功
```
  tui -v
```

- 新建项目
```
  tui init myproject
```

- 安装项目依赖
```
  npm install
```

- 启动项目
```
  tui dev
```

- 创建页面文件
```
  `指定路径和标题
  tui new --newType page --pagePath 页面相对路径 --title 页面标题
  `只指定路径
  tui new --newType page --pagePath 页面相对路径
```

- 创建组件文件
```
  tui new --newType package --title 组件示例页面标题
```

- TouchUI工程转换为WX小程序工程

```
tui transform --type ui2wx --src TouchUI工程目录路径 --dest 输出路径
```

- WX小程序工程转换为TouchUI工程

```
tui transform --type wx2ui --src 小程序输出路径 --dest TouchUI工程目录路径
```

- 预览小程序

打开微信开发者工具，新建一个微信小程序项目，将项目目录指定到本工程的dist目录

## 目录说明

```
  touchui-wx
  ├── dist                              微信开发者工具指定的目录
  ├── node_modules
  ├── packages                          代码编写的目录（该目录为使用 TouchUI 后的开发目录，用于管理各个 组件package 的主目录）
  |   ├── wxc-toast                       组件的 package 目录
  |   |   ├── src
  |   |   |   └── index.wxc                   组件的源码编写文件（组件入口文件必须为index.wxc）
  |   |   ├── package.json                  组件的 package 配置
  |   |   └── README.md                     组件的 README 文档
  └── src                               代码编写的目录（该目录为使用 TouchUI 后的开发目录）
      ├── pages
      |   ├── home
      |   |   ├── index.wx                   home 页面
      |   ├── toast                         toast组件示例
      |   |   ├── demos                       示例目录列表
      |   |   |   └── demo-default.wxc          示例代码
      |   |   └── index.wx                  示例入口页面
      └──app.wxa                        小程序配置项
```
