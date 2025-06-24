import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./route.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const connectDb = async () => {
    try {
        mongoose.connect(process.env.MONGO_URI, {
            dbName: "Spotify"
        });
        console.log("MongoDb connected");
    }
    catch (error) {
        console.log(error);
    }
};
app.use("/api/v1/", userRoutes);
app.get("/", (req, res) => {
    res.send("Server is Working");
});
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    connectDb();
});
