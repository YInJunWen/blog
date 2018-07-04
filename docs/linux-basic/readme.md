# linux 基础

## 命令格式

* 个别命令使用不遵循这个格式
* 命令 [选项][参数]
* 当有多个选项的时候可以写在一起
* 简化选项与完整选项： -a 等于 --all
* 查询目录中内内容 LSls [选项][参数]

## ls -a

## Linux 的文件类型

例子： -rw-r--r--
linux 是没有扩展文件类型后缀的
linux 文件类型只有 7 种

* 如果第一位是 `-` ： 代表是一个普通文件
* 如果第一位是 `d` : 代表是一个目录
* 如果第一位是 `|` ： 代表是一个软连接文件（快捷方式）
* 第一位如果是 **其他字符** 是 linux 特殊文件，不常用

* 2-10 位字符每 3 个分为一组，主要功能是分配权限，包含了对（所有者，所属组，其他人）的权限分配
* r 读，w 写，x 执行最后一个 . 暂且先不管
* 1 代表文件的 引用计数第一个 root 标示文件的所属人（文件的主人）第二个 root 标示文件的所属组 （文件主人在的用户组）
* ls -h 标示用人类可以理解的方式显示文件的大小文件的最后修改时间文件名

## 以 . 开头的文件是什么

这些文件都是 Linux 的隐藏文件，防止用户误操作

## Linux 常用目录

```
/boot/    保存的是系统启动文件 ，这个是被单独分区的文件
/dev/     保存的都是硬件的文件，不能动
/etc/     保存的是系统默认的配置文件，配置服务的时候，会用到这个目录
/home/    普通用户的家目录
/root/    超级用户的家目录
/lib/     Linux系统的函数库
/misc/    外接磁带机的挂载点，老式的linux中是没有这个的，不推荐使用
/media/   光盘的挂载点，老式的linux中是没有这个的，不推荐使用
/mnt/     移动U盘之类的挂载点
/proc/    系统内存的挂载点，不能直接操作
/sys/     系统内存的挂载点，不能直接操作
/tmp/     临时文件目录
/usr/     系统资源保存目录
/var/     保存系统的可变文档目录
```

## 软连接和硬链接的区别是什么？

硬链接的特点：

* 拥有相同的 I 节点和存储 block 块，可以看做是同一个文件
* 可以通过 i 节点识别
* 不能跨分区
* 不能针对目录使用

软连接的特点：

* 拥有自己的 i 节点和存储 block 块，但是数据块中只保存源文件的文件名和 i 节点号，并没有实际的文件数据
* lrwxrwxrex 软连接的标示符为 l
* 修改任意文件另一个都会改变
* 删除源文件，软连接不能使用
* 如果源文件被删除，软连接文件后面的源文件位置提示会报错
* 创建软连接的时候，源文件一定要写 绝对路径

---------------------------------------------------------搜索命令-------------------------------------------------

## locate 命令中的搜索规则是什么意思？ 搜索规则在 /ect/updatedb.config 中

* 第一行代表 是否按照以下规则执行
* 第二行代表 不搜索属于后面文件系统里面的文件
* 第三行代表 不搜索文件名包含后面字符的文件
* 第四行代表 不搜索在后面列表中文件夹中的文件

## whereis which 命令有什么区别

* whereis 命令会输出命令所在的位置 以及命令的帮助文件所在位置
* which 命令会输出命令的别名 以及命令的位置，如果命令是一个简写命令 ，他还会输出完整的命令内容比如：

```
[root@localhost ~]# which lsaliasls='ls --color=auto'
 /bin/ls
```

## Linux 中的通配符

```
*       匹配任意内容
？      匹配任意一个字符
[]      匹配任意一个中括号内的字符
注意： 如果要使用 find 命令进行模糊查询 必须要加引号并且使用通配符
```

## 一些没有所有者的文件是什么意思？

正常来说 没有所有者的文件是 垃圾文件

* 第一种特殊情况： Linux 内核产生的文件 是没有所有者的
* 第二种特殊情况： 外来的文件（比如 windows 系统生成的文件是没有所有者这个定义的）

## 扇区的定义

* 系统中默认一个扇区的大小是 512 个字节，因此在使用命令
  find -size25
* 如果是没有加单位，这里的 25 值得是 25 个扇区的大小 ，也就是 25\*512 个字节的文件大小

## find 和 grep 的区别

* find 在目录中查找文件，如果需要模糊查询，使用的是通配符
* grep 在文件中查找字符串，如果需要模糊查询，使用的是正则表达式

