# 捷记 umi+dva

# 1.安装运行

###### 1安装运行
$ yarn / npm install
$ yarn start / npm start

###### 2部署发布

$ 执行 umi build，
$ 构建产物默认生成到 ./dist 下，然后通过 tree 命令查看，(windows 用户可忽略此步）

###### 1.本地验证

  发布之前，可以通过 serve 做本地验证，

# 2.安装yarn *****可使用npm安装，但官方不推荐

###### 2.1.在NPM 中安装
  npm install -g yarn

###### 2.2.MacOS
在Mac上安装比较方便，使用初始化脚本即可
  curl -o- -L https://yarnpkg.com/install.sh | bash
###### 2.3.Linux
Po主自己的机器是Ubuntu,安装比较简单
输入命令
  1.sudo apt-key adv --keyserver pgp.mit.edu --recv D101F7899D41F3C3 
  2.echo "deb http://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
  3.sudo apt-get update && sudo apt-get install yarn

关于安装，你可以去官网查看到更多资料 https://yarnpkg.com/en/docs/install

安装完成后，你可以测试下自己的版本

yarn --version



# 3.安装项目 *****可使用npm安装，但官方不推荐
###### 3.1.全局安装
  $ yarn global add umi
  $ umi -v
  并确保版本是 2.0.0 或以上。

  ********
  使用 npm
	$ npm install -g umi
###### 3.2创建脚手架
  yarn create umi
  按空格选择需要安装的
  antd,dva,hard source

