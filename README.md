# abnormal-info-system(自动生成异常信息系统)

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
确保你的仓库设置中将GitHub Pages的源设置为master分支。（Vue 2项目代码在master分支中，就请确保"Source"选项设置为master branch）

**`注意：在上述`README.md`示例中，需要将`yourusername`和`your-repo`替换为你的GitHub用户名和项目仓库名称。另外，确保你的Vue项目中有一个名为`vue.config.js`的文件，并按照示例配置了`publicPath`。`**
