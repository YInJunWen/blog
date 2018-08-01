<!-- Date: 2017-10-05 12:17:11 -->

# mac 中的 apache+php(多版本)+mysql\@5.6

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

## mac 中打开 apache 的 rewrite 模块

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

## mac 中 apache 修改 php 版本后不能解读 php 文件

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
