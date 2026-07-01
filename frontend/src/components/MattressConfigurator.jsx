import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const MattressConfigurator = ({ config, defaultCore }) => {
  const navigate = useNavigate();
  
  const [selectedCore, setSelectedCore] = useState('ortho');
  const [selectedSize, setSelectedSize] = useState('Single (72 x 36)');
  const [selectedThickness, setSelectedThickness] = useState('5-inch');
  const [thicknessVal, setThicknessVal] = useState(5); // slider numeric state

  const [leadLoading, setLeadLoading] = useState(false);

  // Initialize values
  useEffect(() => {
    if (config) {
      if (defaultCore) {
        setSelectedCore(defaultCore);
      } else if (config.cores && config.cores.length > 0) {
        setSelectedCore(config.cores[0].type);
      }
      
      if (config.sizes && config.sizes.length > 0) {
        setSelectedSize(config.sizes[0].name);
      }

      if (config.thicknesses && config.thicknesses.length > 0) {
        const thick = config.thicknesses.find(t => t.name.includes('5')) || config.thicknesses[0];
        setSelectedThickness(thick.name);
        setThicknessVal(parseInt(thick.name));
      }
    }
  }, [config, defaultCore]);

  if (!config) return <div className="text-center py-10 font-bold">Loading Mattress Configurator...</div>;

  const coreData = config.cores.find(c => c.type === selectedCore) || config.cores[0];

  // Recalculate thickness when slider moves
  const handleSliderChange = (e) => {
    const val = parseInt(e.target.value);
    setThicknessVal(val);
    
    const matchingThick = config.thicknesses.find(t => parseInt(t.name) === val);
    if (matchingThick) {
      setSelectedThickness(matchingThick.name);
    } else {
      setSelectedThickness(`${val}-inch`);
    }
  };

  // Pricing formula
  const basePrice = coreData ? coreData.basePrice : 6500;
  const sizeObj = config.sizes.find(s => s.name === selectedSize) || { multiplier: 1.0 };
  
  let thicknessMultiplier = 1.0;
  if (thicknessVal === 4) thicknessMultiplier = 0.8;
  else if (thicknessVal === 5) thicknessMultiplier = 1.0;
  else if (thicknessVal === 6) thicknessMultiplier = 1.25;
  else if (thicknessVal === 7) thicknessMultiplier = 1.35;
  else if (thicknessVal === 8) thicknessMultiplier = 1.5;
  else if (thicknessVal === 9) thicknessMultiplier = 1.65;
  else if (thicknessVal === 10) thicknessMultiplier = 1.8;

  const finalPrice = Math.round(basePrice * sizeObj.multiplier * thicknessMultiplier);
  const retailMultiplier = coreData ? coreData.retailMultiplier : 2.0;
  const showroomPrice = Math.round(finalPrice * retailMultiplier);
  const savings = showroomPrice - finalPrice;
  const savingsPercent = Math.round((savings / showroomPrice) * 100);

  // Submit Lead to Database and open WhatsApp
  const handleWhatsAppBooking = async () => {
    setLeadLoading(true);
    const leadData = {
      name: 'Customer (Configurator Booking)',
      phone: 'Unspecified',
      email: 'configurator@timewell.com',
      productName: coreData.name,
      category: 'mattress',
      configuration: {
        coreType: coreData.name,
        size: selectedSize,
        thickness: `${thicknessVal}-inch`
      },
      quotedPrice: finalPrice,
      message: 'Self-configured via website mattress configurator tool.'
    };

    try {
      await API.post('/leads', leadData);
    } catch (error) {
      console.error('Failed to log lead:', error);
    }

    setLeadLoading(false);

    const whatsappNumber = '919876543210';
    const textMsg = `Hello! I used your Interactive Mattress Configurator and would like to order:
- *Mattress Type*: ${coreData.name}
- *Size*: ${selectedSize}
- *Thickness*: ${thicknessVal} inches
- *Direct Price*: ₹${finalPrice.toLocaleString('en-IN')}

Please guide me on delivery timelines and payment methods. Thank you!`;

    const encodedText = encodeURIComponent(textMsg);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedText}`, '_blank');
  };

  const handleCustomQuote = () => {
    navigate('/contact', {
      state: {
        productName: coreData.name,
        category: 'mattress',
        configuration: {
          coreType: coreData.name,
          size: selectedSize,
          thickness: `${thicknessVal}-inch`
        },
        price: finalPrice
      }
    });
  };

  const totalMultiplier = (thicknessVal - 4) / 6;
  const scaleFactor = 0.8 + (totalMultiplier * 0.4);

  return (
    <div className="bg-white rounded-none border border-[#EADFC9]/45 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 animate-fade-in">
      
      {/* Spec Controls */}
      <div className="lg:col-span-7 p-6 md:p-8 flex flex-col justify-between">
        <div>
          <h3 className="text-2xl font-serif font-bold text-[#2A211D] mb-1">Select Custom Specifications</h3>
          <p className="text-xs text-[#8E7D75] mb-6">Choose core materials, sizes, and slide the mattress depth</p>

          {/* 1. Core Selection */}
          <div className="mb-6">
            <label className="block text-[10px] font-bold text-[#2A211D] uppercase tracking-wider mb-2.5">1. Choose Mattress Core</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {config.cores.map((c, idx) => (
                <label 
                  key={idx}
                  className={`border p-4 flex flex-col justify-between cursor-pointer transition-all duration-200 select-none rounded-none ${selectedCore === c.type ? 'border-[#7C5F43] bg-[#FAF5EF] shadow-xs' : 'border-[#EADFC9]/50 bg-white hover:border-[#7C5F43]/45'}`}
                >
                  <input 
                    type="radio" 
                    name="config-core" 
                    value={c.type} 
                    checked={selectedCore === c.type}
                    onChange={(e) => setSelectedCore(e.target.value)}
                    className="hidden"
                  />
                  <div>
                    <span className="block font-bold font-serif text-sm text-[#2A211D] leading-tight mb-1">{c.name}</span>
                    <span className="block text-[10px] text-[#8E7D75] leading-relaxed line-clamp-2">{c.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* 2. Dimensions Selection */}
          <div className="mb-6">
            <label htmlFor="config-size" className="block text-[10px] font-bold text-[#2A211D] uppercase tracking-wider mb-2">2. Select Dimensions (Inches)</label>
            <select
              id="config-size"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full bg-[#FAF5EF] border border-[#EADFC9]/60 rounded-none py-2.5 px-4 text-xs font-semibold focus:outline-none focus:border-[#7C5F43] text-[#2A211D] cursor-pointer"
            >
              {config.sizes.map((s, idx) => (
                <option key={idx} value={s.name}>{s.name} Bed Dimensions</option>
              ))}
            </select>
          </div>

          {/* 3. Thickness Slider */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="config-thickness" className="text-[10px] font-bold text-[#2A211D] uppercase tracking-wider">3. Thickness Depth</label>
              <span className="bg-[#FAF5EF] text-[#7C5F43] border border-[#7C5F43]/15 px-3 py-1 font-bold text-sm tracking-wide">{thicknessVal} inches</span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-[#8E7D75]">4"</span>
              <input 
                id="config-thickness"
                type="range" 
                min="4" 
                max="10" 
                value={thicknessVal}
                onChange={handleSliderChange}
                className="w-full h-1 bg-[#EADFC9] rounded-lg appearance-none cursor-pointer accent-[#7C5F43]"
              />
              <span className="text-xs font-bold text-[#8E7D75]">10"</span>
            </div>
          </div>
        </div>

        <button 
          onClick={handleCustomQuote}
          className="w-full border border-[#7C5F43] text-[#7C5F43] hover:bg-[#FAF5EF] bg-transparent text-[11px] font-bold py-3.5 rounded-none tracking-wider uppercase transition-colors duration-200 mt-4 active:scale-[0.99] focus:outline-none"
        >
          Request Custom Measurements Quote
        </button>
      </div>

      {/* 3D Stacking Visualizer Column */}
      <div className="lg:col-span-5 bg-[#2A211D] p-6 md:p-8 flex flex-col justify-between relative overflow-hidden border-t lg:border-t-0 lg:border-l border-[#EADFC9]/20 min-h-[360px]">
        {/* Decorative Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-accent/5 blur-3xl pointer-events-none rounded-full"></div>

        <div>
          <span className="inline-block bg-[#7C5F43] text-white font-bold text-[9px] uppercase tracking-[1.5px] py-1 px-2.5 rounded-none mb-2">
            Inside the Mattress
          </span>
          <h4 className="text-xl font-serif font-bold text-[#E3D8C4] mb-1">{coreData?.name || 'Loading Core...'}</h4>
          <p className="text-xs text-stone-400 leading-relaxed mb-6">
            Visual layer mapping scales dynamically with thickness selection.
          </p>

          {/* Stacking stack */}
          <div className="my-8 flex flex-col gap-1.5 items-center justify-center min-h-[160px]">
            {coreData?.layers.map((layer, idx) => {
              const baseHeight = parseInt(layer.height);
              const dynamicHeight = Math.round(baseHeight * scaleFactor);
              
              return (
                <div
                  key={idx}
                  className={`layer-3d max-w-[280px] rounded-none ${idx === 0 ? 'layer-quilted' : ''}`}
                  style={{
                    background: layer.color,
                    height: `${dynamicHeight}px`
                  }}
                >
                  <span className="truncate text-[10px] uppercase font-bold tracking-wider">{layer.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="border-t border-[#EADFC9]/15 pt-6">
          <div className="flex justify-between items-center mb-4 text-white">
            <div>
              <span className="block text-[11px] text-stone-400 leading-tight">
                Retail Showroom: <span className="line-through font-medium">₹{showroomPrice.toLocaleString('en-IN')}</span>
              </span>
              <span className="inline-block bg-[#FAF5EF] text-[#7C5F43] font-bold text-[9.5px] px-2 py-0.5 border border-[#7C5F43]/15 mt-1 rounded-none">
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

export default MattressConfigurator;
