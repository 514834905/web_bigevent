$(function() {
    innitArtCateList()
    var layer = layui.layer
    var form = layui.form
        //添加获取文章分类方法
    function innitArtCateList() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg("获取文章分类失败")
                }

                var htmlStr = template('tpl_table', res)
                $("tbody").html(htmlStr)
            }
        })
    }
    // 为添加类别按钮绑定点击事件
    var addindex = null;
    $("#btnAddCate").on("click", function() {
            addindex = layer.open({
                type: 1,
                title: '添加文章分类',
                area: ['500px', '250px'],
                content: $("#dialog-add").html()
            });
        })
        //通过代理的方法为form-add绑定提交事件
    $("body").on("submit", "#form-add", function(e) {
            e.preventDefault();
            $.ajax({
                method: "POST",
                url: "/my/article/addcates",
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layui.layer.msg("新增分类失败")
                    }
                    innitArtCateList()
                    layer.close(addindex)
                    layui.layer.msg("新增分类成功")
                }
            })
        })
        // 通过代理的方法为编辑按钮绑定点击事件
    var editindex = null;
    $("body").on("click", ".btn-edit", function() {
            editindex = layer.open({
                type: 1,
                title: '修改文章分类',
                area: ['500px', '250px'],
                content: $("#dialog-edit").html()
            });
            var id = $(this).attr("data-id")
            $.ajax({
                method: "GET",
                url: "/my/article/cates/" + id,
                success: function(res) {
                    form.val("form-edit", res.data)
                }
            })
        })
        //通过代理的方法为form-edit绑定提交事件
    $("body").on("submit", "#form-edit", function(e) {
            e.preventDefault();
            $.ajax({
                method: "POST",
                url: "/my/article/updatecate",
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg("编辑分类失败")
                    }
                    innitArtCateList()
                    layer.close(editindex)
                    layer.msg("编辑分类成功")
                }
            })
        })
        // 通过代理的方法为删除按钮绑定点击事件
    var delindex = null;
    $("tbody").on("click", ".btn-del", function() {
        var id = $(this).attr("data-id")
        delindex = layer.confirm('确定删除？', { icon: 3, title: '提示' }, function(delindex) {
            $.ajax({
                method: "GET",
                url: "/my/article/deletecate/" + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg("删除分类失败")
                    }
                    layer.msg("删除分类成功")
                    innitArtCateList()
                }
            })
            layer.close(delindex);
        });
    })
})