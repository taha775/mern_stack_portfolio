import app from "./app.js";
import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config({ path: "./config/config.env" });

const port = process.env.PORT || 5000; // Default to 5000 if PORT is not set

// Cloudinary configuration
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Test route


// Start the server
app.listen(port, () => {
    console.log(`Node.js is listening on port ${port}`);
});
