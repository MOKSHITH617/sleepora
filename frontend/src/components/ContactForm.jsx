import React, { useState, useEffect } from 'react';
import API from '../services/api';

const ContactForm = ({ initialData }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [productSelection, setProductSelection] = useState('Ortho-Memory Foam');
  const [category, setCategory] = useState('mattress');
  const [dimension, setDimension] = useState('Queen Size (78 x 60)');
  const [dimensionType, setDimensionType] = useState('Queen Size (78 x 60)');
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [savedLead, setSavedLead] = useState(null);

  useEffect(() => {
    if (initialData) {
      if (initialData.productName) setProductSelection(initialData.productName);
      if (initialData.category) setCategory(initialData.category);
      if (initialData.configuration) {
        if (initialData.configuration.size) {
          const size = initialData.configuration.size;
          setDimension(size);
          
          const sizeLower = size.toLowerCase();
          if (sizeLower.includes('single') || size.includes('72 x 36')) {
            setDimensionType('Single Bed (72 x 36)');
          } else if (sizeLower.includes('double') || size.includes('72 x 48')) {
            setDimensionType('Double Bed (72 x 48)');
          } else if (sizeLower.includes('queen') || size.includes('78 x 60')) {
            setDimensionType('Queen Size (78 x 60)');
          } else if (sizeLower.includes('king') || size.includes('78 x 72')) {
            setDimensionType('King Size (78 x 72)');
          } else {
            setDimensionType('custom');
          }
        }
      }
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const leadData = {
      name,
      phone,
      email,
      productName: productSelection,
      category,
      configuration: {
        dimensions: dimension,
        quantity: `${quantity} pcs`
      },
      quotedPrice: initialData?.price || 0, // Fallback if no configurator price
      message
    };

    try {
      const response = await API.post('/leads', leadData);
      setSavedLead(response.data.lead);
      setModalOpen(true);
    } catch (error) {
      console.error('Failed to submit quote inquiry:', error);
      alert('Failed to register inquiry. Opening WhatsApp directly.');
      handleWhatsAppRedirect();
    }
    setLoading(false);
  };

  const handleWhatsAppRedirect = () => {
    const whatsappNumber = '919876543210';
    const textMsg = `Hello! I would like to request a quote. Here are my details:
- *Name*: ${name}
- *Phone*: ${phone}
- *Product Selected*: ${productSelection} (${category === 'mattress' ? 'Mattress' : 'Sofa'})
- *Dimensions/Details*: ${dimension}
- *Quantity*: ${quantity} pcs
${message ? `- *Notes*: ${message}` : ''}

Please send me the price details and dispatch timeline!`;

    const encodedText = encodeURIComponent(textMsg);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedText}`, '_blank');
    setModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setPhone('');
    setEmail('');
    setQuantity(1);
    setMessage('');
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-none border border-[#EADFC9]/45 shadow-sm select-none">
      <h3 className="text-xl font-serif font-bold text-[#2A211D] mb-1">Enquiry Details</h3>
      <p className="text-xs text-[#8E7D75] mb-6">Receive custom sizes price configurations directly on WhatsApp</p>
 
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label htmlFor="form-name" className="text-[10px] font-bold text-[#2A211D] uppercase tracking-wider mb-1.5">Full Name</label>
            <input 
              id="form-name"
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rajesh Kumar"
              required
              className="bg-[#FAF5EF] border border-[#EADFC9]/60 rounded-none py-2.5 px-3.5 text-xs focus:outline-none focus:border-[#7C5F43] text-[#2A211D] placeholder-[#8E7D75]"
            />
          </div>
 
          <div className="flex flex-col">
            <label htmlFor="form-phone" className="text-[10px] font-bold text-[#2A211D] uppercase tracking-wider mb-1.5">WhatsApp Mobile</label>
            <input 
              id="form-phone"
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9876543210"
              pattern="[0-9]{10}"
              title="Ten digit mobile number"
              required
              className="bg-[#FAF5EF] border border-[#EADFC9]/60 rounded-none py-2.5 px-3.5 text-xs focus:outline-none focus:border-[#7C5F43] text-[#2A211D] placeholder-[#8E7D75]"
            />
          </div>
        </div>
 
        <div className="flex flex-col">
          <label htmlFor="form-email" className="text-[10px] font-bold text-[#2A211D] uppercase tracking-wider mb-1.5">Email Address</label>
          <input 
            id="form-email"
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. rajesh@example.com"
            required
            className="bg-[#FAF5EF] border border-[#EADFC9]/60 rounded-none py-2.5 px-3.5 text-xs focus:outline-none focus:border-[#7C5F43] text-[#2A211D] placeholder-[#8E7D75]"
          />
        </div>
 
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label htmlFor="form-select-cat" className="text-[10px] font-bold text-[#2A211D] uppercase tracking-wider mb-1.5">Product Category</label>
            <select
              id="form-select-cat"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setProductSelection(e.target.value === 'mattress' ? 'Ortho-Memory Foam' : 'Royal Sectional Sofa');
              }}
              className="bg-[#FAF5EF] border border-[#EADFC9]/60 rounded-none py-2.5 px-3.5 text-xs focus:outline-none focus:border-[#7C5F43] text-[#2A211D] cursor-pointer"
            >
              <option value="mattress">Mattress Range</option>
              <option value="sofa">Sofa Collection</option>
              <option value="general">General Inquiry</option>
            </select>
          </div>
 
          <div className="flex flex-col">
            <label htmlFor="form-select-prod" className="text-[10px] font-bold text-[#2A211D] uppercase tracking-wider mb-1.5">Product Selection</label>
            {category === 'mattress' ? (
              <select
                id="form-select-prod"
                value={productSelection}
                onChange={(e) => setProductSelection(e.target.value)}
                className="bg-[#FAF5EF] border border-[#EADFC9]/60 rounded-none py-2.5 px-3.5 text-xs focus:outline-none focus:border-[#7C5F43] text-[#2A211D] cursor-pointer"
              >
                <option value="Ortho-Memory Foam">Ortho-Memory Foam</option>
                <option value="Premium Natural Latex">Premium Natural Latex</option>
                <option value="Luxury Pocket Spring">Luxury Pocket Spring</option>
                <option value="Dual Comfort (Hard/Soft)">Dual Comfort (Hard/Soft)</option>
                <option value="Classic Coir Mattress">Classic Coir Mattress</option>
              </select>
            ) : category === 'sofa' ? (
              <select
                id="form-select-prod"
                value={productSelection}
                onChange={(e) => setProductSelection(e.target.value)}
                className="bg-[#FAF5EF] border border-[#EADFC9]/60 rounded-none py-2.5 px-3.5 text-xs focus:outline-none focus:border-[#7C5F43] text-[#2A211D] cursor-pointer"
              >
                <option value="Royal Sectional Sofa">Royal Sectional Sofa (L-Shape)</option>
                <option value="Plush Lounge Recliner">Plush Lounge Recliner</option>
                <option value="Compact 2-Seater Studio Sofa">Compact 2-Seater Studio Sofa</option>
                <option value="Classic 3-Seater Comfort Sofa">Classic 3-Seater Comfort Sofa</option>
                <option value="Custom Sofa Design">Custom Sofa Layout</option>
              </select>
            ) : (
              <input 
                id="form-select-prod"
                type="text" 
                value={productSelection}
                onChange={(e) => setProductSelection(e.target.value)}
                placeholder="What product are you interested in?"
                className="bg-[#FAF5EF] border border-[#EADFC9]/60 rounded-none py-2.5 px-3.5 text-xs focus:outline-none focus:border-[#7C5F43] text-[#2A211D] placeholder-[#8E7D75]"
              />
            )}
          </div>
        </div>
 
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label htmlFor="form-dimension" className="text-[10px] font-bold text-[#2A211D] uppercase tracking-wider mb-1.5">Dimensions Preferred</label>
            <select
              id="form-dimension"
              value={dimensionType}
              onChange={(e) => {
                const val = e.target.value;
                setDimensionType(val);
                if (val !== 'custom') {
                  setDimension(val);
                } else {
                  setDimension('');
                }
              }}
              className="bg-[#FAF5EF] border border-[#EADFC9]/60 rounded-none py-2.5 px-3.5 text-xs focus:outline-none focus:border-[#7C5F43] text-[#2A211D] cursor-pointer mb-2.5"
            >
              <option value="Single Bed (72 x 36)">Single Bed (72" x 36")</option>
              <option value="Double Bed (72 x 48)">Double Bed (72" x 48")</option>
              <option value="Queen Size (78 x 60)">Queen Size (78" x 60")</option>
              <option value="King Size (78 x 72)">King Size (78" x 72")</option>
              <option value="custom">Custom Dimensions (specify below)</option>
            </select>
            
            {dimensionType === 'custom' && (
              <input 
                id="form-dimension-custom"
                type="text" 
                value={dimension}
                onChange={(e) => setDimension(e.target.value)}
                placeholder="e.g. custom 75x62 inches"
                required
                className="bg-[#FAF5EF] border border-[#7C5F43]/60 rounded-none py-2.5 px-3.5 text-xs focus:outline-none text-[#2A211D] animate-fade-in placeholder-[#8E7D75]"
              />
            )}
          </div>
 
          <div className="flex flex-col">
            <label htmlFor="form-qty" className="text-[10px] font-bold text-[#2A211D] uppercase tracking-wider mb-1.5">Required Quantity</label>
            <input 
              id="form-qty"
              type="number" 
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              required
              className="bg-[#FAF5EF] border border-[#EADFC9]/60 rounded-none py-2.5 px-3.5 text-xs focus:outline-none focus:border-[#7C5F43] text-[#2A211D] placeholder-[#8E7D75]"
            />
          </div>
        </div>
 
        <div className="flex flex-col">
          <label htmlFor="form-message" className="text-[10px] font-bold text-[#2A211D] uppercase tracking-wider mb-1.5">Special Sizing & Details</label>
          <textarea 
            id="form-message"
            rows="3"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g. My bed frame is exactly 75x62 inches and I need an 8-inch thickness..."
            className="bg-[#FAF5EF] border border-[#EADFC9]/60 rounded-none py-2.5 px-3.5 text-xs focus:outline-none focus:border-[#7C5F43] text-[#2A211D] placeholder-[#8E7D75] resize-none"
          ></textarea>
        </div>
 
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-none shadow-md flex items-center justify-center gap-2 mt-2 transition-all duration-300 disabled:opacity-50 focus:outline-none"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11.951 16.942l-1.378 5.244-5.244-1.378c.905.492 1.944.75 3.02.75 3.182 0 5.767-2.586 5.768-5.766 0-3.18-2.585-5.766-5.766-5.766z"/>
          </svg>
          {loading ? 'Submitting...' : 'Generate Invoice & Chat on WhatsApp'}
        </button>
 
      </form>
 
      {/* --- SUCCESS MODAL OVERLAY --- */}
      {modalOpen && (
        <div className="fixed inset-0 bg-[#2A211D]/60 backdrop-blur-xs z-[2000] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-none max-w-md w-full p-6 text-center border border-[#EADFC9]/45 shadow-xl relative">
            <div className="w-16 h-16 bg-[#25D366] text-white rounded-none flex items-center justify-center text-3xl mx-auto mb-4">
              ✓
            </div>
            <h3 className="text-xl font-serif font-bold text-[#2A211D] mb-1">Enquiry Registered!</h3>
            <p className="text-xs text-[#8E7D75] mb-5">
              We have successfully registered your inquiry in our database. Click below to initiate direct WhatsApp chat with our factory owner to complete dispatch.
            </p>
 
            {savedLead && (
              <div className="bg-[#FAF8F5] border border-[#EADFC9]/30 text-left p-4 rounded-none text-xs space-y-1.5 mb-6 text-[#2A211D] select-none">
                <div><strong>Inquirer Name:</strong> {savedLead.name}</div>
                <div><strong>Mobile Contact:</strong> {savedLead.phone}</div>
                <div><strong>Configured Selection:</strong> {savedLead.productName}</div>
                <div><strong>Dimensions Preferred:</strong> {savedLead.configuration?.dimensions}</div>
                <div><strong>Quantity Ordered:</strong> {savedLead.configuration?.quantity}</div>
              </div>
            )}
 
            <div className="flex flex-col gap-2">
              <button 
                onClick={handleWhatsAppRedirect}
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-xs uppercase tracking-wider py-3 rounded-none flex items-center justify-center gap-2 focus:outline-none"
              >
                Connect with Factory Owner Now
              </button>
              <button 
                onClick={() => setModalOpen(false)}
                className="w-full text-[#8E7D75] hover:text-[#2A211D] font-bold text-[10px] uppercase tracking-wider py-2 mt-1 focus:outline-none"
              >
                Cancel & Modify Layout
              </button>
            </div>
          </div>
        </div>
      )}
 
    </div>
  );
};

export default ContactForm;
