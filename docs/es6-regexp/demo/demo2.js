let a = "aaa_aa_a";
let reg1 = /a+/g;
let reg2 = /a+_?/y;
console.log(reg1.exec(a));
console.log(reg1.exec(a));
console.log(reg1.exec(a));

console.log(reg2.exec(a));
console.log(reg2.exec(a));
console.log(reg2.exec(a));
