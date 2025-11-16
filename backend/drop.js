// backend/drop.js
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Feedback = require('./models/Feedback');

// !! Make sure this is the same connection string as in server.js and seed.js
const MONGO_URI = "mongodb://127.0.0.1:27017/product_feedback";

const dropDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected for dropping data...");

    // Clear existing data
    await Product.deleteMany({});
    await Feedback.deleteMany({});
    
    console.log("Successfully cleared all Products and Feedback.");

  } catch (err) {
    console.error(err.message);
    process.exit(1);
  } finally {
    mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
};

dropDatabase();