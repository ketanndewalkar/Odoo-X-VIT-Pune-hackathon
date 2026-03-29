import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDb from "./src/utils/db.js";
import cookieParser from "cookie-parser";

// import routes 
import userRoutes from "./src/routes/user.route.js"
import companyRoutes from "./src/routes/company.route.js"
import approvalFlowRoutes from "./src/routes/approvalFlow.route.js"
import approvalRuleRoutes from "./src/routes/approvalRule.route.js"



dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cors({
    origin: '*',
    credentials: true,
}))
app.use(cookieParser())

connectDb()

app.get("/health",(req,res) => {
    res.status(200).json({message: "HealthCheck Route ...."})
})


app.use("/api/v1/users", userRoutes);
app.use("/api/v1/company", companyRoutes);
app.use("/api/v1/approval-flows", approvalFlowRoutes);
app.use("/api/v1/approval-rules", approvalRuleRoutes);
app.listen(process.env.PORT|| 8080 ,() => {
    console.log(`Server is listening at port ${process.env.PORT || 8080}`)
})