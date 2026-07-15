import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

// Definition of 6 Premium Sofa Layout Types with descriptions and dynamic multipliers
const SOFA_TYPES = [
  { id: 'recliner', name: 'Recliner Sofa', desc: 'Premium comfort seat with reclining mechanism.', multiplier: 1.35, icon: '💺' },
  { id: '2-seater', name: '2 Seater', desc: 'Compact dual seating ideal for cosy spaces.', multiplier: 0.85, icon: '👥' },
  { id: '3-seater', name: '3 Seater', desc: 'Classic layout for standard family living rooms.', multiplier: 1.0, icon: '🛋️' },
  { id: 'corner', name: 'Corner Sofa', desc: 'Spacious L-shape design optimizing space coverage.', multiplier: 1.45, icon: '📐' },
  { id: 'custom-sofa', name: 'Custom Sofa', desc: 'Bespoke layouts tailored to floor measurements.', multiplier: 1.6, icon: '🛠️' }
];

// Definition of the 2 Fabric Quality Grades with price modifiers
const FABRIC_QUALITIES = [
  { id: 'standard', name: 'Standard Fabric', desc: 'Good quality and long lasting', modifier: 2500, text: 'Browse Standard Fabric Catalogue' },
  { id: 'premium', name: 'Premium Fabric', desc: 'Soft touch and premium feel', modifier: 6000, text: 'Browse Premium Fabric Catalogue' }
];

// Full fabric catalogue categorized by Quality Series
const FABRIC_CATALOG = {
  economy: [
    { code: 'E001', name: 'Desert Sand', finish: 'Linen Blend', color: '#E6D3B3', desc: 'Breathable linen canvas weave.' },
    { code: 'E002', name: 'Slate Grey', finish: 'Cotton Blend', color: '#707A8A', desc: 'Tough textured denim style cotton.' },
    { code: 'E003', name: 'Brick Red', finish: 'Polyester Canvas', color: '#A94442', desc: 'Warm color pop woven canvas.' },
    { code: 'E004', name: 'Ocean Blue', finish: 'Polyester Weave', color: '#2E6B9E', desc: 'Spun threads resistant to heavy use.' },
    { code: 'E005', name: 'Forest Green', finish: 'Woven Cotton', color: '#2E6F40', desc: 'Natural cotton canvas texture.' },
    { code: 'E006', name: 'Coal Black', finish: 'Durable Canvas', color: '#2B2B2B', desc: 'Heavy duty dark coal canvas weave.' }
  ],
  standard: [
    { code: 'S001', name: 'Pebble Beige', finish: 'Structured Weave', color: '#DCCEB0', desc: 'Soft textured multi-tone weave.' },
    { code: 'S002', name: 'Concrete Grey', finish: 'Polyester Linen', color: '#8A8A8A', desc: 'Neutral grey blend with fine luster.' },
    { code: 'S003', name: 'Terracotta Rust', finish: 'Soft Chenille', color: '#D35400', desc: 'Plush velvet-like chenille texture.' },
    { code: 'S004', name: 'Cobalt Blue', finish: 'Structured Canvas', color: '#1F4E79', desc: 'Heavy weight textured indigo canvas.' },
    { code: 'S005', name: 'Sage Green', finish: 'Cotton Linen', color: '#7D937B', desc: 'Muted earthy sage fibers weave.' },
    { code: 'S006', name: 'Mocha Brown', finish: 'Microfiber Suede', color: '#5C4033', desc: 'Stain resistant faux suede feel.' }
  ],
  premium: [
    { code: 'P001', name: 'Royal Beige', finish: 'Premium Velvet', color: '#E3D1B4', desc: 'High pile velvet with a golden sheen.' },
    { code: 'P002', name: 'Ash Grey', finish: 'Bouclé Cozy', color: '#A8A8A8', desc: 'Looped wool textured cozy upholstery.' },
    { code: 'P003', name: 'Olive Green', finish: 'Premium Velvet', color: '#556B2F', desc: 'Rich mossy velvet with deep shading.' },
    { code: 'P004', name: 'Navy Blue', finish: 'Classic Velvet', color: '#0F1E36', desc: 'Royal deep blue plush pile velvet.' },
    { code: 'P005', name: 'Mustard Gold', finish: 'Heavy Suede', color: '#E1AD01', desc: 'Exclusive soft textured micro-suede.' },
    { code: 'P006', name: 'Coral Pink', finish: 'Soft Plush Velvet', color: '#F08080', desc: 'Warm comforting coral plush velvet.' }
  ],
  luxury: [
    { code: 'L001', name: 'Oyster White', finish: 'Imported Bouclé', color: '#FDFDFD', desc: 'Italian looped wool luxury weave.' },
    { code: 'L002', name: 'Charcoal Tweed', finish: 'Luxury Wool Blend', color: '#3A3F44', desc: 'Warm Scottish style luxury tweed weave.' },
    { code: 'L003', name: 'Emerald Velvet', finish: 'High-pile Silk Velvet', color: '#097969', desc: 'Luxury deep jewel green silk velvet.' },
    { code: 'L004', name: 'Midnight Indigo', finish: 'Italian Luxury Velvet', color: '#10172A', desc: 'Ultra-plush imported Italian sapphire velvet.' },
    { code: 'L005', name: 'Cognac Leather', finish: 'Aniline Leather', color: '#8B4513', desc: 'Genuine breathable aniline hide finish.' },
    { code: 'L006', name: 'Tuscany Rust', finish: 'Belgian Linen', color: '#B24A23', desc: 'Pure imported Belgian organic linen.' }
  ]
};

