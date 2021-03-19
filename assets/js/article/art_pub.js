$(function() {
    var layer = layui.layer
    var form = layui.form
        //调用加载文章类别的方法
    initCate()
        // 初始化富文本编辑器
    initEditor()
        //定义加载文章类别的方法
    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章分类失败")
                }
                var htmlStr = template('tpl_cate', res)
                $("[name=cate_id]").html(htmlStr);
                form.render()
            }
        })
    }

    // 为选择封面的按钮绑定点击事件处理函数
    $("#chooseImage").on("click", function() {
            $("#coverFile").click()
        })
        //监听文件上传的事件
    $("#coverFile").on("change", function(e) {
        if (e.target.files.length == 0) {
            return
        }
        var file = e.target.files[0]
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域

    })

    var art_state = "已发布";
    //为存为草稿按钮绑定点击事件
    $("#btn-save").on("click", function() {
        art_state = "草稿";
    })

    // 为表单绑定提交事件
    $("#form-pub").on("submit", function(e) {
            e.preventDefault();
            //基于表单快速创建FormData对象
            var fd = new FormData($(this)[0])
                //将文章发布状态存进去
            fd.append("state", art_state)
            $image
                .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                    width: 400,
                    height: 280
                })
                .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                    // 得到文件对象后，进行后续的操作
                    fd.append("cover_img", blob)
                    publishArticle(fd)
                })

        })
        //定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: "POST",
            url: "/my/article/add",
            data: fd,
            // 如果向服务器提交formdata格式的数据，必须添加2个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("发布文章失败")
                }
                layer.msg("发布文章成功")
                location.href = "/article/art_list.html"
            }
        })
    }



    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
})