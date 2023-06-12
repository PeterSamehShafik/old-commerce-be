import userModel from './../../../DB/models/user.model.js';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { myEmail } from './../../../services/myEmail.js';
import CryptoJS from "crypto-js"
import { nanoid } from 'nanoid';


export const signUp = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone, age, adress, gender } = req.body
        const exist = await userModel.findOne({ email }).select("email")
        if (!exist) {
            const ecnryptedPhone = CryptoJS.AES.encrypt(phone, process.env.phoneEncryptionKey).toString();
            // const bytes = CryptoJS.AES.decrypt(ecnryptedPhone, process.env.phoneEncryptionKey);
            // const originalText = bytes.toString(CryptoJS.enc.Utf8);
            const hashedPassword = bcrypt.hashSync(password, parseInt(process.env.saltRounds))
            const newUser = new userModel({ firstName, lastName, email, password: hashedPassword, phone: ecnryptedPhone, age, adress, gender })
            const savedUser = await newUser.save()
            const user = { _id: savedUser._id, firstName, lastName, email, phone, age, adress, gender, createdAt: savedUser.createdAt }

            const token = jwt.sign({ _id: savedUser._id }, process.env.confirmationTokenSign, { expiresIn: '12h' })
            const link = `${req.protocol}://${req.headers.host}${process.env.baseURL}/auth/confirmEmail/${token}`
            console.log(link)

            const refToken = jwt.sign({ _id: savedUser._id }, process.env.confirmationTokenSign)
            const refTokenlink = `${req.protocol}://${req.headers.host}${process.env.baseURL}/auth/refreshToken/${refToken}`

            const confirmContent = `
            <h1> Confirmation Email</h1>
            <p> please follow the next link to confirm your email </p>
            <a href="${link}"> Click Here </a>
            <h2> if the link expired you can <a href="${refTokenlink}"> Click here </a> to re-send confirmation email</h2>
        `
            myEmail(email, "Confirmation Email", confirmContent)

            res.status(201).json({ message: "done", user, details: "please check your email to confirm" })
        } else {
            res.status(409).json({ message: "Email already exist" })
        }
    } catch (error) {
        res.status(500).json({ message: "catch err", error })
    }
}

export const confirmEmail = async (req, res) => {
    try {
        const { token } = req.params
        if (token) {
            const decoded = jwt.verify(token, process.env.confirmationTokenSign)
            if (decoded?._id) {
                const confirm = await userModel.updateOne({ _id: decoded._id, confirmEmail: false }, { confirmEmail: true })
                confirm.modifiedCount ? res.status(200).json({ message: "done", details: "confirmed successfully!" }) : res.status(200).json({ message: "In-valid user or already confirmed" })
            } else {
                res.status(400).json({ message: "In-valid token payload" })
            }
        } else {
            res.status(403).json({ message: "In-valid token" })
        }
    } catch (error) {
        res.status(500).json({ message: "catch err", error })
    }
}

export const refreshToken = async (req, res) => {
    try {
        const { token } = req.params
        if (token) {
            const decoded = jwt.verify(token, process.env.confirmationTokenSign)
            if (decoded?._id) {
                const user = await userModel.findOne({ _id: decoded._id }).select("email confirmEmail")
                if (user) {
                    if (!user.confirmEmail) {
                        const token = jwt.sign({ _id: user._id }, process.env.confirmationTokenSign, { expiresIn: '5m' })
                        const link = `${req.protocol}://${req.headers.host}${process.env.baseURL}/auth/confirmEmail/${token}`
                        const confirmContent = `
                        <h1> Confirmation Email</h1>
                        <p> please follow the next link to confirm your email </p>
                        <a href="${link}"> Click Here </a>
                    `
                        myEmail(user.email, "re-Confirmation Email", confirmContent)
                        res.status(200).json({ message: "Done" })

                    } else {
                        res.status(409).json({ message: "email already confirmed" })
                    }
                } else {
                    res.status(404).json({ message: "In-valid user, not found" })
                }
            } else {
                res.status(400).json({ message: "In-valid token payload" })
            }
        } else {
            res.status(403).json({ message: "In-valid token" })
        }
    } catch (error) {
        res.status(500).json({ message: "catch err", error })
    }
}

export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email, isDeleted: false }).select("email password confirmEmail role isBlocked")
        if (user) {
            const passwordMatch = bcrypt.compareSync(password, user.password)
            if (passwordMatch) {
                if (user.confirmEmail) {
                    if (user.isBlocked) {
                        res.status(401).json({ message: "Your account is blocked" })
                    } else {
                        const token = jwt.sign({ user: { _id: user._id, email, role: user.role } }, process.env.loginTokenSign, { expiresIn: '12h' })
                        const onlineStatus = await userModel.updateOne({ email }, { isOnline: true })
                        onlineStatus.modifiedCount ? res.status(200).json({ message: "done", token }) : res.status(400).json({ message: "somth went wrong" })
                    }
                } else {
                    res.status(401).json({ message: "Please confirm your email" })
                }
            } else {
                res.status(403).json({ message: "invalid email or password" })
            }
        } else {
            res.status(403).json({ message: "invalid email or password" })
        }
    } catch (error) {
        res.status(500).json({ message: "catch err", error })
    }
}

export const sendCode = async (req, res) => {
    try {
        const { email } = req.body
        const exist = await userModel.findOne({ email }).select("email")
        if (exist) {
            const code = nanoid()
            myEmail(email, "Reset password", `<p>Here's your Code to reset your password: <h3> ${code} </h3></p>`)
            const updateCode = await userModel.updateOne({ email }, { code })
            updateCode.modifiedCount ? res.status(200).json({ message: "done" }) : res.status(400).json({ message: "somthing went wrong" })
        } else {
            res.status(404).json({ message: "In-valid User not found" })
        }
    } catch (error) {
        res.status(500).json({ message: "catch err", error })
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body
        if (code == null) {
            res.status(403).json({ message: "code can't be null" })
        } else {
            const hashedPassword = bcrypt.hashSync(newPassword, parseInt(process.env.saltRounds))
            const updateUser = await userModel.updateOne({ email, code }, { password: hashedPassword, code: null })
            updateUser.modifiedCount ? res.status(200).json({ message: "done" }) : res.status(400).json({ message: "invalid Code" })
        }
    } catch (error) {
        res.status(500).json({ message: "catch err", error })
    }
}