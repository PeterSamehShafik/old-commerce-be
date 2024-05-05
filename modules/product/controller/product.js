
import productModel from './../../../DB/models/product.model.js';

const MINI = 0, MAXI = 999999999999;

export const allProducts = async (req, res) => {
    try {
        let { category, search, orderPrice, orderDate, pricegt, pricelt } = req.query
        let sorting = {};
        let filters = {};
        if (orderDate != 0) {
            sorting.createdAt = orderDate
        }
        if (orderPrice != 0) {
            sorting.price = orderPrice
        }
        if (pricegt == '') {
            // filters.price.$gt = pricegt
            pricegt = MINI
        }
        if (pricelt == '') {
            // filters.price.$lt = pricelt
            pricelt = MAXI
        }
        filters = {
            price: { $gt: Number(pricegt), $lt: Number(pricelt) },
        }
        if (category != '') {
            filters.category = category
        }
        if (search != '') {
            filters.name = { $regex: search, $options: 'i' }
        }
        // console.log({ category, search, orderPrice, orderDate, pricegt, pricelt })
        // console.log(filters)
        const products = await productModel
            .find(filters)
            .populate([
                {
                    path: "createdBy",
                    select: "firstName lastName"
                },
            ])
            .sort(sorting)
        res.status(200).json({ message: "done", products })
    } catch (error) {
        res.status(500).json({ message: "catch err", error })
    }
}

export const userProducts = async (req, res) => {
    try {
        if (req.user.role === 'superadmin') {
            const products = await productModel.find({}).populate([
                {
                    path: "createdBy",
                    select: "firstName lastName"
                },
            ])
            res.status(200).json({ message: "done", products })
        } else if (req.user.role === 'admin') {
            const products = await productModel.find({ createdBy: req.user._id }).populate([
                {
                    path: "createdBy",
                    select: "firstName lastName"
                },
            ])
            res.status(200).json({ message: "done", products })
        } else {
            res.status(403).json({ message: "Forbidden" })
        }
    } catch (error) {
        res.status(500).json({ message: "catch err", error })
    }
}

export const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, imageURL } = req.body
        const newProduct = new productModel({ name, category, imageURL, description, price, createdBy: req.user._id })
        const savedProduct = await newProduct.save()
        savedProduct ? res.status(200).json({ message: "done", product: savedProduct }) : res.status(400).json({ message: "Failed" })
    } catch (error) {
        res.status(500).json({ message: "catch err", error })
    }
}

export const updateProduct = async (req, res) => {
    try {
        const { name, description, price, category, imageURL } = req.body
        const { productId } = req.params
        const updatedProduct = await productModel.findOneAndUpdate(
            { _id: productId, createdBy: req.user._id },
            { name, description, price, category, imageURL }, { new: true })
        updatedProduct ? res.status(200).json({ message: "done" }) : res.status(400).json({ message: "Failed" })
    } catch (error) {
        res.status(500).json({ message: "catch err", error })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params
        if (req.user.role === 'superadmin') {
            const deletedProd = await productModel.findOneAndDelete({ _id: productId })
            deletedProd ? res.status(200).json({ message: "done" }) : res.status(400).json({ message: "Failed" })
        } else {
            const deletedProd = await productModel.findOneAndDelete({ _id: productId, createdBy: req.user._id })
            deletedProd ? res.status(200).json({ message: "done" }) : res.status(400).json({ message: "Failed" })
        }
    } catch (error) {
        res.status(500).json({ message: "catch err", error })
    }
}

