// arrows:true
let m = (x) => {
    return x + 1;
};

// arguments:true
function abc(a) {
    alert(arguments[0]);
}
abc(1, 2, 3);

// drop_console: true,
console.log('this sentence will droped');

// booleans_as_integers: true,
let a = true;
if (a === true) {
    alert(a);
}

//  computed_props (default: true)
let p1 = 'p1';
let obj = {
    [p1]: 'zhangsan',
    ['p2']: 'lisi',
};

//  comparisons (default: true)
let c = 1,
    d = 2;
let r = !(c <= d);

// dead_code (default: true)
function def() {
    return true;
    alert('def');
}
switch (c) {
    case 1:
        alert(1);
        break;
        alert(2);
    default:
        alert(3);
}

// drop_debugger (default: true)
debugger;

// compress.drop_console (default: false)
console.log('drop console');

// compress.evaluate (default: false)
const e = 1 + 2 + 3;

// compress.global_defs (default:{})
alert(DEBUGGER);

// ## hoist_props (default: true)
var o = { p: 1, q: 2 };
f(o.p, o.q);
