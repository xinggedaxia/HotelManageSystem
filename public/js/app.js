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
                    templateUrl : "./views/topbar.html"
                },
                "leftbar@index" : {
                    templateUrl : "./views/left.html"
                },
                "mainContent@index" : {
                    templateUrl : "./views/mainContent.html"
                }
            }

        })
        .state("index.dengjiruzhu",{
        url : "/dengjiruzhu",
            views: {
                "mainContent": {
                    template:  "<div style='padding:300px'>我是入住登记的页面</div>"
                }
            }
    })
        .state("index.fangjianyuding",{
        url : "/fangjianyuding",
            views: {
                "mainContent": {
                    template:  "<div style='padding:200px'>我是房间预定的页面</div>"
                }
            }
    })
        .state("index.huanfang",{
        url : "/huanfang",
            views: {
                "mainContent": {
                    template:  "<div style='padding:200px'>我是换房的页面</div>"
                }
            }
    })
        .state("index.tuifang",{
        url : "/tuifang",
            views: {
                "mainContent": {
                    template:  "<div style='padding:200px'>我是退房的页面</div>"
                }
            }
    })
        .state("index.zaixianyuding",{
        url : "/zaixianyuding",
            views: {
                "mainContent": {
                    template:  "<div style='padding:200px'>我是zaixianyuding的页面</div>"
                }
            }
    })
        .state("index.yuangongxinxi",{
        url : "/yuangongxinxi",
            views: {
                "mainContent": {
                    template:  "<div style='padding:200px'>我是yuangongxinxi的页面</div>"
                }
            }
    })
        .state("index.yuangongkaoqing",{
        url : "/yuangongkaoqing",
            views: {
                "mainContent": {
                    template:  "<div style='padding:200px'>我是yuangongkaoqing的页面</div>"
                }
            }
    })
        .state("index.gongzijiesuan",{
        url : "/gongzijiesuan",
            views: {
                "mainContent": {
                    template:  "<div style='padding:200px'>我是gongzijiesuan的页面</div>"
                }
            }
    })
        .state("index.jingrishouru",{
        url : "/jingrishouru",
            views: {
                "mainContent": {
                    template:  "<div style='padding:200px'>我是jingrishouru的页面</div>"
                }
            }
    })
        .state("index.benyueshouru",{
        url : "/benyueshouru",
            views: {
                "mainContent": {
                    template:  "<div style='padding:200px'>我是benyueshouru的页面</div>"
                }
            }
    })
        .state("index.bennianshouru",{
        url : "/bennianshouru",
            views: {
                "mainContent": {
                    template:  "<div style='padding:200px'>我是bennianshouru的页面</div>"
                }
            }
    })


    $locationProvider.html5Mode(true);//启用html5模式

}]);