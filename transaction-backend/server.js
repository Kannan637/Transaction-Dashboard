require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const transactionRoutes = require("./routes/transactionRoutes");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/transactions";

console.log("Connecting to MongoDB:", MONGO_URI); // Debug log

// Connect to MongoDB with better error handling
mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch((err) => {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1);
    });

// Use the transaction routes
app.use("/api", transactionRoutes);

// Default Route
app.get("/", (req, res) => {
    res.send({ message: "API is running..." });
});

// Start Server with error handling
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
    .on("error", (err) => {
        console.error("❌ Server Error:", err);
        process.exit(1);
    });
