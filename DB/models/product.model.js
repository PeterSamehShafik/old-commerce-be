import mongoose, { Types } from "mongoose";

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price:  { type: Number, required: true },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: Types.ObjectId, ref: "User" }],
    comments: [{ type: Types.ObjectId, ref: "Comment" }],
    isDeleted: { type: Boolean, default: false }
},
    { timestamps: true }
)
const productModel = mongoose.model('Product', productSchema)
export default productModel