<!-- Date: 2018-02-22 10:10:12 -->

# vue-router2 中如何设置默认的路由

> angularJs 中有一个设置默认路由的方法，那么 vue-router 中如何设置默认路由呢？

以本博客的路由为例

```js
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      name: ',
      path: ',
      redirect: '/home/list'
    },
    {
      name: 'home',
      path: '/home',
      component: Home,
      children: [
        {
          path: 'list',
          component: HomeList
        },
        {
          path: 'article',
          component: HomeArticle
        },
        {
          path: 'login',
          component: HomeLogin
        },
        {
          path: 'register',
          component: HomeRegister
        }
      ]
    },
    {
      name: 'admin',
      path: '/admin',
      component: Admin,
      children: [
        {
          path: 'list',
          component: AdminList
        },
        {
          path: 'article',
          component: AdminArticle
        },
        {
          path: 'user',
          component: AdminUser
        },
        {
          path: 'info',
          component: AdminInfo
        },
        {
          path: 'label',
          component: AdminLabel
        }
      ]
    }
  ]
})
```

可以看到我们设置了一个 name 和 path 均为空字符串的路由，当浏览器第一次打开的时候 url 为`http://localhost:8080/#/`,通过我们设置的`redirect`属性，让他默认跳转到我们的`/home/list`页面即可，注意 -
后面当我们想要跳转到首页的时候，`router-link`中的`to`属性要接到 path 的最尾端，比如

```html
<view-link :to=&{path: '/home/list'}></router-link>
```

否则他是不会自动渲染到二级路由的
