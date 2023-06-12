import mongoose from "mongoose";
import productModel from './models/product.model.js';


export const connectDB = async () => {
    return await mongoose.connect(process.env.URI)
        .then(res => {
            console.log('Database connected successfully!....')
            // console.log(res)
        })
        .catch(err => {
            console.log(`Database connection failed!..... ${err}`)
        })
}