# debounce(防抖函数)

为了防止用户不小心多次点击同一个按钮，我们需要这么一个函数：

> 第一次点击后，在特定时间内，检测用户是否有下一次点击，如果没有，则直接执行需要的函数，如果有，则重新计时，并在计时结束后调用函数

实现此类方法的函数，我们称之为：防抖函数。lodash 库也为我们提供了此类函数，用法如下

```js
import {debounce} form 'lodash'
debounce(func, wait, options);
```

## 返回值

debuouce 函数返回一个新的**函数**

## 参数 func

func 定义我们想要执行的具体事件

## 参数 wait

later 定义我们想要等待的时间，在这个时间内，检测用户是否有下一次调用，用来判断是否执行前面的 func 事件. 单位： 毫秒， 默认值： 0

## 参数 options

options 包含三个属性，默认值如下：

```js
{
    leading: false,  // 指定是否在第一次点击后，延迟时间前执行一次 func
    maxWait: undefined,  // 指定被延迟的最大时间值， 单位毫秒
    trailing: true // 指定是否在延迟时间后执行 func
}
```

## leading 为 false trailing 为 true

用户在第一次调用的时候，检测在 wait 时间内，是否有下一次调用，如果没有，则在 wait 结束后执行一次 func，如果有，则重新计算 wait 时间，重新检测 wait 时间内是否有下一次调用

**注意：**如果在 wait 时间内，发生多次调用，则 func 在执行的时候，参数以最后一次调用为准

## leading 和 trailing 均为 true

用户第一次调用时立即执行一次 func，并从第二次调用开始在 wait 时间内检测是否有下一次调用，如果没有，则在 wait 时间结束时执行一次 func，如果有，则重置等待时间，重新检测 wait 时间内是否有下一次调用。以此循环。

## leading 为 true， trailing 为 false

用户第一次调用时，立即执行一次 func， 并检测 wait 时间内是否有下一次调用，如果没有，会在 wait 时间后的下一次调用时执行一次 func； 如果有，则重新计算 wait 时间，并检测 wait 时间内是否有下一次调用，以此循环

## 没有设置 wait，或者 wait 设置为 0

用户每调用一次都会执行一次 func，不同的是，这里的执行一次 func 是一个异步事件，相当于 `setTimeout(func, 0)`
