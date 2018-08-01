<!-- Date: 2017-06-05 00:30:58 -->

# algorithm 基础算法之归并排序

今天记录一下数组排序的另一种方法： 归并排序

## 算法思路

归并排序的思路与前面的[希尔排序](/home/article/2017120418165918)有相似之处， 同样是把数组拆分为多个子数组，

希尔排序通过改变增量值拆分数组，归并排序则是通过更加细化的拆分加合并来实现数组的排序

## 算法实现

```js
function mergeSort(array) {  //采用自上而下的递归方法
    var length = array.length;
    if (length < 2) {
        return array;
    }
    var m = (length >> 1),
        left = array.slice(0, m),
        right = array.slice(m); //拆分为两个子数组
    return merge(mergeSort(left), mergeSort(right));//子数组继续递归拆分,然后再合并
}
function merge(left, right) { //合并两个子数组
    var result = [];
    while (left.length && right.length) {
        var item = left[0] <= right[0] ? left.shift() : right.shift();//注意:判断的条件是小于或等于,如果只是小于,那么排序将不稳定.
        result.push(item);
    }
```

## 算法分析

以[6, 1, 4, 3, 0]为例的内存变化如下：

```
第一次拆分数组
[6,1]
 拆分数组
  [6] length<2 return [6]
  [1] length<2 return [1]
 合并元素
  return [1,6]

[4,3,0]
 拆分数组
  [4] length<2 return [4]
  [3,0]
   拆分数组
    [3] length<2 return [3]
    [0] length<2 return [0]
   合并元素：
    return [0,3]
  合并元素：
   return [0,3,4]

合并元素：
 return [0,1,3,4,6]
```

其中合并元素的过程如下：

```
var left= [4], right = [0,3]
var tpl = [];
4>0
[0,3].splice(0,1)
tpl.push(0)    //  left = [4], right = [3], tpl = [0]

4>3
[3].splice(0,1)
tpl.push(3)    //  left = [4], right = [], tpl = [0,3]

return tpl.concat(left.length ? left : right) // [0,3,4]
```

## 算法分析

1.  由于归并排序是自左而右的合并数组，不会打乱相同元素的相对位置，因此归并排序属于相对稳定的排序方式。

2.  由于它递归分组的方法，可能会导致大量的内存消耗，占用大量的内存空间
