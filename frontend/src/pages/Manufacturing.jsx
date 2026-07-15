import React, { useEffect, useRef, useState } from 'react';
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
        threshold: 0.15,
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
      className={`transition-all duration-700 transform ${
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
      title: 'Raw Material Selection & Processing',
      subtitle: 'Pure density chemical blocks and organic fibers',
      desc: 'We procure strictly certified polyurethane foam components, organic bamboo yarn, and 100% natural organic pin-core rubber latex sheets. Every batch undergoes thickness check guidelines before joining raw stockpiles.',
      img: '/images/latex_mattress.png'
    },
    {
      step: '02',
      title: 'Chemical Foaming & Curing',
      subtitle: 'High density polymer cell curing process',
      desc: 'Our curing chambers are temperature-regulated. High resilience base blocks cure inside aerated logistics columns for 48 hours to secure structural integrity and density ratings before profiling.',
      img: '/images/workers_crafting.png'
    },
    {
      step: '03',
      title: 'CNC Precision profiling & Slicing',
      subtitle: 'Computer-guided slicing matching dimensions',
      desc: 'Cured foam block bases are fed through automated high-velocity steel slicing rigs. The blades shape exact custom bed dimensions (length and width coordinates) to centimeter-perfect sizes.',
      img: '/images/factory_floor.png'
    },
    {
      step: '04',
      title: 'Organic Multi-Needle Quilting',
      subtitle: 'High thread density cover quilted support layers',
      desc: 'Premium organic cotton or breathable bamboo fabric grids are loaded onto multi-needle quilting panels, sewing soft polyurethane cushioning loops directly under core cover layers.',
      img: '/images/ortho_mattress.png'
    },
    {
      step: '05',
      title: 'Tape Edge Sewing & Stitching',
      subtitle: 'Rigid double lock borders and tape edges',
      desc: 'Craftsmen wrap heavy-duty binding tape around mattress edges. Our double-lock machines stitch core borders to prevent edge collapse and secure long-term cover durability.',
      img: '/images/pocket_spring.png'
    },
    {
      step: '06',
      title: 'Compression Quality Testing',
      subtitle: 'Press diagnostic deflection checks',
      desc: 'Before loading onto factory transport, every item passes automated press checks. This verifies core load deflection indexes (ILDs) match firmness parameters perfectly.',
      img: '/images/coir_mattress.png'
    }
  ];

  return (
    <div className="max-w-[1480px] mx-auto px-6 pt-10 pb-[25px] select-none bg-[#F4F1EC]">
      <MetaTags 
        title="Our Manufacturing Capability | Direct Mattress Factory"
        description="Take a look inside our manufacturing floor. Learn how we foam, cut, stitch, and test our premium mattresses and custom sofas direct from raw materials."
      />

      <div className="text-center max-w-[650px] mx-auto mb-4 animate-fade-in">
        <span className="text-xs font-bold text-[#8B6844] uppercase tracking-[2px] mb-3 inline-block">Direct From Factory</span>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#201712] mb-4">Inside Our Manufacturing Operations</h1>
        <p className="text-[13px] text-[#6D6258] leading-relaxed">
          We do not just retail mattresses. We run independent foaming, slicing, cover sewing, and edge tape binding machines to control comfort standards.
        </p>
      </div>

      {/* --- IMAGE COLLAGE DISPLAY --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="md:col-span-2 relative pt-[50%] overflow-hidden border border-[#E0D8CE]/60 shadow-sm rounded-none bg-[#FFFDFC] p-2 group">
          <img 
            src="/images/factory_floor.png" 
            alt="Factory assembly floor" 
            className="absolute inset-0 w-full h-full object-cover p-2 transition-transform duration-700 group-hover:scale-[1.025]" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6 m-2 z-10">
            <span className="text-white font-serif font-bold text-lg tracking-wide">Sleepora Assembly Operations Floor</span>
          </div>
        </div>
        
        <div className="grid grid-rows-2 gap-5">
          <div className="relative pt-[50%] md:pt-0 overflow-hidden border border-[#E0D8CE]/60 shadow-sm rounded-none bg-[#FFFDFC] p-1.5 group">
            <img 
              src="/images/workers_crafting.png" 
              alt="Stitching cover tape edges" 
              className="absolute inset-0 w-full h-full object-cover p-1.5 transition-transform duration-700 group-hover:scale-[1.025]" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-4 m-1.5 z-10">
              <span className="text-white font-serif font-bold text-xs tracking-wide">Edge Tape Binding Machine</span>
            </div>
          </div>
          <div className="relative pt-[50%] md:pt-0 overflow-hidden border border-[#E0D8CE]/60 shadow-sm rounded-none bg-[#FFFDFC] p-1.5 group">
            <img 
              src="/images/latex_mattress.png" 
              alt="Natural Latex Curing" 
              className="absolute inset-0 w-full h-full object-cover p-1.5 transition-transform duration-700 group-hover:scale-[1.025]" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-4 m-1.5 z-10">
              <span className="text-white font-serif font-bold text-xs tracking-wide">Natural Latex Curing Core Blocks</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- STEPS TIMELINE STORYTELLING --- */}
      <div className="relative border-l border-[#8B6844]/40 ml-4 md:ml-36 pl-8 md:pl-12 space-y-6">
        
        {steps.map((s, idx) => (
          <ScrollRevealItem key={idx} delay={idx % 2 * 100}>
            <div className="relative group mb-10 last:mb-0">
              {/* Step node indicator */}
              <span className="absolute -left-[50px] md:-left-[80px] top-0 w-9 h-9 bg-[#FFFDFC] text-[#8B6844] rounded-none border border-[#8B6844] flex items-center justify-center font-serif font-bold text-sm shadow-sm group-hover:bg-[#8B6844] group-hover:text-white group-hover:scale-110 transition-all duration-300">
                {s.step}
              </span>

              {/* Content card */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#FFFDFC] border border-[#E0D8CE] rounded-none shadow-md p-5 md:p-6 group-hover:border-[#8B6844] group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300 transform">
                
                <div className="md:col-span-8">
                  <span className="text-[10px] font-bold text-[#8B6844] uppercase tracking-[1.5px] mb-1.5 block">
                    {s.subtitle}
                  </span>
                  <h3 className="text-xl font-serif font-bold text-[#201712] mb-3">
                    {s.title}
                  </h3>
                  <p className="text-[12px] text-[#6D6258] leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                <div className="md:col-span-4 relative pt-[50%] md:pt-[70%] rounded-none overflow-hidden border border-[#E0D8CE]/50 bg-[#F4F1EC]">
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
  );
};

export default Manufacturing;
