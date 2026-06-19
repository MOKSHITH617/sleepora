import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import MetaTags from '../components/MetaTags';

const AdminDashboard = () => {
  const { isAuthenticated, logout, updateCredentials } = useContext(AuthContext);
  const navigate = useNavigate();

  // Auth Protection
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  // Tab State
  const [activeTab, setActiveTab] = useState('leads');

  // Core Data Lists State
  const [leads, setLeads] = useState([]);
  const [products, setProducts] = useState([]);
  const [mattressConfig, setMattressConfig] = useState(null);
  const [sofaConfig, setSofaConfig] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [homepageContent, setHomepageContent] = useState(null);

  // loading & errors
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Modals & Edit Form States
  const [editingProduct, setEditingProduct] = useState(null); // null means adding new
  const [productForm, setProductForm] = useState({
    name: '', category: 'mattress', description: '', shortDescription: '',
    basePrice: '', retailMultiplier: '2.0', images: [], isAvailable: true, isFeatured: false,
    mattressCoreType: 'none', sofaCategory: 'none', specifications: {}, benefits: []
  });
  const [tempSpecKey, setTempSpecKey] = useState('');
  const [tempSpecVal, setTempSpecVal] = useState('');
  const [tempBenefit, setTempBenefit] = useState('');

  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [testimonialForm, setTestimonialForm] = useState({
    name: '', rating: 5, dateText: 'Just now', text: '', location: ''
  });

  const [homepageForm, setHomepageForm] = useState({
    heroSubheading: '', heroTitle: '', heroSubtitle: '', ctaTitle: '', ctaSubtitle: ''
  });

  const [profileForm, setProfileForm] = useState({
    email: '', password: '', confirmPassword: ''
  });

  // Fetch Dashboard Datasets
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const leadsRes = await API.get('/leads');
      setLeads(leadsRes.data.leads || []);

      const productsRes = await API.get('/products');
      setProducts(productsRes.data.products || []);

      const matRes = await API.get('/configs/mattress');
      setMattressConfig(matRes.data.config || null);

      const sofaRes = await API.get('/configs/sofa');
      setSofaConfig(sofaRes.data.config || null);

      const testRes = await API.get('/testimonials');
      setTestimonials(testRes.data.testimonials || []);

      const homeRes = await API.get('/homepage');
      if (homeRes.data.content) {
        setHomepageContent(homeRes.data.content);
        setHomepageForm(homeRes.data.content);
      }
    } catch (err) {
      console.error('Failed to load dashboard resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  // Lead Actions
  const handleDeleteLead = async (id) => {
    if (!window.confirm('Delete this inquiry record?')) return;
    try {
      await API.delete(`/leads/${id}`);
      setLeads(leads.filter(l => l._id !== id));
    } catch (err) {
      alert('Delete lead failed.');
    }
  };

  // Image Upload handler (Multiple images max 5)
  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setSubmitLoading(true);
    const formData = new FormData();
    for (let file of files) {
      formData.append('images', file);
    }

    try {
      const response = await API.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        setProductForm(prev => ({
          ...prev,
          images: [...prev.images, ...response.data.urls]
        }));
      }
    } catch (err) {
      alert('File upload failed. Ensure server is running and format is correct.');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Product CRUD saving
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const payload = { ...productForm };
      
      if (editingProduct) {
        await API.put(`/products/${editingProduct._id}`, payload);
      } else {
        await API.post('/products', payload);
      }
      
      await fetchDashboardData();
      resetProductForm();
      alert('Product saved successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Save product failed.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEditProductClick = (p) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name || '',
      category: p.category || 'mattress',
      description: p.description || '',
      shortDescription: p.shortDescription || '',
      basePrice: p.basePrice || '',
      retailMultiplier: p.retailMultiplier || '2.0',
      images: p.images || [],
      isAvailable: p.isAvailable ?? true,
      isFeatured: p.isFeatured ?? false,
      mattressCoreType: p.mattressCoreType || 'none',
      sofaCategory: p.sofaCategory || 'none',
      specifications: p.specifications || {},
      benefits: p.benefits || []
    });
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await API.delete(`/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
      alert('Product deleted.');
    } catch (err) {
      alert('Delete product failed.');
    }
  };

  const resetProductForm = () => {
    setEditingProduct(null);
    setProductForm({
      name: '', category: 'mattress', description: '', shortDescription: '',
      basePrice: '', retailMultiplier: '2.0', images: [], isAvailable: true, isFeatured: false,
      mattressCoreType: 'none', sofaCategory: 'none', specifications: {}, benefits: []
    });
    setTempSpecKey('');
    setTempSpecVal('');
    setTempBenefit('');
  };

  // Specs helpers
  const addSpecPair = () => {
    if (!tempSpecKey || !tempSpecVal) return;
    setProductForm(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [tempSpecKey]: tempSpecVal
      }
    }));
    setTempSpecKey('');
    setTempSpecVal('');
  };

  const removeSpecKey = (key) => {
    const updated = { ...productForm.specifications };
    delete updated[key];
    setProductForm(prev => ({ ...prev, specifications: updated }));
  };

  const addBenefitItem = () => {
    if (!tempBenefit) return;
    setProductForm(prev => ({
      ...prev,
      benefits: [...prev.benefits, tempBenefit]
    }));
    setTempBenefit('');
  };

  const removeBenefitItem = (index) => {
    setProductForm(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, idx) => idx !== index)
    }));
  };

  // Testimonials CRUD saving
  const handleSaveTestimonial = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      if (editingTestimonial) {
        await API.put(`/testimonials/${editingTestimonial._id}`, testimonialForm);
      } else {
        await API.post('/testimonials', testimonialForm);
      }
      await fetchDashboardData();
      resetTestimonialForm();
    } catch (err) {
      alert('Save testimonial failed.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEditTestimonialClick = (t) => {
    setEditingTestimonial(t);
    setTestimonialForm({
      name: t.name, rating: t.rating, dateText: t.dateText, text: t.text, location: t.location || ''
    });
  };

  const handleDeleteTestimonial = async (id) => {
    if (!window.confirm('Delete this review testimonial?')) return;
    try {
      await API.delete(`/testimonials/${id}`);
      setTestimonials(testimonials.filter(t => t._id !== id));
    } catch (err) {
      alert('Delete failed.');
    }
  };

  const resetTestimonialForm = () => {
    setEditingTestimonial(null);
    setTestimonialForm({ name: '', rating: 5, dateText: 'Just now', text: '', location: '' });
  };

  // Mattress Configuration Save
  const handleSaveMattressConfig = async (updatedConfig) => {
    setSubmitLoading(true);
    try {
      const res = await API.put('/configs/mattress', updatedConfig);
      setMattressConfig(res.data.config);
      alert('Mattress configs and multipliers updated successfully!');
    } catch (err) {
      alert('Failed to save configuration multipliers.');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Sofa Configuration Save
  const handleSaveSofaConfig = async (updatedConfig) => {
    setSubmitLoading(true);
    try {
      const res = await API.put('/configs/sofa', updatedConfig);
      setSofaConfig(res.data.config);
      alert('Sofa configs and pricing rules updated successfully!');
    } catch (err) {
      alert('Failed to save sofa configurations.');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Homepage Content Save
  const handleSaveHomepage = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const res = await API.put('/homepage', homepageForm);
      setHomepageContent(res.data.content);
      alert('Homepage headlines updated successfully!');
    } catch (err) {
      alert('Failed to update homepage content.');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Profile Save
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (profileForm.password !== profileForm.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    setSubmitLoading(true);
    const res = await updateCredentials(profileForm.email, profileForm.password);
    if (res.success) {
      alert('Admin credentials updated successfully.');
      setProfileForm({ email: '', password: '', confirmPassword: '' });
    } else {
      alert(res.message);
    }
    setSubmitLoading(false);
  };

  // Search/Filter leads
  const filteredLeads = leads.filter(lead => {
    const matchesCategory = !categoryFilter || lead.category === categoryFilter;
    const matchesSearch = !searchQuery || 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10 select-none">
      <MetaTags title="Admin Management Dashboard" description="Configure mattress catalogs and leads." />

      <div className="flex justify-between items-center border-b border-border pb-6 mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-display text-primary">Administration Portal</h1>
          <p className="text-xs text-text-muted">Direct factory operations and configuration controllers</p>
        </div>
        <button 
          onClick={logout}
          className="bg-primary hover:bg-primary-light text-white font-bold text-xs py-2.5 px-6 rounded-sm transition-colors duration-200 focus:outline-none"
        >
          Logout Session
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sidebar Navigation */}
        <div className="lg:col-span-3 flex flex-col gap-1.5 bg-white border border-border rounded-md p-4">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-3 mb-2 block">Control Modules</span>
          <button 
            onClick={() => setActiveTab('leads')}
            className={`w-full text-left text-xs font-semibold py-3 px-4 rounded-sm transition-all duration-200 focus:outline-none ${activeTab === 'leads' ? 'bg-primary text-white font-bold' : 'text-text-muted hover:bg-bg-light hover:text-primary'}`}
          >
            Leads Inbox ({leads.length})
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full text-left text-xs font-semibold py-3 px-4 rounded-sm transition-all duration-200 focus:outline-none ${activeTab === 'products' ? 'bg-primary text-white font-bold' : 'text-text-muted hover:bg-bg-light hover:text-primary'}`}
          >
            Products Catalogue ({products.length})
          </button>
          <button 
            onClick={() => setActiveTab('mattress')}
            className={`w-full text-left text-xs font-semibold py-3 px-4 rounded-sm transition-all duration-200 focus:outline-none ${activeTab === 'mattress' ? 'bg-primary text-white font-bold' : 'text-text-muted hover:bg-bg-light hover:text-primary'}`}
          >
            Mattress Multipliers
          </button>
          <button 
            onClick={() => setActiveTab('sofa')}
            className={`w-full text-left text-xs font-semibold py-3 px-4 rounded-sm transition-all duration-200 focus:outline-none ${activeTab === 'sofa' ? 'bg-primary text-white font-bold' : 'text-text-muted hover:bg-bg-light hover:text-primary'}`}
          >
            Sofa Multipliers
          </button>
          <button 
            onClick={() => setActiveTab('testimonials')}
            className={`w-full text-left text-xs font-semibold py-3 px-4 rounded-sm transition-all duration-200 focus:outline-none ${activeTab === 'testimonials' ? 'bg-primary text-white font-bold' : 'text-text-muted hover:bg-bg-light hover:text-primary'}`}
          >
            Testimonial Reviews
          </button>
          <button 
            onClick={() => setActiveTab('homepage')}
            className={`w-full text-left text-xs font-semibold py-3 px-4 rounded-sm transition-all duration-200 focus:outline-none ${activeTab === 'homepage' ? 'bg-primary text-white font-bold' : 'text-text-muted hover:bg-bg-light hover:text-primary'}`}
          >
            Homepage Content
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left text-xs font-semibold py-3 px-4 rounded-sm transition-all duration-200 focus:outline-none ${activeTab === 'profile' ? 'bg-primary text-white font-bold' : 'text-text-muted hover:bg-bg-light hover:text-primary'}`}
          >
            Profile Safety
          </button>
        </div>

        {/* Dynamic Panel */}
        <div className="lg:col-span-9 bg-white border border-border rounded-md p-6 min-h-[480px]">
          
          {/* 1. LEADS INBOX MODULE */}
          {activeTab === 'leads' && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-bold font-display text-primary mb-1">Leads Inbox</h3>
              <p className="text-xs text-text-muted mb-6">Manage customer configurations submitted through WhatsApp and forms</p>

              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search lead name, product name or mobile..."
                  className="bg-bg-light border border-border rounded-sm py-2 px-3.5 text-xs focus:outline-none text-primary"
                />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-bg-light border border-border rounded-sm py-2 px-3 text-xs focus:outline-none text-primary cursor-pointer"
                >
                  <option value="">All Categories</option>
                  <option value="mattress">Mattresses Only</option>
                  <option value="sofa">Sofas Only</option>
                  <option value="general">General Contact Only</option>
                </select>
              </div>

              {/* Leads List */}
              {filteredLeads.length > 0 ? (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                  {filteredLeads.map((lead) => (
                    <div key={lead._id} className="border border-border rounded-sm p-4 bg-bg-light/40 flex justify-between items-start gap-4">
                      <div className="text-xs space-y-1 text-primary">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-primary">{lead.name}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${lead.category === 'mattress' ? 'bg-primary-light/10 text-primary-light' : lead.category === 'sofa' ? 'bg-accent-light text-primary' : 'bg-border text-text-muted'}`}>
                            {lead.category}
                          </span>
                        </div>
                        <div><strong>Phone:</strong> {lead.phone} | <strong>Email:</strong> {lead.email}</div>
                        <div><strong>Product Name:</strong> {lead.productName}</div>
                        {lead.configuration && (
                          <div className="bg-white p-2 border border-border text-[11px] rounded mt-2">
                            <strong>Configuration details:</strong>
                            <div className="grid grid-cols-2 gap-x-4 mt-1">
                              {Object.entries(lead.configuration).map(([key, val]) => (
                                <span key={key}>{key}: <strong className="font-semibold text-primary">{val}</strong></span>
                              ))}
                            </div>
                          </div>
                        )}
                        {lead.message && <div className="mt-2 text-text-muted italic">"{lead.message}"</div>}
                        <div className="text-[10px] text-text-muted pt-2 border-t border-border/60">
                          Submitted on: {new Date(lead.createdAt).toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-3 justify-between">
                        <span className="text-lg font-black text-primary">₹{lead.quotedPrice.toLocaleString('en-IN')}</span>
                        <button 
                          onClick={() => handleDeleteLead(lead._id)}
                          className="text-red-500 hover:text-red-700 text-xs font-bold focus:outline-none"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 text-xs text-text-muted">
                  No inquiries found matching search criteria.
                </div>
              )}
            </div>
          )}

          {/* 2. PRODUCTS CATALOGUE MODULE */}
          {activeTab === 'products' && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold font-display text-primary mb-1">Products Catalogue</h3>
                  <p className="text-xs text-text-muted">Add, edit, or delete mattresses and sofas catalogued items</p>
                </div>
                <button 
                  onClick={resetProductForm}
                  className="bg-accent hover:bg-accent-hover text-primary font-bold text-xs py-2 px-4 rounded-sm transition-all focus:outline-none shadow-sm"
                >
                  + Add Product
                </button>
              </div>

              {/* Product Form Section */}
              <div className="bg-bg-light/40 border border-border p-5 rounded-sm mb-8">
                <h4 className="font-bold text-xs text-primary mb-4 border-b border-border pb-2">
                  {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Create New Product'}
                </h4>
                
                <form onSubmit={handleSaveProduct} className="text-xs space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="font-bold text-primary mb-1">Product Name</label>
                      <input 
                        type="text" 
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        required
                        placeholder="e.g. Memory Foam Ortho"
                        className="bg-white border border-border rounded-sm py-2 px-3 focus:outline-none text-primary"
                      />
                    </div>
                    
                    <div className="flex flex-col">
                      <label className="font-bold text-primary mb-1">Category</label>
                      <select 
                        value={productForm.category}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                        className="bg-white border border-border rounded-sm py-2 px-3 focus:outline-none text-primary cursor-pointer"
                      >
                        <option value="mattress">Mattress Range</option>
                        <option value="sofa">Sofa Collection</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col">
                      <label className="font-bold text-primary mb-1">Starting Base Price (₹)</label>
                      <input 
                        type="number" 
                        value={productForm.basePrice}
                        onChange={(e) => setProductForm({ ...productForm, basePrice: parseInt(e.target.value) || '' })}
                        required
                        placeholder="6500"
                        className="bg-white border border-border rounded-sm py-2 px-3 focus:outline-none text-primary"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="font-bold text-primary mb-1">Showroom Price Multiplier</label>
                      <input 
                        type="text" 
                        value={productForm.retailMultiplier}
                        onChange={(e) => setProductForm({ ...productForm, retailMultiplier: parseFloat(e.target.value) || 2.0 })}
                        required
                        placeholder="2.0"
                        className="bg-white border border-border rounded-sm py-2 px-3 focus:outline-none text-primary"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="font-bold text-primary mb-1">Sub-Category Identifier</label>
                      {productForm.category === 'mattress' ? (
                        <select 
                          value={productForm.mattressCoreType}
                          onChange={(e) => setProductForm({ ...productForm, mattressCoreType: e.target.value })}
                          className="bg-white border border-border rounded-sm py-2 px-3 focus:outline-none text-primary cursor-pointer"
                        >
                          <option value="none">None</option>
                          <option value="ortho">Ortho Memory</option>
                          <option value="latex">Natural Latex</option>
                          <option value="spring">Pocket Spring</option>
                          <option value="dual">Dual Comfort</option>
                          <option value="coir">Classic Coir</option>
                        </select>
                      ) : (
                        <select 
                          value={productForm.sofaCategory}
                          onChange={(e) => setProductForm({ ...productForm, sofaCategory: e.target.value })}
                          className="bg-white border border-border rounded-sm py-2 px-3 focus:outline-none text-primary cursor-pointer"
                        >
                          <option value="none">None</option>
                          <option value="l-shape">L Shape Sofa</option>
                          <option value="recliner">Recliner Sofa</option>
                          <option value="2-seater">2 Seater</option>
                          <option value="3-seater">3 Seater</option>
                          <option value="corner">Corner Sofa</option>
                          <option value="custom">Custom Layout</option>
                        </select>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="font-bold text-primary mb-1">Short Description</label>
                    <input 
                      type="text" 
                      value={productForm.shortDescription}
                      onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
                      required
                      placeholder="Catchy tagline for product catalogue lists..."
                      className="bg-white border border-border rounded-sm py-2 px-3 focus:outline-none text-primary"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-bold text-primary mb-1">Detailed Description</label>
                    <textarea 
                      rows="2"
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      required
                      placeholder="Detailed marketing breakdown for the details page..."
                      className="bg-white border border-border rounded-sm py-2 px-3 focus:outline-none text-primary resize-none"
                    ></textarea>
                  </div>

                  {/* Multi-Image Upload Panel */}
                  <div className="border border-border p-4 bg-white rounded">
                    <label className="block font-bold text-primary mb-1.5">Product Images Gallery (Cloudinary/Local)</label>
                    <input 
                      type="file" 
                      multiple 
                      onChange={handleImageUpload} 
                      className="text-xs mb-3 block"
                    />
                    
                    {productForm.images.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {productForm.images.map((img, idx) => (
                          <div key={idx} className="relative w-16 h-12 rounded border border-border overflow-hidden">
                            <img src={img} alt="preview" className="w-full h-full object-cover" />
                            <button 
                              type="button" 
                              onClick={() => setProductForm({ ...productForm, images: productForm.images.filter((_, i) => i !== idx) })}
                              className="absolute top-0 right-0 bg-red-500 text-white w-4 h-4 flex items-center justify-center font-bold font-sans text-[8px] focus:outline-none"
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Specifications key-value helper */}
                  <div className="border border-border p-4 bg-white rounded">
                    <label className="block font-bold text-primary mb-2">Technical Specifications</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                      <input 
                        type="text" 
                        placeholder="Feature Key (e.g. Firmness)" 
                        value={tempSpecKey}
                        onChange={(e) => setTempSpecKey(e.target.value)}
                        className="bg-bg-light border border-border rounded-sm py-1.5 px-2.5 focus:outline-none"
                      />
                      <input 
                        type="text" 
                        placeholder="Value (e.g. Medium Soft)" 
                        value={tempSpecVal}
                        onChange={(e) => setTempSpecVal(e.target.value)}
                        className="bg-bg-light border border-border rounded-sm py-1.5 px-2.5 focus:outline-none"
                      />
                      <button 
                        type="button" 
                        onClick={addSpecPair}
                        className="bg-primary text-white font-bold py-1 px-3 rounded-sm hover:bg-primary-light transition-colors"
                      >
                        Add Spec Pair
                      </button>
                    </div>

                    {Object.keys(productForm.specifications).length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(productForm.specifications).map(([key, val]) => (
                          <span key={key} className="bg-bg-light border border-border text-[10px] py-1 px-2.5 rounded flex items-center gap-1">
                            <strong>{key}:</strong> {val}
                            <button type="button" onClick={() => removeSpecKey(key)} className="text-red-500 font-bold hover:text-red-700 ml-1">&times;</button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Design Benefits helpers */}
                  <div className="border border-border p-4 bg-white rounded">
                    <label className="block font-bold text-primary mb-2">Design Benefits Bullet Points</label>
                    <div className="flex gap-2 mb-3">
                      <input 
                        type="text" 
                        placeholder="Benefits bullet point summary..." 
                        value={tempBenefit}
                        onChange={(e) => setTempBenefit(e.target.value)}
                        className="flex-grow bg-bg-light border border-border rounded-sm py-1.5 px-2.5 focus:outline-none"
                      />
                      <button 
                        type="button" 
                        onClick={addBenefitItem}
                        className="bg-primary text-white font-bold py-1 px-4 rounded-sm hover:bg-primary-light transition-colors"
                      >
                        Add Point
                      </button>
                    </div>

                    {productForm.benefits.length > 0 && (
                      <ul className="list-disc pl-5 space-y-1 text-text-muted">
                        {productForm.benefits.map((b, idx) => (
                          <li key={idx} className="flex justify-between items-center text-[10px]">
                            <span>{b}</span>
                            <button type="button" onClick={() => removeBenefitItem(idx)} className="text-red-500 font-bold hover:text-red-700">&times;</button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 font-bold text-primary cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={productForm.isAvailable}
                          onChange={(e) => setProductForm({ ...productForm, isAvailable: e.target.checked })}
                          className="cursor-pointer"
                        />
                        In Availability Stock
                      </label>
                      
                      <label className="flex items-center gap-2 font-bold text-primary cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={productForm.isFeatured}
                          onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                          className="cursor-pointer"
                        />
                        Featured Product Highlight
                      </label>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button 
                        type="button" 
                        onClick={resetProductForm}
                        className="border border-border py-2.5 px-5 rounded-sm hover:bg-bg-light transition-colors"
                      >
                        Reset Form
                      </button>
                      
                      <button 
                        type="submit" 
                        disabled={submitLoading}
                        className="bg-primary hover:bg-primary-light text-white font-bold py-2.5 px-6 rounded-sm shadow-sm transition-colors disabled:opacity-50"
                      >
                        {submitLoading ? 'Saving Product...' : 'Save Product Details'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Products List Grid */}
              <div className="border border-border rounded-sm overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-bg-light border-b border-border">
                    <tr>
                      <th className="p-3 font-bold text-primary">Product Name</th>
                      <th className="p-3 font-bold text-primary">Category</th>
                      <th className="p-3 font-bold text-primary">Base Price</th>
                      <th className="p-3 font-bold text-primary">Stock Status</th>
                      <th className="p-3 font-bold text-primary text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p._id} className="border-b border-border last:border-b-0 hover:bg-bg-light/20">
                        <td className="p-3 font-semibold text-primary">{p.name}</td>
                        <td className="p-3 capitalize text-text-muted">{p.category}</td>
                        <td className="p-3 text-primary font-bold">₹{p.basePrice.toLocaleString('en-IN')}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.isAvailable ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                            {p.isAvailable ? 'Available' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-3">
                          <button 
                            onClick={() => handleEditProductClick(p)}
                            className="text-primary hover:text-accent font-bold focus:outline-none"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(p._id)}
                            className="text-red-500 hover:text-red-700 font-bold focus:outline-none"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. MATTRESS CONFIG MODULE */}
          {activeTab === 'mattress' && mattressConfig && (
            <div className="animate-fade-in text-xs">
              <h3 className="text-xl font-bold font-display text-primary mb-1">Mattress Multipliers & Cores</h3>
              <p className="text-[11px] text-text-muted mb-6">Modify base rate prices, custom size dimensions, and 3D visualizer configurations</p>

              {/* Sizes Multipliers */}
              <div className="border border-border p-4 bg-bg-light/30 rounded-sm mb-6">
                <h4 className="font-bold text-xs text-primary mb-3">Sizing Dimensions Multipliers</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {mattressConfig.sizes.map((s, idx) => (
                    <div key={idx} className="flex flex-col bg-white p-3 border border-border rounded">
                      <span className="font-bold text-text-muted mb-1 block">{s.name}</span>
                      <input 
                        type="text" 
                        value={s.multiplier}
                        onChange={(e) => {
                          const updated = [...mattressConfig.sizes];
                          updated[idx].multiplier = parseFloat(e.target.value) || 1.0;
                          setMattressConfig({ ...mattressConfig, sizes: updated });
                        }}
                        className="bg-bg-light border border-border rounded p-1.5 focus:outline-none font-bold text-primary text-center"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Thicknesses Multipliers */}
              <div className="border border-border p-4 bg-bg-light/30 rounded-sm mb-6">
                <h4 className="font-bold text-xs text-primary mb-3">Thickness Depth Multipliers</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {mattressConfig.thicknesses.map((t, idx) => (
                    <div key={idx} className="flex flex-col bg-white p-3 border border-border rounded">
                      <span className="font-bold text-text-muted mb-1 block">{t.name}</span>
                      <input 
                        type="text" 
                        value={t.multiplier}
                        onChange={(e) => {
                          const updated = [...mattressConfig.thicknesses];
                          updated[idx].multiplier = parseFloat(e.target.value) || 1.0;
                          setMattressConfig({ ...mattressConfig, thicknesses: updated });
                        }}
                        className="bg-bg-light border border-border rounded p-1.5 focus:outline-none font-bold text-primary text-center"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Cores Prices */}
              <div className="border border-border p-4 bg-bg-light/30 rounded-sm mb-6">
                <h4 className="font-bold text-xs text-primary mb-3">Mattress Core Base Pricing</h4>
                <div className="space-y-4">
                  {mattressConfig.cores.map((c, idx) => (
                    <div key={idx} className="bg-white p-4 border border-border rounded grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div>
                        <span className="block font-bold text-sm text-primary leading-tight">{c.name}</span>
                        <span className="block text-[10px] text-text-muted mt-1 italic">{c.type} core configuration</span>
                      </div>
                      <div className="flex flex-col">
                        <label className="font-bold text-text-muted mb-1">Base Price (₹)</label>
                        <input 
                          type="number" 
                          value={c.basePrice}
                          onChange={(e) => {
                            const updated = [...mattressConfig.cores];
                            updated[idx].basePrice = parseInt(e.target.value) || 0;
                            setMattressConfig({ ...mattressConfig, cores: updated });
                          }}
                          className="bg-bg-light border border-border rounded p-1.5 focus:outline-none font-bold text-primary"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="font-bold text-text-muted mb-1">Retail Showroom Multiplier</label>
                        <input 
                          type="text" 
                          value={c.retailMultiplier}
                          onChange={(e) => {
                            const updated = [...mattressConfig.cores];
                            updated[idx].retailMultiplier = parseFloat(e.target.value) || 2.0;
                            setMattressConfig({ ...mattressConfig, cores: updated });
                          }}
                          className="bg-bg-light border border-border rounded p-1.5 focus:outline-none font-bold text-primary"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end border-t border-border pt-4">
                <button
                  onClick={() => handleSaveMattressConfig(mattressConfig)}
                  disabled={submitLoading}
                  className="bg-primary hover:bg-primary-light text-white font-bold py-2.5 px-6 rounded-sm shadow-sm transition-colors disabled:opacity-50"
                >
                  {submitLoading ? 'Saving Configurations...' : 'Save Mattress Pricing Configurations'}
                </button>
              </div>

            </div>
          )}

          {/* 4. SOFA CONFIG MODULE */}
          {activeTab === 'sofa' && sofaConfig && (
            <div className="animate-fade-in text-xs">
              <h3 className="text-xl font-bold font-display text-primary mb-1">Sofa Multipliers & Parameters</h3>
              <p className="text-[11px] text-text-muted mb-6">Modify sofa layout multipliers, fabrics and color parameters</p>

              {/* Types Multipliers */}
              <div className="border border-border p-4 bg-bg-light/30 rounded-sm mb-6">
                <h4 className="font-bold text-xs text-primary mb-3">Sofa Type Multipliers</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {sofaConfig.sofaTypes.map((t, idx) => (
                    <div key={idx} className="flex flex-col bg-white p-3 border border-border rounded">
                      <span className="font-bold text-text-muted mb-1 block">{t.name}</span>
                      <input 
                        type="text" 
                        value={t.multiplier}
                        onChange={(e) => {
                          const updated = [...sofaConfig.sofaTypes];
                          updated[idx].multiplier = parseFloat(e.target.value) || 1.0;
                          setSofaConfig({ ...sofaConfig, sofaTypes: updated });
                        }}
                        className="bg-bg-light border border-border rounded p-1.5 focus:outline-none font-bold text-primary text-center"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Materials & Fabric Modifiers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="border border-border p-4 bg-bg-light/30 rounded-sm">
                  <h4 className="font-bold text-xs text-primary mb-3">Material Cost Modifiers (₹)</h4>
                  <div className="space-y-3">
                    {sofaConfig.materials.map((m, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-white p-2.5 border border-border rounded">
                        <span className="font-bold text-text-muted">{m.name}</span>
                        <input 
                          type="number" 
                          value={m.priceModifier}
                          onChange={(e) => {
                            const updated = [...sofaConfig.materials];
                            updated[idx].priceModifier = parseInt(e.target.value) || 0;
                            setSofaConfig({ ...sofaConfig, materials: updated });
                          }}
                          className="w-24 bg-bg-light border border-border rounded p-1 text-center font-bold text-primary"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-border p-4 bg-bg-light/30 rounded-sm">
                  <h4 className="font-bold text-xs text-primary mb-3">Fabric Cost Modifiers (₹)</h4>
                  <div className="space-y-3">
                    {sofaConfig.fabrics.map((f, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-white p-2.5 border border-border rounded">
                        <span className="font-bold text-text-muted">{f.name}</span>
                        <input 
                          type="number" 
                          value={f.priceModifier}
                          onChange={(e) => {
                            const updated = [...sofaConfig.fabrics];
                            updated[idx].priceModifier = parseInt(e.target.value) || 0;
                            setSofaConfig({ ...sofaConfig, fabrics: updated });
                          }}
                          className="w-24 bg-bg-light border border-border rounded p-1 text-center font-bold text-primary"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end border-t border-border pt-4">
                <button
                  onClick={() => handleSaveSofaConfig(sofaConfig)}
                  disabled={submitLoading}
                  className="bg-primary hover:bg-primary-light text-white font-bold py-2.5 px-6 rounded-sm shadow-sm transition-colors disabled:opacity-50"
                >
                  {submitLoading ? 'Saving Configurations...' : 'Save Sofa Pricing Configurations'}
                </button>
              </div>

            </div>
          )}

          {/* 5. TESTIMONIALS MODULE */}
          {activeTab === 'testimonials' && (
            <div className="animate-fade-in text-xs">
              <h3 className="text-xl font-bold font-display text-primary mb-1">Testimonial Reviews</h3>
              <p className="text-[11px] text-text-muted mb-6">Manage customer reviews showing in reviews sliders</p>

              {/* Review add form */}
              <div className="bg-bg-light/40 border border-border p-4 rounded-sm mb-6">
                <h4 className="font-bold text-xs text-primary mb-3 border-b border-border pb-1.5">
                  {editingTestimonial ? `Edit Testimonial: ${editingTestimonial.name}` : 'Create Customer Testimonial'}
                </h4>
                
                <form onSubmit={handleSaveTestimonial} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="flex flex-col">
                      <label className="font-bold text-primary mb-1">Customer Name</label>
                      <input 
                        type="text" 
                        value={testimonialForm.name}
                        onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                        required
                        placeholder="Rajesh Kumar"
                        className="bg-white border border-border rounded-sm p-1.5 focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="font-bold text-primary mb-1">Location (e.g. "Mumbai")</label>
                      <input 
                        type="text" 
                        value={testimonialForm.location}
                        onChange={(e) => setTestimonialForm({ ...testimonialForm, location: e.target.value })}
                        required
                        placeholder="Mumbai"
                        className="bg-white border border-border rounded-sm p-1.5 focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="font-bold text-primary mb-1">Rating Stars (1-5)</label>
                      <select 
                        value={testimonialForm.rating}
                        onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: parseInt(e.target.value) })}
                        className="bg-white border border-border rounded-sm p-1.5 focus:outline-none cursor-pointer"
                      >
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                      </select>
                    </div>
                    <div className="flex flex-col">
                      <label className="font-bold text-primary mb-1">Date Text (e.g. "2 weeks ago")</label>
                      <input 
                        type="text" 
                        value={testimonialForm.dateText}
                        onChange={(e) => setTestimonialForm({ ...testimonialForm, dateText: e.target.value })}
                        required
                        placeholder="2 weeks ago"
                        className="bg-white border border-border rounded-sm p-1.5 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="font-bold text-primary mb-1">Review Content</label>
                    <textarea 
                      rows="2"
                      value={testimonialForm.text}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, text: e.target.value })}
                      required
                      placeholder="Enter the customer review narrative here..."
                      className="bg-white border border-border rounded-sm p-2 focus:outline-none resize-none"
                    ></textarea>
                  </div>

                  <div className="flex justify-end gap-2 border-t border-border/60 pt-3">
                    <button 
                      type="button" 
                      onClick={resetTestimonialForm}
                      className="border border-border py-1.5 px-4 rounded-sm hover:bg-bg-light transition-colors"
                    >
                      Reset Form
                    </button>
                    <button 
                      type="submit"
                      disabled={submitLoading}
                      className="bg-primary text-white font-bold py-1.5 px-5 rounded-sm hover:bg-primary-light transition-colors disabled:opacity-50"
                    >
                      {editingTestimonial ? 'Update Testimonial' : 'Save Testimonial'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Testimonials List */}
              <div className="space-y-3">
                {testimonials.map((t) => (
                  <div key={t._id} className="border border-border p-3 rounded bg-bg-light/20 flex justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-bold text-primary text-sm">{t.name}</span>
                        {t.location && (
                          <span className="text-[10.5px] text-text-muted font-medium bg-border/40 px-1.5 py-0.5 rounded">
                            {t.location}
                          </span>
                        )}
                        <span className="text-accent">{'★'.repeat(t.rating)}</span>
                        <span className="text-[10px] text-text-muted">({t.dateText})</span>
                      </div>
                      <p className="text-text-muted italic">"{t.text}"</p>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleEditTestimonialClick(t)}
                        className="text-primary hover:text-accent font-bold focus:outline-none"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteTestimonial(t._id)}
                        className="text-red-500 hover:text-red-700 font-bold focus:outline-none"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* 6. HOMEPAGE CONTENT MODULE */}
          {activeTab === 'homepage' && (
            <div className="animate-fade-in text-xs">
              <h3 className="text-xl font-bold font-display text-primary mb-1">Homepage Content Manager</h3>
              <p className="text-[11px] text-text-muted mb-6">Modify main headlines, subheadings and call-to-actions dynamic copy</p>

              <form onSubmit={handleSaveHomepage} className="space-y-4">
                
                <div className="flex flex-col">
                  <label className="font-bold text-primary mb-1">Hero Subheading</label>
                  <input 
                    type="text" 
                    value={homepageForm.heroSubheading}
                    onChange={(e) => setHomepageForm({ ...homepageForm, heroSubheading: e.target.value })}
                    required
                    placeholder="Direct Manufacturer Advantage"
                    className="bg-bg-light border border-border rounded-sm py-2 px-3 focus:outline-none text-primary"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="font-bold text-primary mb-1">Hero Heading Title</label>
                  <input 
                    type="text" 
                    value={homepageForm.heroTitle}
                    onChange={(e) => setHomepageForm({ ...homepageForm, heroTitle: e.target.value })}
                    required
                    placeholder="Deep Sleep. Direct From The Factory."
                    className="bg-bg-light border border-border rounded-sm py-2 px-3 focus:outline-none text-primary font-bold"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="font-bold text-primary mb-1">Hero Subtitle Paragraph</label>
                  <textarea 
                    rows="3"
                    value={homepageForm.heroSubtitle}
                    onChange={(e) => setHomepageForm({ ...homepageForm, heroSubtitle: e.target.value })}
                    required
                    placeholder="Why pay 2x at retail showrooms..."
                    className="bg-bg-light border border-border rounded-sm py-2 px-3 focus:outline-none text-primary resize-none leading-relaxed"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border pt-4">
                  <div className="flex flex-col">
                    <label className="font-bold text-primary mb-1">CTA Banner Title</label>
                    <input 
                      type="text" 
                      value={homepageForm.ctaTitle}
                      onChange={(e) => setHomepageForm({ ...homepageForm, ctaTitle: e.target.value })}
                      required
                      placeholder="Ready for Better Sleep?"
                      className="bg-bg-light border border-border rounded-sm py-2 px-3 focus:outline-none text-primary font-bold"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-bold text-primary mb-1">CTA Subtitle Description</label>
                    <input 
                      type="text" 
                      value={homepageForm.ctaSubtitle}
                      onChange={(e) => setHomepageForm({ ...homepageForm, ctaSubtitle: e.target.value })}
                      required
                      placeholder="Talk directly with the factory owner on WhatsApp..."
                      className="bg-bg-light border border-border rounded-sm py-2 px-3 focus:outline-none text-primary"
                    />
                  </div>
                </div>

                <div className="flex justify-end border-t border-border pt-4">
                  <button 
                    type="submit"
                    disabled={submitLoading}
                    className="bg-primary hover:bg-primary-light text-white font-bold py-2.5 px-6 rounded-sm shadow-sm transition-colors disabled:opacity-50"
                  >
                    {submitLoading ? 'Saving copy...' : 'Save Homepage Copy Headlines'}
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* 7. PROFILE SAFETY MODULE */}
          {activeTab === 'profile' && (
            <div className="animate-fade-in text-xs max-w-md">
              <h3 className="text-xl font-bold font-display text-primary mb-1">Profile Security</h3>
              <p className="text-[11px] text-text-muted mb-6">Modify login email and session security password credentials</p>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                
                <div className="flex flex-col">
                  <label className="font-bold text-primary mb-1">Admin Email Address</label>
                  <input 
                    type="email" 
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    required
                    placeholder="admin@example.com"
                    className="bg-bg-light border border-border rounded-sm py-2.5 px-3.5 focus:outline-none text-primary font-medium"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="font-bold text-primary mb-1">New Security Password</label>
                  <input 
                    type="password" 
                    value={profileForm.password}
                    onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })}
                    required
                    placeholder="••••••••••••"
                    className="bg-bg-light border border-border rounded-sm py-2.5 px-3.5 focus:outline-none text-primary"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="font-bold text-primary mb-1">Confirm New Password</label>
                  <input 
                    type="password" 
                    value={profileForm.confirmPassword}
                    onChange={(e) => setProfileForm({ ...profileForm, confirmPassword: e.target.value })}
                    required
                    placeholder="••••••••••••"
                    className="bg-bg-light border border-border rounded-sm py-2.5 px-3.5 focus:outline-none text-primary"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={submitLoading}
                  className="bg-primary hover:bg-primary-light text-white font-bold py-2.5 px-6 rounded-sm tracking-wide transition-colors duration-200 mt-2 shadow-sm disabled:opacity-50 focus:outline-none"
                >
                  {submitLoading ? 'Updating credentials...' : 'Update Login Credentials'}
                </button>

              </form>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
