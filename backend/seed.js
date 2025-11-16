// backend/seed.js
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Feedback = require('./models/Feedback');

const MONGO_URI = "mongodb://127.0.0.1:27017/product_feedback";

const categories = [
  "Mobile", "Laptop", "Headphones", "TV", "Camera", 
  "Gaming Console", "Smartwatch", "Tablet", "Printer"
];

// Updated product data structure
const sampleProducts = {
  "Mobile": [
    { name: "iPhone 15", imageUrl: "https://picsum.photos/seed/iphone15/200" },
    { name: "Samsung Galaxy S23", imageUrl: "https://picsum.photos/seed/s23/200" },
    { name: "Google Pixel 8", imageUrl: "https://picsum.photos/seed/pixel8/200" }
  ],
  "Laptop": [
    { name: "MacBook Pro 14\"", imageUrl: "https://picsum.photos/seed/macbook14/200" },
    { name: "Dell XPS 15", imageUrl: "https://picsum.photos/seed/xps15/200" },
    { name: "HP Spectre x360", imageUrl: "https://picsum.photos/seed/spectre/200" }
  ],
  "Headphones": [
    { name: "Sony WH-1000XM5", imageUrl: "https://picsum.photos/seed/sonywh/200" },
    { name: "Bose QC Ultra", imageUrl: "https://picsum.photos/seed/boseqc/200" },
    { name: "AirPods Pro 2", imageUrl: "https://picsum.photos/seed/airpods/200" }
  ],
  "TV": [
    { name: "LG C3 OLED", imageUrl: "https://picsum.photos/seed/lgc3/200" },
    { name: "Samsung S95C QLED", imageUrl: "https://picsum.photos/seed/s95c/200" },
    { name: "Sony Bravia A95L", imageUrl: "https://picsum.photos/seed/a95l/200" }
  ],
  "Camera": [
    { name: "Sony A7 IV", imageUrl: "https://picsum.photos/seed/a7iv/200" },
    { name: "Canon EOS R6", imageUrl: "https://picsum.photos/seed/eosr6/200" },
    { name: "Fujifilm X-T5", imageUrl: "https://picsum.photos/seed/xt5/200" }
  ],
  "Gaming Console": [
    { name: "PlayStation 5", imageUrl: "https://picsum.photos/seed/ps5/200" },
    { name: "Xbox Series X", imageUrl: "https://picsum.photos/seed/xbox/200" },
    { name: "Nintendo Switch", imageUrl: "https://picsum.photos/seed/switch/200" }
  ],
  "Smartwatch": [
    { name: "Apple Watch Ultra 2", imageUrl: "https://picsum.photos/seed/awu2/200" },
    { name: "Samsung Galaxy Watch 6", imageUrl: "https://picsum.photos/seed/gw6/200" },
    { name: "Garmin Fenix 7", imageUrl: "https://picsum.photos/seed/fenix7/200" }
  ],
  "Tablet": [
    { name: "iPad Pro", imageUrl: "https://picsum.photos/seed/ipadpro/200" },
    { name: "Samsung Galaxy Tab S9", imageUrl: "https://picsum.photos/seed/tabs9/200" },
    { name: "Microsoft Surface Pro 9", imageUrl: "https://picsum.photos/seed/surface/200" }
  ],
  "Printer": [
    { name: "HP LaserJet Pro", imageUrl: "https://picsum.photos/seed/laserjet/200" },
    { name: "Canon PIXMA", imageUrl: "https://picsum.photos/seed/pixma/200" },
    { name: "Brother HL-L2395DW", imageUrl: "https://picsum.photos/seed/brother/200" }
  ]
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
      for (const productData of sampleProducts[category]) {
        const product = await Product.create({
          name: productData.name,
          category: category,
          imageUrl: productData.imageUrl // Save the image URL
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