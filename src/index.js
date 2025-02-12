import dotenv from "dotenv";
import connectDB from "./db/index.js";
import express from "express";
import {app} from './app.js';

// Load environment variables
dotenv.config({ path: './env' });




connectDB()
    .then(() => {
        const port = process.env.PORT || 8001; // Use environment variable or default
        app.listen(port, () => {
            console.log(`Server is running at Port: ${port}`);
        });
    })
    .catch((err) => {
        console.error("MONGODB connection failed!!!", err);
    });
