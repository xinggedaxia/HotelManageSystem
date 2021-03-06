var myApp = angular.module("Controller", []);

// myApp.controller("");
/*
主控制器
*/
myApp.controller("main", ["$scope", "$filter", "$interval", "$rootScope", function ($scope, $filter, $interval, $rootScope) {

    //时间显示
    $interval(function () {
        var date = new Date();
        $scope.time = $filter('date')(date, 'yyyy年MM月dd日 HH:mm:ss ');
    }, 1000);


    //显示操作结果提示
    $rootScope.showMes = function (info) {
        $(".mes").css("display", "block");
        setTimeout(function () {
            $(".mes").css({"transform": "scale(1)", "opacity": "1"});
            $(".mes").text(info);
            setTimeout(function () {
                $(".mes").css({"transform": "scale(0)", "opacity": "0"});
                setTimeout(function () {
                    $(".mes").css("display", "none");
                }, 500)
            }, 1500)
        }, 100)
    }
    $rootScope.showMes2 = function (info) {
        $(".mes2").css("display", "block");
        setTimeout(function () {
            $(".mes2").css({"transform": "scale(1)", "opacity": "1"});
            $(".mes2").text(info);
            setTimeout(function () {
                $(".mes2").css({"transform": "scale(0)", "opacity": "0"});
                setTimeout(function () {
                    $(".mes2").css("display", "none");
                }, 500)
            }, 1500)
        }, 100)
    }


    //获取今日将要过期的房间信息
    var today = new Date();
    var date = $filter('date')(today, "yyyy-MM-dd");
    // console.log(date);
    var xuhao = ["①", "②", "③", "④", "⑤", "⑥"];
    $.get("/seachRoom2", {"outtime": date}, function (res) {
        $scope.info = [];
        if (res.length == 0) {
            var txt = "暂无消息！";
            $scope.info.push(txt);
        } else {

            if (today.getHours() < 12) {
                for (var i = 0, len = res.length; i < len; i++) {
                    var txt = xuhao[i] + ":" + res[i].roomNum + "房即将到期，请提醒办理退房手续！";
                    $scope.info.push(txt);
                }
            } else {
                for (var i = 0, len = res.length; i < len; i++) {
                    var txt = xuhao[i] + ":" + res[i].roomNum + "房已经到期，请提醒办理退房手续！";
                    $scope.info.push(txt);
                }
            }
        }

    });

    //定义一个变量用于判断当前刷身份证的目的1代表入住人，0代表随行
    $scope.user = 1;
    $scope.other = [];

    $scope.oldDeposit = 0;

    // 获取身份证读取模块传过来了身份证信息


    $scope.$on("toParent", function (event, data) {

        if ($scope.user == 1) {
            $scope.currentUser = data;
            // 判断当前页面位置
            if (window.location.href.slice(23) == "huanfang" || window.location.href.slice(23) == "tuifang") {




                //查询当前用户的入住信息
                $.get("/searchCheckIn", {"number": $scope.currentUser.number}, function (result) {

                    if (result.length == 0) {
                        $rootScope.showMes2("暂无该用户的入住信息！");
                        return;
                    }
                    var result = result[0];
                    $scope.oldRoomNum = result.roomNum;
                    $scope.oldNumber = result.number;
                    $scope.oldDeposit = result.deposit;
                    $scope.population = result.population;

                    $.get("/findOneRoom", {"roomNum": $scope.oldRoomNum}, function (result) {
                        console.log(result[0]);
                        $scope.myPrice = result[0].price;
                        $scope.myType = result[0].roomType;
                    });
                    $scope.tuifang = function () {
                        $.get("/deleteCheckIn", {
                            "number": $scope.oldNumber,
                            "roomNum": $scope.oldRoomNum
                        }, function (result) {


                            //重置表单
                            $scope.currentUser = {
                                "sex": "男"
                            };
                            $scope.oldRoomNum = "";
                            $scope.myPrice = "";
                            $scope.myType = "";
                            $scope.population = 0;
                            $("#intime").val("");
                            $("#outtime").val("");
                            $scope.days = "";
                            $scope.oldDeposit = 0;

                            if (result == true) {
                                $rootScope.showMes("退房成功");
                            }
                            else {
                                $rootScope.showMes("退房失败！");
                            }
                        });
                    }
                    $("#intime").val($filter('date')(result.intime, 'yyyy-MM-dd'));

                    $("#outtime").val($filter('date')(result.outtime, 'yyyy-MM-dd'));
                    // $("#roomType").val("");
                    $("#population").val(result.population);

                    $scope.days = $scope.datedifference(result.intime, result.outtime);
                });
            }
            else if (window.location.href.slice(23) == "dengjiruzhu") {
                $.get("/searchRoomOrder", {"number": $scope.currentUser.number}, function (result) {
                    if (result.length != 0) {
                        // console.log(result);
                        $scope.enableRoomNum = [result[0].roomNum];
                        var dep = result[0].deposit
                        $scope.deposit = dep + "元";
                        $("#totalMonney").val(dep * 2 / 3 + "元");

                        //获取单个房间的信息，主要是房价
                        $.get("/findOneRoom", {"roomNum": result[0].roomNum}, function (result2) {
                            $scope.priceString = result2[0].price + "元/天";
                            $scope.price = result2[0].price;
                            $("#roomType").val(result2[0].roomType);
                            $("#roomNum").html("<option>" + result[0].roomNum + "</option>");
                            $rootScope.showMes2("该用户已经预定过房间，系统已为你补全信息！");
                            setTimeout(function () {
                                $scope.readCard();
                            }, 3000);
                        });

// ​​            $("#intime").val(result[0].intime);
                        $("#population").val(result[0].population);
                        $("#intime").val($filter('date')(result[0].intime, "yyyy-MM-dd"));
                        $("#outtime").val($filter('date')(result[0].outtime, "yyyy-MM-dd"));
                        $scope.getDays();
                    }
                });
            }
        }
        else {
            $scope.other.push({"name": data.name, "number": data.number});
        }


    });


    // 房间高级筛选
    $scope.show_search = function () {
        $(".searchRoom").css("display", "block");
        $(".mask").css("display", "block");
    }
    $scope.close_s = function () {
        $(".searchRoom").css("display", "none");
        $(".mask").css("display", "none");
    }
    $scope.searchR = function () {
       $.get("/allRoom",function (res) {
           var allRoom = res;
           $.get("/searchRoom",
               {"intime": $scope.intime, "outtime": $scope.outtime},
               function (result) {
                   var uRoom = result;
                   var str = "";
                   var type = $("#s_roomType").val();
                   var price = $("#s_price").val();
                   var zaoCan = $("#zaoCan").val();
                   var chuangXin = $("#chuangXin").val();
                   var chuangWei = $("#chuangWei").val();
                   var louCen = $("#louCen").val();

                   // 房间类型判断
                   if (type == "不限") {
                       str += true;
                   } else {
                       str += "room.roomType=='"+type+"'";
                   }

                   // 房间价格判断
                   if (price == "不限") {
                       str += "&&true"
                   } else {
                       if (price == "1") {
                           str += "&&room.price>=100&&room.price<200";
                       } else if (price == "2") {
                           str += "&&room.price>=200&&room.price<300";
                       } else if (price == "3") {
                           str += "&&room.price>=300&&room.price<400";
                       } else if (price == "4") {
                           str += "&&room.price>=400&&room.price<800";
                       } else {
                           str += "&&room.price>=800";
                       }
                   }

                   // 早餐判断
                   if (zaoCan == "-1") {
                       str += "&&true";
                   } else {
                       if (zaoCan == "0") {
                           str += "&&room.zaoCan==0";
                       } else {
                           str += "&&room.zaoCan==1";
                       }
                   }

                   //床型判断
                   if (chuangXin == "-1") {
                       str += "&&true";
                   } else if (chuangXin == "1") {
                       str += "&&room.chuangXin=='中床'";
                   } else {
                       str += "&&room.chuangXin=='大床'";
                   }

                   // 床位判断
                   if(chuangWei == "-1"){
                       str += "&&true";
                   }else{
                       str += "&&room.chuangWei=="+parseInt(chuangWei);
                   }

                   // 楼层判断
                   if(louCen == "-1"){
                       str += "&&true";
                   }else{
                       str += "&&room.louCen=="+parseInt(louCen);
                   }
                   console.log(str);
                   $scope.enableRoomNum = [];
                   for(var i = 0,len = allRoom.length; i < len ; i++ ){
                       var room = allRoom[i];
                       var flag = true;
                        for(var j = 0,len2 = uRoom.length; j < len2 ; j++ ){
                            var room2 = uRoom[j];
                            if(room.roomNum == room2.roomNum){
                               flag = false;
                            }
                        }

                        if(flag){
                            if(eval(str)){
                                $scope.enableRoomNum.push(room.roomNum);
                            }
                        }
                   }
                   if($scope.enableRoomNum.length == 0){
                       $rootScope.showMes2("抱歉，没找到符合的房间！")
                   }else{
                       $rootScope.showMes("筛选成功！")
                   }

               });
       })


        $(".searchRoom").css("display", "none");
        $(".mask").css("display", "none");
    }


    // 读取其他顾客身份证
    $scope.readCard = function () {



        var population = parseInt($("#population").val());
        if (population > 1) {
            $scope.user = 0;
            $scope.other = [];
            $(".mask5").css("display", "block");
            var str = "请再刷" + (population - 1) + "人的身份证！";
            $rootScope.showMes2(str)
            $("#readOther").css("display", "block");
        }
    }
    $scope.closeV = function () {
        $("#readOther").css("display", "none");
        $(".mask5").css("display", "none");
        $rootScope.showMes("读取成功！");
        $scope.user = 1;
    }

    //计算时间差
    $scope.datedifference = function (sDate1, sDate2) {    //sDate1和sDate2是2006-12-18格式
        var dateSpan,
            tempDate,
            iDays;
        sDate1 = Date.parse(sDate1);
        sDate2 = Date.parse(sDate2);
        dateSpan = sDate2 - sDate1;
        dateSpan = Math.abs(dateSpan);
        iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
        return iDays
    };

    $scope.getDays = function () {
        $scope.intime = $("#intime").val();
        $scope.outtime = $("#outtime").val();
        $scope.days = $scope.datedifference($scope.intime, $scope.outtime);
    }


    // 根据房间号查询价格
    $scope.getPrice2 = function () {
        var num = $("#roomNum").val();
        $.get("/getPrice", {"roomNum": num}, function (res) {
            if (res.length == 0) {
                return;
            }
            $scope.price = res[0].price;
            // console.log($scope.price);
            $scope.priceString = $scope.price + "元/天";
            $scope.money = $scope.price * $scope.days + "元";
            $scope.deposit = $scope.price * $scope.days * 1.5 + "元";


            if(window.location.href.slice(23) == "huanfang"){
                //计算退补押金金额
                var num = $scope.price * $scope.days * 1.5 - $scope.oldDeposit;
                $scope.requireM = (num) >= 0 ? "补交押金" + num + "元" : "退还押金" + (-num) + "元";

            }
        });
    }
    //根据条件显示空房和价格
    $scope.getRoom = function () {

        // 获取入住和退房时间和房间类型

        var roomtype = $("#roomType").val();

        /*$scope.money = 1;
        $scope.deposit = 1;*/
        $scope.enableRoomNum = [];
        // 入住登记
        $scope.enable = [];


// 查询空房
        $.get("/searchRoom",
            {"intime": $scope.intime, "outtime": $scope.outtime},
            function (result) {
                var unableNum = [];
                var allRoomNum = [];
                for (var i = 0, len = result.length; i < len; i++) {
                    unableNum.push(result[i].roomNum);
                }
                $.get("/roomInfo2", {"roomType": roomtype}, function (result2) {


                    for (var i = 0, len = result2.length; i < len; i++) {
                        allRoomNum.push(result2[i].roomNum);
                    }
                    for (var i = 0, len = allRoomNum.length; i < len; i++) {
                        if (unableNum.indexOf(allRoomNum[i]) == -1) {
                            $scope.enableRoomNum.push(allRoomNum[i]);
                        }
                    }
                })
            });
    }
    var today = new Date();
    $scope.today = $filter('date')(today, 'yyyy-MM-dd');


    // 提交表单--入住登记和房间预定的事件
    $scope.commit = function () {
        var roomNum = $("#roomNum").val();
        var number = $("#sfz").val();
        var intime = $("#intime").val();
        var outtime = $("#outtime").val();
        var population = $("#population").val();

        if (window.location.href.slice(23) == "dengjiruzhu") {
            // 删除预定表
            $.get("/deleteOrder", {"roomNum": roomNum}, function (result) {
                console.log("删除结果" + result);
            });

        }
        $.get("/checkIn",
            {
                "roomNum": roomNum,
                "number": number,
                "intime": intime,
                "outtime": outtime,
                "population": population,
                "deposit": $scope.price * $scope.days * 1.5,
                "type": $("#type").text(),
                "people1": $scope.other[0] == undefined ? "" : $scope.other[0].number,
                "people2": $scope.other[1] == undefined ? "" : $scope.other[1].number,
                "people3": $scope.other[2] == undefined ? "" : $scope.other[2].number,
            },
            function (result) {


                //重置表单
                $scope.currentUser = {
                    "sex": "男"
                };
                $scope.price = "";
                $scope.priceString = "";
                $scope.money = "";
                $scope.deposit = 0;
                $scope.enableRoomNum = [];
                $("#intime").val("");
                $("#outtime").val("");
                $("#roomType").val("");
                $("#population").val("0");
                $scope.days = 0;

                // 让other数组清空
                $scope.other = [];

                if (result == true) {
                    $rootScope.showMes("操作成功！")
                }
                else {
                    $rootScope.showMes("操作失败！")
                }
            });
    }

    //换房的事件

    $scope.changeRoom = function () {
        // 初始化表单


        var roomNum = $("#roomNum").val();
        var number = $("#sfz").val();
        var intime = $("#intime").val();
        var outtime = $("#outtime").val();
        var population = $("#population").val();

        $.get("/deleteCheckIn", {
            "number": $scope.oldNumber,
            "roomNum": $scope.oldRoomNum
        }, function (result) {
            if (result) {

                $.get("/checkIn",
                    {
                        "roomNum": roomNum,
                        "number": number,
                        "intime": intime,
                        "outtime": outtime,
                        "population": population,
                        "deposit": $scope.price * $scope.days * 1.5
                    },
                    function (result) {

                        //重置表单
                        $scope.currentUser = {
                            "sex": "男"
                        };
                        $scope.oldRoomNum = "";
                        $scope.population = "";
                        $scope.priceString = "";
                        $scope.money = "";
                        $scope.requireM = "";

                        $("#intime").val("");
                        $("#outtime").val("");
                        $scope.days = "";

                        if (result == true) {
                            $rootScope.showMes("换房成功！")
                        }
                        else {
                            $rootScope.showMes("换房成功！")
                        }
                    });
            }
            else {
                console.log("删除失败！");
            }
        });


    }

}]);


