var mongoose = require('mongoose')
var ObjectId = mongoose.Schema.Types.ObjectId

module.exports = {
  User: {
    id: { type: ObjectId, required: false },
    mobile: { type: String },
    password: { type: String },
    name: { type: String },
    avatar: { type: String },
  },
  Token: {
    id: { type: String },
    user: { type: ObjectId, ref: 'User' },
    token: { type: String },
    expire: { type: Date },
  },
  Item: {
    id: { type: ObjectId, required: false },
    category: { type: ObjectId, ref: 'Category' },
    title: { type: String },
    author: { type: String },
    content: { type: [String] },
    create_time: { type: Date, default: Date.now },
    image: { type: String },
  },
  Category: {
    id: { type: ObjectId, required: false },
    name: { type: String },
    image: { type: String },
  },
  Collection: {
    id: { type: ObjectId, required: false },
    item: { type: ObjectId, ref: 'Item' },
    user: { type: ObjectId, ref: 'User' },
  },
  Banner: {
    id: { type: ObjectId, required: false },
    weight: { type: String, default: 0 },
    image: { type: String },
    url: { type: String },
  },
}
