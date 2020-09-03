<!-- Date: 2016-09-12 17:34 -->

# php 删除目录以及里面的文件代码片段

```php
// 删除目录及里面的文件
function deleteDir($path){
    if(is_dir($path)){
     if($op = opendir($path)){
      while($file = readdir($op)){
       if(!is_dir($file)){
        unlink($path.'/'.$file);
       }
       if(is_dir($file) && $file != '.' && $file != '..'){
        deleteDir($path.'/'.$file);
       }

      }
      closedir($op);
     }
    rmdir($path);
    }
}
```