/*
 左侧导航控制器，直接放到主控制器会导致事件无法绑定，因为节点没加载完成
*/

myApp.controller("leftBar", ["$scope", function ($scope) {
    $scope.showItems = function (name, val) {
        $(".nav-sidebar").css("height", "0");
        $("#" + name).css("height", val + "px");
    }
    //点击后添加样式
    $(".item").click(function () {
        $(".item").removeClass("active");
        $(this).addClass("active");
    });
    // 单项点击样式
    $(".title").click(function () {
        $(".nav-sidebar").css("height", "0");
        $(".title").removeClass("currentTitle");
        $(this).addClass("currentTitle");
    });


}]);

/*
导航条控制器
*/
myApp.controller("topBar", ["$scope", "$rootScope", "$timeout", function ($scope, $rootScope, $timeout) {

//暂离
    $("#userleave").click(function () {
        $.get("/adminLeave", function (result) {
            console.log(result);
        });
        $("#backPassword").val("");
        $(".mask").css("display", "block");
        $(".leave").css("display", "block");
    });
    $(".back").click(function () {
        var password = $("#backPassword").val();
        $(".tishi").css("display", "none");
        $.post("/checkManager", {"username": "admin", password: password}, function (data) {
            if (data.result == false) {
                $(".tishi").css("display", "block");
            } else {
                $(".mask").css("display", "none");
                $(".leave").css("display", "none");
            }
        });
    });

    //注销
    $("#cancellation").click(function () {
        $.get("/ancellation", function (res) {
            window.location.href = "/login";
        });
    });

    // 修改密码
    $("#changePass").click(function () {
        $("#oldpass").val("");
        $(".changePass").css("display", "block");
        $(".tishi").css("display", "none");
        $(".mask").css("display", "block");

        $("#change").click(function () {
            var password = $("#oldpass").val();
            var newPass = $("#newpass").val();
            $.post("/checkManager", {"username": "admin", password: password}, function (data) {
                if (data.result == false) {
                    $(".tishi").css("display", "block");
                } else {
                    $.post("/updatePass", {"newPass": newPass}, function (result) {
                        if (result.result == true) {
                            $(".mask").css("display", "none");
                            $(".changePass").css("display", "none");
                            $rootScope.showMes("修改成功！");
                        } else {
                            $rootScope.showMes("修改失败！");
                        }
                    });

                }
            });
        });
        // 关闭修改密码界面
        $(".close").click(function () {
            $(".mask").css("display", "none");
            $(".changePass").css("display", "none");
        });
    });
    // ------------------
    //初始化当前用户信息
    $scope.currentUser = {
        "name": "",
        "number": "",
        "sex": "男"
    };
    $scope.sfz = "";
    // 读取身份证信息
    $.get("/getInfo", function (result) {
        $scope.sfz = result;
    });
    $("#readCard").change(function () {
        $(".mask2").css("display", "block");
        $(".cardInfo").css("display", "block");
        var index = parseInt($(this).val());
        $scope.currentUser = $scope.sfz[index];

        //注册一个向上传播的事件，eventName:'FromSelf', data:oneObject
        $scope.sendMes = function () {
            $scope.$emit("toParent", $scope.currentUser);
            $(".mask2").css("display", "none");
            $(".cardInfo").css("display", "none");
            $("#readCard").val("0");
        }


    });


    // 关闭修改密码界面
    $(".close2").click(function () {
        $(".mask2").css("display", "none");
        $("#readCard").val("0");
        $(".cardInfo").css("display", "none");
    });


}]);


