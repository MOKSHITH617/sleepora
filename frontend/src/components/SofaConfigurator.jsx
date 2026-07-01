import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const SofaConfigurator = ({ config, defaultProduct }) => {
  const navigate = useNavigate();

  const [selectedType, setSelectedType] = useState('3 Seater');
  const [selectedCapacity, setSelectedCapacity] = useState(3);
  const [selectedMaterial, setSelectedMaterial] = useState('Fabric');
  const [selectedFabric, setSelectedFabric] = useState('Cotton Blend');
  const [selectedColor, setSelectedColor] = useState('Charcoal Grey');

  const [leadLoading, setLeadLoading] = useState(false);

  // Initialize values
  useEffect(() => {
    if (config) {
      if (defaultProduct) {
        // Find category if possible
        const typeName = defaultProduct.sofaCategory === 'l-shape' ? 'L Shape Sofa' : 
                         defaultProduct.sofaCategory === 'recliner' ? 'Recliner Sofa' : 
                         defaultProduct.sofaCategory === '2-seater' ? '2 Seater' : 
                         defaultProduct.sofaCategory === '3-seater' ? '3 Seater' : 
                         defaultProduct.sofaCategory === 'corner' ? 'Corner Sofa' : 'Custom Sofa';
        setSelectedType(typeName);
        
        const cap = defaultProduct.sofaCategory === '2-seater' ? 2 : 
                    defaultProduct.sofaCategory === '3-seater' ? 3 : 
                    defaultProduct.sofaCategory === 'l-shape' ? 5 : 5;
        setSelectedCapacity(cap);
      } else if (config.sofaTypes && config.sofaTypes.length > 0) {
        setSelectedType(config.sofaTypes[0].name);
      }
      
      if (config.seatingCapacities && config.seatingCapacities.length > 0) {
        setSelectedCapacity(config.seatingCapacities[0].capacity);
      }

      if (config.materials && config.materials.length > 0) {
        setSelectedMaterial(config.materials[0].name);
      }

      if (config.fabrics && config.fabrics.length > 0) {
        setSelectedFabric(config.fabrics[0].name);
      }

      if (config.colors && config.colors.length > 0) {
        setSelectedColor(config.colors[0].name);
      }
    }
  }, [config, defaultProduct]);

  if (!config) return <div className="text-center py-10 font-bold">Loading Sofa Configurator...</div>;

  // Pricing formula
  // Base baseline of the sofa (e.g. ₹16,500)
  const basePrice = defaultProduct ? defaultProduct.basePrice : 16500;
  
  const typeObj = config.sofaTypes.find(t => t.name === selectedType) || { multiplier: 1.0 };
  const capObj = config.seatingCapacities.find(c => c.capacity === selectedCapacity) || { multiplier: 1.0 };
  const matObj = config.materials.find(m => m.name === selectedMaterial) || { priceModifier: 0 };
  const fabObj = config.fabrics.find(f => f.name === selectedFabric) || { priceModifier: 0 };

  // Price = (BasePrice * TypeMultiplier * CapacityMultiplier) + MaterialModifier + FabricModifier
  const finalPrice = Math.round((basePrice * typeObj.multiplier * capObj.multiplier) + matObj.priceModifier + fabObj.priceModifier);
  const retailMultiplier = defaultProduct ? defaultProduct.retailMultiplier : 2.0;
  const showroomPrice = Math.round(finalPrice * retailMultiplier);
  const savings = showroomPrice - finalPrice;
  const savingsPercent = Math.round((savings / showroomPrice) * 100);

  const activeColorObj = config.colors.find(c => c.name === selectedColor) || config.colors[0];

  const handleWhatsAppBooking = async () => {
    setLeadLoading(true);
    const leadData = {
      name: 'Customer (Sofa Configurator)',
      phone: 'Unspecified',
      email: 'sofa_configurator@timewell.com',
      productName: defaultProduct ? defaultProduct.name : 'Custom Configured Sofa',
      category: 'sofa',
      configuration: {
        sofaType: selectedType,
        seatingCapacity: `${selectedCapacity} Seater`,
        material: selectedMaterial,
        fabric: selectedFabric,
        color: selectedColor
      },
      quotedPrice: finalPrice,
      message: 'Self-configured via website sofa configurator tool.'
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
- *Type Layout*: ${selectedType}
- *Seating*: ${selectedCapacity} Seater
- *Material*: ${selectedMaterial} (${selectedFabric} Fabric)
- *Color Chosen*: ${selectedColor}
- *Direct Price*: ₹${finalPrice.toLocaleString('en-IN')}

Please guide me on fabric swatches, dispatch timelines, and payment methods. Thank you!`;

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
          material: selectedMaterial,
          fabric: selectedFabric,
          color: selectedColor
        },
        price: finalPrice
      }
    });
  };

  return (
    <div className="bg-white rounded-none border border-[#EADFC9]/45 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 animate-fade-in">
      
      {/* Dynamic Spec Controls */}
      <div className="lg:col-span-7 p-6 md:p-8 flex flex-col justify-between">
        <div>
          <h3 className="text-2xl font-serif font-bold text-[#2A211D] mb-1">Select Custom Specifications</h3>
          <p className="text-xs text-[#8E7D75] mb-6">Customize sofa layout, seating capacity, materials, and colors</p>

          {/* 1. Sofa Type Selection */}
          <div className="mb-6">
            <label className="block text-[10px] font-bold text-[#2A211D] uppercase tracking-wider mb-2.5">1. Choose Sofa Type / Layout</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {config.sofaTypes.map((t, idx) => (
                <label 
                  key={idx}
                  className={`border p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 select-none rounded-none ${selectedType === t.name ? 'border-[#7C5F43] bg-[#FAF5EF] shadow-xs font-semibold' : 'border-[#EADFC9]/50 bg-white hover:border-[#7C5F43]/45'}`}
                >
                  <input 
                    type="radio" 
                    name="config-sofa-type" 
                    value={t.name} 
                    checked={selectedType === t.name}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="hidden"
                  />
                  <span className="block text-xs text-[#2A211D] leading-tight">{t.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 2. Seating Capacity Selection */}
          <div className="mb-6">
            <label className="block text-[10px] font-bold text-[#2A211D] uppercase tracking-wider mb-2.5">2. Choose Seating Capacity</label>
            <div className="flex flex-row gap-3">
              {config.seatingCapacities.map((c, idx) => (
                <label 
                  key={idx}
                  className={`flex-grow border py-2 px-4 text-center cursor-pointer transition-all duration-200 rounded-none ${selectedCapacity === c.capacity ? 'border-[#7C5F43] bg-[#FAF5EF] text-[#2A211D] font-semibold' : 'border-[#EADFC9]/50 bg-white text-[#8E7D75] hover:border-[#7C5F43]/45'}`}
                >
                  <input 
                    type="radio" 
                    name="config-sofa-cap" 
                    value={c.capacity} 
                    checked={selectedCapacity === c.capacity}
                    onChange={(e) => setSelectedCapacity(parseInt(e.target.value))}
                    className="hidden"
                  />
                  <span className="block text-xs leading-none">{c.capacity} Seater</span>
                </label>
              ))}
            </div>
          </div>

          {/* 3. Materials & Fabrics Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="config-sofa-mat" className="block text-[10px] font-bold text-[#2A211D] uppercase tracking-wider mb-2">3. Primary Material</label>
              <select
                id="config-sofa-mat"
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
                className="w-full bg-[#FAF5EF] border border-[#EADFC9]/60 rounded-none py-2.5 px-4 text-xs font-semibold focus:outline-none focus:border-[#7C5F43] text-[#2A211D] cursor-pointer"
              >
                {config.materials.map((m, idx) => (
                  <option key={idx} value={m.name}>{m.name} {m.priceModifier > 0 ? `(+₹${m.priceModifier})` : ''}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="config-sofa-fab" className="block text-[10px] font-bold text-[#2A211D] uppercase tracking-wider mb-2">4. Fabric Grade / Finish</label>
              <select
                id="config-sofa-fab"
                value={selectedFabric}
                onChange={(e) => setSelectedFabric(e.target.value)}
                className="w-full bg-[#FAF5EF] border border-[#EADFC9]/60 rounded-none py-2.5 px-4 text-xs font-semibold focus:outline-none focus:border-[#7C5F43] text-[#2A211D] cursor-pointer"
              >
                {config.fabrics.map((f, idx) => (
                  <option key={idx} value={f.name}>{f.name} {f.priceModifier > 0 ? `(+₹${f.priceModifier})` : ''}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. Color Swatch Selection */}
          <div className="mb-6">
            <label className="block text-[10px] font-bold text-[#2A211D] uppercase tracking-wider mb-3">5. Select Color Swatch</label>
            <div className="flex gap-3 flex-wrap">
              {config.colors.map((c, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedColor(c.name)}
                  className={`w-9 h-9 rounded-full relative transition-all duration-300 transform hover:scale-105 ${selectedColor === c.name ? 'ring-2 ring-[#7C5F43] ring-offset-2 scale-105' : 'ring-1 ring-black/10'}`}
                  style={{ backgroundColor: c.colorCode }}
                  title={c.name}
                >
                  {selectedColor === c.name && (
                    <span className="absolute inset-0 flex items-center justify-center text-white text-[10px] font-bold drop-shadow">
                      ✓
                    </span>
                  )}
                </button>
              ))}
              <span className="self-center ml-2 text-xs font-semibold text-[#8E7D75]">
                {selectedColor}
              </span>
            </div>
          </div>

        </div>

        <button 
          onClick={handleCustomQuote}
          className="w-full border border-[#7C5F43] text-[#7C5F43] hover:bg-[#FAF5EF] bg-transparent text-[11px] font-bold py-3.5 rounded-none tracking-wider uppercase transition-colors duration-200 mt-4 active:scale-[0.99] focus:outline-none"
        >
          Request Custom Shape / Dimension Quote
        </button>
      </div>

      {/* Visual Spec Summary Column */}
      <div className="lg:col-span-5 bg-[#2A211D] p-6 md:p-8 flex flex-col justify-between relative overflow-hidden border-t lg:border-t-0 lg:border-l border-[#EADFC9]/20 min-h-[360px]">
        <div className="absolute top-0 right-0 w-48 h-48 bg-accent/5 blur-3xl pointer-events-none rounded-full"></div>

        <div>
          <span className="inline-block bg-[#7C5F43] text-white font-bold text-[9px] uppercase tracking-[1.5px] py-1 px-2.5 rounded-none mb-2">
            Selected Configuration
          </span>
          <h4 className="text-xl font-serif font-bold text-[#E3D8C4] mb-1">{defaultProduct ? defaultProduct.name : 'Customized Sofa'}</h4>
          <p className="text-xs text-stone-400 leading-relaxed mb-6">
            Handcrafted with seasoned sal wood framing and premium high density foam backing.
          </p>

          {/* Color Preview Block */}
          <div className="my-8 flex flex-col items-center justify-center p-6 border border-white/10 rounded-none bg-white/5 relative">
            <div 
              className="w-20 h-20 rounded-none shadow-lg transition-colors duration-500"
              style={{ backgroundColor: activeColorObj?.colorCode || '#ffffff' }}
            ></div>
            <span className="block text-xs font-bold text-white mt-3">{selectedColor} Color Swatch</span>
            <span className="block text-[10px] text-stone-400 mt-1">{selectedCapacity} Seater Sofa Layout</span>
          </div>

          {/* Configuration List Summary */}
          <div className="text-white/85 text-xs space-y-2 mb-6">
            <div className="flex justify-between border-b border-white/10 pb-1.5">
              <span className="text-stone-400">Layout Type:</span>
              <span className="font-semibold text-[#E3D8C4]">{selectedType}</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-1.5">
              <span className="text-stone-400">Capacity:</span>
              <span className="font-semibold text-[#E3D8C4]">{selectedCapacity} Seater</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-1.5">
              <span className="text-stone-400">Material:</span>
              <span className="font-semibold text-[#E3D8C4]">{selectedMaterial}</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-1.5">
              <span className="text-stone-400">Fabric Finish:</span>
              <span className="font-semibold text-[#E3D8C4]">{selectedFabric}</span>
            </div>
          </div>

        </div>

        {/* Pricing calculations summary */}
        <div className="border-t border-[#EADFC9]/15 pt-6">
          <div className="flex justify-between items-center mb-4 text-white">
            <div>
              <span className="block text-[11px] text-stone-400 leading-tight">
                Showroom Comparison: <span className="line-through font-medium">₹{showroomPrice.toLocaleString('en-IN')}</span>
              </span>
              <span className="inline-block bg-[#FAF5EF] text-[#7C5F43] font-bold text-[9.5px] px-2.5 py-0.5 border border-[#7C5F43]/15 mt-1 rounded-none">
                Save {savingsPercent}% (₹{savings.toLocaleString('en-IN')})
              </span>
            </div>
            <div className="text-right">
              <span className="block text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-0.5">Factory Price</span>
              <span className="text-3xl font-serif font-bold text-[#E3D8C4] tracking-tight">
                ₹{finalPrice.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <button
            onClick={handleWhatsAppBooking}
            disabled={leadLoading}
            className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-none shadow-md flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none focus:outline-none"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11.951 16.942l-1.378 5.244-5.244-1.378c.905.492 1.944.75 3.02.75 3.182 0 5.767-2.586 5.768-5.766 0-3.18-2.585-5.766-5.766-5.766z"/>
            </svg>
            Confirm & Book via WhatsApp
          </button>
        </div>

      </div>

    </div>
  );
};

export default SofaConfigurator;
