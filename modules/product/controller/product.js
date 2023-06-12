
import productModel from './../../../DB/models/product.model.js';


export const addProduct = async (req, res) => {
    try {
        const { title, description, price } = req.body
        const newProduct = new productModel({ title, description, price, createdBy: req.user._id })
        const savedProduct = await newProduct.save()
        savedProduct ? res.status(200).json({ message: "done", savedProduct }) : res.status(400).json({ message: "Failed" })
    } catch (error) {
        res.status(500).json({ message: "catch err", error })
    }
}

export const updateProduct = async (req, res) => {
    try {
        const { title, description, price } = req.body
        const { id } = req.params
        const updatedProduct = await productModel.findByIdAndUpdate(id, { title, description, price }, { new: true })
        const updatedAt = { title, description, price, updatedAt: updatedProduct.updatedAt }
        updatedProduct ? res.status(200).json({ message: "done", updatedProduct: { ...updatedAt } }) : res.status(400).json({ message: "Failed" })
    } catch (error) {
        res.status(500).json({ message: "catch err", error })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params
        const deletedProd = await productModel.findByIdAndDelete(id)
        deletedProd ? res.status(200).json({ message: "done" }) : res.status(400).json({ message: "Failed" })
    } catch (error) {
        res.status(500).json({ message: "catch err", error })
    }
}

export const softDelete = async (req, res) => {
    try {
        const { id } = req.params
        const deleted = await productModel.findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true }, { new: true })
        deleted ? res.status(200).json({ message: "done" }) : res.status(400).json({ message: "Failed" })
    } catch (error) {
        res.status(500).json({ message: "catch err", error })
    }
}

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params
        const product = await productModel.findOne({ _id: id })
        product ? res.status(200).json({ message: "done", product }) : res.status(400).json({ message: "Failed" })
    } catch (error) {
        res.status(500).json({ message: "catch err", error })
    }
}

export const likeProduct = async (req, res) => {
    try {
        const { prodId } = req.params
        const userId = req.user._id
        const product = await productModel.findById(prodId)
        if (product) {
            if (JSON.stringify(product.createdBy) != JSON.stringify(userId)) {
                if (!product.likes.includes(req.user._id)) {
                    const liked = await productModel.findOneAndUpdate({ _id: prodId }, { $push: { likes: req.user._id } })
                    liked ? res.status(200).json({ message: "done" }) : res.status(200).json({ message: "failed" })
                } else {
                    res.status(400).json({ message: "you can't like product twice" })
                }
            } else {
                res.status(400).json({ message: "you can't like your own product" })
            }
        } else {
            res.status(404).json({ message: "invalid id for product" })
        }
    } catch (error) {
        res.status(500).json({ message: "catch err", error })
    }

}

export const unLikeProduct = async (req, res) => {
    try {
        const { prodId } = req.params
        const userId = req.user._id
        const product = await productModel.findById(prodId)
        if (product) {
            if (JSON.stringify(product.createdBy) != JSON.stringify(userId)) {
                if (product.likes.includes(req.user._id)) {
                    const unliked = await productModel.findOneAndUpdate({ _id: prodId }, { $pull: { likes: req.user._id } })
                    unliked ? res.status(200).json({ message: "done" }) : res.status(200).json({ message: "failed" })
                } else {
                    res.status(400).json({ message: "you didn't like this product" })
                }
            } else {
                res.status(400).json({ message: "you can't unlike  your own product" })
            }
        } else {
            res.status(404).json({ message: "invalid id for product" })
        }
    } catch (error) {
        res.status(500).json({ message: "catch err", error })
    }

}

export const searchByTitle = async (req, res) => {
    try {
        const { title } = req.query
        if (title) {
            const results = await productModel.find({ title: { $regex: title, $options: 'i' } })
            results ? res.status(200).json({ message: "done", results }) : res.status(400).json({ message: "failed" })
        } else {
            res.status(400).json({ message: "query error" })
        }
    } catch (error) {
        res.status(500).json({ message: "catch err", error })
    }
}

export const allProducts = async (req, res) => {
    try {
        const products = await productModel.find({ isDeleted: false }).populate([
            {
                path: "createdBy",
                select: "firstName lastName email"
            },
            {
                path: "likes",
                select: "firstName lastName email"
            },
            {
                path: "comments",
                select: "-productId -isDeleted",
                match: { isDeleted: false },
                populate: {
                    path: "createdBy",
                    select: "firstName lastName email"
                }
            }
        ])
        res.status(200).json({ message: "done", products })
    } catch (error) {
        res.status(500).json({ message: "catch err", error })
    }
}