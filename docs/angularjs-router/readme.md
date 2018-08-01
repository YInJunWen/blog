<!-- Date: 2016-07-24 00:09:51 -->

# angularJS-router 的使用案例

## html 的设置

```html
<div ui-view=""></div>
```

## 以如下路由为例：

```js
$stateProvider
  .state('admin', {
    url: '/admin',
    templateUrl: './static/view/admin.html',
    controller: 'adminCtrl',
  })
  .state('admin.info', {
    url: '/info',
    templateUrl: './static/view/admin_info.html',
    controller: 'adminInfoCtrl',
  })
  .state('admin.article', {
    url: '/article/:id',
    templateUrl: './static/view/admin_article.html',
    controller: 'adminArticleCtrl',
  })
  .state('home', {
    url: '/home/',
    templateUrl: './static/view/home.html',
    controller: 'loginCtrl',
  })
  .state('home.list', {
    url: '/list',
    templateUrl: './static/view/home_list.html',
    controller: 'loginCtrl',
  })
  .state('home.article', {
    url: '/article/:id',
    templateUrl: './static/view/home_article.html',
    controller: 'loginCtrl',
  });
```

## 控制跳转方式以及规则

1.从二级路由跳转到同一个一级路由下的页面

```js
ui-sref=".二级路由"
$state.go('一级路由.二级路由')
```

从`/admin/article/1`跳转到`/admin/info/`

```js
ui-sref=".info"
$state.go('admin.info')
```

2.从二级路由跳转到非同一个一级路由的页面

```js
ui-sref="'一级路由.二级路由'"
$state.go('一级路由.二级路由')
```

从`/admin/info/`跳转到`/home/list/`

```js
ui-sref="home.list"
$state.go('home.list')
```

3.当即将跳转的路由有未知参数，比如路由类型为`/admin/:id`时，必须传入对应的参数，哪怕该参数为空值，否则将跳转失败，控制台也会报错

从`/admin/info/`跳转到`/home/article/`;

```js
ui-sref="home.article({id: '})"
$state.go('home.article', {id: "})
```

从`/admin/info/`跳转到`/home/article/`

```js
ui-sref="home.article({id: '1'})"
$state.go('home.article', {id: "1"})
```

4.带参数的二级路由页面，跳转到相同的不带参数的二级路由页面，`只能`通过下面的方式

```js
$state.go('一级路由.二级路由', {参数名： 参数值})
```

从`/admin/article/1`跳转到`/home/article/`

```js
$state.go('home.article), {id: '}
$state.go('home.article), {id: '1'}
```
