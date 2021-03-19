$(function() {
    var layer = layui.layer
    var form = layui.form
        //定义一个查询的参数对象，请求数据的时候提交到服务器
    var q = {
            pagenum: 1, //页码值
            pagesize: 2, //每页数据
            cate_id: "", //分类id
            state: "" //发布状态
        }
        //定义美化时间过滤器
    function padZero(n) {
        return n > 9 ? n : "0" + n
    }
    template.defaults.imports.dataFormat = function(date) {
            const dt = new Date(date)
            var y = padZero(dt.getFullYear())
            var m = padZero(dt.getMonth() + 1)
            var d = padZero(dt.getDate())
            var hh = padZero(dt.getHours())
            var mm = padZero(dt.getMinutes())
            var ss = padZero(dt.getSeconds())
            return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss
        }
        //调用方法获取文章列表数据
    initTable()
        //调用方法初始化文章分类
    initCate()
        // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: "GET",
            url: "/my/article/list",
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取列表数据失败")
                }
                //使用模板引擎渲染数据
                var htmlStr = template("tpl-table", res)
                $("tbody").html(htmlStr);
                renderPage(res.total)
            }
        })
    }
    //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取分类数据失败")
                }
                var str_cate = template("tpl-cate", res)
                $("[name=cate_id]").html(str_cate);
                form.render("select");
            }
        })
    }
    // 为筛选表单绑定submit事件
    $("#form-search").on("submit", function(e) {
            e.preventDefault()
                //获取表单中选中的值
            var cate_id = $("[name=cate_id]").val();
            var state = $("[name=state]").val();
            q.cate_id = cate_id;
            q.state = state;
            //根据条件筛选
            initTable()
        })
        //定义渲染分页的方法
    function renderPage(total) {
        layui.use('laypage', function() {
            var laypage = layui.laypage;
            //执行一个laypage实例
            laypage.render({
                elem: 'pageBox',
                count: total,
                limit: q.pagesize,
                curr: q.pagenum,
                layout: ["count", "limit", "prev", "page", "next", "skip"],
                limits: [2, 3, 5, 10],
                jump: function(obj, first) {
                    //obj包含了当前分页的所有参数，比如：
                    q.pagenum = obj.curr //得到当前页，以便向服务端请求对应页的数据。
                    q.pagesize = obj.limit
                    if (!first) {
                        initTable()
                            //do something
                    }
                }
            });
        });
    }
    //通过代理的形式为删除按钮绑定点击事件

    $("body").on("click", ".btn-delete", function() {
            var len = $(".btn-delete").length
            var id = $(this).attr("data-id")
            layer.confirm('确定删除？', { icon: 3, title: '提示' }, function(delindex) {
                $.ajax({
                    method: "GET",
                    url: "/my/article/delete/" + id,
                    success: function(res) {
                        if (res.status !== 0) {
                            return layer.msg("删除文章分类失败")
                        }
                        layer.msg("删除文章分类成功")

                        if (len === 1) {
                            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                        }
                        initTable()
                    }
                })
                layer.close(delindex);
            });
        })
        //通过代理的形式为编辑按钮绑定点击事件
    $("body").on("click", ".btn-edit", function() {
        var id = $(this).attr("data-id")
        location.href = "/article/art_edit.html?id=" + id
    })
})