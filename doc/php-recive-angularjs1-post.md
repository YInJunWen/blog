# php 接收 angular 传递的 post 参数

> 项目中经常遇到 ajax 传递数据给服务器的事情，之前我们用 jquery 传递数据的时候，他用的是 form 表单的格式传递数据，在 angularJs 中默认使用的是 json 字符串的格式，这样一来在 PHP 文件中通过我们常用$\_POST 就获取不到参数了，这个时候怎么处理呢

## ajax 传递内容的三种方式：

1.  最常用的是序列化字符串，我们之前用 jquery 的时候，大多数都是这种方式，比如： `"name=zhangsan&age=13"`
2.  json 字符串：通常用于传递多层次的数据，通常是一个对象，比如`{name: 'zangsan', age: 13}`
3.  表单数据：这种通常用于上传文件时候才需要用到，格式比较复杂

## php 中获取 post 过来的数据有三种方式

1.我们最常用的，也是最直接的$\_POST 方式，比如`$_POST['name']`可以获取到`zhangsan`

2.使用`file_get_contents(“php://input”)`

对于未指定 `Content-Type` 的 POST 数据，则可以使用`file_get_contents(“php://input”)`;来获取原始数据。
事实上，用 PHP 接收 POST 的任何数据均使用本方法。而不用考虑`Content-Type`，包括二进制文件流也是可行的。
同`$HTTP_RAW_POST_DATA`比起来，它给内存带来的压力较小，并且不需要任何特殊的 `php.ini` 设置。

`php://input`无法读取`Content-Type`为`multipart/form-data`的 POST 数据，需要设置`php.ini`中的`always_populate_raw_post_data`值为 On 才可以。

`php://input`读取不到`$_GET`数据。是因为$\_GET 数据作为`query_path`写在 http 请求头部(header)的 PATH 字段，而不是写在 http 请求的 body 部分。

3.使用全局变量`$GLOBALS[‘HTTP_RAW_POST_DATA’]`

在`$GLOBALS[‘HTTP_RAW_POST_DATA’]`存放的是 POST 过来的原始数据。
但`$GLOBALS[‘HTTP_RAW_POST_DATA’]`中是否保存 POST 过来的数据取决于`centent-Type`的设置，只有在 PHP 在无法识别的`Content-Type`的情况下，才会将 POST 过来的数据原样地填入变量`$GLOBALS[‘HTTP_RAW_POST_DATA’]`中，象`Content-Type=application/x-www-form-urlencoded`时，该变量是空的。
另外，它同样无法读取`Content-Type`为`multipart/form-data`的 POST 数据，也需要设置`php.ini`中的`always_populate_raw_post_data`值为 On，PHP 才会总把 POST 数据填入变量`$http_raw_post_data`。

那么 angular 默认传递过来的方式是 json 字符串，我喜欢使用第二种方式来获取数据，只需要通过 php 内置函数`json_decode`即可把 json 字符串，转为 php 的数组类型。

## 重要提示

在这里千万不要忘记 json_decode 的第二个参数，如果没有设置为`TRUE`，将返回一个对象，而不是一个标准的 php 数组
