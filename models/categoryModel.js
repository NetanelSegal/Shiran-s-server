const mongoose = require("mongoose");
const Joi = require("joi");

const categorySchema = mongoose.Schema({
    title: String,
    info: String,
    urlCode: String,
}, { timestamps: true })

exports.CategoryModel = new mongoose.model("categories", categorySchema);

exports.validateCategory = (reqBody) => {
    return Joi.object({
        title: Joi.string().min(2).max(50).required(),
        info: Joi.string().min(2).max(400).required(),
        urlCode: Joi.string().min(2).max(20).required(),
    }).validate(reqBody)
}