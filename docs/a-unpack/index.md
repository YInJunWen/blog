# 待整理内容

## mac 中安装/使用 mysql

brew 安装的软件默认保存在/usr/local/Cellar 中,安装后的可执行脚本可以在/usr/local/opt 中找到

安装

```
brew install mysql@5.6
```

启动 mysql 服务：

```
/usr/local/opt/mysql@5.6/bin/mysql.server {start|stop|restart|reload|force-reload|status}
```

进入 mysql 控制台:

```
/usr/local/opt/mysql@5.6/bin/mysql -u root
```

首次安装后，root 用户是没有密码的,修改 mysqlroot 密码：

```
/usr/local/opt/mysql@5.6/bin/mysql -u root
use mysql;
update user set password=password('12346') where user='root';
flush privileges;
```

修改后进入控制台的方式为：

```
/usr/local/opt/mysql@5.6/bin/mysql -u root -p
```

mysql 连接其他服务器的数据库:

```
/usr/local/opt/mysql@5.6/bin/mysql -h 数据库IP -u 用户名 -p
```

## 打开 apache 的 rewrite 模块

第一步：开启 rewrite 模块

在 httpd.conf 文件中找到：`#LoadModule rewrite_module modules/mod_rewrite`，

第二步：打开项目的 rewrite 规则

以虚拟主机为例,把 `AllowOverride None`改为`AllowOverride All`

第三步：添加规则

将一下内容写进 httpd.conf 文件中，或者在目录下新建一个.htaccess 文件

```
<IfModule mod_rewrite.c>
  Options +FollowSymlinks
  RewriteEngine On
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteRule ^(.*)$ index.php/$1 [QSA,PT,L]
</IfModule>
```

## apache 修改 php 版本后不能解读 php 文件

在 httpd.conf 文件中添加一行

```
AddType application/x-httpd-php .php
```

## mac 中安装修改 php 版本

最新的 mac 自带的 PHP 版本为 7.1，这里切换到 5.6 版本

安装 php5.6 版本`brew install php@5.6`

按照安装后的提示，在 httpd.conf 文件中如下修改：

注释掉`LoadModule php7_module libexec/apache2/libphp7.so`

新增`LoadModule php5_module /usr/local/opt/php@5.6/lib/httpd/modules/libphp5.so`

添加对 php 文件的解析`AddType application/x-httpd-php .php`

## Unicode 码与 ASCII 码

unicode 编码是从 ascii 码为基础扩展出来的

一个 ascii 码占用 8 个二进制字节

ascii 码一共有 127 个。

其中第 0 ～ 32 号及第 127 号(共 34 个)是控制字符或通讯专用字符，如控制符：LF（换行）、CR（回车）、FF（换页）、DEL（删除）、BEL（振铃）等；通讯专用字符：SOH（文头）、EOT（文尾）、ACK（确认）等；

第 33 ～ 126 号(共 94 个)是字符，

第 48 ～ 57 号为 0 ～ 9 十个阿拉伯数字；

65 ～ 90 号为 26 个大写英文字母，

97 ～ 122 号为 26 个小写英文字母

```js
const a = "a";
const b = a.charCodeAt(0); // 97  字符a在ascii码中的位置，十进制表示
b.toString(2); // 转成二进制：1100001, 由于不足8位，在前面补上0， 所以最终结果是01100001,
```

其余为一些标点符号、运算符号等

Unicode 一般使用 **16 进制**表示字符的码位

Unicode 码一共分为 17 组，也可以叫做“17 个字符平面”

17 组平面序号从 00 开始，到 10 结束

每一个平面从 0001 开始，到 FFFF 结束，一共有 65536 个码位，也就是说第一个平面的码位是从 000000~00FFFF(在码位前面加上平面的序号)

在 Unicode5.0.0 版本中，实际上只使用了 0，1，2，14 等 4 个平面上的码位，

其中平面 2 的 43253 个字符都是汉字。平面 0 上定义了 27973 个汉字，常见的汉字被定义在第 0 平面的 004E00-009FA5 之间

由于计算机只能识别 0 和 1，所以我们需要把字符的 Unicode 码转换成计算机能识别的二进制码，转换二进制码的方式分为 UTF-8,UTF-16,UTF-32 等，我们最常见以及最常用到的就是 UTF-8 模式

UTF-8 的转换对照表：

| Unicode 编码(十六进制)　 | UTF-8 字节流(二进制)                |
| ------------------------ | ----------------------------------- |
| 000000-00007F            | 0xxxxxxx                            |
| 000080-0007FF            | 110xxxxx 10xxxxxx                   |
| 000800-00FFFF            | 1110xxxx 10xxxxxx 10xxxxxx          |
| 010000-10FFFF            | 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx |

从表中可看出 UTF-8 的方便之处在于 **对不同范围的字符使用不同长度的编码**。对于 0x00-0x7F (这里实际上是 0x0000-0x007F,前面的 0 可以省略)之间的字符，UTF-8 编码与 ASCII 编码完全相同。

以中文“汉”为例：

```js
let a = '汉'；
let b = a.charCodeAt(0); // 获取汉字的Unicode码: 6c49
let c = b.toString(2); // 把上一步的16进制，转为二进制 ： 110110001001001

//  由于6c49在 000800-00FFFF之间，所以要使用3个字节的模板，把模板中的 x 补全，不够的用0代替
// 1110xxxx 10xxxxxx 10xxxxxx
//      110   110001   001001
// 11100110 10110001 10001001   这是补全后的结果，可以直接被计算机识别了
```

不要问前面为什么会有一些 1、0，模板! 模板的意思就是一套规则，一种符合 UTF-8 规则的协议，所以没有为什么！

所以网上很多类似于“一个汉字占几个字符的问题”，由于汉字大多数都在 004E00-009FA5 之间，所以需要使用 3 个字符的模板，也就是说，如果 **用 UTF-8 格式**保存的话，一个汉字占用 3 个字符，UTF-16 和 UTF-32 格式保存的话结果是不同的。
