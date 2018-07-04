# algorithm 基础算法之冒泡排序

冒泡排序是最直接的排序方式

## 算法思路

我们以从小到大排序为例：

从数组的第一个元素开始，比较**相邻**两个元素的大小，如果后一个元素小于前一个元素，就把这两个元素互换位置。

因此我们需要两次遍历，外层遍历的次数为数组的长度-1。

第一次遍历后，我们可以保证数组的最后两个元素大小关系已经确认，因此第二次遍历的时候，只需要对比到倒数第二和倒数第三个元素即可，所以内层遍历次数应该是(数组长度-外层遍历次数)

## 下面我们来用代码实现这个思路：

```js
function swap(i, j, array) {
  var temp = array[j];
  array[j] = array[i];
  array[i] = temp;
}

function sort(array) {
  var length = array.length,
    skip;
  for (var i = 1; i <= length; i++) {
    //正序
    skip = false;
    for (var j = 0; j < length - i; j++) {
      //正序
      array[j] > array[j + 1] && (skip = true) && swap(j, j + 1, array);
    }
    if (!skip) break;
  }
  return array;
}
```

按照上面的实现思路，上面代码大部分是没有问题的，唯独多出了一个变量`skip`，这个变量是干什么的？

假如外层没有便利到最后一次的时候，内层遍历过程中，所遍历的元素已经满足从小到大的排序，这个时候就不需要继续外层遍历了，直接使用 break 打断外层循环即可。

所以我们添加的这个 skip 变量，是为了防止外层执行多余的遍历。

当然了，我这里的内外层都是通过正序来循环的，大家也可以通过倒叙，甚至是正序、倒叙结合的形式来遍历，这里不再举例