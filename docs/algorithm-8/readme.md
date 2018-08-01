<!-- Date: 2017-06-05 10:51:04 -->

# algorithm 基础算法之快速排序

今天来说一下快速排序法；

## 算法思路

在数组中任意取一个元素为参照值，将数组拆分成两个子数组，小于参照值的一组，大于等于参照值的一组，运用递归的方法重复这一步骤，直到数组内只有一个元素为止；

## 代码实现

这个算法不是太容易理解，实现方法如下：

```js
function quick(array) {
  if (array.length <= 1) {
    return array;
  }
  var tmp = array[0];
  var len = array.length;
  var arr1 = [],
    arr2 = [];
  for (var j = 1; j <= len - 1; j++) {
    if (array[j] < tmp) {
      arr1.push(array[j]);
    }
    if (array[j] >= tmp) {
      arr2.push(array[j]);
    }
  }
  return quick(arr1)
    .concat([tmp])
    .concat(quick(arr2));
}
function sort(array) {
  console.log(quick(array));
}
```

## 内存模拟

下面我们来模拟内存的运行状态，对[7,5,8,3]进行排序

```
打开新栈： quick([7,5,8,3])
    参照值 7
    arr1 [5，3]
    arr2 [8]
    retrun quick([5，3]).concat([7]).concat(quick([8]))

        打开新的栈：quick([5，3])
            参照值 5
            arr1 [3]
            arr2 []
            return  quick([3]).concat([5]).concat(quick([]))

                打开新的栈：quick([3])
                    元素数量小于等于1，返回数组本身    return [3]

            关闭栈   返回排序后的内容： [3,5]

        打开新的栈： quick([8])  
            元素数量小于等于1，返回数组本身 return [8]
            关闭栈  返回 [8]
        回到上一个栈
        实际运算的是[3,5].concat([7]).concat([8])

    关闭栈： 返回 [3,5,7,8]
```

篇幅原因，我只是列举了四个元素的排序，大家可以尝试增加元素来模拟内存里面的运行，算法这些东西，只有自己亲自走一遍，才能更快速的理解。
