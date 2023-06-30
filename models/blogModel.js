const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add the title"],
  },
  image: {
    type: String,
    required: [true, "Please add the image URL"],
  },
  description: {
    type: String,
    required: [true, "Please add the description"],
  },
}, {
  timestamps: true,
});



const Item = mongoose.model('Item', itemSchema);

module.exports = Item;