/*
房间信息控制类
*/

myApp.controller("mainContent", ["$scope", "$filter", "$rootScope", function ($scope, $filter, $rootScope) {

    // 获取今日日期
    var today = new Date();
    today = $filter('date')(today, 'yyyy-MM-dd');

    $scope.data = [];


    // 请求房间数据
    $.get("/roomInfo", {"today": today}, function (result) {
        $scope.roomInfo = result.allRoom;
        $scope.data = result.allRoom;
        //判断改房间的状态
        setTimeout(function () {
            //初始化小菜单点击事件
            $(".rooms li").click(function (e) {

                $(this).css("z-index", "99");
                $(this).siblings().css({"z-index": "99", "z-index": "1"});

                // 初始化圆圈位置
                $(this).find(".showInfo").css({"left": "12px", "opacity": "0"});
                $(this).find(".setRepair").css({"left": "12px", "opacity": "0"});
                //默认隐藏
                $(".tools").css("display", "none");
                //显示出来 及动画
                $(this).children(".tools").css("display", "block");
                $(this).find(".setRepair").animate({"left": "43px", "opacity": "1"});
                $(this).find(".showInfo").animate({"left": "-25px", "opacity": "1"});
                e.stopPropagation();
            });

            //显示房间信息事件
            $(".showInfo").click(function () {
                var roomNum = $(this).parents("li").attr("id");
                $.get("/getPrice", {"roomNum": roomNum}, function (res) {
                    $scope.chuangWei = res[0].chuangWei;
                    $scope.chuangXin = res[0].chuangXin;
                    $scope.louCen = res[0].louCen;
                    $scope.mianJi = res[0].mianJi;
                    $scope._price = res[0].price;
                    $scope._roomNum = res[0].roomNum;
                    $scope._roomType = res[0].roomType;
                    $scope.zaoCan = res[0].zaoCan;

                });
                $(".mask3").css("display", "block");
                $("#showInfo").css("display", "block");
            });
            $("#cancel").click(function () {
                $("#showInfo").css("display", "none");
                $(".mask3").css("display", "none");
            })
            $("#xiugai").click(function () {
                console.log($("#zaoCan").val());
                $.get("/updateRoom", {
                    "roomNum": $("#_roomNum").val(),
                    "roomType": $("#roomType").val(),
                    "price": $("#_price").val(),
                    "mianJi": parseInt($("#mianJi").val()),
                    "zaoCan": parseInt($("#zaoCan").val()),
                    "chuangWei": parseInt($("#chuangWei").val()),
                    "chuangXin": $("#chuangXin").val(),
                    "louCen": $("#louCen").val()
                }, function (res) {
                    if (res == true) {
                        $rootScope.showMes("修改成功！");
                    } else {
                        $rootScope.showMes("修改失败！");

                    }
                });
                $("#showInfo").css("display", "none");
                $(".mask3").css("display", "none");

            })


            //报修房间事件
            $(".setRepair").click(function () {
                var roomNum = $(this).parents("li").attr("id");
                $.get("/getRepair", {"roomNum": roomNum}, function (res) {
                    if (res.length == 0) {
                        $("#xiugai3").css("display", "none");
                        $("#xiugai2").css("display", "block");
                        var today = new Date();
                        today = $filter('date')(today, 'yyyy-MM-dd');
                        $scope.roomNum2 = roomNum;
                        $scope.startTime = today;
                        $scope.principal2 = "";
                        $scope.thing = "";
                        $scope.reason = "";

                    } else {
                        $("#xiugai2").css("display", "none");
                        $("#xiugai3").css("display", "block");
                        $scope.roomNum2 = res[0].roomNum;
                        $scope.startTime = $filter('date')(res[0].startTime, 'yyyy-MM-dd');
                        $scope.principal2 = res[0].principal;
                        $scope.thing = res[0].thing;
                        $scope.reason = res[0].reason;
                    }

                });
                $(".mask3").css("display", "block");
                $("#setRepair").css("display", "block");
            });
            $("#cancel2").click(function () {
                $("#setRepair").css("display", "none");
                $(".mask3").css("display", "none");
            })
            $("#xiugai2").click(function () {
                $.get("/addRepair", {
                    "roomNum": $("#roomNum2").val(),
                    "startTime": $("#startTime").val(),
                    "principal": $("#principal2").val(),
                    "thing": $("#thing").val(),
                    "reason": $("#reason").val()
                }, function (res) {
                    if (res == true) {
                        $rootScope.showMes("提交成功！");
                    } else {
                        $rootScope.showMes("提交失败！");

                    }
                });
                $("#setRepair").css("display", "none");
                $(".mask3").css("display", "none");

            })
            $("#xiugai3").click(function () {
                $.get("/deleteRepair", {
                    "roomNum": $("#roomNum2").val()
                }, function (res) {
                    if (res == true) {
                        $rootScope.showMes("修改成功！");
                    } else {
                        $rootScope.showMes("修改失败！");

                    }
                });
                $("#setRepair").css("display", "none");
                $(".mask3").css("display", "none");

            })

            //去掉背景
            $(".allroom").css("background", "url('')");
            // 显示颜色
            for (var i = 0, len = result.orderedRoom.length; i < len; i++) {
                $("#" + result.orderedRoom[i].roomNum).addClass("ordered");
            }
            for (var i = 0, len = result.repairRoom.length; i < len; i++) {
                $("#" + result.repairRoom[i].roomNum).addClass("repair");
            }
            for (var i = 0, len = result.usedRoom.length; i < len; i++) {
                $("#" + result.usedRoom[i].roomNum).addClass("occupied");
            }
        }, 1000)
    });
}]);


