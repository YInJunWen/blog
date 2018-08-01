<!-- Date: 2017-04-12 17:00:40 -->

# node node-buffer

> 由于 JavaScript 自身没有二进制数据类型，所以 Node 定义了一个 Buffer 类，来存放二进制数据的缓存区，它随着 Node 内核一起发布

一句话就是 Buffer 是一种存放二进制数据的工具

## JS 中的二进制

在 Javascript 中如果想把一个数字转成二进制的方法是：

```js
var n = 5;
n.toString(2); //'101'
```

把一个字符串转为二进制的方法

```js
    var str = 'baidu';
    var chr = ''
    for(i in str){
        var uni = str[i].charCodeAt().toString(2); //返回字符的unicode编码，类型是十进制的数字。后面的toString(2)目的是把unicode编码转为二进制
        if(chr == '){
            chr+=uni
        }else{
            chr = chr+' '+uni
        }
    }
```

    console.log(chr) //这里获取的就是字符串的完整的二进制代码了

那么如果想从二进制转成字符串，同样的道理，要先转成十进制的数字(通过 `parseInt('101', 10)`)，再使用 String.fromCharCode()方法转成字符串

## Buffer 的创建

方法有三种

1.指定 buffer 对象的字节长度

```js
var buf = new Buffer(10);
```

2.通过给定的数组创建 buffer 实例

```js
var buf = new Buffer([119, 119]);
```

3.通过字符串创建 buffer 实例

```js
var buf = new Buffer('buffer', 'utf-8');
```

## new Buffer()的打印内容

```js
const a = new Buffer('汉');
console.log(a); // <Buffer e6 b1 89>
```

输出的 e6 b1 89 都是些什么东西？ 下面来看一下他们的转换过程，Unicode相关信息可以[点击这里](../unicode-ascii/index.md)

```js
let b = '汉';
let c = b.charCodeAt(0); // 返回在16进制的unicode码位： 27721
console.log(c);
let d = c.toString(2); // 把16进制码位转成二进制码：110110001001001
console.log(d);
// 1110xxxx 10xxxxxx 10xxxxxx  这个是UTF8格式的模板
// 11100110 10110001 10001001  这个是套用模板后的二进制信息

// 下面把三个字符的二进制码分别用16进制表示
console.log(parseInt('11100110', 2).toString(16)); // e6
console.log(parseInt('10110001', 2).toString(16)); // b1
console.log(parseInt('10001001', 2).toString(16)); // 89
```

utf-8 只是默认的编码方式，buffer 同样支持其他编码，比如：ascii ucs2 base64 hex 等

## new Buffer().write(string[, offset[, length]][, encoding])

write 方法为 buffer 对象写入字符串，返回的是 Buffer 对象的长度参数：

    string      即将写入缓冲区的字符串
    offset      开始写入的字符串的起始位置，默认是0
    length      指定写入的字节长度，默认是Buffer.length
    encoding    写入的字符的编码，默认是utf-8

如果 Buffer 对象提前指定了字节长度，如果写入的内容超过了字节长度，就只会写入部分字符串,比如

```js
var buf = new Buffer(1);
var len = buf.write('zhangsan');
```

    console.log(len)    // 1

## new Buffer().toString(encoding, start, end)

这个方法会读取 Buffer 对象，参数：

    encoding    指定读取使用的编码
    start       指定开始读取的位置，默认是0
    end         指定结束读取的位置，默认是buffer的末尾

## Buffer.concat(bufferArray,length)

这个方法用于合并 buffer 对象,第一个参数是要合并的 buffer 数组，第二个参数指定合并后的总长度

```js
var buffer1 = new Buffer('菜鸟教程 ');
var buffer2 = new Buffer('www.runoob.com');
var buffer3 = Buffer.concat([buffer1, buffer2]);
console.log('buffer3 内容: ' + buffer3.toString());
```

## new Buffer().compare(anotherBuffer)

这个方法用于比较另外一个 Buffer 对象,会返回一个数字，表示"前面的 buffer 对象在后一个 buffer 对象之前，之后，或相同"， 这句话是官方的翻译，在我看来可以这么理解，我们先看几个例子：

```js
var buffer1 = new Buffer('ABC');
var buffer2 = new Buffer('ABCD');
buffer1.compare(buffer2); // -1

var buffer1 = new Buffer('BC');
var buffer2 = new Buffer('ABCD');
buffer1.compare(buffer2); // 1

var buffer1 = new Buffer('ABCD');
var buffer2 = new Buffer('ABCD');
buffer1.compare(buffer2); // 0
```

三个例子看完之后，我们对`Buffer.conpare`就可以用另一种方法来解释：它的计算其实类似于`indexOf`，`buf1.compare(buf2)`,可以把它看做是`buf2.indexOf(buf1)`,这样就好理解他返回的按个数字了

```js
buf2 === buf1; // 0
buf2.indexOf(buf1) < 0; // -1
buf2.indexOf(buf1) > 0; // 1
```