## Linux 里面的帮助命令的区别

```
whereis
whatis
--help    查看命令 的帮助信息
man       查看命令的帮助信息(这个在CentOS6.5之后要自行安装包)
```

## Linux 中的 常见 压缩格式都有那些？

* .zip
* .gz
* .bz2
* .tar.gz
* .tar.bz2

## shutdown 命令后 终端被锁定，不能输入

* 可以在关机命令后 语句后面添加 & 把命令放到后台执行
  shutdown -h 24:00 &
* 要注意的事项：

* 但是在实际使用中，尽可能不要使用 关机 命令 ，要用远程 重启 命令有的服务器提供商提供了远程关机或者重启的功能，但是他们不会保存当前未保存的数据，只有 shutdown 命令可以 - 先保存数据，再进行关机或者重启要慎重的使用关机或者重启命令，如果有大量的访问量，强行重启或者关机命令有很大可能导致计算机系统损毁啊，甚至硬件损毁

## 系统运行级别

* 0 关机
* 1 单用户
* 2 不完全多用户，不含 NFS 服务
* 3 完全多用户
* 4 未分配
* 5 图形界面
* 6 重启

## alias 查看/修改命令的默认选项

```
alias vi='vim'
```

注意： 这里的修改只是临时有效的，服务器重启之后，就恢复原状了，如果想要永久生效，需要在/root/.bashrc 文件中添加这个别名命令

## 命令生效顺序

* 第一顺位执行用绝对路径或相对路径执行的命令
* 第二顺位执行别名
* 第三顺位执行 bash 的内部命令
* 第四顺位执行按照$PATH 环境变量定义的目录查找顺序找到的第一个命令

## 常用命令快捷键

```
ctrl+c  强行终止命令
ctrl+l  清屏
ctrl+a  光标移动到命令行首
ctrl+e  光标移动到命令行尾
ctrl+u  从光标所在的位置删除到行尾
ctrl+z  吧命令放入后台
ctrl+r  在历史命令中搜索
```

## 家目录中的 .bash_history 文件内容与 history 命令 输出的内容不一致：

.bash_history 文件中保存的是上次关机之前保存的命令，而 history 中保存的包括当前开机之后的所有命令记录正常情况下，系统关机的时候，会自动执行 history -w 命令，即把缓存中的历史命令写入.,bash_history 文件注意：历史记录默认只能记录 1000 条记录，如果需要修改要找到/etc/profile 文件，修改 HISTSIZE 值重复执行历史命令

* 使用上下箭头调用之前的历史命令
* 使用 !n 重复执行第 n 条历史命令
* 使用 !! 重复执行上一条命令
* 使用 !字符串 重复执行最后一条以该字符串开头的命令

## 输出重定向要注意的事项：

| 命令                   | 作用                                              |
| ---------------------- | ------------------------------------------------- |
| 命令 > 文件            | 正确覆盖输出： (符号两边有空格)                   |
| 命令 >> 文件           | 正确追加输出： (符号两边有空格)                   |
| 命令 2>文件            | 错误覆盖输出： (符号右边没有空格)                 |
| 命令 2>>文件           | 错误追加输出： (符号右边没有空格)                 |
| 命令 > 文件 2>&1       | 把正确输出和错误输出都覆盖保存 (符号两边有空格)   |
| 命令 >> 文件 2>&1      | 把正确输出和错误输出都追加保存 (符号两边有空格)   |
| 命令 &>文件            | 把正确输出和错误输出都覆盖保存 (符号右边没有空格) |
| 命令 &>>文件           | 把正确输出和错误输出都追加保存 (符号右边没有空格) |
| 命令 >>文件 12>>文件 2 | 把正确输出追加到文件 1,错误输出追加到文件 2       |

## 管道符

分号: 连续执行多个命令

```
[root@liyun ~] # ls; cd /etc/; ls; cd /mnt; ls
```

双 && 符号： 前面的正确执行，才能执行后面的命令分号: 连续执行多个命令

```
[root@liyun ~] # ls && echo yes
```

双 || 符号: 前面的没有正确执行，才能执行后面的命令

```
[root@liyun ~] # ls ddd || echo no
```

用 && 和 || 判断前面的命令执行结果

```
[root@liyun ~] # ls && echo yes || echono
```

单 | 符号：第二个命令去执行第一个命令的输出结果

```
[root@liyun ~] # ls -alh | more
[root@liyun ~] # netstat | grep
```