var myApp = angular.module("Controller",[]);

// myApp.controller("");
myApp.controller("main",["$scope","$filter","$interval",function ($scope,$filter,$interval) {
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
    //时间显示
    $interval(function(){
        var date = new Date();
        $scope.time = $filter('date')(date, 'yyyy-MM-dd HH:mm:ss ');
    },1000);

}]);