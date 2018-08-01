<!-- Date: 2018-01-26 09:47:52 -->

# php 链接 mysql

### 连接数据库

连接数据库有两种方式；方式一：

```php
    $mysqli = new Mysqli();
    $mysqli->connect('host','root',');
```

方式二：

```php
    $mysqli = new Mysqli('localhost','root',',);
```

这两种方式可以直接在后面添加要连接的数据库名字，也可以单独添加。

### 选择数据库

```php
    $mysqli->select_db('database);
```

---

### 数据库连接失败发生的错误

````
```php
    mysqli_connect_errno()
    mysqli_connect_error()

上面一句返回连接数据库发生错误的代码，下面一句返回连接数据库发生错误的内容，他们也有对应的面向对象方法：
````

```php
    $mysqli->connect_errno;
    $mysqli->connect_error;
```

但是不推荐使用，因为当数据库链接失败，他们返回的那个资源句柄实际上是错误的，因此在检查数据库连接失败的时候，不要用面向对象的方法；

---

### 数据库操作发生的错误

```php
    $mysqli->errno; //返回错误代码
    $mysqli->errno; //返回错误内容
```

这里指的是数据库操作时发生的错误，而不是连接时发生错误，两者一定要区分开。

---

### 设置查询编码

```php
    $mysqli->set_charset('utf-8);
```

---

### 从结果集中获取一行数据

方式一：获取一个关联数组

```php
    $row = $result->fetch_assoc();
```

方式二：获取一个数值(索引)数组

```php
    $row = $result->fetch_row();
```

方式三： 获取一个关联数组或一个数值(索引)数组，或者两个同时获取

```php
    $row = $result->fetch_array(&MYSQLI_NUM&);      //获取一个数值(索引)数组
    $row = $result->fetch_array(&MYSQLI_ASSOC&);    //获取一个关联数组
    $row = $result->fetch_array(&BOTH&);            //两个类型数组都获取
```

但是 PHP5 以后启用了一种新的用面向对象的方法管理数据的方式：

```php
    $row = $result->fetch_object();
```

这意味着你可以用面向对象的方式去读取数据，比如：

```php
    echo $row->username;
```

| 语句                     | 作用                                                                              |
| ------------------------ | --------------------------------------------------------------------------------- |
| $mysqli->affected_rows;  | 数据库操作影响了多少行数，这个方法一定和获取了多少条数据的方法区分开来。          |
| $result->num_rows;       | 查询取出了多少条数据                                                              |
| $result->field_count;    | 查询取出的数据有多少条字段                                                        |
| $result->fetch_field();  | 查询取出的数据的字段，一次取回一个字段的属性，可以使用 while 循环，来取出所有字段 |
| $result->fetch_fields(); | 查询取出的数据的所有字段，可以通过 foreach 来循环输出                             |
| $result->data_seek();    | 移动数据指针，便于直接输出指针所在行的内容                                        |
| $result->field_seek();   | 移动字段指针，便于直接输出这个指针所在字段的内容                                  |

### 数据库操作影响了多少行数据

```php
    echo $mysqli->affected_rows;
```

这个方法一定和获取了多少条数据的方法区分开来。

### 查询取出了多少条数据

```php
    echo $result->num_rows;
```

### 查询取出的数据有多少条字段

````php
    echo $result->field_count;


### 逐条查询取出的字段

```php
    while($row = $result->fetch_field()){
        printr($row) ;
        //  或者
        echo $row->tg_user;
    };
````

### 查询所有取出的字段

```php
    $row = $result->fetch_fields();
    foreach($row as $key=>$value){
        printr($value);
        //  或者
        echo $value->tg_user;
    }
```

### 移动结果集指针

```php
    $result = $mysqli->query();
    $result->data_seek(0);
    $row = $result->fetch_row();
```

### 移动字段指针

```php
    $result = $mysqli->query();
    $result->field_seek(0);
    $field = $result->fetch_field();
    $row = $result->
```

### 执行语句相关

| 语句                       | 作用               |
| -------------------------- | ------------------ |
| $mysqli->query($sql)       | 执行一条语句       |
| $mysqli->multi_query($sql) | 一次性执行多条语句 |
| $mysqli->autocommit(false) | 关闭自动提交       |
| $mysqli->commit()          | 手动提交           |
| $mysqli->autocommit(true)  | 打开自动提交       |
