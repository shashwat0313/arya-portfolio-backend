import express from "express";
import dotenv from "dotenv"
import authRouter from "./routes/authRouter.js"
import initInterceptor from "./middlewares/initInterceptor.js";

// Load env
dotenv.config();

// constants
const app = express();
const PORT = process.env.PORT;

// json parsing for json body
app.use(express.json())

app.use(initInterceptor)

// route bindings
app.use("/auth", authRouter);

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});