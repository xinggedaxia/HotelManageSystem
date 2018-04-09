var myApp = angular.module("Controller",[]);

// myApp.controller("");
// 主控制器
myApp.controller("main",["$scope","$filter","$interval",function ($scope,$filter,$interval) {

    //时间显示
    $interval(function(){
        var date = new Date();
        $scope.time = $filter('date')(date, 'yyyy-MM-dd HH:mm:ss ');
    },1000);

}]);
// 左侧导航控制器，直接放到主控制器会导致事件无法绑定，因为节点没加载完成
myApp.controller("leftBar",["$scope","$filter","$interval",function ($scope,$filter,$interval) {
    $scope.showItems = function (name,val) {
        $(".nav-sidebar").css("height","0");
        $("#"+ name).css("height",val + "px");
    }
    //点击后添加样式
    $(".item").click(function () {
        $(".item").removeClass("active");
        $(this).addClass("active");
    });
    // 单项点击样式
    $(".title").click(function () {
        $(".nav-sidebar").css("height","0");
        $(".title").removeClass("currentTitle");
        $(this).addClass("currentTitle");
    });

}]);