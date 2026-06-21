const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const FAQ = require('../models/FAQ');
const WebsiteContent = require('../models/WebsiteContent');
const Product = require('../models/Product');
const KnowledgeBase = require('../models/KnowledgeBase');
const { indexDocument } = require('../utils/vectorStore');

const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/timewell';

const initialFAQs = [
  {
    question: "Do you manufacture custom size mattresses?",
    answer: "Yes, we are direct manufacturers! We specialize in custom-sized mattresses. You can specify your exact length, width, and thickness requirements (e.g. 78x60x6 inches or custom odd shapes) and we will craft it for you. Talk with us on WhatsApp or submit a request on our contact page.",
    category: "Customization"
  },
  {
    question: "What is your return policy?",
    answer: "Since custom mattresses are made to order, they are non-refundable unless there is a physical manufacturing defect. For standard-size mattresses, we offer a 10-day replacement window if the product remains unopened and in original factory packaging.",
    category: "Return Policy"
  },
  {
    question: "How long does shipping and delivery take?",
    answer: "Manufacturing standard mattresses takes 2-3 business days. Custom configurations or sectional sofas take 4-7 business days. Shipping transit time is usually 2-5 days depending on your location. Delivery is free within regional limits.",
    category: "Shipping"
  },
  {
    question: "What type of wood do you use for your sofas?",
    answer: "We use premium treated solid Neem wood and Sal wood for our structural sofa frames. Both woods are naturally resistant to termites and warping, ensuring the sofa frame remains durable and rigid for over a decade.",
    category: "Materials"
  },
  {
    question: "Do you offer cash on delivery (COD)?",
    answer: "For standard catalog items, we offer Cash on Delivery. However, for custom-size mattresses and bespoke sectional sofas, we require a minimum 30% advance deposit to initiate manufacturing, with the balance payable upon delivery.",
    category: "Payment"
  },
  {
    question: "Where are your store showrooms located?",
    answer: "Our main factory showroom depot is in Delhi: Plot No. 42, Industrial Area, Sector 5. We also have a regional distribution center in Bengaluru: Survey No 84, Outer Ring Road, Mahadevapura. You can visit both to experience the sleep foam and latex qualities in person.",
    category: "Locations"
  }
];

const initialWebsiteContent = [
  {
    key: "about_us",
    title: "About TimeWell Mattress Factory",
    content: "TimeWell Mattress Factory began with a simple mission: to eliminate the bloated middleman showroom costs and deliver orthopaedic and luxury mattresses directly from the assembly line to consumers' homes.\n\nWe utilize state-of-the-art manufacturing processes to design memory foam, natural latex, and pocket spring comfort cores. Every mattress is crafted with precision, checking for exact density levels and edge support integrity to ensure deep sleep that lasts for years. By controlling the entire manufacturing pipeline, we guarantee that you get premium quality at a fraction of standard retail prices."
  },
  {
    key: "contact_info",
    title: "Contact Information and Support Details",
    content: "Factory Location Outlet:\nPlot No. 42, Industrial Area, Sector 5, Near Metro Pillar 110, New Delhi, Pin 110015\n\nDistribution Outlets Phone Support:\n+91 98765 43210 (Delhi Depot) / +91 98111 22233 (Bengaluru Depot)\n\nEmail Support:\nsales@timewellfactory.com\n\nWorking Hours:\nMonday to Sunday (9:00 AM - 8:30 PM)"
  },
  {
    key: "store_locations",
    title: "Outlets and Showrooms Directory",
    content: "1. Main Factory Depot & Outlet (Delhi Central):\nPlot No. 42, Industrial Area, Sector 5, Near Metro Pillar 110, New Delhi, Pin 110015.\nPhone: +91 98765 43210.\n\n2. Southern Regional Distribution Center (Bengaluru Outlet):\nSurvey No 84, Outer Ring Road, Mahadevapura, Bengaluru, Karnataka, Pin 560048.\nPhone: +91 98111 22233."
  },
  {
    key: "warranty_policy",
    title: "Warranty & Support Terms",
    content: "TimeWell Mattress Factory offers a comprehensive manufacturer-backed warranty program on all our mattresses and sofa structures.\n\n1. Orthopaedic Memory Foam Range: Up to 10 Years limited warranty against foam sagging, core softening, or structural collapse.\n2. Premium Natural Latex Core Range: Up to 12 Years limited warranty covering latex tearing or indentation exceeding 1.5 inches.\n3. Luxury Pocket Coil Hybrid Spring Systems: Up to 8 Years warranty on pocket springs against spring coil breakages or localized structural frame collapse.\n4. Custom Sectional Sofa Range: Up to 5 Years warranty on internal solid timber frameworks and high-density foam cushioning."
  },
  {
    key: "delivery_info",
    title: "Delivery and Shipping Operations",
    content: "We deliver across major metropolitan areas in India. Standard-size mattresses are shipped within 3 days. Custom mattresses and sofas take 5-7 days for fabrication. Shipping is free for ground-floor drop deliveries. Lift charges or high-floor manual carries may incur nominal local fees."
  },
  {
    key: "return_policy",
    title: "Return and Replacement Policies",
    content: "We offer a 10-day replacement window for standard mattresses in unopened, sealed packaging. Once opened or customized, the product cannot be returned due to hygiene and measurement specifications. Warranty claims for structural sagging are handled directly by the support team."
  }
];

const seedAI = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(dbUri);
    console.log('Database connected successfully.');

    // 1. Clear current KnowledgeBase entries
    console.log('Clearing existing AI Knowledge Base vectors...');
    await KnowledgeBase.deleteMany({});

    // 2. Seed FAQs
    console.log('Seeding FAQs...');
    await FAQ.deleteMany({});
    for (const faq of initialFAQs) {
      const createdFaq = await FAQ.create(faq);
      const textToIndex = `FAQ Category: ${createdFaq.category}\nQuestion: ${createdFaq.question}\nAnswer: ${createdFaq.answer}`;
      await indexDocument(createdFaq.question, textToIndex, 'faq', createdFaq._id.toString());
    }
    console.log(`Seeded ${initialFAQs.length} FAQ articles.`);

    // 3. Seed Website Content pages
    console.log('Seeding Website Page Contents...');
    await WebsiteContent.deleteMany({});
    for (const page of initialWebsiteContent) {
      const createdPage = await WebsiteContent.create(page);
      const textToIndex = `Section: ${createdPage.title}\nContent details: ${createdPage.content}`;
      await indexDocument(createdPage.title, textToIndex, 'website_content', createdPage.key);
    }
    console.log(`Seeded ${initialWebsiteContent.length} website pages.`);

    // 4. Index Products (if any exist)
    console.log('Indexing existing product catalogs...');
    const products = await Product.find({});
    for (const p of products) {
      const content = `Product: ${p.name}
Category: ${p.category}
Base Price: Starting from ₹${p.basePrice}
Short Description: ${p.shortDescription}
Detailed Description: ${p.description}
Benefits: ${p.benefits.join(', ')}
Specifications: ${JSON.stringify(p.specifications)}`;
      await indexDocument(p.name, content, 'product', p._id.toString());
    }
    console.log(`Indexed ${products.length} products into RAG vectors.`);

    console.log('AI Knowledge Base Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedAI();
