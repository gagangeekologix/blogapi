const express = require("express");
const {
  registerUser,
  currentUser,
  loginUser,
  change_pass,
} = require("../controllers/userController");


const validateToken = require("../middleware/validateTokenHandler");


const router = express.Router();
const itemController = require('../controllers/blogController');

// GET all items
router.get('/items', itemController.getAllItems);

// GET a single item
router.get('/items/:id', itemController.getOneItem);

// POST a new item
router.post('/items', itemController.createItem);

// UPDATE an item
router.put('/items/:id', itemController.updateItem);

// DELETE an item
router.delete('/items/:id', itemController.deleteItem);

module.exports = router;


router.post("/register", registerUser);

router.post("/login", loginUser);
router.post("/change-password",validateToken,change_pass);

router.get("/current", validateToken, currentUser);
// router.get("/blog", validateToken, currentUser);
module.exports = router;
