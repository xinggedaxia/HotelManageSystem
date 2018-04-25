var myApp = angular.module("Controller", []);

// myApp.controller("");
/*
主控制器
*/
myApp.controller("main", ["$scope", "$filter", "$interval", "$rootScope", function ($scope, $filter, $interval, $rootScope) {

    //时间显示
    $interval(function () {
        var date = new Date();
        $scope.time = $filter('date')(date, 'yyyy-MM-dd HH:mm:ss ');
    }, 1000);

    // 获取身份证读取模块传过来了身份证信息

    $scope.$on("toParent", function (event, data) {
        $scope.currentUser = data;

        // 判断当前页面位置
        if (window.location.href.slice(23) == "huanfang" || window.location.href.slice(23)=="tuifang") {

            //查询当前用户的入住信息
            $.get("/searchCheckIn", {"number": $scope.currentUser.number}, function (result) {
                var result = result[0];
                $scope.oldRoomNum = result.roomNum;
                $scope.oldNumber = result.number;
                $scope.oldDeposit = result.deposit;
                $scope.population = result.population;
                console.log($scope.oldDeposit*0.5);

                $.get("/findOneRoom",{"roomNum": $scope.oldRoomNum},function (result) {
                    console.log(result[0]);
                    $scope.myPrice = result[0].price;
                    $scope.myType = result[0].roomType;
                });
                $scope.tuifang = function () {
                    $.get("/deleteCheckIn",{
                        "number" : $scope.oldNumber ,
                        "roomNum" : $scope.oldRoomNum
                    },function (result) {
                        //重置表单
                        $scope.currentUser = {
                            "sex": "男"
                        };
                        $scope.myPrice = 100;
                        $scope.myType = "普通单间";
                        $scope.money = 0;
                        $scope.deposit = 0;
                        $("#intime").val("");
                        $("#outtime").val("");
                        $("#roomType").val("");
                        $("#population").val("1");
                        $("#oldRoomNum").val("");
                        $scope.days = 1;

                        if (result == true) {
                            alert("操作成功！");
                        }
                        else {
                            alert("操作失败！");
                        }
                    });
                }
                $("#intime").val($filter('date')(result.intime, 'yyyy-MM-dd'));

                $("#outtime").val($filter('date')(result.outtime, 'yyyy-MM-dd'));
                // $("#roomType").val("");
                $("#population").val(result.population);

                $scope.days = $scope.datedifference(result.intime,result.outtime);
            });
        }

    });


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




    $scope.getRoom = function () {

        // 获取入住和退房时间和房间类型
        var intime = $("#intime").val();
        var outtime = $("#outtime").val();
        var roomtype = $("#roomType").val();
        console.log(intime);
        console.log(outtime);

        $scope.money = 1;
        $scope.deposit = 1;
        $scope.days = $scope.datedifference(intime,outtime);
        console.log( $scope.days);
        $scope.enableRoomNum = [];
        // 入住登记
        $scope.enable = [];




// 查询空房
        $.get("/searchRoom",
            {"intime": intime, "outtime": outtime},
            function (result) {
                var unableNum = [];
                var allRoomNum = [];
                for (var i = 0, len = result.length; i < len; i++) {
                    unableNum.push(result[i].roomNum);
                }
                $.get("roomInfo2", {"roomType": roomtype}, function (result2) {

                    //获取房价
                    console.log($scope.days);
                    $scope.price = result2[0].price;
                    console.log($scope.price);
                    $scope.priceString = $scope.price + "元/天";
                    $scope.money = $scope.price * $scope.days + "元";
                    $scope.deposit = $scope.price * $scope.days * 1.5 + "元";

                    //计算退补押金金额
                    var num = $scope.price * $scope.days * 1.5 - $scope.oldDeposit;
                    $scope.requireM = (num)>=0? "补交押金"+ num+"元" : "退还押金"+ (-num) + "元";

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
        console.log($scope.price * $scope.days * 1.5);
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
                $scope.price = "";
                $scope.priceString = "";
                $scope.money = "";
                $scope.deposit = 0;
                $scope.enableRoomNum = [];
                $("#intime").val("");
                $("#outtime").val("");
                $("#roomType").val("");
                $("#population").val("1");
                $scope.days = 1;


                if (result == true) {
                    alert("操作成功！");
                }
                else {
                    alert("操作失败！");
                }
            });

    }

    //换房的事件
    $scope.changeRoom = function () {
        var roomNum = $("#roomNum").val();
        var number = $("#sfz").val();
        var intime = $("#intime").val();
        var outtime = $("#outtime").val();
        var population = $("#population").val();

        $.get("/deleteCheckIn",{
            "number" : $scope.oldNumber ,
            "roomNum" : $scope.oldRoomNum
        },function (result) {
            if(result){
                console.log("删除成功！");
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
                        $scope.price = 0;
                        $scope.priceString = "";
                        $scope.money = "";
                        $scope.deposit = 0;
                        $scope.enableRoomNum = [];
                        $("#intime").val("");
                        $("#outtime").val("");
                        $("#roomType").val("");
                        $("#population").val("1");
                        $scope.days = 1;

                        if (result == true) {
                            alert("操作成功！");
                        }
                        else {
                            alert("操作失败！");
                        }
                    });
            }
            else{
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
                            alert("修改成功！");
                        } else {
                            alert("更改失败！");
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

myApp.controller("mainContent", ["$scope","$filter", function ($scope,$filter) {

    // 获取今日日期
    var today = new Date();
    today = $filter('date')(today, 'yyyy-MM-dd');

    $scope.data = [];
    // 请求房间数据
    $.get("/roomInfo",{"today":today} ,function (result) {
        $scope.roomInfo = result.allRoom;
        $scope.data = result.allRoom;
        //判断改房间的状态
        setTimeout(function () {
            for(var i = 0,len = result.orderedRoom.length; i < len ; i++ ){
                $("#"+ result.orderedRoom[i].roomNum).addClass("ordered");
            }
            for(var i = 0,len = result.repairRoom.length; i < len ; i++ ){
                $("#"+ result.repairRoom[i].roomNum).addClass("repair");
            }
            for(var i = 0,len = result.usedRoom.length; i < len ; i++ ){
                $("#"+ result.usedRoom[i].roomNum).addClass("occupied");
            }
        },1000)
    });
}]);



myApp.controller("roomManage",["$scope","$filter",function ($scope,$filter) {


    var today = new Date();
    today = $filter('date')(today, 'yyyy-MM-dd');

    // 定义获取价格函数
    $scope.getPrice = function(data,type,num){
        // 获取房间的价格
        for(var i = 0,len =data.allRoom.length; i < len ; i++ ){
            if(data.allRoom[i].roomType == type){
                $scope["price"+ num] = data.allRoom[i].price;
                return;
            }
        }
    }
    // 初始化房间管理界面
    $.get("/roomInfo",{"today":today} ,function (result) {
        $scope.roomInfo = result.allRoom;
        $scope.data = result.allRoom;
        //设置选中状态
        setTimeout(function () {
            $scope.setRepair();
        },1000);

        $("#box").css("height",280+result.allRoom.length*40 + "px");
        $scope.price1 = 0;
        $scope.price2 = 0;
        $scope.price3 = 0;
        $scope.price4 = 0;
        $scope.price5 = 0;
        $scope.price6 = 0;
        $scope.getPrice(result,"普通单间",1);
        $scope.getPrice(result,"普通双间",2);
        $scope.getPrice(result,"豪华单间",3);
        $scope.getPrice(result,"豪华双间",4);
        $scope.getPrice(result,"贵宾套房",5);
        $scope.getPrice(result,"总统套房",6);
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
        $.get("/updatePrice",{
            "price1" : price1,
            "price2" : price2,
            "price3" : price3,
            "price4" : price4,
            "price5" : price5,
            "price6" : price6
        },function (result) {
            if(result == true){
                $.get("/roomInfo",{"today":today} ,function (result) {
                    //更新房间显示信息
                    alert("更新成功！");
                    $scope.searchRoom();

                });
            }else{
                alert("更新失败！");
            }
        });
    }
    // 获取并设置修理中的房间
    $scope.setRepair = function () {
        $.get("/repairRoom",function (result) {
            for(var i = 0,len = result.length; i < len ; i++ ){
                $("#"+result[i].roomNum).prop("checked",true);
            }
        });
    }
    // 房间查询
    $scope.searchRoom = function () {
        var roomNum = $("#roomNum").val();
        var roomType = $("#roomType").val();
        var price =  $("#price").val();
        var roomState = ($("#normal").is(':checked'))?1:0;
        $("#box").css("transition","none");
        $("#box").css("height","274px");
        $.get("/searchRoom2",{
            "roomNum" :roomNum,
            "roomType" :roomType,
            "price" :price,
            "roomState" :roomState
        },function (result) {
            $("#box").css("transition","height,1s");
            $("#box").css("height",274+result.length*40 + "px");
            $scope.roomInfo = result;
            console.log(result);
            setTimeout(function () {
                $(".checked").prop("checked",true);
                $scope.setRepair();
            },1000);
        });
    }
    $scope.addRoom = function () {
        var roomNum = $("#roomNum").val();
        var roomType = $("#roomType").val();
        var price =  $("#price").val();
        var roomState = ($("#normal").is(':checked'))?1:0;

        if(roomNum == "" || roomType == "所有类型" || price==""){
            alert("输入有误,请重新输入!");
        }
        else{
            $.get("/addRoom",{
                "roomNum" :roomNum,
                "roomType" :roomType,
                "price" :price,
                "roomState" :roomState
            },function (result) {
                if(result == true){
                    alert("添加成功!");
                    $scope.searchRoom();

                }
                else{
                    alert("添加失败!");
                }
            });
        }

    }
    $scope.updateRoom = function (rooNum) {
        var roomState = ($("#"+rooNum).is(':checked'))?0:1;
        $.get("/updateRoom",{"roomNum":rooNum,"roomState":roomState},function (result) {
            if(result ==true){
                alert("更新成功!");
                $scope.searchRoom();
            }else{
                alert("更新失败!")
            }
        });
    }
    $scope.delRoom = function (roomNum) {
        $.get("/delRoom",{"roomNum":roomNum},function (result) {
            if(result == true){
                alert("删除成功!");
                $scope.searchRoom();
            }
            else{
                alert("删除失败!");
            }
        })
    }
}]);














/*
图表绘制
*/


myApp.controller("today", ["$scope", function ($scope) {
    var myChart = echarts.init(document.getElementById('main'));
    // 指定图表的配置项和数据
    var option = {
        title: {
            text: '今日收入情况',
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['收入']
        },
        xAxis: {
            type: 'category',
            data: ['09:00', '09:30', '11:30', '12:00', '14:00', '17:00', '18:00']
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value}元'
            }
        },
        series: [{
            name: "收入",
            data: [100, 200, 400, 800, 200, 300, 100],
            type: 'line',


        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    myChart.on("mouseover", function () {
        /* myChart.setOption({
             series: [{
             itemStyle : { normal: {label : {show: true}}}
         }]}
         );*/
    });
    myChart.on("mouseout", function () {
        /*this.setOption({
            series: [{
            itemStyle : { normal: {label : {show: false}}}
        }]}
        );*/
    });

// 今日收入
// 本月收入
// 今年收入

}]);
myApp.controller("month", ["$scope", function ($scope) {
    var myChart = echarts.init(document.getElementById('main'));
    // 指定图表的配置项和数据
    var option = {

        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value} 元'
            }
        },
        series: [
            {
                name: '收入',
                type: 'line',
                data: [1000, 2000, 3000, 1200, 1300, 1400, 1500, 1800, 4000, 2000, 1150, 1000, 300, 800, 1000, 1000, 1000, 8000, 1000, 7000, 5000, 3000, 1000, 4000, 1000, 2000, 1500, 2000, 9000, 1000]
            }

        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

}]);
myApp.controller("year", ["$scope", function ($scope) {
    var myChart = echarts.init(document.getElementById('main'));

    var option = {

        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value} 元'
            }
        },
        series: [
            {
                name: '收入',
                type: 'line',
                data: [100000, 200000, 300000, 120000, 130000, 100400, 150000, 180000, 400000, 200000, 115000, 100000]
            }

        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

}]);

