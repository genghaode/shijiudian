var mongoose = require('mongoose');

module.exports = {
  User: {
    pwd: { type: String, required: true },
    name: { type: String, required: true },
    itemId: { type: Array }
  },
  Item: {
    id: { type: Number, required: true },
    title: { type: String, required: true },
    fowllerNum: { type: Number, required: true },
    time: { type: String, required: true },
    img: { type: String, required: true },
    content: { type: String, require: true },
    fowllerFlag: { type: Boolean, require: true }
  },
  Banner: {
    id: { type: Number, required: true },
    img: { type: String, required: true },
    url: { type: String }
  },
  Category: {
    id: { type: Number, required: true },
    text: { type: String, required: true },
    icon: { type: String, required: true }
  }
};
