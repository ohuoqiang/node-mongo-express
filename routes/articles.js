const express = require('express');
const { findById } = require('../db/articleModel');
const fs = require('fs')
const path = require('path')
let router = express.Router();
var multiparty = require('multiparty');//处理文件上传
let articleModel = require('../db/articleModel');


router.post('/write', (req, res, next) => {
    let { title, content, username, id } = req.body;

    let createTime = Date.now()
    if (id) {
        // 修改文章
        id = new Object(id);
        articleModel.updateOne({ _id: id }, {
            title, content, createTime, username
        }).then(data => {
            // res.send('文章修改成功');
            res.redirect('/')
        }).catch(err => {
            // res.send('文章修改失败')
            res.redirect('/write')
        })
    } else {
        let username = req.session.username;
        articleModel.insertMany({
            username,
            title,
            content,
            createTime
        }).then(data => {

            //res.send('文章写入成功')
            res.redirect('/')
        }).catch(err => {
            res.send('文章写入失败')
        })
    }
})


router.get('/delete', (req, res, next) => {
    let id = req.query.id;
    id = new Object(id);
    // 删除
    articleModel.deleteOne({ _id: id })
        .then(data => {
            //res.send('文章删除成功');
            res.redirect('/')
        })
        .catch(err => {
            res.send('文章删除失败')
            //res.redirect('/')
        })
})

router.post('/upload', (req, res, next) => {
    // 每次访问该接口,都新建一个form对象来解析文件数据
    var form = new multiparty.Form();
    form.parse(req, (err, field, files) => {
        if (err) {
            console.log('文件上传失败')
        } else {
            // console.log('----field-----')
            // console.log(field)
            var file = files.filedata[0];
            // console.log('----file-----')
            // console.log(file)
            // 读取流
            var read = fs.createReadStream(file.path);
            // 写入流
            var write = fs.createWriteStream(path.join(__dirname, "..", 'public/imgs/', file.originalFilename))
            // 管道流,图片写入指定目录
            read.pipe(write);
            write.on('close', function () {
                console.log('图片上传完成')
                res.send({
                    err: 0,
                    msg: '/imgs/' + file.originalFilename
                })
            })
        }
    })
})



module.exports = router;