var express = require('express');
var router = express.Router();

var Model = require('../db');
var myUtil = require('../utils');

router.get('/getBanner', function(req, res, next) {
  Model('Banner').find({}).sort({ id: 1 }).exec(function(err, banners) {
    if (banners.length) {
      res.json({ myData: banners, status: true });
    } else {
      res.json({ myData: banners, status: false });
    }
  })
});

router.get('/getItemList', function(req, res, next) {
  var pageNum = req.query.pageNum && req.query.pageNum > 0 ? parseInt(req.query.pageNum) : 1;
  Model('Item').find({}).sort({ fowllerNum: -1 }).skip((pageNum - 1) * 10).limit(10).exec(function(err, items) {
    if (items.length) {
      res.json({ myData: items, status: true });
    } else {
      res.json({ myData: items, status: false });
    }
  })
});

router.post('/postLogin', function(req, res) {
  var user = req.body;
  user.pwd = myUtil.md5(user.pwd);

  Model('User').findOne(user, function(err, user) {
    console.log(user)
    if (err) {
      return res.json({ "myData": { status: false, error: '登录失败' } });
    }
    if (user) {
      req.session.user = user;
      return res.json({ "myData": { status: true, error: '登录成功' } });
    } else {
      return res.json({ "myData": { status: false, error: '用户名或密码不正确' } });
    }
  })
});

module.exports = router;
