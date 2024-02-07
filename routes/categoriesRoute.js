const express = require("express")
const router = express.Router()
const { addCategory, deleteCategory, getCategories, updateCategory } = require("../controlers/categoryCTRL.js");
const { auth, authAdmin } = require("../middlewares/auth.js");

router.get("/", getCategories)

router.post("/", auth, authAdmin, addCategory)

router.put("/:id", auth, authAdmin, updateCategory)

router.delete("/:id", auth, authAdmin, deleteCategory)

module.exports = router