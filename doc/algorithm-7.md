# 基础算法之 直接插入排序

> 看了一些直接插入排序的文章，写的言简意赅，有人喜欢弄一个 gif 图出来，结果看的更加迷糊了，这里按照自己的语言总结一下，希望能帮助到同学们

## 算法思路

从数组的第二个元素开始，把该元素拿出来作为参照值，按照从右至左的顺序，依次与他左边的元素进行对比，

如果目标元素比参照值大，就把目标元素向右移动一位。当目标元素小于等于参照值的时候，就停止循环，并把参照值插入到目标元素的后面

按照这个逻辑进行的排序就叫做"直接插入排序"

代码如下：

```js
function directInsertionSort(array) {
  var length = array.length,
    index,
    current;
  for (var i = 1; i < length; i++) {
    index = i - 1; //待比较元素的下标
    current = array[i]; //当前元素
    while (index >= 0 && array[index] > current) {
      //前置条件之一:待比较元素比当前元素大
      array[index + 1] = array[index]; //将待比较元素后移一位
      index--; //游标前移一位
      console.log(array);
    }
    if (index + 1 != i) {
      //避免同一个元素赋值给自身，当待比较元素正好比前面所有元素都大的时候，会出现这种情况，这个时候就不需要再插入到自己本来的位置了
      array[index + 1] = current; //将当前元素插入预留空位
      console.log(array);
    }
  }
  return array;
}
```

我们以案例来模拟一下内存的运行：

```
要排序的数组 ：[5，8，7，2，1]

i = 1
参照值 = 8
index = 0
不满足5>8的条件，直接关闭循环
结果： 5,8,7,2,1

i = 2
参照值 = 7
index = 1
目标元素 = 8
结果：5,8,8,2,1    //  这一步看懂了吗？ 把目标元素向后移动一位，实际上就是把他的值赋值到他的后一位上
index = 0
目标元素= 5
0>=0 但是 5<8
关闭循环，把参照值 7 插入到目标元素的后一位
结果：5,7,8,2,1

i = 3
参照值 = 2
index = 2
目标元素= 8
满足2>=0 && 8>2
结果： 5,7,8,8,1
index = 1
目标元素 = 7
满足1>=0 && 7>2
结果： 5,7,7,8,1
index = 0
目标元素 = 5
满足0>=0 && 5>2
结果： 5,5,7,8,1
循环结束，把参照值 2 插入到目标元素的后一位
结果： 2，5，7，8，1

i = 4
参照值 = 1
index = 3
目标元素 = 8
满足3>=0 && 8>1
结果： 2,5,7,8,8
index = 2
目标元素 = 7
满足2>=0 && 7>1
结果： 2,5,7,7,8
index = 1
目标元素 = 5
满足3>=0 && 8>1
结果： 2,5,5,7,8
index = 0
目标元素 = 2
满足0>=0 && 2>1
结果： 2,2,5,7,8
循环结束，把参照值 1 插入到目标元素的后一位
结果： 1，2，5，7，8
```

发现了没，所谓的“直接插入排序”只是一个叫法而已，我们前端开发中所说的插入一般都是 append，产生了一个新的元素出来，在这里的算法中，“插入”实际上就是一个复制，或者叫赋值操作。这下就不用纠结了。

从这时按照从小到大的排序，也可以按照从大到小的排序，这里不再详述