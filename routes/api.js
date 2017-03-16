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
  if (req.query.type == 'favor') {
    if (!req.session.user) {
      return res.json({ status: false });
    }
    Model('User').findOne({ name: req.session.user.name }, (err, user) => {
      if (user.itemId.length) {
        let arr = user.itemId.map((item) => {
          return { id: item }
        })
        Model('Item').find({ $or: arr }).skip((pageNum - 1) * 10).limit(10).exec(function(err, items) {
          if (items.length) {
            return res.json({ myData: items, status: true });
          } else {
            return res.json({ myData: items, status: false });
          }
        })
      } else {
        return res.json({ status: false });
      }

    })
  } else {
    Model('Item').find({}).sort({ fowllerNum: -1 }).skip((pageNum - 1) * 10).limit(10).exec(function(err, items) {
      if (items.length) {
        res.json({ myData: items, status: true });
      } else {
        res.json({ myData: items, status: false });
      }
    })
  }

});

router.post('/postLogin', function(req, res) {
  var user = req.body;
  user.pwd = myUtil.md5(user.pwd);

  Model('User').findOne(user, function(err, user) {
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

router.get('/logout', function(req, res) {
  req.session.user = null;
  res.json({ "myData": { status: false, error: '退出登录成功' } })
});

router.get('/getCategoryData', function(req, res, next) {
  Model('Category').find({}).sort({ id: 1 }).exec(function(err, category) {
    if (category.length) {
      res.json({ myData: category, status: true });
    } else {
      res.json({ myData: category, status: false });
    }
  })
});

router.get('/getItemContent', function(req, res, next) {
  Model('Item').find({ id: req.query.id }, function(err, content) {
    content[0].fowllerFlag = false
    console.log(req.session.user)
    if (req.session.user) {
      Model('User').findOne({ name: req.session.user.name }, function(err, user) {
        if (user.itemId.length && user.itemId.includes(req.query.id)) {
          content[0].fowllerFlag = true
        }
        res.json({ myData: content, status: true });
      })
    } else {
      res.json({ myData: content, status: false });
    }
  })
});

router.get('/getFowllerFlag', myUtil.checkLogin, function(req, res, next) {
  if (!req.session.user) {
    return res.json({ myData: { 'fowllerFlag': false } });
  }
  Model('User').findOne({ name: req.session.user.name }, function(err, user) {
    let flag = false;
    let obj = {}
    if (user.itemId.length && user.itemId.includes(req.query.id)) {
      obj = { $pull: { 'itemId': req.query.id } }
    } else {
      flag = true
      obj = { $push: { 'itemId': req.query.id } }
    }
    Model('User').update({ name: req.session.user.name }, obj, function(err, user) {
      res.json({ myData: { 'fowllerFlag': flag } });
    })
  })
});

module.exports = router;
