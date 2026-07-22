import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import SofaConfigurator from '../components/SofaConfigurator';
import MetaTags from '../components/MetaTags';
import ProductGallery from '../components/ProductGallery';

const SOFA_TYPES = [
  { id: '2-seater', name: '2 Seater', capacity: 2, multiplier: 0.85 },
  { id: '3-seater', name: '3 Seater', capacity: 3, multiplier: 1.0 },
  { id: 'corner', name: 'Corner Sofa', capacity: 5, multiplier: 1.45 },
  { id: 'recliner', name: 'Recliner Sofa', capacity: 1, multiplier: 1.35 }
];

const FABRIC_QUALITIES = [
  { id: 'standard', name: 'Standard Fabric', modifier: 2500, colors: [
    { name: 'Pebble Beige', hex: '#DCCEB0' },
    { name: 'Sage Green', hex: '#7D937B' },
    { name: 'Mocha Brown', hex: '#5C4033' },
    { name: 'Concrete Grey', hex: '#8A8A8A' }
  ]},
  { id: 'premium', name: 'Premium Fabric', modifier: 6000, colors: [
    { name: 'Royal Beige', hex: '#E3D1B4' },
    { name: 'Ash Grey', hex: '#A8A8A8' },
    { name: 'Olive Green', hex: '#556B2F' },
    { name: 'Navy Blue', hex: '#0F1E36' }
  ]},
  { id: 'luxury', name: 'Luxury Velvet', modifier: 12000, colors: [
    { name: 'Oyster White', hex: '#FDFDFD' },
    { name: 'Charcoal Tweed', hex: '#3A3F44' },
    { name: 'Emerald Velvet', hex: '#097969' },
    { name: 'Midnight Indigo', hex: '#10172A' }
  ]}
];

const SOFA_COMFORTS = [
  { id: 'soft', name: 'Plush Cloud Feather (Soft)', modifier: 4500, desc: 'Ultra-plush goose feather blend cushioning' },
  { id: 'medium', name: 'Orthopaedic Ergo-Support (Medium)', modifier: 0, desc: 'Balanced support with high resiliency foam' },
  { id: 'firm', name: 'High-Density Premium Core (Firm)', modifier: 2000, desc: 'Rigid base support for posture alignment' }
];

const getSofaComfortModifier = (comfort) => {
  if (!comfort) return 0;
  if (comfort.includes('Plush')) return 4500;
  if (comfort.includes('High-Density')) return 2000;
  return 0;
};

const getMultiplier = (type) => {
  if (type === 'Recliner Sofa' || type === 'recliner') return 1.35;
  if (type === '2 Seater' || type === '2-seater') return 0.85;
  if (type === '3 Seater' || type === '3-seater') return 1.0;
  if (type === 'Corner Sofa' || type === 'corner' || type === 'l-shape') return 1.45;
  return 1.6;
};

const getFabricModifier = (quality) => {
  if (quality === 'standard') return 2500;
  if (quality === 'premium') return 6000;
  if (quality === 'luxury') return 12000;
  return 0;
};

