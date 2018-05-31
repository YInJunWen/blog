const a = new Buffer("汉");
console.log(a);  // <Buffer e6 b1 89>

let b = "汉";
let c = b.charCodeAt(0);   // 返回在16进制的unicode码位： 27721
console.log(c)
let d = c.toString(2);  // 把16进制码位转成二进制码：110110001001001
console.log(d)
// 1110xxxx 10xxxxxx 10xxxxxx  这个是UTF8格式的模板 
// 11100110 10110001 10001001  这个是套用模板后的二进制信息

// 下面把三个字符的二进制码分别用16进制表示
console.log(parseInt("11100110", 2).toString(16)) // e6
console.log(parseInt("10110001", 2).toString(16)) // b1
console.log(parseInt("10001001", 2).toString(16)) // 89

