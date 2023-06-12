import mongoose, { Types } from "mongoose";

const commentSchema = new mongoose.Schema({
    commentBody: { type: String, required: true },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
    productId: { type: Types.ObjectId, ref: 'Product', required: true },
    deletedBy: { type: Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
},
    { timestamps: true }
)

const commentModel = mongoose.model('Comment', commentSchema)
export default commentModel