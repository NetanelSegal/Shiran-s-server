const mongoose = require("mongoose")
const Joi = require('joi');

const projectSchema = new mongoose.Schema({
    title: String,
    categories: [String],
    description: String,
    images: [String], // Array of image URLs
    location: String,
    client: String,
    completionDate: Date,
    favourite: {
        type: Boolean, default: false
    }
}, { timestamps: true });

const ProjectModel = mongoose.model("Project", projectSchema);

const joiProjectSchema = Joi.object({
    title: Joi.string().min(3).max(255).required(),
    categories: Joi.array().items(Joi.string()).required(),
    description: Joi.string().required(),
    images: Joi.array().items(Joi.string()),
    location: Joi.string().required(),
    client: Joi.string().allow(null, ""),
    completionDate: Joi.date().allow(null, ""),
});

const validateProject = (project) => {
    return joiProjectSchema.validate(project);
};

module.exports = { ProjectModel, validateProject };