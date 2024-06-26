import mongoose, { Types } from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price:  { type: Number, required: true },
    category: { type: String, required: true },
    imageURL: { type: String, required: true },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
},
    { timestamps: true }
)
const productModel = mongoose.model('Product', productSchema)
export default productModel