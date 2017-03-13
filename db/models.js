var mongoose = require('mongoose');

module.exports = {
  User: {
    pwd: { type: String, required: true },
    name: { type: String, required: true }
  },
  Item: {
    id: { type: Number, required: true },
    title: { type: String, required: true },
    fowllerNum: { type: Number, required: true },
    time: { type: String, required: true },
    img: { type: String, required: true },
  },
  Banner: {
    id: { type: Number, required: true },
    img: { type: String, required: true },
    url: { type: String }
  }
};
