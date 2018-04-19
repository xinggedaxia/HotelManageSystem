// 数据库操作
var db = require("../models/db.js");
// md5算法
var md5 = require("../models/md5.js");
// formidable
var formidable = require("formidable");
// var pass = md5(md5("admin") + "hotel");

// 不能同时执行查找和删除操作
/*db.find("select * from manager",function (result) {
     console.log(result);
 });*/
/*db.insert('INSERT INTO manager(用户名,密码,员工编号) VALUES(?,?,?)',['admin', pass,'2018001'],function (result) {
    console.log(result);
});*/
// 注意,用户名后面的字符串不是数字要用单引号引起来
/*db.remove("delete from manager where 用户名='菜鸟工具'",function (result) {
    console.log(result);
});*/
/*db.update("update manager set 用户名=?,密码=?,员工编号=? where 用户名='admin'",["root","1234","512222"],function (result) {
    console.log(result);
});*/

// 接受post表单数据
module.exports.checkmanager = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (err) {
            console.log(err);
        }
        var username = fields.username;
        var password = md5(md5(fields.password) + "hotel");
        db.find("select * from manager where 用户名='" + username + "' and 密码='" + password + "'", function (result) {
            if (result == [] || result == false) {
                res.json({
                    "result": false
                });
            }
            else {
                req.session.login = true;
                res.json({
                    "result": true
                });
            }
        })
    });
}
module.exports.adminLeave = function (req, res) {
    req.session.login = false;
    res.send("管理员离开！");
}
module.exports.ancellation = function (req, res) {
    req.session.login = false;
    res.send(true);
}
module.exports.updatePass = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (err) {
            console.log(err);
        }
        var pass = md5(md5(fields.newPass) + "hotel")
        db.update("update manager set 密码='" + pass +"' where 用户名='admin'", function (result) {
            console.log(result);
            res.json({
                "result" : true
            });
        });

    });
}
