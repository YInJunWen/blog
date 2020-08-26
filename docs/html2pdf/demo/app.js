const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

app.get('*', (req, res) => {
    const file = path.resolve(__dirname, '.' + req.path);
    res.sendFile(file);
});
app.listen(port, () =>
    console.log(`image server  listening on port http://localhost:${port} !`)
);

// 启动页面访问服务器;

const app2 = express();
const port2 = 3001;
app2.get('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*'); // 这里是重点
    res.sendfile(path.resolve(__dirname, '.' + req.path));
});
app2.listen(3001, () => {
    console.log(`html server listening on port http://localhost:${port2} !`);
});
