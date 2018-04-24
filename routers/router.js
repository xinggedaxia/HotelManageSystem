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
            res.json({
                "result" : true
            });
        });

    });
}
module.exports.roomInfo = function (req,res) {
    db.find("select * from roominfo",function (result) {
        res.json(result);
    });
}
module.exports.roomInfo2 = function (req,res) {
    var roomType = req.query.roomType;
    db.find("select * from roominfo where roomType = '"+ roomType +"'",function (result) {
        res.json(result);
    });
}
module.exports.getInfo = function (req,res) {
    db.find("select * from sfz",function (result) {
        res.json(result);
    });
}

module.exports.searchRoom = function (req,res) {
    var intime = req.query.intime;
    var outtime = req.query.outtime;
    var roomType = req.query.roomType;

    var allroom =[];
    /*var intime = "2018-4-19";
    var outtime = "2018-4-29";*/
    //先查找入住登记表中不符合的房间
    db.find("select * from checkin where (intime <'"+ intime + "'and outtime > '"+ intime +"') or (intime <'"+ outtime + "'and outtime > '"+ outtime +"') or (intime >='"+ intime + "'and outtime <= '"+ outtime +"')",function (result1) {
        allroom = allroom.concat(result1);
        //再查找预定登记表中不符合的房间
        db.find("select * from  roomorder where (intime <'"+ intime + "'and outtime > '"+ intime +"') or (intime <'"+ outtime + "'and outtime > '"+ outtime +"') or (intime >='"+ intime + "'and outtime <= '"+ outtime +"')",function (result2) {
            allroom = allroom.concat(result2);
            // console.log(allroom);
            res.send(allroom);
        });
    });
    //再查找预定登记表中不符合的房间

    //拿到所有房间，将不符合的踢出

}
// 入住登记
module.exports.checkIn = function (req,res) {
    var roomNum = req.query.roomNum;
    var number = req.query.number;
    var intime = req.query.intime;
    var outtime = req.query.outtime;
    var population = req.query.population;
    var deposit = req.query.deposit;

    db.insert("INSERT INTO checkin(roomNum,number,intime,outtime,population,deposit) VALUES('"+ roomNum +"','"+number +"','"+intime +"','"+outtime +"','"+ population+"','"+deposit +"')",function (result) {
        res.send(result);
    });

}
// 入住登记表中的查询
module.exports.searchCheckIn = function (req,res) {
    var number = req.query.number;
    db.find("select * from checkin where number = '"+ number +"'",function (result) {
        res.json(result);
    });

}


// 删除原有入住登记表
module.exports.deleteCheckIn = function (req,res) {
    var number = req.query.number;
    var roomNum = req.query.roomNum;
    db.remove("delete from checkin where roomNum='"+ roomNum +"' and number = '"+ number +"'",function (result) {
        res.json(result);
    });
}

// 根据房间号查询房间信息
module.exports.findOneRoom = function (req,res) {
    var roomNum = req.query.roomNum;
    db.find("select * from roominfo where roomNum = '"+ roomNum +"'",function (result) {
        res.json(result);
    });

}