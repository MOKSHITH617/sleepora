import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import MetaTags from '../components/MetaTags';

const Home = () => {
  const [heroCopy, setHeroCopy] = useState({
    heroSubheading: 'Direct Manufacturer Advantage',
    heroTitle: 'Deep Sleep. Direct From The Factory.',
    heroSubtitle: 'Why pay 2x at retail showrooms? We manufacture high-end orthopaedic, organic latex, and hybrid spring mattresses tailored to your exact measurements. Better sleep, handcrafted for you.',
    ctaTitle: 'Ready for Better Sleep?',
    ctaSubtitle: 'Talk directly with the factory owner on WhatsApp to get custom sizes and the best prices instantly.'
  });
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [mattressConfig, setMattressConfig] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // 1. Fetch homepage copy
        const homeRes = await API.get('/homepage');
        if (homeRes.data?.content) setHeroCopy(homeRes.data.content);

        // 2. Fetch featured products
        const productsRes = await API.get('/products?isFeatured=true');
        if (productsRes.data?.products) setFeaturedProducts(productsRes.data.products);

        // 3. Fetch testimonials
        const testimonialsRes = await API.get('/testimonials');
        if (testimonialsRes.data?.testimonials) setTestimonials(testimonialsRes.data.testimonials);

        // 4. Fetch mattress configs (needed for card filters)
        const configRes = await API.get('/configs/mattress');
        if (configRes.data?.config) setMattressConfig(configRes.data.config);

      } catch (err) {
        console.error('Failed to load homepage elements:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);



  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const featuredMattresses = featuredProducts.filter(p => p.category === 'mattress');
  const featuredSofas = featuredProducts.filter(p => p.category === 'sofa');

  return (
    <div className="w-full">
      <MetaTags 
        title="TimeWell Mattresses | Factory Direct Premium Comfort"
        description="Buy premium mattresses and sectional sofas directly from the manufacturer. Save up to 50% on retail showroom prices. Custom sizes, Ortho memory foam, natural latex."
      />

      {/* --- HERO SECTION --- */}
      <section className="relative bg-gradient-to-tr from-primary-light to-primary text-white pt-16 pb-12 md:pt-24 md:pb-20 overflow-hidden select-none">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-radial-gradient(circle, rgba(230,179,37,0.08) 0%, rgba(11,25,44,0) 70%) pointer-events-none"></div>
        
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 flex flex-col items-start text-left animate-fade-in">
            <span className="text-sm font-bold text-accent uppercase tracking-[2.5px] mb-3.5 inline-block">
              {heroCopy.heroSubheading}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black font-display text-white leading-[1.1] mb-4">
              {heroCopy.heroTitle.split('Direct From').map((t, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <br />}
                  {idx > 0 ? (
                    <span>Direct From <span className="text-accent">The Factory</span></span>
                  ) : t}
                </React.Fragment>
              ))}
            </h1>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-x-3 gap-y-2.5 mt-1.5 mb-6 text-[11px] font-semibold text-white/95 items-center">
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm shadow-sm transition-all duration-300 hover:bg-white/10 hover:border-accent/40 cursor-default">
                <span className="text-accent text-[12px]">✓</span>
                <span>Factory Direct Pricing</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm shadow-sm transition-all duration-300 hover:bg-white/10 hover:border-accent/40 cursor-default">
                <span className="text-accent text-[12px]">✓</span>
                <span>Custom Mattress Solutions</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm shadow-sm transition-all duration-300 hover:bg-white/10 hover:border-accent/40 cursor-default">
                <span className="text-accent text-[12px]">✓</span>
                <span>Premium Sofa Manufacturing</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm shadow-sm transition-all duration-300 hover:bg-white/10 hover:border-accent/40 cursor-default">
                <span className="text-accent text-[12px]">✓</span>
                <span>WhatsApp Support</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm shadow-sm transition-all duration-300 hover:bg-white/10 hover:border-accent/40 cursor-default">
                <span className="text-accent text-[12px]">✓</span>
                <span>Quality Assured Products</span>
              </div>
            </div>

            <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-[560px] mb-5">
              {heroCopy.heroSubtitle}
            </p>

            <div className="flex flex-row gap-4 mb-8 w-full sm:w-auto">
              <Link 
                to="/contact" 
                className="flex-grow sm:flex-grow-0 bg-accent text-primary px-8 py-3.5 rounded-sm font-bold text-sm tracking-wide shadow-gold hover:bg-accent-hover transform hover:-translate-y-0.5 transition-all duration-300 text-center"
              >
                Get Custom Quote
              </Link>
              <Link 
                to="/mattresses"
                className="flex-grow sm:flex-grow-0 border-2 border-primary-lighter text-white px-8 py-3.5 rounded-sm font-bold text-sm tracking-wide hover:border-accent hover:bg-white/5 transform hover:-translate-y-0.5 transition-all duration-300 text-center"
              >
                Explore Products
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 border-t border-white/10 pt-6 w-full max-w-[580px]">
              <div className="flex items-center gap-3">
                <span className="text-accent text-3xl md:text-4xl font-bold">50%</span>
                <span className="text-xs md:text-sm text-white/60 font-semibold leading-tight uppercase">Direct<br />Savings</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-accent text-3xl md:text-4xl font-bold">100%</span>
                <span className="text-xs md:text-sm text-white/60 font-semibold leading-tight uppercase">Custom<br />Sizing</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-accent text-3xl md:text-4xl font-bold">10Y</span>
                <span className="text-xs md:text-sm text-white/60 font-semibold leading-tight uppercase">Certified<br />Warranty</span>
              </div>
            </div>

          </div>

          <div className="lg:col-span-5 relative flex items-center justify-center select-none">
            <div className="absolute inset-[5%] border-2 border-dashed border-accent/20 rounded-md rotate-[2deg] z-1 pointer-events-none"></div>
            <img 
              src="/images/ortho_mattress.png" 
              alt="TimeWell Premium Mattress Showcase" 
              className="relative z-10 w-full max-w-[420px] rounded-md shadow-lg border border-white/10 animate-float"
            />
            <div className="absolute bottom-[-15px] left-[-15px] bg-white text-primary p-4 rounded-md shadow-lg flex items-center gap-3 z-20">
              <span className="text-3xl font-extrabold text-accent font-display leading-none">20+</span>
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider leading-tight">Years of<br />Crafting Trust</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- FACTORY DIRECT BENEFITS --- */}
      <section className="py-20 bg-bg-light select-none">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <div className="max-w-[650px] mx-auto mb-16">
            <span className="text-xs font-bold text-accent uppercase tracking-wider mb-2 inline-block">The Direct Advantage</span>
            <h2 className="text-3xl md:text-4xl font-extrabold font-display mb-4">Why Buy Direct from the Manufacturer?</h2>
            <p className="text-sm text-text-muted leading-relaxed">
              Skip the showroom markups, dealer commissions, and warehousing overheads. We build your sleep sets to order.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-white p-8 border border-border rounded-md shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-primary-light/5 text-primary-light rounded-sm flex items-center justify-center text-xl font-bold mb-6">
                ₹
              </div>
              <h3 className="font-display font-semibold text-lg text-primary mb-3">Up To 50% Savings</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Showrooms pay heavy commercial rents and dealer percentages. By shopping directly from our facility floor, you receive identical luxury materials for up to half the cost.
              </p>
            </div>

            <div className="bg-white p-8 border border-border rounded-md shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-primary-light/5 text-primary-light rounded-sm flex items-center justify-center text-xl font-bold mb-6 font-display">
                ↔
              </div>
              <h3 className="font-display font-semibold text-lg text-primary mb-3">Centimeter Perfect Sizing</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Standard bed frames often do not align with commercial mattress specifications. Tell us your exact measurements down to the centimeter, and our sewing team will stitch it to perfection.
              </p>
            </div>

            <div className="bg-white p-8 border border-border rounded-md shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-primary-light/5 text-primary-light rounded-sm flex items-center justify-center text-xl font-bold mb-6">
                ★
              </div>
              <h3 className="font-display font-semibold text-lg text-primary mb-3">Freshly Baked Foam</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Dealer stocks sit rolled and compressed inside damp logistics hubs for months, weakening polymer cell walls. We foam and cure your mattress cores fresh upon booking confirmation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURED MATTRESS CATALOGUE PREVIEW --- */}
      <section className="py-20 bg-white select-none">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center max-w-[650px] mx-auto mb-12">
            <span className="text-xs font-bold text-accent uppercase tracking-wider mb-2 inline-block">Mattress Selection</span>
            <h2 className="text-3xl md:text-4xl font-extrabold font-display">Featured Mattress Range</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredMattresses.slice(0, 6).map((product) => (
              <ProductCard 
                key={product._id} 
                product={product} 
                mattressConfig={mattressConfig} 
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link 
              to="/mattresses" 
              className="inline-block bg-primary hover:bg-primary-light text-white text-xs font-bold py-3 px-8 rounded shadow-md tracking-wider transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
            >
              View More Products
            </Link>
          </div>
        </div>
      </section>

      {/* --- FEATURED SOFA CATALOGUE PREVIEW --- */}
      {featuredSofas.length > 0 && (
        <section className="py-20 bg-bg-light select-none">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center max-w-[650px] mx-auto mb-12">
              <span className="text-xs font-bold text-accent uppercase tracking-wider mb-2 inline-block">Sofa Collection</span>
              <h2 className="text-3xl md:text-4xl font-extrabold font-display">Premium Sofa Range</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredSofas.slice(0, 6).map((product) => (
                <ProductCard 
                  key={product._id} 
                  product={product} 
                />
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link 
                to="/sofas" 
                className="inline-block bg-primary hover:bg-primary-light text-white text-xs font-bold py-3 px-8 rounded shadow-md tracking-wider transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
              >
                View More Products
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* --- ASSEMBLY TIMELINE PREVIEW --- */}
      <section className="py-20 bg-white select-none">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <div className="max-w-[650px] mx-auto mb-16">
            <span className="text-xs font-bold text-accent uppercase tracking-wider mb-2 inline-block">Process Preview</span>
            <h2 className="text-3xl md:text-4xl font-extrabold font-display mb-4">Precision Manufacturing Timeline</h2>
            <p className="text-sm text-text-muted leading-relaxed">
              Every TimeWell mattress transitions through strict diagnostic steps before dispatch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative text-left">
            <div className="flex flex-col items-start relative z-10">
              <span className="w-9 h-9 bg-primary text-accent rounded-full flex items-center justify-center font-bold font-display text-sm shadow-md mb-6">1</span>
              <h4 className="font-display font-semibold text-[15px] mb-2">Foam Core Curing</h4>
              <p className="text-[11.5px] text-text-muted leading-relaxed">High-density support matrices cure inside well-aerated chambers to stabilize cellular framework.</p>
            </div>
            
            <div className="flex flex-col items-start relative z-10">
              <span className="w-9 h-9 bg-primary text-accent rounded-full flex items-center justify-center font-bold font-display text-sm shadow-md mb-6">2</span>
              <h4 className="font-display font-semibold text-[15px] mb-2">CNC Precision Slicing</h4>
              <p className="text-[11.5px] text-text-muted leading-relaxed">Solid block cores are sliced cleanly using computer-guided blades matching custom specifications.</p>
            </div>

            <div className="flex flex-col items-start relative z-10">
              <span className="w-9 h-9 bg-primary text-accent rounded-full flex items-center justify-center font-bold font-display text-sm shadow-md mb-6">3</span>
              <h4 className="font-display font-semibold text-[15px] mb-2">Organic Quilting</h4>
              <p className="text-[11.5px] text-text-muted leading-relaxed">Bamboo fiber quilted borders are double-stitched for structural reinforcement and cooling air flow.</p>
            </div>

            <div className="flex flex-col items-start relative z-10">
              <span className="w-9 h-9 bg-primary text-accent rounded-full flex items-center justify-center font-bold font-display text-sm shadow-md mb-6">4</span>
              <h4 className="font-display font-semibold text-[15px] mb-2">Press Quality Test</h4>
              <p className="text-[11.5px] text-text-muted leading-relaxed">Matress passes compression deflection checks to verify support ratings before packing load.</p>
            </div>
          </div>
          
          <div className="mt-12">
            <Link to="/factory" className="inline-block bg-primary text-white text-xs font-bold py-3 px-6 rounded-sm tracking-wide hover:bg-primary-light transition-colors">
              Tour Factory Manufacturing In Detail
            </Link>
          </div>
        </div>
      </section>

      {/* --- CUSTOMER TESTIMONIALS SECTION --- */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-bg-light border-y border-border select-none">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center max-w-[650px] mx-auto mb-16">
              <span className="text-xs font-bold text-accent uppercase tracking-wider mb-2 inline-block">Reviews</span>
              <h2 className="text-3xl md:text-4xl font-extrabold font-display mb-4">What Our Customers Say</h2>
              <p className="text-sm text-text-muted leading-relaxed">
                Hear directly from our verified buyers about their factory-direct experience and custom comfort.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((t) => (
                <div 
                  key={t._id}
                  className="bg-white p-8 border border-border rounded-md shadow-sm hover:shadow-md hover:-translate-y-1.5 hover:border-accent/40 transition-all duration-300 ease-out flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center gap-1 text-accent mb-4 transition-transform duration-300 group-hover:scale-[1.02]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-5 h-5 ${i < t.rating ? 'fill-current text-accent' : 'text-border fill-current'}`} 
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                        </svg>
                      ))}
                    </div>
                    <p className="text-sm text-text-muted italic leading-relaxed mb-6">
                      "{t.text}"
                    </p>
                  </div>
                  <div className="flex items-center gap-3 border-t border-border/60 pt-4">
                    <span className="w-10 h-10 bg-primary text-accent rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-colors duration-300 group-hover:bg-primary-light">
                      {t.avatar || t.name[0]}
                    </span>
                    <div>
                      <span className="block font-bold text-sm text-primary leading-none">{t.name}</span>
                      <span className="block text-[10.5px] text-text-muted mt-1.5 leading-none font-medium">{t.location || 'India'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* --- CALL TO ACTION BANNERS --- */}
      <section className="py-20 bg-primary text-white select-none relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-radial-gradient(circle, rgba(230,179,37,0.04) 0%, rgba(11,25,44,0) 75%) pointer-events-none"></div>
        <div className="max-w-[750px] mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold font-display text-white mb-4">
            {heroCopy.ctaTitle}
          </h2>
          <p className="text-sm text-white/70 leading-relaxed mb-8">
            {heroCopy.ctaSubtitle}
          </p>
          <a 
            href={`https://wa.me/919876543210?text=${encodeURIComponent("Hi, I would like to inquire about customizing a mattress or sofa.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-whatsapp hover:bg-whatsapp-dark text-white font-bold text-xs tracking-wide py-3.5 px-8 rounded-sm shadow-md pulse-whatsapp-btn transition-transform duration-300 transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11.951 16.942l-1.378 5.244-5.244-1.378c.905.492 1.944.75 3.02.75 3.182 0 5.767-2.586 5.768-5.766 0-3.18-2.585-5.766-5.766-5.766z"/>
            </svg>
            Connect With Factory Owner on WhatsApp
          </a>
        </div>
      </section>

    </div>
  );
};

export default Home;
