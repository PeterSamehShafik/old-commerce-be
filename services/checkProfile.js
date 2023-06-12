import userModel from './../DB/models/user.model.js';

const labels = ["firstName", "lastName", "phone", "age", "address", "gender"]

export const checkProfile = () => {
    return async (req, res, next) => {
        const user = await userModel.findById(req.user._id)
        let isCompleted = true;
        for (let i = 0; i < labels.length; i++) {
            if (!user[labels[i]]) {
                isCompleted = false
            }
        }
        isCompleted ? next() : res.status(404).json({ message: "please complete your profile info" })
    }
}