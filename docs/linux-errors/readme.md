<!-- Date: 2017-03-15 07:34 -->

# linux 使用中遇到的问题

#### 首次使用 CentOS6.3 版本 32 位安装系统的时候，提示 “The hardware is not suppered...” ，（提示： 硬件不支持）

换用 CentOS 6.5 版本 64 位安装成功

#### CentOS 安装费成功后，ifconfig 中只有本地回环的 IP 地址

1、ifconfig -a 查看所有的网卡信息
2、ifup eth0 启用这个网卡

#### 第一次使用 locate 命令 的时候，提示 command not fouond

可以使用
yum install mlocate // 安装 mlocate 包

#### 卸载光盘挂载点的时候出现 Device was busy

要检查系统当前目录是不是在光盘挂载点，吧当前目录改为非光盘挂载点即可

#### 编辑一个文件的时候，系统忽然出现问题，重启之后，重新编辑这个文件的时候，提示 delete the swap file

这个时候要删除之前编辑的时候，保存的 swap 临时文件

使用 ls -a 就可以显示目录下所有的文件(包含所有文件)

然后使用 rm-rf 删除要编辑文件的 swap 文件即可

#### 使用 fdisk 创建 MBR 分区的时候提示 `Partition 1 does not end on cylinder boundary`.

这是因为当前显示单位为字节，手动输入分区大小的时候，没有对准扇区导致的，只需要使用切换单位命令 `u` 即可
