$(function() {
    var form = layui.form;
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须要在1~6个字符之间';
            }
        }
    })
    initUserInfo()

    function initUserInfo() {
        $.ajax({
            method: "GET",
            url: "/my/userinfo",
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                //渲染信息到表单里去

                form.val("formTest", res.data);
            }
        })
    }

    // 重置表单数据
    $("#btn-reset").on("click", function(e) {
        e.preventDefault();
        initUserInfo();
    })
    $(".layui-form").on("submit", function(e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/userinfo",
            data: $(".layui-form").serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg("更新信息失败")
                }
                layui.layer.msg("更新信息成功")
                window.parent.getUserInfo()
            }
        })
    })
})