// Render a detailed 3D perspective vector sofa illustration inside an SVG viewport
const renderSofaSVG = (colorHex, capacity) => {
  const cap = parseInt(capacity) || 3;
  
  // Seating interior is from X=46 to X=234. Width = 188.
  const W = 188 / cap;
  
  // We will generate the seat cushions
  const cushions = [];
  const highlights = [];
  const shadows = [];
  const seams = [];
  
  for (let i = 0; i < cap; i++) {
    const x = 46 + i * W;
    const cWidth = W - 1.5; // leaving a small gap
    
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
    <svg viewBox="0 0 280 150" className="w-full h-auto max-w-[260px] drop-shadow-[0_8px_20px_rgba(0,0,0,0.25)] select-none overflow-visible">
      {/* Background shadow glow */}
      <ellipse cx="140" cy="128" rx="100" ry="12" fill="rgba(0,0,0,0.3)" />

      {/* Wooden Legs */}
      <polygon points="45,120 52,135 60,135 55,120" fill="#4A3326" />
      <polygon points="225,120 228,135 220,135 215,120" fill="#4A3326" />
      <polygon points="65,120 68,130 73,130 71,120" fill="#3D291E" opacity="0.7" />
      <polygon points="205,120 207,130 212,130 210,120" fill="#3D291E" opacity="0.7" />

      {/* Bottom Base Frame (Wooden trim line) */}
      <rect x="42" y="112" width="196" height="8" rx="2" fill="#5C4033" stroke="#4A3326" strokeWidth="0.5"/>
      <rect x="42" y="104" width="196" height="8" fill={colorHex} />

      {/* Sofa Main Backrest Cushion */}
      <rect x="48" y="44" width="184" height="60" rx="8" fill={colorHex} />
      
      {/* Backrest details (vertical cushion seams) */}
      {seams}
      
      {/* Backrest shading (top highlight and bottom shade) */}
      <rect x="48" y="44" width="184" height="8" rx="4" fill="rgba(255,255,255,0.08)" />
      <rect x="48" y="96" width="184" height="8" rx="4" fill="rgba(0,0,0,0.15)" />

      {/* Main Seat Cushions */}
      {cushions}
      
      {/* Seat Cushions Shading & Highlights */}
      {highlights}
      {shadows}

      {/* Left Armrest */}
      <path d="M36,68 C36,60 48,60 48,68 L48,114 C48,118 36,118 36,114 Z" fill={colorHex} stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
      <path d="M38,70 C38,64 46,64 46,70 L46,112 C46,115 38,115 38,112 Z" fill="rgba(255,255,255,0.06)" />
      {/* Right Armrest */}
      <path d="M232,68 C232,60 244,60 244,68 L244,114 C244,118 232,118 232,114 Z" fill={colorHex} stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
      <path d="M234,70 C234,64 242,64 242,70 L242,112 C242,115 234,115 234,112 Z" fill="rgba(255,255,255,0.06)" />

      {/* Depth shading highlight overlays */}
      <path d="M48,50 L232,50" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" fill="none"/>
      <path d="M38,68 L46,68" stroke="rgba(255,255,255,0.25)" strokeWidth="1" fill="none"/>
      <path d="M234,68 L242,68" stroke="rgba(255,255,255,0.25)" strokeWidth="1" fill="none"/>
    </svg>
  );
};

