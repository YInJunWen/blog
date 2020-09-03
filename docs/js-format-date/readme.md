<!-- Date: 2017-07-09 04:24 -->

# js 格式化获取到的日期对象 xxxx-xx-xx xx:xx

| 参数       | 类型                         | 是否可以为空 |
| ---------- | ---------------------------- | ------------ |
| baseDate   | object:Date/Timestamp:string | 不能为空     |
| baseFormat | string                       | 可为空       |

```js
function formatDate(baseDate, baseFormat) {
    let date;
    if (!baseDate) {
        throw new Error('first parameter must be pass.');
    }
    if (!baseFormat) {
        baseFormat = 'yy-mm-dd hh:ii:ss';
    }
    if (Object.prototype.toString.call(baseDate) === '[object Date]') {
        date = baseDate;
    } else if (/^\d{10,13}$/.test(String(baseDate))) {
        date = new Date(baseDate);
    } else {
        throw new Error('first parameter must be [Object date] or timestamp.');
    }

    const padZero = function (str) {
        return str < 10 ? '0' + str : str;
    };
    const year = date.getFullYear();
    const month = padZero(date.getMonth() + 1);
    const day = padZero(date.getDate());
    const hour = padZero(date.getHours());
    const minute = padZero(date.getMinutes());
    const seconds = padZero(date.getSeconds());
    let str = baseFormat.replace('yy', year).replace('mm', month).replace('dd', day).replace('hh', hour).replace('ii', minute).replace('ss', seconds);
    console.log(str);
}

formatDate(new Date());
```
