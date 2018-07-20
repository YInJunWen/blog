# js cookie 的作用域

`cookie`是保存在浏览器端的一小段数据，会在浏览器下一次向服务器发送请求的时候携带到服务器上，主要用以以下三个方面

* 会话状态管理（如用户登录状态、购物车、游戏分数或其它需要记录的信息）
* 个性化设置（如用户自定义设置、主题等）
* 浏览器行为跟踪（如跟踪分析用户行为等）

## cookie 的属性

一个常规的 cookie 有以下属性

| 属性     | 作用                                                                |
| -------- | ------------------------------------------------------------------- |
| path     | 定义可以访问到 cookie 的页面路径                                    |
| doman    | 定义可以访问到 cookie 的页面域名                                    |
| expires  | 定义 cookie 的过期时间，如果没有设置，会在会话被关闭后清理掉        |
| secure   | 定义 cookie 只允许通过 https 方式传输                               |
| HttpOnly | 定义了 cookie 只能发送给服务端，而不能被 document.cookie 方法访问到 |

## path 属性

path 属性定义了可以访问 cookie 的页面 url 路径，没有指定的时候，默认是页面所属域名的根路径`/`，可访问状态如下所示

| cookie 路径 | 访问 url           | 可访问状态 |
| ----------- | ------------------ | ---------- |
| /           | /index.html        | 可以访问   |
| /           | /app/index.html    | 可以访问   |
| /           | /mobile/index.html | 可以访问   |
| /app        | /index.html        | 不可以访问 |
| /app        | /app/index.html    | 可以访问   |
| /app        | /mobile/index.html | 不可以访问 |
| /mobile     | /index.html        | 不可以访问 |
| /mobile     | /app/index.html    | 不可以访问 |
| /mobile     | /mobile/index.html | 可以访问   |

也就是说，当 path 定义为`/`的时候，该域名下任何路径的页面都可以访问到 cookie，如果设置了路径，则只有路径下的页面才可以访问

## doman 属性

doman 属性定义了可以访问到 cookie 的域名，在没有指定 doman 属性的时候，设置的 cookie 默认是当前页面的域名，比如在`http://test.com/index.html`中写入的 cookie，它的默认 doman 是`test.com`,`能且只能`被`http://test.com/`下的页面访问到。

| cookie 的 doman 属性 | 访问 url              | 可访问状态 |
| -------------------- | --------------------- | ---------- |
| test.com             | test.com/index.html   | 可以访问   |
| test.com             | a.test.com/index.html | 不可访问   |
| test.com             | b.test.com/index.html | 不可访问   |
| a.test.com           | test.com/index.html   | 不可访问   |
| a.test.com           | a.test.com/index.html | 可以访问   |
| a.test.com           | b.test.com/index.html | 不可访问   |

## expires 属性

expires 属性定义了 cookie 的过期时间，如果没有指定这个属性值，默认属于会话 cookie，会在会话结束后被浏览器销毁，这里在 windows 和 mac 下有所不同，windows 下浏览器点击关闭按钮后，会话 cookie 就会被销毁。而 mac 下的浏览器关闭按钮，点击之后只是关闭了当前软件窗口，并没有退出软件，所以要用`command+Q`的方式，完全退出浏览器，会话 cookie 才会被销毁。

## secure 属性

安全的 cookie 应该是通过 https 协议传输给服务器，如果你的 cookie 设置了该属性，该 cookie 就只能通过 https 协议的方式传给服务端

## httpOnly 属性

浏览器保存的 cookie，访问页面的时候会根据 cookie 设置的 path 以及 doman 属性，使用`document.cookie`方法访问到，如果 cookie 在设置的时候，添加了 httpOnly 属性，该 cookie 就不能通过`document.cookie`方法获取到，只能用于传输给服务端

## 设置 cookie 的方法

cookie 可以通过服务器设置，也可以在浏览器中通过脚本设置

php 的设置 cookie 的方法是 `setCookie(name,value,expire,path,doman,secure,httpOnly)`

```php
setCookie('name', 'zhangsan', time()+3600, '/', 'test.com', true, true)
```

下面是一个通过 js 设置 cookie 的案例

```js
document.cookie =
  "name=zhangsan;path=/;doman='test.com';expires=Wed, 21 Oct 2020 07:28:00 GMT;httpOnly;secure";
```

## 获取 cookie 的方法

通过`document.cookie`可以获取到当前页面所属域下，所有 cookie 的 name 和 value 信息，如果想查看 cookie 的其他属性，需要在开发者工具中查看