myApp.controller("roomManage", ["$scope", "$filter", function ($scope, $filter) {


    var today = new Date();
    today = $filter('date')(today, 'yyyy-MM-dd');

    // 定义获取价格函数
    $scope.getPrice = function (data, type, num) {
        // 获取房间的价格
        for (var i = 0, len = data.allRoom.length; i < len; i++) {
            if (data.allRoom[i].roomType == type) {
                $scope["price" + num] = data.allRoom[i].price;
                return;
            }
        }
    }
    // 初始化房间管理界面
    $.get("/roomInfo", {"today": today}, function (result) {
        $scope.roomInfo = result.allRoom;
        $scope.data = result.allRoom;
        //设置选中状态
        setTimeout(function () {
            $scope.setRepair();
        }, 1000);

        $("#box").css("height", 280 + result.allRoom.length * 40 + "px");
        $scope.price1 = 0;
        $scope.price2 = 0;
        $scope.price3 = 0;
        $scope.price4 = 0;
        $scope.price5 = 0;
        $scope.price6 = 0;
        $scope.getPrice(result, "普通单间", 1);
        $scope.getPrice(result, "普通双间", 2);
        $scope.getPrice(result, "豪华单间", 3);
        $scope.getPrice(result, "豪华双间", 4);
        $scope.getPrice(result, "贵宾套房", 5);
        $scope.getPrice(result, "总统套房", 6);
    });
    // 更新房价
    $scope.updatePrcie = function () {
        var nodes = $("#roomPrice").children();
        var price1 = parseInt(nodes.eq(1).children().eq(0).val());
        var price2 = parseInt(nodes.eq(2).children().eq(0).val());
        var price3 = parseInt(nodes.eq(3).children().eq(0).val());
        var price4 = parseInt(nodes.eq(4).children().eq(0).val());
        var price5 = parseInt(nodes.eq(5).children().eq(0).val());
        var price6 = parseInt(nodes.eq(6).children().eq(0).val());
        $.get("/updatePrice", {
            "price1": price1,
            "price2": price2,
            "price3": price3,
            "price4": price4,
            "price5": price5,
            "price6": price6
        }, function (result) {
            if (result == true) {
                $.get("/roomInfo", {"today": today}, function (result) {
                    //更新房间显示信息
                    alert("更新成功！");
                    $scope.searchRoom();

                });
            } else {
                alert("更新失败！");
            }
        });
    }
    // 获取并设置修理中的房间
    $scope.setRepair = function () {
        $.get("/repairRoom", function (result) {
            for (var i = 0, len = result.length; i < len; i++) {
                $("#" + result[i].roomNum).prop("checked", true);
            }
        });
    }
    // 通过检测是否输入内容判断是否显示小沟
    $("#search input").blur(function () {
        $(this).siblings("span").css("display", "none");
    });
    $("#search input").blur(function () {
        if ($(this).val() != "") {
            $(this).siblings("span").css("display", "block");
        }
    });
    $("#search select").blur(function () {
        $(this).siblings("span").css("display", "none");
    });
    $("#search select").blur(function () {
        if ($(this).val() != "所有类型") {
            $(this).siblings("span").css("display", "block");
        }
    });


    // 房间查询
    $scope.searchRoom = function () {
        var roomNum = $("#roomNum").val();
        var roomType = $("#roomType").val();
        var price = $("#price").val();
        var roomState = ($("#normal").is(':checked')) ? 1 : 0;
        $("#box").css("transition", "none");
        $("#box").css("height", "274px");
        $.get("/searchRoom2", {
            "roomNum": roomNum,
            "roomType": roomType,
            "price": price,
            "roomState": roomState
        }, function (result) {
            $("#box").css("transition", "height,1s");
            $("#box").css("height", 274 + result.length * 40 + "px");
            $scope.roomInfo = result;
            console.log(result);
            setTimeout(function () {
                $(".checked").prop("checked", true);
                $scope.setRepair();
            }, 1000);
        });
    }
    $scope.addRoom = function () {
        var roomNum = $("#roomNum").val();
        var roomType = $("#roomType").val();
        var price = $("#price").val();
        var roomState = ($("#normal").is(':checked')) ? 1 : 0;

        if (roomNum == "" || roomType == "所有类型" || price == "") {
            alert("输入有误,请重新输入!");
        }
        else {
            $.get("/addRoom", {
                "roomNum": roomNum,
                "roomType": roomType,
                "price": price,
                "roomState": roomState
            }, function (result) {
                if (result == true) {
                    alert("添加成功!");
                    $scope.searchRoom();

                }
                else {
                    alert("添加失败!");
                }
            });
        }

    }
    $scope.updateRoom = function (rooNum) {
        var roomState = ($("#" + rooNum).is(':checked')) ? 0 : 1;
        $.get("/updateRoom", {"roomNum": rooNum, "roomState": roomState}, function (result) {
            if (result == true) {
                alert("更新成功!");
                $scope.searchRoom();
            } else {
                alert("更新失败!")
            }
        });
    }
    $scope.delRoom = function (roomNum) {
        $.get("/delRoom", {"roomNum": roomNum}, function (result) {
            if (result == true) {
                alert("删除成功!");
                $scope.searchRoom();
            }
            else {
                alert("删除失败!");
            }
        })
    }
}]);

