exports.md5 = function(val) {
  return require('crypto').createHash('md5').update(val).digest('hex');
};

exports.checkLogin = function(req, res, next) {
  if (!req.session.user) {
    return res.json({
      code: 1000,
      data: null,
      errorMessage: '没有登录',
    });
  }
  next();
}

exports.checkNotLogin = function(req, res, next) {
  if (req.session.user) {
    return res.json({
      code: 0,
      data: null,
      errorMessage: '登录成功',
    });
  }
  next();
}

exports.AfterOneHour = function(req, res, next) {
  return new Date(Date.now() + 60 * 60 * 1000)
}
