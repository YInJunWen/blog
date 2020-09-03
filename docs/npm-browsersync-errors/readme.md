<!-- Date: 2017-10-24 04:51 -->

# npm brwoser-sync 插件常见错误

## mime.lookup is not a function

browser-sync 调试的时候输出 mime.lookup is not a function,
这是因为 mime 包在最新的版本中舍弃了这个方法，具体的改变看[mime 的 npm 包](https://www.npmjs.com/package/mime)

解决办法

假设我们的 browser-sync 包安装在全局下，先找到 browser-sync 包所在的位置

```
npm config list -a

; cli configs
a = true
metrics-registry = "https://registry.npm.taobao.org/"
scope = "
user-agent = "npm/5.3.0 node/v8.5.0 darwin x64"

; userconfig /Users/liyun/.npmrc
registry = "https://registry.npm.taobao.org/"

; builtin config undefined
prefix = "/usr/local"

; node bin location = /usr/local/Cellar/node/8.5.0/bin/node
; cwd = /opt/www/boss-web
; HOME = /Users/liyun
; "npm config ls -l" to show all defaults
```

可以看到我的全局安装位置在`/usr/local`文件夹中，

```
open /usr/local/lib/node_modules/browser-sync/node_modules/
```

在这个文件夹中能看到有三个不同版本的 mime 的包文件，删掉 2.x.x 版本的即可

如果没有这个 mime 包，可以在`/usr/local/lib/node_modules/browser-sync/`文件夹中，以指定版本号的方式安装 mime 包，版本不要超过 2.x.x 即可
