import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import MattressConfigurator from '../components/MattressConfigurator';
import MetaTags from '../components/MetaTags';
import ProductGallery from '../components/ProductGallery';

const MATTRESS_SIZES = [
  { id: 'single', name: 'Single Size (72" x 48")', multiplier: 0.7 },
  { id: 'double', name: 'Double Size (72" x 60")', multiplier: 0.85 },
  { id: 'queen', name: 'Queen Size (78" x 60")', multiplier: 1.0 },
  { id: 'king', name: 'King Size (78" x 72")', multiplier: 1.2 }
];

const MATTRESS_THICKNESSES = [
  { id: '3inch', name: '3 Inch Thickness', modifier: -2000 },
  { id: '4inch', name: '4 Inch Thickness', modifier: -1000 },
  { id: '5inch', name: '5 Inch Thickness', modifier: 0 },
  { id: '6inch', name: '6 Inch Thickness', modifier: 1500 },
  { id: '8inch', name: '8 Inch Thickness', modifier: 3500 },
  { id: '10inch', name: '10 Inch Thickness', modifier: 5500 }
];

const MATTRESS_COMFORTS = [
  { id: 'ortho', name: 'Medium Firm Orthopaedic', desc: 'Optimal spine alignment and lower back relief.', modifier: 0 },
  { id: 'dual', name: 'Dual Comfort (Dual Sided)', desc: 'Medium-soft on one side, firm on the other.', modifier: 1200 },
  { id: 'latex', name: 'Plush Natural Latex', desc: 'Bouncy organic latex comfort layers.', modifier: 3500 }
];

const MATTRESS_COVERS = [
  { id: 'standard', name: 'Quilted GSM Breathing Cover', modifier: 0, desc: 'Soft and breathable hypoallergenic fabric' },
  { id: 'organic', name: 'Organic Knitted Cotton Cover', modifier: 1500, desc: '100% organic cotton weave for cool sleep touch' },
  { id: 'cashmere', name: 'Luxury Cashmere Weave Cover', modifier: 3200, desc: 'Hand-selected premium wool touch comfort finish' }
];

const getMattressCoverModifier = (cover) => {
  if (!cover) return 0;
  if (cover.includes('Organic')) return 1500;
  if (cover.includes('Cashmere')) return 3200;
  return 0;
};

const renderMattressSVG = (comfort, thickness, cover) => {
  const isLatex = comfort.includes('Latex');
  const isDual = comfort.includes('Dual');
  const coreColor = isLatex ? '#FFE082' : isDual ? '#80DEEA' : '#A5D6A7';
  
  return (
    <svg viewBox="0 0 280 150" className="w-full h-auto max-w-[180px] mx-auto drop-shadow-[0_8px_20px_rgba(0,0,0,0.15)] overflow-visible">
      {/* Shadow */}
      <ellipse cx="140" cy="122" rx="90" ry="10" fill="rgba(0,0,0,0.12)" />
      
      {/* Outer Mattress Body */}
      <rect x="50" y="30" width="180" height="82" rx="12" fill="#FAF8F5" stroke="#E5DEC9" strokeWidth="1.5" />
      
      {/* Top Cover Layer */}
      <rect x="50" y="30" width="180" height="16" rx="4" fill="#FFFDFC" />
      {/* Cover Wavy patterns */}
      <path d="M 50 38 Q 65 34 80 38 Q 95 34 110 38 Q 125 34 140 38 Q 155 34 170 38 Q 185 34 200 38 Q 215 34 230 38" fill="none" stroke="#E6DFD5" strokeWidth="1" />
      <text x="140" y="41" textAnchor="middle" className="text-[7.5px] font-sans font-bold fill-stone-500 uppercase tracking-widest">{cover.split(' Cover')[0]}</text>
      
      {/* Comfort Core Layer */}
      <rect x="50" y="46" width="180" height="28" fill={coreColor} opacity="0.9" />
      <text x="140" y="62" textAnchor="middle" className="text-[8px] font-sans font-bold fill-stone-700 uppercase tracking-wider">{comfort.split(' (')[0]}</text>
      
      {/* Base Support Layer */}
      <rect x="50" y="74" width="180" height="30" rx="4" fill="#8D6E63" />
      <text x="140" y="93" textAnchor="middle" className="text-[8.5px] font-sans font-bold fill-white uppercase tracking-widest">{thickness}</text>
    </svg>
  );
};

const MattressDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  
  // Responsive / UX UI States
  const [isMobile, setIsMobile] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState('specs');
  
  // Custom scroll navigation refs & active progress step
  const scrollContainerRef = useRef(null);
  const sizeRef = useRef(null);
  const comfortRef = useRef(null);
  const thicknessRef = useRef(null);
  const fabricRef = useRef(null);
  const layersRef = useRef(null);
  const summaryRef = useRef(null);
  const [activeStep, setActiveStep] = useState(1);

  // Dynamic Layer Composition calculator
  const getLayerComposition = (comfort, thickness) => {
    const isLatex = comfort.includes('Latex');
    const isDual = comfort.includes('Dual');
    const totalInch = parseInt(thickness) || 6;
    
    if (isLatex) {
      const first = 2;
      const last = 1;
      const middle = Math.max(1, totalInch - first - last);
      return [
        { height: `${first}"`, name: 'Organic Pin-Core Latex', desc: 'Bouncy organic latex ventilation.' },
        { height: `${middle}"`, name: 'Ortho Support Foam', desc: 'Targeted joint relief.' },
        { height: `${last}"`, name: 'High Resilient Base Foam', desc: 'Durable foundation support.' }
      ];
    } else if (isDual) {
      const first = 2;
      const last = 1;
      const middle = Math.max(1, totalInch - first - last);
      return [
        { height: `${first}"`, name: 'Dual Profile Soft Foam', desc: 'Soft contouring feel on one side.' },
        { height: `${middle}"`, name: 'High Density Support Foam', desc: 'Firm stability on the flip side.' },
        { height: `${last}"`, name: 'Breathable PU Foam', desc: 'Generous airflow and cushioning.' }
      ];
    } else {
      const first = 1.5;
      const bottom = 0.5;
      const next = 1;
      const middle = Math.max(1, totalInch - first - next - bottom);
      return [
        { height: `${first}"`, name: 'Cooling Gel Memory Foam', desc: 'Temperature regulating comfort.' },
        { height: `${middle}"`, name: 'High Resilient Ortho Foam', desc: '5-zone support alignment.' },
        { height: `${next}"`, name: 'Latex Comfort Layer', desc: 'Pressure relief and airflow.' },
        { height: `${bottom}"`, name: 'Premium Quilted Fabric', desc: 'Soft luxurious finish.' }
      ];
    }
  };

  // Custom configured parameters
  const [customSize, setCustomSize] = useState('Queen Size (78" x 60")');
  const [customThickness, setCustomThickness] = useState('6 Inch Thickness');
  const [customComfort, setCustomComfort] = useState('Medium Firm Orthopaedic');
  const [customCover, setCustomCover] = useState('Quilted GSM Breathing Cover');
  const [customPrice, setCustomPrice] = useState(0);

  // Bottom Sheet Draggable touch interaction handlers
  const [dragOffset, setDragOffset] = useState(0);
  const touchStartY = useRef(0);
  const activeDrag = useRef(false);

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
    activeDrag.current = true;
  };

  const handleTouchMove = (e) => {
    if (!activeDrag.current) return;
    const deltaY = e.touches[0].clientY - touchStartY.current;
    if (deltaY > 0) {
      setDragOffset(deltaY);
    }
  };

  const handleTouchEnd = () => {
    activeDrag.current = false;
    if (dragOffset > 150) {
      setIsBottomSheetOpen(false);
    }
    setDragOffset(0);
  };

  // Scroll listener for bottom sheet sections
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const scrollPos = container.scrollTop + 140; // visual trigger offset
    
    if (summaryRef.current && scrollPos >= summaryRef.current.offsetTop) {
      setActiveStep(6);
    } else if (layersRef.current && scrollPos >= layersRef.current.offsetTop) {
      setActiveStep(5);
    } else if (fabricRef.current && scrollPos >= fabricRef.current.offsetTop) {
      setActiveStep(4);
    } else if (thicknessRef.current && scrollPos >= thicknessRef.current.offsetTop) {
      setActiveStep(3);
    } else if (comfortRef.current && scrollPos >= comfortRef.current.offsetTop) {
      setActiveStep(2);
    } else {
      setActiveStep(1);
    }
  };

  const scrollToSection = (sectionRef, step) => {
    if (sectionRef.current && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: sectionRef.current.offsetTop - 10,
        behavior: 'smooth'
      });
      setActiveStep(step);
    }
  };

  // Resize Listener
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch product data & configurator options
  useEffect(() => {
    const fetchDetailData = async () => {
      try {
        setLoading(true);
        const prodRes = await API.get(`/products/${slug}`);
        if (prodRes.data?.product) {
          setProduct(prodRes.data.product);
          setActiveImage(prodRes.data.product.images?.[0] || '/images/ortho_mattress.png');
          
          // Set initial defaults based on product slug/core type
          const coreType = prodRes.data.product.mattressCoreType;
          const comfortName = coreType === 'latex' ? 'Plush Natural Latex' :
                              coreType === 'dual' ? 'Dual Comfort (Dual Sided)' : 'Medium Firm Orthopaedic';
          setCustomComfort(comfortName);
        } else {
          setError('Product details not found.');
        }

        const configRes = await API.get('/configs/mattress');
        if (configRes.data?.config) setConfig(configRes.data.config);

      } catch (err) {
        console.error('Failed to load product details:', err);
        setError('Error loading product details.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetailData();
  }, [slug]);

  // Fetch related mattresses
  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await API.get('/products');
        if (res.data?.products) {
          setRelatedProducts(res.data.products.filter(p => p.slug !== slug && p.category === 'mattress').slice(0, 5));
        }
      } catch (err) {
        console.warn('Failed to load related products', err);
      }
    };
    fetchRelated();
  }, [slug]);

  // Dynamic price calculation
  useEffect(() => {
    if (product) {
      const basePrice = product.basePrice || 8500;
      const sizeObj = MATTRESS_SIZES.find(s => s.name === customSize) || MATTRESS_SIZES[2];
      const thickObj = MATTRESS_THICKNESSES.find(t => t.name === customThickness) || MATTRESS_THICKNESSES[1];
      const comfortObj = MATTRESS_COMFORTS.find(c => c.name === customComfort) || MATTRESS_COMFORTS[0];

      const sizeMultiplier = sizeObj.multiplier;
      const thicknessModifier = thickObj.modifier;
      const comfortModifier = comfortObj.modifier;
      const coverModifier = getMattressCoverModifier(customCover);

      setCustomPrice(Math.round((basePrice * sizeMultiplier) + thicknessModifier + comfortModifier + coverModifier));
    }
  }, [customSize, customThickness, customComfort, customCover, product]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-[#8B6844] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-20">
        <h3 className="text-lg font-bold font-display text-primary mb-4">{error || 'Product Not Found'}</h3>
        <Link to="/mattresses" className="bg-primary text-white py-2 px-6 rounded-sm hover:bg-primary-light transition-colors">
          Return to Catalogue
        </Link>
      </div>
    );
  }

  // Schema.org Product Structured Data
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": activeImage.startsWith('http') ? activeImage : `${window.location.origin}${activeImage}`,
    "description": product.description,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": product.basePrice.toString(),
      "availability": product.isAvailable ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "LocalBusiness",
        "name": "Sleepora Mattress Factory"
      }
    }
  };

  const steps = [
    { id: 1, label: 'Size', ref: sizeRef },
    { id: 2, label: 'Comfort', ref: comfortRef },
    { id: 3, label: 'Thickness', ref: thicknessRef },
    { id: 4, label: 'Fabric', ref: fabricRef },
    { id: 5, label: 'Layers', ref: layersRef },
    { id: 6, label: 'Summary', ref: summaryRef }
  ];

  const standardMattressLabels = [
    'Front View',
    'Side Profile',
    'Thickness / Cross-Section',
    'Layer Composition',
    'Quilted Cover Texture',
    'Factory Craftsmanship'
  ];

  const defaultMattressGallery = [
    product.images?.[0] || '/images/ortho_mattress.png',
    '/images/latex_mattress.png',
    '/images/pocket_spring.png',
    '/images/workers_crafting.png',
    '/images/factory_floor.png'
  ];

  const imagesList = product.images && product.images.length > 1 
    ? product.images 
    : defaultMattressGallery;

  const getMattressCategoryLabel = (coreType) => {
    if (coreType === 'ortho') return 'Orthopedic';
    if (coreType === 'latex') return 'Natural Latex';
    if (coreType === 'spring') return 'Pocket Spring';
    if (coreType === 'coir') return 'Coir';
    if (coreType === 'dual') return 'Dual Comfort';
    return 'Organic';
  };

  // Submit Inquiry Lead Form logger
  const handleGetQuoteMobile = () => {
    navigate('/contact', {
      state: {
        productName: product.name,
        category: 'mattress',
        configuration: {
          size: customSize,
          thickness: customThickness,
          comfortCore: customComfort,
          fabricCover: customCover
        },
        price: customPrice
      }
    });
  };

  const handleMobileInquiry = async () => {
    try {
      const leadData = {
        name: 'Mobile Customer Inquiry (Mattress)',
        phone: 'Unspecified',
        email: 'mobile_mattress_inquiry@sleepora.com',
        productName: product.name,
        category: 'mattress',
        configuration: {
          size: customSize,
          thickness: customThickness,
          comfortCore: customComfort,
          fabricCover: customCover,
          dimensions: 'Custom Layout sizing'
        },
        finalPrice: customPrice
      };
      await API.post('/leads', leadData);
    } catch (err) {
      console.error(err);
    }

    const whatsappNumber = '919876543210';
    const msg = `Hello! I would like to enquire about the ${product.name} Mattress. Here is my custom configuration details:
- *Size*: ${customSize}
- *Thickness*: ${customThickness}
- *Comfort Core*: ${customComfort}
- *Fabric Cover*: ${customCover}
- *Dynamic Price*: ₹${customPrice.toLocaleString('en-IN')}
Please assist me with booking!`;

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="w-full bg-[#FFFDFC] select-none product-detail-page font-sans text-[#201712]">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @media (max-width: 767px) {
          header.fixed { display: none !important; }
          main { padding-top: 0 !important; }
          .product-detail-page { padding-top: 0 !important; }
        }
      `}} />
      
      <MetaTags 
        title={product.name}
        description={product.shortDescription}
        ogImage={activeImage}
        productSchema={productSchema}
      />

      {isMobile ? (
        /* ==========================================
           REDesigned MOBILE LAYOUT (320px-430px)
           ========================================== */
        <div className="px-4 pb-24 pt-3 flex flex-col bg-[#FFFDFC] min-h-screen">
          {/* Back Navigation Bar */}
          <div className="sticky top-0 left-0 right-0 z-30 bg-[#FFFDFC]/95 backdrop-blur-md border-b border-[#E0D8CE]/40 py-2.5 flex items-center justify-between -mx-4 px-4 mb-4 shadow-3xs">
            <div className="flex items-center gap-2">
              <Link to="/mattresses" className="text-xs font-bold text-[#8B6844] flex items-center gap-1">
                <span>←</span> <span>Back</span>
              </Link>
              <span className="h-3 w-[1px] bg-[#E0D8CE]"></span>
              <span className="text-xs font-serif font-bold text-[#201712] truncate max-w-[180px]">
                {product.name}
              </span>
            </div>
            <div className="flex gap-4 text-stone-500 text-sm">
              <button aria-label="Share" onClick={() => alert("Link copied to clipboard!")}>📤</button>
              <button aria-label="Favorite" onClick={() => alert("Added to favorites!")}>🤍</button>
            </div>
          </div>

          {/* Section 1: Product Main Info Above Fold */}
          <div className="flex flex-col gap-3.5">
            {/* Gallery Image Box */}
            <div className="w-full h-[240px] relative rounded-2xl overflow-hidden bg-[#F8F5EF] border border-[#E0D8CE]/40 shadow-3xs">
              <img 
                src={activeImage} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {imagesList.map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveImage(img)}
                    className={`w-2 h-2 rounded-full transition-all ${img === activeImage ? 'bg-[#8B6844] scale-110' : 'bg-[#8B6844]/30'}`}
                  />
                ))}
              </div>
            </div>

            {/* Badges, Stars & Description */}
            <div>
              <div className="flex justify-between items-center gap-2">
                <span className="inline-block bg-[#8B6844] text-[#FFFDFC] font-bold text-[8.5px] uppercase tracking-[1.5px] py-0.5 px-2 rounded-sm shadow-3xs">
                  FACTORY DIRECT
                </span>
                <div className="flex items-center gap-1 text-[11px] font-bold text-[#8B6844]">
                  <span>★★★★☆</span>
                  <span className="text-stone-500 font-semibold">(4.9)</span>
                </div>
              </div>
              <h1 className="text-xl font-serif font-bold text-[#201712] mt-1 leading-snug">{product.name}</h1>
              <p className="text-[11.5px] text-[#6D6258] mt-1 line-clamp-2 leading-relaxed font-medium">
                {product.shortDescription || product.description}
              </p>
            </div>

            {/* Slashed Prices Box */}
            <div className="flex items-baseline gap-2 bg-[#F8F5EF]/50 p-2.5 rounded-xl border border-[#E0D8CE]/30">
              <div className="flex flex-col">
                <span className="text-[8.5px] text-[#6D6258] uppercase font-bold tracking-wider leading-none mb-0.5">Factory Price</span>
                <span className="text-xl font-bold font-serif text-[#8B6844]">
                  <span className="font-sans mr-0.5">₹</span>{customPrice.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex flex-col pl-2 border-l border-[#E0D8CE]/40">
                <span className="text-[8.5px] text-[#6D6258]/60 uppercase line-through tracking-wider leading-none mb-0.5">Retail Price</span>
                <span className="text-xs text-stone-400 line-through font-semibold">
                  <span className="font-sans mr-0.5">₹</span>{Math.round(customPrice * 1.9).toLocaleString('en-IN')}
                </span>
              </div>
              <span className="text-[9.5px] font-bold bg-[#8B6844]/15 text-[#8B6844] px-2 py-0.5 rounded border border-[#8B6844]/20 self-center ml-auto">
                Save 47%
              </span>
            </div>

            {/* Above fold Action CTAs */}
            <div className="flex gap-3 w-full justify-center">
              <button
                onClick={handleGetQuoteMobile}
                className="flex-1 bg-[#8B6844] hover:bg-[#725435] text-white font-bold text-xs uppercase tracking-wider rounded-[16px] flex items-center justify-center gap-2 transition-all shadow-sm h-[50px] active:scale-95 cursor-pointer font-sans"
              >
                <svg className="w-5 h-5 flex-shrink-0 fill-none stroke-current" width="20" height="20" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                <span>Get Quote</span>
              </button>
              <button
                onClick={() => setIsBottomSheetOpen(true)}
                className="flex-1 bg-white border border-[#8B6844] text-[#8B6844] hover:bg-[#F8F5EF] font-bold text-xs uppercase tracking-wider rounded-[16px] flex items-center justify-center gap-2 transition-all shadow-sm h-[50px] active:scale-95 cursor-pointer font-sans"
              >
                <svg className="w-5 h-5 flex-shrink-0 fill-none stroke-current" width="20" height="20" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                </svg>
                <span>Customize</span>
              </button>
            </div>
          </div>

          {/* Section 2: Core Feature Cards */}
          <div className="flex gap-2.5 overflow-x-auto py-3 mt-4.5 scrollbar-none snap-x border-t border-b border-[#E0D8CE]/30">
            {[
              { icon: '🏭', text: 'Factory Direct' },
              { icon: '🚚', text: 'Free Delivery' },
              { icon: '🛡️', text: '10 Yr Warranty' },
              { icon: '🧽', text: 'Spine Orthopaedic' }
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-1.5 bg-[#F8F5EF] py-1.5 px-3.5 rounded-full border border-[#E0D8CE]/40 flex-shrink-0 snap-start">
                <span className="text-xs">{f.icon}</span>
                <span className="text-[9.5px] font-bold text-[#201712] uppercase tracking-wider">{f.text}</span>
              </div>
            ))}
          </div>



          {/* Section 3: Expandable Accordions */}
          <div className="mt-4 flex flex-col gap-2">
            {[
              {
                id: 'specs',
                title: 'Product Specifications',
                content: (
                  <div className="flex flex-col gap-2 bg-white">
                    {Object.entries(product.specifications || {}).map(([k, v], idx) => (
                      <div key={idx} className="flex justify-between py-1.5 border-b border-[#E0D8CE]/20 last:border-0 text-xs">
                        <span className="font-bold text-stone-500">{k}</span>
                        <span className="font-semibold text-[#201712] text-right">{v}</span>
                      </div>
                    ))}
                  </div>
                )
              },
              {
                id: 'features',
                title: 'Key Design Benefits',
                content: (
                  <ul className="flex flex-col gap-2 text-xs bg-white">
                    {(product.benefits || []).map((b, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#8B6844] font-bold">✓</span>
                        <span className="text-[#6D6258] leading-relaxed">{b}</span>
                      </li>
                    ))}
                  </ul>
                )
              },
              {
                id: 'materials',
                title: 'Materials & Layers',
                content: (
                  <p className="text-xs text-[#6D6258] leading-relaxed">
                    Designed with multi-layered high-performance orthopaedic sleep foam, certified organic natural latex, and independent pocket coil hybrid systems. Fully covered in luxury GSM breathable quilted fabric for a comforting sleep touch.
                  </p>
                )
              },
              {
                id: 'warranty',
                title: 'Warranty Details',
                content: (
                  <p className="text-xs text-[#6D6258] leading-relaxed">
                    Comes with a 10-Year Comprehensive Factory Warranty. Covers shape deformation, foam sagging, or spring displacement under standard guidelines. Replacement warranty card included in the shipping bundle.
                  </p>
                )
              },
              {
                id: 'delivery',
                title: 'Shipping & Delivery',
                content: (
                  <p className="text-xs text-[#6D6258] leading-relaxed">
                    Dispatched straight from the production floor in vacuum rolled box packaging. Free door delivery across India. Safely arrives within 3-6 business days with regular tracking updates.
                  </p>
                )
              }
            ].map((acc) => {
              const isOpen = openAccordion === acc.id;
              return (
                <div key={acc.id} className="border border-[#E0D8CE]/40 rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setOpenAccordion(isOpen ? null : acc.id)}
                    className="w-full p-3.5 flex justify-between items-center text-[#201712] font-bold text-xs uppercase tracking-wider bg-[#F8F5EF]/30 hover:bg-[#F8F5EF]/60 transition-colors"
                  >
                    <span>{acc.title}</span>
                    <span className="text-stone-400">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div className="p-4 border-t border-[#E0D8CE]/30 bg-white">
                      {acc.content}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Section 4: Reviews */}
          <div className="mt-5 bg-[#F8F5EF]/30 p-4 rounded-2xl border border-[#E0D8CE]/40">
            <div className="flex justify-between items-baseline mb-3">
              <h3 className="font-serif font-bold text-sm text-[#201712]">Verified Reviews</h3>
              <span className="text-xs text-[#8B6844] font-bold">4.9 ★ (128 reviews)</span>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { name: 'Rohan K.', rating: '★★★★★', date: 'Yesterday', text: 'The mattress is a game changer for my back pain. Feels highly premium and luxurious, direct from the factory!' },
                { name: 'Simran J.', rating: '★★★★★', date: '4 days ago', text: 'Excellent support and soft luxury quilting cover. The bottom sheet config made choosing the size incredibly easy.' },
                { name: 'Amit G.', rating: '★★★★★', date: '2 weeks ago', text: 'Incredibly quick delivery in vacuum box pack. King size fits perfectly. Definitely highly recommended!' }
              ].map((r, i) => (
                <div key={i} className="bg-[#FFFDFC] border border-[#E0D8CE]/30 p-3 rounded-xl shadow-3xs flex flex-col gap-1">
                  <div className="flex justify-between items-center text-[10.5px]">
                    <span className="font-bold text-[#201712]">{r.name}</span>
                    <span className="text-[#8B6844]">{r.rating}</span>
                  </div>
                  <p className="text-[11px] text-[#6D6258] leading-relaxed italic">"{r.text}"</p>
                </div>
              ))}
            </div>
            <button 
              onClick={() => alert("Showing all reviews in a modal...")}
              className="w-full mt-3 bg-white hover:bg-stone-50 border border-[#E0D8CE] text-stone-600 font-bold text-[10.5px] uppercase tracking-wider py-2.5 rounded-lg text-center cursor-pointer shadow-3xs"
            >
              View All Reviews
            </button>
          </div>

          {/* Section 5: Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-5">
              <h3 className="font-serif font-bold text-sm text-[#201712] mb-3">Other Comfort Cores</h3>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x -mx-4 px-4">
                {relatedProducts.map((rel) => {
                  const relPrice = rel.basePrice || 8500;
                  const relImg = rel.images?.[0] || '/images/ortho_mattress.png';
                  return (
                    <div key={rel._id} className="w-[150px] bg-white border border-[#E0D8CE]/40 rounded-xl overflow-hidden shadow-3xs flex-shrink-0 snap-start flex flex-col justify-between p-2">
                      <div className="h-[90px] rounded-lg overflow-hidden bg-stone-100">
                        <img src={relImg} alt={rel.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="mt-2 flex-grow flex flex-col justify-between">
                        <h4 className="text-[11px] font-bold text-[#201712] line-clamp-1">{rel.name}</h4>
                        <span className="text-[10px] text-[#8B6844] font-bold block mt-0.5"><span className="font-sans mr-0.5">₹</span>{relPrice.toLocaleString('en-IN')}</span>
                      </div>
                      <Link
                        to={`/mattresses/${rel.slug}`}
                        className="mt-2 bg-[#F8F5EF] border border-[#E0D8CE]/60 text-[#8B6844] font-bold text-[9px] uppercase tracking-wider py-1.5 rounded text-center block w-full hover:bg-[#8B6844] hover:text-white transition-colors"
                      >
                        View
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ==========================================
           ORIGINAL DESKTOP VIEW (UNTOUCHED)
           ========================================== */
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 pt-4 pb-12">
          <div className="hidden md:block mb-4 border-b border-[#E0D8CE]/30 pb-2 text-xs">
            <span className="text-xs text-[#6D6258]">
              <Link to="/" className="hover:text-[#201712] transition-colors">Home</Link> &nbsp;&gt;&nbsp;{' '}
              <Link to="/mattresses" className="hover:text-[#201712] transition-colors">Mattresses</Link> &nbsp;&gt;&nbsp;{' '}
              <span className="text-[#201712] font-bold">{product.name}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10 items-start">
            {/* Left Column: Image Gallery */}
            <div className="lg:col-span-6">
              <ProductGallery 
                images={imagesList} 
                productName={product.name} 
                labels={standardMattressLabels} 
              />
            </div>

            {/* Right Column: Descriptions & CTAs */}
            <div className="lg:col-span-6 flex flex-col justify-start">
              <div className="mb-3">
                <span className="inline-block bg-[#8B6844] text-[#FFFDFC] font-bold text-[10px] uppercase tracking-[1.5px] py-1 px-3.5 rounded-sm shadow-xs">
                  FACTORY DIRECT
                </span>
              </div>

              <h1 className="text-3xl md:text-3.5xl font-serif font-bold text-[#201712] mb-2 leading-tight">{product.name}</h1>
              
              <p className="text-[13px] text-[#6D6258] leading-relaxed mb-5">{product.description}</p>

              {/* USP Grid Section */}
              <div className="grid grid-cols-2 gap-4 mb-6 bg-white/40 p-3 rounded-xl border border-[#E0D8CE]/40 max-w-sm">
                <div className="flex flex-col items-center justify-center p-3 text-center bg-white/80 rounded-lg border border-[#E0D8CE]/30 shadow-xs">
                  <span className="text-xl mb-1">📐</span>
                  <span className="text-[10px] font-bold text-[#201712]">Custom Sizes</span>
                  <span className="text-[9px] text-[#6D6258] leading-none mt-0.5 font-medium">Available</span>
                </div>
                <div className="flex flex-col items-center justify-center p-3 text-center bg-white/80 rounded-lg border border-[#E0D8CE]/30 shadow-xs">
                  <span className="text-xl mb-1">🛡️</span>
                  <span className="text-[10px] font-bold text-[#201712]">10 Years</span>
                  <span className="text-[9px] text-[#6D6258] leading-none mt-0.5 font-medium">Warranty</span>
                </div>
              </div>

              {/* Pricing Details */}
              <div className="border-t border-[#E0D8CE]/40 pt-3.5 mb-5">
                <span className="text-[10px] text-[#6D6258] uppercase tracking-wider font-semibold block mb-0.5">Starting from</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold font-serif text-[#201712]">
                    ₹{product.basePrice?.toLocaleString('en-IN')}
                  </span>
                  <span className="text-lg text-[#6D6258]/70 line-through">
                    ₹{Math.round(product.basePrice * (product.retailMultiplier && product.retailMultiplier > 1.0 ? product.retailMultiplier : 1.9)).toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-bold bg-[#8B6844]/10 text-[#8B6844] px-2 py-0.5 rounded-md border border-[#8B6844]/20">
                    Save {Math.round((((product.retailMultiplier && product.retailMultiplier > 1.0 ? product.retailMultiplier : 1.9) - 1.0) / (product.retailMultiplier && product.retailMultiplier > 1.0 ? product.retailMultiplier : 1.9)) * 100)}%
                  </span>
                </div>
              </div>

              {/* Action Call to Buttons */}
              <div className="grid grid-cols-2 gap-4 max-w-md">
                <button
                  onClick={() => {
                    const element = document.getElementById('visualizer-target');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-[#8B6844] hover:bg-[#725435] text-white font-bold text-xs uppercase tracking-[1px] rounded-lg shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer border border-transparent active:scale-[0.98] focus:outline-none h-[46px] w-full"
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ width: '18px', height: '18px' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="whitespace-nowrap">Request Quote</span>
                </button>
                <a
                  href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hello! I'm interested in the ${product.name} starting from ₹${product.basePrice?.toLocaleString('en-IN')}. Please provide details.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white hover:bg-[#F4F1EC] text-[#201712] font-bold text-xs uppercase tracking-[1px] rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all border border-[#201712]/80 active:scale-[0.98] focus:outline-none h-[46px] w-full"
                >
                  <svg className="w-5 h-5 fill-[#25D366] flex-shrink-0" viewBox="0 0 24 24" style={{ width: '18px', height: '18px' }}>
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.852.002-2.631-1.019-5.105-2.875-6.964-1.857-1.859-4.335-2.88-6.97-2.881-5.437 0-9.863 4.421-9.867 9.853-.001 1.73.457 3.419 1.323 4.913l-.973 3.555 3.648-.957z"/>
                  </svg>
                  <span className="whitespace-nowrap">Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Specifications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-[#FFFDFC] border border-[#E0D8CE]/60 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-[#201712] uppercase tracking-[1.5px] mb-5 pb-2 border-b border-[#E0D8CE]/40">
                  Product Specifications
                </h3>
                <div className="flex flex-col gap-3">
                  {Object.entries(product.specifications || {}).map(([key, val], idx) => {
                    let icon = '⚙️';
                    const lowerKey = key.toLowerCase();
                    if (lowerKey.includes('frame') || lowerKey.includes('wood')) icon = '🪵';
                    else if (lowerKey.includes('foam') || lowerKey.includes('density') || lowerKey.includes('grade')) icon = '🧽';
                    else if (lowerKey.includes('warranty')) icon = '🛡️';
                    else if (lowerKey.includes('suspension')) icon = '🕸️';
                    else if (lowerKey.includes('comfort')) icon = '☁️';
                    else if (lowerKey.includes('material')) icon = '🧵';

                    return (
                      <div key={idx} className="flex items-center justify-between py-2 border-b border-[#E0D8CE]/30 last:border-b-0">
                        <div className="flex items-center gap-3">
                          <span className="text-base w-6 h-6 flex items-center justify-center bg-[#F4F1EC] rounded-full">{icon}</span>
                          <span className="text-xs font-bold text-[#6D6258]">{key}</span>
                        </div>
                        <span className="text-xs font-semibold text-[#201712] text-right">{val}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {product.benefits && product.benefits.length > 0 && (
              <div className="bg-[#FFFDFC] border border-[#E0D8CE]/60 p-6 rounded-2xl shadow-sm flex flex-col">
                <h3 className="text-xs font-bold text-[#201712] uppercase tracking-[1.5px] mb-5 pb-2 border-b border-[#E0D8CE]/40">
                  Key Design Benefits
                </h3>
                <ul className="flex flex-col gap-3.5 flex-grow justify-center">
                  {product.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-[#8B6844]/10 text-[#8B6844] flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">✓</span>
                      <span className="text-xs font-medium text-[#6D6258] leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Configurator Anchor */}
          <section className="border-t border-[#E0D8CE]/60 pt-10" id="visualizer-target">
            <div className="text-center max-w-[600px] mx-auto mb-10">
              <span className="text-xs font-bold text-[#8B6844] uppercase tracking-[2px] mb-2.5 inline-block">Customize Your Mattress</span>
              <h2 className="text-3xl font-serif font-bold text-[#201712] mb-4">Create a Mattress that Fits Your Bed Perfectly</h2>
              <p className="text-[13px] text-[#6D6258] leading-relaxed">
                Choose your preferred specifications and see your mattress come to life.
              </p>
            </div>

            {config && (
              <MattressConfigurator 
                config={config} 
                defaultCore={product.mattressCoreType} 
              />
            )}
          </section>
        </div>
      )}

      {/* MOBILE STICKY BOTTOM BAR (Always visible while bottom sheet is closed) */}
      {isMobile && !isBottomSheetOpen && (
        <div 
          className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E0D8CE]/60 flex items-center justify-between px-5 shadow-2xl"
          style={{ 
            height: 'calc(70px + env(safe-area-inset-bottom))', 
            paddingBottom: 'env(safe-area-inset-bottom)' 
          }}
        >
          <div className="flex flex-col justify-center text-left">
            <span className="text-[9px] text-[#6D6258] uppercase font-bold tracking-wider mb-0.5">Quote Price</span>
            <span className="text-xl font-bold font-serif text-[#8B6844]">
              <span className="font-sans mr-0.5">₹</span>{customPrice.toLocaleString('en-IN')}
            </span>
          </div>
          
          <button
            onClick={handleMobileInquiry}
            className="bg-[#1eab53] hover:bg-[#15803d] text-white font-bold text-xs uppercase tracking-wider px-5 rounded-xl h-[46px] flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer font-sans"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.852.002-2.631-1.019-5.105-2.875-6.964-1.857-1.859-4.335-2.88-6.97-2.881-5.437 0-9.863 4.421-9.867 9.853-.001 1.73.457 3.419 1.323 4.913l-.973 3.555 3.648-.957z"/>
            </svg>
            <span>Inquire Now</span>
          </button>
        </div>
      )}

      {/* MOBILE BOTTOM SHEET FOR CUSTOMIZATION */}
      {isMobile && isBottomSheetOpen && (
        <div className="fixed inset-0 z-[3000] flex items-end justify-center select-none font-sans text-left">
          {/* Backdrop dimming */}
          <div 
            onClick={() => setIsBottomSheetOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
          />

          {/* Bottom Sheet Container (92% of the screen height) */}
          <div 
            className="w-full bg-[#FAF8F5] rounded-t-[20px] shadow-2xl relative z-[3001] flex flex-col overflow-hidden border-t border-x border-[#E8E0D7] h-[92vh]"
            style={{ 
              transform: `translateY(${dragOffset}px)`,
              transition: activeDrag.current ? 'none' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* Drag Handle Bar */}
            <div 
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="w-full flex flex-col items-center py-3 bg-[#FAF8F5] border-b border-[#E8E0D7] cursor-grab active:cursor-grabbing flex-shrink-0 select-none"
            >
              <div className="w-12 h-1 bg-[#E8E0D7] rounded-full mb-1"></div>
            </div>

            {/* Bottom Sheet Header */}
            <div className="px-6 py-4 border-b border-[#E8E0D7] flex justify-between items-center bg-[#FAF8F5] flex-shrink-0">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#201712] tracking-wide">Customize Your Mattress</h3>
                <p className="text-[11px] text-[#6D6258] mt-0.5">Build your perfect sleep experience.</p>
              </div>
              <button 
                onClick={() => setIsBottomSheetOpen(false)}
                className="text-[#8B6A45] hover:text-[#6D5134] font-sans font-light text-2.5xl p-2 select-none active:scale-90 transition-transform cursor-pointer"
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            {/* PROGRESS INDICATOR */}
            <div className="px-6 py-3.5 bg-[#FAF8F5] border-b border-[#E8E0D7] select-none flex flex-col gap-2 flex-shrink-0">
              <div className="flex items-center justify-between relative px-2">
                {/* Connecting Lines */}
                <div className="absolute left-6 right-6 top-[7px] h-[2px] bg-[#E8E0D7] -z-10">
                  <div 
                    className="h-full bg-[#8B6A45] transition-all duration-300"
                    style={{ width: `${((activeStep - 1) / 5) * 100}%` }}
                  />
                </div>
                
                {steps.map((st) => {
                  const isCompleted = st.id <= activeStep;
                  return (
                    <button
                      key={st.id}
                      onClick={() => scrollToSection(st.ref, st.id)}
                      className="flex flex-col items-center gap-1 focus:outline-none group cursor-pointer"
                    >
                      <div 
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isCompleted 
                            ? 'bg-[#8B6A45] scale-110 shadow-xs' 
                            : 'bg-white border-2 border-[#E8E0D7]'
                        }`}
                      >
                        {isCompleted && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between text-[8.5px] font-sans font-bold tracking-wider uppercase text-stone-400 px-1">
                {steps.map((st) => {
                  const isActive = st.id === activeStep;
                  return (
                    <span 
                      key={st.id} 
                      className={`w-[60px] text-center transition-colors duration-200 ${isActive ? 'text-[#8B6A45]' : 'text-[#6D6258]/60'}`}
                    >
                      {st.label}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Scrollable Configuration Content Area */}
            <div 
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex-grow overflow-y-auto p-6 space-y-8 bg-[#FAF8F5] scroll-smooth"
            >
              
              {/* SECTION 1 — SIZE */}
              <div ref={sizeRef} className="flex flex-col gap-3 scroll-mt-4">
                <span className="text-[11px] font-bold text-[#8B6A45] uppercase tracking-wider">1. Choose Size</span>
                <div className="grid grid-cols-2 gap-3">
                  {MATTRESS_SIZES.map((s) => {
                    const isSelected = customSize === s.name;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setCustomSize(s.name)}
                        className={`py-3 px-4 rounded-[18px] border text-center font-bold text-xs uppercase tracking-wider transition-all duration-200 active:scale-[0.98] ${
                          isSelected 
                            ? 'bg-[#8B6A45] text-white border-[#8B6A45] shadow-md' 
                            : 'bg-white text-[#8B6A45] border-[#8B6A45]/30'
                        }`}
                      >
                        {s.name.split(' Size')[0]}
                      </button>
                    );
                  })}
                </div>
                <p className="text-stone-500 font-semibold text-xs leading-none mt-1">
                  Selected Size: <span className="text-[#201712] font-bold">{customSize.split(' Size')[0]}</span>
                </p>
              </div>

              {/* SECTION 2 — COMFORT */}
              <div ref={comfortRef} className="flex flex-col gap-3 scroll-mt-4">
                <span className="text-[11px] font-bold text-[#8B6A45] uppercase tracking-wider">2. Choose Comfort</span>
                <div className="grid grid-cols-3 gap-2.5">
                  {MATTRESS_COMFORTS.map((c) => {
                    const isSelected = customComfort === c.name;
                    const comfortLabel = c.id === 'ortho' ? 'Medium Firm' : c.id === 'dual' ? 'Dual Comfort' : 'Plush Latex';
                    return (
                      <button
                        key={c.id}
                        onClick={() => setCustomComfort(c.name)}
                        className={`py-3 px-2 rounded-[18px] border text-center font-bold text-[10px] uppercase tracking-wider transition-all duration-200 active:scale-[0.98] ${
                          isSelected 
                            ? 'bg-[#8B6A45] text-white border-[#8B6A45] shadow-md' 
                            : 'bg-white text-[#8B6A45] border-[#8B6A45]/30'
                        }`}
                      >
                        {comfortLabel}
                      </button>
                    );
                  })}
                </div>
                {/* Comfort description */}
                <p className="text-stone-500 font-semibold text-xs leading-normal mt-1">
                  {customComfort === 'Medium Firm Orthopaedic' && "Balanced comfort for everyday use."}
                  {customComfort === 'Dual Comfort (Dual Sided)' && "Medium-soft on one side, firm on the other."}
                  {customComfort === 'Plush Natural Latex' && "Bouncy organic latex comfort layers."}
                </p>
              </div>

              {/* SECTION 3 — THICKNESS */}
              <div ref={thicknessRef} className="flex flex-col gap-3 scroll-mt-4">
                <span className="text-[11px] font-bold text-[#8B6A45] uppercase tracking-wider">3. Choose Thickness</span>
                <div className="grid grid-cols-6 gap-2">
                  {MATTRESS_THICKNESSES.map((t) => {
                    const isSelected = customThickness === t.name;
                    const inchLabel = t.name.split(' Inch')[0] + '"';
                    return (
                      <button
                        key={t.id}
                        onClick={() => setCustomThickness(t.name)}
                        className={`py-3.5 px-1 rounded-[18px] border text-center font-bold text-xs transition-all duration-200 active:scale-[0.98] ${
                          isSelected 
                            ? 'bg-[#8B6A45] text-white border-[#8B6A45] shadow-md transform -translate-y-0.5' 
                            : 'bg-white text-[#8B6A45] border-[#8B6A45]/30'
                        }`}
                      >
                        {inchLabel}
                      </button>
                    );
                  })}
                </div>
                <p className="text-stone-500 font-semibold text-xs leading-none mt-1">
                  Selected Thickness: <span className="text-[#201712] font-bold">{customThickness.split(' Thickness')[0]}</span>
                </p>
              </div>

              {/* SECTION 4 — FABRIC */}
              <div ref={fabricRef} className="flex flex-col gap-3 scroll-mt-4">
                <span className="text-[11px] font-bold text-[#8B6A45] uppercase tracking-wider">4. Choose Cover Fabric</span>
                <div className="grid grid-cols-2 gap-3">
                  {MATTRESS_COVERS.slice(0, 2).map((cov) => {
                    const isSelected = customCover === cov.name;
                    const coverLabel = cov.id === 'standard' ? 'Quilted GSM Cover' : 'Organic Knitted Cotton';
                    return (
                      <button
                        key={cov.id}
                        onClick={() => setCustomCover(cov.name)}
                        className={`py-3 px-3 rounded-[18px] border text-center font-bold text-[10.5px] uppercase tracking-wider transition-all duration-200 active:scale-[0.98] ${
                          isSelected 
                            ? 'bg-[#8B6A45] text-white border-[#8B6A45] shadow-md' 
                            : 'bg-white text-[#8B6A45] border-[#8B6A45]/30'
                        }`}
                      >
                        {coverLabel}
                      </button>
                    );
                  })}
                </div>
                <p className="text-stone-500 font-semibold text-xs leading-normal mt-1">
                  {customCover === 'Quilted GSM Breathing Cover' && "Soft breathable premium quilted fabric."}
                  {customCover === 'Organic Knitted Cotton Cover' && "100% organic cotton weave for cool sleep touch."}
                  {customCover === 'Luxury Cashmere Weave Cover' && "Hand-selected premium wool touch comfort finish."}
                </p>
              </div>

              {/* SECTION 5 — MATTRESS LAYER COMPOSITION */}
              <div ref={layersRef} className="flex flex-col gap-3 scroll-mt-4">
                <span className="text-[11px] font-bold text-[#8B6A45] uppercase tracking-wider">5. Mattress Layer Composition</span>
                <div className="flex flex-col gap-3">
                  {getLayerComposition(customComfort, customThickness).map((layer, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center gap-4 bg-[#F3EEE7] border border-[#E8E0D7] p-3.5 rounded-[18px] shadow-sm"
                    >
                      <div className="w-10 h-10 bg-white border border-[#E8E0D7] rounded-full flex items-center justify-center flex-shrink-0 shadow-xs">
                        <span className="text-xs font-bold text-[#8B6A45]">{layer.height}</span>
                      </div>
                      <div className="flex-grow min-w-0">
                        <h5 className="text-[12px] font-bold text-[#201712] truncate">{layer.name}</h5>
                        <p className="text-[10px] text-[#6D6258] mt-0.5 leading-normal">{layer.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[10.5px] text-[#8B6A45] font-semibold flex items-center gap-1.5 mt-1">
                  <span>✓</span>
                  <span>Layer composition automatically updates based on your selected configuration.</span>
                </p>
              </div>

              {/* SECTION 6 — LIVE PREVIEW */}
              <div className="flex flex-col gap-3 scroll-mt-4">
                <span className="text-[11px] font-bold text-[#8B6A45] uppercase tracking-wider">6. Live Preview</span>
                <div className="h-[130px] flex flex-row items-center justify-between gap-6 bg-[#F3EEE7] border border-[#E8E0D7] p-4 rounded-[18px] shadow-sm overflow-hidden">
                  {/* Left Mattress SVG Rendering */}
                  <div className="w-[110px] flex items-center justify-center flex-shrink-0">
                    {renderMattressSVG(customComfort, customThickness, customCover)}
                  </div>
                  {/* Right side config text details */}
                  <div className="flex-grow flex flex-col gap-1.5 text-left select-none text-[11.5px] font-bold text-[#201712]">
                    <span className="block">{customSize.split(' Size')[0]} Size</span>
                    <span className="block text-stone-500 font-semibold">{customComfort.split(' (')[0]}</span>
                    <span className="block text-[#8B6A45]">{customThickness.split(' Thickness')[0]} Stack</span>
                    <span className="block text-[10px] text-stone-400 font-normal truncate max-w-[150px]">{customCover.split(' Cover')[0]}</span>
                  </div>
                </div>
              </div>

              {/* SECTION 7 — CONFIGURATION SUMMARY */}
              <div ref={summaryRef} className="flex flex-col gap-3 scroll-mt-4">
                <span className="text-[11px] font-bold text-[#8B6A45] uppercase tracking-wider">7. Your Configuration</span>
                <div className="grid grid-cols-2 gap-3 bg-[#F3EEE7] border border-[#E8E0D7] p-4 rounded-[18px] shadow-sm">
                  {[
                    { label: 'Bed Size', val: customSize.split(' (')[0], icon: '📐', targetRef: sizeRef, step: 1 },
                    { label: 'Comfort Core', val: customComfort.split(' (')[0].replace('Medium Firm ', ''), icon: '☁️', targetRef: comfortRef, step: 2 },
                    { label: 'Thickness', val: customThickness.split(' Thickness')[0], icon: '📏', targetRef: thicknessRef, step: 3 },
                    { label: 'Fabric Cover', val: customCover.split(' Cover')[0].replace(' Breathing', ''), icon: '✨', targetRef: fabricRef, step: 4 }
                  ].map((cfg, idx) => (
                    <button 
                      key={idx}
                      onClick={() => scrollToSection(cfg.targetRef, cfg.step)}
                      className="flex items-center gap-2.5 p-2 bg-white rounded-xl border border-[#E8E0D7] text-left transition-all active:scale-95 cursor-pointer"
                    >
                      <span className="text-base flex-shrink-0">{cfg.icon}</span>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[8.5px] text-stone-400 font-bold uppercase tracking-wider leading-none">{cfg.label}</span>
                        <span className="text-[11px] font-bold text-[#201712] truncate mt-0.5">{cfg.val}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* SECTION 8 — ESTIMATED PRICE */}
              <div className="flex flex-col gap-2.5 border-t border-[#E8E0D7] pt-6 pb-4">
                <span className="text-[11.5px] uppercase font-bold tracking-wider text-[#8B6A45] leading-none">Estimated Price</span>
                <div className="flex flex-col justify-start">
                  <span className="text-4xl font-serif font-extrabold text-[#201712] leading-none">
                    <span className="font-sans mr-0.5">₹</span>{customPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] font-medium text-stone-400 mt-2 leading-none">
                    Price updates automatically based on customization.
                  </span>
                </div>
              </div>

            </div>

            {/* STICKY BOTTOM BAR */}
            <div 
              className="p-4 border-t border-[#E8E0D7] bg-[#FAF8F5] flex items-center justify-between gap-4 flex-shrink-0 shadow-lg"
              style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
            >
              <div className="flex flex-col justify-center text-left">
                <span className="text-[9px] text-stone-400 uppercase font-bold tracking-wider mb-0.5">Estimated Price</span>
                <span className="text-xl font-bold font-serif text-[#8B6A45]">
                  <span className="font-sans mr-0.5">₹</span>{customPrice.toLocaleString('en-IN')}
                </span>
              </div>
              
              <button
                onClick={() => {
                  setIsBottomSheetOpen(false);
                  handleMobileInquiry();
                }}
                className="bg-[#8B6A45] hover:bg-[#725435] text-white font-bold text-xs uppercase tracking-wider px-5 rounded-[18px] h-[50px] flex items-center justify-center gap-2 shadow-md transition-all duration-200 active:scale-95 cursor-pointer flex-shrink-0 whitespace-nowrap"
              >
                <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.852.002-2.631-1.019-5.105-2.875-6.964-1.857-1.859-4.335-2.88-6.97-2.881-5.437 0-9.863 4.421-9.867 9.853-.001 1.73.457 3.419 1.323 4.913l-.973 3.555 3.648-.957z"/>
                </svg>
                <span>Add to Inquiry</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default MattressDetail;
