// db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            // Remove deprecated options
            // Use new URL parser
            useNewUrlParser: true,
            // Use new server discovery and monitoring engine
            useUnifiedTopology: true,
            // Optionally, use new connection pool settings
            // poolSize: 10,
            // serverSelectionTimeoutMS: 5000,
            // socketTimeoutMS: 45000,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
