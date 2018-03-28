# 如何处理在 SPA 中路由切换后的请求终止问题

在前后端未分离的开发模式中，浏览器在等待 ajax 请求响应的时候，执行了页面跳转操作，页面内的 ajax 请求都会直接断掉，不会执行我们定义的 success 以及 error 方法，是因为这个时候浏览器执行了跳转刷新操作

在现代的前后端分离模式中，尤其是 SPA 中，由于页面没有刷新，导致路由跳转后，之前的请求没有被取消掉，请求完成或者失败后仍然可能执行 success 或者 error 中的部分代码，会造成很不好的用户体验。 这个问题一般有三种解决办法

*   发送请求时，创建全局的遮罩层，不允许用户点击。 优点：实现起来很简单；缺点：用户从地址栏导航到某个路由下，请求的后续操作还是会出现
*   在请求的后续操作中，先检查页面路由地址，如果路由地址没有变化，再继续执行后续操作。 缺点: 每个请求的成功和失败方法都要写一遍，造成大量的重复代码
*   在路由变化的时候，主动停止路由下组件内的所有正在进行的 ajax 请求。 优点：可以在框架的路由层创建一个**路由守卫**(有的框架本身已经实现了该方法),不会造成大量冗余代码

今天主要来实现上面所说的第一种和第三种方法的混合方法，以 Vue+axios 为例

`开发目录`

```js
/*
src
    main.js
    app.vue
    components/
        test.vue
    minix/
        index.js
    store/
        index.js
*/
```

`store/index.js`

store 为 vuex 提供状态和方法，用来

```js
export default {
    state: {
        globalCoverShow: false
    },
    mutations: {
        // 打开全局遮罩层
        showGlobalCover(state) {
            state.globalCoverShow = true;
        },
        // 关闭全局遮罩层
        hideGlobalCover(state) {
            state.globalCoverShow = false;
        }
    },
    modules: {
        http: {
            namespaced: true,
            state: {
                httpToken: {}
            },
            mutations: {
                addHttpToken(state, { path, source }) {
                    if (!state.httpToken[path]) {
                        state.httpToken[path] = [];
                    }
                    state.httpToken[path].push(source);
                }
            },
            actions: {
                // 添加ajax请求标记以及对应的source
                addHttpToken({ commit }, { path = "", source }) {
                    if (!path) {
                        console.log(new Error("参数 '请求标记路径' 未找到"));
                        return false;
                    }
                    if (!source) {
                        console.log(new Error("参数 '请求标记源' 未找到"));
                        return false;
                    }
                    commit("addHttpToken", {
                        path,
                        source
                    });
                }
            }
        }
    }
};
```

`mixin/index.js`

```js
import axios from "axios";

// 创建一个axios的实例副本
let http = axios.create({
    timeout: 5000 // 设置全局的超时时间
    // withCredentials: true   // 允许传递本地cookie到服务器
});

export default {
    methods: {
        post({ url = "", data = {}, config = {}, cover = true }) {
            if (!url) {
                throw new Error("url不能为空");
                return false;
            }

            // 显示loading
            if (cover) {
                this.$store.commit("showGlobalCover");
            }

            // 添加请求标记
            let source = axios.CancelToken.source();
            this.$store.dispatch("http/addHttpToken", {
                path: this.$route.name,
                source
            });

            // config参数中添加取消请求标记
            config.cancelToken = source.token;

            // 自动添加基础字段
            if (this.$cookie.get("usid")) {
                data.usid = this.$cookie.get("usid");
            }

            return new Promise((resolve, reject) => {
                http
                    .post(url, data, config)
                    .then(res => {
                        // 关闭loading
                        this.$store.commit("hideGlobalCover");
                        resolve(res.data);
                    })
                    .catch(err => {
                        // 关闭loading
                        this.$store.commit("hideGlobalCover");

                        // 主动取消请求时，axios会reject一个Cancel对象出来，其他错误导致的reject则是抛出了一个Error，因此这里使用 instanceof  来判断是哪种事件导致的reject

                        // 主动使用reject是很有必要的，因为开发人员，经常需要在非主动取消请求的条件下，调用组件中的其他方法
                        if (err instanceof Error) {
                            this.$Message.error("网络错误，请稍后重试");
                            reject({
                                error: true
                            });
                        } else {
                            reject({
                                cancel: true
                            });
                        }
                    });
            });
        }
    }
};
```

`main.js`

```js
import Vue from "vue";
import App from "./App";
Vue.config.productionTip = false;

import VueCookie from "vue-cookie";
Vue.use(VueCookie);

// 使用vuex
import Vuex from "vuex";
Vue.use(Vuex);
import Store from "./store/index.js";
const store = new Vuex.Store(Store);

// 使用vue-router
import VueRouter from "vue-router";
import routes from "./router";
Vue.use(VueRouter);
const router = new VueRouter({
    routes
});

// 注册导航守卫事件，主要目的为了主动取消上一个页面中未执行完毕的ajax请求
router.beforeEach((to, from, next) => {
    if (
        from.name && // 过滤掉从根路径跳转过来的事件，我的根路径没有设置name属性，因此它的值为null
        store.state.http.httpToken[from.name] && // 过滤掉没有ajax请求操作的路由页面
        store.state.http.httpToken[from.name].length > 0 // 过滤掉已经创建了路由页面相对应的key，却由于其他原因导致没有添加成功value的页面
    ) {
        store.state.http.httpToken[from.name].forEach(item => {
            item.cancel();
        });
    }
    next(); // 全局守卫中的beforeEach千万不要忘记在最后调用next方法
});

// 加载自定义插件
import Mixin from "./mixin/";

/* eslint-disable no-new */
new Vue({
    el: "#app",
    mixins: [Mixin],
    router,
    store,
    components: { App },
    template: "<App/>"
});
```

关于在组件中 mixin 的方法，可以直接查看[vue 的混入说明](https://cn.vuejs.org/v2/guide/mixins.html)

`components/test.vue`

上面的文件配置好后，我们就可以在组件中通过`this.$root.post`来发送请求， 例如

```html
<template>
    <button @click="submit()">submit</button>
    <router-link :to="{path: 'login'}"> login</router-link>
</template>
```

```js
methods: {
    submit(){
        this.$root.post({
            url: 'http://localhost:8888/index.php',
            data: {
                name: 'zhangsan'
            }
        }).then((res) => {
            console.log(res)
            if (res.code && res.code === '000000') {
                console.log('正常执行')
            } else {
                this.$Message.error(res.msg)
            }
        }).catch((err) => {
            // 这里只需要处理非abort导致的reject事件，所以使用 err.error来判断
            if (err.error) {

            }
        })
    }
}
```

在上面的工作中，我们首先在每次 post 请求的开始，都打开了全局的遮罩层，来防止用户点击可以导航到其他路由的元素，但是这种方式的缺点前面也提过了，当用户主动从地址栏跳转路由的时候是无效的，因此我们混入了第三种方法，就是在路由变化的时候，检查上个页面有没有未完成的请求，如果有，就把这些请求主动取消掉

这个案例中，post 请求触发的全局遮罩是我默认打开的，如果不想打开，给 post 的参数添加一个 `cover` 为 `false` 的属性即可
