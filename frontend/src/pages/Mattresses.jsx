import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import MattressCard from '../components/MattressCard';
import MetaTags from '../components/MetaTags';

const Mattresses = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedCore, setSelectedCore] = useState('all'); // 'all', 'ortho', 'latex', 'spring', 'hybrid'
  const [sortBy, setSortBy] = useState('popular');
  const [visibleLimit, setVisibleLimit] = useState(6);

  useEffect(() => {
    const fetchMattressData = async () => {
      try {
        const productsRes = await API.get('/products?category=mattress');
        if (productsRes.data?.products) setProducts(productsRes.data.products);
      } catch (err) {
        console.error('Failed to load mattresses catalogue:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMattressData();
  }, []);

  // Filter Logic
  const filteredProducts = products.filter(product => {
    if (selectedCore === 'all') return true;
    return product.mattressCoreType === selectedCore;
  });

  // Sort Logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low-to-high') {
      return a.basePrice - b.basePrice;
    } else if (sortBy === 'price-high-to-low') {
      return b.basePrice - a.basePrice;
    } else if (sortBy === 'highest-rated') {
      return b.ratings - a.ratings;
    } else {
      // popular / featured
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return b.reviewsCount - a.reviewsCount;
    }
  });

  // Find Featured Spotlight Product (OrthoRest Premium)
  const spotlightProduct = products.find(p => p.isFeatured && p.slug === 'orthorest-premium-memory-foam-mattress') || products[0];

  const handlePillClick = (coreId) => {
    setSelectedCore(coreId);
    setVisibleLimit(6);
  };

  const handleWhatsAppQuote = () => {
    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(
      "Hi! I am interested in getting a custom mattress quotation. Can you help me with materials, thickness, and sizing?"
    )}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-[#8B6844] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full select-none bg-[#FDFBF7] min-h-screen pt-5 pb-12 px-4 md:px-12 lg:px-16 flex flex-col items-center">
      <div className="w-full max-w-[1400px]">
        <MetaTags
          title="Explore Mattress Collection | Sleepora Factory Direct"
          description="Browse our range of OrthoRest Premium, CloudNest, BackCare, DreamRest, and Hotel Collection mattresses. Handcrafted to order."
        />

        {/* --- HERO HEADER SECTION --- */}
        <div className="text-center max-w-[700px] mx-auto mb-5 pt-2 animate-fade-in">
          <span className="text-xs font-bold text-[#8B6844] uppercase tracking-[3px] mb-2.5 inline-block">
            PREMIUM MATTRESS COLLECTION
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-[42px] font-serif font-bold text-[#201712] mb-2 leading-tight animate-fade-in">
            Discover Better Sleep, Crafted for Life.
          </h1>
          <div className="w-16 h-[2.5px] bg-[#8B6844] mx-auto mb-2.5 animate-fade-in"></div>
          <p className="text-[13px] text-[#6D6258] leading-relaxed max-w-[620px] mx-auto mb-4 animate-fade-in">
            Engineered for ultimate comfort and support. Made with premium materials for a healthier and deeper sleep.
          </p>

          {/* Category Filter Pills directly under subtitle */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mb-2 select-none">
            {[
              { label: 'ALL', id: 'all' },
              { label: 'MEMORY FOAM', id: 'ortho' },
              { label: 'LATEX', id: 'latex' },
              { label: 'POCKET SPRING', id: 'spring' },
              { label: 'HYBRID', id: 'hybrid' },
              { label: 'ORTHOPAEDIC', id: 'ortho' }
            ].map((pill, idx) => {
              const isActive = selectedCore === pill.id;
              return (
                <button
                  key={idx}
                  onClick={() => handlePillClick(pill.id)}
                  className={`text-[11px] font-bold py-2.5 px-6 rounded-full border tracking-wider uppercase transition-all duration-300 focus:outline-none cursor-pointer ${
                    isActive
                      ? 'bg-[#8B6844] border-[#8B6844] text-white shadow-sm'
                      : 'bg-white border-[#E0D8CE]/80 text-[#6D6258] hover:text-[#201712] hover:border-[#8B6844]'
                  }`}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* --- SPOTLIGHT FEATURED PRODUCT CONTAINER --- */}
        {spotlightProduct && selectedCore === 'all' && (
          <div className="grid grid-cols-1 md:grid-cols-12 rounded-2xl overflow-hidden border border-[#E0D8CE]/50 bg-white shadow-sm mb-12 hover:shadow-[0_20px_50px_rgba(139,104,68,0.18)] hover:border-[#8B6844]/40 transition-all duration-300 animate-fade-in group">
            
            {/* Left Column: Spotlight Image */}
            <div className="md:col-span-7 h-[280px] md:h-[380px] overflow-hidden bg-[#F4F1EC]">
              <img
                src="/images/mattress_hero.png"
                alt="Sleepora OrthoRest Premium Spotlight"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02] contrast-105 saturate-105"
              />
            </div>

            {/* Right Column: Spotlight Specs */}
            <div className="md:col-span-5 bg-[#FAF6F0] p-8 md:p-12 flex flex-col justify-center text-left">
              <span className="text-[10px] font-bold text-[#8B6844] tracking-[3px] uppercase mb-3 inline-block">
                FEATURED
              </span>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#201712] mb-3 leading-tight">
                {spotlightProduct.name}
              </h2>
              <p className="text-[14.5px] text-[#6D6258] font-medium mb-6">
                Starting from <span className="text-[19px] font-bold text-[#8B6844] font-serif ml-1">₹{spotlightProduct.basePrice.toLocaleString('en-IN')}</span>
              </p>

              {/* Three Specs Blocks */}
              <div className="space-y-4 mb-6">
                {/* Spec 1 */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white border border-[#E0D8CE]/60 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[#8B6844]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 4v16M8 8h8M6 12h12M8 16h8" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#201712] leading-none mb-1 font-display">Orthopaedic Support</h4>
                    <p className="text-[11px] text-[#6D6258] font-light leading-none">Designed for better spinal alignment</p>
                  </div>
                </div>

                {/* Spec 2 */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white border border-[#E0D8CE]/60 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[#8B6844]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M4 6h16M4 11h16M4 16h16" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#201712] leading-none mb-1 font-display">Premium Memory Foam</h4>
                    <p className="text-[11px] text-[#6D6258] font-light leading-none">High density foam for pressure relief</p>
                  </div>
                </div>

                {/* Spec 3 */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white border border-[#E0D8CE]/60 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[#8B6844]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#201712] leading-none mb-1 font-display">10 Year Warranty</h4>
                    <p className="text-[11px] text-[#6D6258] font-light leading-none">Long lasting comfort & durability</p>
                  </div>
                </div>
              </div>

              {/* Buttons Row */}
              <div className="flex gap-4">
                <button
                  onClick={() => navigate(`/mattresses/${spotlightProduct.slug}`)}
                  className="bg-[#8B6844] hover:bg-[#725333] text-white font-serif font-bold text-[11px] uppercase tracking-wider py-3.5 px-8 rounded-full transition-colors cursor-pointer"
                >
                  VIEW DETAILS
                </button>
                <button
                  onClick={() => navigate('/contact', {
                    state: { productName: spotlightProduct.name, category: 'mattress', price: spotlightProduct.basePrice }
                  })}
                  className="border border-[#E0D8CE] bg-white text-[#6D6258] hover:bg-[#FAF8F5] font-serif font-bold text-[11px] uppercase tracking-wider py-3.5 px-8 rounded-full transition-all cursor-pointer"
                >
                  GET QUOTE
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- PRODUCTS COUNT ROW --- */}
        <div className="flex items-center justify-center gap-4 my-8 text-[10px] font-bold text-[#8B6844]/90 uppercase tracking-[2px] select-none">
          <div className="h-[1px] w-12 bg-[#E0D8CE]/80"></div>
          <span>✦ Showing {sortedProducts.length} Premium Mattresses ✦</span>
          <div className="h-[1px] w-12 bg-[#E0D8CE]/80"></div>
        </div>

        {/* --- CATALOGUE GRID SECTION --- */}
        <div className="w-full select-none mb-12">
          
          {/* Header row: sorting drop down */}
          <div className="flex justify-end items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="text-[#6D6258] font-bold uppercase tracking-wider text-[10px] font-display">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-[#E0D8CE]/80 py-1.5 px-3 text-xs text-[#201712] focus:outline-none focus:border-[#8B6844] cursor-pointer rounded-sm"
              >
                <option value="popular">Popular</option>
                <option value="price-low-to-high">Price: Low to High</option>
                <option value="price-high-to-low">Price: High to Low</option>
                <option value="highest-rated">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* 3-Column Catalog Grid */}
          {sortedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
                {sortedProducts.slice(0, visibleLimit).map((product) => (
                  <MattressCard key={product._id} product={product} />
                ))}
              </div>

              {sortedProducts.length > 6 && (
                <div className="mt-16 text-center animate-fade-in">
                  {visibleLimit < sortedProducts.length ? (
                    <button
                      onClick={() => setVisibleLimit(prev => prev + 6)}
                      className="inline-block border border-[#8B6844] text-[#8B6844] bg-transparent text-[11px] font-bold tracking-[1.5px] uppercase py-3.5 px-8 hover:bg-[#8B6844] hover:text-white transition-all duration-300 focus:outline-none cursor-pointer rounded-full"
                    >
                      VIEW MORE PRODUCTS
                    </button>
                  ) : (
                    <button
                      onClick={() => setVisibleLimit(6)}
                      className="inline-block border border-[#8B6844] text-[#8B6844] bg-transparent text-[11px] font-bold tracking-[1.5px] uppercase py-3.5 px-8 hover:bg-[#8B6844] hover:text-white transition-all duration-300 focus:outline-none cursor-pointer rounded-full"
                    >
                      VIEW LESS PRODUCTS
                    </button>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 border border-dashed border-[#E0D8CE] bg-white rounded-2xl shadow-xs">
              <span className="block text-4xl mb-4">🔍</span>
              <h3 className="text-base font-serif font-bold text-[#201712] mb-1">No Matching Mattresses Found</h3>
              <p className="text-xs text-[#6D6258] max-w-sm mx-auto">
                Try selecting another category pill to view our range of comfort mattresses.
              </p>
            </div>
          )}
        </div>

        {/* --- TRUST ASSURANCES ROW --- */}
        <div className="w-full bg-white border border-[#E0D8CE]/60 rounded-2xl py-10 px-6 my-10 select-none shadow-xs">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 justify-items-center text-center">
            {[
              {
                title: 'Factory Direct',
                desc: 'Best quality at factory prices',
                icon: (
                  <svg className="w-5.5 h-5.5 text-[#8B6844]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 21h18M4 21V10l8-5 8 5v11M9 14h6v7H9v-7z" />
                  </svg>
                )
              },
              {
                title: 'Premium Materials',
                desc: 'Carefully selected for lasting comfort',
                icon: (
                  <svg className="w-5.5 h-5.5 text-[#8B6844]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <path d="m9 11 2 2 4-4" />
                  </svg>
                )
              },
              {
                title: '10-Year Warranty',
                desc: 'Long lasting durability you can trust',
                icon: (
                  <svg className="w-5.5 h-5.5 text-[#8B6844]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="8" r="7"/>
                    <path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12"/>
                  </svg>
                )
              },
              {
                title: 'Custom Sizes',
                desc: 'Tailored to your space and preferences',
                icon: (
                  <svg className="w-5.5 h-5.5 text-[#8B6844]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="7" width="20" height="10" rx="2"/>
                    <path d="M6 7v10M18 7v10M12 7v10" strokeDasharray="2 2" />
                  </svg>
                )
              },
              {
                title: 'Pan India Delivery',
                desc: 'Safe & reliable delivery',
                icon: (
                  <svg className="w-5.5 h-5.5 text-[#8B6844]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="1" y="3" width="15" height="13"/>
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                    <circle cx="5.5" cy="18.5" r="2.5"/>
                    <circle cx="18.5" cy="18.5" r="2.5"/>
                  </svg>
                )
              },
              {
                title: 'Expert Support',
                desc: "We're here to help you sleep better",
                icon: (
                  <svg className="w-5.5 h-5.5 text-[#8B6844]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 18v-6a9 9 0 0 1 18 0v6M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3"/>
                  </svg>
                )
              }
            ].map((feat, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 max-w-[170px] select-none">
                <div className="w-11 h-11 rounded-full bg-[#F4F1EC]/60 border border-[#E0D8CE]/40 flex items-center justify-center mb-1">
                  {feat.icon}
                </div>
                <h4 className="text-[12px] font-bold text-[#201712] tracking-wide uppercase leading-tight font-display select-none">
                  {feat.title}
                </h4>
                <p className="text-[10px] text-[#6D6258] font-medium leading-relaxed select-none">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* --- BOTTOM CUSTOM QUOTE BANNER --- */}
        <div className="w-full bg-[#FBF9F6] border border-[#E0D8CE]/40 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-5 my-6 shadow-2xs">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 bg-white border border-[#E0D8CE]/60 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-[#8B6844]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 11h18M3 15h18" strokeDasharray="2 2" />
                <rect x="2" y="6" width="20" height="12" rx="2" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#201712] font-display leading-tight mb-0.5">Looking for something custom?</h3>
              <p className="text-[11px] text-[#6D6258] font-light leading-normal">We can customize your mattress in any size, thickness and comfort level.</p>
            </div>
          </div>
          <button
            onClick={handleWhatsAppQuote}
            className="w-full md:w-auto bg-[#8B6844] hover:bg-[#725333] text-white font-serif font-bold text-[11px] uppercase tracking-wider py-3.5 px-8 rounded-full transition-colors flex items-center justify-center gap-1.5 flex-shrink-0 cursor-pointer"
          >
            <span>GET CUSTOM QUOTE</span>
            <span className="text-[12px]">→</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default Mattresses;
