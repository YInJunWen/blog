<!-- Date: 2017-06-21 07:11 -->

# php 防止 XSS 攻击的编码与解码

> 网站安全一直是网站开发人员必须要注意的问题。虽然 PHP 本身提供了一些过滤 XSS 攻击的方法，但不够全面，这里总计一个常用的编码、解码函数

```php
//解码
function htmldecode($str){
  if(empty($str)) return;
  if($str=="") return $str;
  $str=str_replace("sel&#101;ct","select",$str);
  $str=str_replace("jo&#105;n","join",$str);
  $str=str_replace("un&#105;on","union",$str);
  $str=str_replace("wh&#101;re","where",$str);
  $str=str_replace("ins&#101;rt","insert",$str);
  $str=str_replace("del&#101;te","delete",$str);
  $str=str_replace("up&#100;ate","update",$str);
  $str=str_replace("lik&#101;","like",$str);
  $str=str_replace("dro&#112;","drop",$str);
  $str=str_replace("cr&#101;ate","create",$str);
  $str=str_replace("mod&#105;fy","modify",$str);
  $str=str_replace("ren&#097;me","rename",$str);
  $str=str_replace("alt&#101;r","alter",$str);
  $str=str_replace("ca&#115;","cast",$str);
  $str=str_replace("&amp;","&",$str);
  $str=str_replace(">",">",$str);
  $str=str_replace("<","<",$str);
  $str=str_replace(" ",chr(32),$str);
  $str=str_replace(" ",chr(9),$str);
  //$str=str_replace("&#160;&#160;&#160;&#160;",chr(9),$str);
  $str=str_replace("'",chr(39),$str);
//   $str=str_replace("&",chr(34),$str);
  $str=str_replace("<br />",chr(13),$str);
  $str=str_replace("'","'",$str);
  return $str;
}
//编码
function htmlencode($str){
  if(empty($str)) return;
  if($str=="") return $str;
  $str=trim($str);
  $str=str_replace("&","&amp;",$str);
  $str=str_replace(">",">",$str);
  $str=str_replace("<","<",$str);
  $str=str_replace(chr(32)," ",$str);
  $str=str_replace(chr(9)," ",$str);
  //$str=str_replace(chr(9),"&#160;&#160;&#160;&#160;",$str);
//   $str=str_replace(chr(34),"&",$str);
  $str=str_replace(chr(39),"'",$str);
  $str=str_replace(chr(13),"<br />",$str);
  $str=str_replace("'","'",$str);
  $str=str_replace("select","sel&#101;ct",$str);
  $str=str_replace("join","jo&#105;n",$str);
  $str=str_replace("union","un&#105;on",$str);
  $str=str_replace("where","wh&#101;re",$str);
  $str=str_replace("insert","ins&#101;rt",$str);
  $str=str_replace("delete","del&#101;te",$str);
  $str=str_replace("update","up&#100;ate",$str);
  $str=str_replace("like","lik&#101;",$str);
  $str=str_replace("drop","dro&#112;",$str);
  $str=str_replace("create","cr&#101;ate",$str);
  $str=str_replace("modify","mod&#105;fy",$str);
  $str=str_replace("rename","ren&#097;me",$str);
  $str=str_replace("alter","alt&#101;r",$str);
  $str=str_replace("cast","ca&#115;",$str);
  return $str;
}
```
