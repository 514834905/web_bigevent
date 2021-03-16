$(function() {
        //获取用户基本信息
        getUserInfo();
        //给退出绑定点击事件
        $("#loginout").on("click", function() {
            layui.layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
                //do something
                localStorage.removeItem("token")
                location.href = "/login.html"
                layer.close(index);
            });
        })
    })
    //获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: "GET",
        url: "/my/userinfo",
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            //调动renderAvater渲染用户头像
            renderAvatar(res.data)
        }
    })
}

function renderAvatar(user) {
    //获取用户名称
    var name = user.nickname || user.username;
    $("#welcome").html("欢迎&nbsp;&nbsp;" + name)
        //获取头像
    if (user.user_pic != null) {
        $(".layui-nav-img").attr("src", user.user_pic).show()
        $(".text-avatar").hide();
    } else {
        var first = name[0].toUpperCase();
        $(".text-avatar").html(first).show()
        $(".layui-nav-img").hide();
    }

}