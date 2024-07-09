const express = require('express')
const { getProjects, addProject, getProjectById, deleteMainImage, getProjectsByCategory, addImgToProject, getFavouriteProjects, deleteProject, updateProject, deleteFromImages }
    = require("../controlers/projectCTRL")
const { auth, authAdmin } = require("../middlewares/auth")
const { upload } = require('../middlewares/uploadFiles')

const router = express.Router()

router.get("/", getProjects)

router.get("/favourites", getFavouriteProjects)

router.get("/single/:id", getProjectById)

router.get("/category/:cat", getProjectsByCategory)

router.post("/", auth, authAdmin, addProject)

router.post("/uploadImgs/:id", auth, authAdmin, upload.fields([{ name: "mainImg", maxCount: 1 }, { name: "projectImgs", maxCount: 5 }, { name: "projectPlans", maxCount: 5 }]), addImgToProject)

router.delete("/deleteMainImage/:id", auth, authAdmin, deleteMainImage)

router.post("/deleteImages/:id", auth, authAdmin, deleteFromImages)

router.delete("/:id", auth, authAdmin, deleteProject)

router.put("/:id", auth, authAdmin, updateProject)

module.exports = router