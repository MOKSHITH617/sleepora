import React, { useState, useEffect } from 'react';
import API from '../services/api';
import MetaTags from '../components/MetaTags';

const Stores = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await API.get('/website-content/store_locations');
        if (response.data.success && response.data.data) {
          setContent(response.data.data.content);
        }
      } catch (err) {
        console.warn('Failed to load store locations content from API, using fallback.');
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const fallbackContent = `TimeWell Mattress Factory operates showroom outlets directly attached to our manufacturing depots. Visit us to test orthopaedic models in person.

1. Main Factory Depot & Outlet (Delhi Central):
Plot No. 42, Industrial Area, Sector 5, Near Metro Pillar 110, New Delhi, Pin 110015.
Contact: +91 98765 43210 (Direct owner calling line).
Timings: Monday - Sunday (9:00 AM - 8:30 PM).

2. Southern Regional Distribution Center (Bengaluru Outlet):
Survey No 84, Outer Ring Road, Mahadevapura, Bengaluru, Karnataka, Pin 560048.
Contact: +91 98111 22233.
Timings: Tuesday - Sunday (10:00 AM - 8:00 PM).`;

  return (
    <div className="max-w-[1000px] mx-auto px-6 py-16 select-none animate-fade-in">
      <MetaTags 
        title="Store Locations & Factory Outlets | TimeWell Mattress"
        description="Find a TimeWell Mattress Factory outlet near you. Locate regional showrooms in Delhi and Bengaluru to try orthopedic mattress cores."
      />

      <div className="text-center max-w-[650px] mx-auto mb-16">
        <span className="text-xs font-bold text-accent uppercase tracking-wider mb-2 inline-block">Find Us Nearby</span>
        <h1 className="text-3xl md:text-4xl font-extrabold font-display mb-4 text-primary">Store Locations & Outlets</h1>
        <p className="text-sm text-text-muted leading-relaxed">
          Skip showroom pricing by purchasing direct from our factory distribution centers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        
        {/* Left Columns - Content Text */}
        <div className="md:col-span-2 bg-white border border-border p-8 rounded shadow-sm">
          <h2 className="text-lg font-bold font-display text-primary mb-4 pb-2 border-b border-border">Our Direct Outlets</h2>
          <div className="text-xs text-text-muted space-y-4 leading-relaxed whitespace-pre-line">
            {loading ? (
              <div className="w-full h-40 bg-bg-light animate-pulse rounded"></div>
            ) : (
              content || fallbackContent
            )}
          </div>
        </div>

        {/* Right Column - Map/Directions Panel */}
        <div className="bg-bg-light p-6 rounded border border-border flex flex-col gap-4 text-xs text-text-muted">
          <h4 className="font-display font-bold text-base text-primary">Visit Our Centers</h4>
          <p className="leading-relaxed">
            We highly recommend visiting our main Delhi or Bengaluru distribution depots to feel the comfort of latex, foam, and springs before ordering. 
          </p>
          
          <div className="w-full h-32 bg-border relative rounded flex items-center justify-center font-bold text-[10px] text-text-muted select-none">
            [ Interactive Showroom Outlets Maps ]
          </div>
          
          <a 
            href="https://maps.google.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full bg-primary hover:bg-primary-light text-white text-xs font-bold py-2.5 rounded-sm text-center transition-colors duration-200"
          >
            Open Factory Maps
          </a>
        </div>

      </div>
    </div>
  );
};

export default Stores;
