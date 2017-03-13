var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  models = require('./models');

mongoose.connect(require('../settings').url);

mongoose.model('User', new Schema(models.User));
mongoose.model('Item', new Schema(models.Item));
mongoose.model('Banner', new Schema(models.Banner));

module.exports = function(type) {
  return mongoose.model(type);
};
