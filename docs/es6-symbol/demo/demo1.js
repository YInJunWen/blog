var egg = require('./demo2');
console.log('egg： ', egg);

var egg2 = require('./demo2');
console.log('egg2： ', egg2);

egg.foo = 2;
console.log('egg： ', egg);
console.log('egg2： ', egg2);
