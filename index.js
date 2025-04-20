import express from "express";
import dotenv from "dotenv"
// import authRouter from "./routes/authRouter.js"
import interceptor from "./middlewares/Interceptor.js";
import routesBinder from "./routes/RoutesBinder.js";
import cors from "cors"

// Load env
dotenv.config();

// constants
const app = express();
const PORT = process.env.PORT;

// json parsing for json body
app.use(express.json());

// Enable CORS for localhost:5173
app.use(cors({
    origin: "http://localhost:5173"
}));

// interceptor
app.use(interceptor);

// route bindings
routesBinder(app);
// app.use("/auth", authRouter);

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});