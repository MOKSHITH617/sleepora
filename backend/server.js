const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');

require('dotenv').config();


// Initialize express application
const app = express();

// Connect to Database
connectDB();

// Middleware Setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Custom Security: In-Memory IP Rate Limiter
const rateLimits = new Map();
const rateLimiter = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  const limitWindow = 60 * 1000; // 1 minute
  const maxRequests = 120; // 120 requests per minute

  if (!rateLimits.has(ip)) {
    rateLimits.set(ip, []);
  }

  const timestamps = rateLimits.get(ip).filter(t => now - t < limitWindow);
  timestamps.push(now);
  rateLimits.set(ip, timestamps);

  if (timestamps.length > maxRequests) {
    return res.status(429).json({ success: false, message: 'Too many requests from this IP. Please try again later.' });
  }
  next();
};
app.use(rateLimiter);

// Custom Security: Input Sanitization against XSS
const sanitizeInput = (req, res, next) => {
  const sanitize = (val) => {
    if (typeof val === 'string') {
      return val.replace(/<script[^>]*>([\S\s]*?)<\/script>/gi, '').trim();
    }
    if (Array.isArray(val)) {
      return val.map(sanitize);
    }
    if (typeof val === 'object' && val !== null) {
      const cleaned = {};
      for (const key in val) {
        cleaned[key] = sanitize(val[key]);
      }
      return cleaned;
    }
    return val;
  };
  req.body = sanitize(req.body);
  req.query = sanitize(req.query);
  req.params = sanitize(req.params);
  next();
};
app.use(sanitizeInput);

// Configure Helmet to allow cross-origin assets loading
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// Request logger for development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve local upload assets statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes Mapping
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/configs', require('./routes/configRoutes'));
app.use('/api/leads', require('./routes/leadRoutes'));
app.use('/api/testimonials', require('./routes/testimonialRoutes'));
app.use('/api/homepage', require('./routes/homepageRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/faqs', require('./routes/faqRoutes'));
app.use('/api/website-content', require('./routes/websiteContentRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// Dynamic XML Sitemap Endpoint
const { generateSitemapXml } = require('./utils/sitemap');
app.get('/sitemap.xml', async (req, res) => {
  try {
    const host = req.headers.host;
    const protocol = req.secure ? 'https' : 'http';
    const hostUrl = `${protocol}://${host}`;
    
    const sitemapXml = await generateSitemapXml(hostUrl);
    
    res.header('Content-Type', 'application/xml');
    return res.status(200).send(sitemapXml);
  } catch (error) {
    console.error('Sitemap fetch failed:', error);
    return res.status(500).send('Error generating sitemap');
  }
});

// Root route health check
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to TimeWell Mattress and Sofa Factory API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, async () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'production'} mode on port ${PORT}`);
  
  // Auto-seed check: If no admin exists, trigger automatic seed script configuration
  try {
    const User = require('./models/User');
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('No user accounts detected. Seeding initial store database configurations...');
      // Run internal seed routine
      const { exec } = require('child_process');
      exec('npm run seed', (err, stdout, stderr) => {
        if (err) {
          console.error('Auto-seeding task execution failed:', err);
          return;
        }
        console.log(stdout);
      });
    }
  } catch (seedError) {
    console.error('Database connection checking for auto-seeding failed:', seedError);
  }
});
