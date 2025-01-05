const express = require("express");
const router = express.Router();
const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    loginUser
  } = require("../controllers/users");

/** get all users */
router.get("/", getUsers);

/** getById user */
router.get("/:id", getUser);

/** create user */
router.post("/", createUser);

/** update user */
router.put("/:id", updateUser);

/** delete user */
router.delete("/:id", deleteUser);

/** login user */
router.post("/login", loginUser);

/** register user */
router.post("/register", createUser);

module.exports = router;