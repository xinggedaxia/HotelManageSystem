$(function () {

    var intime = "",
        outtime = "",
        days = 0,
        roomType = "",
        population = 0,
        number = "",
        zaoCan = 0,
        chuangXin = "中床",
        roomNum = "",
        price = 0;
    var timer = "";
    var timer2 = "";


    // 房间展示预定点击事件
    $(".yuDing").click(function () {

        // 初始化表单
        $("#intime").val("");
        $("#outtime").val("");
        $("#days").val("");
        $("#population").val("");
        $("#number").val("");
        $(".phone").val("");
        $(".yzm").val("");
        $("#roomType").text($(this).attr("data_type"));


        //获取房间类型
        roomType = $(this).attr("data_type");

        $(".orderView").css("display", "block");
        $(".mask").css("display", "block");
    });

    // 获取时间差
    $("#outtime").blur(function () {

        intime = $("#intime").val();
        outtime = $(this).val();

        if (intime != "" && outtime != "") {
            days = time(intime, outtime);
            $("#days").val(days);
        }
    });
    // 获取验证码
    $("#getY").click(function () {
        var c_number = 60;
        $(this).attr("disabled", "disabled");
        $(this).css("background-color", "gray");
        var timer = setInterval(function () {

            c_number--;
            if (c_number == 0) {
                $("#getY").attr("disabled", false);
                $("#getY").css("background-color", "#945C66");
                $("#getY").html("获取验证码");
                clearInterval(timer);

            }
            var txt = c_number + "s后获取";
            $("#getY").text(txt);
        }, 1000)
    })

    // 检测验证码
    $("#check").click(function () {
        if ($(".yzm").val() != "") {
            alert("验证成功!");
            $("#confirm").css("background-color", "rgb(247, 91, 8)");
        } else {
            alert("验证码错误!")
        }
    })

    //计算时间差
    function time(sDate1, sDate2) {    //sDate1和sDate2是2006-12-18格式
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

    // 房间筛选

    $(".search").click(function () {
        searchR();
    });

    //确认
    $("#confirm").click(function () {
        $(".orderView").css("display", "none");
        // $(".mask").css("display", "none");
        $(".payView").css("display", "block");
        // console.log();
        $("#money").text(price * days * 1.5);
        timer2 = setTimeout(function () {
            $(".erWeiMa").css("display", "none");
            $(".su_info").css("display", "block");
            var count = 5;
             timer = setInterval(function () {
                count--;
                if (count == 0) {
                    $(".payView").css("display", "none");
                    $(".mask").css("display", "none");

                    // 房间预定

                    $.get("/checkIn",
                        {
                            "roomNum": roomNum,
                            "number": number,
                            "intime": intime,
                            "outtime": outtime,
                            "population": parseInt($("#population").val()),
                            "deposit": price * days * 1.5,
                            "type": "房间预定",
                        },
                        function (result) {
                            if (result == true) {
                                alert("预定成功！")
                            } else {
                                alert("预定失败！");
                            }
                        });

                    clearInterval(timer);
                }
                $(".time2").text(count);
            }, 1000)
        }, 5000)
    });

    var enableRoomNum = [];

    // 根据条件查询房间
    function searchR() {
        $.get("/allRoom", function (res) {
            var allRoom = res;
            $.get("/searchRoom",
                {"intime": intime, "outtime": outtime},
                function (result) {
                    var uRoom = result;
                    var str = "";
                    zaoCan = $(".none").is(':checked') ? "0" : "1";
                    chuangXin = $("#medium").is(':checked') ? "1" : "2";
                    // 房间类型判断
                    if (roomType == "不限") {
                        str += true;
                    } else {
                        str += "room.roomType=='" + roomType + "'";
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


                    enableRoomNum = [];
                    for (var i = 0, len = allRoom.length; i < len; i++) {
                        var room = allRoom[i];
                        var flag = true;
                        for (var j = 0, len2 = uRoom.length; j < len2; j++) {
                            var room2 = uRoom[j];
                            if (room.roomNum == room2.roomNum) {
                                flag = false;
                            }
                        }

                        if (flag) {
                            if (eval(str)) {
                                enableRoomNum.push(room.roomNum);
                            }
                        }
                    }
                    if (enableRoomNum.length == 0) {
                        alert("抱歉，没找到符合的房间！")
                    } else {

                        $.get("/getPrice", {"roomNum": enableRoomNum[0]}, function (res) {
                            $("#price").text(res[0].price);
                            price = res[0].price;
                            roomNum = enableRoomNum[0];
                            $("#roomNum").text(res[0].roomNum);

                            number = $("#number").val();
                            console.log("筛选成功！")
                        });
                    }

                });
        })


    }

    // 取消预定
    $("#cancel").click(
        function () {
            $(".orderView").css("display", "none");
            $(".mask").css("display", "none");
        }
    )

    //取消付款
    $(".close").click(function () {
        clearTimeout(timer2);
        $(".payView").css("display", "none");
        $(".mask").css("display", "none");
    })
});