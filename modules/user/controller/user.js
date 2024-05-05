import userModel from './../../../DB/models/user.model.js';
import CryptoJS from 'crypto-js'
import bcrypt from 'bcryptjs'


export const getUser = async (req, res) => {
    try {
        const { _id } = req.user
        const user = await userModel.findOne({ _id }).select("-password")

        if (user) {
            res.status(200).json({ message: "done", user })
        } else {
            res.status(404).json({ message: "in-valid user not found" })
        }
    } catch (error) {
        res.status(500).json({ message: "catch err", error })
    }

}

export const getUsers = async (req, res) => {
    try {
        if (req.user.role === 'superadmin' || req.user.role === 'admin') {
            const users = await userModel.find({}).select("-password")
            res.status(200).json({ message: "done", users })
        } else {
            res.status(403).json({ message: "forbidden" })
        }
    } catch (error) {
        res.status(500).json({ message: "catch err", error })
    }

}

export const removeAdmin = async (req, res) => {
    try {
        const { role } = req.body
        const { userId } = req.params
        if (req.user.role === 'superadmin') {
            const user = await userModel.findOneAndUpdate({ _id: userId, role: 'admin' }, { role: role }, { new: true })
            res.status(200).json({ message: 'done' })
        } else {
            res.status(403).json({ message: 'forbidden' })
        }
    } catch (error) {
        res.status(500).json({ message: "catch err", error })
    }
}
export const makeAdmin = async (req, res) => {
    try {
        const { role } = req.body
        const { userId } = req.params
        if (req.user.role === 'superadmin' || req.user.role === 'admin') {
            const user = await userModel.findOneAndUpdate({ _id: userId, role: 'user' }, { role: role }, { new: true })
            res.status(200).json({ message: 'done' })
        }
        else {
            res.status(403).json({ message: 'forbidden' })
        }
    } catch (error) {
        res.status(500).json({ message: "catch err", error })
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params
        if (req.user.role === 'superadmin' && JSON.stringify(req.user._id) !== JSON.stringify(userId)) {
            const deletedUser = await userModel.findOneAndDelete({ _id: userId })
            deletedUser ? res.status(200).json({ message: "done" }) : res.status(400).json({ message: "Failed" })
        } else {
            res.status(403).json({ message: "forbidden" })
        }
    } catch (error) {
        res.status(500).json({ message: "catch err", error })

    }
}
