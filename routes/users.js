var express = require('express');
var router = express.Router();
let userModle = require('../db/userModel');
const bcrypt = require('bcrypt');

router.post('/regist', (req, res, next) => {
  let { username, password, password2 } = req.body;

  password = bcrypt.hashSync(password, 10)

  userModle.find({ username }).then(docs => {
    if (docs.length > 0) {
      res.send('用户已存在')
    } else {
      let creareTime = Date.now();
      userModle.insertMany({
        username,
        password,
        creareTime
      }).then(docs => {
        // res.send('注册成功')
        res.redirect('/login')
      }).catch(err => {
        // res.send('注册失败')
        res.send('/regist')
      })
    }
  })
})

//登录接口
router.post('/login', (req, res, next) => {
  let { username, password } = req.body;

  userModle.find({ username })
    .then(docs => {
      if (docs.length > 0) {

        var result = bcrypt.compareSync(password, docs[0].password)
        if (result) {
          req.session.username = username;
          req.session.isLogin = true;
          console.log(req.session);
          //res.send('登录成功');
          res.redirect('/')
        } else {
          res.redirect('/login')
        }
      }
      else {
        //res.send('登录失败')
        res.redirect('/login')
      }
    })
})


router.get('/logout', (req, res, next) => {
  req.session.username = null;
  req.session.isLogin = false;

  //res.send('退出成功')
  res.redirect('/login')
})
module.exports = router;
