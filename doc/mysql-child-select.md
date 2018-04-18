# 包含子查询的查询语句该如何去写

> 包含子查询的语句，一定要区分外层查询的目的和内层查询的目的，才能在后续的审查过程中一目了然。

## 数据表

t_user 表

| usid | name | age |
| ---- | ---- | --- |
| u1   | 张三 | 12  |
| u2   | 李四 | 13  |
| u3   | 王五 | 16  |

t_map 表

| aid(文章 id) | label(标签) |
| ------------ | ----------- |
| 1            | a           |
| 2            | b           |
| 3            | c           |
| 4            | a           |

t_article 表

| id  | usid | title            | state(1 未删除 2 已删除) |
| --- | ---- | ---------------- | ------------------------ |
| 1   | u1   | 钢铁是怎么炼成的 | 1                        |
| 2   | u1   | 春雨惊春         | 2                        |
| 3   | u2   | 西游记           | 1                        |
| 4   | u3   | 鲁宾逊漂流记     | 1                        |

## 目的

查询出所有文章未删除，且文章标签不为`c`的文章，要显示的字段有：发布人、文章标题、文章标签分析 -
很明显，要完成这个目的，必须是联表查询的方式，而且是三个表都要用到。我们需要先查询出所有符合条件的文章 id，再来查询出需要返回给前端的信息；

我们先来完成第一个任务

```
select id
from t_article as t1, t_map as t2
where t1.state=1
and t1.id=t2.aid
and t2.label!='c'
```

查询结束，我们可以得到

| id  | 占位符 |
| --- | ------ |
| 1   | 占位符 |
| 4   | 占位符 |

再来完成第二个任务：

```
select t3.name, t1.title, t2.label
from t_article as t1, t_map as t2, t_user as t3
where t1.id in (
    select id
    from t_article as t1, t_map as t2
    where t1.state=1
    and t1.id=t2.id
    and t2.label!='c'
)
and t1.id=t2.aid
and t1.usid=t3.usid
```

这时候，我们就可以获取想要的结果

| name | title            | label |
| ---- | ---------------- | ----- |
| 张三 | 钢铁是怎么炼成的 | a     |
| 王五 | 漂流             | a     |
