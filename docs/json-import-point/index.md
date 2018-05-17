# js Error: Unexpected token i in JSON

报错内容： `Unexpected token i in JSON`
这种错误出现在 get 方式获取 JSON 的时候，一定要注意 JSON 的标准格式：

1.  key 值必须是字符串
2.  每一个[]内的最后一个对象后面不能有`逗号`
3.  key 和 value 必须使用双引号(单引号是不可以的)
