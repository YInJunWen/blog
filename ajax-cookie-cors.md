> 一般情况下，浏览器对于 ajax 跨域请求，默认不会发送身份凭证信息(cookie 和 http 认证相关数据)。如果需要发送这些信息，必须要设置一个特殊的属性：withCredientials，我们以 xmlHttpRequest 为例：

a.com/index.html:

```
<!DOCTYPE html>
<html>

<head>
 <meta charset="utf-8">
 <title></title>
</head>

<body>
 <button>btn</button>
 <script src="https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script>
 <script type="text/javascript">
  document.cookie = "name=zhangsan";
  $(function () {
   $('button').click(function (e) {
    test();
   })
  })
  function test(ev) {
   $.ajax({
    url: 'a.com/index.php',
    type: 'POST',
    data: {
     name: 'zhangsan'
    },
    success: function (data) {
     console.log(data)
    },
    error: function (err) {
     console.log(err)
    },
    xhrFields: {
     withCredentials: true
    },

   })
  }

 </script>
</body>

</html>
```

b.com/index.php

```
<?php
 $http_origin = $_SERVER['HTTP_ORIGIN'];
 header("Access-Control-Allow-Origin: $http_origin"); // 允许跨域访问
 header("Access-Control-Allow-Credentials: true");  // 允许接收用户验证信息
 setcookie('data', time(), time()+3600);   // 设置一个名为data的 cookie
?>
```

b.com/index2.php

```
<?php
 echo json_encode($_COOKIE);
?>
```

index.html 文件中有一个`xhrFields: {withCredentials: true}`的声明，其目的就是为了告诉浏览器，允许传递用户凭证信息到服务端。

index.php 文件中，我们给请求返回了一个 cookie，在浏览器中打开 a.com/index.html，点击按钮后，我们先看一下当前的请求内容

```
Request URL:http://localhost:8888/index.php
Request Method:POST
Status Code:200 OK
Remote Address:[::1]:8888
Referrer Policy:no-referrer-when-downgrade

Accept:*/*
Accept-Encoding:gzip, deflate, br
Accept-Language:zh-CN,zh;q=0.9,en;q=0.8,da;q=0.7,zh-TW;q=0.6
Cache-Control:no-cache
Connection:keep-alive
Content-Length:13
Content-Type:application/x-www-form-urlencoded; charset=UTF-8
Host:localhost:8888
Origin:http://192.168.28.24:3001
Pragma:no-cache
Referer:http://192.168.28.24:3001/
User-Agent:Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36

Access-Control-Allow-Credentials:true
Access-Control-Allow-Origin:http://192.168.28.24:3001
Connection:Keep-Alive
Content-Type:text/html; charset=UTF-8
Date:Tue, 02 Jan 2018 02:42:47 GMT
Keep-Alive:timeout=5, max=98
Server:Apache
Set-Cookie:data=1514860967; expires=Tue, 02-Jan-2018 03:42:47 GMT; Max-Age=3600
Transfer-Encoding:chunked
X-Powered-By:PHP/7.0.15
```

在解析请求的数据中，我们可以看到，服务端已经返回了`set-cookie`的头信息，里面包含了我们设置的 cookie 信息"data",但是在 devtools 的 application-cookie 中，并没有找到我们需要的 data 字段，这是因为虽然服务端返回了 set-cookie 的头信息，但仍需遵循浏览器的同源策略，浏览器把这个 cookie 保存在 b.com 的域名下。如果直接在浏览器中打开`b.com/cookie.php`文件，就可以在 devtools 中看到这个名为“data”字段的 cookie。

现在我们再来点击一次`a.com/index.html`中的按钮，看一看请求体重有什么变化

```
Request URL:http://localhost:8888/index.php
Request Method:POST
Status Code:200 OK
Remote Address:[::1]:8888
Referrer Policy:no-referrer-when-downgrade

Accept:*/*
Accept-Encoding:gzip, deflate, br
Accept-Language:zh-CN,zh;q=0.9,en;q=0.8,da;q=0.7,zh-TW;q=0.6
Cache-Control:no-cache
Connection:keep-alive
Content-Length:13
Content-Type:application/x-www-form-urlencoded; charset=UTF-8
Cookie:data=1514860967
Host:localhost:8888
Origin:http://192.168.28.24:3001
Pragma:no-cache
Referer:http://192.168.28.24:3001/
User-Agent:Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36

Access-Control-Allow-Credentials:true
Access-Control-Allow-Origin:http://192.168.28.24:3001
Connection:Keep-Alive
Content-Type:text/html; charset=UTF-8
Date:Tue, 02 Jan 2018 02:52:52 GMT
Keep-Alive:timeout=5, max=100
Server:Apache
Set-Cookie:data=1514861572; expires=Tue, 02-Jan-2018 03:52:52 GMT; Max-Age=3600
Transfer-Encoding:chunked
X-Powered-By:PHP/7.0.15
```

我们看到除了服务器返回了一个新的 cookie 之外，在发送请求的时候，多了一个 cookie 的头信息，这个头信息把我们上一次保存在域`b.com`下的 cookie 信息也发送给了服务端，这就是我们前面设置`xhrFields:{withCredientials: true}`的作用了。

另外这里要注意。

1.  `xhrFields:{withCredientials: true}`发送出去的用户验证信息，一定是保存在域`b.com`下的信息，即与接口地址所属的域名信息有关。

2.  服务端`Access-Control-Allow-Crediential`设置为 true 的时候，Access-Control-Allow-Origin 的值不能设置为`*`
