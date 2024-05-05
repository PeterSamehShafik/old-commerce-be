import userModel from './../DB/models/user.model.js';
import bcrypt from 'bcryptjs';

const initServer = async () => {
    const adminData = JSON.parse(process.env.adminData)
    const hashedPassword = bcrypt.hashSync(process.env.adminPassword, parseInt(process.env.saltRounds))

    const initiated = await userModel.findOne({ email: adminData.email }).select("email")
    if (initiated) {
        console.log(`Server already initiated with admin ${adminData.email}..........`)
    } else {
        const admin = new userModel({ ...adminData, password: hashedPassword })
        const savedAdmin = await admin.save()
        console.log(`Server initiated successfully with admin ${adminData.email}..........`)
    }
}

export default initServer