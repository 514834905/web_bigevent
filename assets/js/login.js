$(function() {
    //点击去注册账号链接
    $("#link_reg").on("click", function() {
            $(".login-box").hide()
            $(".reg-box").show()
        })
        //点击去登陆的链接
    $("#link_login").on("click", function() {
        $(".reg-box").hide()
        $(".login-box").show()
    })

    var form = layui.form;
    var layer = layui.layer;
    //自定义检验规则
    form.verify({
            // 自定义了一个pwd密码校验规则
            pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
            repwd: function(value) {
                //value：表单的值、item：表单的DOM对象
                var pwd = $(".reg-box [name=password]").val()
                if (value !== pwd) {
                    return '两次密码不同';
                }
            }
        })
        //监听注册表单的提交事件

    $("#form_reg").on("submit", function(e) {
        //阻止默认行为
        e.preventDefault()
            //发起ajax的post请求
        var data = { username: $("#form_reg [name=username]").val(), password: $("#form_reg [name=password]").val() }
        $.post("/api/reguser", data, function(res) {

            if (res.status !== 0)
                return layer.msg(res.message)
            layer.msg(res.message)
            $("#link_login").click()
        })
    })


    //监听登录表单的提交事件
    $("#form_login").on("submit", function(e) {
        //阻止默认行为
        e.preventDefault()
            //发起ajax的post请求
        $.ajax({
            url: "/api/login",
            method: "POST",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) { return layer.msg(res.message) }
                layer.msg(res.message)
                localStorage.setItem("token", res.token)
                location.href = "/index.html"
            }
        })
    })

})