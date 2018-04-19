$("#login").click(function () {
    var username = $("#username").val();
    var password = $("#password").val();
    //隐藏提示框
    $(".tishi").css("display", "none");
    //发送请求
    $.post("/checkManager", {"username": username, password: password}, function (data) {
        if (data.result == false) {
            $(".tishi").css("display", "block");
        } else {
            window.location.href = "/index";
        }
    });
});