import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import MetaTags from '../components/MetaTags';

const Sofas = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [visibleLimit, setVisibleLimit] = useState(6);
  const [wishlist, setWishlist] = useState({});

  useEffect(() => {
    setVisibleLimit(6);
  }, [selectedCategory]);

  useEffect(() => {
    const fetchSofaData = async () => {
      try {
        const response = await API.get('/products?category=sofa');
        if (response.data?.products) setProducts(response.data.products);
      } catch (err) {
        console.error('Failed to load sofas catalog:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSofaData();
  }, []);

  const toggleWishlist = (id) => {
    setWishlist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-[#8B6844] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Filter logic based on sofaCategory field
  // Map L-shape category to Corner category to match pills in the mockup
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : selectedCategory === 'corner'
      ? products.filter(p => p.sofaCategory === 'corner' || p.sofaCategory === 'l-shape')
      : products.filter(p => p.sofaCategory === selectedCategory);

  const categories = [
    { id: 'all', name: 'All Sofas' },
    { id: 'recliner', name: 'Recliner Sofa' },
    { id: '2-seater', name: '2 Seater' },
    { id: '3-seater', name: '3 Seater' },
    { id: 'corner', name: 'Corner Sofa' },
    { id: 'custom', name: 'Custom Sofa' }
  ];

  // Identify first featured sofa to display in the main Featured Showcase card
  const featuredSofa = products.find(p => p.isFeatured) || products[0];

  return (
    <div className="w-full select-none bg-white min-h-screen pt-10 pb-16 px-4 md:px-12 lg:px-16 flex flex-col items-center">
      <div className="w-full max-w-[1400px]">
        <MetaTags 
          title="Custom Sofa Collection | Premium Sofa Manufacturer"
          description="Explore custom sectional sofas, recliners, 2-seaters, 3-seaters, and corner sofa layouts. Handcrafted in India directly from wood frame to fabric."
        />

        {/* --- SOFA CATALOGUE HEADER --- */}
        <div className="text-center max-w-[700px] mx-auto mb-8 pt-4 animate-fade-in">
          <span className="text-xs font-bold text-[#8B6844] uppercase tracking-[3px] mb-2.5 inline-block">Sofa Collection</span>
          <h1 className="text-3xl md:text-4xl lg:text-[42px] font-serif font-bold text-[#201712] mb-3 leading-tight animate-fade-in">
            Crafted for Comfort, Designed for You
          </h1>
          <div className="w-16 h-[2.5px] bg-[#8B6844] mx-auto mb-4 animate-fade-in"></div>
          <p className="text-[13px] text-[#6D6258] leading-relaxed max-w-[620px] mx-auto animate-fade-in">
            From solid seasoned wood frames to high-density foam padding and luxury fabric options, customize your seating sets directly from our factory floor.
          </p>
        </div>

        {/* --- HORIZONTAL CATEGORY FILTER PILLS --- */}
        <div className="flex overflow-x-auto snap-x snap-mandatory lg:flex-wrap lg:justify-center gap-3.5 mb-10 select-none no-scrollbar w-full pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex-shrink-0 snap-center text-[11px] font-bold py-2.5 px-6 rounded-full border tracking-wider uppercase transition-all duration-300 focus:outline-none cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#8B6844] border-[#8B6844] text-white shadow-sm'
                  : 'bg-white border-[#E0D8CE]/80 text-[#6D6258] hover:text-[#201712] hover:border-[#8B6844]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* --- FEATURED SOFA SHOWCASE BANNER --- */}
        {featuredSofa && selectedCategory === 'all' && (
          <div className="grid grid-cols-1 md:grid-cols-12 rounded-2xl overflow-hidden border border-[#E0D8CE]/50 bg-white shadow-sm mb-12 hover:shadow-[0_20px_50px_rgba(139,104,68,0.18)] hover:border-[#8B6844]/40 transition-all duration-300 animate-fade-in group">
            <div className="md:col-span-7 h-[280px] md:h-[380px] overflow-hidden bg-[#F4F1EC]">
              <img 
                src={featuredSofa.images?.[0] || '/images/workers_crafting.png'} 
                alt={featuredSofa.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02] contrast-105 saturate-105" 
              />
            </div>
            <div className="md:col-span-5 bg-[#FAF6F0] p-8 md:p-12 flex flex-col justify-center text-left">
              <span className="text-[10px] font-bold text-[#8B6844] tracking-[3px] uppercase mb-3 inline-block">Featured</span>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#201712] mb-3 leading-tight">
                {featuredSofa.name}
              </h2>
              <p className="text-[12.5px] text-[#6D6258] leading-relaxed mb-6">
                {featuredSofa.shortDescription || 'Experience unmatched comfort with our signature collection.'}
              </p>
              <div className="flex gap-4">
                <Link
                  to={`/sofas/${featuredSofa.slug}`}
                  className="btn-luxury-wood px-6 py-3.5 text-[11px] font-bold tracking-wider uppercase rounded-full text-center shadow-xs cursor-pointer"
                >
                  View Details
                </Link>
                <Link
                  to="/contact"
                  state={{
                    productName: featuredSofa.name,
                    category: 'sofa',
                    configuration: {},
                    price: featuredSofa.basePrice
                  }}
                  className="border border-[#E0D8CE] bg-white text-[#6D6258] hover:bg-[#FAF8F5] px-6 py-3.5 text-[11px] font-bold tracking-wider uppercase rounded-full text-center transition-colors duration-300 shadow-2xs cursor-pointer"
                >
                  Get Quote
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* --- PRODUCTS COUNT SECTION --- */}
        <div className="flex items-center justify-center gap-4 my-8 text-[10px] font-bold text-[#8B6844]/90 uppercase tracking-[2px] select-none">
          <div className="h-[1px] w-12 bg-[#E0D8CE]/80"></div>
          <span>✦ Showing {filteredProducts.length} Premium Sofas ✦</span>
          <div className="h-[1px] w-12 bg-[#E0D8CE]/80"></div>
        </div>

        {/* --- PRODUCT CATALOGUE GRID --- */}
        {filteredProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 lg:gap-x-10 lg:gap-y-8 xl:gap-x-12 xl:gap-y-10 animate-fade-in">
              {filteredProducts.slice(0, visibleLimit).map((product) => {
                const detailPath = `/sofas/${product.slug}`;
                const imgUrl = product.images?.[0] || '/images/workers_crafting.png';
                const whatsappNumber = '919876543210';
                const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                  `Hello! I am interested in purchasing your sofa. Here is my reference:
- *Sofa Model*: ${product.name}
- *Starting Price*: ₹${product.basePrice.toLocaleString('en-IN')}

Please guide me on how I can customize seating, fabric materials, and colors!`
                )}`;
                
                const foam = product.specifications?.['Foam'] || product.specifications?.['Foam Grade'] || product.specifications?.['Foam Density'] || 'Premium Foam';
                const frame = product.specifications?.['Frame'] || product.specifications?.['Frame Material'] || 'Sal Wood Frame';
                const warranty = product.specifications?.['Warranty'] || '3 Years Warranty';

                return (
                  <div 
                    key={product._id} 
                    className="bg-[#FFFDFC] rounded-xl border border-[#E0D8CE]/60 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-[0_15px_45px_rgba(139,104,68,0.15)] hover:border-[#8B6844]/60 transition-all duration-300 group h-auto md:h-[480px] lg:h-auto animate-fade-in"
                  >
                    {/* Image container */}
                    <div className="h-[220px] overflow-hidden relative border-b border-[#E0D8CE]/40 bg-[#F4F1EC]">
                      <img 
                        src={imgUrl} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 contrast-105 saturate-105"
                      />
                      {/* Floating WhatsApp button inline top-right */}
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#25D366] hover:bg-[#128C7E] flex items-center justify-center text-white z-10 shadow-md transition-transform active:scale-95"
                        title="Chat on WhatsApp"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.455L0 24zm6.59-4.846c1.6.95 3.473 1.452 5.378 1.453 5.541 0 10.051-4.509 10.055-10.05.002-2.684-1.038-5.207-2.93-7.098C17.26 1.57 14.75 .53 12.008.53c-5.547 0-10.059 4.511-10.063 10.055-.001 1.902.497 3.762 1.442 5.36l-.946 3.454 3.541-.928zM17.52 14.33c-.302-.15-1.785-.88-2.053-.978-.268-.1-.463-.15-.658.15-.195.3-.755.95-.926 1.15-.17.2-.34.225-.642.075-.302-.15-1.272-.469-2.423-1.496-.895-.798-1.5-1.784-1.676-2.084-.176-.3-.019-.462.132-.611.135-.134.302-.35.453-.525.151-.175.201-.3.302-.5.101-.2.05-.375-.025-.525-.075-.15-.658-1.583-.902-2.172-.238-.574-.479-.496-.658-.505-.17-.008-.365-.01-.56-.01-.195 0-.512.074-.78.373-.268.3-.993.972-.993 2.37 0 1.399 1.018 2.748 1.164 2.948.146.2 2.005 3.061 4.856 4.285.679.292 1.209.466 1.62.597.683.217 1.303.187 1.795.114.549-.08 1.785-.73 2.039-1.436.254-.707.254-1.314.177-1.438-.077-.123-.28-.2-.58-.35z"/>
                        </svg>
                      </a>
                    </div>

                    {/* Card Content body */}
                    <div className="p-3.5 md:p-5 flex-grow flex flex-col justify-between text-left lg:pt-[18px] lg:pb-[18px] lg:px-[20px]">
                      <div className="space-y-1">
                        <Link to={detailPath} className="block mt-1.5 md:mt-0 lg:mt-0 lg:mb-[10px]">
                          <h3 className="font-serif font-bold text-[16px] md:text-[19px] text-[#201712] tracking-wide leading-snug line-clamp-2 md:line-clamp-1 hover:text-[#8B6844] transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                        
                        <p className="text-[12.5px] md:text-[14.5px] text-[#6D6258] font-medium mt-1 pb-2 md:pb-3.5 lg:mt-0 lg:pb-0 lg:mb-[14px] leading-none">
                          Starting from <span className="text-[16px] md:text-[19px] font-bold text-[#8B6844] font-serif ml-1"><span className="font-sans mr-0.5">₹</span>{product.basePrice.toLocaleString('en-IN')}</span>
                        </p>

                        {/* Horizontal Specifications Grid (Desktop only) */}
                        <div className="hidden md:flex flex-wrap items-center pt-3.5 border-t border-[#E0D8CE]/40 text-[11px] text-[#6D6258] gap-x-3 gap-y-1.5 font-medium select-none lg:mt-0 lg:pt-0 lg:border-t-0 lg:mb-[16px] lg:flex lg:flex-wrap lg:items-center lg:gap-x-4 lg:gap-y-2 lg:text-[12px]">
                          <div className="flex items-center gap-1.5 min-w-0 lg:gap-[6px] lg:whitespace-nowrap lg:flex lg:items-center lg:flex-shrink-0">
                            <i className="fa-solid fa-cloud text-[#8B6844] text-[12px] lg:text-[13px] lg:flex-shrink-0"></i>
                            <span className="lg:font-medium lg:leading-[1.4]">
                              {foam}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 min-w-0 lg:gap-[6px] lg:whitespace-nowrap lg:flex lg:items-center lg:flex-shrink-0">
                            <i className="fa-solid fa-tree text-[#8B6844] text-[12px] lg:text-[13px] lg:flex-shrink-0"></i>
                            <span className="lg:font-medium lg:leading-[1.4]">
                              {frame}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 min-w-0 lg:gap-[6px] lg:whitespace-nowrap lg:flex lg:items-center lg:flex-shrink-0">
                            <i className="fa-solid fa-shield text-[#8B6844] text-[12px] lg:text-[13px] lg:flex-shrink-0"></i>
                            <span className="lg:font-medium lg:leading-[1.4]">
                              {warranty}
                            </span>
                          </div>
                        </div>

                        {/* Compact Feature Row (Mobile only - 8px margin-top) */}
                        <div className="flex md:hidden flex-wrap items-center pt-2 mt-2 border-t border-[#E0D8CE]/40 text-[10px] text-[#6D6258]/85 gap-x-2 gap-y-0.5 font-medium select-none w-full">
                          <span className="flex items-center gap-1">
                            <span>☁</span>
                            <span className="line-clamp-1">{foam.split(' Foam')[0].split(' Density')[0]}</span>
                          </span>
                          <span className="text-[#E0D8CE]">•</span>
                          <span className="flex items-center gap-1">
                            <span>🪵</span>
                            <span className="line-clamp-1">{frame.replace(' Frame', '')}</span>
                          </span>
                          <span className="text-[#E0D8CE]">•</span>
                          <span className="flex items-center gap-1">
                            <span>🛡</span>
                            <span className="line-clamp-1">{warranty.replace(' Years', 'Y').replace(' Year', 'Y')}</span>
                          </span>
                        </div>
                      </div>

                      {/* Actions row */}
                      <div className="pt-3 border-t border-[#E0D8CE]/30 flex flex-row items-center gap-2.5 w-full select-none mt-3.5 md:pt-3.5 md:mt-auto lg:mt-0 lg:pt-[16px]">
                        <Link
                          to={detailPath}
                          className="flex-1 h-[48px] md:h-auto border border-[#8B6844] text-[#8B6844] hover:bg-[#8B6844] hover:text-white hover:scale-102 text-[10px] md:text-[10.5px] font-bold py-2.5 md:py-2.5 text-center transition-all duration-300 rounded-[14px] md:rounded-full cursor-pointer uppercase tracking-wider flex items-center justify-center shadow-xs active:scale-95"
                        >
                          View Details
                        </Link>
                        <Link
                          to="/contact"
                          state={{
                            productName: product.name,
                            category: 'sofa',
                            configuration: {},
                            price: product.basePrice
                          }}
                          className="flex-1 h-[48px] md:h-auto bg-[#8B6844] hover:bg-[#705031] text-white hover:scale-102 text-[10px] md:text-[10.5px] font-bold py-2.5 md:py-2.5 text-center transition-all duration-300 rounded-[14px] md:rounded-full cursor-pointer uppercase tracking-wider flex items-center justify-center shadow-md active:scale-95"
                        >
                          Get Quote
                        </Link>
                        
                        {/* Circular WhatsApp Button */}
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hidden md:flex w-9.5 h-9.5 rounded-full bg-[#25D366] hover:bg-[#128C7E] items-center justify-center text-white transition-colors flex-shrink-0 shadow-sm"
                          title="Chat on WhatsApp"
                        >
                          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.455L0 24zm6.59-4.846c1.6.95 3.473 1.452 5.378 1.453 5.541 0 10.051-4.509 10.055-10.05.002-2.684-1.038-5.207-2.93-7.098C17.26 1.57 14.75 .53 12.008.53c-5.547 0-10.059 4.511-10.063 10.055-.001 1.902.497 3.762 1.442 5.36l-.946 3.454 3.541-.928zM17.52 14.33c-.302-.15-1.785-.88-2.053-.978-.268-.1-.463-.15-.658.15-.195.3-.755.95-.926 1.15-.17.2-.34.225-.642.075-.302-.15-1.272-.469-2.423-1.496-.895-.798-1.5-1.784-1.676-2.084-.176-.3-.019-.462.132-.611.135-.134.302-.35.453-.525.151-.175.201-.3.302-.5.101-.2.05-.375-.025-.525-.075-.15-.658-1.583-.902-2.172-.238-.574-.479-.496-.658-.505-.17-.008-.365-.01-.56-.01-.195 0-.512.074-.78.373-.268.3-.993.972-.993 2.37 0 1.399 1.018 2.748 1.164 2.948.146.2 2.005 3.061 4.856 4.285.679.292 1.209.466 1.62.597.683.217 1.303.187 1.795.114.549-.08 1.785-.73 2.039-1.436.254-.707.254-1.314.177-1.438-.077-.123-.28-.2-.58-.35z"/>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredProducts.length > 6 && (
              <div className="mt-16 text-center animate-fade-in select-none">
                {visibleLimit < filteredProducts.length ? (
                  <button 
                    onClick={() => setVisibleLimit(prev => prev + 6)}
                    className="inline-block border border-[#8B6844] text-[#8B6844] bg-transparent text-[11px] font-bold tracking-[1.5px] uppercase py-3.5 px-8 hover:bg-[#8B6844] hover:text-white transition-all duration-300 focus:outline-none cursor-pointer rounded-full"
                  >
                    View More Products
                  </button>
                ) : (
                  <button 
                    onClick={() => setVisibleLimit(6)}
                    className="inline-block border border-[#8B6844] text-[#8B6844] bg-transparent text-[11px] font-bold tracking-[1.5px] uppercase py-3.5 px-8 hover:bg-[#8B6844] hover:text-white transition-all duration-300 focus:outline-none cursor-pointer rounded-full"
                  >
                    View Less Products
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-24 border border-dashed border-[#E0D8CE] bg-white rounded-xl">
            <span className="block text-4xl mb-4">🛋</span>
            <h3 className="text-lg font-serif font-bold text-[#201712] mb-2">No Sofas Found</h3>
            <p className="text-xs text-[#6D6258] max-w-sm mx-auto mb-6">
              We are currently updating our catalogue for this sofa category. Check back soon or contact the factory directly.
            </p>
            <button 
              onClick={() => setSelectedCategory('all')}
              className="btn-luxury-wood text-white font-bold text-xs py-3 px-6 uppercase tracking-wider focus:outline-none cursor-pointer rounded-full"
            >
              Show All Sofas
            </button>
          </div>
        )}

        {/* --- SOFA TRUST BADGES --- */}
        <section className="mt-20 border border-[#E0D8CE]/50 bg-white/70 backdrop-blur-xs rounded-2xl p-8 md:p-12 select-none shadow-2xs">
          <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center justify-items-center">
            {[
              {
                icon: 'fa-couch',
                title: 'Orthopaedic Support',
                desc: 'Ergonomic design for better back support'
              },
              {
                icon: 'fa-feather',
                title: 'Premium Comfort',
                desc: 'High resilience foam for long lasting comfort'
              },
              {
                icon: 'fa-shield-halved',
                title: 'Built to Last',
                desc: 'Strong frames and durable materials'
              },
              {
                icon: 'fa-ruler-combined',
                title: 'Custom Sizes Available',
                desc: 'Tailored to your space and preferences'
              },
              {
                icon: 'fa-industry',
                title: 'Factory Direct',
                desc: 'Best quality at best prices'
              },
              {
                icon: 'fa-map-location-dot',
                title: 'Made in India',
                desc: 'Proudly manufactured with care'
              }
            ].map((badge, idx) => (
              <div key={idx} className="flex flex-col items-center max-w-[160px] group cursor-default">
                <div className="w-14 h-14 bg-white border border-[#E0D8CE]/75 rounded-full flex items-center justify-center text-base text-[#8B6844] shadow-sm mb-4 transition-all duration-300 group-hover:scale-110 group-hover:border-[#8B6844] group-hover:shadow-md">
                  <i className={`fa-solid ${badge.icon}`}></i>
                </div>
                <h4 className="text-[11px] font-bold text-[#201712] uppercase tracking-wider mb-2 leading-tight">
                  {badge.title}
                </h4>
                <p className="text-[10px] text-[#6D6258] leading-relaxed">
                  {badge.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* --- CUSTOM CALLOUT BANNER --- */}
        <section className="mt-8 bg-[#FAF6F0] border border-[#E0D8CE]/40 rounded-2xl p-8 md:p-10 select-none flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xs hover:shadow-xs transition-all duration-300 animate-fade-in">
          <div className="flex items-center gap-5 text-left w-full md:w-auto">
            <div className="w-14 h-14 bg-white border border-[#E0D8CE]/50 rounded-xl flex items-center justify-center text-xl text-[#8B6844] flex-shrink-0 shadow-3xs">
              🛋
            </div>
            <div>
              <h3 className="font-serif font-bold text-[17px] text-[#201712] mb-1">
                Looking for something custom?
              </h3>
              <p className="text-[12px] text-[#6D6258]">
                We can customize your sofa in any size, fabric, color and comfort level.
              </p>
            </div>
          </div>
          <Link
            to="/contact"
            className="btn-luxury-wood text-white text-[11px] font-bold py-3.5 px-8 rounded-full uppercase tracking-widest whitespace-nowrap flex items-center gap-2 hover:-translate-y-0.5 transition-all duration-300 shadow-sm cursor-pointer w-full md:w-auto justify-center"
          >
            <span>Get Custom Quote</span>
            <span>→</span>
          </Link>
        </section>
      </div>
    </div>
  );
};

export default Sofas;
