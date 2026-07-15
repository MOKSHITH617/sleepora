import React from 'react';
import { useLocation } from 'react-router-dom';
import ContactForm from '../components/ContactForm';
import MetaTags from '../components/MetaTags';

const Contact = () => {
  const location = useLocation();

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

  return (
    <div className="max-w-[1200px] mx-auto px-6 pt-10 pb-[25px] select-none bg-white">
      <MetaTags 
        title="Contact Us & Get Custom Quotes | Sleepora Mattress Factory"
        description="Get in touch with the Sleepora Mattress Factory. Request custom quotes, find showroom driving directions, or chat with the owner on WhatsApp."
        localBusinessSchema={localBusinessSchema}
      />

      <div className="text-center max-w-[650px] mx-auto mb-4 animate-fade-in">
        <span className="text-xs font-bold text-[#8B6844] uppercase tracking-[2px] mb-2 inline-block">Connect Directly</span>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#201712] mb-4">Request a Customized Quote</h1>
        <p className="text-[13px] text-[#6D6258] leading-relaxed">
          Do you need specialized measurements, commercial lodging volumes, or custom sofa shapes? Reach out below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Direct info and map */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          
          <div>
            <h3 className="text-lg font-serif font-bold text-[#201712] mb-5 border-b border-[#E0D8CE]/50 pb-2.5">
              Factory Contact Details
            </h3>
            <div className="flex flex-col gap-5 text-sm text-[#6D6258]">
              
              <div className="flex items-start gap-3">
                <span className="text-xl">📍</span>
                <div>
                  <h5 className="font-bold text-[#201712] text-xs uppercase tracking-wider mb-1">Factory Location</h5>
                  <p className="text-xs">Plot No. 42, Industrial Area, Sector 5, Near Metro Pillar 110, New Delhi, Pin 110015</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-xl">📞</span>
                <div>
                  <h5 className="font-bold text-[#201712] text-xs uppercase tracking-wider mb-1">Direct Calling Contact</h5>
                  <p className="text-xs">+91 98765 43210 / +91 98111 22233</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-xl">✉</span>
                <div>
                  <h5 className="font-bold text-[#201712] text-xs uppercase tracking-wider mb-1">Support Email Address</h5>
                  <p className="text-xs">sales@sleepora.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-xl">🕒</span>
                <div>
                  <h5 className="font-bold text-[#201712] text-xs uppercase tracking-wider mb-1">Operating Hours</h5>
                  <p className="text-xs">Monday - Sunday (9:00 AM - 8:30 PM)</p>
                </div>
              </div>

            </div>
          </div>

          {/* Simulated Google Search Listing and map preview */}
          <div className="border border-[#E0D8CE] rounded-none p-6 bg-[#FFFDFC] flex flex-col gap-4 shadow-md">
            <div className="flex justify-between items-center border-b border-[#E0D8CE]/50 pb-3">
              <span className="text-[9.5px] font-bold text-[#8B6844] uppercase tracking-[1.5px]">Owner Verified Listing</span>
              <span className="text-xs font-semibold text-[#25D366]">● Active</span>
            </div>
            
            <div>
              <h4 className="font-serif font-bold text-base text-[#201712]">Sleepora Mattress Factory</h4>
              <div className="flex items-center gap-1.5 text-xs text-[#8B6844] mt-1.5">
                <span className="font-bold text-[#F59E0B]">4.9</span>
                <span>★★★★★</span>
                <span className="text-[#6D6258] text-[10px]">(128 Google Reviews)</span>
              </div>
            </div>

            {/* Map Simulator */}
            <div className="w-full h-40 bg-[#F4F1EC] relative overflow-hidden rounded-none border border-[#E0D8CE] select-none flex items-center justify-center">
              {/* Road grids */}
              <div className="absolute top-[30%] left-0 w-full h-[6px] bg-[#FFFDFC] border-y border-[#E0D8CE]/50"></div>
              <div className="absolute top-0 left-[60%] w-[6px] h-full bg-[#FFFDFC] border-x border-[#E0D8CE]/50"></div>
              
              {/* Marker pin */}
              <div className="absolute top-[20%] left-[53%] flex flex-col items-center">
                <div className="w-4 h-4 bg-[#8B6844] rounded-full animate-ping absolute"></div>
                <div className="w-4 h-4 bg-[#201712] text-[#E0D8CE] rounded-none border border-white flex items-center justify-center text-[10px] font-black z-10 relative">
                  SP
                </div>
              </div>
              <span className="absolute top-[48%] left-[28%] bg-[#FFFDFC]/95 px-2 py-0.5 rounded-none shadow-xs text-[9px] font-bold border border-[#E0D8CE] text-[#201712]">
                Sleepora Factory
              </span>
            </div>

            <a 
              href="https://maps.google.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full btn-luxury-wood text-white text-xs font-bold py-2.5 rounded-none text-center transition-colors duration-200 uppercase tracking-wider"
            >
              Get Driving Directions on Google Maps
            </a>
          </div>

        </div>

        {/* Right Column: ContactForm component */}
        <div className="lg:col-span-7">
          <ContactForm initialData={initialQuoteData} />
        </div>

      </div>

    </div>
  );
};

export default Contact;
