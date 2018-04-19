var myApp = angular.module("Controller", []);

// myApp.controller("");
// 主控制器
myApp.controller("main", ["$scope", "$filter", "$interval", function ($scope, $filter, $interval) {

    //时间显示
    $interval(function () {
        var date = new Date();
        $scope.time = $filter('date')(date, 'yyyy-MM-dd HH:mm:ss ');
    }, 1000);

}]);
// 左侧导航控制器，直接放到主控制器会导致事件无法绑定，因为节点没加载完成
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

// 导航条控制器
myApp.controller("topBar", ["$scope", function ($scope) {

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
       $.get("/ancellation",function (res) {
           window.location.href = "/login";
       });
    });

    // 修改密码
    $("#changePass").click(function () {
        $("#oldpass").val("");
        $(".changePass").css("display","block");
        $(".tishi").css("display","none");
        $(".mask").css("display","block");

        $("#change").click(function () {
            var password = $("#oldpass").val();
            var newPass = $("#newpass").val();
            $.post("/checkManager", {"username": "admin", password: password}, function (data) {
                if (data.result == false) {
                    $(".tishi").css("display", "block");
                } else {
                    $.post("/updatePass",{"newPass" : newPass},function (result) {
                        if(result.result == true){
                            $(".mask").css("display", "none");
                            $(".changePass").css("display", "none");
                            alert("修改成功！");
                        }else{
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

}]);

// 图表绘制
myApp.controller("today", ["$scope", function ($scope) {
    var myChart = echarts.init(document.getElementById('main'));
    console.log(1);
    // 指定图表的配置项和数据
    var option = {
        title: {
            text: 'ECharts 入门示例'
        },
        tooltip: {},
        legend: {
            data: ['销量']
        },
        xAxis: {
            data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
        },
        yAxis: {},
        series: [{
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

// 今日收入
// 本月收入
// 今年收入

}]);
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

