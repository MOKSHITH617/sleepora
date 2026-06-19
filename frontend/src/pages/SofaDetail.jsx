import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import SofaConfigurator from '../components/SofaConfigurator';
import MetaTags from '../components/MetaTags';

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
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
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
        "name": "TimeWell Mattress Factory"
      }
    }
  };

  const imagesList = product.images && product.images.length > 0 ? product.images : ['/images/factory_floor.png'];

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12 select-none">
      <MetaTags 
        title={product.name}
        description={product.shortDescription}
        ogImage={activeImage}
        productSchema={productSchema}
      />

      <div className="mb-6">
        <span className="text-xs font-bold text-text-muted">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link> &gt;{' '}
          <Link to="/sofas" className="hover:text-primary transition-colors">Sofas</Link> &gt;{' '}
          <span className="text-primary-light font-semibold">{product.name}</span>
        </span>
      </div>

      {/* --- PRODUCT PROFILE DETAILS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 items-start">
        
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="relative pt-[70%] bg-bg-light rounded-md border border-border shadow-sm overflow-hidden">
            <img 
              src={activeImage} 
              alt={product.name} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300"
            />
          </div>
          
          {/* Gallery Thumbnails */}
          {imagesList.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {imagesList.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-16 rounded-sm border-2 overflow-hidden bg-bg-light transition-all flex-shrink-0 focus:outline-none ${activeImage === img ? 'border-accent' : 'border-border'}`}
                >
                  <img src={img} alt={`Gallery-${index}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Descriptions & Specifications */}
        <div className="lg:col-span-6 flex flex-col justify-start">
          <div className="border-b border-border pb-6 mb-6">
            <h1 className="text-3xl font-extrabold font-display text-primary mb-3 leading-tight">{product.name}</h1>
            <p className="text-sm text-text-muted leading-relaxed">{product.description}</p>
          </div>

          {/* Specifications Table */}
          <div className="mb-6">
            <h4 className="text-[11px] font-bold text-primary uppercase tracking-wider mb-3.5">Product Specifications</h4>
            <div className="border border-border rounded-sm overflow-hidden text-xs">
              {Object.entries(product.specifications || {}).map(([key, val], idx) => (
                <div 
                  key={idx} 
                  className={`grid grid-cols-2 p-3 ${idx % 2 === 0 ? 'bg-bg-light' : 'bg-white'} border-b border-border last:border-b-0`}
                >
                  <span className="font-bold text-text-muted">{key}</span>
                  <span className="text-primary font-medium">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits Bullet Points */}
          {product.benefits && product.benefits.length > 0 && (
            <div>
              <h4 className="text-[11px] font-bold text-primary uppercase tracking-wider mb-3">Key Design Benefits</h4>
              <ul className="flex flex-col gap-2.5 text-xs text-text-muted">
                {product.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">✓</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </div>

      {/* --- CONFIGURATOR ANCHOR WIDGET --- */}
      <section className="border-t border-border pt-12" id="visualizer-target">
        <div className="text-center max-w-[600px] mx-auto mb-10">
          <span className="text-xs font-bold text-accent uppercase tracking-wider mb-2 inline-block">Product Configurator</span>
          <h2 className="text-3xl font-extrabold font-display mb-3">Customize Sofa Configurations</h2>
          <p className="text-xs text-text-muted leading-relaxed">
            Choose sofa model categories, capacities, materials, fabrics, and color swatches to calculate custom pricing instantly.
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
  );
};

export default SofaDetail;
