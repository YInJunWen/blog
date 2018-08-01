<!-- Date: 2017-09-01 02:21:29 -->

# php 生成随机固定位数验证码

```js
// 生成验证码
function vcode(){
 $string = "1234567890QWERTYUIOPASDFGHJKLZXCVBNM";
 $rstr = ";
 for($i=0; $i<=5; $i++){
  $bot = rand(0,mb_strlen($string,'utf-8')-1);
  $rstr.=$string[$bot];
 }
 return $rstr;
}
```
