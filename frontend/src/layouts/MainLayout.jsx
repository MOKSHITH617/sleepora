import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import VoiceAssistant from '../components/VoiceAssistant';

const MainLayout = ({ children }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuActive, setMenuActive] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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
    <div className="min-h-screen flex flex-col bg-bg-light text-primary">
      
      {/* --- PREMIUM NAVIGATION BAR --- */}
      <header className={`fixed top-0 left-0 w-full z-[1000] border-b bg-primary text-white border-primary-light transition-all duration-300 ${scrolled ? 'shadow-lg py-3.5' : 'shadow-md py-5'}`}>
        <div className="max-w-[1200px] mx-auto px-6 flex justify-between items-center">
          
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-[42px] h-[42px] bg-gradient-to-br from-accent to-[#B3860B] rounded-[50%_50%_50%_0] flex items-center justify-center text-primary font-extrabold text-xl">
              TW
            </div>
            <div>
              <span className="block text-2xl font-extrabold font-display tracking-tight text-white transition-colors duration-300">TimeWell</span>
              <span className="block text-[10px] font-semibold tracking-[2.5px] uppercase text-accent leading-none -mt-0.5">Mattress Factory</span>
            </div>
          </Link>

          {/* Nav links */}
          <nav className={`fixed lg:static top-[70px] ${menuActive ? 'left-0' : '-left-full'} w-full lg:w-auto h-[calc(100vh-70px)] lg:h-auto border-t lg:border-t-0 flex flex-col lg:flex-row items-center lg:gap-8 gap-6 pt-10 lg:pt-0 transition-all duration-300 ease-in-out z-50 bg-primary border-primary-light lg:bg-transparent`}>
            <Link to="/" className="text-[17px] font-bold tracking-wide transition-colors duration-200 text-white hover:text-accent">Home</Link>
            <Link to="/mattresses" className="text-[17px] font-bold tracking-wide transition-colors duration-200 text-white hover:text-accent">Mattresses</Link>
            <Link to="/sofas" className="text-[17px] font-bold tracking-wide transition-colors duration-200 text-white hover:text-accent">Sofas</Link>
            <Link to="/factory" className="text-[17px] font-bold tracking-wide transition-colors duration-200 text-white hover:text-accent">Our Factory</Link>
            <Link to="/contact" className="text-[17px] font-bold tracking-wide transition-colors duration-200 text-white hover:text-accent">Contact Us</Link>
            
            <a href="tel:+919876543210" className="lg:hidden flex items-center gap-2.5 text-accent font-bold text-lg mt-4 whitespace-nowrap">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg>
              +91 98765 43210
            </a>
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <a href="tel:+919876543210" className="font-bold text-[17px] flex items-center gap-2 transition-colors duration-300 text-accent hover:text-white whitespace-nowrap">
              <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
              +91 98765 43210
            </a>
          </div>

          {/* Hamburger Mobile Toggle */}
          <button 
            onClick={() => setMenuActive(!menuActive)}
            className="block lg:hidden text-2xl focus:outline-none transition-colors text-white"
            aria-label="Toggle Menu"
          >
            {menuActive ? (
              <span className="font-sans font-light">&times;</span>
            ) : (
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
            )}
          </button>
        </div>
      </header>

      {/* Main Page Area */}
      <main className="flex-grow pt-[84px]">
        {children}
      </main>

      {/* --- FLOATING WHATSAPP BUTTON --- */}
      <div className="fixed bottom-6 right-6 z-[999] group flex flex-row items-center gap-3">
        <div className="opacity-0 group-hover:opacity-100 bg-white text-primary text-[12px] font-bold py-2 px-3 shadow-lg rounded-sm border border-border transition-all duration-300 pointer-events-none whitespace-nowrap -translate-x-2">
          Chat with Factory Owner
        </div>
        <button 
          onClick={handleWhatsAppRedirect}
          className="w-14 h-14 bg-whatsapp hover:bg-whatsapp-dark text-white rounded-full flex items-center justify-center text-2xl shadow-lg transition-transform duration-300 hover:scale-110 pulse-whatsapp-btn focus:outline-none"
          aria-label="Chat on WhatsApp"
        >
          <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.455L0 24zm6.59-4.846c1.6.95 3.473 1.452 5.378 1.453 5.541 0 10.051-4.509 10.055-10.05.002-2.684-1.038-5.207-2.93-7.098C17.26 1.57 14.75 .53 12.008.53c-5.547 0-10.059 4.511-10.063 10.055-.001 1.902.497 3.762 1.442 5.36l-.946 3.454 3.541-.928zM17.52 14.33c-.302-.15-1.785-.88-2.053-.978-.268-.1-.463-.15-.658.15-.195.3-.755.95-.926 1.15-.17.2-.34.225-.642.075-.302-.15-1.272-.469-2.423-1.496-.895-.798-1.5-1.784-1.676-2.084-.176-.3-.019-.462.132-.611.135-.134.302-.35.453-.525.151-.175.201-.3.302-.5.101-.2.05-.375-.025-.525-.075-.15-.658-1.583-.902-2.172-.238-.574-.479-.496-.658-.505-.17-.008-.365-.01-.56-.01-.195 0-.512.074-.78.373-.268.3-.993.972-.993 2.37 0 1.399 1.018 2.748 1.164 2.948.146.2 2.005 3.061 4.856 4.285.679.292 1.209.466 1.62.597.683.217 1.303.187 1.795.114.549-.08 1.785-.73 2.039-1.436.254-.707.254-1.314.177-1.438-.077-.123-.28-.2-.58-.35z"/>
          </svg>
        </button>
      </div>

      {/* --- FOOTER --- */}
      <footer className="bg-primary text-text-light pt-20 pb-8 mt-auto">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-white/10">
            
            <div className="flex flex-col gap-4">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-[38px] h-[38px] bg-gradient-to-br from-accent to-[#B3860B] rounded-[50%_50%_50%_0] flex items-center justify-center text-primary font-extrabold text-lg">
                  TW
                </div>
                <span className="text-2xl font-extrabold font-display tracking-tight text-white">TimeWell</span>
              </Link>
              <p className="text-white/60 text-sm leading-relaxed mt-2">
                Direct manufacturers of high-performance orthopaedic sleep foam, organic natural latex, and independent pocket coil hybrid systems. Comfort and durability, straight from the assembly floor.
              </p>
            </div>

            <div>
              <h3 className="font-display font-semibold text-lg text-white mb-6">Our Products</h3>
              <ul className="flex flex-col gap-3.5 text-sm text-white/75">
                <li><Link to="/mattresses" className="hover:text-accent transition-colors duration-200">Ortho-Memory Foam</Link></li>
                <li><Link to="/mattresses" className="hover:text-accent transition-colors duration-200">Premium Natural Latex</Link></li>
                <li><Link to="/mattresses" className="hover:text-accent transition-colors duration-200">Luxury Pocket Spring</Link></li>
                <li><Link to="/sofas" className="hover:text-accent transition-colors duration-200">Custom Sectional Sofas</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-display font-semibold text-lg text-white mb-6">Quick Links</h3>
              <ul className="flex flex-col gap-3.5 text-sm text-white/75">
                <li><Link to="/factory" className="hover:text-accent transition-colors duration-200">Dynamic Factory Tour</Link></li>
                <li><Link to="/contact" className="hover:text-accent transition-colors duration-200">Verify Our Locations</Link></li>
                <li><Link to="/contact" className="hover:text-accent transition-colors duration-200">Request Custom Quotation</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-display font-semibold text-lg text-white mb-6">Contact Information</h3>
              <ul className="flex flex-col gap-4 text-sm text-white/75">
                <li className="flex items-start gap-2.5">
                  <span className="text-accent mt-0.5">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                  </span>
                  <span>Plot No. 42, Industrial Area, Sector 5, New Delhi, Pin 110015</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-accent">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.57c-2.83-1.48-5.13-3.77-6.59-6.59l1.57-1.57c.27-.27.35-.65.24-1-.36-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.18c-.54 0-.99.45-.99.99C3.19 14.19 10.18 21 19 21c.54 0 .99-.45.99-.99v-3.64c0-.54-.45-.99-.98-.99z"/></svg>
                  </span>
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-accent">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                  </span>
                  <span>sales@timewellfactory.com</span>
                </li>
              </ul>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center pt-8 text-xs text-white/50 gap-4">
            <p>&copy; {new Date().getFullYear()} TimeWell Mattress Factory. All rights reserved.</p>
            <p className="flex items-center gap-1">
              <span>Handcrafted for premium quality. Direct From Factory.</span>
            </p>
          </div>
        </div>
      </footer>

      <VoiceAssistant />

    </div>
  );
};

export default MainLayout;