const renderSofaSVG = (colorHex, capacity) => {
  const cap = parseInt(capacity) || 3;
  const W = 188 / cap;
  const cushions = [];
  const highlights = [];
  const shadows = [];
  const seams = [];
  
  for (let i = 0; i < cap; i++) {
    const x = 46 + i * W;
    const cWidth = W - 1.5;
    
    cushions.push(
      <rect key={`c-${i}`} x={x} y="86" width={cWidth} height="20" rx="4" fill={colorHex} />
    );
    highlights.push(
      <rect key={`h-${i}`} x={x} y="86" width={cWidth} height="4" rx="2" fill="rgba(255,255,255,0.12)" />
    );
    shadows.push(
      <rect key={`s-${i}`} x={x} y="102" width={cWidth} height="4" rx="2" fill="rgba(0,0,0,0.15)" />
    );
    
    if (i > 0) {
      seams.push(
        <line key={`seam-${i}`} x1={x} y1="46" x2={x} y2="102" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
      );
    }
  }

  return (
    <svg viewBox="0 0 280 150" className="w-full h-auto max-w-[200px] mx-auto drop-shadow-[0_8px_20px_rgba(0,0,0,0.25)] select-none overflow-visible">
      <ellipse cx="140" cy="128" rx="100" ry="12" fill="rgba(0,0,0,0.3)" />
      <polygon points="45,120 52,135 60,135 55,120" fill="#4A3326" />
      <polygon points="225,120 228,135 220,135 215,120" fill="#4A3326" />
      <polygon points="65,120 68,130 73,130 71,120" fill="#3D291E" opacity="0.7" />
      <polygon points="205,120 207,130 212,130 210,120" fill="#3D291E" opacity="0.7" />
      <rect x="42" y="112" width="196" height="8" rx="2" fill="#5C4033" stroke="#4A3326" strokeWidth="0.5"/>
      <rect x="42" y="104" width="196" height="8" fill={colorHex} />
      <rect x="48" y="44" width="184" height="60" rx="8" fill={colorHex} />
      {seams}
      <rect x="48" y="44" width="184" height="8" rx="4" fill="rgba(255,255,255,0.08)" />
      <rect x="48" y="96" width="184" height="8" rx="4" fill="rgba(0,0,0,0.15)" />
      {cushions}
      {highlights}
      {shadows}
      <path d="M36,68 C36,60 48,60 48,68 L48,114 C48,118 36,118 36,114 Z" fill={colorHex} stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
      <path d="M38,70 C38,64 46,64 46,70 L46,112 C46,115 38,115 38,112 Z" fill="rgba(255,255,255,0.06)" />
      <path d="M232,68 C232,60 244,60 244,68 L244,114 C244,118 232,118 232,114 Z" fill={colorHex} stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
      <path d="M234,70 C234,64 242,64 242,70 L242,112 C242,115 234,115 234,112 Z" fill="rgba(255,255,255,0.06)" />
      <path d="M48,50 L232,50" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" fill="none"/>
      <path d="M38,68 L46,68" stroke="rgba(255,255,255,0.25)" strokeWidth="1" fill="none"/>
      <path d="M234,68 L242,68" stroke="rgba(255,255,255,0.25)" strokeWidth="1" fill="none"/>
    </svg>
  );
};

