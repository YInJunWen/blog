# webpack 中的 CleanWebpackPlugin

webpack 打包的过程中，如果你使用了文件的 hash 或者其他一些算法，导致最终保存的文件每次都不同，一般来说需要在每次打包前手动删除掉 dist 文件夹(这里值得是打包的输出文件目录)，CleanWebpackPlugin 存在的目的就是在每次打包之前自动删除掉你指定的目录，用法如下

```js
const CleanWebpackPlugin = require('clean-webpack-plugin);

module.exports = {
    plugins: [
        new CleanWebpackPlugin(array path,options)
    ]
}
```
[DEMO](./demo)

## path

指定要删除的目录，值为一个包含字符串的数组

## options

修改插件的默认配置，**主要*包括以下内容

allowExternal：该参数默认值为false，表示不允许清理root所指定目录之外的文件，从安全考虑，不建议设置为true

root：该参数指定webpack的root目录，默认情况下指向webpack配置文件所在的目录，当要被清理的目录不在这个目录下，会抛出`outside the project root directory`错误

exclude： 该参数指定的文件不会被清理，值为一个包含字符串的数组，注意当使用这个参数的时候，第一个参数定义个path千万不能写成`dist/*`的格式，否则这里的值会失效，下面就是一个会失效的配置

```js
// dist
//  |--static
//  |    |--vendor.js
//  |test.txt

// 错误的配置:
new CleanWebpackPlugin(['dist/*'],{
    exclude: ['test.txt']
})

// 正确的配置:
new CleanWebpackPlugin(['dist'],{
    exclude: ['test.txt']
})
```


verbose：当设置为true的时候，会在控制台输出清理的日志信息，默认为true

dry： 该参数默认值是false，表示在运行的时候会 **真实**清理需要清理的目录， 当设置为true的时候，并没有真实的清理目录，主要用于测试
