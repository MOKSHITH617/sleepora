const Product = require('../models/Product');

// Helper to convert dynamic names into URL-safe slugs
const generateSlug = (name) => {
  return name
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
    .replace(/\-\-+/g, '-');    // Replace multiple - with single -
};

// @desc    Get all products (supports filtering by category, search term, featured)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category, isFeatured, isAvailable, search } = req.query;
    const query = {};

    if (category) {
      query.category = category;
    }
    if (isFeatured !== undefined) {
      query.isFeatured = isFeatured === 'true';
    }
    if (isAvailable !== undefined) {
      query.isAvailable = isAvailable === 'true';
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    return res.json({ success: true, count: products.length, products });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product details by slug (useful for SEO friendly routes)
// @route   GET /api/products/:slug
// @access  Public
const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    return res.json({ success: true, product });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private (Admin)
const createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };
    
    // Auto-generate slug if missing
    if (!productData.slug) {
      productData.slug = generateSlug(productData.name);
    }

    // Auto-generate shortDescription if missing
    if (!productData.shortDescription && productData.description) {
      productData.shortDescription = productData.description.substring(0, 160);
    }

    // Support incoming JSON string properties from multipart forms
    if (typeof productData.specifications === 'string') {
      productData.specifications = JSON.parse(productData.specifications);
    }
    if (typeof productData.benefits === 'string') {
      productData.benefits = JSON.parse(productData.benefits);
    }
    if (typeof productData.images === 'string') {
      productData.images = JSON.parse(productData.images);
    }

    // Ensure slug uniqueness
    const existingProduct = await Product.findOne({ slug: productData.slug });
    if (existingProduct) {
      productData.slug = `${productData.slug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const product = await Product.create(productData);
    return res.status(201).json({ success: true, product });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update an existing product
// @route   PUT /api/products/:id
// @access  Private (Admin)
const updateProduct = async (req, res) => {
  try {
    const productData = { ...req.body };

    if (productData.name && !productData.slug) {
      productData.slug = generateSlug(productData.name);
    }

    // Auto-generate shortDescription if missing
    if (!productData.shortDescription && productData.description) {
      productData.shortDescription = productData.description.substring(0, 160);
    }

    // Support incoming JSON strings
    if (typeof productData.specifications === 'string') {
      productData.specifications = JSON.parse(productData.specifications);
    }
    if (typeof productData.benefits === 'string') {
      productData.benefits = JSON.parse(productData.benefits);
    }
    if (typeof productData.images === 'string') {
      productData.images = JSON.parse(productData.images);
    }

    const product = await Product.findByIdAndUpdate(req.params.id, productData, {
      new: true,
      runValidators: true
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    return res.json({ success: true, product });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (Admin)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    return res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct
};
