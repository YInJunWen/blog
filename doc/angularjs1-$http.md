# angularJs 中的 http 方法

## $http().success 方法报错

angular 1.6 版本之后的$http 服务，不再支持 success 或者 error 方法返回的是一个 promise 对象，可以用 then 来代替

```js
$http().then();
```
