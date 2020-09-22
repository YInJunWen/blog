// arrows:true
let m=e=>e+1;
// arguments:true
function abc(e){alert(e)}abc(1,2,3);
// drop_console: true,
void 0;
// booleans_as_integers: true,
let a=1;if(1==a)alert(a);
//  computed_props (default: true)
let p1="p1";let obj={[p1]:"zhangsan",p2:"lisi"};
//  comparisons (default: true)
let c=1,d=2;let r=!(c<=d);
// dead_code (default: true)
function def(){return 1}switch(c){case 1:alert(1);break;default:alert(3)}
// drop_debugger (default: true)
// compress.drop_console (default: false)
void 0;
// compress.evaluate (default: false)
const e=1+2+3;
// compress.global_defs (default:{})
alert("debugger");
// ## hoist_props (default: true)
var o={p:1,q:2};function f(e,t){}f(o.p,o.q);