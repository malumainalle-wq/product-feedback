// backend/seed.js
const mongoose = require('mongoose');
const fetch = require('node-fetch'); // <-- Import node-fetch
require('dotenv').config(); // <-- Load .env variables

const Product = require('./models/Product');
const Feedback = require('./models/Feedback');

const MONGO_URI = "mongodb://127.0.0.1:27017/product_feedback";
const accessKey = process.env.UNSPLASH_ACCESS_KEY; 

// Helper function to add a delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to get an image from Unsplash
const getImageForProduct = async (query) => {
  if (!accessKey) {
    console.warn(`No Unsplash key. Using placeholder for "${query}".`);
    return `https://picsum.photos/seed/${query.replace(/ /g, '')}/200`;
  }
  
  try {
    const res = await fetch(`https://api.unsplash.com/search/photos?page=1&per_page=1&query=${encodeURIComponent(query)}&client_id=${accessKey}`);
    const data = await res.json();
    
    if (data.results && data.results.length > 0) {
      return data.results[0].urls.small; // Get the small URL
    }
  } catch (err) {
    console.error(`Failed to fetch image for ${query}:`, err.message);
  }
  // Fallback if API fails or no image is found
  return `https://picsum.photos/seed/${query.replace(/ /g, '')}/200`;
};


// --- Your product data ---
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
// -------------------------


const seedDatabase = async () => {
  if (!accessKey) {
    console.log("---------------------------------------------------------------");
    console.warn("WARNING: UNSPLASH_ACCESS_KEY not found in backend/.env");
    console.log("Seeding will use placeholder images.");
    console.log("---------------------------------------------------------------");
  }

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
        
        console.log(`Fetching image for ${productName}...`);
        // Get the specific image URL
        const imageUrl = await getImageForProduct(productName);
        
        const product = await Product.create({
          name: productName,
          category: category,
          imageUrl: imageUrl // Save the real image URL
        });
        createdProducts.push(product);

        // !! Add a 1-second delay to respect Unsplash's free tier rate limit
        await delay(1000); 
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