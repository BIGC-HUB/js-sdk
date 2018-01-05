/*global Qiniu */
/*global plupload */
/*global FileProgress */
const config = {
    domain: "bigsea",
    seaurl: "http://cdn.bigc.cc/"
    seakey: "hasaki/"
}

const main = function() {
    // 初始化
    const uploader = Qiniu.uploader({
        disable_statistics_report: false,
        // 上传模式，依次退化
        runtimes: 'html5,flash,html4',
        // 上传选择的点选按钮，必需
        browse_button: 'upload',
        container: 'container',
        drop_element: 'container',
        max_file_size: '1000mb',
        flash_swf_url: 'ku/Moxie.swf',
        // 开启可拖曳上传
        dragdrop: true,
        chunk_size: '4mb',
        multi_selection: !(moxie.core.utils.Env.OS.toLowerCase() === "ios"),
        // uptoken是上传凭证
        uptoken_url: '/uptoken',
        domain: config.domain,
        seaurl: config.seaurl,
        // 设置上传文件的时候是否每次都重新获取新的uptoken
        get_new_uptoken: false,
        auto_start: true,
        log_level: 0,
        init: {
            BeforeChunkUpload(up, file) {
                log('BeforeChunkUpload', file.name)
            },
            // 文件添加进队列后，处理相关的事情
            FilesAdded(up, files) {
                plupload.each(files, function(file) {
                    log('FilesAdded', file)
                })
            },
            // 每个文件上传前，处理相关的事情
            BeforeUpload(up, file) {
                let chunk_size = plupload.parseSize(this.getOption('chunk_size'))
                if (up.runtime === 'html5' && chunk_size) {
                    log(chunk_size)
                }
            },
            // 每个文件上传时，处理相关的事情
            UploadProgress(up, file) {
                // 分块上传
                let chunk_size = plupload.parseSize(this.getOption('chunk_size'))
                log('UploadProgress', file.percent + "%", file.speed, chunk_size)
            },
            // 队列文件处理完毕
            UploadComplete() {
                $('#success').show()
            },
            // 每个文件上传成功后
            FileUploaded(up, file, info) {
                log('FileUploaded', file, info.response)
            },
             //上传出错
            Error(up, err, errTip) {
                log('Error 上传出错', err, errTip)
            },
            Key(up, file) {
                return config.seakey + file.name
            }
        }
    })
    // plupload
    uploader.bind('BeforeUpload', function() {
        console.log("hello man, 准备上传！")
    })
    uploader.bind('FileUploaded', function() {
        console.log('hello man, 上传完成！')
    })

    // 拖动上传
    $('#container').on('dragenter', function(e) {
        e.preventDefault()
        $('#container').addClass('draging')
        e.stopPropagation()
    }).on('drop', function(e) {
        e.preventDefault()
        $('#container').removeClass('draging')
        e.stopPropagation()
    }).on('dragleave', function(e) {
        e.preventDefault()
        $('#container').removeClass('draging')
        e.stopPropagation()
    }).on('dragover', function(e) {
        e.preventDefault()
        $('#container').addClass('draging')
        e.stopPropagation()
    })
}
main()
