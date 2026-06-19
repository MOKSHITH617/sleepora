import React from 'react';
import MetaTags from '../components/MetaTags';

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
    <div className="max-w-[1200px] mx-auto px-6 py-12 select-none">
      <MetaTags 
        title="Our Manufacturing Capability | Direct Mattress Factory"
        description="Take a look inside our manufacturing floor. Learn how we foam, cut, stitch, and test our premium mattresses and custom sofas direct from raw materials."
      />

      <div className="text-center max-w-[650px] mx-auto mb-16">
        <span className="text-xs font-bold text-accent uppercase tracking-wider mb-2 inline-block">Direct From Factory</span>
        <h1 className="text-3xl md:text-4xl font-extrabold font-display mb-4">Inside Our Manufacturing Operations</h1>
        <p className="text-sm text-text-muted leading-relaxed">
          We do not just retail mattresses. We run independent foaming, slicing, cover sewing, and edge tape binding machines to control comfort standards.
        </p>
      </div>

      {/* --- IMAGE COLLAGE DISPLAY --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        <div className="md:col-span-2 relative pt-[50%] rounded-md overflow-hidden border border-border shadow-sm">
          <img src="/images/factory_floor.png" alt="Factory assembly floor" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
            <span className="text-white font-display font-semibold text-lg">TimeWell Assembly Operations Floor</span>
          </div>
        </div>
        
        <div className="grid grid-rows-2 gap-6">
          <div className="relative pt-[50%] md:pt-0 rounded-md overflow-hidden border border-border shadow-sm">
            <img src="/images/workers_crafting.png" alt="Stitching cover tape edges" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-4">
              <span className="text-white font-display font-semibold text-xs">Edge Tape Binding Machine</span>
            </div>
          </div>
          <div className="relative pt-[50%] md:pt-0 rounded-md overflow-hidden border border-border shadow-sm">
            <img src="/images/latex_mattress.png" alt="Natural Latex Curing" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-4">
              <span className="text-white font-display font-semibold text-xs">Natural Latex Curing Core Blocks</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- STEPS TIMELINE STORYTELLING --- */}
      <div className="relative border-l-2 border-border ml-4 md:ml-36 pl-8 md:pl-12 space-y-16">
        
        {steps.map((s, idx) => (
          <div key={idx} className="relative animate-fade-in">
            {/* Step node indicator */}
            <span className="absolute -left-[50px] md:-left-[82px] top-0 w-[36px] h-[36px] bg-primary text-accent rounded-full border-2 border-white flex items-center justify-center font-display font-bold text-sm shadow-md">
              {s.step}
            </span>

            {/* Content card */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white border border-border rounded-md shadow-sm p-6 md:p-8 hover:border-accent/30 transition-all duration-300">
              
              <div className="md:col-span-8">
                <span className="text-[10px] font-bold text-accent uppercase tracking-wider mb-1 block">
                  {s.subtitle}
                </span>
                <h3 className="text-xl font-bold font-display text-primary mb-3">
                  {s.title}
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <div className="md:col-span-4 relative pt-[50%] md:pt-[70%] rounded-sm overflow-hidden border border-border bg-bg-light">
                <img src={s.img} alt={s.title} className="absolute inset-0 w-full h-full object-cover" />
              </div>

            </div>
          </div>
        ))}

      </div>

    </div>
  );
};

export default Manufacturing;
