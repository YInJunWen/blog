<!-- Date: 2017-06-03 14:18 -->

# algorithm 基础算法之折半插入排序

今天来说一下插入排序的另一个升级版“折半插入排序”

一直在思考怎么才能更好的用文字解释这个算法思路，这里尝试一下

## 算法思路

从数组的第`array[i]=x`个元素作为参照元素，与该元素前面所有元素的中间元素`array[m]=y`进行比较，

如果`x>=y`,可以判断 x 的正确位置应该是 `m<[correct]<=array.length-1`之间,

如果`x<y`， 可以判断 x 的正确位置应该是 `0<=[correct]<m` 之间

当然了，按照惯例，我们会从数组的第[1]个元素开始遍历，这就保证了每次遍历中参照元素前面的元素，已经完成了排序操作，

由于我们每次对比的都是多个元素的中间值，这就大大节省了我们的遍历次数和时间

## 代码实现

```js
function sort(array) {
    var current, i, j, low, high, m;
    for (i = 1; i < array.length; i++) {
        low = 0;
        high = i - 1;
        current = array[i];

        while (low <= high) {
            m = (low + high) >> 1;
            if (array[i] >= array[m]) {
                //值相同时, 切换到高半区，保证稳定性
                low = m + 1; //插入点在高半区
            } else {
                high = m - 1; //插入点在低半区
            }
        }
        for (j = i; j > low; j--) {
            //插入位置之后的元素全部后移一位
            array[j] = array[j - 1];
        }
        array[low] = current; //把元素插入正确的位置
    }
    return array;
}
```

这个算法是在是不适合模拟内存变化，这里就不再演示了，还是那句话：自己模拟一遍，或者在控制台中通过 debugger 观察一次就会明白这个算法
