import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import MetaTags from '../components/MetaTags';

const Home = () => {
  const [heroCopy, setHeroCopy] = useState({
    heroSubheading: 'Sleepora',
    heroTitle: 'Perfect Sleep, Perfect Life.',
    heroSubtitle: 'Premium mattresses and handcrafted sofas, engineered for comfort and built to last.',
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

        // 2. Fetch featured products (fetching all and filtering in react to handle fallback fills)
        const productsRes = await API.get('/products');
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

  // Apply Lenis smooth scrolling and custom scrollbar ONLY on the home page as requested
  useEffect(() => {
    document.body.classList.add('home-scroll-active');

    let lenis;
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/dist/lenis.min.js';
    script.async = true;
    script.onload = () => {
      if (window.Lenis) {
        lenis = new window.Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true
        });
        function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.classList.remove('home-scroll-active');
      if (lenis) lenis.destroy();
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const mattressFeatured = featuredProducts.filter(p => p.category === 'mattress' && p.isFeatured);
  const mattressNonFeatured = featuredProducts.filter(p => p.category === 'mattress' && !p.isFeatured);
  const featuredMattresses = [...mattressFeatured, ...mattressNonFeatured].slice(0, 3);

  const sofaFeatured = featuredProducts.filter(p => p.category === 'sofa' && p.isFeatured);
  const sofaNonFeatured = featuredProducts.filter(p => p.category === 'sofa' && !p.isFeatured);
  const featuredSofas = [...sofaFeatured, ...sofaNonFeatured].slice(0, 3);

  return (
    <div className="w-full bg-white">
      <MetaTags
        title="Sleepora Mattresses | Factory Direct Premium Comfort"
        description="Buy premium mattresses and sectional sofas directly from the manufacturer. Save up to 40% on retail showroom prices. Custom sizes, Ortho memory foam, natural latex."
      />

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[580px] flex items-center border-b border-[#E0D8CE]/50 select-none overflow-hidden bg-white py-12 md:py-16 animate-fade-in">

        {/* Full-width background image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.15] pointer-events-none filter blur-[2px]"
          style={{ backgroundImage: "url('/images/ortho_mattress.png')" }}
        ></div>

        {/* Soft cream-to-transparent overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/98 via-white/90 to-transparent pointer-events-none"></div>

        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10 w-full">
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <span className="text-[11px] font-bold text-[#8B6844] uppercase tracking-[2.5px] mb-2 inline-block">
              {heroCopy.heroSubheading}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-[54px] font-serif font-bold text-[#201712] leading-[1.12] mb-5">
              {heroCopy.heroTitle.endsWith('Life.') ? (
                <>
                  {heroCopy.heroTitle.substring(0, heroCopy.heroTitle.lastIndexOf('Life.'))}
                  <span className="text-[#8B6844] block mt-1">Life.</span>
                </>
              ) : heroCopy.heroTitle.endsWith('Factory.') ? (
                <>
                  {heroCopy.heroTitle.substring(0, heroCopy.heroTitle.lastIndexOf('Factory.'))}
                  <span className="text-[#8B6844] block mt-1">Factory.</span>
                </>
              ) : (
                heroCopy.heroTitle
              )}
            </h1>

            <p className="text-sm text-[#6D6258] leading-relaxed max-w-[560px] mb-8">
              {heroCopy.heroSubtitle}
            </p>

            <div className="flex flex-row gap-4 mb-8 w-full sm:w-auto">
              <Link
                to="/mattresses"
                className="flex-grow sm:flex-grow-0 btn-luxury-wood px-8 py-3.5 rounded-none font-bold text-xs tracking-wider uppercase text-center"
              >
                Explore Mattresses
              </Link>
              <Link
                to="/sofas"
                className="flex-grow sm:flex-grow-0 border border-[#8B6844] text-[#8B6844] bg-transparent px-8 py-3.5 rounded-none font-bold text-xs tracking-wider uppercase hover:bg-white transition-all duration-300 text-center"
              >
                Explore Sofas
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 border-t border-[#E0D8CE]/60 pt-5 w-full max-w-[580px]">
              <div className="flex items-center gap-3.5">
                <span className="text-[#8B6844] text-3xl font-serif font-bold">40%</span>
                <div className="flex flex-col text-left">
                  <span className="text-[9px] font-bold text-[#6D6258] uppercase tracking-wider leading-none">Direct</span>
                  <span className="text-[9px] font-bold text-[#6D6258] uppercase tracking-wider leading-none mt-1">Savings</span>
                </div>
              </div>
              <div className="flex items-center gap-3.5">
                <span className="text-[#8B6844] text-3xl font-serif font-bold">100%</span>
                <div className="flex flex-col text-left">
                  <span className="text-[9px] font-bold text-[#6D6258] uppercase tracking-wider leading-none">Custom</span>
                  <span className="text-[9px] font-bold text-[#6D6258] uppercase tracking-wider leading-none mt-1">Sizing</span>
                </div>
              </div>
              <div className="flex items-center gap-3.5">
                <span className="text-[#8B6844] text-3xl font-serif font-bold">10Y</span>
                <div className="flex flex-col text-left">
                  <span className="text-[9px] font-bold text-[#6D6258] uppercase tracking-wider leading-none">Certified</span>
                  <span className="text-[9px] font-bold text-[#6D6258] uppercase tracking-wider leading-none mt-1">Warranty</span>
                </div>
              </div>
            </div>

          </div>

          <div className="lg:col-span-5 relative flex items-center justify-center select-none">
            {/* Styled card with thick white padding, border, and deep box shadow */}
            <div className="p-3.5 bg-white shadow-xl border border-[#E0D8CE]/50 w-full max-w-[380px] relative">
              <img
                src="/images/ortho_mattress.png"
                alt="Sleepora Premium Mattress Showcase"
                className="w-full rounded-none contrast-105 saturate-105"
              />

              {/* Experience Badge overlay */}
              <div className="absolute bottom-[-15px] left-[-15px] bg-white border border-[#E0D8CE]/50 p-4 shadow-lg flex items-center gap-3 z-20">
                <span className="text-3xl font-serif font-bold text-[#8B6844] leading-none">20+</span>
                <div className="flex flex-col text-left">
                  <span className="text-[8px] font-bold text-[#6D6258] uppercase tracking-wider leading-none">Years of</span>
                  <span className="text-[8px] font-bold text-[#6D6258] uppercase tracking-wider leading-none mt-1">Manufacturing Experience</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- TRUST BADGES BAR --- */}
      <section className="bg-[#F4F1EC] border-b border-[#E0D8CE]/60 py-6 select-none animate-fade-in">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-4 gap-x-6 justify-items-center items-center text-center">
            {[
              'Orthopaedic Support',
              'Premium Comfort',
              'Pressure Relief',
              '10 Years Warranty',
              'Factory Direct Pricing',
              'Made in India'
            ].map((badge, idx) => (
              <div key={idx} className="flex items-center gap-2 group cursor-default">
                <span className="text-[#8B6844] font-bold text-sm transition-transform duration-300 group-hover:scale-125">✓</span>
                <span className="text-[11px] font-bold tracking-wider text-[#6D6258] uppercase group-hover:text-[#8B6844] transition-colors duration-300">
                  {badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- WHY CHOOSE SLEEPORA --- */}
      <section className="py-24 bg-[#201712] text-[#FFFDFC] select-none border-b border-[#8B6844]/30 animate-fade-in">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <div className="max-w-[650px] mx-auto mb-20 animate-fade-in">
            <span className="text-xs font-bold text-[#8B6844] uppercase tracking-[2px] mb-3 inline-block">The Sleepora Difference</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#FFFDFC] mb-4">Why Choose Sleepora?</h2>
            <div className="w-24 h-[2px] bg-[#8B6844] mx-auto mb-5"></div>
            <p className="text-[13px] text-stone-300 leading-relaxed">
              We design and manufacture premium comfort sleep systems engineered for health, posture, and longevity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 text-left">
            {[
              {
                icon: '🏥',
                title: 'Orthopaedic Support',
                desc: 'Scientifically designed to distribute body weight evenly, reducing pressure on key joints and keeping your spine aligned.'
              },
              {
                icon: '🌬',
                title: 'Breathable Materials',
                desc: 'Features highly breathable bamboo quilts and open-cell foam technology to dissipate body heat for cool, restful sleep.'
              },
              {
                icon: '🛏',
                title: 'Premium Comfort',
                desc: 'Expertly layered organic latex and pressure-relieving memory foam provide luxurious contouring comfort.'
              },
              {
                icon: '🛡',
                title: 'Long Lasting Durability',
                desc: 'Made with double-tempered carbon steel pocket coils and high-density cores that resist sagging for decades.'
              },
              {
                icon: '📏',
                title: 'Custom Sizes',
                desc: 'Stitched to your exact bed measurements down to the centimeter, offering personalized comfort configurations.'
              },
              {
                icon: '🏭',
                title: 'Factory Direct Pricing',
                desc: 'Save up to 40% by cutting middleman markups, retail showroom overheads, and distributor percentages.'
              },
              {
                icon: '🇮🇳',
                title: 'Proudly Made in India',
                desc: 'Handcrafted locally with pride by skilled artisans using premium materials, supporting domestic craftsmanship.'
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-[#2B1F18] p-8 border border-[#8B6844]/30 rounded-none shadow-lg hover:shadow-2xl hover:border-[#8B6844] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-[#201712] text-[#8B6844] flex items-center justify-center text-xl mb-6 border border-[#8B6844]/40 rounded-none shadow-inner">
                    {item.icon}
                  </div>
                  <h3 className="font-serif font-bold text-lg text-[#FFFDFC] mb-3">{item.title}</h3>
                  <p className="text-[12px] text-stone-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CRAFTSMANSHIP STORY / ABOUT SECTION (WOODNEST STYLE) --- */}
      <section className="py-16 md:py-20 bg-white select-none border-b border-[#E0D8CE]/50 animate-fade-in">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-center">

          {/* Left: Heading, description, button */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <span className="text-[11px] font-bold text-[#8B6844] uppercase tracking-[2.5px] mb-2 inline-block">
              Craftsmanship Story
            </span>
            <h2 className="text-3xl md:text-[38px] font-serif font-bold text-[#201712] leading-[1.2] mb-4">
              Handcrafted Furniture Engineered For Comfort.
            </h2>
            <p className="text-[13px] text-[#6D6258] leading-relaxed max-w-[540px] mb-6">
              At Sleepora, we believe that true luxury lies in the details. Every piece we manufacture combines traditional craftsmanship with advanced comfort technology. Using organic natural latex, pressure-relieving foam, and hand-selected seasoned hardwood, our sewing team and furniture builders construct premium sleep systems and custom sectionals made to last a lifetime.
            </p>
            <Link
              to="/factory"
              className="inline-block border border-[#8B6844] text-[#8B6844] bg-transparent text-[11px] font-bold tracking-[1.5px] uppercase py-3 px-7 hover:bg-[#8B6844] hover:text-white transition-all duration-300 rounded-none"
            >
              Read Our Story
            </Link>
          </div>

          {/* Right: Premium image card */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="w-full max-w-[400px] rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-[#E0D8CE]/60 bg-white p-2.5">
              <img
                src="/images/workers_crafting.png"
                alt="Sleepora Craftsmanship Showcase"
                className="w-full rounded-md object-cover aspect-[4/3] hover:scale-[1.03] transition-transform duration-500 contrast-105 saturate-105"
              />
            </div>
          </div>

        </div>
      </section>

      {/* --- FEATURED MATTRESS CATALOGUE PREVIEW --- */}
      <section className="py-16 bg-white select-none border-b border-[#E0D8CE]/40 animate-fade-in">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center max-w-[650px] mx-auto mb-12">
            <span className="text-xs font-bold text-[#8B6844] uppercase tracking-[2px] mb-2.5 inline-block">Sleep Architecture Lab</span>
            <h2 className="text-[32px] md:text-[38px] font-serif font-bold text-[#201712] leading-tight">Featured Mattress Collection</h2>
            <div className="w-16 h-[2px] bg-[#8B6844] mx-auto mt-4"></div>
          </div>

          <div className="premium-product-grid">
            {featuredMattresses.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                mattressConfig={mattressConfig}
              />
            ))}
          </div>

          <div className="mt-12 text-center animate-fade-in">
            <Link
              to="/mattresses"
              className="inline-block border border-[#8B6844] text-[#8B6844] bg-transparent text-[11px] font-bold tracking-[1.5px] uppercase py-3.5 px-8 hover:bg-[#8B6844] hover:text-white transition-all duration-300"
            >
              EXPLORE MATTRESS COLLECTION
            </Link>
          </div>
        </div>
      </section>

      {/* --- FEATURED SOFA CATALOGUE PREVIEW --- */}
      {featuredSofas.length > 0 && (
        <section className="py-16 bg-white select-none border-b border-[#E0D8CE]/50 animate-fade-in">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center max-w-[650px] mx-auto mb-12">
              <span className="text-xs font-bold text-[#8B6844] uppercase tracking-[2px] mb-2.5 inline-block">Living Room Masterpieces</span>
              <h2 className="text-[32px] md:text-[38px] font-serif font-bold text-[#201712] leading-tight">Featured Sofa Collection</h2>
              <div className="w-16 h-[2px] bg-[#8B6844] mx-auto mt-4"></div>
            </div>

            <div className="premium-product-grid">
              {featuredSofas.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                />
              ))}
            </div>

            <div className="mt-12 text-center animate-fade-in">
              <Link
                to="/sofas"
                className="inline-block border border-[#8B6844] text-[#8B6844] bg-transparent text-[11px] font-bold tracking-[1.5px] uppercase py-3.5 px-8 hover:bg-[#8B6844] hover:text-white transition-all duration-300"
              >
                EXPLORE SOFA COLLECTION
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* --- ASSEMBLY TIMELINE --- */}
      <section className="py-16 bg-white select-none border-b border-[#E0D8CE]/50 animate-fade-in">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <div className="max-w-[650px] mx-auto mb-12 animate-fade-in">
            <span className="text-xs font-bold text-[#8B6844] uppercase tracking-[2px] mb-2.5 inline-block">Process Preview</span>
            <h2 className="text-[32px] md:text-[38px] font-serif font-bold text-[#201712] leading-tight">Precision Manufacturing Timeline</h2>
            <div className="w-16 h-[2px] bg-[#8B6844] mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative text-left">
            <div className="flex flex-col items-start relative z-10 bg-white p-6 border border-[#E0D8CE]/60 hover:border-[#8B6844]/60 transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1">
              <span className="w-8 h-8 btn-luxury-wood text-white rounded-none flex items-center justify-center font-serif font-bold text-sm shadow-xs mb-6">1</span>
              <h4 className="font-serif font-bold text-base text-[#201712] mb-2">1. Material Selection</h4>
              <p className="text-[11.5px] text-[#6D6258] leading-relaxed">We source certified high-density foam core sheets, organic latex, and seasoned Sal wood framing components.</p>
            </div>

            <div className="flex flex-col items-start relative z-10 bg-white p-6 border border-[#E0D8CE]/60 hover:border-[#8B6844]/60 transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1">
              <span className="w-8 h-8 btn-luxury-wood text-white rounded-none flex items-center justify-center font-serif font-bold text-sm shadow-xs mb-6">2</span>
              <h4 className="font-serif font-bold text-base text-[#201712] mb-2">2. Manufacturing</h4>
              <p className="text-[11.5px] text-[#6D6258] leading-relaxed">Components are precisely CNC-sliced or framed, and custom bamboo quilted covers are stitched by artisans.</p>
            </div>

            <div className="flex flex-col items-start relative z-10 bg-white p-6 border border-[#E0D8CE]/60 hover:border-[#8B6844]/60 transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1">
              <span className="w-8 h-8 btn-luxury-wood text-white rounded-none flex items-center justify-center font-serif font-bold text-sm shadow-xs mb-6">3</span>
              <h4 className="font-serif font-bold text-base text-[#201712] mb-2">3. Quality Testing</h4>
              <p className="text-[11.5px] text-[#6D6258] leading-relaxed">The product passes compression load checks and seam reinforcement evaluations to verify longevity.</p>
            </div>

            <div className="flex flex-col items-start relative z-10 bg-white p-6 border border-[#E0D8CE]/60 hover:border-[#8B6844]/60 transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1">
              <span className="w-8 h-8 btn-luxury-wood text-white rounded-none flex items-center justify-center font-serif font-bold text-sm shadow-xs mb-6">4</span>
              <h4 className="font-serif font-bold text-base text-[#201712] mb-2">4. Delivery</h4>
              <p className="text-[11.5px] text-[#6D6258] leading-relaxed">Direct dispatch via specialized logistics networks with protective wrapping for dust-free arrival.</p>
            </div>
          </div>

          <div className="mt-16">
            <Link to="/factory" className="inline-block border border-[#8B6844] text-[#8B6844] bg-transparent text-[11px] font-bold tracking-[1.5px] uppercase py-3.5 px-8 hover:bg-[#8B6844] hover:text-white transition-all duration-300">
              Tour Factory Manufacturing In Detail
            </Link>
          </div>
        </div>
      </section>

      {/* --- CUSTOMER TESTIMONIALS --- */}
      {testimonials.length > 0 && (
        <section className="py-16 bg-white select-none border-b border-[#E0D8CE]/50 animate-fade-in">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center max-w-[650px] mx-auto mb-12">
              <span className="text-xs font-bold text-[#8B6844] uppercase tracking-[2px] mb-2.5 inline-block">Reviews</span>
              <h2 className="text-[32px] md:text-[38px] font-serif font-bold text-[#201712] leading-tight">What Our Customers Say</h2>
              <div className="w-16 h-[2px] bg-[#8B6844] mx-auto mt-4 mb-4"></div>
              <p className="text-[13px] text-[#6D6258] leading-relaxed">
                Hear directly from our verified buyers about their factory-direct experience and custom comfort.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((t) => (
                <div
                  key={t._id}
                  className="bg-white p-8 border border-[#E0D8CE]/60 rounded-none shadow-md hover:shadow-2xl hover:border-[#8B6844] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center gap-1 text-[#8B6844] mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < t.rating ? 'fill-current text-[#8B6844]' : 'text-stone-200 fill-current'}`}
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-[13px] text-[#6D6258] italic leading-relaxed mb-6">
                      "{t.text}"
                    </p>
                  </div>
                  <div className="flex items-center gap-3 border-t border-[#E0D8CE]/40 pt-4">
                    <span className="w-9 h-9 bg-white text-[#8B6844] rounded-none flex items-center justify-center font-bold text-xs border border-[#E0D8CE]/60">
                      {t.avatar || t.name[0]}
                    </span>
                    <div>
                      <span className="block font-bold text-xs text-[#201712] leading-none">{t.name}</span>
                      <span className="block text-[10px] text-[#6D6258] mt-1.5 leading-none font-medium">{t.location || 'India'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* --- CALL TO ACTION BANNERS --- */}
      <section className="py-24 bg-[#201712] text-white select-none relative overflow-hidden border-t border-[#8B6844]/30">
        <div className="absolute top-0 left-0 w-full h-full bg-radial-gradient(circle, rgba(139,104,68,0.08) 0%, rgba(32,23,18,0) 75%) pointer-events-none"></div>
        <div className="max-w-[750px] mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
            {heroCopy.ctaTitle}
          </h2>
          <p className="text-sm text-stone-300 leading-relaxed mb-10">
            {heroCopy.ctaSubtitle}
          </p>
          <a
            href={`https://wa.me/919876543210?text=${encodeURIComponent("Hi, I would like to inquire about customizing a mattress or sofa.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-whatsapp hover:bg-whatsapp-dark text-white font-bold text-xs tracking-wider uppercase py-3.5 px-8 rounded-none transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.455L0 24zm6.59-4.846c1.6.95 3.473 1.452 5.378 1.453 5.541 0 10.051-4.509 10.055-10.05.002-2.684-1.038-5.207-2.93-7.098C17.26 1.57 14.75 .53 12.008.53c-5.547 0-10.059 4.511-10.063 10.055-.001 1.902.497 3.762 1.442 5.36l-.946 3.454 3.541-.928zM17.52 14.33c-.302-.15-1.785-.88-2.053-.978-.268-.1-.463-.15-.658.15-.195.3-.755.95-.926 1.15-.17.2-.34.225-.642.075-.302-.15-1.272-.469-2.423-1.496-.895-.798-1.5-1.784-1.676-2.084-.176-.3-.019-.462.132-.611.135-.134.302-.35.453-.525.151-.175.201-.3.302-.5.101-.2.05-.375-.025-.525-.075-.15-.658-1.583-.902-2.172-.238-.574-.479-.496-.658-.505-.17-.008-.365-.01-.56-.01-.195 0-.512.074-.78.373-.268.3-.993.972-.993 2.37 0 1.399 1.018 2.748 1.164 2.948.146.2 2.005 3.061 4.856 4.285.679.292 1.209.466 1.62.597.683.217 1.303.187 1.795.114.549-.08 1.785-.73 2.039-1.436.254-.707.254-1.314.177-1.438-.077-.123-.28-.2-.58-.35z" />
            </svg>
            Connect With Factory Owner on WhatsApp
          </a>
        </div>
      </section>

    </div>
  );
};

export default Home;
