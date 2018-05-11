# express 中的 res

## res.send()

这个方法我觉得应该是对`rs.write()`和`res.end()`方法的封装，只需要添加要发送给客户端的内容即可

## res.cookie(name, value, options)

这个方法用来设置发送的 cookie,第一个参数为 cookie 的 key，第二个参数为 cookie 的 value 值，第三个参数是其他的一些选项

| 参数     | 作用                                                                                                                                          |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| domain   | cookie 在什么域名下有效，类型为 String,。默认为网站域名                                                                                       |
| expires  | cookie 过期时间，类型为 Date。如果没有设置或者设置为 0，那么该 cookie 只在这个这个 session 有效，即关闭浏览器后，这个 cookie 会被浏览器删除。 |
| httpOnly | 只能被 web server 访问，类型 Boolean。                                                                                                        |
| maxAge   | 实现 expires 的功能，设置 cookie 过期的时间，类型为 String，指明从现在开始，多少毫秒以后，cookie 到期。                                       |
| path     | cookie 在什么路径下有效，默认为'/'，类型为 String                                                                                             |
| secure   | 只能被 HTTPS 使用，类型 Boolean，默认为 false                                                                                                 |
| signed   | 使用签名，类型 Boolean，默认为 false。`express会使用req.secret来完成签名，需要cookie-parser配合使用`                                          |

注意有一个与 cookie 有关的中间件：cookie-parser，这个中间件可以获取到页面的所有 cookie,并解析成 JSON 格式，保存在 req.cookies 中，使用方法如下：

```js
    var cookieParser = require('cookie-parser');
    app.use(cookieParser());
    app.get('/', function(req,res){
        console.log(req,cookies)
        }})
```
