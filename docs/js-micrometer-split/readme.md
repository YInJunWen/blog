<!-- Date: 2017-11-30 14:33:27 -->

# js 千分位加逗号的方法

> 后端返回一个金额相关的数字的时候，项目要求前端按千分位分割，这里记录一下实现的方法

```js
function (str) {
 if(str==''){
                return '0.00'
            }
 var z = str.split('.')[0];
 var x = str.split('.')[1];
    // 处理小数点后面的内容

    if(x == undefined || !x){
        x = '00'
    }
    if(x!=undefined && x.length>0){
        while(x.length<2){
            x+='0'
        }
    }
    x = x.substr(0,2);

    // 处理整数部分内容

    var len = Math.floor(z.length / 3) ; // 2
    if (z.length > 3) {
        // 反转字符串
        var tmp = z.split(''); // [2,2,3,3,4,4,5]
        tmp = tmp.reverse();   // [5,4,4,3,3,2,2]
        var arr = []
        for (var k = 0; k < len; k += 1) {
            // 7位数字循环2次
            var m = tmp.splice(0,3);  //  [5,4,4]
            m = m.reverse();  //[4,4,5]
            m = m.join(''); // 445
            arr.push(m)  ['445']
        }
        if(tmp.length>0){
            arr[arr.length]= tmp.reverse().join(')
        }
        // console.log(arr)   // [445,233,2]
        z = arr.reverse().join(',')
    }

    return z+'.'+x
}
```
