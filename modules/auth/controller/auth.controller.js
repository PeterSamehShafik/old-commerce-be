import userModel from './../../../DB/models/user.model.js';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


export const signUp = async (req, res) => {
    try {
        const { firstName, lastName, email, password, age, } = req.body
        const exist = await userModel.findOne({ email }).select("email")
        if (!exist) {
            const hashedPassword = bcrypt.hashSync(password, parseInt(process.env.saltRounds))
            const newUser = new userModel({ firstName, lastName, email, password: hashedPassword, age })
            const savedUser = await newUser.save()            
            
            res.status(201).json({ message: "done" })
        } else {
            res.status(409).json({ message: "Email already exist" })
        }
    } catch (error) {
        res.status(500).json({ message: "catch err", error })
    }
}

export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email }).select("email password role")
        if (user) {
            const passwordMatch = bcrypt.compareSync(password, user.password)
            if (passwordMatch) {
                const token = jwt.sign({ user: { _id: user._id, email, role: user.role } }, process.env.loginTokenSign, { expiresIn: '12h' })
                res.status(200).json({ message: "done", token })
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
