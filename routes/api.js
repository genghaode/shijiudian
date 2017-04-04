var express = require('express')
var router = express.Router()
var uuid = require('uuid')

var Model = require('../db')
var myUtil = require('../utils')

router.get('/token', function(req, res, next) {
  var token = uuid.v4()
  Token.create({ token, expire: myUtil.AfterOneHour() })
  res.json({
    code: 0,
    errorMessage: '',
    data: null,
    token: token
  })
})

router.get('/banner', function(req, res, next) {
  Model('Banner').find({}).sort({ id: 1 }).exec(function(err, banners) {
    if (banners.length) {
      res.json({
        code: 0,
        errorMessage: '',
        data: banners,
      })
    } else {
      res.json({
        code: 1000,
        errorMessage: '轮播图数据为空',
        data: null,
      })
    }
  })
})

router.get('/item', function(req, res, next) {
  var start = req.query.start && req.query.start > 0 ? parseInt(req.query.start) : 1
  var take = req.query.take && req.query.take > 0 ? parseInt(req.query.take) : 10
  var type = req.query.type
  var key = req.query.key

  if (type == 'collection') {
    if (!req.session.user) {
      return res.json({
        code: 1000,
        errorMessage: '没有登录',
        data: null,
      })
    }

    Model('Collection').find({ user: req.session.user.id }, (err, collections) => {
      if (collections.length) {
        let arr = collections.map((data) => {
          return { id: data.item }
        })
        Model('Item').find({ $or: arr }).skip((start - 1) * take).limit(take).exec(function(err, items) {
          if (items.length) {
            return res.json({
              code: 0,
              errorMessage: '',
              data: {
                items: items,
                total: arr.length
              }
            })
          } else {
            return res.json({
              code: 0,
              errorMessage: '没有数据了',
              data: {
                items: null,
                total: arr.length
              }
            })
          }
        })
      } else {
        return res.json({
          code: 0,
          errorMessage: '没有数据了',
          data: {
            items: null,
            total: 0
          }
        })
      }

    })
  } else if (type == 'search') {
    const re = new RegExp(key, 'ig')
    Model('Item').count({ title: re }, function(err, count) {
      Model('Item').find({ title: re }).sort({ id: -1 }).skip((start - 1) * take).limit(take).exec(function(err, items) {
        if (items.length) {
          res.json({
            code: 0,
            errorMessage: '',
            data: {
              items: items,
              total: count
            }
          })
        } else {
          res.json({
            code: 0,
            errorMessage: '没有数据了',
            data: {
              items: null,
              total: count
            }
          })
        }
      })
    })
  } else if (type == 'category') {
    Model('Item').count({ category: key }, function(err, count) {
      if (count) {
        Model('Item').find({ category: key }).sort({ id: -1 }).skip((start - 1) * take).limit(take).exec(function(err, items) {
          if (items.length) {
            res.json({
              code: 0,
              errorMessage: '',
              data: {
                items: items,
                total: count
              }
            })
          } else {
            res.json({
              code: 0,
              errorMessage: '没有数据了',
              data: {
                items: null,
                total: count
              }
            })
          }
        })
      } else {
        res.json({
          code: 0,
          errorMessage: '没有数据了',
          data: {
            items: null,
            total: count

          }
        })
      }

    })
  } else {
    Model('Item').count({}, function(err, count) {
      if (count) {
        Model('Item').find({}).sort({ id: -1 }).skip((start - 1) * take).limit(take).exec(function(err, items) {
          if (items.length) {
            res.json({
              code: 0,
              errorMessage: '',
              data: {
                items: items,
                total: count
              }
            })
          } else {
            res.json({
              code: 0,
              errorMessage: '没有数据了',
              data: {
                items: null,
                total: count
              }
            })
          }
        })
      }
    })
  }
})

router.get('/login', function(req, res) {
  var mobile = req.query.mobile
  var password = myUtil.md5(req.query.password)

  Model('User').findOne({ mobile, password }, function(err, user) {
    if (err) {
      return res.json({
        code: 1000,
        data: null,
        errorMessage: '登录失败',
      })
    }
    if (user) {
      req.session.user = user
      return res.json({
        code: 0,
        data: null,
        errorMessage: '登录成功',
      })
    } else {
      return res.json({
        code: 1000,
        data: null,
        errorMessage: '用户或密码不正确',
      })
    }
  })
})

router.get('/logout', function(req, res) {
  req.session.user = null;
  res.json({
    code: 0,
    data: null,
    errorMessage: '退出成功',
  })
})

router.get('/category', function(req, res, next) {
  Model('Category').find({}).sort({ id: 1 }).exec(function(err, category) {
    if (category.length) {
      res.json({
        code: 0,
        data: category,
        errorMessage: '',
      })
    } else {
      res.json({
        code: 1000,
        data: null,
        errorMessage: '没有分类数据',
      })
    }
  })
})

router.get('/itemView', function(req, res, next) {
  Model('Item').findOne({ id: req.query.key }, function(err, item) {
    if (item) {
      if (req.session.user) {
        Model('Collection').findOne({ user: req.session.user.id, item: item.id }, function(err, ret) {
          if (ret) {
            item.isCollection = true
            res.json({
              code: 0,
              data: item,
              errorMessage: '',
            })
          } else {
            item.isCollection = false
            res.json({
              code: 0,
              data: item,
              errorMessage: '',
            })
          }
        })
      } else {
        item.isCollection = false
        res.json({
          code: 0,
          data: item,
          errorMessage: '',
        })
      }
    } else {
      res.json({
        code: 1000,
        data: null,
        errorMessage: '没有数据',
      })
    }
  })
})

router.put('/collection', myUtil.checkLogin, function(req, res, next) {
  if (!req.session.user) {
    return res.json({
      code: 1000,
      data: null,
      errorMessage: '没有登录',
    })
  }

  Model('Collection').findOne({ user: req.session.user.id, item: req.query.key }, function(err, collection) {
    if (collection) {
      Model('Collection').remove({ id: collection.id }, function(err, collection) {
        res.json({
          code: 0,
          data: { isCollection: false },
          errorMessage: '',
        })
      })
    } else {
      Model('Collection').create({ user: req.session.user.id, item: req.query.key }, function(err, collection) {
        console.log(collection)
        res.json({
          code: 0,
          data: { isCollection: true },
          errorMessage: '',
        })
      })
    }
  })
})

module.exports = router
