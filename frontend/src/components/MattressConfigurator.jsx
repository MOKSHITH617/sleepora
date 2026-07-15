import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

// Realistic 3D Isometric mattress card vector icons helper
const renderIsometricIcon = (typeId) => {
  switch (typeId) {
    case 'soft-rebonded':
      return (
        <svg viewBox="0 0 60 45" className="w-12 h-10 overflow-visible">
          {/* Top Face - Soft Foam */}
          <polygon points="30,8 48,17 30,26 12,17" fill="#FFF9E6" stroke="#EADFC9" strokeWidth="0.5"/>
          {/* Comfort Left Face */}
          <polygon points="12,17 30,26 30,30 12,21" fill="#FFEBB3"/>
          {/* Comfort Right Face */}
          <polygon points="30,26 48,17 48,21 30,30" fill="#FED880"/>
          
          {/* Rebonded Left Face */}
          <polygon points="12,21 30,30 30,38 12,29" fill="#72706E"/>
          {/* Rebonded Right Face */}
          <polygon points="30,30 48,21 48,29 30,38" fill="#605E5C"/>
          
          {/* Rebonded multi-color polyurethane particles */}
          <polygon points="15,24 17,23 18,25 16,26" fill="#A95D5D"/>
          <polygon points="25,27 28,26 27,28 24,29" fill="#5D7FA9"/>
          <polygon points="35,26 37,25 38,27 36,28" fill="#7FA95D"/>
          <polygon points="43,22 45,21 46,23 44,24" fill="#C2A35D"/>
          <polygon points="20,33 22,32 23,34 21,35" fill="#C2A35D"/>
          <polygon points="41,27 43,26 42,28 40,29" fill="#5D7FA9"/>
        </svg>
      );
    case 'rebonded-latex':
      return (
        <svg viewBox="0 0 60 45" className="w-12 h-10 overflow-visible">
          {/* Top Face - Latex */}
          <polygon points="30,8 48,17 30,26 12,17" fill="#FAF2DB" stroke="#EBE4D0" strokeWidth="0.5"/>
          {/* Pin-core aeration holes */}
          <circle cx="21" cy="14" r="0.6" fill="#D5C9A4"/>
          <circle cx="25" cy="16" r="0.6" fill="#D5C9A4"/>
          <circle cx="29" cy="18" r="0.6" fill="#D5C9A4"/>
          <circle cx="33" cy="16" r="0.6" fill="#D5C9A4"/>
          <circle cx="37" cy="14" r="0.6" fill="#D5C9A4"/>
          <circle cx="29" cy="13" r="0.6" fill="#D5C9A4"/>
          <circle cx="25" cy="11" r="0.6" fill="#D5C9A4"/>
          <circle cx="33" cy="11" r="0.6" fill="#D5C9A4"/>

          {/* Latex Left Face */}
          <polygon points="12,17 30,26 30,30 12,21" fill="#EADFBE"/>
          {/* Latex Right Face */}
          <polygon points="30,26 48,17 48,21 30,30" fill="#DCD0AE"/>
          
          {/* Rebonded Left Face */}
          <polygon points="12,21 30,30 30,38 12,29" fill="#72706E"/>
          {/* Rebonded Right Face */}
          <polygon points="30,30 48,21 48,29 30,38" fill="#605E5C"/>
          {/* Shredded foam scraps */}
          <polygon points="16,25 18,24 17,26" fill="#A95D5D"/>
          <polygon points="26,27 28,26 27,29" fill="#5D7FA9"/>
          <polygon points="36,25 38,24 37,27" fill="#7FA95D"/>
          <polygon points="42,23 44,22 43,24" fill="#C2A35D"/>
        </svg>
      );
    case 'memory-foam':
      return (
        <svg viewBox="0 0 60 45" className="w-12 h-10 overflow-visible">
          {/* Top Face - Memory Foam */}
          <polygon points="30,8 48,17 30,26 12,17" fill="#FFF2CC" stroke="#EADFC9" strokeWidth="0.5"/>
          {/* Memory Left Face */}
          <polygon points="12,17 30,26 30,30 12,21" fill="#FFE599"/>
          {/* Memory Right Face */}
          <polygon points="30,26 48,17 48,21 30,30" fill="#F1C232"/>
          
          {/* Base Foam Left Face */}
          <polygon points="12,21 30,30 30,38 12,29" fill="#EBE6DD"/>
          {/* Base Foam Right Face */}
          <polygon points="30,30 48,21 48,29 30,38" fill="#D6CFC4"/>
        </svg>
      );
    case 'ortho-mattress':
      return (
        <svg viewBox="0 0 60 45" className="w-12 h-10 overflow-visible">
          {/* Top Face - Cooling Gel */}
          <polygon points="30,8 48,17 30,26 12,17" fill="#E0F7FA" stroke="#B2EBF2" strokeWidth="0.5"/>
          {/* Gel cooling cells */}
          <line x1="20" y1="13" x2="24" y2="15" stroke="#4DD0E1" strokeWidth="0.6"/>
          <line x1="28" y1="17" x2="32" y2="19" stroke="#4DD0E1" strokeWidth="0.6"/>
          <line x1="36" y1="13" x2="40" y2="15" stroke="#4DD0E1" strokeWidth="0.6"/>

          {/* Gel Left Face */}
          <polygon points="12,17 30,26 30,30 12,21" fill="#B2EBF2"/>
          {/* Gel Right Face */}
          <polygon points="30,26 48,17 48,21 30,30" fill="#80DEEA"/>
          
          {/* Ortho Core Left Face */}
          <polygon points="12,21 30,30 30,38 12,29" fill="#A78BFA"/>
          {/* Ortho Core Right Face */}
          <polygon points="30,30 48,21 48,29 30,38" fill="#8B5CF6"/>
        </svg>
      );
    case 'hr-foam':
      return (
        <svg viewBox="0 0 60 45" className="w-12 h-10 overflow-visible">
          {/* Top Face - Soft Top */}
          <polygon points="30,8 48,17 30,26 12,17" fill="#FFF3E0" stroke="#FFE0B2" strokeWidth="0.5"/>
          {/* Soft Left Face */}
          <polygon points="12,17 30,26 30,21 12,12" fill="#FFE0B2"/>
          {/* Soft Right Face */}
          <polygon points="30,26 48,17 48,12 30,21" fill="#FFB74D"/>
          
          {/* HR Foam Core Left Face */}
          <polygon points="12,21 30,30 30,38 12,29" fill="#A7F3D0"/>
          {/* HR Foam Core Right Face */}
          <polygon points="30,30 48,21 48,29 30,38" fill="#34D399"/>
        </svg>
      );
    case 'pocket-spring':
      return (
        <svg viewBox="0 0 60 45" className="w-12 h-10 overflow-visible">
          {/* Top Face - Comfort Foam */}
          <polygon points="30,8 48,17 30,26 12,17" fill="#FFEAA7" stroke="#FFE0B2" strokeWidth="0.5"/>
          {/* Foam Left Face */}
          <polygon points="12,17 30,26 30,29 12,20" fill="#FFD166"/>
          {/* Foam Right Face */}
          <polygon points="30,26 48,17 48,20 30,29" fill="#E5A93C"/>
          
          {/* Pocket Springs Left Face */}
          <polygon points="12,20 30,29 30,35 12,26" fill="#E5E7EB"/>
          {/* Pocket Springs Right Face */}
          <polygon points="30,29 48,20 48,26 30,35" fill="#D1D5DB"/>
          {/* Individual pockets divisions */}
          <line x1="16" y1="22" x2="16" y2="28" stroke="#9CA3AF" strokeWidth="0.8"/>
          <line x1="21" y1="24" x2="21" y2="30" stroke="#9CA3AF" strokeWidth="0.8"/>
          <line x1="25" y1="26" x2="25" y2="32" stroke="#9CA3AF" strokeWidth="0.8"/>
          <line x1="34" y1="27" x2="34" y2="33" stroke="#9CA3AF" strokeWidth="0.8"/>
          <line x1="39" y1="25" x2="39" y2="31" stroke="#9CA3AF" strokeWidth="0.8"/>
          <line x1="44" y1="22" x2="44" y2="28" stroke="#9CA3AF" strokeWidth="0.8"/>

          {/* Base Foam Left Face */}
          <polygon points="12,26 30,35 30,38 12,29" fill="#D1CFC9"/>
          {/* Base Foam Right Face */}
          <polygon points="30,35 48,26 48,29 30,38" fill="#B8B5AE"/>
        </svg>
      );
    case 'dual-comfort':
      return (
        <svg viewBox="0 0 60 45" className="w-12 h-10 overflow-visible">
          {/* Top Face - Medium Soft Foam */}
          <polygon points="30,8 48,17 30,26 12,17" fill="#FFF3E0" stroke="#FFE0B2" strokeWidth="0.5"/>
          {/* Soft Left Face */}
          <polygon points="12,17 30,26 30,28 12,19" fill="#FFE0B2"/>
          {/* Soft Right Face */}
          <polygon points="30,26 48,17 48,19 30,28" fill="#FFB74D"/>
          
          {/* Firm Foam Left Face */}
          <polygon points="12,19 30,28 30,38 12,29" fill="#D1D5DB"/>
          {/* Firm Foam Right Face */}
          <polygon points="30,28 48,19 48,29 30,38" fill="#9CA3AF"/>
        </svg>
      );
    default:
      return null;
  }
};

