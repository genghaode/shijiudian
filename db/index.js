var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  models = require('./models')

mongoose.Promise = global.Promise
mongoose.connect(require('../settings').url)

var UserSchema = new Schema(models.User, { collection: 'user' })
UserSchema.pre('save', function(next) {
  this.id = this._id
  next()
})
mongoose.model('User', UserSchema)

mongoose.model('Token', new Schema(models.Token, { collection: 'token' }))

var ItemSchema = new Schema(models.Item, { collection: 'item' })
ItemSchema.pre('save', function(next) {
  this.id = this._id
  next()
})
mongoose.model('Item', ItemSchema)

var CategorySchema = new Schema(models.Category, { collection: 'category' })
CategorySchema.pre('save', function(next) {
  this.id = this._id
  next()
})
mongoose.model('Category', CategorySchema)

var CollectionSchema = new Schema(models.Collection, { collection: 'collection' })
CollectionSchema.pre('save', function(next) {
  this.id = this._id
  next()
})
mongoose.model('Collection', CollectionSchema)

var BannerSchema = new Schema(models.Banner, { collection: 'banner' })
BannerSchema.pre('save', function(next) {
  this.id = this._id
  next()
})
mongoose.model('Banner', BannerSchema)

module.exports = function(type) {
  return mongoose.model(type)
}
