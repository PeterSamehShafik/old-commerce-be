import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import { connectDB } from './DB/connection.js'
import * as indexRouter from './modules/index.router.js'
import initServer from './initServer/initServer.js';

const app = express();
const PORT = process.env.port;
const baseURL = process.env.baseURL;

app.use(express.json())

app.use(`${baseURL}/auth`, indexRouter.authRouter)
app.use(`${baseURL}/user`, indexRouter.userRouter)
app.use(`${baseURL}/product`, indexRouter.productRouter)
app.use(`${baseURL}/comment`, indexRouter.commentRouter)

app.use("*", (req, res) => {
    res.status(404).json({ message: "404 In-valid URL or method", })
})


initServer()
connectDB();
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}........`)
})