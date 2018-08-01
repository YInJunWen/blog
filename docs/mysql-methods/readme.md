<!-- Date: 2017-03-05 17:44:38 -->

# mysql 常用命令

## 使用 SHOW 语句找出在服务器上当前存在什么数据库：

```
mysql> SHOW DATABASES;
```

## 创建一个数据库 MYSQLDATA

```
mysql> CREATE DATABASE MYSQLDATA;
```

## 选择你所创建的数据库

```
mysql> USE MYSQLDATA; (按回车键出现 Database changed 时说明操作成功！)
```

## 查看现在的数据库中存在什么表

```
mysql> SHOW TABLES;
```

## 创建一个数据库表

```
mysql> CREATE TABLE MYTABLE (name VARCHAR(20), sex CHAR(1));
```

## 显示表的结构：

```
mysql> DESCRIBE MYTABLE;
```

## 往表中加入记录

```
mysql> insert into MYTABLE values (”hyq”,”M”);
```

## 用文本方式将数据装入数据库表中（例如 D:/mysql.txt）

```
mysql> LOAD DATA LOCAL INFILE “D:/mysql.txt” INTO TABLE MYTABLE;
```

## 导入.sql 文件命令（例如 D:/mysql.sql）

```
mysql>use database;
mysql>source d:/mysql.sql;
```

## 删除表

```
mysql>drop TABLE MYTABLE;
```

## 清空表

```
mysql>delete from MYTABLE;
```

## 更新表中数据

```
mysql>update MYTABLE set sex=”f” where name=’hyq’;
```
