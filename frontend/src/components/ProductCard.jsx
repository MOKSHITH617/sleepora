import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const isMattress = product.category === 'mattress';

  // Starting price
  const currentPrice = product.basePrice;
  const warranty = product.specifications?.['Warranty'] || '10 Years Warranty';

  const handleWhatsAppEnquiry = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const whatsappNumber = '919876543210';
    let text = '';

    if (isMattress) {
      text = `Hello! I am interested in purchasing your mattresses. Here is my preference:
- *Mattress Type*: ${product.name}
- *Starting Price*: ₹${currentPrice.toLocaleString('en-IN')}

Please let me know how we can proceed with ordering, payment, and delivery!`;
    } else {
      text = `Hello! I am interested in purchasing your sofa. Here is my reference:
- *Sofa Model*: ${product.name}
- *Starting Price*: ₹${currentPrice.toLocaleString('en-IN')}

Please guide me on how I can customize seating, fabric materials, and colors!`;
    }

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedText}`, '_blank');
  };

  const handleGetQuote = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/contact', {
      state: {
        productName: product.name,
        category: product.category,
        configuration: {},
        price: currentPrice
      }
    });
  };

  const detailPath = isMattress ? `/mattresses/${product.slug}` : `/sofas/${product.slug}`;
  const imgUrl = product.images?.[0] || '/images/ortho_mattress.png';
  const whatsappNumber = '919876543210';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi, I am interested in ${product.name}`)}`;

  return (
    <div className="bg-[#FFFDFC] rounded-xl border border-[#E0D8CE] overflow-hidden flex flex-col justify-between shadow-md hover:shadow-xl hover:border-[#8B6844] hover:-translate-y-2 transition-all duration-300 group h-auto lg:h-[430px] lg:max-h-[445px]">
      
      {/* IMAGE SECTION — 225px (~52% of 430px) */}
      <div className="h-[225px] flex-shrink-0 overflow-hidden relative border-b border-[#E0D8CE]">
        <img 
          src={imgUrl} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108 contrast-105 saturate-105"
        />
        
        {/* Floating WhatsApp button inline top-right on mobile */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#25D366] hover:bg-[#128C7E] flex items-center justify-center text-white z-10 shadow-md transition-transform active:scale-95 md:hidden"
          title="Chat on WhatsApp"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.455L0 24zm6.59-4.846c1.6.95 3.473 1.452 5.378 1.453 5.541 0 10.051-4.509 10.055-10.05.002-2.684-1.038-5.207-2.93-7.098C17.26 1.57 14.75 .53 12.008.53c-5.547 0-10.059 4.511-10.063 10.055-.001 1.902.497 3.762 1.442 5.36l-.946 3.454 3.541-.928zM17.52 14.33c-.302-.15-1.785-.88-2.053-.978-.268-.1-.463-.15-.658.15-.195.3-.755.95-.926 1.15-.17.2-.34.225-.642.075-.302-.15-1.272-.469-2.423-1.496-.895-.798-1.5-1.784-1.676-2.084-.176-.3-.019-.462.132-.611.135-.134.302-.35.453-.525.151-.175.201-.3.302-.5.101-.2.05-.375-.025-.525-.075-.15-.658-1.583-.902-2.172-.238-.574-.479-.496-.658-.505-.17-.008-.365-.01-.56-.01-.195 0-.512.074-.78.373-.268.3-.993.972-.993 2.37 0 1.399 1.018 2.748 1.164 2.948.146.2 2.005 3.061 4.856 4.285.679.292 1.209.466 1.62.597.683.217 1.303.187 1.795.114.549-.08 1.785-.73 2.039-1.436.254-.707.254-1.314.177-1.438-.077-.123-.28-.2-.58-.35z"/>
          </svg>
        </a>

        {/* Desktop-only hover overlay */}
        <div className="absolute inset-0 bg-black/45 backdrop-blur-xs flex flex-col justify-center items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hidden lg:flex">
          <Link 
            to={detailPath}
            className="w-40 py-2.5 bg-[#FFFDFC] hover:bg-[#F4F1EC] text-[#201712] text-[10px] tracking-widest uppercase font-semibold rounded-full shadow-md transition-colors flex items-center justify-center space-x-1.5"
          >
            <svg className="h-3.5 w-3.5 text-[#8B6844]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span>View Details</span>
          </Link>
          
          <button 
            onClick={handleGetQuote}
            className="w-40 py-2.5 btn-luxury-wood text-white text-[10px] tracking-widest uppercase font-semibold rounded-full shadow-md flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <span>Get Quote</span>
          </button>
          
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-40 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] tracking-widest uppercase font-semibold rounded-full shadow-md transition-colors flex items-center justify-center space-x-1.5"
          >
            <svg className="h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path>
            </svg>
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      {/* CONTENT SECTION — padding 14px (p-3.5) on mobile, compact gaps */}
      <div className="p-3.5 lg:p-4 flex-grow flex flex-col justify-between text-left gap-1.5">
        <div className="space-y-1">
          {/* Product Name */}
          <Link to={detailPath} className="block mt-1.5 lg:mt-0">
            <h3 className="text-[16px] lg:text-[15px] font-semibold tracking-wide font-serif text-[#201712] leading-tight line-clamp-2 lg:line-clamp-1 hover:text-[#8B6844] transition-colors">
              {product.name}
            </h3>
          </Link>
          
          {/* Price */}
          <p className="text-[12.5px] lg:text-sm font-bold text-[#8B6844] font-serif leading-none mt-1">
            <span className="font-sans mr-0.5">₹</span>{currentPrice.toLocaleString('en-IN')}
          </p>
          
          {/* Warranty with shield icon (Desktop only) */}
          <div className="hidden lg:flex items-center space-x-2 text-[10px] text-[#6D6258] pt-1">
            <svg className="h-3.5 w-3.5 text-[#8B6844]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1-1z"></path>
            </svg>
            <span>{warranty}</span>
          </div>
          
          {/* Features list (Desktop only) */}
          <ul className="hidden lg:block space-y-0.5 pt-1.5 border-t border-[#E0D8CE] text-[11px] text-[#6D6258] font-light leading-[1.3]">
            {product.benefits?.slice(0, 3).map((benefit, idx) => (
              <li key={idx} className="flex items-center space-x-1.5">
                <span className="text-[#8B6844] font-bold">✓</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          {/* Compact Feature Row (Mobile only - 8px margin-top) */}
          <div className="flex lg:hidden flex-wrap items-center pt-2 mt-2 border-t border-[#E0D8CE]/40 text-[10px] text-[#6D6258]/85 gap-x-2 gap-y-0.5 font-medium select-none w-full">
            {product.benefits?.slice(0, 2).map((benefit, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-[#E0D8CE]">•</span>}
                <span className="flex items-center gap-1">
                  <span>✓</span>
                  <span className="line-clamp-1">{benefit}</span>
                </span>
              </React.Fragment>
            ))}
            {product.benefits?.length > 0 && (
              <>
                <span className="text-[#E0D8CE]">•</span>
                <span className="flex items-center gap-1">
                  <span>🛡</span>
                  <span className="line-clamp-1">{warranty.replace(' Years', 'Y').replace(' Year', 'Y')}</span>
                </span>
              </>
            )}
          </div>
        </div>

        {/* Mobile-only action buttons (Two-column side-by-side row) */}
        <div className="pt-3 border-t border-[#E0D8CE]/30 flex flex-row items-center gap-2.5 w-full select-none mt-3.5 lg:hidden">
          <Link
            to={detailPath}
            className="flex-1 h-[48px] border border-[#8B6844] text-[#8B6844] hover:bg-[#8B6844] hover:text-white hover:scale-102 text-[10px] font-bold py-2.5 text-center transition-all duration-300 rounded-[14px] cursor-pointer uppercase tracking-wider flex items-center justify-center shadow-xs active:scale-95"
          >
            View Details
          </Link>
          <button
            onClick={handleGetQuote}
            className="flex-1 h-[48px] bg-[#8B6844] hover:bg-[#705031] text-white hover:scale-102 text-[10px] font-bold py-2.5 text-center transition-all duration-300 rounded-[14px] cursor-pointer uppercase tracking-wider flex items-center justify-center shadow-md active:scale-95"
          >
            Get Quote
          </button>
        </div>
      </div>

    </div>
  );
};

export default ProductCard;
