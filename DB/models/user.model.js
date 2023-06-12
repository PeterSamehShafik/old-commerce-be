import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, enum: ['male', 'female'] },
    lastSeen: Date,
    address: String,
    phone: String,
    age: Number,
    code: { type: String, default: null },
    confirmEmail: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
},
    { timestamps: true }
)

const userModel = mongoose.model('User', userSchema)
export default userModel