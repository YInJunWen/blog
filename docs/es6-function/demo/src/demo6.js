let ot = require('./demo7');
// console.log(ot)
var name = 'lisi'
console.log(this)
ot.add.bind({name: 'lisi'})()
// ot.add.call({name: 'lisi'})
// ot.foo.call({name: 'lisi'})
// ot.hoo.call({name: 'lisi'})