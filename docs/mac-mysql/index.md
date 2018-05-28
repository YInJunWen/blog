# mac 中安装使用 mysql

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
