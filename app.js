﻿var express = require("express");
var app = express();
//socket.io公式：
var http = require("http").Server(app);
//session公式：
var session = require('express-session');
//这里传入了一个密钥加session id
var FileStore = require('session-file-store')(session);
var identityKey = 'skey';
app.use(session({
    name: identityKey,
    secret: 'chyingp',  // 用来对session id相关的cookie进行签名
    store: new FileStore(),  // 本地存储session（文本文件，也可以选择其他store，比如redis的）
    saveUninitialized: false,  // 是否自动保存未初始化的会话，建议false
    resave: false,  // 是否每次都重新保存会话，建议false
    cookie: {
        maxAge: 1000000 * 1000  // 有效期，单位是毫秒
    }
}));
//路由
var router = require("./routers/router.js");
//创建静态文件夹
app.use(express.static("public"));
//设置当 站内路径(req.path) 不包括 /api 时，都转发到 AngularJS的ng-app(index.html)。所以，我们再直接访问地址 (http://onbook.me/book)时，/book 不包括 /api，就会被直接转发到AngularJS进行路由管理。我们就实现了路由的优化！
app.post("/checkManager",router.checkmanager);
app.get("/login",function (req,res) {
    res.sendfile('public/login.html');
});
app.get("/adminLeave",router.adminLeave);
app.get("/ancellation",router.ancellation);
app.post("/updatePass",router.updatePass);
app.get("/roomInfo",router.roomInfo);
app.get("/roomInfo2",router.roomInfo2);
app.get("/getInfo",router.getInfo);
app.get("/searchRoom",router.searchRoom);
app.get("/checkIn",router.checkIn);
app.get("/searchCheckIn",router.searchCheckIn);
app.get("/deleteCheckIn",router.deleteCheckIn);
app.get("/findOneRoom",router.findOneRoom);
app.get("/updatePrice",router.updatePrice);
app.get("/searchRoom2",router.searchRoom2);
app.get("/repairRoom",router.repairRoom);
app.get("/addRoom",router.addRoom);
app.get("/updateRoom",router.updateRoom);
app.get("/delRoom",router.delRoom);
app.get("/employeeInfo",router.employeeInfo);
app.get("/emSearch",router.emSearch);
app.get("/emAdd",router.emAdd);
app.get("/changeEm",router.changeEm);
app.get("/delEm",router.delEm);
app.get("/kaoqing",router.kaoqing);
app.get("/employeeKaoQing",router.employeeKaoQing);
app.get("/seachRoom2",router.seachRoom2);
app.get("/searchRoomOrder",router.searchRoomOrder);
app.get("/deleteOrder",router.deleteOrder);
app.get("/getPrice",router.getPrice);
app.get("/getRepair",router.getRepair);
app.get("/addRepair",router.addRepair);
app.get("/deleteRepair",router.deleteRepair);
app.get("/allRoom",router.allRoom);



app.use(function (req, res) {
    if(req.session.login == false || req.session.login == undefined){
        console.log("非法闯入");
        res.redirect("/login");
    }
    else{ //angular启动页
        res.sendfile('public/index.html');
    }
});

http.listen(80,"127.0.0.1");
console.log("服务器启动！");