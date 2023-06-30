const generateData = require('../component/result');
const Item = require('../models/blogModel');

// Get all items
const getAllItems = async (req, res) => {
  try {
    const items = await Item.find();
    const jsonData = generateData(200,1,"data found","no error",items);
    res.status(200).json(jsonData);
    // res.json(items);
  } catch (err) {
    const jsonData = generateData(500,0,"Data not found","User data us not found",{ error: err.message });
    res.status(500).json(jsonData);
  }
};

// Get a single item
const getOneItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const item = await Item.findById(itemId);
    if (!item) {
      const jsonData = generateData(200,1,"data not found","Item not found");
      return res.status(404).json(jsonData);
    }
    const jsonData = generateData(200,1,"data found","no error",item);
    res.status(200).json(jsonData);
  } catch (err) {
    const jsonData = generateData(500,0,"Data not found",{ error: err.message });
    res.status(500).json(jsonData);
  }
};

// Create a new item
const createItem = async (req, res) => {
  try {
    const { title, image, description } = req.body;
    const newItem = new Item({ title, image, description });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    const jsonData = generateData(500,0,"Data not found",{ error: err.message });
    res.status(500).json(jsonData);
  }
};

// Update an item
const updateItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const { title, image, description } = req.body;
    const updatedItem = await Item.findByIdAndUpdate(itemId, { title, image, description }, { new: true });
    if (!updatedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(updatedItem);
  } catch (err) {
    const jsonData = generateData(500,0,"Data not found",{ error: err.message });
    res.status(500).json(jsonData);
  }
};

// Delete an item
const deleteItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const deletedItem = await Item.findByIdAndDelete(itemId);
    if (!deletedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    const jsonData = generateData(500,0,"Data not found",{ error: err.message });
    res.status(500).json(jsonData);
  }
};

module.exports = {
  getAllItems,
  getOneItem,
  createItem,
  updateItem,
  deleteItem,
};
