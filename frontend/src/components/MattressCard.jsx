import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const MattressCard = ({ product }) => {
  const navigate = useNavigate();

  const currentPrice = product.basePrice;
  const warranty = product.specifications?.['Warranty'] || '10 Year Warranty';
  const comfort = product.specifications?.['Comfort'] || 'Medium Firm';
  const material = product.specifications?.['Material'] || 'Memory Foam';
  const badge = product.specifications?.['Badge'] || '';
  
  const imgUrl = product.images?.[0] || '/images/ortho_mattress.png';
  const detailPath = `/mattresses/${product.slug}`;
  const whatsappNumber = '919876543210';
  
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hello! I am interested in purchasing your mattresses. Here is my preference:
- *Mattress Name*: ${product.name}
- *Starting Price*: ₹${currentPrice.toLocaleString('en-IN')}

Please let me know how we can proceed with ordering, payment, and delivery!`
  )}`;

  const handleGetQuote = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/contact', {
      state: {
        productName: product.name,
        category: 'mattress',
        configuration: {},
        price: currentPrice
      }
    });
  };

  return (
    <div className="bg-[#FFFDFC] rounded-xl border border-[#E0D8CE]/60 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-[0_15px_45px_rgba(139,104,68,0.15)] hover:border-[#8B6844]/60 transition-all duration-300 group h-auto md:h-[480px] lg:h-auto relative">
      {/* Image Container */}
      <div className="h-[220px] w-full overflow-hidden relative border-b border-[#E0D8CE]/40 flex-shrink-0 bg-[#F4F1EC]">
        {/* Badge */}
        {badge && badge !== 'FEATURED' && (
          <div className="absolute top-3 left-3 bg-[#8B6844]/95 text-white text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 z-10 rounded-none">
            {badge}
          </div>
        )}
        <Link to={detailPath}>
          <img
            src={imgUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 contrast-105 saturate-105"
          />
        </Link>
        {/* Floating WhatsApp button inline top-right */}
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
      </div>

      {/* Content */}
      <div className="p-3.5 md:p-5 flex-grow flex flex-col justify-between text-left lg:pt-[18px] lg:pb-[18px] lg:px-[20px]">
        <div className="space-y-1">
          {/* Title */}
          <Link to={detailPath} className="block mt-1.5 md:mt-0 lg:mt-0 lg:mb-[10px]">
            <h3 className="font-serif font-bold text-[16px] md:text-[19px] text-[#201712] tracking-wide leading-snug line-clamp-2 md:line-clamp-1 hover:text-[#8B6844] transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Pricing */}
          <p className="text-[12.5px] md:text-[14.5px] text-[#6D6258] font-medium mt-1 pb-2 md:pb-3.5 lg:mt-0 lg:pb-0 lg:mb-[14px] leading-none">
            Starting from <span className="text-[16px] md:text-[19px] font-bold text-[#8B6844] font-serif ml-1"><span className="font-sans mr-0.5">₹</span>{currentPrice.toLocaleString('en-IN')}</span>
          </p>

          {/* Specs inline row with icons (Desktop only) */}
          <div className="hidden md:flex flex-wrap items-center pt-3.5 border-t border-[#E0D8CE]/40 text-[11px] text-[#6D6258] gap-x-2.5 gap-y-1.5 font-medium select-none w-full lg:mt-0 lg:pt-0 lg:border-t-0 lg:mb-[16px] lg:flex lg:flex-wrap lg:items-center lg:gap-x-4 lg:gap-y-2 lg:text-[12px]">
            {/* Material */}
            <span className="flex items-center gap-1.5 min-w-0 lg:gap-[6px] lg:whitespace-nowrap lg:flex lg:items-center lg:flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-[#8B6844] flex-shrink-0 lg:w-[13px] lg:h-[13px] lg:flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="6" width="18" height="12" rx="1.5" />
                <path d="M3 10h18" strokeDasharray="1.5 1.5" />
              </svg>
              <span className="lg:font-medium lg:leading-[1.4]">{material}</span>
            </span>

            <span className="text-stone-300 lg:hidden">|</span>

            {/* Comfort */}
            <span className="flex items-center gap-1.5 min-w-0 lg:gap-[6px] lg:whitespace-nowrap lg:flex lg:items-center lg:flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-[#8B6844] flex-shrink-0 lg:w-[13px] lg:h-[13px] lg:flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 6h16M4 11h16M4 16h16" strokeLinecap="round" />
              </svg>
              <span className="lg:font-medium lg:leading-[1.4]">{comfort}</span>
            </span>

            <span className="text-stone-300 lg:hidden">|</span>

            {/* Warranty */}
            <span className="flex items-center gap-1.5 min-w-0 lg:gap-[6px] lg:whitespace-nowrap lg:flex lg:items-center lg:flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-[#8B6844] flex-shrink-0 lg:w-[13px] lg:h-[13px] lg:flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span className="lg:font-medium lg:leading-[1.4]">{warranty}</span>
            </span>
          </div>

          {/* Compact Feature Row (Mobile only - 8px margin-top) */}
          <div className="flex md:hidden flex-wrap items-center pt-2 mt-2 border-t border-[#E0D8CE]/40 text-[10px] text-[#6D6258]/85 gap-x-2 gap-y-0.5 font-medium select-none w-full">
            <span className="flex items-center gap-1">
              <span>🛏</span>
              <span className="line-clamp-1">{material}</span>
            </span>
            <span className="text-[#E0D8CE]">•</span>
            <span className="flex items-center gap-1">
              <span>🛡</span>
              <span className="line-clamp-1">{warranty.replace(' Years', 'Y').replace(' Year', 'Y')}</span>
            </span>
            <span className="text-[#E0D8CE]">•</span>
            <span className="flex items-center gap-1">
              <span>⭐</span>
              <span className="line-clamp-1">{comfort}</span>
            </span>
          </div>
        </div>

        {/* Buttons Row (Always Visible) */}
        <div className="pt-3 border-t border-[#E0D8CE]/30 flex flex-row items-center gap-2.5 w-full select-none mt-3.5 md:pt-3.5 md:mt-auto lg:mt-0 lg:pt-[16px]">
          <Link
            to={detailPath}
            className="flex-1 h-[48px] md:h-auto border border-[#8B6844] text-[#8B6844] hover:bg-[#8B6844] hover:text-white hover:scale-102 text-[10px] md:text-[10.5px] font-bold py-2.5 md:py-2.5 text-center transition-all duration-300 rounded-[14px] md:rounded-full cursor-pointer uppercase tracking-wider flex items-center justify-center shadow-xs active:scale-95"
          >
            VIEW DETAILS
          </Link>
          <button
            onClick={handleGetQuote}
            className="flex-1 h-[48px] md:h-auto bg-[#8B6844] hover:bg-[#705031] text-white hover:scale-102 text-[10px] md:text-[10.5px] font-bold py-2.5 md:py-2.5 text-center transition-all duration-300 rounded-[14px] md:rounded-full cursor-pointer uppercase tracking-wider flex items-center justify-center shadow-md active:scale-95"
          >
            GET QUOTE
          </button>
          
          {/* Circular WhatsApp Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex w-9.5 h-9.5 rounded-full bg-[#25D366] hover:bg-[#128C7E] items-center justify-center text-white transition-colors flex-shrink-0 shadow-sm"
            title="Chat on WhatsApp"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.455L0 24zm6.59-4.846c1.6.95 3.473 1.452 5.378 1.453 5.541 0 10.051-4.509 10.055-10.05.002-2.684-1.038-5.207-2.93-7.098C17.26 1.57 14.75 .53 12.008.53c-5.547 0-10.059 4.511-10.063 10.055-.001 1.902.497 3.762 1.442 5.36l-.946 3.454 3.541-.928zM17.52 14.33c-.302-.15-1.785-.88-2.053-.978-.268-.1-.463-.15-.658.15-.195.3-.755.95-.926 1.15-.17.2-.34.225-.642.075-.302-.15-1.272-.469-2.423-1.496-.895-.798-1.5-1.784-1.676-2.084-.176-.3-.019-.462.132-.611.135-.134.302-.35.453-.525.151-.175.201-.3.302-.5.101-.2.05-.375-.025-.525-.075-.15-.658-1.583-.902-2.172-.238-.574-.479-.496-.658-.505-.17-.008-.365-.01-.56-.01-.195 0-.512.074-.78.373-.268.3-.993.972-.993 2.37 0 1.399 1.018 2.748 1.164 2.948.146.2 2.005 3.061 4.856 4.285.679.292 1.209.466 1.62.597.683.217 1.303.187 1.795.114.549-.08 1.785-.73 2.039-1.436.254-.707.254-1.314.177-1.438-.077-.123-.28-.2-.58-.35z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default MattressCard;
