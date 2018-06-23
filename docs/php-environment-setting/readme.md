# php 环境布置的问题

## centos6mini 版安装后，80 端口无法访问

在阿里云的环境里面可以直接关闭防火墙，使用阿里运的组策略即可

```
service iptables stop
```

如果想自己单独打开端口可以使用以下方式

```
iptables -I INPUT 1 -i eth0 -p tcp --dport 80 -m state --state NEW,ESTABLISHED -j ACCEPT
service iptables save
service iptables restart
```

## apache 安装后，无法访问 php 文件

方法 1:直接添加 php 对应 type(不推荐)

```
AddType application/x-httpd-php .php
```

方法 2:将.php 文件绑定到 PHP 脚本(官方推荐)

```
AddHandler php7-script .php
```

* "php7-script"中的数字根据 PHP 版本填 5 或 7

## centos6 中找不到 php72 的包

```
rpm -Uvh http://mirror.webtatic.com/yum/el6/latest.rpm
yum info php72*
yum info php72w
```

## centos6 使用 yum 安装 mysql55-server 因依赖`mysql-libs`问题导致不能安装

直接删除掉原有旧版本

```
yum remove mysql-libs
yum install mysql55w-server
```

## 如何给新用户添加 sudo 权限

使用 root 账户打开/etc/sudoers 文件，在`root ALL(ALL) ALL`一行下面添加用户即可

```
用户名 允许访问的地址=(允许替换的用户) 允许使用的命令
liyun   ALL=(ALL) ALL   # 这里就是说允许用户liyun从任何主机使用任何用户的所有命令
```

再看个例子，我们要让用户 liyun 只能通过 192.168.3.4 访问 root 用户传递 **启动 nginx** 命令

```
liyun 192.168.3.4=(root) /usr/sbin/nginx
```

现在用户 liyun 可以通过 `sudo nginx`命令，并且输入自己的密码后，来启动服务器了

sudo 命令在输入密码后，5 分钟内不需要重新输入密码，可以使用下面语句来让用户无需输入密码即可使用

```
liyun 192.168.3.4=(root) NOPASSWD:/bin/sbin/nginx
```

现在用户通过 `sudo` 只能使用 `root` 用户身份来运行 `nginx` 服务了

更多的信息可以看[鸟叔的私房菜-Linux 账号管理](http://cn.linux.vbird.org/linux_basic/0410accountmanager_4.php)

## 指定运行 nginx 线程的用户

`nginx` 默认安装后运行工作线程的用户一般是 nobody 或者 `nginx` 用户，可以通过修改配置文件来修改运行工作线程的用户。假设我们创建了一个 `staff` 的用户组，且在 `staff` 中添加了一个 `liyun` 用户

```
vi /etc/nginx/nginx.conf
#设置为
user liyun staff;
```

如果你的用户名和用户组不一样，一定要把用户组明确写出来，否则在启动 `nginx` 的时候会打印`[emerg] getgrnam("liyun") failed`

## rpm 的默认安装路径

| dir                 | name                               |
| ------------------- | ---------------------------------- |
| /etc                | 一些设置文件的存放目录             |
| /usr/bin            | 一些可执行文件的存放目录           |
| /usr/lib /usr/lib64 | 一些程序使用的动态函数库           |
| /usr/share/doc      | 一些基本的软件  使用手册与帮助文档 |
| /usr/share/man      | 一些 man page 文件                 |

## 如何重新初始化 mysql 数据库

```
cd /var/lib/mysql
rm -rf *
mysql_initiall_db
service mysqld restart
```

然后重新设置密码即可

## 给用户分配数据库权限

假设我们有一个 sspanel 数据库，和一个 liyun@%的用户最简单直接的做法是

```
grant all privileges on sspanel.* to 'liyun'@'%'
```

命令格式为`允许 操作 on 表名 to 用户@访问主机`

* table\* 表示指定数据库下的所有表具体的使用方式可以参考[mysql 的 grant 命令](https://www.cnblogs.com/hcbin/archive/2010/04/23/1718379.html)

# apache 同时监听多个端口

在 httpd.conf 中，添加多个 listen

```
listen 8080
listen 8081
```

如果想知道端口是否打开，`MAC` 可以通过`网络实用工具`的**端口扫描**功能扫描一次

## MAC 安装 phpmyadmin

安装的时候，看了一下 brew 库的 phpmyadmin 默认版本是 4.x 所以就直接安装这个了

```
brew install phpmyadmin
```

安装好后，他的文件目录是在`/usr/local/Cellar/phpmyadmin/4.7.8/share/phpmyadmin`下，在 apache 的`http-vhost.conf`文件中添加对应的配置即可。
