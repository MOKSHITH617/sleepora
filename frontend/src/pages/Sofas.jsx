import React, { useState, useEffect } from 'react';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import MetaTags from '../components/MetaTags';

const Sofas = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [visibleLimit, setVisibleLimit] = useState(6);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Filter logic based on sofaCategory field
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.sofaCategory === selectedCategory);

  const categories = [
    { id: 'all', name: 'All Sofas' },
    { id: 'l-shape', name: 'L Shape Sofa' },
    { id: 'recliner', name: 'Recliner Sofa' },
    { id: '2-seater', name: '2 Seater' },
    { id: '3-seater', name: '3 Seater' },
    { id: 'corner', name: 'Corner Sofa' },
    { id: 'custom', name: 'Custom Sofa' }
  ];

  return (
    <div className="max-w-[1480px] mx-auto px-6 pt-10 pb-[25px] select-none bg-[#FAF8F5]">
      <MetaTags 
        title="Custom Sofa Collection | Premium Sofa Manufacturer"
        description="Explore custom sectional sofas, recliners, 2-seaters, 3-seaters, and corner sofa layouts. Handcrafted in India directly from wood frame to fabric."
      />

      <div className="text-center max-w-[650px] mx-auto mb-4 animate-fade-in">
        <span className="text-xs font-bold text-[#7C5F43] uppercase tracking-[2px] mb-3 inline-block">Sofa Collection</span>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#2A211D] mb-4">Explore Our Custom Sofa Range</h1>
        <p className="text-[13px] text-[#8E7D75] leading-relaxed">
          From solid seasoned sal wood frames to high-density foam padding and luxury color swatches, customize your seating sets directly from our factory floor.
        </p>
      </div>

      {/* Main content split */}
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-[28px] items-start">
        
        {/* Left Side: Filter Configurator Sidebar */}
        <aside className="bg-white border border-[#E6DED2] p-6 rounded-[16px] shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_16px_40px_rgba(42,33,29,0.04)] hover:border-[#C7A36B]/40 transition-all duration-300 sticky top-[100px]">
          <h3 className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#7C5F43] mb-3 border-b border-[#EADFC9]/30 pb-2">
            Sofa Types
          </h3>
          <div className="flex flex-col gap-2.5">
            {categories.map((cat) => (
              <label 
                key={cat.id} 
                className="flex items-center gap-2.5 text-xs text-[#8E7D75] hover:text-[#2A211D] cursor-pointer font-medium transition-colors"
              >
                <input
                  type="radio"
                  name="sofa-category"
                  checked={selectedCategory === cat.id}
                  onChange={() => setSelectedCategory(cat.id)}
                  className="w-4 h-4 text-[#7C5F43] border-[#EADFC9] focus:ring-[#7C5F43]/30 cursor-pointer accent-[#7C5F43] transition-all duration-200"
                />
                <span className={selectedCategory === cat.id ? 'text-[#2A211D] font-bold' : ''}>
                  {cat.name}
                </span>
              </label>
            ))}
          </div>
        </aside>

        {/* Right Side: Product Catalogue Grid */}
        <div className="w-full">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#EADFC9]/30 text-xs">
            <span className="text-[#8E7D75] font-semibold">
              Showing <strong className="text-[#2A211D]">{filteredProducts.length}</strong> Premium Sofas
            </span>
          </div>

          {filteredProducts.length > 0 ? (
            <>
              <div className="premium-product-grid">
                {filteredProducts.slice(0, visibleLimit).map((product) => (
                  <ProductCard 
                    key={product._id} 
                    product={product} 
                  />
                ))}
              </div>

              {filteredProducts.length > visibleLimit && (
                <div className="mt-16 text-center animate-fade-in">
                  <button 
                    onClick={() => setVisibleLimit(prev => prev + 6)}
                    className="inline-block border border-[#7C5F43] text-[#7C5F43] bg-transparent text-[11px] font-bold tracking-[1.5px] uppercase py-3.5 px-8 hover:bg-[#7C5F43] hover:text-white transition-all duration-300 focus:outline-none"
                  >
                    View More Products
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-24 border border-dashed border-[#EADFC9]/50 bg-white">
              <span className="block text-4xl mb-4">🛋</span>
              <h3 className="text-lg font-serif font-bold text-[#2A211D] mb-2">No Sofas Found</h3>
              <p className="text-xs text-[#8E7D75] max-w-sm mx-auto mb-6">
                We are currently updating our catalogue for this sofa category. Check back soon or contact the factory directly.
              </p>
              <button 
                onClick={() => setSelectedCategory('all')}
                className="bg-[#7C5F43] hover:bg-[#5F4630] text-white font-bold text-xs py-3 px-6 uppercase tracking-wider focus:outline-none"
              >
                Show All Sofas
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Sofas;
