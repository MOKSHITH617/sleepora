const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '../.env') });

const Product = require('../models/Product');

const uploadImagesToCloudinary = async () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.error('❌ Error: Cloudinary credentials are missing in backend/.env!');
    console.error('Please configure the following in backend/.env:');
    console.error('  CLOUDINARY_CLOUD_NAME=your_cloud_name');
    console.error('  CLOUDINARY_API_KEY=your_api_key');
    console.error('  CLOUDINARY_API_SECRET=your_api_secret');
    process.exit(1);
  }

  // Configure Cloudinary
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
  });

  const imagesDir = path.join(__dirname, '../../frontend/public/images');
  if (!fs.existsSync(imagesDir)) {
    console.error(`❌ Error: Image directory not found at ${imagesDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(imagesDir).filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f));
  console.log(`Found ${files.length} images in frontend/public/images to upload to Cloudinary.`);

  const urlMap = {};
  const configDir = path.join(__dirname, '../config');
  const urlMapFilePath = path.join(configDir, 'cloudinary_urls.json');

  // Load existing mapping if available
  if (fs.existsSync(urlMapFilePath)) {
    try {
      const existingData = fs.readFileSync(urlMapFilePath, 'utf8');
      Object.assign(urlMap, JSON.parse(existingData));
    } catch (e) {
      console.warn('Warning: Failed to parse existing cloudinary_urls.json file.');
    }
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(imagesDir, file);
    const localPathKey = `/images/${file}`;
    const publicId = path.parse(file).name;

    console.log(`[${i + 1}/${files.length}] Uploading ${file} to Cloudinary...`);
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'sleepora_products',
        public_id: publicId,
        overwrite: true,
        resource_type: 'image'
      });

      urlMap[localPathKey] = result.secure_url;
      console.log(`  └─ Success: ${result.secure_url}`);
    } catch (err) {
      console.error(`  └─ ❌ Failed to upload ${file}:`, err.message);
    }
  }

  // Ensure config directory exists and write mapping file
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
  fs.writeFileSync(urlMapFilePath, JSON.stringify(urlMap, null, 2), 'utf8');
  console.log(`\nSaved Cloudinary URL mappings to ${urlMapFilePath}`);

  // Connect to Database and Update Products
  const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sleepora';
  console.log(`\nConnecting to MongoDB (${dbUri})...`);
  try {
    await mongoose.connect(dbUri);
    console.log('Connected to MongoDB.');

    const products = await Product.find({});
    console.log(`Found ${products.length} products in database. Updating image URLs...`);

    let updatedCount = 0;
    for (const product of products) {
      let modified = false;
      const updatedImages = product.images.map(img => {
        if (urlMap[img]) {
          modified = true;
          return urlMap[img];
        }
        return img;
      });

      if (modified) {
        product.images = updatedImages;
        await product.save();
        updatedCount++;
        console.log(`  ✔ Updated product: "${product.name}"`);
      }
    }

    console.log(`\n🎉 Successfully updated ${updatedCount} product(s) in MongoDB with Cloudinary URLs.`);
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  } catch (dbErr) {
    console.error('❌ Database error:', dbErr.message);
  }

  console.log('\nCloudinary upload & database sync process finished.');
  process.exit(0);
};

uploadImagesToCloudinary();
