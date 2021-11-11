const path = require('path');
// const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const session = require('express-session');

app.use(session({
    secret: '8023',
    // cookie: {maxAge: 60000},
    resave: false,
    saveUninitialized: true
}));

// 部署上线时读取静态文件
app.use(express.static(path.join(__dirname, '../dist')));


// 监听端口
app.listen(80);
console.log('success listen at port:80......');
