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

    var today = req.query.today;
    var usedRoom = [];
    var orderedRoom = [];
    var repairRoom = [];
    var allRoom = [];
    db.find("select * from roominfo",function (result) {
        allRoom = result;
        db.find("select * from repair",function (result) {
            repairRoom = result;
            db.find("select * from checkin",function (result) {
                usedRoom = result;

                // 查询预定表中不满足今日入住条件的房间
                db.find("select * from roomorder where intime <= '"+ today +"' and outtime >'"+ today +"'" ,function (result) {
                    orderedRoom = result;
                    res.json({
                        "allRoom" : allRoom,
                        "repairRoom" : repairRoom,
                        "usedRoom" : usedRoom,
                        "orderedRoom" : orderedRoom
                    });
                });
            });
        });
    })

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
            db.find("select * from  repair",function (result3) {
                allroom = allroom.concat(result3);
                // console.log(allroom);
                res.send(allroom);
            })



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

// 更新房价
module.exports.updatePrice = function (req,res) {
    console.log(req.query.price1);
    db.update("update roominfo set price = '"+ req.query.price1 +"' where roomtype = '普通单间'",function (result) {
        db.update("update roominfo set price = '"+ req.query.price2 +"' where roomtype = '普通双间'",function (result) {
            db.update("update roominfo set price = '"+ req.query.price3 +"' where roomtype = '豪华单间'",function (result) {
                db.update("update roominfo set price = '"+ req.query.price4 +"' where roomtype = '豪华双间'",function (result) {
                    db.update("update roominfo set price = '"+ req.query.price5 +"' where roomtype = '贵宾套房'",function (result) {
                        db.update("update roominfo set price = '"+ req.query.price6 +"' where roomtype = '总统套房'",function (result) {
                            res.send(result);
                        })
                    })
                })
            })
        })
    });
}

// 房间管理模块的条件查询

module.exports.searchRoom2 = function (req,res) {
    var roomNum = req.query.roomNum;
    var roomType = req.query.roomType;
    var price = req.query.price;
    var roomState = req.query.roomState;
    var sql = "";
    var needAnd =  false;

    // 拼接sql语句
    if(roomNum == "" && roomType == "所有类型" && price==""){
        sql = "select * from roominfo ";
    }else{
        sql = "select * from roominfo where ";
    }

    if(roomNum != ""){
        sql += "roomNum='"+ roomNum +"'";
        needAnd =  true;
    }
    if(price !=""){
        if(needAnd == true){
            sql += "and price='"+ parseInt(price) +"'";
        }else{
            sql += "price='"+ parseInt(price) +"'";
        }
        needAnd =  true;
    }
    if(roomType != "所有类型"){
        if(needAnd == true){
            sql += "and roomType='"+ roomType +"'";
        }else{
            sql += "roomType='"+ roomType +"'";
        }
    }
    db.find(sql,function (result) {
           var repairRoom = [];
           var nomalRoom = [];
           db.find("select * from repair",function (result2) {
               for(var i = 0,len = result.length; i < len ; i++ ){
                   var flag = true;
                  for(var j = 0,len2 = result2.length; j < len2 ; j++ ){
                      if(result[i].roomNum == result2[j].roomNum){
                          repairRoom.push(result[i]);
                          flag = false;
                      }

                  }
                  if(flag){
                      nomalRoom.push(result[i]);
                  }
               }
               if(roomState == 1){
                   res.send(nomalRoom);
               }else{
                   res.send(repairRoom);
               }

           });

    })

}

// 查询修理中的房间
module.exports.repairRoom = function (req,res) {
    db.find("select * from repair",function (result) {
        res.send(result);
    });
}

// 添加房间

module.exports.addRoom = function (req,res) {
    var roomNum = req.query.roomNum;
    var roomType = req.query.roomType;
    var price = req.query.price;
    var roomState = req.query.roomState;

    db.insert("INSERT INTO roominfo(roomNum,roomType,price) VALUES('"+roomNum+"','"+roomType+"','"+ price +"')",function (result) {

        if(roomState == 0){
            db.insert("insert into repair(roomNum,roomState) value('"+ roomNum +"','修理中')",function (result) {
                res.send(result);
            })
        }
        else{
            res.send(result);
        }
    });
}

// 更新修理房态
module.exports.updateRoom = function (req,res) {
    var roomNum = req.query.roomNum;
    var roomState = req.query.roomState;
    if(roomState == 1){
        db.remove("delete from repair where roomNum = '"+ roomNum +"'",function (result) {
            res.send(result)
        });
    }else{
        db.insert("insert into  repair(roomNum,roomState) value('"+ roomNum +"','修理中')",function (result) {
            res.send(result)
        });

    }
}

// 删除房间
module.exports.delRoom = function (req,res) {
    var roomNum = req.query.roomNum;
    db.remove("delete from roominfo where roomNum = '"+ roomNum +"'",function (result) {
        res.send(result);
    })
}