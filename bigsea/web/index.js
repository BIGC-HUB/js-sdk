/*global Qiniu */
/*global plupload */
/*global FileProgress */
const config = {
    domain: "bigsea",
    seaurl: "http://cdn.bigc.cc/"
}


const main = function() {
    // 初始化
    const uploader = Qiniu.uploader({
        disable_statistics_report: false,
        runtimes: 'html5,flash,html4',
        browse_button: 'upload',
        container: 'container',
        drop_element: 'container',
        max_file_size: '1000mb',
        flash_swf_url: 'ku/Moxie.swf',
        dragdrop: true,
        chunk_size: '4mb',
        multi_selection: !(moxie.core.utils.Env.OS.toLowerCase() === "ios"),
        uptoken_url: '/uptoken',
        uptoken: config.uptoken_url,
        domain: config.domain,
        seaurl: config.seaurl,
        get_new_uptoken: false,
        auto_start: true,
        log_level: 0,
        init: {
            BeforeChunkUpload(up, file) {
                log('BeforeChunkUpload', file.name)
            },
            FilesAdded(up, files) {
                // $('table').show()
                // $('#success').hide()
                plupload.each(files, function(file) {
                    log('FilesAdded', file)
                    // let progress = new FileProgress(file,
                    //     'fsUploadProgress')
                    // progress.setStatus("等待...")
                    // progress.bindUploadCancel(up)
                })
            },
            BeforeUpload(up, file) {
                let size = this.getOption('chunk_size')
                let chunk_size = plupload.parseSize(size)
                if (up.runtime === 'html5' && chunk_size) {
                    log(chunk_size)
                    // progress.setChunkProgess(chunk_size)
                }
            },
            UploadProgress(up, file) {
                // 分块上传
                log('UploadProgress', file.percent + "%", file.speed)
                // let progress = new FileProgress(file, 'fsUploadProgress')
                // let chunk_size = plupload.parseSize(this.getOption('chunk_size'))
                // progress.setProgress(file.percent + "%", file.speed, chunk_size)
            },
            UploadComplete() {
                $('#success').show()
            },
            FileUploaded(up, file, info) {
                log('FileUploaded', file, info)
                // let progress = new FileProgress(file, 'fsUploadProgress')
                // console.log("response:", info.response)
                // progress.setComplete(up, info.response)
            },
            Error(up, err, errTip) {
                log('Error 出错了', err, errTip)
                // let progress = new FileProgress(err.file, 'fsUploadProgress')
                // progress.setError()
                // progress.setStatus(errTip)
            }
        }
    })
    //
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