const SofaConfigurator = ({ config, defaultProduct }) => {
  const navigate = useNavigate();

  // Basic layout selection states
  const [selectedType, setSelectedType] = useState('3 Seater');
  const [selectedCapacity, setSelectedCapacity] = useState(3);
  const [selectedQuality, setSelectedQuality] = useState('premium'); // fabric quality key
  const [selectedFabric, setSelectedFabric] = useState(FABRIC_CATALOG.premium[0]); // full active fabric object
  
  // Fabric Search, Filter, Modal states
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [catalogPage, setCatalogPage] = useState(1);
  const [leadLoading, setLeadLoading] = useState(false);

  // Initialize defaults
  useEffect(() => {
    if (config) {
      if (defaultProduct) {
        const typeName = defaultProduct.sofaCategory === 'l-shape' ? 'Corner Sofa' : 
                         defaultProduct.sofaCategory === 'recliner' ? 'Recliner Sofa' : 
                         defaultProduct.sofaCategory === '2-seater' ? '2 Seater' : 
                         defaultProduct.sofaCategory === '3-seater' ? '3 Seater' : 
                         defaultProduct.sofaCategory === 'corner' ? 'Corner Sofa' : 'Custom Sofa';
        setSelectedType(typeName);
        
        const cap = defaultProduct.sofaCategory === '2-seater' ? 2 : 
                    defaultProduct.sofaCategory === '3-seater' ? 3 : 
                    defaultProduct.sofaCategory === 'l-shape' ? 5 : 5;
        setSelectedCapacity(cap);
      }
    }
  }, [config, defaultProduct]);

  if (!config) return <div className="text-center py-10 font-bold">Loading Sofa Configurator...</div>;

  // Calculate pricing based on dynamic selections
  const basePrice = defaultProduct ? defaultProduct.basePrice : 16500;
  const typeObj = SOFA_TYPES.find(t => t.name === selectedType) || { multiplier: 1.0 };
  const capObj = config.seatingCapacities?.find(c => c.capacity === selectedCapacity) || { multiplier: 1.0 };
  
  // Price = (BasePrice * TypeMultiplier * CapacityMultiplier) + QualityPriceAdjustment
  const activeQualityData = FABRIC_QUALITIES.find(q => q.id === selectedQuality) || FABRIC_QUALITIES[1] || FABRIC_QUALITIES[0];
  const qualityPriceAdjustment = activeQualityData.modifier;
  
  const finalPrice = Math.round((basePrice * typeObj.multiplier * capObj.multiplier) + qualityPriceAdjustment);
  const retailMultiplier = defaultProduct ? defaultProduct.retailMultiplier : 2.0;
  const showroomPrice = Math.round(finalPrice * retailMultiplier);
  const savings = showroomPrice - finalPrice;
  const savingsPercent = Math.round((savings / showroomPrice) * 100);

  // WhatsApp Enquiry Lead Logging
  const handleWhatsAppBooking = async () => {
    setLeadLoading(true);
    const leadData = {
      name: 'Customer (Sofa Configurator)',
      phone: 'Unspecified',
      email: 'sofa_configurator@sleepora.com',
      productName: defaultProduct ? defaultProduct.name : 'Custom Configured Sofa',
      category: 'sofa',
      configuration: {
        sofaType: selectedType,
        seatingCapacity: `${selectedCapacity} Seater`,
        fabricQuality: activeQualityData.name,
        fabricCode: selectedFabric.code,
        fabricName: selectedFabric.name,
        fabricFinish: selectedFabric.finish
      },
      quotedPrice: finalPrice,
      message: 'Self-configured via premium luxury sofa configurator dashboard.'
    };

    try {
      await API.post('/leads', leadData);
    } catch (error) {
      console.error('Failed to log lead:', error);
    }

    setLeadLoading(false);

    const whatsappNumber = '919876543210';
    const textMsg = `Hello! I used your Interactive Sofa Configurator and would like to order:
- *Sofa Model*: ${defaultProduct ? defaultProduct.name : 'Customized Sofa'}
- *Layout*: ${selectedType}
- *Capacity*: ${selectedCapacity} Seater
- *Fabric Quality*: ${activeQualityData.name}
- *Fabric Code*: ${selectedFabric.code}
- *Fabric Name*: ${selectedFabric.name} (${selectedFabric.finish})
- *Direct Price*: ₹${finalPrice.toLocaleString('en-IN')}

Please guide me on delivery timelines and payment methods. Thank you!`;

    const encodedText = encodeURIComponent(textMsg);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedText}`, '_blank');
  };

  const handleCustomQuote = () => {
    navigate('/contact', {
      state: {
        productName: defaultProduct ? defaultProduct.name : 'Custom Sofa',
        category: 'sofa',
        configuration: {
          sofaType: selectedType,
          seatingCapacity: `${selectedCapacity} Seater`,
          fabricQuality: activeQualityData.name,
          fabricCode: selectedFabric.code,
          fabricName: selectedFabric.name,
          fabricFinish: selectedFabric.finish
        },
        price: finalPrice
      }
    });
  };

  // Change fabric quality helper
  const handleQualityChange = (qualityId) => {
    setSelectedQuality(qualityId);
    // Automatically select the first fabric in the new quality category catalog
    const firstFabric = FABRIC_CATALOG[qualityId][0];
    setSelectedFabric(firstFabric);
    setSearchText('');
    setSelectedFilter('All');
    setCatalogPage(1);
  };

  // Filter and search catalog items
  const activeCatalogList = FABRIC_CATALOG[selectedQuality] || FABRIC_CATALOG.premium;
  const filteredFabrics = activeCatalogList.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchText.toLowerCase()) || 
                          f.code.toLowerCase().includes(searchText.toLowerCase());
    
    if (selectedFilter === 'All') return matchesSearch;
    // Matches finishes such as Velvet, Linen, Bouclé, Cotton, Suede, etc.
    return matchesSearch && f.finish.toLowerCase().includes(selectedFilter.toLowerCase());
  });

  // Fabric finishes list
  const catalogFilters = ['All', 'Velvet', 'Linen', 'Bouclé', 'Cotton', 'Suede', 'Leather'];

  // Pagination parameters
  const itemsPerPage = 4;
  const totalPages = Math.ceil(filteredFabrics.length / itemsPerPage);
  const currentFabricsList = filteredFabrics.slice((catalogPage - 1) * itemsPerPage, catalogPage * itemsPerPage);

  return (
    <div className="relative pb-[76px] lg:pb-0">
      
      {/* Main Configurator Container Box */}
      <div className="bg-[#FFFDFC] rounded-[16px] border border-[#E0D8CE]/60 shadow-[0_10px_30px_rgba(32,23,18,0.05)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 animate-fade-in">
        
        {/* Left Side Spec Controls */}
        <div className="lg:col-span-7 p-5 md:p-8 flex flex-col justify-between select-none">
          <div>
            <h3 className="text-xl md:text-2xl font-serif font-bold text-[#201712] mb-1">Select Custom Specifications</h3>
            <p className="text-xs text-[#6D6258] mb-5">Customize sofa layout, seating capacity, fabric qualities, and swatches</p>

            {/* 1. Choose Sofa Type Layout (Selectable cards with descriptions) */}
            <div className="mb-5">
              <label className="block text-[10px] font-bold text-[#201712] uppercase tracking-[1.5px] mb-2.5">
                1. Choose Sofa Type / Layout
              </label>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-2.5">
                {SOFA_TYPES.map((t, idx) => {
                  const isSelected = selectedType === t.name;
                  const spanClass = idx < 3 ? 'col-span-1 md:col-span-2' : (idx === 3 ? 'col-span-1 md:col-span-3' : 'col-span-2 md:col-span-3');
                  return (
                    <label 
                      key={t.id}
                      className={`border p-3 flex flex-col justify-between cursor-pointer transition-all duration-200 select-none rounded-xl relative ${spanClass} ${
                        isSelected 
                          ? 'border-[#8B6844] bg-[#F4F1EC] shadow-sm' 
                          : 'border-[#E0D8CE]/60 bg-[#FFFDFC] hover:border-[#8B6844]/60'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="sofa-layout-type" 
                        value={t.name} 
                        checked={isSelected}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="hidden"
                      />
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-[#8B6844] text-white rounded-full flex items-center justify-center font-bold text-[8px] z-10 shadow-sm">
                          ✓
                        </div>
                      )}
                      <div>
                        <span className="text-xl mb-1.5 block">{t.icon}</span>
                        <span className="block font-serif font-bold text-xs text-[#201712] leading-tight mb-0.5">{t.name}</span>
                        <span className="block text-[9.5px] text-[#6D6258] leading-snug">{t.desc}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 2. Choose Seating Capacity */}
            <div className="mb-5">
              <label className="block text-[10px] font-bold text-[#201712] uppercase tracking-[1.5px] mb-2">
                2. Choose Seating Capacity
              </label>
              <div className="flex flex-row gap-2.5">
                {[2, 3, 5, 7].map((c) => {
                  const isSelected = selectedCapacity === c;
                  return (
                    <label 
                      key={c}
                      className={`flex-grow border py-2 px-4 text-center cursor-pointer transition-all duration-200 rounded-lg text-xs ${
                        isSelected 
                          ? 'border-[#8B6844] bg-[#F4F1EC] text-[#201712] font-bold shadow-sm' 
                          : 'border-[#E0D8CE]/60 bg-[#FFFDFC] text-[#6D6258] hover:border-[#8B6844]/60'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="sofa-seating-cap" 
                        value={c} 
                        checked={isSelected}
                        onChange={(e) => setSelectedCapacity(parseInt(e.target.value))}
                        className="hidden"
                      />
                      <span>{c} Seater</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 3. Fabric Quality (Economy, Standard, Premium, Luxury cards) */}
            <div className="mb-5">
              <label className="block text-[10px] font-bold text-[#201712] uppercase tracking-[1.5px] mb-2">
                3. Choose Fabric Quality
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-lg mx-auto">
                {FABRIC_QUALITIES.map((q) => {
                  const isSelected = selectedQuality === q.id;
                  return (
                    <label 
                      key={q.id}
                      className={`border p-3 flex flex-col justify-between cursor-pointer transition-all duration-200 select-none rounded-xl relative ${
                        isSelected 
                          ? 'border-[#8B6844] bg-[#F4F1EC] shadow-sm' 
                          : 'border-[#E0D8CE]/60 bg-[#FFFDFC] hover:border-[#8B6844]/60'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="sofa-fabric-quality" 
                        value={q.id} 
                        checked={isSelected}
                        onChange={() => handleQualityChange(q.id)}
                        className="hidden"
                      />
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-[#8B6844] text-white rounded-full flex items-center justify-center font-bold text-[8px] z-10 shadow-sm">
                          ✓
                        </div>
                      )}
                      <div>
                        <span className="block font-serif font-bold text-xs text-[#201712] leading-tight mb-0.5">{q.name}</span>
                        <span className="block text-[9.5px] text-[#6D6258] leading-snug mb-1">{q.desc}</span>
                        <span className="block text-[9px] font-bold text-[#8B6844]">
                          {q.modifier === 0 ? 'Base Rate' : `+₹${q.modifier.toLocaleString('en-IN')}`}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 4. Choose Fabric Colour (Browse Catalog Modal Button) */}
            <div className="mb-5 border-t border-[#E0D8CE]/40 pt-4">
              <label className="block text-[10px] font-bold text-[#201712] uppercase tracking-[1.5px] mb-2.5">
                4. Select Fabric Colour
              </label>
              
              <button
                onClick={() => setIsCatalogOpen(true)}
                className="w-full bg-[#F4F1EC] hover:bg-[#E0D8CE]/40 border border-[#8B6844]/40 text-[#8B6844] font-bold text-xs uppercase tracking-[1px] py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.99] focus:outline-none"
              >
                🎨 {activeQualityData.text}
              </button>
            </div>

            {/* 5. Selected Fabric Panel detail */}
            <div className="bg-[#F4F1EC] border border-[#E0D8CE]/60 p-4 rounded-xl">
              <span className="block text-[9px] font-bold uppercase tracking-[1px] text-[#8B6844] mb-2">Selected Fabric Upholstery</span>
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-lg border border-[#E0D8CE]/60 shadow-sm flex-shrink-0 relative overflow-hidden"
                  style={{ backgroundColor: selectedFabric.color }}
                >
                  {/* Subtle fabric structure lines pattern inside swatch */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%), linear-gradient(-45deg, #000 25%, transparent 25%)', backgroundSize: '4px 4px' }}></div>
                </div>
                
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="block text-xs font-bold text-[#201712]">{selectedFabric.code} - {selectedFabric.name}</span>
                      <span className="block text-[9.5px] text-[#6D6258]">Quality: {activeQualityData.name} &nbsp;•&nbsp; Finish: {selectedFabric.finish}</span>
                    </div>
                    
                    <button 
                      onClick={() => setIsCatalogOpen(true)}
                      className="text-[9px] text-[#8B6844] hover:underline font-bold focus:outline-none"
                    >
                      Change Selection
                    </button>
                  </div>
                  {activeQualityData.modifier > 0 && (
                    <span className="block text-[9.5px] text-[#8B6844] font-semibold mt-1">
                      Includes quality adjustment: +₹{activeQualityData.modifier.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>
            </div>

          </div>

          <button 
            onClick={handleCustomQuote}
            className="w-full border border-[#8B6844] text-[#8B6844] hover:bg-[#F4F1EC] bg-transparent text-[11px] font-bold py-2.5 rounded-lg tracking-wider uppercase transition-colors duration-200 mt-5 active:scale-[0.99] focus:outline-none"
          >
            Request Custom Shape / Dimension Quote
          </button>
        </div>

        {/* Right Side Visual Upholstery Live Preview & Pricing Summary Column */}
        <div className="lg:col-span-5 bg-[#201712] p-5 md:p-8 flex flex-col justify-between relative overflow-hidden border-t lg:border-t-0 lg:border-l border-[#E0D8CE]/20 min-h-[440px]">
          {/* Ambient background glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#8B6844]/10 blur-3xl pointer-events-none rounded-full"></div>

          <div className="mb-5 flex flex-col gap-4">
            <div>
              <span className="inline-block bg-[#8B6844] text-white font-bold text-[9px] uppercase tracking-[1.5px] py-1 px-2.5 rounded-md mb-2">
                Live Sofa Preview
              </span>
              <h4 className="text-xl font-serif font-bold text-[#F4F1EC] mb-1">{defaultProduct ? defaultProduct.name : 'Custom Sofa Layout'}</h4>
              <p className="text-xs text-[#E0D8CE]/80">Visualization of selected configuration and fabric shade</p>
            </div>

            {/* Live Sofa Cushion Color Binding visual block */}
            <div className="relative py-2 flex flex-col items-center justify-center min-h-[170px]">
              {renderSofaSVG(selectedFabric.color, selectedCapacity)}
              
              <div className="flex gap-2.5 mt-3 items-center bg-[#2B1F18]/90 border border-[#8B6844]/30 px-3 py-1.5 rounded-md text-[9.5px]">
                <div className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: selectedFabric.color }}></div>
                <span className="text-[#F4F1EC] font-medium">Upholstery: {selectedFabric.code} ({selectedFabric.name})</span>
              </div>
            </div>
          </div>

          {/* Pricing Summary Card */}
          <div className="bg-[#FFFDFC] border border-[#E0D8CE]/70 p-4 rounded-xl mt-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <h5 className="text-[9.5px] font-bold uppercase tracking-[1.5px] text-[#8B6844] mb-2 pb-1 border-b border-[#E0D8CE]/40">
              Configuration Summary
            </h5>
            <ul className="flex flex-col gap-1.5 text-xs text-[#6D6258] mb-4">
              <li className="flex justify-between">
                <span className="text-[#6D6258]">Sofa Layout:</span>
                <span className="font-semibold text-[#201712] truncate max-w-[125px]">{selectedType}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-[#6D6258]">Capacity:</span>
                <span className="font-semibold text-[#201712]">{selectedCapacity} Seater Layout</span>
              </li>
              <li className="flex justify-between">
                <span className="text-[#6D6258]">Fabric Quality:</span>
                <span className="font-semibold text-[#201712]">{activeQualityData.name}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-[#6D6258]">Fabric Code / Name:</span>
                <span className="font-semibold text-[#201712] truncate max-w-[140px]">{selectedFabric.code} - {selectedFabric.name}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-[#6D6258]">Fabric Finish:</span>
                <span className="font-semibold text-[#201712]">{selectedFabric.finish}</span>
              </li>
            </ul>
            
            <div className="flex justify-between items-end mb-3 border-t border-[#E0D8CE]/40 pt-2.5">
              <div>
                <span className="text-[8px] uppercase tracking-wider text-[#6D6258] font-bold block mb-0.5">Factory Price</span>
                <span className="text-2.5xl font-serif font-bold text-[#8B6844]">₹{finalPrice.toLocaleString('en-IN')}</span>
              </div>
              <span className="text-[9px] bg-[#F4F1EC] text-[#8B6844] font-bold px-2 py-0.5 border border-[#8B6844]/20 rounded-md">
                Save {savingsPercent}%
              </span>
            </div>
            
            <button
              onClick={handleWhatsAppBooking}
              disabled={leadLoading}
              className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-xs uppercase tracking-[1px] py-3.5 rounded-lg shadow-md flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.852.002-2.631-1.019-5.105-2.875-6.964-1.857-1.859-4.335-2.88-6.97-2.881-5.437 0-9.863 4.421-9.867 9.853-.001 1.73.457 3.419 1.323 4.913l-.973 3.555 3.648-.957z"/>
              </svg>
              Add To Inquiry
            </button>
            
            <span className="block text-center text-[9px] text-[#6D6258]/80 mt-1.5 font-medium">
              Get expert assistance on WhatsApp
            </span>
          </div>

        </div>

      </div>

      {/* Mobile/Tablet Sticky Bottom CTA Bar (Fixed to viewport) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#201712] border-t border-[#8B6844]/30 px-6 py-3.5 shadow-[0_-5px_25px_rgba(0,0,0,0.15)] flex justify-between items-center gap-4">
        <div>
          <span className="text-[8px] uppercase tracking-wider text-[#E0D8CE]/80 font-bold block mb-0.5">Factory Price</span>
          <span className="text-lg font-serif font-bold text-[#F4F1EC]">₹{finalPrice.toLocaleString('en-IN')}</span>
        </div>
        
        <button
          onClick={handleWhatsAppBooking}
          disabled={leadLoading}
          className="flex-grow max-w-[220px] bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-xs uppercase tracking-[1px] py-3.5 px-4 rounded-lg shadow-md flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] cursor-pointer"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.852.002-2.631-1.019-5.105-2.875-6.964-1.857-1.859-4.335-2.88-6.97-2.881-5.437 0-9.863 4.421-9.867 9.853-.001 1.73.457 3.419 1.323 4.913l-.973 3.555 3.648-.957z"/>
          </svg>
          Inquire via WhatsApp
        </button>
      </div>

      {/* 6. FABRIC CATALOGUE MODAL (Opens as fullscreen drawer on mobile, centered modal on desktop) */}
      {isCatalogOpen && (
        <div className="fixed inset-0 z-50 flex items-end lg:items-center lg:justify-center bg-black/60 backdrop-blur-xs select-none">
          {/* Backdrop Close Click */}
          <div className="absolute inset-0" onClick={() => setIsCatalogOpen(false)}></div>
          
          {/* Modal Card content wrapper */}
          <div className="w-full lg:max-w-2xl bg-white rounded-t-2xl lg:rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] overflow-hidden z-10 flex flex-col max-h-[85vh] lg:max-h-[80vh] animate-slide-up select-none">
            
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-[#E0D8CE]/60 flex justify-between items-center bg-[#F4F1EC] flex-shrink-0">
              <div>
                <h4 className="font-serif font-bold text-base text-[#201712]">{activeQualityData.name} Swatches</h4>
                <p className="text-[10px] text-[#6D6258]">Search and filter premium materials in the direct factory catalog</p>
              </div>
              <button 
                onClick={() => setIsCatalogOpen(false)}
                className="text-[#6D6258] hover:text-[#201712] font-bold text-xl p-1.5 focus:outline-none"
              >
                ✕
              </button>
            </div>

            {/* Catalog Filters and Search Section */}
            <div className="px-5 py-3 border-b border-[#E0D8CE]/40 flex flex-col gap-2.5 bg-[#FFFDFC] flex-shrink-0">
              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder="Search fabric name or code (e.g. P003)..."
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    setCatalogPage(1);
                  }}
                  className="flex-grow bg-[#F4F1EC] border border-[#E0D8CE]/60 rounded-lg px-3 py-1.5 text-xs text-[#201712] focus:outline-none focus:border-[#8B6844] font-semibold"
                />
              </div>

              {/* Category tabs filters */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {catalogFilters.map((filter) => {
                  const isFilterActive = selectedFilter === filter;
                  return (
                    <button
                      key={filter}
                      onClick={() => {
                        setSelectedFilter(filter);
                        setCatalogPage(1);
                      }}
                      className={`px-3 py-1 text-[10px] font-bold rounded-full border transition-all duration-150 flex-shrink-0 focus:outline-none cursor-pointer ${
                        isFilterActive
                          ? 'bg-[#8B6844] border-[#8B6844] text-white shadow-sm'
                          : 'bg-[#FFFDFC] border-[#E0D8CE]/60 text-[#6D6258] hover:border-[#8B6844]/60'
                      }`}
                    >
                      {filter}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal Body: Swatches Grid */}
            <div className="p-5 overflow-y-auto flex-grow bg-[#FFFDFC]">
              {currentFabricsList.length > 0 ? (
                <div className="grid grid-cols-2 gap-3.5">
                  {currentFabricsList.map((f) => {
                    const isSelected = selectedFabric.code === f.code;
                    return (
                      <div 
                        key={f.code}
                        onClick={() => {
                          setSelectedFabric(f);
                          setIsCatalogOpen(false);
                        }}
                        className={`border p-3 rounded-xl cursor-pointer flex items-center gap-3 transition-all duration-150 hover:bg-[#F4F1EC] ${
                          isSelected ? 'border-[#8B6844] bg-[#F4F1EC] shadow-sm' : 'border-[#E0D8CE]/60 bg-[#FFFDFC]'
                        }`}
                      >
                        {/* Swatch circle */}
                        <div 
                          className="w-10 h-10 rounded-lg border border-[#E0D8CE]/60 shadow-sm flex-shrink-0 relative overflow-hidden"
                          style={{ backgroundColor: f.color }}
                        >
                          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%), linear-gradient(-45deg, #000 25%, transparent 25%)', backgroundSize: '3px 3px' }}></div>
                        </div>

                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-[#8B6844] leading-none">{f.code}</span>
                            {isSelected && <span className="text-[9px] font-bold text-[#8B6844]">Active</span>}
                          </div>
                          <span className="block font-serif font-bold text-xs text-[#201712] truncate leading-tight mt-1">{f.name}</span>
                          <span className="block text-[9.5px] text-[#6D6258] truncate mt-0.5">{f.finish} • {f.desc}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-[#6D6258] text-xs font-semibold">
                  No fabric matching search query found in the {activeQualityData.name} catalogue.
                </div>
              )}
            </div>

            {/* Modal Footer: Pagination */}
            {totalPages > 1 && (
              <div className="px-5 py-3 border-t border-[#E0D8CE]/40 flex justify-between items-center bg-[#F4F1EC] flex-shrink-0">
                <button
                  disabled={catalogPage === 1}
                  onClick={() => setCatalogPage(prev => Math.max(1, prev - 1))}
                  className="px-3 py-1 bg-[#FFFDFC] border border-[#E0D8CE]/60 rounded-md text-[10px] font-bold hover:border-[#8B6844]/60 disabled:opacity-40 disabled:pointer-events-none cursor-pointer focus:outline-none shadow-xs"
                >
                  Previous
                </button>
                
                <span className="text-[10px] text-[#6D6258] font-semibold">
                  Page {catalogPage} of {totalPages}
                </span>

                <button
                  disabled={catalogPage === totalPages}
                  onClick={() => setCatalogPage(prev => Math.min(totalPages, prev + 1))}
                  className="px-3 py-1 bg-[#FFFDFC] border border-[#E0D8CE]/60 rounded-md text-[10px] font-bold hover:border-[#8B6844]/60 disabled:opacity-40 disabled:pointer-events-none cursor-pointer focus:outline-none shadow-xs"
                >
                  Next
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default SofaConfigurator;
