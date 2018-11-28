const express = require("express");

const router = express.Router();
const UserController = require("../controllers/users");

router.get("/", UserController.get_all_users);

router.post("/signup", UserController.user_signup);

router.get("/:userId", UserController.get_user_by_id);

module.exports = router;
