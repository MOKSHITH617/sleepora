import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import SofaConfigurator from '../components/SofaConfigurator';
import MetaTags from '../components/MetaTags';
import ProductGallery from '../components/ProductGallery';

const SofaDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    const fetchDetailData = async () => {
      try {
        setLoading(true);
        // 1. Fetch single product by slug
        const prodRes = await API.get(`/products/${slug}`);
        if (prodRes.data?.product) {
          setProduct(prodRes.data.product);
          setActiveImage(prodRes.data.product.images?.[0] || '/images/factory_floor.png');
        } else {
          setError('Product details not found.');
        }

        // 2. Fetch sofa configurator rules
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

  // Pre-generate Schema.org Product Structured Data
  const basePrice = product.basePrice;
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": activeImage.startsWith('http') ? activeImage : `${window.location.origin}${activeImage}`,
    "description": product.description,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": basePrice.toString(),
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

  return (
    <div className="w-full bg-[#F4F1EC] select-none product-detail-page">
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 767px) {
          header.fixed { display: none !important; }
          main { padding-top: 0 !important; }
          .product-detail-page { padding-top: 0 !important; }
        }
      `}} />
      
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 pt-4 pb-12">
        {/* Mobile Sticky Navigation Header */}
        <div className="md:hidden sticky top-0 left-0 right-0 z-50 bg-[#F4F1EC]/95 backdrop-blur-md border-b border-[#E0D8CE]/60 px-4 py-3 shadow-sm flex flex-col gap-1 -mx-4 mb-6">
          <div className="flex items-center gap-2.5">
            <Link to="/sofas" className="text-xs font-bold text-[#8B6844] flex items-center gap-1.5 py-0.5">
              <span className="text-sm">←</span> <span>Back</span>
            </Link>
            <span className="h-3 w-[1px] bg-[#E0D8CE]"></span>
            <span className="text-xs font-serif font-bold text-[#201712] truncate flex-grow">
              {product.name}
            </span>
          </div>
          <div className="text-[9px] text-[#6D6258] uppercase tracking-wider font-semibold pl-12">
            Sofas &nbsp;&gt;&nbsp; {getSofaCategoryLabel(product.sofaCategory)} &nbsp;&gt;&nbsp; {product.name}
          </div>
        </div>

        <MetaTags 
          title={product.name}
          description={product.shortDescription}
          ogImage={activeImage}
          productSchema={productSchema}
        />

        <div className="hidden md:block mb-4 border-b border-[#E0D8CE]/30 pb-2 text-xs">
          <span className="text-xs text-[#6D6258]">
            <Link to="/" className="hover:text-[#201712] transition-colors">Home</Link> &nbsp;&gt;&nbsp;{' '}
            <Link to="/sofas" className="hover:text-[#201712] transition-colors">Sofas</Link> &nbsp;&gt;&nbsp;{' '}
            <span className="text-[#201712] font-bold">{product.name}</span>
          </span>
        </div>

        {/* --- PRODUCT PROFILE DETAILS --- */}
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
            {/* Factory Direct Badge */}
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

        {/* --- SPECIFICATIONS & KEY DESIGN BENEFITS SIDE-BY-SIDE CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Left Card: Product Specifications */}
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

          {/* Right Card: Key Design Benefits */}
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

        {/* --- CONFIGURATOR ANCHOR WIDGET --- */}
        <section className="border-t border-[#E0D8CE]/60 pt-10" id="visualizer-target">
          <div className="text-center max-w-[600px] mx-auto mb-10 animate-fade-in">
            <span className="text-xs font-bold text-[#8B6844] uppercase tracking-[2px] mb-2 inline-block">Customize Your Sofa</span>
            <h2 className="text-3xl font-serif font-bold text-[#201712] mb-3">Create a Sofa that Fits Your Space Perfectly</h2>
            <p className="text-xs text-[#6D6258] leading-relaxed">
              Choose your preferred specifications and see your sofa come to life.
            </p>
          </div>

          {/* Sofa Configurator mount */}
          {config && (
            <SofaConfigurator 
              config={config} 
              defaultProduct={product} 
            />
          )}
        </section>
      </div>
    </div>
  );
};

export default SofaDetail;
