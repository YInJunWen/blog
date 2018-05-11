# eslint 对 Promise 方法解析报错

> 在本博客的 vue 版开发中，启用了 eslint 的检测。在 app_alert 组件中用到了 ES6 中心的 API： Promise，编辑器输出了以下错误

```
file: 'file:///opt/www3/blog-vue2/src/common/app_alert/index.js'
severity: '错误'
message: 'Expected the Promise rejection reason to be an Error. (prefer-promise-reject-errors)'
at: '20,21'
source: 'eslint'
```

代码内容

```js
btnClick (state) {
    return new Promise((resolve, reject) => {
        if (state) {
            resolve(true)
        } else {
            reject()
        }
    })
}
```

报错信息内容是： promise 的 reject 方法必须传递一个错误类型的参数，因此改动如下：

```js
btnClick (state) {
    return new Promise((resolve, reject) => {
        if (state) {
            resolve(true)
        } else {
            reject(new Error('error msg'))
        }
    })
}
```

现在就没有报错信息了

我自己是很不喜欢在 then 方法里面写两个函数的，也不太喜欢后面加上一个 catch 方法，因此我在返回的 promise 中直接去掉了 reject 方法，以下是我最后使用的方法：

```js
btnClick (state) {
    return new Promise((resolve, reject) => {
        if (state) {
            resolve({ok: true})
        } else {
            resolve({ok: false})
        }
    })
}
```
