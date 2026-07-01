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
    <div className="bg-white rounded-xl border border-[#E6DED2] overflow-hidden flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.10)] hover:border-[#C7A36B] hover:-translate-y-2 transition-all duration-300 group h-[430px] max-h-[445px]">
      
      {/* IMAGE SECTION — 225px (~52% of 430px) */}
      <div className="h-[225px] flex-shrink-0 overflow-hidden relative border-b border-[#E6DED2]">
        <img 
          src={imgUrl} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Desktop-only hover overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex flex-col justify-center items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hidden lg:flex">
          <Link 
            to={detailPath}
            className="w-40 py-2.5 bg-white hover:bg-[#F2ECE3] text-[#2A2A2A] text-[10px] tracking-widest uppercase font-semibold rounded-full shadow-md transition-colors flex items-center justify-center space-x-1.5"
          >
            <svg className="h-3.5 w-3.5 text-[#6B4F3B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span>View Details</span>
          </Link>
          
          <button 
            onClick={handleGetQuote}
            className="w-40 py-2.5 bg-[#6B4F3B] hover:bg-[#A67C52] text-white text-[10px] tracking-widest uppercase font-semibold rounded-full shadow-md transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
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

      {/* CONTENT SECTION — padding 16px (p-4), compact gaps */}
      <div className="p-4 flex-grow flex flex-col justify-between text-left gap-1.5">
        <div className="space-y-1">
          {/* Product Name */}
          <h3 className="text-[15px] font-semibold tracking-wide font-serif text-[#2A2A2A] leading-tight line-clamp-1">
            {product.name}
          </h3>
          
          {/* Price */}
          <p className="text-sm font-bold text-[#A67C52] font-serif leading-none">
            ₹{currentPrice.toLocaleString('en-IN')}
          </p>
          
          {/* Warranty with shield icon */}
          <div className="flex items-center space-x-2 text-[10px] text-[#2A2A2A]/50">
            <svg className="h-3.5 w-3.5 text-[#C7A36B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
            </svg>
            <span>{warranty}</span>
          </div>
          
          {/* Features list */}
          <ul className="space-y-0.5 pt-1.5 border-t border-[#E6DED2] text-[11px] text-[#2A2A2A]/60 font-light leading-[1.3]">
            {product.benefits?.slice(0, 3).map((benefit, idx) => (
              <li key={idx} className="flex items-center space-x-1.5">
                <span className="text-[#C7A36B] font-bold">✓</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile-only action buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E6DED2] lg:hidden">
          <Link
            to={detailPath}
            className="py-2 text-[11px] font-bold uppercase tracking-wider text-white bg-[#6B4F3B] hover:bg-[#A67C52] rounded transition-all text-center shadow-sm"
          >
            Details
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 text-[11px] font-bold uppercase tracking-wider text-[#6B4F3B] hover:bg-[#F2ECE3] border border-[#6B4F3B] rounded transition-all text-center flex items-center justify-center space-x-1"
          >
            <svg className="h-3.5 w-3.5 text-emerald-600 fill-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path>
            </svg>
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

    </div>
  );
};

export default ProductCard;
