const log = console.log.bind(console, '>>>')
// 引入 express 并且创建一个 express 实例赋值给 app
const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')

const Sea = {
    // 本地 ip
    getLocalIP() {
        let os = require("os")
        let interfaces = os.networkInterfaces ? os.networkInterfaces() : {}
        let arr = []
        for (let k in interfaces) {
            for (let k2 in interfaces[k]) {
                let address = interfaces[k][k2]
                if (address.family === "IPv4" && !address.internal) {
                    arr.push(address.address)
                }
            }
        }
        return arr[0]
    },
}
const app = express()

// 公开文件
app.use(express.static('web'))

// 设置 bodyParser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// 主页
app.get('/', (req, res) => {
    res.send(fs.readFileSync('web/index.html', 'utf8'))
})

const config = require('../data/config.js')
const qiniu = require('qiniu')
Sea.mac = new qiniu.auth.digest.Mac(config.AccessKey, config.SecretKey)
Sea.putPolicy = new qiniu.rs.PutPolicy({
    scope: config.Bucket,
    deleteAfterDays: 7,
})
Sea.bucketManager = new qiniu.rs.BucketManager(Sea.mac, null)

app.get('/uptoken', function(req, res, next) {
    let token = Sea.putPolicy.uploadToken(Sea.mac)
    // res.header("Cache-Control", "max-age=0, private, must-revalidate")
    // res.header("Pragma", "no-cache")
    // res.header("Expires", 0)
    if (token) {
        res.json({
            uptoken: token
        })
    }
})

// 404
app.use((req, res) => {
    res.status(404)
    res.send('<h1>404<hr>页面未找到</h1>')
})
// 500
app.use((err, req, res, next) => {
    console.error('出现错误', err.stack)
    res.status(500)
    res.send('<h1>500<hr>出现错误</h1>')
})

// listen 函数监听端口
let server = app.listen(8000, '0.0.0.0', function () {
    let ip = server.address().address
    if (ip === '0.0.0.0') {
        ip = Sea.getLocalIP()
    }
    let port = server.address().port
    console.log("应用实例，访问地址为 http://%s:%s", ip, port)
})
