const path = require("path");
const { ProjectModel, validateProject } = require("../models/projectModel");
const { stack } = require("../routes/usersRoute");
const fs = require("fs").promises

const projectCTRL = {
    getProjects: async (_, res, next) => {
        try {
            const projects = await ProjectModel.find({});
            res.status(200).json(projects);
        } catch (err) {
            next({ stack: err })
        }
    },
    getFavouriteProjects: async (_, res, next) => {
        try {
            const projects = await ProjectModel.find({ favourite: true });
            res.status(200).json(projects);
        } catch (err) {
            next({ stack: err })
        }
    },
    getProjectById: async ({ params }, res, next) => {
        try {
            const project = await ProjectModel.findOne({ _id: params.id });
            res.status(200).json(project);
        } catch (err) {
            next({ stack: err })
        }
    },
    getProjectsByCategory: async ({ params }, res, next) => {
        try {
            const projects = await ProjectModel.find({ categories: params.cat });
            res.status(200).json(projects);
        } catch (err) {
            next({ stack: err })
        }
    },
    addProject: async ({ body, files }, res, next) => {
        console.log(files);
        console.log(body);
        const validate = validateProject(body)
        if (validate.error) {
            return next({ status: 400, stack: validate.error.details })
        }
        try {
            const project = new ProjectModel(body);
            await project.save();
            res.status(201).json(project);
        } catch (err) {
            next({ stack: err })
        }
    },
    addImgToProject: async (req, res, next) => {
        try {
            let _id = req.params.id;
            let project = await ProjectModel.findOne({ _id })
            if (!project) {
                return next({ status: 400, message: "Project id not found" })
            }

            const imagesNames = {
                mainImage: req.files?.mainImg?.[0].filename || false,
                images: req.files?.projectImgs ? req.files.projectImgs.map(i => i.filename) : false,
                plans: req.files?.projectPlans ? req.files.projectPlans.map(i => i.filename) : false
            }

            if (!imagesNames.images && !imagesNames.mainImage && !imagesNames.plans) {
                return res.status(200).json({ msg: "no file was uploaded" });
            }

            let updateObj = {}

            if (imagesNames.mainImage) {
                updateObj = { $set: { mainImage: imagesNames.mainImage } }
            }

            if (imagesNames.images) {
                updateObj = { ...updateObj, $push: { images: imagesNames.images } }
            }

            if (imagesNames.plans) {
                updateObj = { ...updateObj, $push: { plans: imagesNames.plans } }
            }

            console.log("updateObj: ", updateObj);

            const update = await ProjectModel.updateOne({ _id }, updateObj)
            res.status(200).json({ mainImage: imagesNames.mainImage || "wasnt uploaded", images: imagesNames.images || "wasnt uploaded", plans: imagesNames.plans || "wasnt uploaded", update });
        }
        catch (err) {
            next({ stack: err })

        }

    },
    deleteMainImage: async ({ params }, res, next) => {
        let _id = params.id;
        try {
            const { mainImage } = await ProjectModel.findOne({ _id }, { _id: 0, mainImage: 1 })

            if (!mainImage || mainImage == "") {
                return next({ status: 400, message: "Current project doesn't have a main image yet" })
            }
            const imgPath = path.join(__dirname, "..", 'public/uploads/' + mainImage)

            try {
                await fs.unlink(imgPath);
            } catch (error) {
                if (error.errno != -4058) {
                    throw error
                }
            }

            const data = await ProjectModel.updateOne({ _id }, { $set: { mainImage: "" } })
            return res.status(200).json({ msg: "Main image deleted successfully", update: data })
        }
        catch (err) {
            next({ stack: err })
        }
    },

    deleteFromImages: async ({ params, body }, res, next) => {
        let _id = params.id;
        let imagesNames = body.imagesToDelete
        let plansNames = body.plansToDelete
        try {
            if (!imagesNames && !plansNames) {
                return next({ status: 400, message: "You have to send array of image or plans names to delete" })
            }

            if (imagesNames) {
                imagesNames.forEach(async (i) => {
                    try {
                        const imgPath = path.join(__dirname, "..", 'public/uploads/' + i)
                        await fs.unlink(imgPath);
                    } catch (error) {
                        if (error.errno != -4058) {
                            throw error
                        }
                    }
                })
            }

            if (plansNames) {
                plansNames.forEach(async (i) => {
                    try {
                        const imgPath = path.join(__dirname, "..", 'public/uploads/' + i)
                        await fs.unlink(imgPath);
                    } catch (error) {
                        if (error.errno != -4058) {
                            throw error
                        }
                    }
                })
            }

            const updateObj = {
                images: imagesNames && { $in: imagesNames },
                plans: plansNames && { $in: plansNames },
            }
            const data = await ProjectModel.updateOne({ _id }, { $pull: updateObj })
            return res.status(200).json({ msg: "Images deleted successfully", update: data })
        }
        catch (err) {
            next({ stack: err })
        }
    },
    updateProject: async ({ body, params }, res, next) => {
        const validate = validateProject(body)
        if (validate.error) {
            return next({ status: 400, stack: validate.error.details })
        }
        try {
            const data = await ProjectModel.updateOne({ _id: params.id }, body);
            res.json(data);
        } catch (err) {
            next({ stack: err })
        }
    },
    deleteProject: async ({ params }, res, next) => {
        try {
            const { mainImage, images } = await ProjectModel.findOne({ _id: params.id }, { mainImage: 1, images: 1 })

            console.log(mainImage, images);


            const imgPath = path.join(__dirname, "..", 'public/uploads/' + mainImage)
            console.log(await fs.unlink(imgPath));

            images.forEach(async (i) => {
                try {
                    const imgPath = path.join(__dirname, "..", 'public/uploads/' + i)
                    await fs.unlink(imgPath);
                } catch (error) {
                    if (error.code == "ENOENT") {
                        return next({ status: 400, message: "The file " + i + " dosn't exist" })
                    }
                }
            })
            const data = await ProjectModel.deleteOne({ _id: params.id })
            res.json(data)
        } catch (err) {
            next({ stack: err })
        }
    },
};

module.exports = projectCTRL;