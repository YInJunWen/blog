const { minify } = require('terser');
const fs = require('fs');

console.log(fs.readFileSync('./a.js', 'utf-8'));
minify(fs.readFileSync('./a.js', 'utf-8'), {
    // sourceMap: true,
    format: {
        comments: true, // 保留所有的注释
    },
    compress: {
        defaults: false,
        arrows: true,
        arguments: true,
        drop_console: true,
        booleans_as_integers: true,
        computed_props: true,
        // conditionals: true,
        // comparisons: true,
        // collapse_vars: false,
        dead_code: true,
        drop_debugger: true,
        global_defs: {
            DEBUGGER: 'debugger',
        },
        hoist_props: true,
    },
}).then((res) => {
    fs.writeFile('./b.js', res.code, (err) => {
        console.log('write success');
    });
});