// Definition of the 10 Factory Mattress Types with dynamic layered specifications and functional role suffixes
const MATTRESS_TYPES = [
  {
    id: 'soft-rebonded',
    name: 'Soft Foam + Rebonded',
    desc: 'Soft comfort layer with firm support base.',
    basePrice: 5200,
    retailMultiplier: 1.85,
    iconStack: ['#FFF8E7', '#7C7A78'],
    getLayers: (t) => {
      const soft = t === 4 ? 1 : t === 5 ? 1 : t === 6 ? 2 : t === 7 ? 2 : t === 8 ? 3 : t === 9 ? 3 : 4;
      const rebonded = t - soft;
      return [
        { 
          name: 'Premium Soft Foam', 
          height: soft, 
          color: 'linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, transparent 40%, rgba(0,0,0,0.1) 100%), radial-gradient(rgba(0,0,0,0.015) 8%, transparent 12%)', 
          desc: 'Extra soft comfort layer for a plush feel.', 
          type: 'foam', 
          suffix: '(Comfort Layer)',
          backgroundSize: 'auto, 6px 6px',
          backgroundColor: '#FFF9E6'
        },
        { 
          name: 'High Density Rebonded Foam', 
          height: rebonded, 
          color: 'linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, transparent 45%, rgba(0,0,0,0.2) 100%), radial-gradient(circle at 20% 30%, #A95D5D 2.5px, transparent 3.5px), radial-gradient(circle at 80% 70%, #5D7FA9 2.5px, transparent 3.5px), radial-gradient(circle at 50% 60%, #7FA95D 3px, transparent 4px), radial-gradient(circle at 75% 25%, #C2A35D 2.5px, transparent 3.5px), repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 3px, transparent 3px, transparent 6px)', 
          desc: 'Firm support base for durability and spine support.', 
          type: 'rebonded', 
          suffix: '(Support Layer)',
          backgroundSize: 'auto, 20px 20px, 24px 24px, 22px 22px, 26px 26px, auto',
          backgroundColor: '#72706E'
        }
      ];
    }
  },
  {
    id: 'rebonded-latex',
    name: 'Rebonded + Latex',
    desc: 'Natural latex on top of rebonded support.',
    basePrice: 8500,
    retailMultiplier: 1.95,
    iconStack: ['#FCF9F2', '#7C7A78'],
    getLayers: (t) => {
      const latex = t === 4 ? 1 : t === 5 ? 1 : t === 6 ? 2 : t === 7 ? 2 : t === 8 ? 3 : t === 9 ? 3 : 4;
      const rebonded = t - latex;
      return [
        { 
          name: 'Natural Pin-Core Latex', 
          height: latex, 
          color: 'linear-gradient(to bottom, rgba(255,255,255,0.3) 0%, transparent 45%, rgba(0,0,0,0.15) 100%), radial-gradient(circle, #D5C9A4 25%, transparent 28%)', 
          desc: 'Breathable, eco-friendly, responsive organic comfort.', 
          type: 'latex', 
          suffix: '(Bounce Layer)',
          backgroundSize: 'auto, 10px 10px',
          backgroundColor: '#FAF2DB'
        },
        { 
          name: 'High Density Rebonded Foam', 
          height: rebonded, 
          color: 'linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, transparent 45%, rgba(0,0,0,0.2) 100%), radial-gradient(circle at 20% 30%, #A95D5D 2.5px, transparent 3.5px), radial-gradient(circle at 80% 70%, #5D7FA9 2.5px, transparent 3.5px), radial-gradient(circle at 50% 60%, #7FA95D 3px, transparent 4px), radial-gradient(circle at 75% 25%, #C2A35D 2.5px, transparent 3.5px), repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 3px, transparent 3px, transparent 6px)', 
          desc: 'Heavy-duty orthopaedic core base.', 
          type: 'rebonded', 
          suffix: '(Support Layer)',
          backgroundSize: 'auto, 20px 20px, 24px 24px, 22px 22px, 26px 26px, auto',
          backgroundColor: '#72706E'
        }
      ];
    }
  },
  {
    id: 'memory-foam',
    name: 'Memory Foam Mattress',
    desc: 'Contouring comfort with pressure relief.',
    basePrice: 7500,
    retailMultiplier: 1.9,
    iconStack: ['#FFEAA7', '#EBE6DD'],
    getLayers: (t) => {
      const mem = t <= 6 ? 2 : 3;
      const support = t - mem;
      return [
        { 
          name: 'Premium Memory Foam', 
          height: mem, 
          color: 'linear-gradient(to bottom, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 35%, rgba(0,0,0,0.15) 100%), linear-gradient(to right, #FFEAA7, #FFD166)', 
          desc: 'Contour-hugging pressure relief and body scanning.', 
          type: 'memory', 
          suffix: '(Comfort Layer)',
          backgroundColor: '#FFD166'
        },
        { 
          name: 'High Density Support Foam', 
          height: support, 
          color: 'linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, transparent 40%, rgba(0,0,0,0.12) 100%), radial-gradient(rgba(0,0,0,0.015) 10%, transparent 15%)', 
          desc: 'Foundational durability and anti-sagging reinforcement.', 
          type: 'foam', 
          suffix: '(Support Layer)',
          backgroundSize: 'auto, 5px 5px',
          backgroundColor: '#EBE6DD'
        }
      ];
    }
  },
  {
    id: 'ortho-mattress',
    name: 'Orthopaedic Mattress',
    desc: 'Enhanced back support for better posture.',
    basePrice: 6500,
    retailMultiplier: 2.0,
    iconStack: ['#E0F7FA', '#8B5CF6'],
    getLayers: (t) => {
      const gel = t <= 5 ? 1.5 : 2;
      const ortho = t - gel;
      return [
        { 
          name: 'Cooling Gel Memory Foam', 
          height: gel, 
          color: 'linear-gradient(to bottom, rgba(255,255,255,0.3) 0%, transparent 40%, rgba(0,0,0,0.15) 100%), radial-gradient(circle at 30% 40%, rgba(255,255,255,0.4) 1px, transparent 2px), linear-gradient(to right, #E0F7FA, #B2EBF2)', 
          desc: 'Temperature-regulating comfort with gel infusions.', 
          type: 'memory', 
          suffix: '(Comfort Layer)',
          backgroundSize: 'auto, 8px 8px, auto',
          backgroundColor: '#B2EBF2'
        },
        { 
          name: 'High Resilient Ortho Foam', 
          height: ortho, 
          color: 'linear-gradient(to bottom, rgba(255,255,255,0.25) 0%, transparent 45%, rgba(0,0,0,0.2) 100%), radial-gradient(rgba(255,255,255,0.15) 12%, transparent 16%)', 
          desc: '5-Zone target support alignment for spine correction.', 
          type: 'foam', 
          suffix: '(Support Layer)',
          backgroundSize: 'auto, 6px 6px',
          backgroundColor: '#8B5CF6'
        }
      ];
    }
  },
  {
    id: 'hr-foam',
    name: 'HR Foam Mattress',
    desc: 'High resilience foam for superior durability.',
    basePrice: 5800,
    retailMultiplier: 1.85,
    iconStack: ['#FFF3E0', '#34D399'],
    getLayers: (t) => {
      const soft = t <= 5 ? 1.5 : 2;
      const hr = t - soft;
      return [
        { 
          name: 'Super Soft Transition Foam', 
          height: soft, 
          color: 'linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, transparent 40%, rgba(0,0,0,0.1) 100%), radial-gradient(rgba(0,0,0,0.015) 8%, transparent 12%)', 
          desc: 'Plush sink-in feel with gentle transition contouring.', 
          type: 'foam', 
          suffix: '(Comfort Layer)',
          backgroundSize: 'auto, 5px 5px',
          backgroundColor: '#FFF3E0'
        },
        { 
          name: 'High Resilience (HR) Foam', 
          height: hr, 
          color: 'linear-gradient(to bottom, rgba(255,255,255,0.25) 0%, transparent 45%, rgba(0,0,0,0.22) 100%), radial-gradient(rgba(255,255,255,0.15) 15%, transparent 20%)', 
          desc: 'Highly responsive buoyant foam prevents sinking.', 
          type: 'foam', 
          suffix: '(Support Layer)',
          backgroundSize: 'auto, 5px 5px',
          backgroundColor: '#34D399'
        }
      ];
    }
  },
  {
    id: 'pocket-spring',
    name: 'Pocket Spring Mattress',
    desc: 'Individually packed springs for motion isolation.',
    basePrice: 11500,
    retailMultiplier: 2.1,
    iconStack: ['#FFEAA7', '#D1D5DB', '#D1CFC9'],
    getLayers: (t) => {
      const top = t <= 5 ? 1 : 2;
      const spring = t <= 6 ? 4 : 5;
      const base = t - (top + spring);
      return [
        { 
          name: 'Premium Memory Foam', 
          height: top, 
          color: 'linear-gradient(to bottom, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 35%, rgba(0,0,0,0.15) 100%), linear-gradient(to right, #FFEAA7, #FFD166)', 
          desc: 'Cushioning pressure points above pocket coils.', 
          type: 'memory', 
          suffix: '(Comfort Layer)',
          backgroundColor: '#FFD166'
        },
        { 
          name: 'Zero-Motion Pocket Springs', 
          height: spring, 
          color: 'linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, transparent 40%, rgba(0,0,0,0.18) 100%), url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'30\' height=\'60\' viewBox=\'0 0 30 60\'><rect width=\'28\' height=\'58\' x=\'1\' y=\'1\' rx=\'4\' fill=\'%23EBEBE8\' stroke=\'%23D3D3CF\' stroke-width=\'1\'/><path d=\'M4 8 C 15 3, 15 13, 26 8 M4 18 C 15 13, 15 23, 26 18 M4 28 C 15 23, 15 33, 26 28 M4 38 C 15 33, 15 43, 26 38 M4 48 C 15 43, 15 53, 26 48\' stroke=\'%23A0A09C\' stroke-width=\'1.5\' fill=\'none\'/></svg>")', 
          desc: 'Individually encased pocket coils for motion isolation.', 
          type: 'spring', 
          suffix: '(Spring Core)',
          backgroundSize: 'auto, 24px 100%',
          backgroundRepeat: 'no-repeat, repeat-x',
          backgroundColor: '#EAEAE6'
        },
        { 
          name: 'High Density Felt Base', 
          height: base, 
          color: 'linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, transparent 40%, rgba(0,0,0,0.12) 100%)', 
          desc: 'Protective bottom absorption pad for springs.', 
          type: 'foam', 
          suffix: '(Support Layer)',
          backgroundColor: '#D1CFC9'
        }
      ];
    }
  },
  {
    id: 'dual-comfort',
    name: 'Dual Comfort Mattress',
    desc: 'Two-sided comfort – soft & firm in one.',
    basePrice: 6000,
    retailMultiplier: 1.8,
    iconStack: ['#FFF3E0', '#D1D5DB'],
    getLayers: (t) => {
      const soft = Math.floor(t / 2);
      const firm = t - soft;
      return [
        { 
          name: 'Medium-Soft Comfort Foam', 
          height: soft, 
          color: 'linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, transparent 40%, rgba(0,0,0,0.1) 100%), radial-gradient(rgba(0,0,0,0.015) 8%, transparent 12%)', 
          desc: 'Gentle, plush surface side for primary comfort sleep.', 
          type: 'foam', 
          suffix: '(Comfort Layer)',
          backgroundSize: 'auto, 5px 5px',
          backgroundColor: '#FFF3E0'
        },
        { 
          name: 'Medium-Firm Ortho Support', 
          height: firm, 
          color: 'linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, transparent 40%, rgba(0,0,0,0.15) 100%), radial-gradient(rgba(0,0,0,0.015) 10%, transparent 15%)', 
          desc: 'Flipped reverse side offering dense back support.', 
          type: 'foam', 
          suffix: '(Support Layer)',
          backgroundSize: 'auto, 5px 5px',
        }
      ];
    }
  }
];

