import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import ContactForm from '../components/ContactForm';
import MetaTags from '../components/MetaTags';

const Contact = () => {
  const location = useLocation();
  const [openFaq, setOpenFaq] = useState(null);

  // State prefilled from catalogue card clicks
  const initialQuoteData = location.state || null;

  // Local Business structured schema definition for SEO
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Sleepora Mattress Factory",
    "image": `${window.location.origin}/images/factory_floor.png`,
    "telephone": "+919876543210",
    "email": "sales@sleepora.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Plot No. 42, Industrial Area, Sector 5",
      "addressLocality": "New Delhi",
      "postalCode": "110015",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "28.628223",
      "longitude": "77.127883"
    },
    "url": window.location.origin,
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "09:00",
        "closes": "20:30"
      }
    ]
  };

  const faqs = [
    {
      q: "Can I order mattresses or sofas in custom dimensions?",
      a: "Yes, absolutely! Since we operate our own manufacturing facilities, we can customize your mattresses or sofas to any precise measurements down to the centimeter. Simply use our interactive configurators or send us your measurements via the contact form."
    },
    {
      q: "What is your standard delivery timeline?",
      a: "For standard orders, dispatch takes 4-6 business days. For fully customized sofas or mattresses requiring custom fabric/material blends, manufacturing takes 7-10 business days followed by transit shipping."
    },
    {
      q: "Do you ship across India?",
      a: "Yes, we ship factory-direct to major cities across India. Mattress compression packaging allows us to ship safely and cost-effectively to your doorstep."
    },
    {
      q: "Can I choose my own upholstery fabrics for sofas?",
      a: "Yes, we offer over 200+ fabric choices in velvet, linen, suede, and leatherette. You can visit our factory showroom to feel the materials or ask our coordinator to send high-definition photos and swatches."
    }
  ];

  return (
    <div className="w-full px-6 md:px-8 pt-10 pb-[25px] select-none bg-white">
      <MetaTags 
        title="Contact Us & Get Custom Quotes | Sleepora Mattress Factory"
        description="Get in touch with the Sleepora Mattress Factory. Request custom quotes, find showroom driving directions, or chat with the owner on WhatsApp."
        localBusinessSchema={localBusinessSchema}
      />

      {/* SECTION 1: HERO HEADER */}
      <div className="text-center max-w-[800px] mx-auto py-16 md:py-24 animate-fade-in select-none">
        <span className="text-xs font-bold text-[#8B6844] uppercase tracking-[3px] mb-3.5 inline-block">Connect Directly</span>
        <h1 className="text-4xl md:text-5.5xl font-serif font-bold text-[#201712] mb-6 leading-tight">Request a Customized Quote</h1>
        <p className="text-sm md:text-base text-[#6D6258] leading-relaxed max-w-[640px] mx-auto font-light">
          Do you need specialized measurements, commercial lodging volumes, or custom sofa shapes? Reach out below or contact our manufacturing coordinators directly.
        </p>
      </div>

      {/* SECTION 2: GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-start pb-20 border-b border-[#E0D8CE]/40">
        
        {/* Left Column: Direct Info & Map */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          
          <div className="bg-[#F8F5EF] p-8 rounded-2xl flex flex-col gap-6">
            <h3 className="text-lg font-serif font-bold text-[#201712] pb-3 border-b border-[#E0D8CE]/40">
              Factory Contact Details
            </h3>
            
            <div className="flex flex-col gap-6 text-stone-600">
              <div className="flex items-start gap-4">
                <span className="text-xl text-[#8B6844] mt-0.5">📍</span>
                <div>
                  <h5 className="font-bold text-[#201712] text-xs uppercase tracking-wider mb-1">Factory Location</h5>
                  <p className="text-xs leading-relaxed">Plot No. 42, Industrial Area, Sector 5, Near Metro Pillar 110, New Delhi, Pin 110015</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-xl text-[#8B6844] mt-0.5">📞</span>
                <div>
                  <h5 className="font-bold text-[#201712] text-xs uppercase tracking-wider mb-1">Direct Calling Contact</h5>
                  <p className="text-xs leading-relaxed">+91 98765 43210 / +91 98111 22233</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-xl text-[#8B6844] mt-0.5">✉</span>
                <div>
                  <h5 className="font-bold text-[#201712] text-xs uppercase tracking-wider mb-1">Support Email Address</h5>
                  <p className="text-xs leading-relaxed">sales@sleepora.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-xl text-[#8B6844] mt-0.5">🕒</span>
                <div>
                  <h5 className="font-bold text-[#201712] text-xs uppercase tracking-wider mb-1">Operating Hours</h5>
                  <p className="text-xs leading-relaxed">Monday - Sunday (9:00 AM - 8:30 PM)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Simulated Google Search Listing and map preview */}
          <div className="border border-[#E0D8CE]/50 rounded-2xl p-8 bg-[#FFFDFC] flex flex-col gap-5 shadow-luxury">
            <div className="flex justify-between items-center border-b border-[#E0D8CE]/40 pb-4">
              <span className="text-[10px] font-bold text-[#8B6844] uppercase tracking-[2px]">Owner Verified Listing</span>
              <span className="text-xs font-semibold text-[#25D366] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span> Active
              </span>
            </div>
            
            <div>
              <h4 className="font-serif font-bold text-lg text-[#201712]">Sleepora Mattress Factory</h4>
              <div className="flex items-center gap-2 text-xs text-[#8B6844] mt-1.5">
                <span className="font-bold text-[#F59E0B] text-sm">4.9</span>
                <span className="text-[#F59E0B]">★★★★★</span>
                <span className="text-[#6D6258] text-[11px]">(128 Google Reviews)</span>
              </div>
            </div>

            {/* Map Simulator */}
            <div className="w-full h-44 bg-[#F8F5EF] relative overflow-hidden rounded-xl border border-[#E0D8CE]/60 select-none flex items-center justify-center">
              {/* Road grids */}
              <div className="absolute top-[30%] left-0 w-full h-[6px] bg-[#FFFDFC] border-y border-[#E0D8CE]/30"></div>
              <div className="absolute top-0 left-[60%] w-[6px] h-full bg-[#FFFDFC] border-x border-[#E0D8CE]/30"></div>
              
              {/* Marker pin */}
              <div className="absolute top-[20%] left-[53%] flex flex-col items-center">
                <div className="w-5 h-5 bg-[#8B6844] rounded-full animate-ping absolute"></div>
                <div className="w-5 h-5 bg-[#201712] text-[#E0D8CE] rounded-none border border-white flex items-center justify-center text-[10px] font-black z-10 relative">
                  SP
                </div>
              </div>
              <span className="absolute top-[48%] left-[28%] bg-[#FFFDFC] px-2.5 py-1 rounded-sm shadow-sm text-[10px] font-bold border border-[#E0D8CE] text-[#201712]">
                Sleepora Factory
              </span>
            </div>

            <a 
              href="https://maps.google.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full btn-luxury-wood text-white text-xs font-bold py-3.5 rounded-xl text-center transition-colors duration-200 uppercase tracking-wider"
            >
              Get Driving Directions
            </a>
          </div>

        </div>

        {/* Right Column: ContactForm inside premium card */}
        <div className="lg:col-span-7 bg-[#FFFDFC] border border-[#E0D8CE]/50 p-8 md:p-12 rounded-2xl shadow-luxury">
          <ContactForm initialData={initialQuoteData} />
        </div>

      </div>

      {/* SECTION 3: DIRECT CONTACT CARDS */}
      <div className="py-20 border-b border-[#E0D8CE]/40">
        <div className="text-center max-w-[650px] mx-auto mb-12">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#201712]">Prefer Direct Channels?</h2>
          <p className="text-xs text-[#8E7D75] mt-2">Skip the form and connect with our team via your preferred communication method.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#F8F5EF] p-8 rounded-2xl flex flex-col justify-between items-center text-center gap-6 group hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm border border-[#E0D8CE]/30">💬</div>
            <div>
              <h4 className="font-serif font-bold text-base text-[#201712] mb-2">WhatsApp Chat</h4>
              <p className="text-xs text-[#8E7D75] leading-relaxed">Instant response directly from our factory owners.</p>
            </div>
            <a 
              href="https://wa.me/919876543210?text=Hi%20Sleepora!%20I'd%20like%20to%20discuss%20a%20customized%20mattress%20or%20sofa%20quotation."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-[10.5px] uppercase tracking-wider rounded-xl text-center shadow-xs transition-colors"
            >
              Message Us
            </a>
          </div>

          <div className="bg-[#F8F5EF] p-8 rounded-2xl flex flex-col justify-between items-center text-center gap-6 group hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm border border-[#E0D8CE]/30">📞</div>
            <div>
              <h4 className="font-serif font-bold text-base text-[#201712] mb-2">Direct Phone Call</h4>
              <p className="text-xs text-[#8E7D75] leading-relaxed">Call us during operations hours for quick assistance.</p>
            </div>
            <a 
              href="tel:+919876543210"
              className="w-full py-3 btn-luxury-wood text-white font-bold text-[10.5px] uppercase tracking-wider rounded-xl text-center shadow-xs transition-colors"
            >
              Call +91 98765 43210
            </a>
          </div>

          <div className="bg-[#F8F5EF] p-8 rounded-2xl flex flex-col justify-between items-center text-center gap-6 group hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm border border-[#E0D8CE]/30">✉</div>
            <div>
              <h4 className="font-serif font-bold text-base text-[#201712] mb-2">Email Support</h4>
              <p className="text-xs text-[#8E7D75] leading-relaxed">Send us detailed floor plans, specifications, or drawings.</p>
            </div>
            <a 
              href="mailto:sales@sleepora.com"
              className="w-full py-3 btn-luxury-dark text-white font-bold text-[10.5px] uppercase tracking-wider rounded-xl text-center shadow-xs transition-colors"
            >
              Email sales@sleepora.com
            </a>
          </div>
        </div>
      </div>

      {/* SECTION 4: FAQ ACCORDION */}
      <div className="py-20 border-b border-[#E0D8CE]/40">
        <div className="text-center max-w-[650px] mx-auto mb-12">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#201712]">Frequently Asked Questions</h2>
          <p className="text-xs text-[#8E7D75] mt-2">Find quick answers to common questions about factory orders and customization.</p>
        </div>

        <div className="max-w-[850px] mx-auto space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="bg-[#FFFDFC] border border-[#E0D8CE]/50 rounded-xl overflow-hidden shadow-xs transition-all duration-300">
                <button 
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-6 py-4 flex justify-between items-center text-left text-[#201712] font-semibold text-sm hover:bg-[#F8F5EF] transition-colors focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <span className="text-[#8B6844] font-bold text-lg">{isOpen ? '−' : '+'}</span>
                </button>
                <div className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-40 border-t border-[#E0D8CE]/30' : 'max-h-0'}`}>
                  <p className="p-6 text-xs text-[#6D6258] leading-relaxed bg-[#FFFDFC]">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 5: CALL TO ACTION BANNER */}
      <div className="py-16 md:py-24 text-center select-none">
        <div className="bg-[#201712] text-white p-8 md:p-16 rounded-3xl relative overflow-hidden shadow-luxury">
          {/* Accent light glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#8B6844]/10 blur-3xl pointer-events-none rounded-full"></div>
          
          <div className="relative z-10 max-w-[700px] mx-auto space-y-6">
            <span className="text-[10px] font-bold text-[#8B6844] uppercase tracking-[3px]">Tailored Luxury</span>
            <h2 className="text-3xl md:text-4.5xl font-serif font-bold leading-tight">Create Your Masterpiece</h2>
            <p className="text-xs text-stone-300 leading-relaxed max-w-[520px] mx-auto font-light">
              Our master craftsmen are ready to bring your design ideas to life. Send us your requirements today, and get a factory-direct quote.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link 
                to="/sofas"
                className="btn-luxury-wood px-8 py-3.5 text-xs font-bold uppercase tracking-wider rounded-full text-center"
              >
                Configure Sofa
              </Link>
              <Link 
                to="/mattresses"
                className="bg-white hover:bg-stone-100 text-[#201712] px-8 py-3.5 text-xs font-bold uppercase tracking-wider rounded-full text-center transition-all duration-300"
              >
                Configure Mattress
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Contact;
