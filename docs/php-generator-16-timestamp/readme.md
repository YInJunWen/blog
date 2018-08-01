<!-- Date: 2016-10-24 04:20:26 -->

# php 返回 16 位的时间戳

```php
// 返回20161106011112样式的时间戳 16位
function rtime(){
 list($a,$b) = explode(' ', microtime());
 $return = date("YmdHis").round($a*100);
 while(mb_strlen($return, 'utf-8')<16){
  $return.='0';
 }
 return $return;
}
```