// 员工信息控制器

myApp.controller("ygxx", ["$scope", "$filter", function ($scope, $filter) {

    $.get("/employeeInfo", function (res) {
        $scope.employeeInfo = res;
        $(".box2").css("height", 114 + res.length * 30 + "px");
    });

    // 通过检测是否输入内容判断是否显示小沟
    $(".title3 input").blur(function () {
        $(this).siblings("span").css("display", "none");
    });
    $(".title3 input").blur(function () {
        if ($(this).val() != "") {
            $(this).siblings("span").css("display", "block");
        }
    });
    $(".title3 select").blur(function () {
        $(this).siblings("span").css("display", "none");
    });
    $(".title3 select").blur(function () {
        if ($(this).val() != "0") {
            $(this).siblings("span").css("display", "block");
        }
    });


    $scope.emSearch = function () {
        var mes = {
            "age": $("#emAge").val(),
            "job": $("#job").val(),
            "name": $("#emName").val(),
            "number": $("#emNumber").val(),
            "phonenum": $("#phone").val(),
            "sex": $("#sex").val(),
            "wage": $("#wage").val()
        }
        $.get("/emSearch", mes, function (res) {
            $(".box2").css("transition", "none");
            $(".box2").css("height", "114px");
            setTimeout(function () {
                $(".box2").css("transition", "height 1s");
                $(".box2").css("height", 114 + res.length * 30 + "px");
            }, 500);

            $scope.employeeInfo = res;
        });
    }
    $scope.emAdd = function () {
        var mes = {
            "age": $("#emAge").val(),
            "job": $("#job").val(),
            "name": $("#emName").val(),
            "number": $("#emNumber").val(),
            "phonenum": $("#phone").val(),
            "sex": $("#sex").val(),
            "wage": $("#wage").val()
        }
        if (mes.age == "" || mes.job == "" || mes.name == "" || mes.number == "" || mes.sex == "0" || mes.number == "" || mes.wage == "") {
            alert("请核对输入内容！");
        } else {
            $.get("/emAdd", mes, function (res) {
                if (res) {
                    alert("添加成功！");
                    $scope.emSearch();
                } else {
                    alert("添加失败！");
                }
            });
        }
    }
    // 修改员工信息
    $scope.changeEm = function (num) {
        var job = $("#" + num + " td").eq(4).children().eq(0).val();
        var wage = $("#" + num + " td").eq(5).children().eq(0).val();
        var phonenum = $("#" + num + " td").eq(6).children().eq(0).val();
        $.get("/changeEm", {"number": num, "job": job, "wage": wage, "phonenum": phonenum}, function (res) {
            console.log(res);
            if (res) {
                alert("修改成功！");
                $scope.emSearch();
            } else {
                alert("修改失败！");
            }
        });
    }
    $scope.delEm = function (num) {
        $.get("/delEm", {"number": num}, function (res) {
            if (res) {
                alert("删除成功！");
                $scope.emSearch();
            } else {
                alert("删除失败!");
            }
        });
    }
}]);

