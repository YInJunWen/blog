<!-- Date: 2017-03-31 02:49:56 -->

# mysql 数据库的导入

MySQL 数据库的导入,有两种方法：

## 通过 mysql 控制台导入

假设我们要导入的 sql 文件位置为`/opt/blog.sql`,要导入的数据库名为 blog，操作如下

```
create database blog;
use blog;
source /opt/blog.sql;
```

## 通过 phpmyadmin 导入

phpmyadmin 提供了数据库导入选项，直接在选项卡点击”数据库导入“，选择要导入的 sql 文件即可

## 直接复制到数据库文件中如果数据库比较大，可以考虑直接拷贝文件到数据库的文件存放路径中

假设我的数据库文件路径为`/var/lib/mysql/mydb/`,MySQL 文件为`/opt/blog.sql`

```
cp /opt/blog.sql /var/lib/mysql/mydb/blog.sql
chown mysql:mysql /var/lib/mysql/mydb/blog.sql
chmod 660 /var/lib/mysql/mydb/*
```

注意：

* 直接复制数据库的方法，不同操作系统之间可能会出现问题，一定要慎重
* 复制后不要忘记修改文件的所有人和组以及访问权限
