const mongoose = require("mongoose")
const Joi = require('joi');

const projectSchema = new mongoose.Schema({
    title: String,
    categories: [String],
    description: String,
    mainImage: String,
    images: [String],
    location: String,
    client: String,
    isCompleted: {
        type: Boolean, default: false
    },
    constructionArea: Number,
    favourite: {
        type: Boolean, default: false
    }
}, { timestamps: true });

const ProjectModel = mongoose.model("Project", projectSchema);

const joiProjectSchema = Joi.object({
    title: Joi.string().min(5).max(50).required(),
    categories: Joi.array().items(Joi.string()).required(),
    description: Joi.string().min(20).max(500).required(),
    isCompleted: Joi.boolean().required(),
    mainImage: Joi.string().allow(null, ""),
    images: Joi.array().items(Joi.string()),
    location: Joi.string().min(3).max(50).required(),
    client: Joi.string().min(3).max(50).required(),
    constructionArea: Joi.number().min(10).max(1500).required(),
    favourite: Joi.boolean().allow(null),
});

const validateProject = (project) => {
    return joiProjectSchema.validate(project);
};

module.exports = { ProjectModel, validateProject };