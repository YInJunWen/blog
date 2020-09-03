<!-- Date: 2016-09-03 00:50 -->

# axios 主动取消请求

> axios 作为目前很主流的 ajax 请求插件，简单的用法已经赢得了广大前端开发者的喜爱，普通的`get post`等方法这里就不说了，主要说一下如何主动取消 ajax 请求的问题

原声的 ajax 如果想取消请求，可以使用原声的 abort 方法，而 axios 会在请求的时候为当前请求创建一个唯一的标志符，这就可以让我们通过该标识符，来找到需要停止的那个 ajax 请求。

取消请求，不仅仅是用在用户主动请求方面，还有一个很重要的用处是：`当请求未完成时，用户离开了当前页面`，应用必须主动停止页面内的所有 ajax 请求，防止用户离开页面后，执行了相关请求后续的成功或者失败逻辑

一般情况下，对于`当请求未完成时，用户离开了当前页面`的行为，通常我们会有三种途径来解决这个办法

-   发送请求时，创建全局的遮罩层，不允许用户点击。 优点：实现起来很简单；缺点：用户从地址栏导航到某个路由下，请求的后续操作还是会出现
-   在请求的后续操作中，先检查页面路由地址，如果路由地址没有变化，再继续执行后续操作。 缺点: 每个请求的成功和失败方法都要写一遍，造成大量的重复代码
-   在路由变化的时候，主动停止路由下组件内的所有正在进行的 ajax 请求。 优点：可以在框架的路由层创建一个`路由守卫`(有的框架本身已经实现了该方法),不会造成大量冗余代码

先来看一下直接在页面中引入 axios 时，取消请求的方法

```html
<button @click="submit()">submit</button> <button @click="cancel()">cancel</button>
```

```js
<script src="axios.js"></script>
<script type="javascript/text">
    var source = axios.CancelToken.source();

    function submit(){
        axios.post(url, data, {
            cancelToken: source.token
        }).then((res) => {
            console.log(res)
        }).catch((err)=>{
            console.log(err)
        })
    }
    function cancel(){
        source.cancel("被主动取消了")
    }
</script>
```

下面是在 webpack 构建项目的时候，取消请求的方法，与普通方法不同的是，我们要把 source 保存在 data 内，来保证其他的方法调用的是同一个对象

```js
import axios from 'axios';
export default {
    data() {
        source: undefined;
    },
    methods: {
        submit() {
            this.source = axios.CancelToken.source();
            axios
                .post(url, data, {
                    cancelToken: this.source.token,
                })
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        cancel() {
            this.source.cancel('被主动取消了');
        },
    },
};
```

我搭建了一个测试用的服务器，来测试这个方法

```php
<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: content-type");
    header('Content-Type: text/plain; charset=utf-8');
    sleep(10);
    echo 1;
?>
```

可以看到，我故意在接口文件中写了`sleep`方法，来实现 10 秒后再返回数据，在页面点击发送请求后，在点击取消请求按钮，控制台已经准确告诉我该请求确实已经被取消了,并且会抛出了一个 Cancel 对象，被 catch 捕获到。

```js
Catch: {
    message: '被主动取消了';
}
```

cancel 方法可以传递一个参数给 message，便于开发人员进行调试
