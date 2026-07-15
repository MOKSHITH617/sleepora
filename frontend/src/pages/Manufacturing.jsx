import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import MetaTags from '../components/MetaTags';

const ScrollRevealItem = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={elementRef}
      className={`transition-all duration-1000 transform ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-12 scale-[0.98] pointer-events-none'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const Manufacturing = () => {
  const steps = [
    {
      step: '01',
      title: 'Raw Material Selection',
      subtitle: 'Pure density organic blocks',
      desc: 'We procure strictly certified organic bamboo yarns, high thread count textiles, and 100% natural organic pin-core rubber latex sheets to build our foundation.',
      img: '/images/latex_mattress.png'
    },
    {
      step: '02',
      title: 'Foam Processing & Curing',
      subtitle: 'High density polymer cell curing',
      desc: 'Our foam blocks cure inside aerated, temperature-regulated logistics columns for 48 hours to secure structural integrity and density ratings before profiling.',
      img: '/images/workers_crafting.png'
    },
    {
      step: '03',
      title: 'CNC Assembly & profiling',
      subtitle: 'Precision computer-guided slicing',
      desc: 'Cured foam block bases are fed through automated high-velocity steel slicing rigs, shaping exact custom dimensions down to the centimeter.',
      img: '/images/factory_floor.png'
    },
    {
      step: '04',
      title: 'Quality Check & Deflection ILD',
      subtitle: 'Rigid deflection audit tests',
      desc: 'Before stitching, every core passes automated press checks. This verifies the load deflection index (ILD) matches required firmness parameters.',
      img: '/images/ortho_mattress.png'
    },
    {
      step: '05',
      title: 'Compressed Packaging',
      subtitle: 'Hermetic seal compression',
      desc: 'Finished mattresses are vacuum compressed and rolled in heavy-gauge plastic. This ensures safe, hygienic, and cost-effective shipping.',
      img: '/images/pocket_spring.png'
    },
    {
      step: '06',
      title: 'Direct Delivery',
      subtitle: 'Express home logistics shipping',
      desc: 'We coordinate with major courier partners to ship directly from our production floor to your doorstep, cutting out retail markup costs entirely.',
      img: '/images/coir_mattress.png'
    }
  ];

  const highlights = [
    {
      icon: '🪵',
      title: 'Direct Procurement',
      desc: 'Certified organic bamboo yarns, high density foams, and 100% natural pin-core rubber latex sheets.'
    },
    {
      icon: '⏳',
      title: '48h Curing Process',
      desc: 'Every support core is cured inside aerated climate chambers to secure structural integrity.'
    },
    {
      icon: '📐',
      title: 'CNC Precision Profiling',
      desc: 'Automated high-velocity steel slicing rigs cut bases down to centimeter-perfect dimensions.'
    },
    {
      icon: '🪡',
      title: 'Multi-Needle Quilting',
      desc: 'Plush organic cotton or breathable bamboo textiles are quilted directly with comfort foam loops.'
    },
    {
      icon: '🧵',
      title: 'Double Lock Bordering',
      desc: 'Heavy-duty binding tape double stitched along borders to prevent side sag or edge collapse.'
    },
    {
      icon: '⚖️',
      title: 'Deflection ILD Tests',
      desc: 'Indentation Load Deflection audits ensure support firmness values match target specs.'
    }
  ];

  const certs = [
    {
      name: 'CertiPUR-US® Certified',
      desc: 'Foams analyzed by independent laboratories to be free of ozone depleters, heavy metals, and formaldehyde.'
    },
    {
      name: 'Oeko-Tex Standard 100',
      desc: 'Every thread and layer of fabric has been tested for harmful substances, ensuring absolute dermatological safety.'
    },
    {
      name: 'ISO 9001:2015 Quality',
      desc: 'Manufactured under international guidelines for quality management, standardized workflows, and material testing.'
    },
    {
      name: '100% Organic Latex',
      desc: 'Eco-friendly organic pin-core rubber latex containing no synthetic chemical additives or toxic compounds.'
    }
  ];

  return (
    <div className="w-full px-6 md:px-8 pt-10 pb-[25px] select-none bg-white">
      <MetaTags 
        title="Our Manufacturing Capability | Direct Mattress Factory"
        description="Take a look inside our manufacturing floor. Learn how we foam, cut, stitch, and test our premium mattresses and custom sofas direct from raw materials."
      />

      {/* SECTION 1: HERO HEADER */}
      <div className="text-center max-w-[800px] mx-auto py-16 md:py-24 animate-fade-in select-none">
        <span className="text-xs font-bold text-[#8B6844] uppercase tracking-[3px] mb-3.5 inline-block">Direct From Factory</span>
        <h1 className="text-4xl md:text-5.5xl font-serif font-bold text-[#201712] mb-6 leading-tight">Inside Our Manufacturing Operations</h1>
        <p className="text-sm md:text-base text-[#6D6258] leading-relaxed max-w-[640px] mx-auto font-light">
          We operate independent foaming, slicing, cover sewing, and edge tape binding machines to control comfort standards. Comfort and durability, straight from the assembly floor.
        </p>
      </div>

      {/* SECTION 2: GALLERY COLLAGE */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 mb-24 max-w-[1500px] mx-auto">
        <div className="lg:col-span-7 relative pt-[50%] overflow-hidden border border-[#E0D8CE]/50 shadow-md rounded-2xl bg-[#FFFDFC] group">
          <img 
            src="/images/factory_floor.png" 
            alt="Factory assembly floor" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.025]" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent flex items-end p-8 z-10">
            <span className="text-white font-serif font-bold text-xl md:text-2xl tracking-wide">Sleepora Assembly Operations Floor</span>
          </div>
        </div>
        
        <div className="lg:col-span-3 grid grid-rows-2 gap-6">
          <div className="relative pt-[50%] lg:pt-0 overflow-hidden border border-[#E0D8CE]/50 shadow-md rounded-2xl bg-[#FFFDFC] group">
            <img 
              src="/images/workers_crafting.png" 
              alt="Stitching cover tape edges" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.025]" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent flex items-end p-5 z-10">
              <span className="text-white font-serif font-bold text-sm tracking-wide">Edge Tape Binding Machine</span>
            </div>
          </div>
          <div className="relative pt-[50%] lg:pt-0 overflow-hidden border border-[#E0D8CE]/50 shadow-md rounded-2xl bg-[#FFFDFC] group">
            <img 
              src="/images/latex_mattress.png" 
              alt="Natural Latex Curing" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.025]" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent flex items-end p-5 z-10">
              <span className="text-white font-serif font-bold text-sm tracking-wide">Natural Latex Curing Core Blocks</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: HIGHLIGHTS GRID */}
      <div className="py-24 bg-[#F8F5EF] rounded-3xl mb-24 max-w-[1500px] mx-auto px-6 md:px-12">
        <div className="text-center max-w-[650px] mx-auto mb-16">
          <h2 className="text-2xl md:text-3.5xl font-serif font-bold text-[#201712] mb-3">Our Core Standards</h2>
          <p className="text-xs text-[#8E7D75] tracking-wider uppercase font-medium">Bespoke Quality & Engineering</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {highlights.map((item, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-[#E0D8CE]/20 flex flex-col gap-4 group hover:-translate-y-1 transition-all duration-300">
              <span className="text-3xl filter saturate-75">{item.icon}</span>
              <div>
                <h4 className="font-serif font-bold text-base text-[#201712] mb-2">{item.title}</h4>
                <p className="text-xs text-[#6D6258] leading-relaxed font-light">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: TIMELINE */}
      <div className="py-24 mb-24 border-t border-b border-[#E0D8CE]/40 max-w-[1500px] mx-auto">
        <div className="text-center max-w-[650px] mx-auto mb-16">
          <h2 className="text-2xl md:text-3.5xl font-serif font-bold text-[#201712] mb-3">Precision Manufacturing Timeline</h2>
          <p className="text-xs text-[#8E7D75] leading-relaxed">How we assemble your custom mattress direct from raw material to home delivery.</p>
        </div>

        <div className="relative border-l border-[#8B6844]/30 ml-4 md:ml-36 pl-8 md:pl-16 space-y-12">
          {steps.map((s, idx) => (
            <ScrollRevealItem key={idx} delay={idx % 2 * 100}>
              <div className="relative group">
                {/* Step node indicator */}
                <span className="absolute -left-[50px] md:-left-[100px] top-1 w-10 h-10 bg-white text-[#8B6844] rounded-full border border-[#8B6844] flex items-center justify-center font-serif font-bold text-sm shadow-sm group-hover:bg-[#8B6844] group-hover:text-white group-hover:scale-110 transition-all duration-300">
                  {s.step}
                </span>

                {/* Content card */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#FFFDFC] border border-[#E0D8CE]/50 rounded-2xl shadow-sm p-6 md:p-8 hover:border-[#8B6844]/60 hover:shadow-luxury transition-all duration-300">
                  <div className="md:col-span-8 space-y-2">
                    <span className="text-[10px] font-bold text-[#8B6844] uppercase tracking-[1.5px] block">
                      {s.subtitle}
                    </span>
                    <h3 className="text-xl font-serif font-bold text-[#201712]">
                      {s.title}
                    </h3>
                    <p className="text-xs text-[#6D6258] leading-relaxed font-light">
                      {s.desc}
                    </p>
                  </div>

                  <div className="md:col-span-4 relative pt-[50%] md:pt-[65%] rounded-xl overflow-hidden border border-[#E0D8CE]/40 bg-[#F8F5EF]">
                    <img 
                      src={s.img} 
                      alt={s.title} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 contrast-105" 
                    />
                  </div>
                </div>
              </div>
            </ScrollRevealItem>
          ))}
        </div>
      </div>

      {/* SECTION 5: CERTIFICATIONS */}
      <div className="py-24 mb-24 bg-[#F8F5EF] rounded-3xl max-w-[1500px] mx-auto px-6 md:px-12">
        <div className="text-center max-w-[650px] mx-auto mb-16">
          <h2 className="text-2xl md:text-3.5xl font-serif font-bold text-[#201712] mb-3">Certifications & Quality Assurance</h2>
          <p className="text-xs text-[#8E7D75]">Independently tested and verified core components for clinical-level comfort safety.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {certs.map((item, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-[#E0D8CE]/20 flex gap-4 group hover:border-[#8B6844]/30 transition-all duration-300">
              <span className="text-[#8B6844] font-bold text-lg mt-0.5">✓</span>
              <div>
                <h4 className="font-serif font-bold text-base text-[#201712] mb-2">{item.name}</h4>
                <p className="text-xs text-[#6D6258] leading-relaxed font-light">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 6: CALL TO ACTION BANNER */}
      <div className="py-12 md:py-16 text-center select-none max-w-[1500px] mx-auto">
        <div className="bg-[#201712] text-white p-8 md:p-16 rounded-3xl relative overflow-hidden shadow-luxury">
          {/* Accent light glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#8B6844]/10 blur-3xl pointer-events-none rounded-full"></div>
          
          <div className="relative z-10 max-w-[700px] mx-auto space-y-6">
            <span className="text-[10px] font-bold text-[#8B6844] uppercase tracking-[3px]">Showroom & Tours</span>
            <h2 className="text-3xl md:text-4.5xl font-serif font-bold leading-tight">Visit Our Manufacturing Facility</h2>
            <p className="text-xs text-stone-300 leading-relaxed max-w-[520px] mx-auto font-light">
              See how we process natural latex, stitch borders, and perform ILD press checks. Meet our design coordinators and craft your custom furniture direct from the plant floor.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link 
                to="/contact"
                className="btn-luxury-wood px-8 py-3.5 text-xs font-bold uppercase tracking-wider rounded-full text-center"
              >
                Schedule Showroom Visit
              </Link>
              <Link 
                to="/contact"
                className="bg-white hover:bg-stone-100 text-[#201712] px-8 py-3.5 text-xs font-bold uppercase tracking-wider rounded-full text-center transition-all duration-300"
              >
                Request Custom Quotation
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Manufacturing;