// 员工考勤

myApp.controller("ygkq", ["$scope", "$filter", function ($scope, $filter) {
    $scope.date = $filter('date')(new Date(), "yyyy年MM月dd日");
    console.log($scope.date);
    $scope.clickHander = function (res) {
        setTimeout(function () {
            $(".one").click(function () {
                $(this).siblings().removeClass("selected");
                $(this).addClass("selected");
            });
            $(".two").click(function () {
                $(this).toggleClass("selected");
            });
            $("#zhengchang").click(function () {
                $(".zhengchang").addClass("selected");
                $(".chidao").removeClass("selected");
                $(".weidao").removeClass("selected");
            })
            $("#chidao").click(function () {
                $(".chidao").addClass("selected");
                $(".zhengchang").removeClass("selected");
                $(".weidao").removeClass("selected");
            })
            $("#weidao").click(function () {
                $(".weidao").addClass("selected");
                $(".chidao").removeClass("selected");
                $(".zhengchang").removeClass("selected");
            })
            $("#zaotui").click(function () {
                $(".zaotui").addClass("selected");
            })
            $("#jiaban").click(function () {
                $(".jiaban").addClass("selected");

            })
            $(".box3").css("transition", "height 1s");
            $(".box3").css("height", 111 + 30 * res.length + "px");

        }, 1000);
    }
    $.get("/employeeInfo", function (res) {
        $scope.employeeInfo2 = res;
        // 选择事件绑定
        $scope.clickHander(res);


    });


    // 员工查询

    $scope.kqSearch = function () {
        var mes = {


            "name": $("#kqName").val(),
            "number": $("#kqNumber").val(),


        }
        $.get("/emSearch", mes, function (res) {
            $(".box3").css("transition", "none");
            $(".box3").css("height", "111px");
            console.log(res);
            $scope.employeeInfo2 = res;
            $scope.clickHander(res);
        });

    }
    $scope.submit = function () {
        var kaoQin = [];
        for (var i = 0, len = $(".kqContent").length; i < len; i++) {
            var obj = {};
            obj.number = $(".kqContent").eq(i).children().eq(0).text();
            obj.chidao = $(".kqContent").eq(i).children().eq(5).hasClass("selected")
            console.log(obj.chidao);
            obj.weidao = $(".kqContent").eq(i).children().eq(6).hasClass("selected")
            obj.zaotui = $(".kqContent").eq(i).children().eq(7).hasClass("selected")
            obj.jiaban = $(".kqContent").eq(i).children().eq(8).hasClass("selected")
            kaoQin.push(obj);

        }
        kaoQin = JSON.stringify(kaoQin);
        $.get("/kaoqing", {"data1": kaoQin}, function (res) {
            if (res) {
                alert("保存成功！");
            } else {
                alert("你今天提交过了！");
            }
        })
    }
}]);


