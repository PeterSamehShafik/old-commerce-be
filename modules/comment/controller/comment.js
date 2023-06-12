import productModel from './../../../DB/models/product.model.js';
import commentModel from './../../../DB/models/comment.model.js';



export const addComment = async (req, res) => {
    try {
        const { prodId } = req.params
        const { commentBody } = req.body
        const product = await productModel.findById(prodId)
        if (product) {
            if (!product.isDeleted) {
                const newComment = new commentModel({ commentBody, createdBy: req.user._id, productId: product._id })
                const savedComment = await newComment.save()
                const commented = await productModel.findOneAndUpdate({ _id: prodId }, { $push: { comments: savedComment._id } })
                savedComment && commented ? res.status(200).json({ message: "done", savedComment }) : res.status(200).json({ message: "failed" })
            } else {
                res.status(404).json({ message: "Deleted product" })
            }
        } else {
            res.status(404).json({ message: "invalid prodId" })
        }
    } catch (error) {
        res.status(500).json({ message: "catch err", error })
    }
}

export const updateComment = async (req, res) => {
    try {
        const { commentId } = req.params
        const { commentBody } = req.body
        const comment = await commentModel.findOneAndUpdate({ _id: commentId, isDeleted: false, createdBy: req.user._id }, { commentBody }, { new: true })
        comment ? res.status(200).json({ message: "done", comment }) : res.status(200).json({ message: "failed" })
    } catch (error) {
        res.status(500).json({ message: "catch err", error })
    }
}

export const softDeleted = async (req, res) => {
    const { commentId } = req.params
    const comment = await commentModel.findById(commentId).populate([{
        path: "productId",
        select: "createdBy",
        as: "product",
        // populate: {
        //     path: "createdBy",
        //     select: "_id"
        // }
    }])

    console.log(comment)

    if (JSON.stringify(comment.createdBy) == JSON.stringify(req.user._id)) {
        // Delete by the comment owner
        const deleted = await commentModel.updateOne({ _id: commentId, isDeleted: false }, { isDeleted: true, deletedBy: req.user._id })
        deleted.modifiedCount ? res.status(200).json({ message: "done" }) : res.status(200).json({ message: "failed" })
    } else if (JSON.stringify(comment.productId.createdBy) == JSON.stringify(req.user._id)) {
        // Delete by the product owner
        const deleted = await commentModel.updateOne({ _id: commentId, isDeleted: false }, { isDeleted: true, deletedBy: req.user._id })
        deleted.modifiedCount ? res.status(200).json({ message: "done" }) : res.status(200).json({ message: "failed" })
    } else {
        res.status(401).json({ message: "you're not auth to delete this" })
    }
}