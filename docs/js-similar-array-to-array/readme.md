# js 类数组转数组

## 什么是类数组

document.querySelectorAll("div")这个方法返回的对象就是一个类数组

函数执行时候创建的上下文中，生成的 arguments 对象也是一个类数组

## 为什么要转成数组

Array 在 js 里面是非常强大有用的，它有很多方法：shift,unshift,splice,slice,concat,reverse,sort。ECMAscript 2015 又新增了一些方法 forEach,isArray,indexOf,lastIndexOf,every,some,map,filter,reduce 等等。包括那个 IT 笑话，“对程序员来说 push 的反义词是 pop（^\_^）” 说的都是和数组相关的。但是这些强大的方法，类数组是不一定全部支持的。当我们需要进行数组属性操作的时候才发现，啊原来这是个类数组，啊，要是能变成数组多好啊，否则我还得自己写。虽然每一种方法都是可以自己靠基础 api 实现的，但是每次都做重复的基础工作，多枯燥。学会偷懒有时候能帮助提高效率~~

## 通过那种方法转成真正的数组？

`Array.prototype.slice.call()`方法，可以把类数组转成真正的数组，`Array.prototype.splice.call()`也可以实现这个目的，其实只要是 Array 圆形方法中最后能返回一个数组的方法都可以实现类数组转数组的目的，习惯性用 slice 是因为更省事。

## 注意：

如果不想写 Array，可以使用`[].slice.call()` 千万不能省略`slice`， 因为 call 方法前面的调用对象一定要是一个函数方法，而`[]`只是一个对象
