const express = require('express')
const router = express.Router()
const { getProjects, addProject, getProjectById, getProjectsByCategory, addImgToProject, getFavouriteProjects, deleteProject, updateProject }
    = require("../controlers/projectCTRL")
const { auth, authAdmin } = require("../middlewares/auth")

router.get("/", getProjects)

router.get("/favourites", getFavouriteProjects)

router.get("/single/:id", getProjectById)

router.get("/category/:cat", getProjectsByCategory)

router.post("/", auth, authAdmin, addProject)

router.post("/uploadImg/:id", auth, authAdmin, addImgToProject)

router.delete("/:id", auth, authAdmin, deleteProject)

router.put("/:id", auth, authAdmin, updateProject)

module.exports = router