## 如何让 cookie 可以跨域访问

假设我们有两个项目，A 页面：`a.test.com/index.html`和 B 页面`b.test.com/index.html`,如果我想在 A 页面中设置一个能够让 A 页面和 B 页面同时访问到的 cookie，应该怎么做呢？很简单，在定义 cookie 的时候，我们把 cookie 的 doman 属性改成这两个页面的超级域即可

```js
document.cookie = 'name=zhangsan;doman=.test.com';
```

`test.com/index.html`

```js
// 假设本页面已有cookie: name=zhangsan
console.log(document.cookie);
```

`a.test.com/index.html`

```js
// 假设本页面已有cookie: name=zhangsan
console.log(document.cookie);
```

| 两个页面的输出如下页面 | cookie        |
| ---------------------- | ------------- |
| test.com               | name=zhangsan |
| a.test.com             | age=12        |

我们知道在页面中可以通过`document.doman`重新定义页面的域，在上面两个页面的输出 cookie 方法前，各自加上代码`document.doman='*.test.com'`，我们再来看一下页面的输出内容：

## 在开发工具中查看 cookie

假设我们有以下两个页面

`test.com/index.html`

```html
<!-- 假设本页面已有cookie: name=zhangsan -->
<img src="http://a.test.com/logo.png">
```

`a.test.com/index.html`

```html
<!-- 假设本页面已有cookie: age=12 -->
<img src="http://test.com/logo.png">
```

在没有插入图片标签的时候，两个页面在开发者工具中显示的 `cookie` 信息如下

| 页面       | cookie        | path       |
| ---------- | ------------- | ---------- |
| test.com   | name=zhangsan | test.com   |
| a.test.com | age=12        | a.test.com |

在 test.com 中插入引用了 `a.test.com` 服务器中的图片后，开发者工具中显示的 `cookie` 信息如下：

| 页面       | cookie        | path       |
| ---------- | ------------- | ---------- |
| test.com   | name=zhangsan | test.com   |
| test.com   | age =12       | a.test.com |
| a.test.com | age=12        | a.test.com |

相对应的，在 `a.test.com` 中插入引用了 `test.com` 服务器中的图片后，开发者工具中显示的 `cookie` 信息如下：

| 页面       | cookie        | path       |
| ---------- | ------------- | ---------- |
| a.test.com | name=zhangsan | test.com   |
| a.test.com | age =12       | a.test.com |
| test.com   | name=zhangsan | test.com   |

在 `test.com/index.html` 页面中获取一下 `document.cookie`，信息如下

```
name=zhangsan
```

所以:

> 在页面中请求资源的时候，如果`资源所属域**下有 cookie，这些 cookie 也会在当前页面的开发者工具中显示出来，但**不可以`被 document.cookie 获取到

## 什么情况下 cookie 会传递给服务端

浏览器也可以在请求中把 `cookie` 传递给服务端，但是这两种传递都和页面所属的域有关，这里就从一些案例中发现 `cookie` 与域的关系

首先，我在服务端的访问日志中添加了“把 COOKIE 写入日志”的选项(具体怎么添加可以查看 Apache 或者 nginx 官方文档)，我这里以 apache 为例，先在`test.com/index.html`中添加一段代码，如下：

```html
<!-- 假设本页面已有cookie: name=zhangsan -->
<img src="/logo.png">
<img src="http://a.test.com/logo.png">
```

访问一下`test.com/index.html`页面，服务端的日志信息如下所示

| 访问地址  | 服务器处理时间               | 访问文件路径               | cookie 信息   | 访问域名   |
| --------- | ---------------------------- | -------------------------- | ------------- | ---------- |
| 127.0.0.1 | [29/Mar/2018:16:52:49 +0800] | "GET /index.html HTTP/1.1" | name=zhangsan | test.com   |
| 127.0.0.1 | [29/Mar/2018:16:52:49 +0800] | "GET /logo.png HTTP/1.1"   | name=zhangsan | test.com   |
| 127.0.0.1 | [29/Mar/2018:16:52:49 +0800] | "GET /logo.png HTTP/1.1"   | age=12        | a.test.com |

通过日志可以发现，

> 不管是引用相同域的图片还是不同域的图片，浏览器都把资源所属域下的 cookie 信息同步传递给了服务端，往往服务器在返回这些资源的时候，是不需要对 cookie 进行验证处理的，也就是说在请求中传递了大量的无用信息，这就造成了极大的性能浪费。在开发过程中，我们经常会采用`域名分发`的方式来避免这个问题