const MattressConfigurator = ({ config, defaultCore }) => {
  const navigate = useNavigate();

  // Helper mapper to handle defaults coming from standard product pages
  const getMappedCore = (val) => {
    if (val === 'ortho') return 'ortho-mattress';
    if (val === 'latex') return 'rebonded-latex';
    if (val === 'spring') return 'pocket-spring';
    if (val === 'coir') return 'ortho-mattress';
    if (val === 'hybrid' || val === 'custom-hybrid') return 'pocket-spring';
    if (val === 'dual') return 'dual-comfort';
    return val || 'soft-rebonded';
  };

  const [selectedCore, setSelectedCore] = useState('soft-rebonded');
  const [selectedSize, setSelectedSize] = useState('Single (72 x 36)');
  const [selectedThickness, setSelectedThickness] = useState('5-inch');
  const [thicknessVal, setThicknessVal] = useState(5); // slider numeric state
  const [leadLoading, setLeadLoading] = useState(false);

  // Initialize values based on configuration and props
  useEffect(() => {
    if (config) {
      if (defaultCore) {
        setSelectedCore(getMappedCore(defaultCore));
      } else {
        setSelectedCore('soft-rebonded');
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

  // Retrieve current active configuration values
  const coreData = MATTRESS_TYPES.find(c => c.id === selectedCore) || MATTRESS_TYPES[0];
  const sizeObj = config.sizes.find(s => s.name === selectedSize) || { multiplier: 1.0 };

  // Thickness pricing factors
  let thicknessMultiplier = 1.0;
  if (thicknessVal === 4) thicknessMultiplier = 0.90;
  else if (thicknessVal === 5) thicknessMultiplier = 1.00;
  else if (thicknessVal === 6) thicknessMultiplier = 1.20;
  else if (thicknessVal === 7) thicknessMultiplier = 1.35;
  else if (thicknessVal === 8) thicknessMultiplier = 1.50;
  else if (thicknessVal === 9) thicknessMultiplier = 1.65;
  else if (thicknessVal === 10) thicknessMultiplier = 1.80;

  // Factory Price Calculation
  const factoryPrice = Math.round(coreData.basePrice * sizeObj.multiplier * thicknessMultiplier);
  const retailPrice = Math.round(factoryPrice * coreData.retailMultiplier);
  const savings = retailPrice - factoryPrice;
  const savingsPercent = Math.round((savings / retailPrice) * 100);

  // Slider change callback
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

  // Submit enquiry lead data & trigger redirect to WhatsApp chat
  const handleWhatsAppBooking = async () => {
    setLeadLoading(true);
    const leadData = {
      name: 'Customer (Configurator Booking)',
      phone: 'Unspecified',
      email: 'configurator@sleepora.com',
      productName: coreData.name,
      category: 'mattress',
      configuration: {
        coreType: coreData.name,
        size: selectedSize,
        thickness: `${thicknessVal}-inch`
      },
      quotedPrice: factoryPrice,
      message: `Self-configured premium custom mattress: ${coreData.name}, ${selectedSize}, ${thicknessVal} inch.`
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
- *Direct Price*: ₹${factoryPrice.toLocaleString('en-IN')}

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
        price: factoryPrice
      }
    });
  };

  // Build the list of visual layers (quilted cover + core layers)
  const coreLayers = coreData.getLayers(thicknessVal);
  const visualLayers = [
    { 
      name: 'Premium Fabric Quilted Cover', 
      height: 0.75, 
      color: 'linear-gradient(to bottom, rgba(255,255,255,0.25) 0%, transparent 40%, rgba(0,0,0,0.12) 100%), url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'><path d=\'M0 12 L12 0 L24 12 L12 24 Z\' fill=\'none\' stroke=\'%23E2DFD9\' stroke-width=\'1\'/></svg>")', 
      desc: 'Breathable organic cover quilted with soft fiber loops.', 
      type: 'cover', 
      suffix: '(Quilted Cover)',
      backgroundSize: 'auto, 12px 12px',
      backgroundColor: '#FFFFFF'
    },
    ...coreLayers
  ];

  return (
    <div className="relative pb-[76px] lg:pb-0">
      
      {/* Main Configurator Container Box */}
      <div className="bg-[#FFFDFC] rounded-[16px] border border-[#E0D8CE]/60 shadow-[0_10px_30px_rgba(32,23,18,0.05)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 animate-fade-in">
        
        {/* Left Side Spec Controls */}
        <div className="lg:col-span-7 p-5 md:p-8 flex flex-col justify-between select-none">
          <div>
            <h3 className="text-xl md:text-2xl font-serif font-bold text-[#201712] mb-1">Select Custom Specifications</h3>
            <p className="text-xs text-[#6D6258] mb-5">Choose core materials, sizes, and slide the mattress depth</p>

            {/* 1. Core Selection Grid (Horizontally scrollable on mobile/tablet, grid on desktop) */}
            <div className="mb-5">
              <label className="block text-[10px] font-bold text-[#201712] uppercase tracking-[1.5px] mb-2">
                1. Choose Mattress Type
              </label>
              <div className="flex overflow-x-auto snap-x snap-mandatory gap-2.5 pb-3 md:pb-0 md:grid md:grid-cols-2 lg:grid-cols-4 scrollbar-none">
                {MATTRESS_TYPES.map((c, idx) => {
                  const isSelected = selectedCore === c.id;
                  const spanClass = idx === 6 ? 'md:col-span-2 lg:col-span-2' : '';
                  return (
                    <label 
                      key={c.id}
                      className={`border p-2.5 flex flex-col justify-between cursor-pointer transition-all duration-200 select-none rounded-xl relative flex-shrink-0 w-[135px] md:w-auto snap-start ${spanClass} ${
                        isSelected 
                          ? 'border-[#8B6844] bg-[#F4F1EC] shadow-sm' 
                          : 'border-[#E0D8CE]/60 bg-[#FFFDFC] hover:border-[#8B6844]/60'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="config-core" 
                        value={c.id} 
                        checked={isSelected}
                        onChange={(e) => setSelectedCore(e.target.value)}
                        className="hidden"
                      />
                      
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-[#8B6844] text-white rounded-full flex items-center justify-center font-bold text-[8px] z-10 shadow-sm">
                          ✓
                        </div>
                      )}
                      
                      <div className="flex flex-col gap-2 flex-grow">
                        {/* 3D Realistic Isometric vector icon header */}
                        <div className="w-full h-12 bg-[#F4F1EC] rounded-lg border border-[#E0D8CE]/60 flex items-center justify-center p-1 overflow-hidden">
                          {renderIsometricIcon(c.id)}
                        </div>
                        
                        <div className="flex flex-col flex-grow justify-between min-h-[48px]">
                          <div>
                            <span className="block font-serif font-bold text-[10px] md:text-[10.5px] text-[#201712] leading-tight mb-0.5">{c.name}</span>
                            <span className="block text-[8.5px] text-[#6D6258] leading-snug line-clamp-2">{c.desc}</span>
                          </div>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Grid for Dimensions and Slider */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              {/* 2. Dimensions Selection */}
              <div>
                <label htmlFor="config-size" className="block text-[10px] font-bold text-[#201712] uppercase tracking-[1.5px] mb-2">
                  2. Select Dimensions (Inches)
                </label>
                <select
                  id="config-size"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full bg-[#F4F1EC] border border-[#E0D8CE]/60 rounded-lg py-2 px-3 text-xs font-semibold focus:outline-none focus:border-[#8B6844] text-[#201712] cursor-pointer"
                >
                  {config.sizes.map((s, idx) => (
                    <option key={idx} value={s.name}>{s.name} Bed Dimensions</option>
                  ))}
                </select>
              </div>

              {/* 3. Thickness Slider */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label htmlFor="config-thickness" className="text-[10px] font-bold text-[#201712] uppercase tracking-[1.5px]">
                    3. Thickness Depth
                  </label>
                  <span className="bg-[#F4F1EC] text-[#8B6844] border border-[#8B6844]/20 px-2.5 py-0.5 font-bold text-xs rounded-md">
                    {thicknessVal} inches
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#6D6258]">4"</span>
                  <input 
                    id="config-thickness"
                    type="range" 
                    min="4" 
                    max="10" 
                    value={thicknessVal}
                    onChange={handleSliderChange}
                    className="w-full h-1 cursor-pointer accent-[#8B6844]"
                  />
                  <span className="text-xs font-bold text-[#6D6258]">10"</span>
                </div>
              </div>
            </div>

            {/* 4. Dynamic Layer Composition */}
            <div className="mt-4 border-t border-[#E0D8CE]/40 pt-4">
              <h4 className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#8B6844] mb-3">
                4. Mattress Layer Composition
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {coreLayers.map((layer, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-[#F4F1EC] border border-[#E0D8CE]/60 p-2.5 rounded-lg hover:border-[#8B6844]/40 transition-all duration-200 shadow-sm">
                    <div className="w-9 h-9 bg-[#FFFDFC] border border-[#E0D8CE]/60 rounded-md flex flex-col items-center justify-center flex-shrink-0 shadow-xs">
                      <span className="text-xs font-bold text-[#8B6844]">{layer.height}"</span>
                      <span className="text-[7.5px] uppercase tracking-wider text-[#6D6258]">thick</span>
                    </div>
                    <div className="flex-grow min-w-0">
                      <h5 className="text-xs font-bold text-[#201712] truncate">{layer.name}</h5>
                      <p className="text-[9.5px] text-[#6D6258] leading-tight line-clamp-2">{layer.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <span className="block text-[9px] text-[#6D6258]/80 italic mt-2">
                * Layer composition automatically adjusted based on selected type and thickness.
              </span>
            </div>

          </div>

          <button 
            onClick={handleCustomQuote}
            className="w-full border border-[#8B6844] text-[#8B6844] hover:bg-[#F4F1EC] bg-transparent text-[11px] font-bold py-2.5 rounded-lg tracking-wider uppercase transition-colors duration-200 mt-4 active:scale-[0.99] focus:outline-none"
          >
            Request Custom Measurements Quote
          </button>
        </div>

        {/* Right Side Visual Cross-Section & Dynamic Summary Panel */}
        <div className="lg:col-span-5 bg-transparent lg:bg-[#201712] p-5 md:p-8 flex flex-col justify-between relative overflow-hidden border-t lg:border-t-0 lg:border-l border-[#E0D8CE]/20 min-h-[440px]">
          {/* Ambient background glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#8B6844]/10 blur-3xl pointer-events-none rounded-full"></div>

          {/* Live Preview Container (Visual cross-section wrapped inside a responsive card) */}
          <div className="bg-[#201712] lg:bg-transparent p-5 lg:p-0 rounded-xl lg:rounded-none shadow-xs lg:shadow-none mb-6">
            <div className="mb-4">
              <span className="inline-block bg-[#8B6844] text-white font-bold text-[9px] uppercase tracking-[1.5px] py-1 px-2.5 rounded-md mb-2">
                Visual Mattress Cross-Section
              </span>
              <h4 className="text-xl font-serif font-bold text-[#F4F1EC] mb-1">{coreData.name}</h4>
              <p className="text-xs text-[#E0D8CE]/80">{thicknessVal} Inch Mattress Layer Stack</p>
            </div>

            {/* Interactive Stack Visualizer (Stretches to full width on mobile) */}
            <div className="relative py-2 flex flex-col items-center justify-center min-h-[200px]">
              <div className="w-full max-w-none md:max-w-[280px] flex flex-col gap-1 z-10">
                {visualLayers.map((layer, idx) => {
                  const layerHeight = Math.max(24, Math.min(80, Math.round(layer.height * 22)));
                  return (
                    <div key={idx} className="relative flex items-center group">
                      
                      {/* The 3D Realistic Texture Layer slab */}
                      <div 
                        className={`layer-3d flex-grow rounded-md text-[8.5px] text-[#201712] font-bold relative overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_3px_5px_rgba(0,0,0,0.18)]`}
                        style={{ 
                          backgroundColor: layer.backgroundColor,
                          backgroundImage: layer.color,
                          backgroundSize: layer.backgroundSize || 'auto',
                          backgroundRepeat: layer.backgroundRepeat || 'repeat',
                          height: `${layerHeight}px`
                        }}
                      >
                        {/* Highlights & shadow overlay for 3D volume */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-black/25 pointer-events-none"></div>
                      </div>
                      
                      {/* Connector Line */}
                      <div className="w-4 h-[1px] border-b border-dashed border-stone-500/30 flex-shrink-0"></div>
                      
                      {/* Label Text with Functional Suffix */}
                      <div className="w-[115px] md:w-[130px] text-left text-[9px] md:text-[9.5px] text-stone-300 font-medium leading-tight truncate flex-shrink-0">
                        {layer.height}" {layer.name.replace('Premium ', '').replace('High Density ', '')} <span className="text-[7.5px] text-stone-400/80 font-normal">{layer.suffix}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Pricing Summary Card */}
          <div className="bg-[#FFFDFC] border border-[#E0D8CE]/70 p-4 rounded-xl mt-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <h5 className="text-[9.5px] font-bold uppercase tracking-[1.5px] text-[#8B6844] mb-2 pb-1 border-b border-[#E0D8CE]/40">
              Price Summary
            </h5>
            <ul className="flex flex-col gap-1.5 text-xs text-[#6D6258] mb-4">
              <li className="flex justify-between">
                <span className="text-[#6D6258]">Mattress Type:</span>
                <span className="font-semibold text-[#201712] truncate max-w-[155px]">{coreData.name}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-[#6D6258]">Bed Size:</span>
                <span className="font-semibold text-[#201712] truncate max-w-[155px]">{selectedSize}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-[#6D6258]">Thickness:</span>
                <span className="font-semibold text-[#201712]">{thicknessVal} inches</span>
              </li>
              <li className="flex justify-between">
                <span className="text-[#6D6258]">Total Layers:</span>
                <span className="font-semibold text-[#201712]">{coreLayers.length} Layers</span>
              </li>
            </ul>
            
            <div className="flex justify-between items-end mb-3 border-t border-[#E0D8CE]/40 pt-2.5">
              <div>
                <span className="text-[8px] uppercase tracking-wider text-[#6D6258] font-bold block mb-0.5">Factory Price</span>
                <span className="text-3xl font-serif font-extrabold text-[#201712]">₹{factoryPrice.toLocaleString('en-IN')}</span>
              </div>
              <span className="text-[9px] bg-[#F4F1EC] text-[#201712] font-extrabold px-2 py-0.5 border border-[#201712]/20 rounded-md">
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
          <span className="text-lg font-serif font-bold text-[#F4F1EC]">₹{factoryPrice.toLocaleString('en-IN')}</span>
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

    </div>
  );
};

export default MattressConfigurator;
