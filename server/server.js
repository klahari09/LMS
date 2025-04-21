import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks } from './controllers/webhook.js'

//Initialize express

const app=express()

//connect to database
await connectDB();

//middlewares
app.use(cors())

//Routes
app.get('/',(req,res)=>res.send("API Working"))
app.post('/clerk',express.json(),clerkWebhooks)

//Port
const PORT=process.env.PORT||5001

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})