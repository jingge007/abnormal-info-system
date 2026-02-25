# abnormal-info-system(自动生成异常信息系统)

## 项目简介

abnormal-info-system是一个基于Vue 2的异常信息管理系统，旨在帮助开发团队更高效地处理和管理系统异常信息。该系统提供了异常报告生成、服务打包管理、内容资料上传等功能，为开发和运维工作提供了便捷的工具支持。

### 项目价值
- **提高问题处理效率**：标准化异常信息收集和处理流程
- **简化服务管理**：提供便捷的打包服务配置和管理功能
- **知识积累与共享**：通过内容资料上传和记事本功能，促进团队知识沉淀

## 技术栈

### 前端技术
- **框架**: Vue 2.x - 轻量级前端框架，提供响应式数据绑定和组件化开发
- **状态管理**: Vuex - 集中式状态管理，方便组件间数据共享
- **路由**: Vue Router - 官方路由管理器，实现单页应用的页面导航
- **UI组件库**: View Design (iView) - 美观、易用的企业级UI组件库
- **富文本编辑器**: WangEditor 5 - 功能强大、易于集成的富文本编辑器
- **图片预览**: v-viewer - 轻量级图片预览插件，支持图片缩放、旋转等操作
- **日期处理**: moment.js - 功能全面的日期时间处理库
- **样式**: Less + Windi CSS - Less提供CSS预编译能力，Windi CSS实现原子化CSS
- **构建工具**: Vue CLI - 官方构建工具，提供完整的项目脚手架和构建流程

### 后端存储
- **云存储**: LeanCloud - 提供简便的BaaS服务，无需搭建后端服务即可实现数据存储和管理

## 功能模块

### 1. 生成异常报告
- **信息收集**：支持收集系统报错信息，包括所在系统、环境、请求方式、报错接口、入参等详细信息
- **接口转换**：内置Swagger接口controller转换功能，自动将驼峰命名转换为短横线命名
- **多格式输出**：提供异常报告链接复制、TXT文件下载、新窗口预览等多种输出方式
- **数据持久化**：使用LeanCloud存储异常信息，确保数据可追溯

### 2. 打包服务
- **项目支持**：支持YMS和VES两个主要项目的服务管理
- **分组管理**：提供全选类、运营服务、供应商服务、商城服务、分销商服务等多个分组的一键打包功能
- **智能选择**：支持按前后端类型、业务模块等维度快速选择需要打包的服务
- **系统前缀**：提供系统前缀快速复制功能，方便开发人员使用

### 3. 内容资料上传
- **富文本编辑**：集成WangEditor 5富文本编辑器，支持多种格式的内容编辑
- **图片处理**：支持图片上传、编辑、预览等功能，图片自动存储到LeanCloud
- **资料管理**：提供资料的创建、编辑、保存等完整功能

### 4. 记事本列表
- **资料管理**：集中管理和查看所有上传的资料
- **详情查看**：支持点击查看资料详情，包括完整的富文本内容
- **编辑功能**：支持对已上传的资料进行编辑和更新

## 技术实现亮点

### 1. 模块化设计
- 采用Vue组件化开发思想，将页面拆分为多个可复用的组件
- 功能模块清晰分离，便于维护和扩展

### 2. 响应式布局
- 使用View Design的栅格系统，实现响应式布局
- 适配不同屏幕尺寸，提供良好的用户体验

### 3. 数据可视化
- 使用View Design的表单、表格等组件，实现数据的直观展示
- 提供清晰的操作反馈，增强用户交互体验

### 4. 云服务集成
- 无缝集成LeanCloud，实现数据的云端存储和管理
- 无需搭建后端服务，降低了项目复杂度和部署成本

### 5. 工具函数封装
- 封装了常用的工具函数，如复制文本、日期格式化等
- 提高代码复用率，减少重复开发

## 项目结构

```
src/
├── components/        # 基础组件
├── views/             # 页面组件
├── router/            # 路由配置
├── store/             # 状态管理
├── utils/             # 工具函数
├── styles/            # 样式文件
├── plugins/           # 插件（如LeanCloud）
├── App.vue            # 根组件
└── main.js            # 入口文件
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

## 部署指南

### 记录将Vue 2项目部署到GitHub Pages上步骤及注意事项和配置

在github中可以将代码上传到GitHub Pages中。
GitHub Pages是GitHub提供的一项免费静态网站托管服务。它允许你将你的GitHub仓库中的静态网页（如HTML、CSS、JavaScript等）
直接部署到一个在线可访问的网址上。这使得你可以轻松地将你的项目展示给其他人，无需购买独立的网站托管服务。

#### 步骤：
1.在你的Vue项目中，打开package.json文件，并确保你的项目配置中具有homepage字段。该字段的值应设置为你的GitHub Pages的URL，格式为https://<username>.github.io/<repository>，其中<username>是你的GitHub用户名，<repository>是你的仓库名称。
```
"homepage": "https://yourusername.github.io/your-repo",
```

2.在终端或命令提示符中，进入到你的Vue项目目录，并运行以下命令来安装gh-pages插件：
```
npm install gh-pages --save-dev
```

3.打开Vue项目的配置文件vue.config.js，如果没有该文件，请在项目根目录创建一个新文件。
在vue.config.js文件中添加以下内容：
```
module.exports = {
  publicPath: '/abnormal-info-system/'
};
```
4.在终端或命令提示符中，运行以下命令来构建项目，这将生成一个构建好的项目文件夹（通常是dist目录）。
```
npm run build
```
5.执行部署命令。运行以下命令将构建好的文件推送到GitHub Pages：
```
npx gh-pages -d dist
```
6.等待部署完成。一旦部署命令执行完成，你的Vue项目将被部署到GitHub Pages上。
你可以在浏览器中访问你的GitHub Pages URL来查看部署的应用程序。
请注意，GitHub Pages部署可能需要一些时间进行生效，特别是在第一次部署时。
确保你的仓库设置中将GitHub Pages的源设置为gh-pages分支。

**`注意：在上述`README.md`示例中，需要将`yourusername`和`your-repo`替换为你的GitHub用户名和项目仓库名称。另外，确保你的Vue项目中有一个名为`vue.config.js`的文件，并按照示例配置了`publicPath`。`**

## 系统环境要求

- Node.js 12.0+
- npm 6.0+

## 浏览器兼容性

- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)

## 许可证

MIT

