const { ProjectModel, validateProject } = require("../models/projectModel");
const { fileUpload } = require("../utils/fileupload")

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
    addProject: async ({ body }, res, next) => {
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
    addImgToProject: async ({ params, files }, res, next) => {
        try {
            let _id = params.id;
            let project = await ProjectModel.findOne({ _id })
            if (!project) {
                return next({ status: 400, message: "Project id not found" })
            }

            const data = await fileUpload(files, "projectImg", `${Date.now()}_`, 5, [".png", ".jpg", ".gif"]);
            const imgNames = Array.isArray(data) ? data.map((item) => item.fileName) : [data.fileName];
            const update = await ProjectModel.updateOne({ _id }, { images: imgNames })
            res.json({ data, update });
        }
        catch (err) {
            next(err);
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
            const book = await ProjectModel.deleteOne({ _id: params.id })
            res.json(book)
        } catch (err) {
            next({ stack: err })
        }
    },
};

module.exports = projectCTRL;