// 工资结算
myApp.controller("gzjs", ["$scope", function ($scope) {
    /* $.get("/employeeInfo", function (res) {
         $scope.employeeInfo3 = res;
         console.log(res);
     });*/
    $.get("/employeeKaoQing", function (res) {
        $scope.employeeInfo3 = res;
    });


    //生成表格

    var idTmr;

    function getExplorer() {
        var explorer = window.navigator.userAgent;
        //ie
        if (explorer.indexOf("MSIE") >= 0) {
            return 'ie';
        }
        //firefox
        else if (explorer.indexOf("Firefox") >= 0) {
            return 'Firefox';
        }
        //Chrome
        else if (explorer.indexOf("Chrome") >= 0) {
            return 'Chrome';
        }
        //Opera
        else if (explorer.indexOf("Opera") >= 0) {
            return 'Opera';
        }
        //Safari
        else if (explorer.indexOf("Safari") >= 0) {
            return 'Safari';
        }
    }

    $scope.method1 = function (tableid) {//整个表格拷贝到EXCEL中
        if (getExplorer() == 'ie') {
            var curTbl = document.getElementById(tableid);
            var oXL = new ActiveXObject("Excel.Application");

            //创建AX对象excel
            var oWB = oXL.Workbooks.Add();
            //获取workbook对象
            var xlsheet = oWB.Worksheets(1);
            //激活当前sheet
            var sel = document.body.createTextRange();
            sel.moveToElementText(curTbl);
            //把表格中的内容移到TextRange中
            sel.select;
            //全选TextRange中内容
            sel.execCommand("Copy");
            //复制TextRange中内容
            xlsheet.Paste();
            //粘贴到活动的EXCEL中
            oXL.Visible = true;
            //设置excel可见属性

            try {
                var fname = oXL.Application.GetSaveAsFilename("Excel.xls", "Excel Spreadsheets (*.xls), *.xls");
            } catch (e) {
                print("Nested catch caught " + e);
            } finally {
                oWB.SaveAs(fname);

                oWB.Close(savechanges = false);
                //xls.visible = false;
                oXL.Quit();
                oXL = null;
                //结束excel进程，退出完成
                //window.setInterval("Cleanup();",1);
                idTmr = window.setInterval("Cleanup();", 1);

            }

        }
        else {
            tableToExcel('ta')
        }
    }

    function Cleanup() {
        window.clearInterval(idTmr);
        CollectGarbage();
    }

    var tableToExcel = (function () {
        var uri = 'data:application/vnd.ms-excel;base64,',
            template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
            base64 = function (s) {
                return window.btoa(unescape(encodeURIComponent(s)))
            },
            format = function (s, c) {
                return s.replace(/{(\w+)}/g,
                    function (m, p) {
                        return c[p];
                    })
            }
        return function (table, name) {
            if (!table.nodeType) table = document.getElementById("myTb");
            var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}
            window.location.href = uri + base64(format(template, ctx))
        }
    })();

}])


