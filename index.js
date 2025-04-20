import express from "express";
import dotenv from "dotenv"

// Load env
dotenv.config();

// constants
const app = express();
const PORT = process.env.PORT;

// route bindings

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});