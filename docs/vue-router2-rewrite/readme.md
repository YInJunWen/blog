<!-- Date: 2016-10-08 06:14 -->

# vue-router2 的二次封装

> vue-router 是 vue 项目中必不可少的插件，使用方法也很简单，根据之前用 angularJS 的经验，我想对这个插件也来一个二次封装

## 为什么要二次封装

正常情况下，vue-resource 的返回结果有一下几种状态：

1.  接口访问成功，操作结果成功
2.  接口访问成功，操作结果失败，比如因为 token 失效，无权限等等引起的操作失
3.  接口访问失败，比如 404 405 等状态

下面是一个最常见的案例

```js
this.$http.post(url, postData).then((res) => {
    if(){
        // 这里处理第1种状态
    }else{
        // 这里处理第2种状态
        // 可能还要根据失败的状态吗进行处理
    }
}, () => {
    // 这里处理第3种状态
})
```

这个案例中有三处很不方便的地方：

1.  `url`： 在开发中，项目会分为开发、测试、生产三个环境，不同的环境中使用的后端接口地址肯定是不同的，如果需要切换环境，就需要一个一个的去更改。
2.  `psotData`: 我们都知道在实际项目中，尤其是需要验证前台账户权限相关的接口中，都需要把客户端中保存的用户信息(用户 id，token 等)传递给接口。每个接口都要添加这些参数，是一家很麻烦的事情，搞不好有时候还忘记了
3.  返回结果：使用案例中的方法，就必须在`then`事件中写`failCallback`方法，(我个人是很不喜欢写`reject`方法的，总是会把这类的方法都单独封装)

所以我们要对 vue-resource 进行二次封装，提高我们的开发效率。

## 封装后的方法

以 post 方法为例：

```js
post(url, data) {
    var postData = Object.assign({
        usid: this.getCookie('usid'),
        token: this.getCookie('token')
    }, data)
    console.log(`Req: ${this.HTTP_POST + url}`, postData)
    let p = new Promise((resolve, reject) => {
        // 把所有的情况分为两种类型：res.ok 和 res.err
        this.$http.post(`${this.HTTP_POST}${url}`, postData).then((res) => {
            console.log(`Res: `, res)
            if (res.ok) {
                res.json().then((res) => {
                    if (res.code === 0) {
                        // 操作成功
                        res.ok = true
                        resolve(res)
                    } else {
                        // 操作失败，服务器返回0 以外的代码
                        res.ok = false
                        resolve(res)
                    }
                })
            } else {
                res.ok = false
                resolve(res)
            }
        }, (err) => {
            // 接口都调用失败了的情况，比叡404 405之类的
            console.log(err)
            resolve({ ok: false, err })
        })
    })

    return p
},
```

从代码中可以看到，封装后我们和原方法一样返回一个`promise`对象，并且舍弃了其中的`reject`方法，全部用`resolve`替换，

`resolve`方法的参数也被我们封装的只有两种结果: 1. res.ok 为 true 2. res.ok 为 false， 现在我们只需要根据`promise`对象中`res.ok`的值是否为 true，来进行下一步的操作

这里要注意为什么我在 post 的 successCallback 方法有用 res.ok 区分了一下呢？当在前端设置了 timeout 值的时候，vue-resource 不会执行 failCallback 方法，它执行的是 successCallback 方法，只是返回的 res.ok 值为 false， 因此我把这一类也放在失败的方法中了

现在，假设我们已经把上面的 post 方法封装在了 Vue.\$dict 组件中

在一些不需要验证用户权限的接口中我们这样操作：

```js
var postData = {
    name: 'zhangsan'
}
this.$dict.post('addUser', postData).then((res){
    if(res.ok){
        // 处理第1种状态
    }else{
        // 处理第2、3种状态
    }
})
```

在需要验证用户权限的接口中,假设 token 验证失败的时候 res.code=1

```js
var postData = {
    name: 'zhangsan'
}
this.$dict.post('addUser', postData).then((res){
    if(res.code === 1){
        // 重新登录
        return false // 这里直接return false掉，就可以省去后面的运算开销
    }
    if(res.ok){
        // 处理第1种状态
    }else{
        // 处理第2、3种状态
    }
})
```

现在是不是结果处理起来更容易了，在项目中有很多插件，不管是从方便角度还是安全角度，都是可以进行二次封装的，比如`vue-cookie`插件, 详细的再下一篇文章中
