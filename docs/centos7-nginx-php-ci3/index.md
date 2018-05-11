# centOS7 中布置 nginx+php+ci3

## 更改 centOS 防火墙设置

(这一步可以跳过，自己玩的时候完全可以关闭防火墙，然后使用阿里云的安全组来配置访问规则)

我是用虚拟机新安装的 CentOS7 版本，并且清除了所有的默认防火墙规则，重新打开需要使用的 22，80，8888 端口

新建 bash 文件/opt/bash/firewall.sh

```
# clear all rules
iptables -F
iptables -X
iptables -Z

#set policy rules
iptables -P INPUT DROP
iptables -P OUTPUT ACCEPT
iptables -P FORWARD ACCEPT

#custom rules
iptables -A INPUT -i lo -j ACCEPT
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
iptables -A INPUT -p tcp --dport 8888 -j ACCEPT
iptables -A INPUT -p tcp -j REJECT

#保存到配置文件
/sbin/iptables-save > /etc/sysconfig/iptables

#重载配置文件
/sbin/iptables-restore < /etc/sysconfig/iptables
```

执行文件

```
/opt/bash/firewall.sh
```

> **这里要注意**：`lo`网卡是本机的`loop`网卡，千万要设置成`ACCEPT`，否则 nginx 就不能通过`127.0.0.1`访问到`php-fpm`

## 安装 nginx

```
rpm -ivh http://nginx.org/packages/centos/7/noarch/RPMS/nginx-release-centos-7-0.el7.ngx.noarch.rpm
yum info nginx
yum install nginx
```

## 安装 php7

添加 yum 源

```
rpm -Uvh https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
rpm -Uvh https://mirror.webtatic.com/yum/el7/webtatic-release.rpm
```

这一步有的同学可能会在安装第二个包的时候出现无反应的情况，我在安装的时候第二个 rpm 包不不能使用 https 访问，网址改成 http 即可安装完成后，yum 的仓库文件夹内会多出一个`/etc/yum.repo.d/webstatic.repo`文件，这个文件里面默认用的也是 https 的地址，打开文件把里面的`https`全部改成`http`即可

完成后使用`yum makecache`更新一次 yum 的缓存，就可以找到 php7 的相关包了

查看 yum 源中所有和 php7 有关的包

```
yum info php70*
```

安装主要的包

```
yum install php70w
```

主包会依赖`php-common`和`php-cli`两个依赖，所以这个时候就可以在控制台查看 PHP 的版本号了

```
php -v

PHP 7.0.24 (cli) (built: Sep 30 2017 10:10:28) ( NTS )
Copyright (c) 1997-2017 The PHP Group
Zend Engine v3.0.0, Copyright (c) 1998-2017 Zend Technologie
```

当然了 php-fpm 是肯定要安装的

```
yum install php70w-fpm
php-fpm -v
PHP 7.0.24 (fpm-fcgi) (built: Sep 30 2017 10:12:24)
Copyright (c) 1997-2017 The PHP Group
Zend Engine v3.0.0, Copyright (c) 1998-2017 Zend Technologies
```

安装 php7 相关的扩展包,我这里把所有可安装的都装上去了

```
yum install php70w-*
```

如果碰到提示冲突的，比如 mysql 和 mysqlnd 两个包就会冲突，使用提醒的方式跳过冲突即可

yum 方式安装的扩展包，不需要在 php.ini 中手动引入了，因为他在安装的过程中会自动把这些扩展包放进 php 的扩展目录中

## 修改 php-fpm 配置文件

通常网站文件不会使用 root 用户上传，这就需要执行 php-fpm 现成的用户，要对网站文件有相应的读取权限，因此我们要把 php-fpm 线程的执行用户改为允许网站管理员，假设我们的网站文件权限如下：

```
-rw-r--r--  liyun admin
```

我们就需要如下设置：

```
cd /etc/php-fpm.d/
vi www.conf

user = liyun
group = admin
```

这里一定要注意不要改错了，因为下面还有一个`listen.user`和`listen.group`

## 启动 php-fpm

```
php-fpm
```

查看 fpm 使用的端口

```
netstat -ntlp

Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      1214/nginx: master  
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      879/sshd
tcp        0      0 0.0.0.0:8888            0.0.0.0:*               LISTEN      1214/nginx: master  
tcp        0      0 127.0.0.1:25            0.0.0.0:*               LISTEN      1129/master
tcp        0      0 127.0.0.1:9000          0.0.0.0:*               LISTEN      2902/php-fpm: maste
tcp6       0      0 :::22                   :::*                    LISTEN      879/sshd
tcp6       0      0 ::1:25                  :::*                    LISTEN      1129/master  
```

这里可以看到 php-fpm 使用的端口为`9000`，也可以在上一步手动配置 php-fpm 的端口，yum 安装的配置文件默认在`/etc/php-fpm`和`/etc/php-fpm.d/*.conf`

## 配置 nginx 文件

我的 nginx 配置文件在`/et/nginx/conf.d/`中，假设我的博客 api 接口文件放在`/opt/www/blog-api-ci`目录中，以下是 nginx 的配置

```
server {
    listen       8888;
    server_name  localhost;

    #charset koi8-r;
    #access_log  /var/log/nginx/host.access.log  main;

    location / {
      root   /opt/www/blog-api-ci;
      index  index.php;
      if (!-e $request_filename) {
        rewrite ^(.*)$ /index.php$1 last;
        break;
      }
    }

    #error_page  404              /404.html;

    # redirect server error pages to the static page /50x.html
    #
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
      root   /usr/share/nginx/html;
    }


    # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
    #
    location ~ \.php {
        root           /opt/www/blog-api-ci;
        fastcgi_pass   127.0.0.1:9000;
        fastcgi_index  index.php;
        fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
        include        fastcgi_params;
    }
}
```

fastcgi 的端口号要和 php-fpm 的端口号保持一致在浏览器中访问的时候。直接使用`api.codequan.com/user/test`的格式即可，不需要添加`index.php`，否则会导致重定向次数过多的`500`错误.

如果访问不到，可以在 nginx 默认配置文件中找到访问日志和错误日志的文件位置，到日志中找具体问题

同样的，nginx 的线程也需要保证对网站文件的访问权限，这个配置文件在`/etc/nginx/nginx.conf`文件中，只需要在第一行添加一个

```
user liyun admin
```

即可

## 四个重点

* loop 网卡一定要启用
* nginx 的运行用户要和项目创建人保持一致
* php-fpm 的运行用户要和项目创建人保持一致
* nginx 中 php-fpm：fastcg_script 不能设置错误
