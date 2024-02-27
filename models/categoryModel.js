const mongoose = require("mongoose");
const Joi = require("joi");

const categorySchema = mongoose.Schema({
    title: String,
    urlCode: String,
}, { timestamps: true })

exports.CategoryModel = new mongoose.model("categories", categorySchema);

const joiSchema = Joi.object({
    title: Joi.string().min(2).max(50).required(),
    urlCode: Joi.string().min(2).max(20).required(),
})
exports.validateCategory = (reqBody) => {
    return joiSchema.validate(reqBody)
}