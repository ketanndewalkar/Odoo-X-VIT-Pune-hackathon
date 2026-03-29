import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDb from "./src/utils/db.js";


dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cors())

connectDb()

app.get("/health",(req,res) => {
    res.status(200).json({message: "HealthCheck Route ...."})
})



app.listen(process.env.PORT|| 8080 ,() => {
    console.log(`Server is listening at port ${process.env.PORT || 8080}`)
})