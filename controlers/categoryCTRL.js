const { CategoryModel, validateCategory } = require("../models/categoryModel");

const categoryCtrl = {
    getCategories: async (_, res, next) => {
        try {
            const data = await CategoryModel.find({}, { _id: 0, title: 1, urlCode: 1 })
            res.json(data)
        }
        catch (err) {
            next({ stack: err })
        }
    },
    addCategory: async ({ body }, res, next) => {
        const validate = validateCategory(body);
        if (validate.error) {
            return next({ status: 400, stack: validate.error.details })
        }
        try {
            const category = CategoryModel(body)
            category.save()
            res.status(201).json(category);
        } catch (err) {
            next({ stack: err })
        }
    },
    updateCategory: async ({ body, params }, res, next) => {
        const validate = validateCategory(body);
        if (validate.error) {
            return next({ status: 400, stack: validate.error.details })
        }

        try {
            const data = await CategoryModel.updateOne({ _id: params.id }, body);
            res.json(data);
        }
        catch (err) {
            next({ stack: err })
        }
    },
    deleteCategory: async ({ params }, res, next) => {
        try {
            const book = await CategoryModel.deleteOne({ _id: params.id })
            res.json(book)
        }
        catch (err) {
            next({ stack: err })
        }
    }
}

module.exports = categoryCtrl