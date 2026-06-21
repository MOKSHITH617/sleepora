import React, { useState, useEffect } from 'react';
import API from '../services/api';
import MetaTags from '../components/MetaTags';

const About = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await API.get('/website-content/about_us');
        if (response.data.success && response.data.data) {
          setContent(response.data.data.content);
        }
      } catch (err) {
        console.warn('Failed to load about content from API, using fallback.');
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const fallbackContent = `TimeWell Mattress Factory began with a simple mission: to eliminate the bloated middleman showroom costs and deliver orthopaedic and luxury mattresses directly from the assembly line to consumers' homes. 

We utilize state-of-the-art manufacturing processes to design memory foam, natural latex, and pocket spring comfort cores. Every mattress is crafted with precision, checking for exact density levels and edge support integrity to ensure deep sleep that lasts for years. By controlling the entire manufacturing pipeline, we guarantee that you get premium quality at a fraction of standard retail prices.`;

  return (
    <div className="max-w-[1000px] mx-auto px-6 py-16 select-none animate-fade-in">
      <MetaTags 
        title="About Our Factory | TimeWell Mattress & Sofa Manufacturer"
        description="Learn more about TimeWell Mattress Factory, our custom-size sleep technologies, orthopedic design guidelines, and direct-to-home pricing models."
      />

      <div className="text-center max-w-[650px] mx-auto mb-16">
        <span className="text-xs font-bold text-accent uppercase tracking-wider mb-2 inline-block">Our Story</span>
        <h1 className="text-3xl md:text-4xl font-extrabold font-display mb-4 text-primary">Direct Manufacturer Advantage</h1>
        <p className="text-sm text-text-muted leading-relaxed">
          Why we build custom sleep foam and seating layouts direct from the assembly floor.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-2xl font-bold font-display text-primary mb-6">Handcrafted Sleep Engineering</h2>
          <div className="text-xs text-text-muted space-y-4 leading-relaxed whitespace-pre-line">
            {loading ? (
              <div className="w-full h-24 bg-bg-light animate-pulse rounded"></div>
            ) : (
              content || fallbackContent
            )}
          </div>
        </div>
        <div className="bg-bg-light p-8 rounded-lg border border-border flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 bg-primary text-accent rounded-full flex items-center justify-center font-extrabold text-2xl mb-4">
            TW
          </div>
          <h3 className="font-bold text-primary font-display text-lg mb-2">Our Promise</h3>
          <p className="text-[11px] text-text-muted leading-relaxed max-w-[300px]">
            No middle showrooms. No retail markups. 100% custom measurements. Direct owner assistance.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-4 w-full pt-6 border-t border-border">
            <div>
              <div className="text-lg font-black text-primary">10+</div>
              <div className="text-[9px] text-text-muted uppercase">Years Exp</div>
            </div>
            <div>
              <div className="text-lg font-black text-primary">50k+</div>
              <div className="text-[9px] text-text-muted uppercase">Sleepers</div>
            </div>
            <div>
              <div className="text-lg font-black text-primary">100%</div>
              <div className="text-[9px] text-text-muted uppercase">Handmade</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
