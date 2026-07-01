import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import MattressConfigurator from '../components/MattressConfigurator';
import MetaTags from '../components/MetaTags';

const MattressDetail = () => {
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
          setActiveImage(prodRes.data.product.images?.[0] || '/images/ortho_mattress.png');
        } else {
          setError('Product details not found.');
        }

        // 2. Fetch configurator rules
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
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
        "name": "TimeWell Mattress Factory"
      }
    }
  };

  const imagesList = product.images && product.images.length > 0 ? product.images : ['/images/ortho_mattress.png'];

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-16 select-none bg-[#FAF8F5]">
      <MetaTags 
        title={product.name}
        description={product.shortDescription}
        ogImage={activeImage}
        productSchema={productSchema}
      />

      <div className="mb-8 border-b border-[#EADFC9]/30 pb-4 text-xs">
        <span className="text-xs text-[#8E7D75]">
          <Link to="/" className="hover:text-[#2A211D] transition-colors">Home</Link> &nbsp;&gt;&nbsp;{' '}
          <Link to="/mattresses" className="hover:text-[#2A211D] transition-colors">Mattresses</Link> &nbsp;&gt;&nbsp;{' '}
          <span className="text-[#2A211D] font-bold">{product.name}</span>
        </span>
      </div>

      {/* --- PRODUCT PROFILE DETAILS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 items-start">
        
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="relative pt-[70%] bg-white border border-[#EADFC9]/45 shadow-sm overflow-hidden">
            <img 
              src={activeImage} 
              alt={product.name} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-103"
            />
          </div>
          
          {/* Gallery Thumbnails */}
          {imagesList.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {imagesList.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-16 border overflow-hidden bg-[#FAF5EF] transition-all flex-shrink-0 focus:outline-none ${activeImage === img ? 'border-[#7C5F43] ring-1 ring-[#7C5F43]' : 'border-[#EADFC9]/50 hover:border-[#7C5F43]/45'}`}
                >
                  <img src={img} alt={`Gallery-${index}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Descriptions & Specifications */}
        <div className="lg:col-span-6 flex flex-col justify-start">
          <div className="border-b border-[#EADFC9]/30 pb-6 mb-6">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#2A211D] mb-3 leading-tight">{product.name}</h1>
            <p className="text-[13px] text-[#8E7D75] leading-relaxed">{product.description}</p>
          </div>

          {/* Specifications Table */}
          <div className="mb-6">
            <h4 className="text-[10px] font-bold text-[#2A211D] uppercase tracking-wider mb-3.5">Product Specifications</h4>
            <div className="border border-[#EADFC9]/35 overflow-hidden text-xs bg-white">
              {Object.entries(product.specifications || {}).map(([key, val], idx) => (
                <div 
                  key={idx} 
                  className={`grid grid-cols-2 p-3 ${idx % 2 === 0 ? 'bg-[#FAF8F5]' : 'bg-white'} border-b border-[#EADFC9]/25 last:border-b-0`}
                >
                  <span className="font-bold text-[#8E7D75]">{key}</span>
                  <span className="text-[#2A211D] font-medium">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits Bullet Points */}
          {product.benefits && product.benefits.length > 0 && (
            <div className="mb-6">
              <h4 className="text-[10px] font-bold text-[#2A211D] uppercase tracking-wider mb-3">Key Design Benefits</h4>
              <ul className="flex flex-col gap-2.5 text-xs text-[#8E7D75]">
                {product.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#7C5F43] mt-0.5">✓</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quality Standards & Certification Badges */}
          <div className="mt-6 pt-6 border-t border-[#EADFC9]/30">
            <h4 className="text-[10px] font-bold text-[#2A211D] uppercase tracking-wider mb-4">Quality & Safety Standards</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 bg-white p-3.5 border border-[#EADFC9]/40">
                <span className="text-xl">🌿</span>
                <div>
                  <span className="block text-xs font-bold text-[#2A211D]">100% Organic</span>
                  <span className="block text-[10px] text-[#8E7D75]">Natural Latex Layers</span>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white p-3.5 border border-[#EADFC9]/40">
                <span className="text-xl">🛡️</span>
                <div>
                  <span className="block text-xs font-bold text-[#2A211D]">CertiPUR-US®</span>
                  <span className="block text-[10px] text-[#8E7D75]">Tested Support Foams</span>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white p-3.5 border border-[#EADFC9]/40">
                <span className="text-xl">🧵</span>
                <div>
                  <span className="block text-xs font-bold text-[#2A211D]">Oeko-Tex® 100</span>
                  <span className="block text-[10px] text-[#8E7D75]">Hypoallergenic Fabrics</span>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white p-3.5 border border-[#EADFC9]/40">
                <span className="text-xl">🏭</span>
                <div>
                  <span className="block text-xs font-bold text-[#2A211D]">Factory Direct</span>
                  <span className="block text-[10px] text-[#8E7D75]">Direct Manufacturer Warranty</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* --- CONFIGURATOR ANCHOR WIDGET --- */}
      <section className="border-t border-[#EADFC9]/40 pt-16" id="visualizer-target">
        <div className="text-center max-w-[600px] mx-auto mb-12 animate-fade-in">
          <span className="text-xs font-bold text-[#7C5F43] uppercase tracking-[2px] mb-3 inline-block">Product Configurator</span>
          <h2 className="text-3xl font-serif font-bold text-[#2A211D] mb-4">Customize Mattress Dimensions</h2>
          <p className="text-[13px] text-[#8E7D75] leading-relaxed">
            Choose core support options, specify your bed dimensions, and slide the mattress depth to review dynamic factory rates.
          </p>
        </div>

        {/* Mattress Configurator mount */}
        {config && (
          <MattressConfigurator 
            config={config} 
            defaultCore={product.mattressCoreType} 
          />
        )}
      </section>

    </div>
  );
};

export default MattressDetail;
