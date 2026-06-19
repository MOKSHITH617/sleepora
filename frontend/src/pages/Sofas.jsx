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
    <div className="max-w-[1200px] mx-auto px-6 py-12 select-none">
      <MetaTags 
        title="Custom Sofa Collection | Premium Sofa Manufacturer"
        description="Explore custom sectional sofas, recliners, 2-seaters, 3-seaters, and corner sofa layouts. Handcrafted in India directly from wood frame to fabric."
      />

      <div className="text-center max-w-[650px] mx-auto mb-12">
        <span className="text-xs font-bold text-accent uppercase tracking-wider mb-2 inline-block">Sofa Collection</span>
        <h1 className="text-3xl md:text-4xl font-extrabold font-display mb-4">Explore Our Custom Sofa Range</h1>
        <p className="text-sm text-text-muted leading-relaxed">
          From solid seasoned sal wood frames to high-density foam padding and luxury color swatches, customize your seating sets directly from our factory floor.
        </p>
      </div>

      {/* --- CATEGORY SELECTOR TABS --- */}
      <div className="flex flex-row justify-center gap-2 mb-12 flex-wrap max-w-2xl mx-auto">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold border transition-all duration-200 focus:outline-none ${selectedCategory === cat.id ? 'bg-primary text-white border-primary shadow-sm' : 'bg-bg-light border-border text-text-muted hover:border-primary-light hover:text-primary'}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* --- SOFA GRID --- */}
      {filteredProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.slice(0, visibleLimit).map((product) => (
              <ProductCard 
                key={product._id} 
                product={product} 
              />
            ))}
          </div>

          {filteredProducts.length > visibleLimit && (
            <div className="mt-12 text-center animate-fade-in">
              <button 
                onClick={() => setVisibleLimit(prev => prev + 6)}
                className="bg-primary hover:bg-primary-light text-white text-xs font-bold py-3 px-8 rounded shadow-md tracking-wider transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none"
              >
                View More Products
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 border border-dashed border-border rounded-md bg-white">
          <span className="block text-4xl mb-4">🛋</span>
          <h3 className="text-lg font-bold font-display text-primary mb-2">No Sofas Found</h3>
          <p className="text-xs text-text-muted max-w-sm mx-auto mb-6">
            We are currently updating our catalogue for this sofa category. Check back soon or contact the factory directly.
          </p>
          <button 
            onClick={() => setSelectedCategory('all')}
            className="bg-primary text-white font-bold text-xs py-2.5 px-6 rounded-sm hover:bg-primary-light transition-colors focus:outline-none"
          >
            Show All Sofas
          </button>
        </div>
      )}

    </div>
  );
};

export default Sofas;
