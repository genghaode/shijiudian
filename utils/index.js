exports.md5 = function(val) {
  return require('crypto').createHash('md5').update(val).digest('hex');
};

exports.checkLogin = function(req, res, next) {
  if (!req.session.user) {
    return res.json({ "myData": { status: false } });
  }
  next();
}

exports.checkNotLogin = function(req, res, next) {
  if (req.session.user) {
    return res.json({ "myData": { status: true, session: req.session.user } });
  }
  next();
}
