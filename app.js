import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import { connectDB } from './DB/connection.js'
import * as indexRouter from './modules/index.router.js'
import initServer from './initServer/initServer.js';
import cors from 'cors';
// import productModel from './DB/models/product.model.js'

const app = express();
const PORT = process.env.port;
const baseURL = process.env.baseURL;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({}));

app.use(`${baseURL}/auth`, indexRouter.authRouter)
app.use(`${baseURL}/users`, indexRouter.userRouter)
app.use(`${baseURL}/products`, indexRouter.productRouter)

// app.get("/dummy", async (req, res) => {
//     const data =[
//         {
//           "name": "UltraBook Pro X3",
//           "price": 1350,
//           "description": "Thin and lightweight laptop with high-resolution display",
//           "category": "Laptops",
//           "imageURL": "https://source.unsplash.com/200x300/?laptop",
//           "createdBy": "66311d7689cd55ee06c83926"
//         },
//         {
//           "name": "Gaming Beast Z9",
//           "price": 2500,
//           "description": "Powerful gaming desktop PC with RGB lighting",
//           "category": "PCs",
//           "imageURL": "https://source.unsplash.com/200x300/?desktop",
//           "createdBy": "66378b9af9d232b015de5d62"
//         },
//         {
//           "name": "Galaxy X20",
//           "price": 950,
//           "description": "Smartphone with edge-to-edge display and triple camera setup",
//           "category": "Mobiles",
//           "imageURL": "https://source.unsplash.com/200x300/?smartphone",
//           "createdBy": "66378babf9d232b015de5d65"
//         },
//         {
//           "name": "CinemaView 65",
//           "price": 1800,
//           "description": "65-inch 4K OLED Smart TV with cinematic experience",
//           "category": "TVs",
//           "imageURL": "https://source.unsplash.com/200x300/?tv",
//           "createdBy": "66378bc5f9d232b015de5d68"
//         },
//         {
//           "name": "TravelBook X1",
//           "price": 1100,
//           "description": "Convertible laptop perfect for travelers",
//           "category": "Laptops",
//           "imageURL": "https://source.unsplash.com/200x300/?travel",
//           "createdBy": "66311d7689cd55ee06c83926"
//         },
//         {
//           "name": "OfficeMaster Z7",
//           "price": 1600,
//           "description": "Business desktop PC with professional-grade features",
//           "category": "PCs",
//           "imageURL": "https://source.unsplash.com/200x300/?office",
//           "createdBy": "66378b9af9d232b015de5d62"
//         },
//         {
//           "name": "SnapShot X5",
//           "price": 750,
//           "description": "Compact smartphone with high-resolution camera",
//           "category": "Mobiles",
//           "imageURL": "https://source.unsplash.com/200x300/?mobile",
//           "createdBy": "66378babf9d232b015de5d65"
//         },
//         {
//           "name": "HomeCinema Y9",
//           "price": 1250,
//           "description": "55-inch 4K Smart TV for the ultimate home cinema experience",
//           "category": "TVs",
//           "imageURL": "https://source.unsplash.com/200x300/?home,cinema",
//           "createdBy": "66378bc5f9d232b015de5d68"
//         },
//         {
//           "name": "StudioBook A5",
//           "price": 1400,
//           "description": "Powerful laptop designed for creative professionals",
//           "category": "Laptops",
//           "imageURL": "https://source.unsplash.com/200x300/?studio",
//           "createdBy": "66311d7689cd55ee06c83926"
//         },
//         {
//           "name": "DeveloperMaster X2",
//           "price": 2000,
//           "description": "High-performance desktop PC tailored for developers",
//           "category": "PCs",
//           "imageURL": "https://source.unsplash.com/200x300/?developer",
//           "createdBy": "66378b9af9d232b015de5d62"
//         },
//         {
//           "name": "AdventurePhone Y3",
//           "price": 850,
//           "description": "Rugged smartphone built for outdoor adventures",
//           "category": "Mobiles",
//           "imageURL": "https://source.unsplash.com/200x300/?adventure",
//           "createdBy": "66378babf9d232b015de5d65"
//         },
//         {
//           "name": "FamilyEntertainment S4",
//           "price": 1100,
//           "description": "Smart TV with family-friendly entertainment features",
//           "category": "TVs",
//           "imageURL": "https://source.unsplash.com/200x300/?family,entertainment",
//           "createdBy": "66378bc5f9d232b015de5d68"
//         },
//         {
//           "name": "DesignerBook B6",
//           "price": 1550,
//           "description": "Stylish laptop for designers with vibrant display",
//           "category": "Laptops",
//           "imageURL": "https://source.unsplash.com/200x300/?designer",
//           "createdBy": "66311d7689cd55ee06c83926"
//         },
//         {
//           "name": "CreativeStation Z3",
//           "price": 1700,
//           "description": "Creative desktop PC for digital artists and content creators",
//           "category": "PCs",
//           "imageURL": "https://source.unsplash.com/200x300/?creative,station",
//           "createdBy": "66378b9af9d232b015de5d62"
//         },
//         {
//           "name": "OutdoorExplorer X4",
//           "price": 900,
//           "description": "Durable smartphone for outdoor enthusiasts",
//           "category": "Mobiles",
//           "imageURL": "https://source.unsplash.com/200x300/?outdoor",
//           "createdBy": "66378babf9d232b015de5d65"
//         },
//         {
//           "name": "MovieNight Y2",
//           "price": 1200,
//           "description": "Smart TV with built-in streaming apps for movie nights",
//           "category": "TVs",
//           "imageURL": "https://source.unsplash.com/200x300/?movie,night",
//           "createdBy": "66378bc5f9d232b015de5d68"
//         }
//       ]
      
      
//     const done = await productModel.insertMany(data)
//     // const done = await productModel.deleteMany({})
//     res.status(404).json({ process: done })
// })
app.use("*", (req, res) => {
    res.status(404).json({ message: "404 In-valid URL or method", })
})


initServer()
connectDB();
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}........`)
})