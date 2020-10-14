<!-- Date: 2020-09-22 11:15 -->

# 如何在 UniApp 中使用 Mock 数据

在项目根目录下安装[`better-mock`包](https://lavyun.github.io/better-mock/)

```
npm i better-mock
```

在`/src`目录中创建`mock/index.js`文件，并引入`better-mock`，这里要注意的是小程序中要引入`better-mock/dist/mock.mp.js`，否则会抛出错误

```js
// #ifdef H5
import Mock from 'better-mock';
// #endif

// #ifdef MP-WEIXIN
const Mock = require('better-mock/dist/mock.mp.js');
// #endif

Mock.mock('url', function () {
    return {
        ok: true,
        data: {},
        msg: '',
    };
});
```

在`/src/main.js`文件中引入`mock/index.js`，这里需要注意，**我们只需要在开发模式下模拟数据，所以要加一个运行环境的判断语句**

```js
if (process.env.NODE_ENV == 'development') {
    console.log(process.env);
    require('./mock');
}
```

## 要注意的地方

`Mock.mock()`方法中的 url 参数，必须是一个完整的`url`路径,比如`http://liyun.com/api/addUser`，所以可以考虑封装一个函数，把`baseUrl`当做一个变量处理
