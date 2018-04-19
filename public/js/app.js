var App = angular.module("App", ["ui.router","Controller"]);

App.config(['$stateProvider', '$locationProvider', "$urlRouterProvider", function ($stateProvider, $locationProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/index");
    $stateProvider
        .state("index", {
            url: '/index',
            views: {
                "main" : {
                    templateUrl : "./views/main.html"
                },
                "topbar@index" : {//这儿的index指的是url
                    templateUrl : "./views/topbar.html",
                    controller : "topBar"
                },
                "leftbar@index" : {
                    templateUrl : "./views/left.html"

                },
                "mainContent@index" : {
                    templateUrl : "./views/mainContent.html",
                    controller : "mainContent"
                }
            }

        })
        .state("index.dengjiruzhu",{
        url : "/dengjiruzhu",
            views: {
                "mainContent": {
                    templateUrl:  "/views/ruzhuguanli/checkIn.html"
                }
            }
    })
        .state("index.fangjianyuding",{
        url : "/fangjianyuding",
            views: {
                "mainContent": {
                    templateUrl:  "/views/ruzhuguanli/order.html"
                }
            }
    })
        .state("index.huanfang",{
        url : "/huanfang",
            views: {
                "mainContent": {
                    templateUrl:  "/views/ruzhuguanli/changeRoom.html"
                }
            }
    })
        .state("index.tuifang",{
        url : "/tuifang",
            views: {
                "mainContent": {
                    templateUrl:  "/views/ruzhuguanli/tuiFang.html"
                }
            }
    })
        .state("index.fangjianguanli",{
        url : "/fangjianguanli",
            views: {
                "mainContent": {
                    templateUrl:  "/views/fangjianguanli/fangjianguanli.html"
                }
            }
    })
        .state("index.yuangongxinxi",{
        url : "/yuangongxinxi",
            views: {
                "mainContent": {
                    templateUrl:  "/views/yuanGongGuanLi/yuanGongXinXi.html"
                }
            }
    })
        .state("index.yuangongkaoqing",{
        url : "/yuangongkaoqing",
            views: {
                "mainContent": {
                    templateUrl:  "/views/yuanGongGuanLi/yuanGongKaoQing.html",
                }
            }
    })
        .state("index.gongzijiesuan",{
        url : "/gongzijiesuan",
            views: {
                "mainContent": {
                    templateUrl:  "/views/yuanGongGuanLi/yuanGongGongZi.html"
                }
            }
    })
        .state("index.jingrishouru",{
        url : "/jingrishouru",
            views: {
                "mainContent": {
                    templateUrl:  "/views/jingYingFenXi/today.html",
                    controller: 'today',
                }
            }
    })
        .state("index.benyueshouru",{
        url : "/benyueshouru",
            views: {
                "mainContent": {
                    templateUrl:  "/views/jingYingFenXi/month.html",
                    controller: 'month',
                }
            }
    })
        .state("index.bennianshouru",{
        url : "/bennianshouru",
            views: {
                "mainContent": {
                    templateUrl:  "/views/jingYingFenXi/year.html",
                    controller: 'year',
                }
            }
    })


    $locationProvider.html5Mode(true);//启用html5模式

}]);