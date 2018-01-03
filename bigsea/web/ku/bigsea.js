// Html 间隙
String.prototype.html = function() {
    let html = this.slice(this.indexOf('<'))
    return html.replace(/>(\s+)</img, '><')
}

// 定制方法
const log = console.log.bind(console)
const cut = (n) => {
    if (cut.count) {
        cut.count --
        if (cut.count == 1) {
            cut.off()
        }
    } else {
        if (n > 1) {
            cut.count = n
        } else {
            cut.off()
        }
    }
}
// bigsea.js
class Sea {
    constructor(select) {
        return Array.from(document.querySelectorAll(select))
    }

    static Ajax(request) {
        let req = {
            url: request.url,
            // data 传对象
            data: request.data || {},
            method: (request.method || 'POST').toUpperCase(),
            header: request.header || {},
            search: request.search || {},
            hash: request.hash,
            contentType: request.contentType || 'application/json',
            callback: request.callback,
            jsonp: request.jsonp,
            cors: request.cors,
        }
        // search
        if (Object.keys(req.search).length) {
            let arr = []
            for(let key in req.search) {
                let val = req.search[key]
                arr.push([key, val].join('='))
            }
            req.url += '?' + arr.join('&')
        }
        // hash
        if (req.hash) {
            req.url += req.hash
        }
        // cors
        if (req.cors) {
            req.data['cors_url'] = req.url
            req.data['cors_method'] = req.method
            req.url = req.cors
            req.method = 'POST'
        }
        // jsonp
        if (req.jsonp) {
            // callback
            let obj = window
            if (!Sea.has(obj, req.jsonp)) {
                let arr = req.jsonp.split('.')
                if (arr[0] === 'window') {
                    arr = arr.slice(1)
                }
                for (let k of arr.slice(0, -1)) {
                    if (!(k in obj)) {
                        obj[k] = {}
                    }
                    obj = obj[k]
                }
                let key = arr.slice(-1)[0]
                obj[key] = function(res) {
                    if (typeof req.callback === 'function') {
                        req.callback(res)
                    } else {
                        log('error: jsonp please set callback()')
                    }
                }
            }
            // html
            let s = document.createElement("script")
            s.src = req.url
            document.querySelector('body').appendChild(s)
            s.remove()
            return new Promise(function(success, fail) {
                success('error: jsonp can\'t use then()')
            })
        }
        // promise
        let promise = new Promise(function(success, fail) {
            let r = new XMLHttpRequest()
            r.open(req.method, req.url, true)
            r.setRequestHeader('Content-Type', req.contentType)
            for (let key in req.header) {
                r.setRequestHeader(key, req.header[key])
            }
            r.onreadystatechange = function() {
                if (r.readyState === 4) {
                    let res = r.response
                    // 回调函数
                    if (typeof req.callback === 'function') {
                        req.callback(res)
                    }
                    // Promise 成功
                    success(res)
                }
            }
            r.onerror = function(err) {
                fail(err)
            }
            if (req.method === 'GET') {
                r.send()
            } else {
                // POST
                r.send(JSON.stringify(req.data))
            }
        })
        return promise
    }

    static css(cls, o) {
        // Sea.css('top:hover', {'display':'block', 'cursor':'zoom-in'})
        let s = ''
        for (let key in o) {
            let val = o[key]
            s += `${key}:${val};`
        }
        if (cls) {
            s = `${cls}{${s}}`
        }
        return s
    }

    static has(obj, path) {
        // Sea.has(obj, 'a.b.c')
        let arr = path.split('.')
        if (arr[0] === 'window') {
            arr = arr.slice(1)
        }
        for (let k of arr) {
            if (k in obj) {
                obj = obj[k]
            } else {
                return false
            }
        }
        return true
    }
}

// 其它
window.eval = undefined
