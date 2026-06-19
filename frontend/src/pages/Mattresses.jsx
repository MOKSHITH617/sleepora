import React, { useState, useEffect } from 'react';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import MetaTags from '../components/MetaTags';

const Mattresses = () => {
  const [products, setProducts] = useState([]);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedCore, setSelectedCore] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [selectedThickness, setSelectedThickness] = useState('all');
  const [maxPrice, setMaxPrice] = useState(25000);
  const [sortBy, setSortBy] = useState('featured');
  const [visibleLimit, setVisibleLimit] = useState(6);
  
  // Responsive States
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isTabletFilterExpanded, setIsTabletFilterExpanded] = useState(true);

  useEffect(() => {
    setVisibleLimit(6);
  }, [selectedCore, selectedSize, selectedThickness, maxPrice, sortBy]);

  useEffect(() => {
    const fetchMattressData = async () => {
      try {
        const productsRes = await API.get('/products?category=mattress');
        if (productsRes.data?.products) setProducts(productsRes.data.products);

        const configRes = await API.get('/configs/mattress');
        if (configRes.data?.config) setConfig(configRes.data.config);
      } catch (err) {
        console.error('Failed to load mattresses catalog:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMattressData();
  }, []);

  const handleResetFilters = () => {
    setSelectedCore('all');
    setSelectedSize('all');
    setSelectedThickness('all');
    setMaxPrice(25000);
    setSortBy('featured');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Filter Logic
  const filteredProducts = products.filter(product => {
    const matchesCore = selectedCore === 'all' || product.mattressCoreType === selectedCore;
    
    // Bed Size Filter: mattresses support all sizes since they are custom made to order.
    // Otherwise check specifications.
    const matchesSize = selectedSize === 'all' || 
      (product.category === 'mattress' && ['single', 'double', 'queen', 'king', 'custom'].includes(selectedSize.toLowerCase())) ||
      (product.specifications && JSON.stringify(product.specifications).toLowerCase().includes(selectedSize.toLowerCase()));
      
    const matchesThickness = selectedThickness === 'all' || 
      (product.specifications && JSON.stringify(product.specifications).toLowerCase().includes(selectedThickness.replace('-inch', '').toLowerCase()));

    const matchesPrice = product.basePrice >= 2000 && product.basePrice <= maxPrice;

    return matchesCore && matchesSize && matchesThickness && matchesPrice;
  });

  // Sort Logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low-to-high') {
      return a.basePrice - b.basePrice;
    } else if (sortBy === 'price-high-to-low') {
      return b.basePrice - a.basePrice;
    } else if (sortBy === 'most-popular') {
      return b.reviewsCount - a.reviewsCount;
    } else if (sortBy === 'highest-rated') {
      return b.ratings - a.ratings;
    } else {
      // featured
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return 0;
    }
  });

  // UI rendering functions
  const renderCoreFilters = () => {
    const options = [
      { value: 'all', label: 'All Materials' },
      { value: 'ortho', label: 'Memory Foam' },
      { value: 'latex', label: 'Natural Latex' },
      { value: 'spring', label: 'Pocket Spring' },
      { value: 'coir', label: 'Coir' },
      { value: 'dual', label: 'Hybrid' },
    ];
    return (
      <div className="flex flex-col gap-2">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2.5 text-xs text-text-muted hover:text-primary cursor-pointer font-medium">
            <input
              type="radio"
              name="core-filter"
              value={opt.value}
              checked={selectedCore === opt.value}
              onChange={() => setSelectedCore(opt.value)}
              className="w-4 h-4 text-accent border-border focus:ring-accent cursor-pointer accent-accent"
            />
            <span className={selectedCore === opt.value ? 'text-primary font-bold' : ''}>
              {opt.label}
            </span>
          </label>
        ))}
      </div>
    );
  };

  const renderCoreFiltersInline = () => (
    <select
      value={selectedCore}
      onChange={(e) => setSelectedCore(e.target.value)}
      className="w-full bg-bg-light border border-border rounded py-1.5 px-3 text-xs font-semibold focus:outline-none focus:border-accent text-primary cursor-pointer hover:bg-white transition-colors"
    >
      <option value="all">All Materials</option>
      <option value="ortho">Memory Foam</option>
      <option value="latex">Natural Latex</option>
      <option value="spring">Pocket Spring</option>
      <option value="coir">Coir</option>
      <option value="dual">Hybrid</option>
    </select>
  );

  const renderSizeFilters = () => {
    const options = [
      { value: 'all', label: 'All Sizes' },
      { value: 'single', label: 'Single Bed' },
      { value: 'double', label: 'Double Bed' },
      { value: 'queen', label: 'Queen Size' },
      { value: 'king', label: 'King Size' },
      { value: 'custom', label: 'Custom Sizes' },
    ];
    return (
      <div className="flex flex-col gap-2">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2.5 text-xs text-text-muted hover:text-primary cursor-pointer font-medium">
            <input
              type="radio"
              name="size-filter"
              value={opt.value}
              checked={selectedSize === opt.value}
              onChange={() => setSelectedSize(opt.value)}
              className="w-4 h-4 text-accent border-border focus:ring-accent cursor-pointer accent-accent"
            />
            <span className={selectedSize === opt.value ? 'text-primary font-bold' : ''}>
              {opt.label}
            </span>
          </label>
        ))}
      </div>
    );
  };

  const renderSizeFiltersInline = () => (
    <select
      value={selectedSize}
      onChange={(e) => setSelectedSize(e.target.value)}
      className="w-full bg-bg-light border border-border rounded py-1.5 px-3 text-xs font-semibold focus:outline-none focus:border-accent text-primary cursor-pointer hover:bg-white transition-colors"
    >
      <option value="all">All Sizes</option>
      <option value="single">Single Bed</option>
      <option value="double">Double Bed</option>
      <option value="queen">Queen Size</option>
      <option value="king">King Size</option>
      <option value="custom">Custom Sizes</option>
    </select>
  );

  const renderThicknessFilters = () => {
    const options = [
      { value: 'all', label: 'All Thicknesses' },
      { value: '4-inch', label: '4 inch' },
      { value: '5-inch', label: '5 inch' },
      { value: '6-inch', label: '6 inch' },
      { value: '8-inch', label: '8 inch' },
      { value: '10-inch', label: '10 inch' },
    ];
    return (
      <div className="flex flex-col gap-2">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2.5 text-xs text-text-muted hover:text-primary cursor-pointer font-medium">
            <input
              type="radio"
              name="thickness-filter"
              value={opt.value}
              checked={selectedThickness === opt.value}
              onChange={() => setSelectedThickness(opt.value)}
              className="w-4 h-4 text-accent border-border focus:ring-accent cursor-pointer accent-accent"
            />
            <span className={selectedThickness === opt.value ? 'text-primary font-bold' : ''}>
              {opt.label}
            </span>
          </label>
        ))}
      </div>
    );
  };

  const renderThicknessFiltersInline = () => (
    <select
      value={selectedThickness}
      onChange={(e) => setSelectedThickness(e.target.value)}
      className="w-full bg-bg-light border border-border rounded py-1.5 px-3 text-xs font-semibold focus:outline-none focus:border-accent text-primary cursor-pointer hover:bg-white transition-colors"
    >
      <option value="all">All Thicknesses</option>
      <option value="4-inch">4 inch</option>
      <option value="5-inch">5 inch</option>
      <option value="6-inch">6 inch</option>
      <option value="8-inch">8 inch</option>
      <option value="10-inch">10 inch</option>
    </select>
  );

  const renderPriceSlider = () => {
    return (
      <div className="flex flex-col gap-2">
        <input
          type="range"
          min="2000"
          max="25000"
          step="500"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-accent"
        />
        <div className="flex justify-between items-center text-[10.5px] font-bold text-primary">
          <span>₹2,000</span>
          <span className="text-accent bg-accent-light px-2 py-0.5 rounded border border-accent/20">
            Max: ₹{maxPrice.toLocaleString('en-IN')}
          </span>
          <span>₹25,000</span>
        </div>
      </div>
    );
  };

  const renderResetButtons = () => {
    const hasActiveFilters = selectedCore !== 'all' || selectedSize !== 'all' || selectedThickness !== 'all' || maxPrice !== 25000 || sortBy !== 'featured';
    return (
      <div className="flex gap-2">
        <button
          onClick={handleResetFilters}
          disabled={!hasActiveFilters}
          className={`text-[11px] font-bold py-1 px-2.5 rounded border transition-all select-none ${hasActiveFilters ? 'text-accent border-accent hover:bg-accent-light cursor-pointer' : 'text-text-muted/50 border-border/50 cursor-not-allowed'}`}
        >
          Reset Filters
        </button>
        <button
          onClick={handleResetFilters}
          disabled={!hasActiveFilters}
          className={`text-[11px] font-bold py-1 px-2.5 rounded border transition-all select-none ${hasActiveFilters ? 'text-primary border-primary hover:bg-bg-light cursor-pointer' : 'text-text-muted/50 border-border/50 cursor-not-allowed'}`}
        >
          Clear All
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12 select-none">
      <MetaTags 
        title="Explore Mattress Collection | Factory Direct Mattresses"
        description="Browse our range of Ortho-Memory Foam, Premium Natural Latex, Hybrid Pocket Spring, Dual Comfort, and Coconut Coir mattresses. Handcrafted to order."
      />

      <div className="text-center max-w-[650px] mx-auto mb-8">
        <span className="text-xs font-bold text-accent uppercase tracking-wider mb-2 inline-block">TimeWell Catalogue</span>
        <h1 className="text-2.5xl md:text-3xl font-extrabold font-display mb-3">Explore Our Premium Mattress Range</h1>
        <p className="text-xs text-text-muted leading-relaxed">
          Filter by core support layers or dimensions to find the perfect mattress tailored for your posture and back support.
        </p>
      </div>

      {/* Mobile & Tablet Toggle Controls Bar */}
      <div className="flex md:hidden justify-between items-center bg-white border border-border rounded-lg p-3.5 mb-6 shadow-sm">
        <button
          onClick={() => setIsMobileDrawerOpen(true)}
          className="flex items-center gap-2 bg-primary text-white text-xs font-bold py-2.5 px-4 rounded hover:bg-primary-light transition-colors focus:outline-none"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h6V7h-6V5h-2v6h2V9z"/>
          </svg>
          Filters
        </button>
        <div className="text-text-muted font-semibold text-xs">
          Showing <strong className="text-primary font-extrabold">{sortedProducts.length}</strong> Products
        </div>
      </div>

      {/* Tablet Collapsible Trigger */}
      <div className="hidden md:flex lg:hidden justify-between items-center bg-white border border-border rounded-lg p-3.5 mb-6 shadow-sm">
        <button
          onClick={() => setIsTabletFilterExpanded(!isTabletFilterExpanded)}
          className="flex items-center gap-2 bg-bg-light border border-border text-primary text-xs font-bold py-2 px-3.5 rounded hover:bg-white transition-colors focus:outline-none"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h6V7h-6V5h-2v6h2V9z"/>
          </svg>
          {isTabletFilterExpanded ? 'Hide Filters' : 'Show Filters'}
        </button>
        <div className="text-text-muted font-semibold text-xs">
          Showing <strong className="text-primary font-extrabold">{sortedProducts.length}</strong> Products
        </div>
      </div>

      {/* Tablet Collapsible Filter Panel */}
      {isTabletFilterExpanded && (
        <div className="hidden md:block lg:hidden bg-white border border-border rounded-lg p-5 mb-6 shadow-sm animate-fade-in">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">Core Material</h4>
              {renderCoreFiltersInline()}
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">Bed Size</h4>
              {renderSizeFiltersInline()}
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">Thickness</h4>
              {renderThicknessFiltersInline()}
            </div>
          </div>
          <div className="border-t border-border mt-4 pt-4 flex justify-between items-center gap-6">
            <div className="flex-grow">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Price Range</h4>
              {renderPriceSlider()}
            </div>
            <div className="flex gap-3 mt-4">
              {renderResetButtons()}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Desktop Left Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 bg-white border border-border rounded-lg p-5 shadow-sm sticky top-[100px]">
          <div className="flex justify-between items-center mb-5 pb-3 border-b border-border">
            <h3 className="font-display font-bold text-sm text-primary uppercase tracking-wider">Filters</h3>
            <div className="flex gap-2">
              {renderResetButtons()}
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-primary mb-3">Core Material</h4>
              {renderCoreFilters()}
            </div>
            
            <div className="border-t border-border pt-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-primary mb-3">Bed Size</h4>
              {renderSizeFilters()}
            </div>
            
            <div className="border-t border-border pt-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-primary mb-3">Thickness</h4>
              {renderThicknessFilters()}
            </div>
            
            <div className="border-t border-border pt-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-primary mb-3">Price Range</h4>
              {renderPriceSlider()}
            </div>
          </div>
        </aside>

        {/* Right side Products Grid */}
        <div className="col-span-1 lg:col-span-3">
          
          {/* Product Grid Header */}
          <div className="hidden md:flex justify-between items-center mb-6">
            <div className="text-text-muted text-xs font-semibold lg:block hidden">
              Showing <strong className="text-primary font-extrabold">{sortedProducts.length}</strong> Products
            </div>
            <div className="text-text-muted text-xs font-semibold lg:hidden block">
              {/* Spacer */}
            </div>
            
            <div className="flex items-center gap-2 text-xs">
              <span className="text-text-muted font-bold">Sort By</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-border rounded py-1.5 px-3 text-xs font-semibold focus:outline-none focus:border-accent text-primary cursor-pointer hover:border-accent/40 transition-colors shadow-xs"
              >
                <option value="featured">Featured</option>
                <option value="price-low-to-high">Price Low To High</option>
                <option value="price-high-to-low">Price High To Low</option>
                <option value="most-popular">Most Popular</option>
                <option value="highest-rated">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Mobile Sort Dropdown Bar */}
          <div className="flex md:hidden justify-between items-center mb-4 text-xs">
            <div className="flex items-center gap-1.5 w-full">
              <span className="text-text-muted font-bold whitespace-nowrap">Sort By</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-white border border-border rounded py-2 px-3 text-xs font-semibold focus:outline-none focus:border-accent text-primary cursor-pointer transition-colors shadow-xs"
              >
                <option value="featured">Featured</option>
                <option value="price-low-to-high">Price Low To High</option>
                <option value="price-high-to-low">Price High To Low</option>
                <option value="most-popular">Most Popular</option>
                <option value="highest-rated">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Product Cards Grid */}
          {sortedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.slice(0, visibleLimit).map((product) => (
                  <ProductCard 
                    key={product._id} 
                    product={product} 
                    mattressConfig={config} 
                  />
                ))}
              </div>

              {sortedProducts.length > visibleLimit && (
                <div className="mt-8 text-center animate-fade-in">
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
              <span className="block text-4xl mb-4">🔍</span>
              <h3 className="text-lg font-bold font-display text-primary mb-2">No Matching Mattresses Found</h3>
              <p className="text-xs text-text-muted max-w-sm mx-auto mb-6">
                Try adjusting your specifications or reset filters to see all available factory direct mattresses.
              </p>
              <button 
                onClick={handleResetFilters}
                className="bg-primary text-white font-bold text-xs py-2.5 px-6 rounded-sm hover:bg-primary-light transition-colors focus:outline-none"
              >
                Show All Products
              </button>
            </div>
          )}

        </div>
      </div>

      {/* --- MOBILE SLIDE-IN FILTER DRAWER --- */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-[2000] flex block md:hidden animate-fade-in">
          {/* Backdrop overlay */}
          <div 
            onClick={() => setIsMobileDrawerOpen(false)}
            className="absolute inset-0 bg-black/55 backdrop-blur-xs transition-opacity duration-300"
          ></div>
          
          {/* Drawer Menu */}
          <div className="relative w-4/5 max-w-[320px] h-full bg-white shadow-xl flex flex-col z-10 animate-slide-in">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-border">
              <h3 className="font-display font-bold text-sm text-primary uppercase tracking-wider">Filters</h3>
              <button 
                onClick={() => setIsMobileDrawerOpen(false)}
                className="text-primary hover:text-accent font-bold text-lg focus:outline-none"
              >
                &times;
              </button>
            </div>
            
            {/* Scrollable Filters */}
            <div className="flex-grow overflow-y-auto p-4 space-y-6 select-none">
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-primary mb-3">Core Material</h4>
                {renderCoreFilters()}
              </div>
              
              <div className="border-t border-border pt-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-primary mb-3">Bed Size</h4>
                {renderSizeFilters()}
              </div>
              
              <div className="border-t border-border pt-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-primary mb-3">Thickness</h4>
                {renderThicknessFilters()}
              </div>
              
              <div className="border-t border-border pt-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-primary mb-3">Price Range</h4>
                {renderPriceSlider()}
              </div>
            </div>
            
            {/* Footer Buttons */}
            <div className="p-4 border-t border-border bg-bg-light flex gap-3">
              <button
                onClick={() => {
                  handleResetFilters();
                  setIsMobileDrawerOpen(false);
                }}
                className="flex-1 bg-border text-primary font-bold text-xs py-3 rounded text-center transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="flex-1 bg-primary text-white font-bold text-xs py-3 rounded text-center transition-colors hover:bg-primary-light"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mattresses;
