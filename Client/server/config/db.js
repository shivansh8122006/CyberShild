const mongoose = require("mongoose");
const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.warn("⚠️ MONGO_URI is missing in .env file");
            return;
        }
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log("MongoDB connected successfully! 🚀");
    } catch (error) {
        console.warn("⚠️ MongoDB Atlas connection warning:", error.message);
        console.warn("👉 Tip: Ensure your current IP is whitelisted in MongoDB Atlas (Network Access -> Add IP Address 0.0.0.0/0).");
    }
};

module.exports = connectDB;
