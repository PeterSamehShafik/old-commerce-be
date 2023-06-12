import userModel from './../../../DB/models/user.model.js';
import CryptoJS from 'crypto-js'
import bcrypt from 'bcryptjs'


export const getUserById = async (req, res) => {
    try {
        const { id } = req.params
        const user = await userModel.findOne({ _id: id, isDeleted: false, isBlocked: false }).select("-password -code -isDeleted -isBlocked")

        if (user) {
            //decrypting the phone
            const decryptedPhone = CryptoJS.AES.decrypt(user.phone, process.env.phoneEncryptionKey).toString(CryptoJS.enc.Utf8);
            user.phone = decryptedPhone
            res.status(200).json({ message: "done", user })
        } else {
            res.status(404).json({ message: "in-valid user not found" })
        }
    } catch (error) {
        res.status(500).json({ message: "catch err", error })
    }

}

export const updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, phone, age, address, gender } = req.body
        let updatingFields;
        if (phone) {
            const ecnryptedPhone = CryptoJS.AES.encrypt(phone, process.env.phoneEncryptionKey).toString();
            updatingFields = { firstName, lastName, phone: ecnryptedPhone, age, address, gender }
        } else {
            updatingFields = { firstName, lastName, phone, age, address, gender }
        }

        const user = await userModel.findByIdAndUpdate(req.user._id, { ...updatingFields }, { new: true })
        updatingFields.phone = phone
        if (user) {
            updatingFields.phone = phone;
            res.status(200).json({ message: "done", Updated: updatingFields })
        } else {
            res.status(400).json({ message: "failed to update" })
        }
    } catch (error) {
        res.status(500).json({ message: "catch err", error })
    }
}

export const updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body
        const user = await userModel.findById(req.user._id).select("password")
        const passwordMatch = bcrypt.compareSync(oldPassword, user.password)
        if (passwordMatch) {
            const hashedPassword = bcrypt.hashSync(newPassword, parseInt(process.env.saltRounds))
            const updated = await userModel.updateOne({ _id: req.user._id }, { password: hashedPassword })
            updated.modifiedCount ? res.status(200).json({ message: "done" }) : res.status(400).json({ message: "failed" })
        } else {
            res.status(403).json({ message: "in-valid password" })
        }
    } catch (error) {
        res.status(500).json({ message: "catch err", error })
    }
}

export const softDelete = async (req, res) => {
    try {
        const updated = await userModel.updateOne({ _id: req.user._id }, { isDeleted: true })
        updated.modifiedCount ? res.status(200).json({ message: "done" }) : res.status(400).json({ message: "failed" })
    } catch (error) {
        res.status(500).json({ message: "catch err", error })

    }
}

export const blockUser = async (req, res) => {
    try {
        const { id } = req.params
        if (req.user.role === 'admin') {
            if (req.user._id === id) {
                res.status(400).json({ message: "Admin can't be blocked" })
            } else {
                const admin = await userModel.updateOne({ _id: id, isBlocked: false }, { isBlocked: true })
                admin.modifiedCount ? res.status(200).json({ message: "done" }) : res.status(400).json({ message: "invalid user or already blocked" })
            }
        } else {
            res.status(401).json({ message: "Admin only can block users" })
        }
    } catch (error) {
        res.status(500).json({ message: "catch err", error })
    }

}

export const unBlockUser = async (req, res) => {
    try {
        const { id } = req.params
        if (req.user.role === 'admin') {
            if (req.user._id === id) {
                res.status(400).json({ message: "Admin can't be blocked" })
            } else {
                const admin = await userModel.updateOne({ _id: id, isBlocked: true }, { isBlocked: false })
                admin.modifiedCount ? res.status(200).json({ message: "done" }) : res.status(400).json({ message: "invalid user or not blocked" })
            }
        } else {
            res.status(401).json({ message: "Admin only can unblock users" })
        }
    } catch (error) {
        res.status(500).json({ message: "catch err", error })
    }
}

export const signOut = async (req, res) => {
    try {
        const lastSeen = new Date()
        const offlineUser = await userModel.updateOne({ _id: req.user._id }, { lastSeen, isOnline: false })
        offlineUser.modifiedCount ? res.status(200).json({ message: "done" }) : res.status(400).json({ message: "failed" })
    } catch (error) {
        res.status(500).json({ message: "catch err", error })
    }
}

export const getUsersWithProducts = async (req, res) => {
    try {

        const users = await userModel.aggregate([
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "createdBy",
                    as: "User_Products",
                    pipeline: [
                        { $match: { isDeleted: false } },
                        {
                            $lookup: {
                                from: "comments",
                                localField: "_id",
                                foreignField: "productId",
                                as: "comments",
                                pipeline: [
                                    {
                                        $lookup: {
                                            from: "users",
                                            localField: "createdBy",
                                            foreignField: "_id",
                                            as: "createdBy",
                                            pipeline: [{ $project: { firstName: 1, lastName: 1, email: 1 } }]
                                        }
                                    },
                                    { $project: { productId: 0, isDeleted: 0 } }
                                ]
                            },
                        },
                        {
                            $lookup: {
                                from: "users",
                                localField: "likes",
                                foreignField: "_id",
                                as: "likes",
                                pipeline: [
                                    { $project: { firstName: 1, lastName: 1, email: 1 } }
                                ]
                            }
                        },
                        { $project: { isDeleted: 0, createdBy: 0 } }
                    ]
                }
            },
            {
                $project: {
                    password: 0,
                    code: 0,
                    confirmEmail: 0,
                    isDeleted: 0,
                    isBlocked: 0,
                }
            }

        ])
        if (users) {
            for (const user of users) {
                const decryptedPhone = CryptoJS.AES.decrypt(user.phone, process.env.phoneEncryptionKey).toString(CryptoJS.enc.Utf8);
                user.phone = decryptedPhone
            }
            res.status(200).json({ message: "done", users })
        } else {
            res.status(404).json({ message: "Empty" })
        }
    } catch (error) {
        res.status(500).json({ message: "catch err", error })

    }

}