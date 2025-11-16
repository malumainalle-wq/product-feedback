// backend/seed.js
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Feedback = require('./models/Feedback');

const MONGO_URI = "mongodb://127.0.0.1:27017/product_feedback";

const categories = [
  "Mobile", "Laptop", "Headphones", "TV", "Camera", 
  "Gaming Console", "Smartwatch", "Tablet", "Printer"
];

const sampleProducts = {
  "Mobile": ["iPhone 15", "Samsung Galaxy S23", "Google Pixel 8"],
  "Laptop": ["MacBook Pro 14\"", "Dell XPS 15", "HP Spectre x360"],
  "Headphones": ["Sony WH-1000XM5", "Bose QC Ultra", "AirPods Pro 2"],
  "TV": ["LG C3 OLED", "Samsung S95C QLED", "Sony Bravia A95L"],
  "Camera": ["Sony A7 IV", "Canon EOS R6", "Fujifilm X-T5"],
  "Gaming Console": ["PlayStation 5", "Xbox Series X", "Nintendo Switch"],
  "Smartwatch": ["Apple Watch Ultra 2", "Samsung Galaxy Watch 6", "Garmin Fenix 7"],
  "Tablet": ["iPad Pro", "Samsung Galaxy Tab S9", "Microsoft Surface Pro 9"],
  "Printer": ["HP LaserJet Pro", "Canon PIXMA", "Brother HL-L2395DW"]
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected for seeding...");

    // Clear existing data
    await Product.deleteMany({});
    await Feedback.deleteMany({});
    console.log("Cleared existing products and feedback.");

    // Create products
    let createdProducts = [];
    for (const category of categories) {
      for (const productName of sampleProducts[category]) {
        const product = await Product.create({
          name: productName,
          category: category
        });
        createdProducts.push(product);
      }
    }
    console.log(`${createdProducts.length} products created.`);

    // Create some sample feedback
    await Feedback.create({
      product: createdProducts[0]._id, // iPhone 15
      category: "Mobile",
      username: "Harsha",
      message: "Great phone, but battery could be better.",
      rating: 4
    });

    await Feedback.create({
      product: createdProducts[1]._id, // Samsung S23
      category: "Mobile",
      username: "Jane Doe",
      message: "Awesome camera!",
      rating: 5
    });
    
    await Feedback.create({
      product: createdProducts[3]._id, // MacBook Pro
      category: "Laptop",
      username: "TechReviewer",
      message: "Super fast and amazing screen.",
      rating: 5
    });

    console.log("Sample feedback created.");
    console.log("Database seeding complete!");

  } catch (err) {
    console.error(err.message);
    process.exit(1);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();