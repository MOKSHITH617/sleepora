import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const isMattress = product.category === 'mattress';

  // Baseline prices (Starting From)
  const currentPrice = product.basePrice;
  const retailPrice = Math.round(product.basePrice * product.retailMultiplier);
  const savings = retailPrice - currentPrice;
  const savingsPercent = Math.round((savings / retailPrice) * 100);

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

  return (
    <div className="w-full flex flex-col bg-white border border-border rounded-lg shadow-sm overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-lg group relative">
      
      {/* Badge */}
      {product.isFeatured && (
        <span className="absolute top-3 left-3 bg-accent text-primary px-2 py-0.5 rounded text-[9px] font-extrabold tracking-[0.5px] z-10 shadow">
          {isMattress ? 'Top Seller' : 'Featured Craft'}
        </span>
      )}

      {/* Image Container with Breathing Room */}
      <div className="mx-3.5 mt-3.5 relative pt-[36%] bg-bg-light overflow-hidden rounded border border-border/40 shadow-sm">
        <img 
          src={imgUrl} 
          alt={product.name} 
          className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
        />
      </div>

      {/* Info Body */}
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          {/* Category Badge & Rating Row */}
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[9px] font-bold uppercase tracking-wider text-primary-light bg-primary-light/10 px-1.5 py-0.5 rounded">
              {isMattress ? 'Mattress' : 'Sofa'}
            </span>
            <span className="flex items-center gap-1 text-accent text-[10px] font-semibold">
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
              {product.ratings} ({product.reviewsCount})
            </span>
          </div>

          {/* Title */}
          <h3 className="text-sm md:text-base font-extrabold font-display text-primary mb-1 line-clamp-1 group-hover:text-accent transition-colors duration-300">
            {product.name}
          </h3>
          
          {/* Description */}
          <p className="text-[11.5px] text-text-muted leading-snug mb-2.5 line-clamp-2">
            {product.shortDescription}
          </p>
        </div>

        {/* Pricing Comparison (Starting From & Savings) */}
        <div className="border-t border-border pt-2.5 mt-auto">
          <div className="flex justify-between items-end mb-3">
            <div className="text-left">
              <span className="block text-[8px] text-text-muted font-bold uppercase tracking-wider leading-none mb-1">Starting From</span>
              <span className="text-lg font-black text-primary leading-none">
                ₹{currentPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-right">
              <span className="inline-block bg-accent-light text-primary font-bold text-[9.5px] px-2 py-0.75 rounded shadow-xs border border-accent/20">
                Save {savingsPercent}%
              </span>
            </div>
          </div>

          {/* Symmetrical Button Layout */}
          <div className="grid grid-cols-3 gap-2">
            <Link 
              to={detailPath}
              className="bg-primary-light text-white text-[10px] font-bold h-8 rounded flex items-center justify-center hover:bg-primary text-center transition-all duration-300 active:scale-95 shadow-xs"
            >
              Details
            </Link>
            
            <button 
              onClick={handleGetQuote}
              className="bg-accent hover:bg-accent-hover text-primary font-bold text-[10px] h-8 rounded flex items-center justify-center shadow-gold hover:shadow transition-all duration-300 active:scale-95"
            >
              Get Quote
            </button>
            
            <button 
              onClick={handleWhatsAppEnquiry}
              className="bg-whatsapp hover:bg-whatsapp-dark text-white rounded flex items-center justify-center gap-1 h-8 transition-all duration-300 active:scale-95 shadow-xs hover:shadow text-[10px] font-bold w-full"
              title="Inquire on WhatsApp"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.432 2.503 1.157 3.473L6.5 20.5l5.244-1.378c.905.492 1.944.75 3.02.75 3.182 0 5.767-2.586 5.768-5.766 0-3.18-2.585-5.766-5.766-5.766zm2.75 7.64c-.161-.081-.954-.471-1.102-.524-.148-.053-.255-.08-.363.08-.108.16-.417.524-.51.63-.095.107-.19.12-.35.04-.16-.08-.68-.25-1.295-.8-.479-.427-.802-.954-.897-1.114-.094-.16-.01-.247.07-.327.072-.073.161-.187.242-.28.08-.094.108-.16.162-.267.054-.107.027-.2-.014-.28-.04-.08-.363-.873-.497-1.202-.132-.32-.278-.277-.38-.282-.098-.005-.213-.005-.33-.005-.115 0-.303.043-.462.213-.158.17-.604.59-.604 1.44 0 .85.618 1.67.704 1.789.086.117 1.213 1.853 2.94 2.597.41.177.73.282.98.362.414.13.79.112 1.088.067.332-.05.955-.39 1.09-.768.134-.378.134-.702.094-.769-.04-.067-.148-.107-.309-.188z"/>
              </svg>
              <span>WhatsApp</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductCard;
