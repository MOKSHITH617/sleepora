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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWarranty, setSelectedWarranty] = useState('all');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [visibleLimit, setVisibleLimit] = useState(6);

  // Responsive States
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isTabletFilterExpanded, setIsTabletFilterExpanded] = useState(true);

  useEffect(() => {
    setVisibleLimit(6);
  }, [selectedCore, selectedSize, selectedThickness, maxPrice, sortBy, searchTerm, selectedWarranty, onlyAvailable]);

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
    setSearchTerm('');
    setSelectedWarranty('all');
    setOnlyAvailable(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-[#7C5F43] border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // Filter Logic
  const filteredProducts = products.filter(product => {
    const matchesCore = selectedCore === 'all' || product.mattressCoreType === selectedCore;

    const matchesSize = selectedSize === 'all' ||
      (product.category === 'mattress' && ['single', 'double', 'queen', 'king', 'custom'].includes(selectedSize.toLowerCase())) ||
      (product.specifications && JSON.stringify(product.specifications).toLowerCase().includes(selectedSize.toLowerCase()));

    const matchesThickness = selectedThickness === 'all' ||
      (product.specifications && JSON.stringify(product.specifications).toLowerCase().includes(selectedThickness.replace('-inch', '').toLowerCase()));

    const matchesPrice = product.basePrice >= 2000 && product.basePrice <= maxPrice;

    const matchesSearch = searchTerm.trim() === '' ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesWarranty = selectedWarranty === 'all' ||
      (product.specifications && JSON.stringify(product.specifications).toLowerCase().includes(selectedWarranty.toLowerCase()));

    const matchesAvailability = !onlyAvailable || product.isAvailable;

    return matchesCore && matchesSize && matchesThickness && matchesPrice && matchesSearch && matchesWarranty && matchesAvailability;
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

  const hasActiveFilters = selectedCore !== 'all' || selectedSize !== 'all' || selectedThickness !== 'all' || maxPrice !== 25000 || sortBy !== 'featured' || searchTerm !== '' || selectedWarranty !== 'all' || onlyAvailable;

  const renderResetButtons = () => {
    return (
      <div className="flex gap-2">
        <button
          onClick={handleResetFilters}
          disabled={!hasActiveFilters}
          className={`text-[10px] font-bold py-1 px-3 border uppercase tracking-wider transition-all select-none ${hasActiveFilters ? 'text-[#7C5F43] border-[#7C5F43] hover:bg-[#FAF5EF] cursor-pointer' : 'text-stone-300 border-stone-200 cursor-not-allowed'}`}
        >
          Clear All
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-[1480px] mx-auto px-6 pt-10 pb-[25px] select-none bg-[#FAF8F5]">
      <MetaTags
        title="Explore Mattress Collection | Factory Direct Mattresses"
        description="Browse our range of Ortho-Memory Foam, Premium Natural Latex, Hybrid Pocket Spring, Dual Comfort, and Coconut Coir mattresses. Handcrafted to order."
      />

      <div className="text-center max-w-[650px] mx-auto mb-4 animate-fade-in">
        <span className="text-xs font-bold text-[#7C5F43] uppercase tracking-[2px] mb-3 inline-block">TimeWell Catalogue</span>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#2A211D] mb-4">Explore Our Premium Mattress Range</h1>
        <p className="text-[13px] text-[#8E7D75] leading-relaxed">
          Filter by core support layers or dimensions to find the perfect mattress tailored for your posture and back support.
        </p>
      </div>

      {/* Mobile & Tablet Toggle Controls Bar */}
      <div className="flex lg:hidden justify-between items-center bg-white border border-[#EADFC9]/40 p-4 mb-8 shadow-sm">
        <button
          onClick={() => setIsMobileDrawerOpen(true)}
          className="flex items-center gap-2 bg-[#7C5F43] text-white text-xs font-bold py-2.5 px-5 uppercase tracking-wider hover:bg-[#5F4630] transition-colors focus:outline-none"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h6V7h-6V5h-2v6h2V9z" />
          </svg>
          Filters
        </button>
        <div className="text-[#8E7D75] font-semibold text-xs">
          Showing <strong className="text-[#2A211D]">{sortedProducts.length}</strong> Products
        </div>
      </div>

      {/* Main Content Grid Area */}
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-[28px] items-start">

        {/* Desktop Left Sidebar Filters */}
        <aside className="hidden lg:block bg-white border border-[#E6DED2] p-6 rounded-[16px] shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_16px_40px_rgba(42,33,29,0.04)] hover:border-[#C7A36B]/40 transition-all duration-300 sticky top-[100px]">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#EADFC9]/30">
            <h3 className="font-serif font-bold text-sm text-[#2A211D] uppercase tracking-wider select-none">Filters</h3>
            {renderResetButtons()}
          </div>

          <div className="space-y-[18px]">
            {/* Search */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#7C5F43] mb-3">Search</h4>
              <input
                type="text"
                placeholder="Search mattresses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#FAF5EF] border border-[#EADFC9]/60 rounded-md py-2 px-3 text-xs text-[#2A211D] placeholder-[#8E7D75] hover:border-[#7C5F43]/50 focus:outline-none focus:border-[#7C5F43] focus:ring-1 focus:ring-[#7C5F43]/30 transition-all duration-200"
              />
            </div>

            {/* Sort */}
            <div className="border-t border-[#EADFC9]/25 pt-4">
              <h4 className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#7C5F43] mb-3">Sort By</h4>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-[#FAF5EF] border border-[#EADFC9]/60 rounded-md py-2 px-3 text-xs font-semibold hover:border-[#7C5F43]/50 focus:outline-none focus:border-[#7C5F43] focus:ring-1 focus:ring-[#7C5F43]/30 text-[#2A211D] cursor-pointer transition-all duration-200"
              >
                <option value="featured">Featured</option>
                <option value="price-low-to-high">Price: Low to High</option>
                <option value="price-high-to-low">Price: High to Low</option>
                <option value="most-popular">Most Popular</option>
                <option value="highest-rated">Highest Rated</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="border-t border-[#EADFC9]/25 pt-4">
              <h4 className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#7C5F43] mb-3">Price Range</h4>
              <div className="flex flex-col gap-2">
                <input
                  type="range"
                  min="2000"
                  max="25000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-1 bg-[#EADFC9] rounded-lg appearance-none cursor-pointer accent-[#7C5F43]"
                />
                <div className="flex justify-between items-center text-[10px] font-bold text-[#8E7D75]">
                  <span>₹2,000</span>
                  <span className="text-[#7C5F43] bg-[#FAF5EF] px-2 py-0.5 border border-[#7C5F43]/15">
                    Max: ₹{maxPrice.toLocaleString('en-IN')}
                  </span>
                  <span>₹25,000</span>
                </div>
              </div>
            </div>

            {/* Core Type */}
            <div className="border-t border-[#EADFC9]/25 pt-4">
              <h4 className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#7C5F43] mb-3">Mattress Type</h4>
              <div className="flex flex-col gap-2.5">
                {[
                  { value: 'all', label: 'All Materials' },
                  { value: 'ortho', label: 'Memory Foam' },
                  { value: 'latex', label: 'Natural Latex' },
                  { value: 'spring', label: 'Pocket Spring' },
                  { value: 'coir', label: 'Coir' },
                  { value: 'dual', label: 'Hybrid' },
                ].map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2.5 text-xs text-[#8E7D75] hover:text-[#2A211D] cursor-pointer font-medium">
                    <input
                      type="radio"
                      name="core-filter-desktop"
                      value={opt.value}
                      checked={selectedCore === opt.value}
                      onChange={() => setSelectedCore(opt.value)}
                      className="w-4 h-4 text-[#7C5F43] border-[#EADFC9] focus:ring-[#7C5F43]/30 cursor-pointer accent-[#7C5F43] transition-all duration-200"
                    />
                    <span className={selectedCore === opt.value ? 'text-[#2A211D] font-bold' : ''}>
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="border-t border-[#EADFC9]/25 pt-4">
              <h4 className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#7C5F43] mb-3">Size</h4>
              <div className="flex flex-col gap-2.5">
                {[
                  { value: 'all', label: 'All Sizes' },
                  { value: 'single', label: 'Single Bed' },
                  { value: 'double', label: 'Double Bed' },
                  { value: 'queen', label: 'Queen Size' },
                  { value: 'king', label: 'King Size' },
                  { value: 'custom', label: 'Custom Sizes' },
                ].map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2.5 text-xs text-[#8E7D75] hover:text-[#2A211D] cursor-pointer font-medium">
                    <input
                      type="radio"
                      name="size-filter-desktop"
                      value={opt.value}
                      checked={selectedSize === opt.value}
                      onChange={() => setSelectedSize(opt.value)}
                      className="w-4 h-4 text-[#7C5F43] border-[#EADFC9] focus:ring-[#7C5F43]/30 cursor-pointer accent-[#7C5F43] transition-all duration-200"
                    />
                    <span className={selectedSize === opt.value ? 'text-[#2A211D] font-bold' : ''}>
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Thickness */}
            <div className="border-t border-[#EADFC9]/25 pt-4">
              <h4 className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#7C5F43] mb-3">Thickness</h4>
              <div className="flex flex-col gap-2.5">
                {[
                  { value: 'all', label: 'All Thicknesses' },
                  { value: '4-inch', label: '4 inch' },
                  { value: '5-inch', label: '5 inch' },
                  { value: '6-inch', label: '6 inch' },
                  { value: '8-inch', label: '8 inch' },
                  { value: '10-inch', label: '10 inch' },
                ].map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2.5 text-xs text-[#8E7D75] hover:text-[#2A211D] cursor-pointer font-medium">
                    <input
                      type="radio"
                      name="thickness-filter-desktop"
                      value={opt.value}
                      checked={selectedThickness === opt.value}
                      onChange={() => setSelectedThickness(opt.value)}
                      className="w-4 h-4 text-[#7C5F43] border-[#EADFC9] focus:ring-[#7C5F43]/30 cursor-pointer accent-[#7C5F43] transition-all duration-200"
                    />
                    <span className={selectedThickness === opt.value ? 'text-[#2A211D] font-bold' : ''}>
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Warranty */}
            <div className="border-t border-[#EADFC9]/25 pt-4">
              <h4 className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#7C5F43] mb-3">Warranty</h4>
              <div className="flex flex-col gap-2.5">
                {[
                  { value: 'all', label: 'All Warranties' },
                  { value: '5 year', label: '5 Years' },
                  { value: '7 year', label: '7 Years' },
                  { value: '10 year', label: '10 Years' },
                ].map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2.5 text-xs text-[#8E7D75] hover:text-[#2A211D] cursor-pointer font-medium">
                    <input
                      type="radio"
                      name="warranty-filter-desktop"
                      value={opt.value}
                      checked={selectedWarranty === opt.value}
                      onChange={() => setSelectedWarranty(opt.value)}
                      className="w-4 h-4 text-[#7C5F43] border-[#EADFC9] focus:ring-[#7C5F43]/30 cursor-pointer accent-[#7C5F43] transition-all duration-200"
                    />
                    <span className={selectedWarranty === opt.value ? 'text-[#2A211D] font-bold' : ''}>
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="border-t border-[#EADFC9]/25 pt-4">
              <h4 className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#7C5F43] mb-3">Availability</h4>
              <label className="flex items-center gap-2.5 text-xs text-[#8E7D75] hover:text-[#2A211D] cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                  className="w-4 h-4 text-[#7C5F43] border-[#EADFC9] rounded focus:ring-[#7C5F43]/30 cursor-pointer accent-[#7C5F43] transition-all duration-200"
                />
                <span className={onlyAvailable ? 'text-[#2A211D] font-bold' : ''}>
                  In Stock / Available Only
                </span>
              </label>
            </div>
          </div>
        </aside>

        {/* Right side Products Grid */}
        <div className="w-full">

          {/* Product Grid Header */}
          <div className="hidden lg:flex justify-between items-center mb-4 border-b border-[#EADFC9]/30 pb-3 text-xs">
            <div className="text-[#8E7D75] font-semibold">
              Showing <strong className="text-[#2A211D]">{sortedProducts.length}</strong> Premium Mattresses
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#8E7D75] font-bold uppercase tracking-wider text-[10px]">Sort By</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-[#EADFC9]/60 py-1 px-3 text-xs font-semibold focus:outline-none focus:border-[#7C5F43] text-[#2A211D] cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-low-to-high">Price: Low to High</option>
                <option value="price-high-to-low">Price: High to Low</option>
                <option value="most-popular">Most Popular</option>
                <option value="highest-rated">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Product Cards Grid */}
          {sortedProducts.length > 0 ? (
            <>
              <div className="premium-product-grid">
                {sortedProducts.slice(0, visibleLimit).map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    mattressConfig={config}
                  />
                ))}
              </div>

              {sortedProducts.length > visibleLimit && (
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
              <span className="block text-4xl mb-4">🔍</span>
              <h3 className="text-lg font-serif font-bold text-[#2A211D] mb-2">No Matching Mattresses Found</h3>
              <p className="text-xs text-[#8E7D75] max-w-sm mx-auto mb-6">
                Try adjusting your search terms or filter constraints to see all available factory direct mattresses.
              </p>
              <button
                onClick={handleResetFilters}
                className="bg-[#7C5F43] hover:bg-[#5F4630] text-white font-bold text-xs py-3 px-6 uppercase tracking-wider focus:outline-none"
              >
                Show All Products
              </button>
            </div>
          )}

        </div>
      </div>

      {/* --- MOBILE SLIDE-IN FILTER DRAWER --- */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-[2000] flex block lg:hidden animate-fade-in">
          {/* Backdrop overlay */}
          <div
            onClick={() => setIsMobileDrawerOpen(false)}
            className="absolute inset-0 bg-black/45 backdrop-blur-xs transition-opacity duration-300"
          ></div>

          {/* Drawer Menu */}
          <div className="relative w-4/5 max-w-[320px] h-full bg-[#FAF8F5] shadow-xl flex flex-col z-10 animate-slide-in border-r border-[#EADFC9]/30">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-[#EADFC9]/30 bg-white">
              <h3 className="font-serif font-bold text-sm text-[#2A211D] uppercase tracking-wider">Filters</h3>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="text-[#7C5F43] font-bold text-xl focus:outline-none"
              >
                &times;
              </button>
            </div>

            {/* Scrollable Filters */}
            <div className="flex-grow overflow-y-auto p-4 space-y-6 select-none bg-white">
              {/* Search */}
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#2A211D] mb-2.5">Search</h4>
                <input
                  type="text"
                  placeholder="Search mattresses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#FAF5EF] border border-[#EADFC9]/60 py-2 px-3 text-xs text-[#2A211D] placeholder-[#8E7D75] focus:outline-none focus:border-[#7C5F43]"
                />
              </div>

              {/* Core Material */}
              <div className="border-t border-[#EADFC9]/25 pt-4">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#2A211D] mb-3">Core Material</h4>
                <div className="flex flex-col gap-2">
                  {[
                    { value: 'all', label: 'All Materials' },
                    { value: 'ortho', label: 'Memory Foam' },
                    { value: 'latex', label: 'Natural Latex' },
                    { value: 'spring', label: 'Pocket Spring' },
                    { value: 'coir', label: 'Coir' },
                    { value: 'dual', label: 'Hybrid' },
                  ].map((opt) => (
                    <label key={opt.value} className="flex items-center gap-2.5 text-xs text-[#8E7D75] hover:text-[#2A211D] cursor-pointer">
                      <input
                        type="radio"
                        name="core-filter-mobile"
                        value={opt.value}
                        checked={selectedCore === opt.value}
                        onChange={() => setSelectedCore(opt.value)}
                        className="w-4 h-4 text-[#7C5F43] border-[#EADFC9] focus:ring-[#7C5F43] accent-[#7C5F43]"
                      />
                      <span className={selectedCore === opt.value ? 'text-[#2A211D] font-bold' : ''}>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Bed Size */}
              <div className="border-t border-[#EADFC9]/25 pt-4">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#2A211D] mb-3">Bed Size</h4>
                <div className="flex flex-col gap-2">
                  {[
                    { value: 'all', label: 'All Sizes' },
                    { value: 'single', label: 'Single Bed' },
                    { value: 'double', label: 'Double Bed' },
                    { value: 'queen', label: 'Queen Size' },
                    { value: 'king', label: 'King Size' },
                    { value: 'custom', label: 'Custom Sizes' },
                  ].map((opt) => (
                    <label key={opt.value} className="flex items-center gap-2.5 text-xs text-[#8E7D75] hover:text-[#2A211D] cursor-pointer">
                      <input
                        type="radio"
                        name="size-filter-mobile"
                        value={opt.value}
                        checked={selectedSize === opt.value}
                        onChange={() => setSelectedSize(opt.value)}
                        className="w-4 h-4 text-[#7C5F43] border-[#EADFC9] focus:ring-[#7C5F43] accent-[#7C5F43]"
                      />
                      <span className={selectedSize === opt.value ? 'text-[#2A211D] font-bold' : ''}>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Thickness */}
              <div className="border-t border-[#EADFC9]/25 pt-4">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#2A211D] mb-3">Thickness</h4>
                <div className="flex flex-col gap-2">
                  {[
                    { value: 'all', label: 'All Thicknesses' },
                    { value: '4-inch', label: '4 inch' },
                    { value: '5-inch', label: '5 inch' },
                    { value: '6-inch', label: '6 inch' },
                    { value: '8-inch', label: '8 inch' },
                    { value: '10-inch', label: '10 inch' },
                  ].map((opt) => (
                    <label key={opt.value} className="flex items-center gap-2.5 text-xs text-[#8E7D75] hover:text-[#2A211D] cursor-pointer">
                      <input
                        type="radio"
                        name="thickness-filter-mobile"
                        value={opt.value}
                        checked={selectedThickness === opt.value}
                        onChange={() => setSelectedThickness(opt.value)}
                        className="w-4 h-4 text-[#7C5F43] border-[#EADFC9] focus:ring-[#7C5F43] accent-[#7C5F43]"
                      />
                      <span className={selectedThickness === opt.value ? 'text-[#2A211D] font-bold' : ''}>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Warranty */}
              <div className="border-t border-[#EADFC9]/25 pt-4">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#2A211D] mb-3">Warranty</h4>
                <div className="flex flex-col gap-2">
                  {[
                    { value: 'all', label: 'All Warranties' },
                    { value: '5 year', label: '5 Years' },
                    { value: '7 year', label: '7 Years' },
                    { value: '10 year', label: '10 Years' },
                  ].map((opt) => (
                    <label key={opt.value} className="flex items-center gap-2.5 text-xs text-[#8E7D75] hover:text-[#2A211D] cursor-pointer">
                      <input
                        type="radio"
                        name="warranty-filter-mobile"
                        value={opt.value}
                        checked={selectedWarranty === opt.value}
                        onChange={() => setSelectedWarranty(opt.value)}
                        className="w-4 h-4 text-[#7C5F43] border-[#EADFC9] focus:ring-[#7C5F43] accent-[#7C5F43]"
                      />
                      <span className={selectedWarranty === opt.value ? 'text-[#2A211D] font-bold' : ''}>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="border-t border-[#EADFC9]/25 pt-4">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#2A211D] mb-3">Price Range</h4>
                <div className="flex flex-col gap-2">
                  <input
                    type="range"
                    min="2000"
                    max="25000"
                    step="500"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full h-1 bg-[#EADFC9] rounded-lg appearance-none cursor-pointer accent-[#7C5F43]"
                  />
                  <div className="flex justify-between items-center text-[10px] font-bold text-[#8E7D75]">
                    <span>₹2,000</span>
                    <span className="text-[#7C5F43]">Max: ₹{maxPrice.toLocaleString('en-IN')}</span>
                    <span>₹25,000</span>
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div className="border-t border-[#EADFC9]/25 pt-4">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#2A211D] mb-3">Availability</h4>
                <label className="flex items-center gap-2.5 text-xs text-[#8E7D75] hover:text-[#2A211D] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyAvailable}
                    onChange={(e) => setOnlyAvailable(e.target.checked)}
                    className="w-4 h-4 text-[#7C5F43] border-[#EADFC9] focus:ring-[#7C5F43] accent-[#7C5F43]"
                  />
                  <span className={onlyAvailable ? 'text-[#2A211D] font-bold' : ''}>In Stock / Available Only</span>
                </label>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-4 border-t border-[#EADFC9]/30 bg-[#FAF8F5] flex gap-3">
              <button
                onClick={() => {
                  handleResetFilters();
                  setIsMobileDrawerOpen(false);
                }}
                className="flex-1 bg-white border border-[#EADFC9] text-[#7C5F43] font-bold text-xs py-3 uppercase tracking-wider rounded-none text-center transition-colors"
              >
                Clear
              </button>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="flex-1 bg-[#7C5F43] text-white font-bold text-xs py-3 uppercase tracking-wider rounded-none text-center transition-colors hover:bg-[#5F4630]"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mattresses;