const SofaDetail = () => {
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

  // Lock body scroll when mobile customizer bottom sheet is open
  useEffect(() => {
    if (isBottomSheetOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isBottomSheetOpen]);
  
  // Custom configured parameters
  const [customType, setSelectedType] = useState('3 Seater');
  const [selectedCapacity, setSelectedCapacity] = useState(3);
  const [customComfort, setCustomComfort] = useState('Orthopaedic Ergo-Support (Medium)');
  const [customQuality, setSelectedQuality] = useState('standard');
  const [customFabric, setSelectedFabric] = useState(FABRIC_QUALITIES[0].colors[0]);
  const [customColorName, setCustomColorName] = useState(FABRIC_QUALITIES[0].colors[0].name);
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
          setActiveImage(prodRes.data.product.images?.[0] || '/images/factory_floor.png');
          
          // Set initial defaults
          const typeName = prodRes.data.product.sofaCategory === '2-seater' ? '2 Seater' : 
                           prodRes.data.product.sofaCategory === 'corner' ? 'Corner Sofa' : 
                           prodRes.data.product.sofaCategory === 'recliner' ? 'Recliner Sofa' : '3 Seater';
          const cap = prodRes.data.product.sofaCategory === '2-seater' ? 2 : 
                      prodRes.data.product.sofaCategory === 'corner' ? 5 : 3;
          setSelectedType(typeName);
          setSelectedCapacity(cap);
        } else {
          setError('Product details not found.');
        }

        const configRes = await API.get('/configs/sofa');
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

  // Fetch related products
  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await API.get('/products');
        if (res.data?.products) {
          setRelatedProducts(res.data.products.filter(p => p.slug !== slug && p.category === 'sofa').slice(0, 5));
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
      const basePrice = product.basePrice || 16500;
      const typeMultiplier = getMultiplier(customType);
      const fabricModifier = getFabricModifier(customQuality);
      const comfortModifier = getSofaComfortModifier(customComfort);
      setCustomPrice(Math.round((basePrice * typeMultiplier) + fabricModifier + comfortModifier));
    }
  }, [customType, customQuality, customComfort, product]);

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
        <Link to="/sofas" className="bg-primary text-white py-2 px-6 rounded-sm hover:bg-primary-light transition-colors">
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

  const standardSofaLabels = [
    'Front View',
    'Side View',
    'Back Profile',
    'Recliner / Open Position',
    'Fabric Close-up',
    'Lifestyle Room Setting'
  ];

  const defaultSofaGallery = [
    product.images?.[0] || '/images/sofa_royal_sectional.png',
    '/images/sofa_modular_corner.png',
    '/images/sofa_chesterfield_velvet.png',
    '/images/sofa_classic_3seater.png',
    '/images/sofa_theater_recliner.png',
    '/images/workers_crafting.png'
  ];

  const imagesList = product.images && product.images.length > 1 
    ? product.images 
    : defaultSofaGallery;

  const getSofaCategoryLabel = (category) => {
    if (category === 'l-shape') return 'L-Shape';
    if (category === 'recliner') return 'Recliner';
    if (category === '2-seater') return '2 Seater';
    if (category === '3-seater') return '3 Seater';
    if (category === 'corner') return 'Corner';
    return 'Custom';
  };

  // Submit Inquiry Lead Form logger
  const handleGetQuoteMobile = () => {
    navigate('/contact', {
      state: {
        productName: product.name,
        category: 'sofa',
        configuration: {
          sofaType: customType,
          seatingCapacity: `${selectedCapacity} Seater`,
          fabricName: customFabric.name,
          fabricQuality: customQuality,
          comfort: customComfort
        },
        price: customPrice
      }
    });
  };

  const handleMobileInquiry = async () => {
    try {
      const leadData = {
        name: 'Mobile Customer Inquiry',
        phone: 'Unspecified',
        email: 'mobile_inquiry@sleepora.com',
        productName: product.name,
        category: 'sofa',
        configuration: {
          sofaType: customType,
          seatingCapacity: `${selectedCapacity} Seater`,
          fabricName: customFabric.name,
          fabricQuality: customQuality,
          comfort: customComfort,
          dimensions: 'Custom Layout sizing'
        },
        finalPrice: customPrice
      };
      await API.post('/leads', leadData);
    } catch (err) {
      console.error(err);
    }

    const whatsappNumber = '919876543210';
    const msg = `Hello! I would like to enquire about the ${product.name}. Here is my custom configuration details:
- *Layout*: ${customType}
- *Comfort*: ${customComfort}
- *Fabric Grade*: ${customQuality.toUpperCase()}
- *Fabric Color*: ${customColorName}
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
              <Link to="/sofas" className="text-xs font-bold text-[#8B6844] flex items-center gap-1">
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
                  <span className="font-sans mr-0.5">₹</span>{Math.round(customPrice * 1.8).toLocaleString('en-IN')}
                </span>
              </div>
              <span className="text-[9.5px] font-bold bg-[#8B6844]/15 text-[#8B6844] px-2 py-0.5 rounded border border-[#8B6844]/20 self-center ml-auto">
                Save 45%
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
              { icon: '🛡️', text: '5 Yr Warranty' },
              { icon: '🧵', text: 'Premium Materials' }
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
                title: 'Materials & Craftsmanship',
                content: (
                  <p className="text-xs text-[#6D6258] leading-relaxed">
                    Crafted using hand-selected Sal Wood for premium frame durability. Premium comfort layers include 40 Density high-resilience comfort foam and independent pocket spring suspensions. Fully upholstered in anti-scratch linen/cotton blend or rich imported Belgian velvet.
                  </p>
                )
              },
              {
                id: 'warranty',
                title: 'Warranty & Guarantee',
                content: (
                  <p className="text-xs text-[#6D6258] leading-relaxed">
                    TimeWell stands behind its build quality with a 5-Year Structural Warranty covering sagging, joint failures, and internal frame deformation. Fabric wear is covered under standard manufacturing terms.
                  </p>
                )
              },
              {
                id: 'delivery',
                title: 'Delivery & Assembly',
                content: (
                  <p className="text-xs text-[#6D6258] leading-relaxed">
                    Free doorstep delivery to all metro areas. Each sofa is packaged in heavy-duty wooden crates and dispatched directly from the factory floor within 4 to 7 business days. Minimal leg assembly required.
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
                { name: 'Ananya R.', rating: '★★★★★', date: 'Yesterday', text: 'Extremely comfortable and premium. The customization process was seamless, and the quality matches high-end international brands.' },
                { name: 'Vikram S.', rating: '★★★★★', date: '3 days ago', text: 'Best purchase ever. Solid frame, thick foam, and fabric feels luxurious. Factory-direct price saved me a lot!' },
                { name: 'Neha M.', rating: '★★★★★', date: '1 week ago', text: 'Amazing service and delivery. The team helped me choose the exact dimensions to fit my living room.' }
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
              onClick={() => alert("Showing all 128 reviews in a modal...")}
              className="w-full mt-3 bg-white hover:bg-stone-50 border border-[#E0D8CE] text-stone-600 font-bold text-[10.5px] uppercase tracking-wider py-2.5 rounded-lg text-center cursor-pointer shadow-3xs"
            >
              View All Reviews
            </button>
          </div>

          {/* Section 5: Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-5">
              <h3 className="font-serif font-bold text-sm text-[#201712] mb-3">People Also Viewed</h3>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x -mx-4 px-4">
                {relatedProducts.map((rel) => {
                  const relPrice = rel.basePrice || 16500;
                  const relImg = rel.images?.[0] || '/images/sofa_royal_sectional.png';
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
                        to={`/sofas/${rel.slug}`}
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
              <Link to="/sofas" className="hover:text-[#201712] transition-colors">Sofas</Link> &nbsp;&gt;&nbsp;{' '}
              <span className="text-[#201712] font-bold">{product.name}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10 items-start">
            {/* Left Column: Image Gallery */}
            <div className="lg:col-span-6">
              <ProductGallery 
                images={imagesList} 
                productName={product.name} 
                labels={standardSofaLabels} 
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
                  <span className="text-[10px] font-bold text-[#201712]">5 Years</span>
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
                    ₹{Math.round(product.basePrice * (product.retailMultiplier && product.retailMultiplier > 1.0 ? product.retailMultiplier : 1.8)).toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-bold bg-[#8B6844]/10 text-[#8B6844] px-2 py-0.5 rounded-md border border-[#8B6844]/20">
                    Save {Math.round((((product.retailMultiplier && product.retailMultiplier > 1.0 ? product.retailMultiplier : 1.8) - 1.0) / (product.retailMultiplier && product.retailMultiplier > 1.0 ? product.retailMultiplier : 1.8)) * 100)}%
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
              <span className="text-xs font-bold text-[#8B6844] uppercase tracking-[2px] mb-2 inline-block">Customize Your Sofa</span>
              <h2 className="text-3xl font-serif font-bold text-[#201712] mb-3">Create a Sofa that Fits Your Space Perfectly</h2>
              <p className="text-xs text-[#6D6258] leading-relaxed">
                Choose your preferred specifications and see your sofa come to life.
              </p>
            </div>

            {config && (
              <SofaConfigurator 
                config={config} 
                defaultProduct={product} 
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
        <div className="fixed inset-0 z-[3000] flex items-end justify-center font-sans text-left">
          {/* Backdrop dimming */}
          <div 
            onClick={() => setIsBottomSheetOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Bottom Sheet Container */}
          <div 
            className="w-full bg-white rounded-t-3xl shadow-2xl relative z-[3001] flex flex-col overflow-hidden"
            style={{ 
              height: '70vh',
              transform: `translateY(${dragOffset}px)`,
              transition: activeDrag.current ? 'none' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* Drag Handle Bar */}
            <div 
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="w-full flex flex-col items-center py-3 bg-stone-50 border-b border-stone-100 cursor-grab active:cursor-grabbing flex-shrink-0 select-none"
            >
              <div className="w-12 h-1.5 bg-stone-300 rounded-full mb-1"></div>
            </div>

            {/* Bottom Sheet Header */}
            <div className="px-5 py-2 border-b border-[#E0D8CE]/30 flex justify-between items-center bg-stone-50 flex-shrink-0">
              <div>
                <h3 className="font-serif font-bold text-sm text-[#201712]">Customize Your Sofa</h3>
                <p className="text-[9.5px] text-[#6D6258] font-semibold uppercase tracking-wider">Step-by-step layout & comfort configuration</p>
              </div>
              <button 
                onClick={() => setIsBottomSheetOpen(false)}
                className="text-stone-400 hover:text-stone-600 font-sans font-light text-2.5xl px-2"
              >
                &times;
              </button>
            </div>

            {/* Scrollable Configuration Content Area */}
            <div className="flex-grow overflow-y-auto overscroll-contain touch-pan-y p-5 space-y-6">
              
              {/* Step 1: Choose Size & Layout */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-[#8B6844] uppercase tracking-wider">Step 1: Choose Size & Layout</span>
                <div className="grid grid-cols-2 gap-2.5">
                  {SOFA_TYPES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setSelectedType(t.name);
                        setSelectedCapacity(t.capacity);
                      }}
                      className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                        customType === t.name 
                          ? 'border-[#8B6844] bg-[#8B6844]/5 font-bold' 
                          : 'border-[#E0D8CE]/40 bg-white hover:border-[#8B6844]/60'
                      }`}
                    >
                      <span className="text-xl">🛋️</span>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#201712]">{t.name}</span>
                        <span className="text-[9px] text-stone-500 font-medium">
                          {t.id === '2-seater' ? 'Compact Seating' :
                           t.id === '3-seater' ? 'Standard Seating' :
                           t.id === 'corner' ? 'L-Shape Lounge' : 'Theater Recliner'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Choose Comfort */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-[#8B6844] uppercase tracking-wider">Step 2: Choose Comfort</span>
                <div className="flex flex-col gap-2">
                  {SOFA_COMFORTS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCustomComfort(c.name)}
                      className={`p-3.5 rounded-xl border text-left flex justify-between items-center transition-all ${
                        customComfort === c.name 
                          ? 'border-[#8B6844] bg-[#8B6844]/5 font-bold' 
                          : 'border-[#E0D8CE]/40 bg-white hover:border-[#8B6844]/60'
                      }`}
                    >
                      <div className="flex flex-col gap-0.5 pr-2">
                        <span className="text-xs font-bold text-[#201712]">{c.name}</span>
                        <span className="text-[10px] text-stone-500 font-medium leading-tight">{c.desc}</span>
                      </div>
                      <span className="text-xs font-bold text-[#8B6844] whitespace-nowrap pl-2">
                        {c.modifier > 0 ? <><span className="font-sans mr-0.5">₹</span>{c.modifier.toLocaleString('en-IN')}</> : 'Included'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Choose Material */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-[#8B6844] uppercase tracking-wider">Step 3: Choose Material</span>
                <div className="grid grid-cols-3 gap-2">
                  {FABRIC_QUALITIES.map((q) => (
                    <button
                      key={q.id}
                      onClick={() => {
                        setSelectedQuality(q.id);
                        setSelectedFabric(q.colors[0]);
                        setCustomColorName(q.colors[0].name);
                      }}
                      className={`p-2.5 rounded-xl border text-center flex flex-col gap-1 transition-all ${
                        customQuality === q.id 
                          ? 'border-[#8B6844] bg-[#8B6844]/5 font-bold' 
                          : 'border-[#E0D8CE]/40 bg-white hover:border-[#8B6844]/60'
                      }`}
                    >
                      <span className="text-[11px] font-bold text-[#201712]">{q.name.split(' ')[0]}</span>
                      <span className="text-[9px] text-[#8B6844] font-bold">
                        +{q.modifier > 0 ? <><span className="font-sans mr-0.5">₹</span>{q.modifier.toLocaleString('en-IN')}</> : 'Base'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 4: Choose Fabric */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-[#8B6844] uppercase tracking-wider">Step 4: Choose Fabric</span>
                <div className="flex gap-4 items-center py-1">
                  {(FABRIC_QUALITIES.find(q => q.id === customQuality)?.colors || []).map((col) => (
                    <button
                      key={col.hex}
                      onClick={() => {
                        setSelectedFabric(col);
                        setCustomColorName(col.name);
                      }}
                      className={`w-10 h-10 rounded-full border-2 transition-transform relative flex items-center justify-center ${
                        customFabric?.hex === col.hex ? 'border-[#8B6844] scale-110' : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: col.hex }}
                      title={col.name}
                    >
                      {customFabric?.hex === col.hex && (
                        <span className="text-white text-xs drop-shadow font-bold">✓</span>
                      )}
                    </button>
                  ))}
                </div>
                <span className="text-[10px] text-stone-500 font-semibold">Active Color Selection: <span className="text-[#8B6844] font-bold">{customColorName}</span></span>
              </div>

              {/* Step 5: Live Preview */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-[#8B6844] uppercase tracking-wider">Step 5: Live Preview</span>
                <div className="py-4 flex items-center justify-center bg-stone-50 rounded-xl border border-[#E0D8CE]/20 shadow-3xs min-h-[140px]">
                  {renderSofaSVG(customFabric?.hex || '#DCCEB0', selectedCapacity)}
                </div>
              </div>

              {/* Step 6: Estimated Price */}
              <div className="flex flex-col gap-2 border-t border-[#E0D8CE]/30 pt-4">
                <span className="text-[10px] font-bold text-[#8B6844] uppercase tracking-wider">Step 6: Estimated Price</span>
                <div className="flex flex-col gap-1.5 bg-stone-50/50 p-3.5 rounded-xl border border-[#E0D8CE]/20 text-[11.5px]">
                  <div className="flex justify-between">
                    <span className="text-stone-500 font-semibold">Layout/Seating size:</span>
                    <span className="font-bold text-[#201712]">{customType} ({selectedCapacity} Seater)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500 font-semibold">Cushion comfort finish:</span>
                    <span className="font-bold text-[#201712]">{customComfort.split(' (')[0]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500 font-semibold">Upholstery cover material:</span>
                    <span className="font-bold text-[#201712]">{FABRIC_QUALITIES.find(q => q.id === customQuality)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500 font-semibold">Fabric color swatch:</span>
                    <span className="font-bold text-[#8B6844]">{customColorName}</span>
                  </div>
                  <div className="flex justify-between border-t border-dashed border-[#E0D8CE]/40 pt-2 text-xs font-bold mt-1">
                    <span className="text-stone-700">Estimated Total:</span>
                    <span className="text-[#8B6844] text-sm"><span className="font-sans mr-0.5">₹</span>{customPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Sheet Sticky Action Bar */}
            <div className="p-4 border-t border-[#E0D8CE]/30 bg-stone-50 flex items-center justify-between gap-4 flex-shrink-0">
              <div className="flex flex-col">
                <span className="text-[9px] text-[#6D6258] uppercase font-bold tracking-wider">Configured Price</span>
                <span className="text-xl font-bold font-serif text-[#8B6844]"><span className="font-sans mr-0.5">₹</span>{customPrice.toLocaleString('en-IN')}</span>
              </div>
              <button
                onClick={() => {
                  setIsBottomSheetOpen(false);
                  handleMobileInquiry();
                }}
                className="bg-[#8B6844] hover:bg-[#725435] text-white font-bold text-xs uppercase tracking-wider px-6 rounded-[16px] h-[48px] flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer flex-grow max-w-[200px]"
              >
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
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

export default SofaDetail;

