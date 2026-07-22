import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import VoiceAssistant from '../components/VoiceAssistant';
import SleeporaLogo from '../components/SleeporaLogo';

const MainLayout = ({ children }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuActive, setMenuActive] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [linksOpen, setLinksOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Floating WhatsApp phone number setup
  const whatsappNumber = '919876543210';
  const whatsappMsg = encodeURIComponent("Hi! I visited your website and I'm interested in your mattresses. Can you help me?");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer when location changes
  useEffect(() => {
    setMenuActive(false);
  }, [location]);

  const handleNavClick = (sectionId) => {
    setMenuActive(false);
    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleWhatsAppRedirect = () => {
    window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMsg}`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-primary">
      
      {/* Mobile Drawer Overlay Background Backdrop */}
      {menuActive && (
        <div 
          className="fixed inset-0 bg-black/45 backdrop-blur-xs z-[1999] lg:hidden"
          onClick={() => setMenuActive(false)}
        />
      )}

      {/* --- PREMIUM NAVIGATION BAR (WOODNEST STYLE) --- */}
      <header className={`fixed top-0 left-0 w-full border-b bg-white/95 backdrop-blur-md text-[#201712] border-[#E0D8CE]/60 transition-all duration-300 ${menuActive ? 'z-[2002]' : 'z-[1000]'} ${scrolled ? 'shadow-md py-2.5' : 'py-4'}`}>
        <div className="max-w-[1200px] mx-auto px-6 flex justify-between items-center">
          
          <Link 
            to="/" 
            className="select-none transition-transform duration-300 hover:scale-103 hover:opacity-95 lg:ml-8 animate-fade-in flex items-center"
            style={{ animationDuration: '300ms' }}
          >
            {/* Desktop Logo */}
            <SleeporaLogo height="50px" variant="dark" simplified={true} className="hidden lg:flex" />
            {/* Mobile/Tablet Logo */}
            <SleeporaLogo height="40px" variant="dark" simplified={true} className="flex lg:hidden" />
          </Link>

          {/* Nav links */}
          <nav className={`fixed lg:static top-0 lg:top-auto ${menuActive ? 'right-0' : '-right-full lg:right-auto'} w-[280px] lg:w-auto h-screen lg:h-auto border-l lg:border-l-0 flex flex-col lg:flex-row items-center lg:gap-10 gap-8 pt-24 lg:pt-0 transition-all duration-300 ease-in-out z-[2000] lg:z-auto bg-white lg:bg-transparent border-[#E0D8CE]/40 lg:shadow-none shadow-xl`}>
            <Link to="/" onClick={() => setMenuActive(false)} className={`text-[14px] font-semibold tracking-wide transition-all duration-200 pb-1.5 relative ${location.pathname === '/' ? 'text-[#8B6844] after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-[#8B6844]' : 'text-[#201712] hover:text-[#8B6844]'}`}>Home</Link>
            <Link to="/sofas" onClick={() => setMenuActive(false)} className={`text-[14px] font-semibold tracking-wide transition-all duration-200 pb-1.5 relative ${location.pathname === '/sofas' ? 'text-[#8B6844] after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-[#8B6844]' : 'text-[#201712] hover:text-[#8B6844]'}`}>Sofas</Link>
            <Link to="/mattresses" onClick={() => setMenuActive(false)} className={`text-[14px] font-semibold tracking-wide transition-all duration-200 pb-1.5 relative ${location.pathname === '/mattresses' ? 'text-[#8B6844] after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-[#8B6844]' : 'text-[#201712] hover:text-[#8B6844]'}`}>Mattresses</Link>
            <Link to="/about" onClick={() => setMenuActive(false)} className={`text-[14px] font-semibold tracking-wide transition-all duration-200 pb-1.5 relative ${location.pathname === '/about' ? 'text-[#8B6844] after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-[#8B6844]' : 'text-[#201712] hover:text-[#8B6844]'}`}>About</Link>
            <Link to="/contact" onClick={() => setMenuActive(false)} className={`text-[14px] font-semibold tracking-wide transition-all duration-200 pb-1.5 relative ${location.pathname === '/contact' ? 'text-[#8B6844] after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-[#8B6844]' : 'text-[#201712] hover:text-[#8B6844]'}`}>Contact</Link>
            
            <a href="tel:+919876543210" onClick={() => setMenuActive(false)} className="lg:hidden flex items-center gap-2.5 text-[#8B6844] font-semibold text-base mt-4 whitespace-nowrap px-5 py-2.5 border border-[#8B6844]/30 rounded-sm min-h-[44px]">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg>
              +91 98765 43210
            </a>
          </nav>

          {/* Hamburger Mobile Toggle */}
          <button 
            onClick={() => setMenuActive(!menuActive)}
            className="block lg:hidden text-[#8B6844] hover:text-[#6D5134] text-2xl focus:outline-none transition-colors z-[2001] p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Toggle Menu"
          >
            {menuActive ? (
              <span className="font-sans font-light text-3xl">&times;</span>
            ) : (
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
            )}
          </button>
        </div>
      </header>

      {/* Main Page Area */}
      <main className="flex-grow pt-[72px]">
        {children}
      </main>

      {/* --- FLOATING WHATSAPP BUTTON --- */}
      {!(isMobile && (location.pathname.includes('/sofas/') || location.pathname.includes('/mattresses/'))) && (
        <div 
          className="fixed right-6 z-[999] group flex flex-row items-center gap-3 whatsapp-btn transition-all duration-300"
          style={{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
        >
          <div className="opacity-0 group-hover:opacity-100 bg-white text-primary text-[12px] font-bold py-2 px-3 shadow-lg rounded-sm border border-border transition-all duration-300 pointer-events-none whitespace-nowrap -translate-x-2 hidden md:block">
            Chat with Factory Owner
          </div>
          <button 
            onClick={handleWhatsAppRedirect}
            className="w-12 h-12 lg:w-14 lg:h-14 bg-whatsapp hover:bg-whatsapp-dark text-white rounded-full flex items-center justify-center text-2xl shadow-lg transition-transform duration-300 hover:scale-110 pulse-whatsapp-btn focus:outline-none min-w-[48px] min-h-[48px]"
            aria-label="Chat on WhatsApp"
          >
            <svg className="w-6 h-6 lg:w-8 lg:h-8 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.455L0 24zm6.59-4.846c1.6.95 3.473 1.452 5.378 1.453 5.541 0 10.051-4.509 10.055-10.05.002-2.684-1.038-5.207-2.93-7.098C17.26 1.57 14.75 .53 12.008.53c-5.547 0-10.059 4.511-10.063 10.055-.001 1.902.497 3.762 1.442 5.36l-.946 3.454 3.541-.928zM17.52 14.33c-.302-.15-1.785-.88-2.053-.978-.268-.1-.463-.15-.658.15-.195.3-.755.95-.926 1.15-.17.2-.34.225-.642.075-.302-.15-1.272-.469-2.423-1.496-.895-.798-1.5-1.784-1.676-2.084-.176-.3-.019-.462.132-.611.135-.134.302-.35.453-.525.151-.175.201-.3.302-.5.101-.2.05-.375-.025-.525-.075-.15-.658-1.583-.902-2.172-.238-.574-.479-.496-.658-.505-.17-.008-.365-.01-.56-.01-.195 0-.512.074-.78.373-.268.3-.993.972-.993 2.37 0 1.399 1.018 2.748 1.164 2.948.146.2 2.005 3.061 4.856 4.285.679.292 1.209.466 1.62.597.683.217 1.303.187 1.795.114.549-.08 1.785-.73 2.039-1.436.254-.707.254-1.314.177-1.438-.077-.123-.28-.2-.58-.35z"/>
            </svg>
          </button>
        </div>
      )}

      <footer className="bg-[#201712] text-stone-300 pt-12 pb-6 mt-auto border-t-2 border-[#8B6844]/30 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 pb-12 border-b border-white/5">
            
            <div className="flex flex-col gap-3">
              <Link 
                to="/" 
                className="select-none transition-transform duration-300 hover:scale-103 hover:opacity-95 block mt-6 mb-4 w-[180px] animate-fade-in"
                style={{ animationDuration: '300ms' }}
              >
                <SleeporaLogo variant="light" height="52px" className="w-full" />
              </Link>
              <p className="text-stone-400 text-[14px] md:text-xs leading-relaxed font-light">
                Direct manufacturers of high-performance orthopaedic sleep foam, organic natural latex, and independent pocket coil hybrid systems. Comfort and durability, straight from the assembly floor.
              </p>
            </div>
 
            {/* Accordion 1: Our Products */}
            <div className="border-b border-white/5 md:border-b-0 pb-4 md:pb-0">
              <button 
                onClick={() => setProductsOpen(!productsOpen)}
                className="w-full flex justify-between items-center text-left font-serif font-semibold text-sm uppercase tracking-wider text-[#8B6844] mb-0 md:mb-5 py-2 md:py-0 focus:outline-none min-h-[44px] md:min-h-0"
              >
                <span>Our Products</span>
                <span className="md:hidden text-stone-400 font-light text-lg">{productsOpen ? '−' : '+'}</span>
              </button>
              <ul className={`flex-col gap-3 text-[14px] md:text-xs text-stone-400 md:flex ${productsOpen ? 'flex pt-2 pb-1' : 'hidden'}`}>
                <li><Link to="/mattresses" className="hover:text-[#FFFDFC] hover:translate-x-1 transition-all duration-200 inline-block py-1">Ortho-Memory Foam</Link></li>
                <li><Link to="/mattresses" className="hover:text-[#FFFDFC] hover:translate-x-1 transition-all duration-200 inline-block py-1">Premium Natural Latex</Link></li>
                <li><Link to="/mattresses" className="hover:text-[#FFFDFC] hover:translate-x-1 transition-all duration-200 inline-block py-1">Luxury Pocket Spring</Link></li>
                <li><Link to="/sofas" className="hover:text-[#FFFDFC] hover:translate-x-1 transition-all duration-200 inline-block py-1">Custom Sectional Sofas</Link></li>
              </ul>
            </div>
 
            {/* Accordion 2: Quick Links */}
            <div className="border-b border-white/5 md:border-b-0 pb-4 md:pb-0">
              <button 
                onClick={() => setLinksOpen(!linksOpen)}
                className="w-full flex justify-between items-center text-left font-serif font-semibold text-sm uppercase tracking-wider text-[#8B6844] mb-0 md:mb-5 py-2 md:py-0 focus:outline-none min-h-[44px] md:min-h-0"
              >
                <span>Quick Links</span>
                <span className="md:hidden text-stone-400 font-light text-lg">{linksOpen ? '−' : '+'}</span>
              </button>
              <ul className={`flex-col gap-3 text-[14px] md:text-xs text-stone-400 md:flex ${linksOpen ? 'flex pt-2 pb-1' : 'hidden'}`}>
                <li><Link to="/factory" className="hover:text-[#FFFDFC] hover:translate-x-1 transition-all duration-200 inline-block py-1">Dynamic Factory Tour</Link></li>
                <li><Link to="/contact" className="hover:text-[#FFFDFC] hover:translate-x-1 transition-all duration-200 inline-block py-1">Verify Our Locations</Link></li>
                <li><Link to="/contact" className="hover:text-[#FFFDFC] hover:translate-x-1 transition-all duration-200 inline-block py-1">Request Custom Quotation</Link></li>
              </ul>
            </div>
 
            {/* Accordion 3: Contact Info */}
            <div className="pb-4 md:pb-0">
              <button 
                onClick={() => setContactOpen(!contactOpen)}
                className="w-full flex justify-between items-center text-left font-serif font-semibold text-sm uppercase tracking-wider text-[#8B6844] mb-0 md:mb-5 py-2 md:py-0 focus:outline-none min-h-[44px] md:min-h-0"
              >
                <span>Contact Information</span>
                <span className="md:hidden text-stone-400 font-light text-lg">{contactOpen ? '−' : '+'}</span>
              </button>
              <ul className={`flex-col gap-3.5 text-[14px] md:text-xs text-stone-400 md:flex ${contactOpen ? 'flex pt-2 pb-1' : 'hidden'}`}>
                <li className="flex items-start gap-2.5 py-1">
                  <span className="text-[#8B6844] mt-0.5 flex-shrink-0">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                  </span>
                  <span>Plot No. 42, Industrial Area, Sector 5, New Delhi, Pin 110015</span>
                </li>
                <li className="flex items-center gap-2.5 py-1">
                  <span className="text-[#8B6844] flex-shrink-0">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.57c-2.83-1.48-5.13-3.77-6.59-6.59l1.57-1.57c.27-.27.35-.65.24-1-.36-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.18c-.54 0-.99.45-.99.99C3.19 14.19 10.18 21 19 21c.54 0 .99-.45.99-.99v-3.64c0-.54-.45-.99-.98-.99z"/></svg>
                  </span>
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-center gap-2.5 py-1">
                  <span className="text-[#8B6844] flex-shrink-0">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                  </span>
                  <span>sales@sleepora.com</span>
                </li>
              </ul>
            </div>
 
          </div>
 
          <div className="flex flex-col sm:flex-row justify-between items-center pt-6 text-[11px] text-stone-500 gap-3 text-center">
            <p>&copy; {new Date().getFullYear()} Sleepora Mattress Factory. All rights reserved.</p>
            <p className="flex items-center gap-1">
              <span>Handcrafted for premium quality. Direct From Factory.</span>
            </p>
          </div>
        </div>
      </footer>
      <VoiceAssistant menuActive={menuActive} />
    </div>
  );
};
 
export default MainLayout;
