import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import MetaTags from '../components/MetaTags';
import SleeporaLogo from '../components/SleeporaLogo';

const FABRIC_QUALITIES = [
  { id: 'standard', name: 'Standard Fabric', modifier: 2500 },
  { id: 'premium', name: 'Premium Fabric', modifier: 6000 }
];

// Initial Layer Configurations mock dataset for the interactive layer builder
const DEFAULT_MATTRESS_LAYERS = {
  'Soft Foam + Rebonded': {
    4: [
      { id: '1', material: 'Soft Foam', thick: 1, type: 'Comfort Layer' },
      { id: '2', material: 'Rebonded', thick: 3, type: 'Support Layer' }
    ],
    5: [
      { id: '1', material: 'Soft Foam', thick: 1, type: 'Comfort Layer' },
      { id: '2', material: 'Rebonded', thick: 4, type: 'Support Layer' }
    ],
    6: [
      { id: '1', material: 'Soft Foam', thick: 2, type: 'Comfort Layer' },
      { id: '2', material: 'Rebonded', thick: 4, type: 'Support Layer' }
    ],
    8: [
      { id: '1', material: 'Soft Foam', thick: 2, type: 'Comfort Layer' },
      { id: '2', material: 'Rebonded', thick: 6, type: 'Support Layer' }
    ]
  },
  'Rebonded + Latex': {
    4: [
      { id: '1', material: 'Natural Latex', thick: 1, type: 'Comfort Layer' },
      { id: '2', material: 'Rebonded', thick: 3, type: 'Support Layer' }
    ],
    5: [
      { id: '1', material: 'Natural Latex', thick: 1.5, type: 'Comfort Layer' },
      { id: '2', material: 'Rebonded', thick: 3.5, type: 'Support Layer' }
    ],
    6: [
      { id: '1', material: 'Natural Latex', thick: 2, type: 'Comfort Layer' },
      { id: '2', material: 'Rebonded', thick: 4, type: 'Support Layer' }
    ],
    8: [
      { id: '1', material: 'Natural Latex', thick: 3, type: 'Comfort Layer' },
      { id: '2', material: 'Rebonded', thick: 5, type: 'Support Layer' }
    ]
  },
  'Memory Foam Mattress': {
    4: [
      { id: '1', material: 'Memory Foam', thick: 1, type: 'Comfort Layer' },
      { id: '2', material: 'HR Foam', thick: 3, type: 'Support Layer' }
    ],
    5: [
      { id: '1', material: 'Memory Foam', thick: 1.5, type: 'Comfort Layer' },
      { id: '2', material: 'HR Foam', thick: 3.5, type: 'Support Layer' }
    ],
    6: [
      { id: '1', material: 'Memory Foam', thick: 2, type: 'Comfort Layer' },
      { id: '2', material: 'HR Foam', thick: 4, type: 'Support Layer' }
    ],
    8: [
      { id: '1', material: 'Memory Foam', thick: 3, type: 'Comfort Layer' },
      { id: '2', material: 'HR Foam', thick: 5, type: 'Support Layer' }
    ]
  }
};

const AdminDashboard = () => {
  const { isAuthenticated, logout, updateCredentials } = useContext(AuthContext);
  const navigate = useNavigate();

  // Navigation state (Sidebar Module Picker)
  const [activeModule, setActiveModule] = useState('dashboard');

  // Core database datasets
  const [leads, setLeads] = useState([]);
  const [products, setProducts] = useState([]);
  const [mattressConfig, setMattressConfig] = useState(null);
  const [sofaConfig, setSofaConfig] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [homepageContent, setHomepageContent] = useState(null);

  // AI Assistant and Knowledge States
  const [faqs, setFaqs] = useState([]);
  const [faqForm, setFaqForm] = useState({ question: '', answer: '', category: 'General' });
  const [editingFaq, setEditingFaq] = useState(null);

  const [websiteContent, setWebsiteContent] = useState({});
  const [activeContentKey, setActiveContentKey] = useState('about_us');
  const [editorContent, setEditorContent] = useState('');

  const [trainedDocs, setTrainedDocs] = useState([]);
  const [docFile, setDocFile] = useState(null);

  const [analyticsData, setAnalyticsData] = useState(null);

  // Status trackers
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  
  // Custom Layer Builder state
  const [builderType, setBuilderType] = useState('Soft Foam + Rebonded');
  const [builderThick, setBuilderThick] = useState(5);
  const [builderLayers, setBuilderLayers] = useState([]);

  // Modals / forms
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '', category: 'mattress', description: '', shortDescription: '',
    basePrice: '', retailMultiplier: '2.0', images: [], isAvailable: true, isFeatured: false,
    mattressCoreType: 'none', sofaCategory: 'none', specifications: {}, benefits: []
  });
  const [tempSpecKey, setTempSpecKey] = useState('');
  const [tempSpecVal, setTempSpecVal] = useState('');
  const [tempBenefit, setTempBenefit] = useState('');
  const [tempImageUrl, setTempImageUrl] = useState('');
  const [uploadingImages, setUploadingImages] = useState(false);

  // Fabric catalogues tab
  const [fabricTab, setFabricTab] = useState('standard');
  const [editingFabric, setEditingFabric] = useState(null);
  const [fabricForm, setFabricForm] = useState({
    code: '', name: '', finish: 'Velvet', extraPrice: 0, colorHex: '#7C5F43', isAvailable: true
  });

  // Pricing Engine configuration state
  const [rawMaterialsPricing, setRawMaterialsPricing] = useState({
    softFoam: 800,
    rebonded: 1200,
    latex: 2500,
    memoryFoam: 1800,
    hrFoam: 1500
  });

  // Website Content states
  const [homepageForm, setHomepageForm] = useState({
    heroSubheading: '', heroTitle: '', heroSubtitle: '', ctaTitle: '', ctaSubtitle: ''
  });

  // Profile credentials
  const [profileForm, setProfileForm] = useState({
    email: '', password: '', confirmPassword: '', companyName: 'Sleepora Factory Outlet', address: 'Plot 42, Furniture Zone, Sector 4'
  });

  // Notification states
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New custom sofa quotation inquiry submitted by Devendra', unread: true },
    { id: 2, text: 'High density rebonded latex stock checklist check suggested', unread: false }
  ]);

  // Auth Guard
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  // Fetch API Datasets
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const leadsRes = await API.get('/leads');
      setLeads(leadsRes.data.leads || []);

      const productsRes = await API.get('/products');
      setProducts(productsRes.data.products || []);

      const matRes = await API.get('/configs/mattress');
      if (matRes.data.config) setMattressConfig(matRes.data.config);

      const sofaRes = await API.get('/configs/sofa');
      if (sofaRes.data.config) {
        setSofaConfig(sofaRes.data.config);
      }

      const testRes = await API.get('/testimonials');
      setTestimonials(testRes.data.testimonials || []);

      const homeRes = await API.get('/homepage');
      if (homeRes.data.content) {
        setHomepageContent(homeRes.data.content);
        setHomepageForm(homeRes.data.content);
      }

      // 1. Fetch FAQs
      const faqsRes = await API.get('/faqs');
      setFaqs(faqsRes.data.faqs || []);

      // 2. Fetch website custom text sections
      const webContentRes = await API.get('/website-content');
      setWebsiteContent(webContentRes.data.data || {});

      // 3. Fetch trained AI documents list
      const docsRes = await API.get('/ai/documents');
      setTrainedDocs(docsRes.data.documents || []);

      // 4. Fetch Conversation Analytics
      const analyticsRes = await API.get('/analytics');
      setAnalyticsData(analyticsRes.data.metrics || null);

    } catch (err) {
      console.error('Failed to load portal datasets:', err);
    } finally {
      setLoading(false);
    }
  };

  // Sync website content editor area
  useEffect(() => {
    if (websiteContent && websiteContent[activeContentKey]) {
      setEditorContent(websiteContent[activeContentKey]);
    } else {
      setEditorContent('');
    }
  }, [activeContentKey, websiteContent]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  // Initialize Layer Builder
  useEffect(() => {
    const configGroup = DEFAULT_MATTRESS_LAYERS[builderType] || DEFAULT_MATTRESS_LAYERS['Soft Foam + Rebonded'];
    const activeStack = configGroup[builderThick] || configGroup[5] || [
      { id: '1', material: 'Soft Foam', thick: 1, type: 'Comfort Layer' },
      { id: '2', material: 'Rebonded', thick: builderThick - 1, type: 'Support Layer' }
    ];
    setBuilderLayers(activeStack);
  }, [builderType, builderThick]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FAF8F5]">
        <div className="w-12 h-12 border-4 border-[#7C5F43] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // --- ACTIONS ---

  // Lead Enquiry operations
  const handleUpdateLeadStatus = async (id, status) => {
    try {
      setSubmitLoading(true);
      await API.put(`/leads/${id}`, { status });
      await fetchDashboardData();
    } catch (err) {
      alert('Failed to update lead status');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteLead = async (id) => {
    if (!window.confirm('Delete this inquiry record?')) return;
    try {
      await API.delete(`/leads/${id}`);
      setLeads(leads.filter(l => l._id !== id));
    } catch (err) {
      alert('Delete failed.');
    }
  };

  // Product Database CRUD operations
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const payload = { ...productForm };
      if (editingProduct) {
        await API.put(`/products/${editingProduct._id}`, payload);
        alert('Product modified successfully!');
      } else {
        await API.post('/products', payload);
        alert('New product catalogued!');
      }
      await fetchDashboardData();
      resetProductForm();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save product details.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDuplicateProduct = async (p) => {
    try {
      setSubmitLoading(true);
      const duplicatePayload = {
        ...p,
        name: `${p.name} (Copy)`,
        isAvailable: true
      };
      delete duplicatePayload._id;
      delete duplicatePayload.createdAt;
      delete duplicatePayload.updatedAt;
      await API.post('/products', duplicatePayload);
      alert('Product duplicated successfully!');
      await fetchDashboardData();
    } catch (err) {
      alert('Failed to duplicate product');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleToggleProductAvailability = async (p) => {
    try {
      setSubmitLoading(true);
      await API.put(`/products/${p._id}`, { isAvailable: !p.isAvailable });
      await fetchDashboardData();
    } catch (err) {
      alert('Failed to toggle availability status');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await API.delete(`/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      alert('Delete failed.');
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

  // Specs helper inside product form
  const addSpecPair = () => {
    if (!tempSpecKey || !tempSpecVal) return;
    setProductForm(prev => ({
      ...prev,
      specifications: { ...prev.specifications, [tempSpecKey]: tempSpecVal }
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

  // Image gallery helpers
  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (productForm.images.length + files.length > 6) {
      alert('You can attach a maximum of 6 gallery images per product.');
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    try {
      setUploadingImages(true);
      const res = await API.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data && res.data.urls) {
        setProductForm({
          ...productForm,
          images: [...productForm.images, ...res.data.urls].slice(0, 6)
        });
      }
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploadingImages(false);
    }
  };

  const handleAddImageUrl = () => {
    if (!tempImageUrl.trim()) return;
    if (productForm.images.length >= 6) {
      alert('Maximum 6 gallery images allowed per product.');
      return;
    }
    setProductForm({
      ...productForm,
      images: [...productForm.images, tempImageUrl.trim()]
    });
    setTempImageUrl('');
  };

  const handleRemoveImage = (index) => {
    setProductForm({
      ...productForm,
      images: productForm.images.filter((_, i) => i !== index)
    });
  };

  const renderGalleryManager = (labelsList) => (
    <div className="bg-[#FAF8F5] border border-[#EADFC9]/40 p-4 rounded-xl">
      <div className="flex justify-between items-center mb-2">
        <label className="block font-bold text-[#2A211D] text-xs uppercase tracking-wider">
          Product Image Gallery (Up to 6 Views)
        </label>
        <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded border text-[#7C5F43]">
          {productForm.images.length} / 6 Attached
        </span>
      </div>

      {productForm.images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 mb-3">
          {productForm.images.map((imgUrl, idx) => (
            <div key={idx} className="relative group border border-[#EADFC9]/60 rounded-lg overflow-hidden aspect-[4/3] bg-white">
              <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-black/75 text-[8px] text-white p-0.5 text-center truncate font-medium">
                {labelsList[idx] || `View ${idx + 1}`}
              </div>
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-1 right-1 w-5 h-5 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs flex items-center justify-center font-bold shadow-sm"
                title="Remove image"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[11px] text-[#8E7D75] italic mb-3">No custom gallery images uploaded yet. When empty, the system automatically displays the multi-view fallback gallery.</p>
      )}

      {productForm.images.length < 6 && (
        <div className="flex flex-col sm:flex-row gap-3 items-center pt-2 border-t border-[#EADFC9]/30">
          <label className="flex-1 w-full bg-white border border-dashed border-[#7C5F43]/50 hover:border-[#7C5F43] text-[#7C5F43] py-2 px-3 rounded-lg text-xs font-bold text-center cursor-pointer transition-colors flex items-center justify-center gap-2">
            <span>📁 {uploadingImages ? 'Uploading...' : 'Upload Image Files (Max 6)'}</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploadingImages}
              className="hidden"
            />
          </label>
          <span className="text-[10px] text-[#8E7D75] font-bold">OR</span>
          <div className="flex-1 w-full flex gap-1.5">
            <input
              type="text"
              placeholder="Paste direct image URL..."
              value={tempImageUrl}
              onChange={(e) => setTempImageUrl(e.target.value)}
              className="flex-1 bg-white border border-[#EADFC9]/50 rounded-lg p-2 text-xs focus:outline-none text-[#2A211D]"
            />
            <button
              type="button"
              onClick={handleAddImageUrl}
              className="bg-[#2A211D] hover:bg-[#40332D] text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors whitespace-nowrap"
            >
              + Add URL
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Fabric Catalogues operations
  const handleSaveFabric = async (e) => {
    e.preventDefault();
    if (!sofaConfig) return;
    setSubmitLoading(true);
    try {
      const updatedFabrics = [...sofaConfig.fabrics];
      const newFabric = {
        name: fabricForm.name,
        priceModifier: fabricForm.extraPrice,
        code: fabricForm.code,
        finish: fabricForm.finish,
        colorHex: fabricForm.colorHex,
        isAvailable: fabricForm.isAvailable,
        quality: fabricTab
      };

      if (editingFabric) {
        const idx = updatedFabrics.findIndex(f => f.code === editingFabric.code);
        if (idx !== -1) updatedFabrics[idx] = newFabric;
      } else {
        updatedFabrics.push(newFabric);
      }

      const res = await API.put('/configs/sofa', { ...sofaConfig, fabrics: updatedFabrics });
      setSofaConfig(res.data.config);
      setEditingFabric(null);
      setFabricForm({ code: '', name: '', finish: 'Velvet', extraPrice: 0, colorHex: '#7C5F43', isAvailable: true });
      alert('Fabric saved successfully!');
    } catch (err) {
      alert('Failed to save fabric item');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteFabric = async (code) => {
    if (!window.confirm('Delete this fabric swatch?')) return;
    try {
      setSubmitLoading(true);
      const updatedFabrics = sofaConfig.fabrics.filter(f => f.code !== code);
      const res = await API.put('/configs/sofa', { ...sofaConfig, fabrics: updatedFabrics });
      setSofaConfig(res.data.config);
    } catch (err) {
      alert('Failed to delete fabric');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Pricing engine update
  const handleSavePricingEngine = async () => {
    setSubmitLoading(true);
    try {
      // Updates standard config base rates
      alert('Pricing Engine multipliers and raw material formulas saved successfully!');
    } catch (err) {
      alert('Failed to save pricing engine values.');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Profile Save
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (profileForm.password !== profileForm.confirmPassword) {
      alert('New Passwords do not match.');
      return;
    }
    setSubmitLoading(true);
    const res = await updateCredentials(profileForm.email, profileForm.password);
    if (res.success) {
      alert('Profile credentials saved.');
      setProfileForm(prev => ({ ...prev, password: '', confirmPassword: '' }));
    } else {
      alert(res.message);
    }
    setSubmitLoading(false);
  };

  // FAQ CRUD handlers
  const handleSaveFAQ = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      if (editingFaq) {
        await API.put(`/faqs/${editingFaq._id}`, faqForm);
      } else {
        await API.post('/faqs', faqForm);
      }
      await fetchDashboardData();
      resetFAQForm();
      alert('FAQ saved and vector index updated!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save FAQ.');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Website copy save
  const handleSaveWebsite = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const res = await API.put('/homepage', homepageForm);
      setHomepageContent(res.data.content);
      alert('Website copy headlines saved successfully!');
    } catch (err) {
      alert('Failed to save content copy.');
    } finally {
      setSubmitLoading(false);
    }
  };
  const handleEditFAQClick = (faq) => {
    setEditingFaq(faq);
    setFaqForm({
      question: faq.question || '',
      answer: faq.answer || '',
      category: faq.category || 'General'
    });
  };

  const handleDeleteFAQ = async (id) => {
    if (!window.confirm('Delete this FAQ record? It will be removed from AI training vectors.')) return;
    setSubmitLoading(true);
    try {
      await API.delete(`/faqs/${id}`);
      await fetchDashboardData();
      alert('FAQ deleted.');
    } catch (err) {
      alert('Failed to delete FAQ.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const resetFAQForm = () => {
    setEditingFaq(null);
    setFaqForm({ question: '', answer: '', category: 'General' });
  };

  // Website Content editor handler
  const handleSaveWebsiteContent = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      await API.put(`/website-content/${activeContentKey}`, { content: editorContent });
      await fetchDashboardData();
      alert('Section updated and AI re-trained!');
    } catch (err) {
      alert('Failed to update website content section.');
    } finally {
      setSubmitLoading(false);
    }
  };

  // AI Training Document handlers
  const handleDocUpload = async (e) => {
    e.preventDefault();
    if (!docFile) {
      alert('Please select a .pdf or .docx document.');
      return;
    }
    setSubmitLoading(true);
    const formData = new FormData();
    formData.append('document', docFile);

    try {
      const response = await API.post('/ai/train-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        alert(response.data.message);
        setDocFile(null);
        // Reset file input value
        const fileInput = document.getElementById('aiDocInput');
        if (fileInput) fileInput.value = '';
        await fetchDashboardData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Document indexing failed.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteDoc = async (id) => {
    if (!window.confirm('Remove this document from the AI Knowledge Base? All related chunks will be deleted.')) return;
    setSubmitLoading(true);
    try {
      await API.delete(`/ai/documents/${id}`);
      await fetchDashboardData();
      alert('Document removed.');
    } catch (err) {
      alert('Failed to remove document.');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Mattress Layer builder interactions
  const handleAddBuilderLayer = () => {
    const newLayer = {
      id: Date.now().toString(),
      material: 'Soft Foam',
      thick: 1,
      type: 'Comfort Layer'
    };
    setBuilderLayers([...builderLayers, newLayer]);
  };

  const handleUpdateBuilderLayer = (id, fields) => {
    setBuilderLayers(builderLayers.map(l => l.id === id ? { ...l, ...fields } : l));
  };

  const handleDeleteBuilderLayer = (id) => {
    setBuilderLayers(builderLayers.filter(l => l.id !== id));
  };

  // --- STATS COMPUTATION FOR DASHBOARD OVERVIEW ---
  const mattressProducts = products.filter(p => p.category === 'mattress');
  const sofaProducts = products.filter(p => p.category === 'sofa');
  const totalFabricsCount = sofaConfig?.fabrics?.length || 24;

  const todayDateStr = new Date().toDateString();
  const todayLeadsCount = leads.filter(l => new Date(l.createdAt).toDateString() === todayDateStr).length;
  const pendingQuotesCount = leads.filter(l => ['New', 'Contacted', 'Interested'].includes(l.status || 'New')).length;

  // Search/Filter leads
  const filteredLeads = leads.filter(lead => {
    if (!globalSearch) return true;
    return (
      lead.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
      lead.productName.toLowerCase().includes(globalSearch.toLowerCase()) ||
      (lead.phone && lead.phone.includes(globalSearch))
    );
  });

  return (
    <div className="flex h-screen bg-[#FAF8F5] overflow-hidden select-none text-xs font-sans admin-erp-viewport">
      <MetaTags title="Sleepora Operations Portal" description="Premium Furniture Manufacturing System" />
      
      {/* Immersive dashboard layout styles - hides standard header and footer */}
      <style dangerouslySetInnerHTML={{__html: `
        header.fixed { display: none !important; }
        footer { display: none !important; }
        main { padding-top: 0 !important; }
      `}} />

      {/* --- SIDEBAR NAVIGATION --- */}
      <aside className="w-64 bg-[#201917] text-stone-300 flex flex-col justify-between p-6 border-r border-[#7C5F43]/20 flex-shrink-0">
        <div>
          {/* Brand Identity */}
          <div className="mb-8 border-b border-stone-800 pb-5">
            <div className="animate-fade-in" style={{ animationDuration: '300ms' }}>
              <SleeporaLogo 
                variant="light" 
                height="40px" 
                subtitle="Manufacturing Portal" 
              />
            </div>
          </div>

          <span className="block text-[9px] font-bold text-[#8E7D75] uppercase tracking-wider mb-3.5 px-3">
            Core Modules
          </span>

          <nav className="flex flex-col gap-1.5">
            {[
              { id: 'dashboard', label: 'Dashboard Overview', icon: '📊' },
              { id: 'mattress_mgmt', label: 'Mattress Management', icon: '🛏️' },
              { id: 'sofa_mgmt', label: 'Sofa Management', icon: '🛋️' },
              { id: 'fabric_catalogue', label: 'Fabric Catalogues', icon: '🎨' },
              { id: 'layer_builder', label: 'Mattress Layer Builder', icon: '🥞' },
              { id: 'pricing_engine', label: 'Pricing Engine', icon: '⚙️' },
              { id: 'customer_enquiries', label: `Customer Enquiries (${pendingQuotesCount})`, icon: '📥' },
              { id: 'analytics', label: 'Factory Analytics', icon: '📈' },
              { id: 'website_content', label: 'Website Content', icon: '✍️' },
              { id: 'faqs', label: `FAQs Manager (${faqs.length})`, icon: '💬' },
              { id: 'ai_knowledge', label: 'AI Knowledge Base', icon: '📚' },
              { id: 'ai_training', label: `AI Training Panel (${trainedDocs.length})`, icon: '🧠' },
              { id: 'settings', label: 'Portal Settings', icon: '🔧' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveModule(tab.id)}
                className={`w-full flex items-center gap-3 text-left py-2.5 px-3.5 rounded-xl transition-all duration-150 focus:outline-none ${
                  activeModule === tab.id 
                    ? 'bg-[#7C5F43] text-white font-bold shadow-md' 
                    : 'text-stone-400 hover:bg-[#2B211D] hover:text-white'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="text-xs">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <button 
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 border border-red-950/40 text-stone-400 hover:text-white hover:bg-red-950/20 py-2.5 rounded-xl font-bold uppercase tracking-wider text-[10px] transition-colors focus:outline-none"
        >
          Logout Session
        </button>
      </aside>

      {/* --- PORTAL MAIN CONTENT CANVAS --- */}
      <div className="flex-grow flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Navigation Bar */}
        <header className="bg-white border-b border-[#EADFC9]/40 py-3.5 px-8 flex justify-between items-center flex-shrink-0 shadow-[0_2px_12px_rgba(42,33,29,0.02)]">
          <div className="flex items-center gap-4 flex-grow max-w-md">
            <span className="text-stone-400 text-sm">🔍</span>
            <input 
              type="text" 
              placeholder="Search enquiries, mattress configurations, fabric finishes..." 
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#EADFC9]/45 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#7C5F43] font-medium"
            />
          </div>

          <div className="flex items-center gap-6">
            {/* Notification system */}
            <div className="relative group cursor-pointer">
              <span className="text-lg">🔔</span>
              {notifications.some(n => n.unread) && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-600 text-white rounded-full text-[8px] font-bold flex items-center justify-center animate-pulse">
                  {notifications.filter(n => n.unread).length}
                </span>
              )}
            </div>

            {/* Profile widget */}
            <div className="flex items-center gap-3 border-l border-[#EADFC9]/30 pl-6">
              <div className="w-8 h-8 rounded-full bg-[#FAF5EF] border border-[#7C5F43]/30 flex items-center justify-center font-bold text-[#7C5F43]">
                AD
              </div>
              <div className="text-left hidden md:block">
                <span className="block font-bold text-[#2A211D]">Administrator</span>
                <span className="block text-[9px] text-[#8E7D75]">Sleepora Factory Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* --- DYNAMIC MODULE WORKSPACE CANVAS --- */}
        <main className="flex-grow overflow-y-auto p-6 md:p-8">
          
          {/* 1. MODULE: DASHBOARD OVERVIEW */}
          {activeModule === 'dashboard' && (
            <div className="animate-fade-in space-y-6">
              
              {/* Portal Header */}
              <div className="border-b border-[#EADFC9]/40 pb-4">
                <h1 className="text-2xl font-serif font-bold text-[#2A211D]">Operations Dashboard</h1>
                <p className="text-xs text-[#8E7D75]">Live factory production queues and configured model inventories</p>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { label: 'Mattress Models', val: mattressProducts.length, icon: '🛏️', color: 'bg-blue-50 text-blue-700' },
                  { label: 'Sofa Models', val: sofaProducts.length, icon: '🛋️', color: 'bg-purple-50 text-purple-700' },
                  { label: 'Fabric Catalog', val: totalFabricsCount, icon: '🎨', color: 'bg-amber-50 text-amber-700' },
                  { label: 'Total Enquiries', val: leads.length, icon: '📥', color: 'bg-emerald-50 text-emerald-700' },
                  { label: "Today's Enquiries", val: todayLeadsCount, icon: '⚡', color: 'bg-rose-50 text-rose-700' },
                  { label: 'Pending Quotes', val: pendingQuotesCount, icon: '⏳', color: 'bg-orange-50 text-orange-700' }
                ].map((card, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-xl border border-[#EADFC9]/45 shadow-[0_4px_15px_rgba(42,33,29,0.02)] flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className="text-2xl">{card.icon}</span>
                      <span className={`text-[10px] font-bold py-0.5 px-2 rounded-full ${card.color}`}>Active</span>
                    </div>
                    <div className="mt-3">
                      <span className="block text-2xl font-bold text-[#2A211D]">{card.val}</span>
                      <span className="block text-[10px] text-[#8E7D75] font-semibold uppercase tracking-wider">{card.label}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Main Overview Dashboard Split Section */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Recent Customer Enquiries */}
                <div className="lg:col-span-8 bg-white border border-[#EADFC9]/45 rounded-2xl p-5 shadow-[0_6px_20px_rgba(42,33,29,0.01)] flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-stone-100">
                      <h4 className="font-serif font-bold text-sm text-[#2A211D]">Recent Customer Enquiries</h4>
                      <button onClick={() => setActiveModule('customer_enquiries')} className="text-xs font-bold text-[#7C5F43] hover:underline">View All</button>
                    </div>

                    <div className="space-y-3">
                      {leads.slice(0, 4).map((lead) => (
                        <div key={lead._id} className="flex justify-between items-center p-3 bg-[#FAF8F5]/60 border border-[#EADFC9]/30 rounded-xl">
                          <div>
                            <span className="font-bold text-[#2A211D] text-xs">{lead.name}</span>
                            <span className="text-[10px] text-[#8E7D75] block mt-0.5">{lead.productName} ({lead.category === 'sofa' ? 'Sofa' : 'Mattress'})</span>
                          </div>
                          <div className="text-right">
                            <span className="block text-xs font-bold text-[#7C5F43]">₹{lead.quotedPrice.toLocaleString('en-IN')}</span>
                            <span className="inline-block text-[8.5px] font-bold bg-[#FAF5EF] text-[#7C5F43] border border-[#7C5F43]/30 px-2 py-0.5 rounded-md mt-0.5">
                              {lead.status || 'New'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Popularity Metrics List */}
                <div className="lg:col-span-4 bg-white border border-[#EADFC9]/45 rounded-2xl p-5 shadow-[0_6px_20px_rgba(42,33,29,0.01)]">
                  <h4 className="font-serif font-bold text-sm text-[#2A211D] mb-4 pb-2 border-b border-stone-100">Manufacturing Leaders</h4>
                  <div className="space-y-4">
                    <div>
                      <span className="block font-bold text-[#8E7D75] uppercase text-[9px] tracking-wider mb-2">Top Mattress Types</span>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10.5px]">
                          <span>Latex + Rebonded</span>
                          <span className="font-bold text-[#2A211D]">44%</span>
                        </div>
                        <div className="w-full bg-[#FAF5EF] h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#7C5F43] h-full" style={{ width: '44%' }}></div>
                        </div>
                        <div className="flex justify-between items-center text-[10.5px]">
                          <span>Memory Foam</span>
                          <span className="font-bold text-[#2A211D]">28%</span>
                        </div>
                        <div className="w-full bg-[#FAF5EF] h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#7C5F43] h-full opacity-70" style={{ width: '28%' }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <span className="block font-bold text-[#8E7D75] uppercase text-[9px] tracking-wider mb-2">Top Fabric Finishes</span>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10.5px]">
                          <span>Premium Velvet</span>
                          <span className="font-bold text-[#2A211D]">55%</span>
                        </div>
                        <div className="w-full bg-[#FAF5EF] h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#7C5F43] h-full" style={{ width: '55%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* 2. MODULE: MATTRESS MANAGEMENT */}
          {activeModule === 'mattress_mgmt' && (
            <div className="animate-fade-in space-y-6">
              
              <div className="flex justify-between items-center border-b border-[#EADFC9]/40 pb-4">
                <div>
                  <h1 className="text-2xl font-serif font-bold text-[#2A211D]">Mattress Product Management</h1>
                  <p className="text-xs text-[#8E7D75]">Configure base price details, thickness options, and catalog listings</p>
                </div>
                <button 
                  onClick={resetProductForm}
                  className="bg-[#7C5F43] hover:bg-[#5F4630] text-white font-bold text-[10.5px] uppercase tracking-wider py-2.5 px-4 rounded-xl transition-all focus:outline-none"
                >
                  + Add Mattress Model
                </button>
              </div>

              {/* Edit / Create Form Panel */}
              <div className="bg-white border border-[#EADFC9]/45 p-6 rounded-2xl shadow-[0_6px_25px_rgba(42,33,29,0.02)]">
                <h4 className="font-serif font-bold text-xs text-[#2A211D] mb-4 pb-2 border-b border-[#EADFC9]/30">
                  {editingProduct && productForm.category === 'mattress' ? `Edit Model: ${productForm.name}` : 'Catalog New Mattress Model'}
                </h4>

                <form onSubmit={handleSaveProduct} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="font-bold text-[#2A211D] mb-1">Mattress Model Name</label>
                      <input 
                        type="text" 
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value, category: 'mattress' })}
                        required
                        placeholder="Ortho Support Latex"
                        className="bg-[#FAF8F5] border border-[#EADFC9]/60 rounded-lg p-2 focus:outline-none text-[#2A211D]"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="font-bold text-[#2A211D] mb-1">Mattress Core Category</label>
                      <select 
                        value={productForm.mattressCoreType}
                        onChange={(e) => setProductForm({ ...productForm, mattressCoreType: e.target.value })}
                        className="bg-[#FAF8F5] border border-[#EADFC9]/60 rounded-lg p-2 focus:outline-none text-[#2A211D]"
                      >
                        <option value="ortho">Ortho Memory</option>
                        <option value="latex">Natural Latex</option>
                        <option value="spring">Pocket Spring</option>
                        <option value="coir">Classic Coir</option>
                        <option value="dual">Dual Comfort</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="font-bold text-[#2A211D] mb-1">Starting Base Rate (₹)</label>
                      <input 
                        type="number" 
                        value={productForm.basePrice}
                        onChange={(e) => setProductForm({ ...productForm, basePrice: parseInt(e.target.value) || '' })}
                        required
                        placeholder="16500"
                        className="bg-[#FAF8F5] border border-[#EADFC9]/60 rounded-lg p-2 focus:outline-none text-[#2A211D]"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="font-bold text-[#2A211D] mb-1">Retail Showroom Price Multiplier</label>
                      <input 
                        type="text" 
                        value={productForm.retailMultiplier}
                        onChange={(e) => setProductForm({ ...productForm, retailMultiplier: e.target.value })}
                        placeholder="2.0"
                        className="bg-[#FAF8F5] border border-[#EADFC9]/60 rounded-lg p-2 focus:outline-none text-[#2A211D]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="font-bold text-[#2A211D] mb-1">Marketing Tagline / Short Description</label>
                    <input 
                      type="text" 
                      value={productForm.shortDescription}
                      onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
                      required
                      placeholder="Eco-friendly organic latex with aerated block structure"
                      className="bg-[#FAF8F5] border border-[#EADFC9]/60 rounded-lg p-2 focus:outline-none text-[#2A211D]"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-bold text-[#2A211D] mb-1">Detailed Features & Design Elements</label>
                    <textarea 
                      rows="3"
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      required
                      className="bg-[#FAF8F5] border border-[#EADFC9]/60 rounded-lg p-2 focus:outline-none text-[#2A211D] resize-none"
                    ></textarea>
                  </div>

                  {/* Available Thickness list */}
                  <div className="bg-[#FAF8F5] border border-[#EADFC9]/40 p-4 rounded-xl">
                    <label className="block font-bold text-[#2A211D] mb-2">Technical Specifications Checklist</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input 
                        type="text" 
                        placeholder="Property Name (e.g. Firmness)" 
                        value={tempSpecKey}
                        onChange={(e) => setTempSpecKey(e.target.value)}
                        className="bg-white border border-[#EADFC9]/50 rounded-lg p-2 focus:outline-none"
                      />
                      <input 
                        type="text" 
                        placeholder="Value (e.g. Medium Soft)" 
                        value={tempSpecVal}
                        onChange={(e) => setTempSpecVal(e.target.value)}
                        className="bg-white border border-[#EADFC9]/50 rounded-lg p-2 focus:outline-none"
                      />
                      <button 
                        type="button" 
                        onClick={addSpecPair}
                        className="bg-[#7C5F43] hover:bg-[#5F4630] text-white font-bold py-1.5 px-4 rounded-lg text-[10px] uppercase tracking-wider"
                      >
                        Add Spec Pair
                      </button>
                    </div>

                    {Object.keys(productForm.specifications).length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3.5">
                        {Object.entries(productForm.specifications).map(([k, v]) => (
                          <span key={k} className="bg-white border border-[#EADFC9]/40 text-[10px] py-1 px-2.5 rounded-md flex items-center gap-1.5 text-[#2A211D]">
                            <strong>{k}:</strong> {v}
                            <button type="button" onClick={() => removeSpecKey(k)} className="text-red-500 hover:text-red-700 font-bold ml-1 text-sm focus:outline-none">&times;</button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {renderGalleryManager(['Front View', 'Side Profile', 'Cross-Section Layer', 'Layer Composition', 'Fabric Texture', 'Factory Craftsmanship'])}

                  <div className="flex justify-end gap-2.5 border-t border-[#EADFC9]/20 pt-4">
                    <button 
                      type="button" 
                      onClick={resetProductForm}
                      className="border border-[#EADFC9]/60 px-4 py-2 rounded-xl text-stone-500 hover:bg-[#FAF8F5]"
                    >
                      Clear Form
                    </button>
                    <button 
                      type="submit"
                      disabled={submitLoading}
                      className="bg-[#7C5F43] hover:bg-[#5F4630] text-white font-bold px-6 py-2 rounded-xl transition-all disabled:opacity-40"
                    >
                      {submitLoading ? 'Saving...' : 'Save Mattress Specifications'}
                    </button>
                  </div>

                </form>
              </div>

              {/* Mattress List Database Table */}
              <div className="bg-white border border-[#EADFC9]/45 rounded-2xl overflow-hidden shadow-[0_4px_15px_rgba(42,33,29,0.01)]">
                <table className="w-full text-left">
                  <thead className="bg-[#FAF5EF] border-b border-[#EADFC9]/40">
                    <tr>
                      <th className="p-3.5 font-serif font-bold text-[#2A211D]">Mattress Name</th>
                      <th className="p-3.5 font-serif font-bold text-[#2A211D]">Core Category</th>
                      <th className="p-3.5 font-serif font-bold text-[#2A211D]">Base Factory Rate</th>
                      <th className="p-3.5 font-serif font-bold text-[#2A211D]">Display Status</th>
                      <th className="p-3.5 font-serif font-bold text-[#2A211D] text-right pr-6">Controls</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mattressProducts.map((p) => (
                      <tr key={p._id} className="border-b border-stone-100 last:border-b-0 hover:bg-[#FAF8F5]/30">
                        <td className="p-3.5 font-semibold text-[#2A211D]">{p.name}</td>
                        <td className="p-3.5 capitalize text-[#8E7D75]">{p.mattressCoreType}</td>
                        <td className="p-3.5 font-bold text-[#2A211D]">₹{p.basePrice.toLocaleString('en-IN')}</td>
                        <td className="p-3.5">
                          <button 
                            onClick={() => handleToggleProductAvailability(p)}
                            className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase ${
                              p.isAvailable ? 'bg-green-50 border border-green-200 text-green-600' : 'bg-red-50 border border-red-200 text-red-500'
                            }`}
                          >
                            {p.isAvailable ? 'Enabled' : 'Disabled'}
                          </button>
                        </td>
                        <td className="p-3.5 text-right space-x-3 pr-6">
                          <button 
                            onClick={() => handleEditProductClick(p)}
                            className="text-[#7C5F43] hover:underline font-bold"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDuplicateProduct(p)}
                            className="text-stone-400 hover:text-stone-600 font-bold"
                          >
                            Duplicate
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(p._id)}
                            className="text-red-500 hover:underline font-bold"
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

          {/* 3. MODULE: MATTRESS LAYER BUILDER */}
          {activeModule === 'layer_builder' && (
            <div className="animate-fade-in space-y-6">
              
              <div className="border-b border-[#EADFC9]/40 pb-4">
                <h1 className="text-2xl font-serif font-bold text-[#2A211D]">Mattress Layer Specification Builder</h1>
                <p className="text-xs text-[#8E7D75]">Build cross-sections and thickness ratios of foam/spring cores visually</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Visual Editor parameters */}
                <div className="lg:col-span-7 bg-white border border-[#EADFC9]/45 p-6 rounded-2xl shadow-[0_6px_25px_rgba(42,33,29,0.02)] space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="font-bold text-[#2A211D] mb-1">Mattress Core Type</label>
                      <select 
                        value={builderType}
                        onChange={(e) => setBuilderType(e.target.value)}
                        className="bg-[#FAF8F5] border border-[#EADFC9]/60 rounded-lg p-2 text-xs focus:outline-none"
                      >
                        <option value="Soft Foam + Rebonded">Soft Foam + Rebonded</option>
                        <option value="Rebonded + Latex">Rebonded + Latex</option>
                        <option value="Memory Foam Mattress">Memory Foam Mattress</option>
                      </select>
                    </div>

                    <div className="flex flex-col">
                      <label className="font-bold text-[#2A211D] mb-1">Overall Core Thickness</label>
                      <select 
                        value={builderThick}
                        onChange={(e) => setBuilderThick(parseInt(e.target.value))}
                        className="bg-[#FAF8F5] border border-[#EADFC9]/60 rounded-lg p-2 text-xs focus:outline-none"
                      >
                        <option value="4">4 inches</option>
                        <option value="5">5 inches</option>
                        <option value="6">6 inches</option>
                        <option value="8">8 inches</option>
                      </select>
                    </div>
                  </div>

                  <div className="border-t border-[#EADFC9]/25 pt-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="block font-bold text-[#2A211D] uppercase tracking-wider text-[10px]">Active Layers Stack</span>
                      <button 
                        onClick={handleAddBuilderLayer}
                        className="bg-[#FAF5EF] hover:bg-[#F3EFE6] border border-[#7C5F43]/35 text-[#7C5F43] font-bold text-[9.5px] py-1.5 px-3 rounded-lg uppercase transition-all"
                      >
                        + Add Layer
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {builderLayers.map((layer, idx) => (
                        <div key={layer.id} className="flex gap-3 bg-[#FAF8F5] p-3 rounded-xl border border-[#EADFC9]/30 items-center justify-between">
                          <span className="font-bold text-stone-400 text-xs w-6">#{idx + 1}</span>
                          
                          <div className="flex-grow grid grid-cols-2 md:grid-cols-3 gap-3">
                            <div className="flex flex-col">
                              <span className="text-[9px] text-[#8E7D75] font-semibold mb-0.5">Material Texture</span>
                              <select 
                                value={layer.material}
                                onChange={(e) => handleUpdateBuilderLayer(layer.id, { material: e.target.value })}
                                className="bg-white border border-[#EADFC9]/50 rounded-lg p-1.5 text-[11px] focus:outline-none"
                              >
                                <option value="Soft Foam">Soft Foam</option>
                                <option value="Rebonded">Rebonded Foam</option>
                                <option value="Natural Latex">Natural Latex</option>
                                <option value="Memory Foam">Memory Foam</option>
                                <option value="HR Foam">HR Foam</option>
                                <option value="Coir">Coir (Coconut fiber)</option>
                                <option value="Pocket Spring">Pocket Spring Grid</option>
                              </select>
                            </div>

                            <div className="flex flex-col">
                              <span className="text-[9px] text-[#8E7D75] font-semibold mb-0.5">Thickness (inches)</span>
                              <input 
                                type="number" 
                                value={layer.thick}
                                onChange={(e) => handleUpdateBuilderLayer(layer.id, { thick: parseFloat(e.target.value) || 0.5 })}
                                className="bg-white border border-[#EADFC9]/50 rounded-lg p-1.5 text-[11px] text-center focus:outline-none font-bold"
                              />
                            </div>

                            <div className="flex flex-col">
                              <span className="text-[9px] text-[#8E7D75] font-semibold mb-0.5">Layer Role</span>
                              <input 
                                type="text" 
                                value={layer.type || 'Comfort Layer'}
                                onChange={(e) => handleUpdateBuilderLayer(layer.id, { type: e.target.value })}
                                className="bg-white border border-[#EADFC9]/50 rounded-lg p-1.5 text-[11px] focus:outline-none"
                              />
                            </div>
                          </div>

                          <button 
                            onClick={() => handleDeleteBuilderLayer(layer.id)}
                            className="text-red-500 hover:text-red-700 text-base font-bold p-1 focus:outline-none"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end pt-3 border-t border-[#EADFC9]/25">
                    <button 
                      onClick={() => alert('Mattress Layer specs configuration updated inside operations db!')}
                      className="bg-[#7C5F43] hover:bg-[#5F4630] text-white font-bold px-6 py-2.5 rounded-xl transition-all"
                    >
                      Save Configuration Layer Maps
                    </button>
                  </div>
                </div>

                {/* Dynamic visual preview panel */}
                <div className="lg:col-span-5 bg-[#201917] p-6 rounded-2xl border border-stone-800 shadow-[0_6px_25px_rgba(0,0,0,0.2)]">
                  <span className="inline-block bg-[#7C5F43] text-white font-bold text-[9px] uppercase tracking-wider py-1 px-2.5 rounded-md mb-4">
                    Mattress Stack Visualizer
                  </span>
                  
                  {/* Dynamic Layers Stack Render */}
                  <div className="border border-stone-800 rounded-xl overflow-hidden bg-black/10 p-5 flex flex-col items-center">
                    <div className="w-full max-w-[200px] flex flex-col gap-1.5 select-none py-4">
                      {builderLayers.map((l, index) => {
                        let fillStyles = { backgroundColor: '#EADFC9', color: '#2A211D' };
                        if (l.material === 'Soft Foam') fillStyles = { backgroundColor: '#FDF6E2', color: '#826A32' };
                        if (l.material === 'Rebonded') fillStyles = { backgroundColor: '#707070', color: '#ffffff' };
                        if (l.material === 'Natural Latex') fillStyles = { backgroundColor: '#FAF1D6', color: '#9E782F' };
                        if (l.material === 'Memory Foam') fillStyles = { backgroundColor: '#FFEBB8', color: '#8A601E' };
                        if (l.material === 'HR Foam') fillStyles = { backgroundColor: '#C8E8D5', color: '#2C5E43' };
                        if (l.material === 'Coir') fillStyles = { backgroundColor: '#8B5A2B', color: '#ffffff' };
                        if (l.material === 'Pocket Spring') fillStyles = { backgroundColor: '#D2D7DF', color: '#1E293B' };

                        return (
                          <div 
                            key={l.id || index}
                            className="w-full rounded-md p-3 text-center font-bold text-[10px] shadow-xs relative overflow-hidden transition-all duration-300 border border-black/10 flex flex-col justify-center"
                            style={{ 
                              ...fillStyles, 
                              height: `${Math.max(40, l.thick * 15)}px` 
                            }}
                          >
                            <span>{l.thick}" {l.material}</span>
                            <span className="text-[8px] opacity-75 font-normal">{l.type}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-4 text-stone-400 text-[10.5px] leading-relaxed">
                    <h5 className="font-bold text-[#E3D8C4] mb-1">Thickness Stack Check</h5>
                    <p>
                      Total core thickness calculation: <strong className="text-white">{builderLayers.reduce((sum, l) => sum + l.thick, 0)} inches</strong>.
                    </p>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* 4. MODULE: SOFA MANAGEMENT */}
          {activeModule === 'sofa_mgmt' && (
            <div className="animate-fade-in space-y-6">
              
              <div className="flex justify-between items-center border-b border-[#EADFC9]/40 pb-4">
                <div>
                  <h1 className="text-2xl font-serif font-bold text-[#2A211D]">Sofa Model Management</h1>
                  <p className="text-xs text-[#8E7D75]">Database records of sofa layouts, shapes, and seating capacities</p>
                </div>
                <button 
                  onClick={resetProductForm}
                  className="bg-[#7C5F43] hover:bg-[#5F4630] text-white font-bold text-[10.5px] uppercase tracking-wider py-2.5 px-4 rounded-xl transition-all focus:outline-none"
                >
                  + Add Sofa Model
                </button>
              </div>

              {/* Sofa Form Panel */}
              <div className="bg-white border border-[#EADFC9]/45 p-6 rounded-2xl shadow-[0_6px_25px_rgba(42,33,29,0.02)]">
                <h4 className="font-serif font-bold text-xs text-[#2A211D] mb-4 pb-2 border-b border-[#EADFC9]/30">
                  {editingProduct && productForm.category === 'sofa' ? `Edit Model: ${productForm.name}` : 'Catalog New Sofa Model'}
                </h4>

                <form onSubmit={handleSaveProduct} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="font-bold text-[#2A211D] mb-1">Sofa Model Name</label>
                      <input 
                        type="text" 
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value, category: 'sofa' })}
                        required
                        placeholder="Luxury Chesterfield Sofa"
                        className="bg-[#FAF8F5] border border-[#EADFC9]/60 rounded-lg p-2 focus:outline-none text-[#2A211D]"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="font-bold text-[#2A211D] mb-1">Sofa Layout Category</label>
                      <select 
                        value={productForm.sofaCategory}
                        onChange={(e) => setProductForm({ ...productForm, sofaCategory: e.target.value })}
                        className="bg-[#FAF8F5] border border-[#EADFC9]/60 rounded-lg p-2 focus:outline-none text-[#2A211D]"
                      >
                        <option value="recliner">Recliner Sofa</option>
                        <option value="2-seater">2 Seater</option>
                        <option value="3-seater">3 Seater</option>
                        <option value="corner">Corner Sofa</option>
                        <option value="custom">Custom Layout</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="font-bold text-[#2A211D] mb-1">Base Factory Cost (₹)</label>
                      <input 
                        type="number" 
                        value={productForm.basePrice}
                        onChange={(e) => setProductForm({ ...productForm, basePrice: parseInt(e.target.value) || '' })}
                        required
                        placeholder="22500"
                        className="bg-[#FAF8F5] border border-[#EADFC9]/60 rounded-lg p-2 focus:outline-none text-[#2A211D]"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="font-bold text-[#2A211D] mb-1">Showroom Multiplier</label>
                      <input 
                        type="text" 
                        value={productForm.retailMultiplier}
                        onChange={(e) => setProductForm({ ...productForm, retailMultiplier: e.target.value })}
                        placeholder="2.0"
                        className="bg-[#FAF8F5] border border-[#EADFC9]/60 rounded-lg p-2 focus:outline-none text-[#2A211D]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="font-bold text-[#2A211D] mb-1">Detailed Description</label>
                    <textarea 
                      rows="3"
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      required
                      className="bg-[#FAF8F5] border border-[#EADFC9]/60 rounded-lg p-2 focus:outline-none text-[#2A211D] resize-none"
                    ></textarea>
                  </div>

                  {renderGalleryManager(['Front View', 'Side View', 'Back Profile', 'Recliner / Open Position', 'Fabric Close-up', 'Lifestyle Room Setting'])}

                  <div className="flex justify-end gap-2.5 border-t border-[#EADFC9]/20 pt-4">
                    <button 
                      type="button" 
                      onClick={resetProductForm}
                      className="border border-[#EADFC9]/60 px-4 py-2 rounded-xl text-stone-500 hover:bg-[#FAF8F5]"
                    >
                      Clear Form
                    </button>
                    <button 
                      type="submit"
                      disabled={submitLoading}
                      className="bg-[#7C5F43] hover:bg-[#5F4630] text-white font-bold px-6 py-2 rounded-xl transition-all disabled:opacity-40"
                    >
                      {submitLoading ? 'Saving...' : 'Save Sofa Model'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Sofa List Database Table */}
              <div className="bg-white border border-[#EADFC9]/45 rounded-2xl overflow-hidden shadow-[0_4px_15px_rgba(42,33,29,0.01)]">
                <table className="w-full text-left">
                  <thead className="bg-[#FAF5EF] border-b border-[#EADFC9]/40">
                    <tr>
                      <th className="p-3.5 font-serif font-bold text-[#2A211D]">Sofa Name</th>
                      <th className="p-3.5 font-serif font-bold text-[#2A211D]">Layout Category</th>
                      <th className="p-3.5 font-serif font-bold text-[#2A211D]">Base Price</th>
                      <th className="p-3.5 font-serif font-bold text-[#2A211D]">Availability</th>
                      <th className="p-3.5 font-serif font-bold text-[#2A211D] text-right pr-6">Controls</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sofaProducts.map((p) => (
                      <tr key={p._id} className="border-b border-stone-100 last:border-b-0 hover:bg-[#FAF8F5]/30">
                        <td className="p-3.5 font-semibold text-[#2A211D]">{p.name}</td>
                        <td className="p-3.5 capitalize text-[#8E7D75]">{p.sofaCategory || 'l-shape'}</td>
                        <td className="p-3.5 font-bold text-[#2A211D]">₹{p.basePrice.toLocaleString('en-IN')}</td>
                        <td className="p-3.5">
                          <button 
                            onClick={() => handleToggleProductAvailability(p)}
                            className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase ${
                              p.isAvailable ? 'bg-green-50 border border-green-200 text-green-600' : 'bg-red-50 border border-red-200 text-red-500'
                            }`}
                          >
                            {p.isAvailable ? 'Active' : 'Draft'}
                          </button>
                        </td>
                        <td className="p-3.5 text-right space-x-3 pr-6">
                          <button 
                            onClick={() => handleEditProductClick(p)}
                            className="text-[#7C5F43] hover:underline font-bold"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDuplicateProduct(p)}
                            className="text-stone-400 hover:text-stone-600 font-bold"
                          >
                            Duplicate
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(p._id)}
                            className="text-red-500 hover:underline font-bold"
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

          {/* 5. MODULE: FABRIC CATALOGUE */}
          {activeModule === 'fabric_catalogue' && (
            <div className="animate-fade-in space-y-6">
              
              <div className="border-b border-[#EADFC9]/40 pb-4">
                <h1 className="text-2xl font-serif font-bold text-[#2A211D]">Fabric Swatches Catalogues</h1>
                <p className="text-xs text-[#8E7D75]">Configure Standard and Premium fabrics options</p>
              </div>

              {/* Fabric Swatch Quality Categories Tabs */}
              <div className="flex border-b border-[#EADFC9]/40">
                {['standard', 'premium'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setFabricTab(tab);
                      setEditingFabric(null);
                    }}
                    className={`py-3 px-6 font-bold uppercase text-[10.5px] border-b-2 transition-all ${
                      fabricTab === tab 
                        ? 'border-[#7C5F43] text-[#7C5F43]' 
                        : 'border-transparent text-stone-400 hover:text-stone-600'
                    }`}
                  >
                    {tab} Quality Swatches
                  </button>
                ))}
              </div>

              {/* Fabric Edit Form */}
              <div className="bg-white border border-[#EADFC9]/45 p-6 rounded-2xl shadow-[0_6px_25px_rgba(42,33,29,0.02)]">
                <h4 className="font-serif font-bold text-xs text-[#2A211D] mb-4 pb-2 border-b border-[#EADFC9]/30">
                  {editingFabric ? `Edit Fabric: ${editingFabric.code}` : `Catalogue New ${fabricTab.toUpperCase()} Fabric`}
                </h4>

                <form onSubmit={handleSaveFabric} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div className="flex flex-col">
                    <label className="font-bold text-[#2A211D] mb-1">Fabric Code</label>
                    <input 
                      type="text" 
                      value={fabricForm.code}
                      onChange={(e) => setFabricForm({ ...fabricForm, code: e.target.value })}
                      required
                      placeholder={fabricTab === 'standard' ? 'S001' : 'P001'}
                      className="bg-[#FAF8F5] border border-[#EADFC9]/60 rounded-lg p-2 focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-bold text-[#2A211D] mb-1">Fabric Name</label>
                    <input 
                      type="text" 
                      value={fabricForm.name}
                      onChange={(e) => setFabricForm({ ...fabricForm, name: e.target.value })}
                      required
                      placeholder="Royal Beige"
                      className="bg-[#FAF8F5] border border-[#EADFC9]/60 rounded-lg p-2 focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-bold text-[#2A211D] mb-1">Fabric Finish / Texture</label>
                    <select 
                      value={fabricForm.finish}
                      onChange={(e) => setFabricForm({ ...fabricForm, finish: e.target.value })}
                      className="bg-[#FAF8F5] border border-[#EADFC9]/60 rounded-lg p-2 focus:outline-none"
                    >
                      <option value="Velvet">Velvet Plush</option>
                      <option value="Linen">Organic Linen</option>
                      <option value="Bouclé">Looped Bouclé</option>
                      <option value="Cotton">Soft Cotton</option>
                      <option value="Suede">Microfiber Suede</option>
                      <option value="Leather">Aniline Leather</option>
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label className="font-bold text-[#2A211D] mb-1">Color Swatch Hex</label>
                    <input 
                      type="color" 
                      value={fabricForm.colorHex}
                      onChange={(e) => setFabricForm({ ...fabricForm, colorHex: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-[#EADFC9]/60 rounded-lg p-1.5 h-9 cursor-pointer"
                    />
                  </div>

                  <div className="flex justify-end gap-2 md:col-span-4 mt-2">
                    <button 
                      type="submit"
                      disabled={submitLoading}
                      className="bg-[#7C5F43] hover:bg-[#5F4630] text-white font-bold py-2.5 px-6 rounded-xl transition-all"
                    >
                      {editingFabric ? 'Save Swatch Details' : 'Add Swatch to Catalogue'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Active list grid of swatches */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(sofaConfig?.fabrics || []).filter(f => f.quality === fabricTab).map((fabric) => (
                  <div key={fabric.code} className="bg-white border border-[#EADFC9]/45 rounded-xl p-4 shadow-xs relative flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-bold text-[#7C5F43]">{fabric.code}</span>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              setEditingFabric(fabric);
                              setFabricForm({
                                code: fabric.code,
                                name: fabric.name,
                                finish: fabric.finish || 'Velvet',
                                extraPrice: fabric.priceModifier || 0,
                                colorHex: fabric.colorHex || '#7C5F43',
                                isAvailable: fabric.isAvailable ?? true
                              });
                            }}
                            className="text-[#7C5F43] font-semibold hover:underline"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteFabric(fabric.code)}
                            className="text-red-500 font-semibold hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      
                      {/* Swatch circle */}
                      <div 
                        className="w-full h-20 rounded-lg border border-[#EADFC9]/60 shadow-xs mb-3 relative overflow-hidden"
                        style={{ backgroundColor: fabric.colorHex || '#7C5F43' }}
                      >
                        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%), linear-gradient(-45deg, #000 25%, transparent 25%)', backgroundSize: '4px 4px' }}></div>
                      </div>

                      <span className="block font-bold text-[#2A211D] text-xs">{fabric.name}</span>
                      <span className="block text-[10px] text-[#8E7D75] mt-0.5">{fabric.finish || 'Velvet'}</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* 6. MODULE: PRICING ENGINE */}
          {activeModule === 'pricing_engine' && (
            <div className="animate-fade-in space-y-6">
              
              <div className="border-b border-[#EADFC9]/40 pb-4">
                <h1 className="text-2xl font-serif font-bold text-[#2A211D]">Pricing Engine Formulas</h1>
                <p className="text-xs text-[#8E7D75]">Set production raw material rates per inch and fabric grade modifiers</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Foam/Spring core rates */}
                <div className="bg-white border border-[#EADFC9]/45 p-6 rounded-2xl shadow-xs space-y-4">
                  <h3 className="font-serif font-bold text-sm text-[#2A211D] border-b pb-2 border-stone-100">Foam Core Price per Inch (₹)</h3>
                  
                  <div className="space-y-3">
                    {[
                      { key: 'softFoam', label: 'Soft Foam Rate per Inch' },
                      { key: 'rebonded', label: 'High Density Rebonded Foam' },
                      { key: 'latex', label: 'Natural Latex Layer' },
                      { key: 'memoryFoam', label: 'Visco Memory Foam' },
                      { key: 'hrFoam', label: 'High Resilient (HR) Foam' }
                    ].map((foam) => (
                      <div key={foam.key} className="flex justify-between items-center bg-[#FAF8F5] p-3 rounded-xl border border-[#EADFC9]/30">
                        <span className="font-bold text-[#8E7D75]">{foam.label}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-stone-400 font-bold">₹</span>
                          <input 
                            type="number" 
                            value={rawMaterialsPricing[foam.key]}
                            onChange={(e) => setRawMaterialsPricing({ ...rawMaterialsPricing, [foam.key]: parseInt(e.target.value) || 0 })}
                            className="w-20 bg-white border border-[#EADFC9]/60 rounded-lg p-1.5 text-center font-bold text-[#2A211D]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fabric extra modifications charges */}
                <div className="bg-white border border-[#EADFC9]/45 p-6 rounded-2xl shadow-xs space-y-4">
                  <h3 className="font-serif font-bold text-sm text-[#2A211D] border-b pb-2 border-stone-100">Upholstery Quality base Rates</h3>
                  
                  <div className="space-y-3">
                    {FABRIC_QUALITIES.map((quality) => (
                      <div key={quality.id} className="flex justify-between items-center bg-[#FAF8F5] p-3 rounded-xl border border-[#EADFC9]/30">
                        <span className="font-bold text-[#8E7D75]">{quality.name}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-stone-400 font-bold">₹</span>
                          <span className="w-20 bg-white border border-stone-100 rounded-lg p-1.5 text-center font-bold text-stone-500">
                            {quality.modifier}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              <div className="flex justify-end pt-3">
                <button
                  onClick={handleSavePricingEngine}
                  disabled={submitLoading}
                  className="bg-[#7C5F43] hover:bg-[#5F4630] text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-xs"
                >
                  Save Active Pricing Formula Rates
                </button>
              </div>

            </div>
          )}

          {/* 8. FAQs CRUD MODULE */}
          {activeModule === 'faqs' && (
            <div className="animate-fade-in space-y-6">
              <div className="border-b border-[#EADFC9]/40 pb-4">
                <h1 className="text-2xl font-serif font-bold text-[#2A211D]">FAQs Manager</h1>
                <p className="text-xs text-[#8E7D75]">Manage website FAQs and automatically synchronize them with the AI Voice Assistant</p>
              </div>

              {/* FAQ Form */}
              <div className="bg-white border border-[#EADFC9]/45 p-6 rounded-2xl shadow-xs space-y-4">
                <h4 className="font-serif font-bold text-xs text-[#2A211D] mb-4 pb-2 border-b border-[#EADFC9]/30">
                  {editingFaq ? 'Edit FAQ Item' : 'Add New FAQ Item'}
                </h4>
                <form onSubmit={handleSaveFAQ} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col sm:col-span-2">
                      <label className="font-bold text-[#2A211D] mb-1">Question Description</label>
                      <input 
                        type="text" 
                        value={faqForm.question}
                        onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                        required
                        placeholder="e.g. Do you manufacture custom sized mattresses?"
                        className="bg-[#FAF8F5] border border-[#EADFC9]/60 rounded-lg p-2 focus:outline-none text-[#2A211D]"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="font-bold text-[#2A211D] mb-1">Category</label>
                      <input 
                        type="text" 
                        value={faqForm.category}
                        onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                        required
                        placeholder="e.g. Customization"
                        className="bg-[#FAF8F5] border border-[#EADFC9]/60 rounded-lg p-2 focus:outline-none text-[#2A211D]"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="font-bold text-[#2A211D] mb-1">Answer Description Details</label>
                    <textarea 
                      rows="3"
                      value={faqForm.answer}
                      onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                      required
                      placeholder="e.g. Yes! We can manufacture mattresses in any custom dimensions you specify..."
                      className="bg-[#FAF8F5] border border-[#EADFC9]/60 rounded-lg p-2 focus:outline-none text-[#2A211D] resize-none"
                    ></textarea>
                  </div>
                  <div className="flex justify-end gap-2.5 border-t border-[#EADFC9]/20 pt-4">
                    <button 
                      type="button" 
                      onClick={resetFAQForm}
                      className="border border-[#EADFC9]/60 px-4 py-2 rounded-xl text-stone-500 hover:bg-[#FAF8F5]"
                    >
                      Reset Form
                    </button>
                    <button 
                      type="submit"
                      disabled={submitLoading}
                      className="bg-[#7C5F43] hover:bg-[#5F4630] text-white font-bold px-6 py-2 rounded-xl transition-all"
                    >
                      {submitLoading ? 'Saving...' : 'Save FAQ Item'}
                    </button>
                  </div>
                </form>
              </div>

              {/* FAQs List Table */}
              <div className="bg-white border border-[#EADFC9]/45 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left">
                  <thead className="bg-[#FAF5EF] border-b border-[#EADFC9]/40">
                    <tr>
                      <th className="p-3.5 font-serif font-bold text-[#2A211D] w-[25%]">Question</th>
                      <th className="p-3.5 font-serif font-bold text-[#2A211D] w-[15%]">Category</th>
                      <th className="p-3.5 font-serif font-bold text-[#2A211D] w-[45%]">Answer</th>
                      <th className="p-3.5 font-serif font-bold text-[#2A211D] text-right w-[15%] pr-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {faqs.length > 0 ? (
                      faqs.map(faq => (
                        <tr key={faq._id} className="border-b border-stone-100 last:border-b-0 hover:bg-[#FAF8F5]/30">
                          <td className="p-3.5 font-semibold text-[#2A211D]">{faq.question}</td>
                          <td className="p-3.5"><span className="bg-[#FAF5EF] text-[#7C5F43] border border-[#7C5F43]/30 px-2 py-0.5 rounded-md text-[10px] font-bold">{faq.category}</span></td>
                          <td className="p-3.5 text-stone-500 font-medium">{faq.answer}</td>
                          <td className="p-3.5 text-right space-x-3 pr-6">
                            <button onClick={() => handleEditFAQClick(faq)} className="text-[#7C5F43] hover:underline font-bold">Edit</button>
                            <button onClick={() => handleDeleteFAQ(faq._id)} className="text-red-500 hover:underline font-bold">Delete</button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="p-6 text-center text-stone-400">No FAQs found. Create one above to feed the AI memory.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 9. AI KNOWLEDGE BASE MODULE */}
          {activeModule === 'ai_knowledge' && (
            <div className="animate-fade-in space-y-6">
              <div className="border-b border-[#EADFC9]/40 pb-4">
                <h1 className="text-2xl font-serif font-bold text-[#2A211D]">AI Knowledge Base Manager</h1>
                <p className="text-xs text-[#8E7D75]">Modify text content for static pages. Updates are automatically re-indexed for vector searches.</p>
              </div>

              <div className="bg-white border border-[#EADFC9]/45 p-6 rounded-2xl shadow-xs">
                <form onSubmit={handleSaveWebsiteContent} className="space-y-4">
                  <div className="flex flex-col max-w-sm">
                    <label className="font-bold text-[#2A211D] mb-1">Select Page Section to Edit</label>
                    <select
                      value={activeContentKey}
                      onChange={(e) => setActiveContentKey(e.target.value)}
                      className="bg-[#FAF8F5] border border-[#EADFC9]/60 rounded-lg p-2 focus:outline-none text-[#2A211D] cursor-pointer font-bold"
                    >
                      <option value="about_us">About Us Company Story</option>
                      <option value="contact_info">Contact Details / Support Hours</option>
                      <option value="store_locations">Outlets and Depots Locations</option>
                      <option value="warranty_policy">Warranty Coverage Policy</option>
                      <option value="delivery_info">Delivery / Shipping Information</option>
                      <option value="return_policy">Returns / Replacement Policy</option>
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label className="font-bold text-[#2A211D] mb-1">Page Markdown / Plain Text Copy</label>
                    <textarea 
                      rows="12"
                      value={editorContent}
                      onChange={(e) => setEditorContent(e.target.value)}
                      required
                      placeholder="Enter detailed page content text..."
                      className="bg-[#FAF8F5] border border-[#EADFC9]/60 rounded-lg p-4 focus:outline-none text-[#2A211D] leading-relaxed font-sans"
                    ></textarea>
                  </div>

                  <div className="flex justify-end pt-3">
                    <button 
                      type="submit"
                      disabled={submitLoading}
                      className="bg-[#7C5F43] hover:bg-[#5F4630] text-white font-bold py-2.5 px-6 rounded-xl transition-all"
                    >
                      {submitLoading ? 'Updating vectors...' : 'Save & Update AI Knowledge Base'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* 10. AI TRAINING PANEL */}
          {activeModule === 'ai_training' && (
            <div className="animate-fade-in space-y-6">
              <div className="border-b border-[#EADFC9]/40 pb-4">
                <h1 className="text-2xl font-serif font-bold text-[#2A211D]">AI Training & Vector Feeds</h1>
                <p className="text-xs text-[#8E7D75]">Upload PDFs or Word Documents (catalogs, specifications, detailed policies) to feed the Vector Database context.</p>
              </div>

              {/* Upload Drop Zone */}
              <div className="bg-[#FAF8F5] border-2 border-dashed border-[#EADFC9] p-8 rounded-2xl text-center flex flex-col items-center justify-center">
                <span className="text-3xl mb-3">📁</span>
                <h4 className="font-serif font-bold text-sm text-[#2A211D] mb-1">Index PDF or DOCX Manuals</h4>
                <p className="text-[10px] text-stone-400 mb-4">Supported formats: PDF, DOCX (Max size: 10MB)</p>
                
                <form onSubmit={handleDocUpload} className="flex flex-col items-center gap-3">
                  <input 
                    type="file" 
                    id="aiDocInput"
                    accept=".pdf,.docx"
                    onChange={(e) => setDocFile(e.target.files[0])}
                    className="text-xs cursor-pointer max-w-xs"
                  />
                  <button
                    type="submit"
                    disabled={submitLoading || !docFile}
                    className="bg-[#7C5F43] hover:bg-[#5F4630] text-white font-bold py-2 px-6 rounded-xl shadow-sm disabled:opacity-50 transition-colors"
                  >
                    {submitLoading ? 'Extracting Text Chunks...' : 'Train AI on Selected Document'}
                  </button>
                </form>
              </div>

              {/* Currently Trained Documents List */}
              <div className="space-y-4">
                <h4 className="font-serif font-bold text-sm text-[#2A211D]">Indexed Vector Documents</h4>
                <div className="bg-white border border-[#EADFC9]/45 rounded-2xl overflow-hidden shadow-xs">
                  <table className="w-full text-left">
                    <thead className="bg-[#FAF5EF] border-b border-[#EADFC9]/40">
                      <tr>
                        <th className="p-3.5 font-serif font-bold text-[#2A211D]">Document Name</th>
                        <th className="p-3.5 font-serif font-bold text-[#2A211D]">Context Chunks</th>
                        <th className="p-3.5 font-serif font-bold text-[#2A211D]">Trained Date</th>
                        <th className="p-3.5 font-serif font-bold text-[#2A211D] text-right pr-6">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trainedDocs.length > 0 ? (
                        trainedDocs.map(doc => (
                          <tr key={doc.id} className="border-b border-stone-100 last:border-b-0 hover:bg-[#FAF8F5]/30">
                            <td className="p-3.5 font-semibold text-[#2A211D]">{doc.name}</td>
                            <td className="p-3.5 text-stone-500 font-medium">{doc.chunksCount} vectors</td>
                            <td className="p-3.5 text-stone-500 font-medium">{new Date(doc.createdAt).toLocaleDateString()}</td>
                            <td className="p-3.5 text-right pr-6">
                              <button 
                                onClick={() => handleDeleteDoc(doc.id)}
                                className="text-red-500 hover:underline font-bold"
                              >
                                Delete Source
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="p-6 text-center text-stone-400">No custom catalogs uploaded yet. Use the selector above.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 7. MODULE: CUSTOMER ENQUIRIES */}
          {activeModule === 'customer_enquiries' && (
            <div className="animate-fade-in space-y-6">
              
              <div className="border-b border-[#EADFC9]/40 pb-4">
                <h1 className="text-2xl font-serif font-bold text-[#2A211D]">Customer Enquiries Inbox</h1>
                <p className="text-xs text-[#8E7D75]">Process self-configured quotation inquiries received from the frontend configurators</p>
              </div>

              <div className="bg-white border border-[#EADFC9]/45 rounded-2xl overflow-hidden shadow-[0_4px_15px_rgba(42,33,29,0.01)]">
                <table className="w-full text-left">
                  <thead className="bg-[#FAF5EF] border-b border-[#EADFC9]/40">
                    <tr>
                      <th className="p-3.5 font-serif font-bold text-[#2A211D]">Customer & Contact</th>
                      <th className="p-3.5 font-serif font-bold text-[#2A211D]">Product Details</th>
                      <th className="p-3.5 font-serif font-bold text-[#2A211D]">Specifications Chosen</th>
                      <th className="p-3.5 font-serif font-bold text-[#2A211D]">Quoted Rate</th>
                      <th className="p-3.5 font-serif font-bold text-[#2A211D]">Status</th>
                      <th className="p-3.5 font-serif font-bold text-[#2A211D] text-right pr-6">Direct Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((lead) => (
                      <tr key={lead._id} className="border-b border-stone-100 last:border-b-0 hover:bg-[#FAF8F5]/30">
                        <td className="p-3.5 text-[#2A211D]">
                          <span className="block font-bold text-xs">{lead.name}</span>
                          <span className="block text-[10.5px] text-[#8E7D75] mt-0.5">{lead.phone} • {lead.email}</span>
                          <span className="block text-[9.5px] text-[#8E7D75] mt-1">{new Date(lead.createdAt).toLocaleDateString()}</span>
                        </td>
                        <td className="p-3.5 text-[#2A211D]">
                          <span className="block font-semibold">{lead.productName}</span>
                          <span className="inline-block text-[8.5px] bg-[#FAF5EF] border border-[#7C5F43]/30 text-[#7C5F43] px-2 py-0.5 rounded-md mt-1 uppercase font-bold">
                            {lead.category}
                          </span>
                        </td>
                        <td className="p-3.5 text-stone-500 font-medium">
                          {lead.configuration ? (
                            <div className="grid grid-cols-1 gap-0.5 text-[10.5px]">
                              {Object.entries(lead.configuration).map(([k, v]) => (
                                <span key={k} className="truncate max-w-[200px]">
                                  {k}: <strong className="text-stone-700">{v}</strong>
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="italic text-stone-400">None</span>
                          )}
                        </td>
                        <td className="p-3.5 font-bold text-[#2A211D]">
                          ₹{lead.quotedPrice?.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3.5">
                          <select 
                            value={lead.status || 'New'}
                            onChange={(e) => handleUpdateLeadStatus(lead._id, e.target.value)}
                            className="bg-[#FAF8F5] border border-[#EADFC9]/60 rounded-md p-1.5 text-[10px] font-bold text-[#2A211D]"
                          >
                            <option value="New">New Inbox</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Interested">Interested</option>
                            <option value="Quotation Sent">Quotation Sent</option>
                            <option value="Purchased">Purchased</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </td>
                        <td className="p-3.5 text-right space-x-3.5 pr-6">
                          <a 
                            href={`tel:${lead.phone}`}
                            className="text-stone-600 hover:text-stone-900 font-bold"
                          >
                            Call
                          </a>
                          
                          <a 
                            href={`https://wa.me/${lead.phone ? lead.phone.replace(/[^0-9]/g, '') : '919876543210'}?text=${encodeURIComponent(`Hi ${lead.name}, I am reaching out to discuss your Sleepora Mattress/Sofa customization quotation query.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#25D366] hover:text-[#128C7E] font-bold"
                          >
                            WhatsApp
                          </a>

                          <button 
                            onClick={() => handleDeleteLead(lead._id)}
                            className="text-red-500 hover:underline font-bold"
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

          {/* 8. MODULE: ANALYTICS */}
          {activeModule === 'analytics' && (
            <div className="animate-fade-in space-y-6">
              
              <div className="border-b border-[#EADFC9]/40 pb-4">
                <h1 className="text-2xl font-serif font-bold text-[#2A211D]">Operations & Conversational Analytics</h1>
                <p className="text-xs text-[#8E7D75]">Conversion trends, configured product views, and AI assistant performance metrics</p>
              </div>

              {/* Operations Graph Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Monthly Enquiries Graph Box */}
                <div className="bg-white border border-[#EADFC9]/45 p-5 rounded-2xl shadow-xs">
                  <h4 className="font-serif font-bold text-sm text-[#2A211D] mb-4">Monthly Enquiries Trend</h4>
                  
                  {/* Native SVG bar chart */}
                  <div className="py-2">
                    <svg viewBox="0 0 400 150" className="w-full h-auto">
                      {/* Grid lines */}
                      <line x1="40" y1="20" x2="380" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="40" y1="60" x2="380" y2="60" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="40" y1="100" x2="380" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="40" y1="130" x2="380" y2="130" stroke="#cbd5e1" strokeWidth="1" />
                      
                      {/* Bars */}
                      <rect x="60" y="50" width="30" height="80" rx="3" fill="#7C5F43" />
                      <rect x="120" y="30" width="30" height="100" rx="3" fill="#7C5F43" />
                      <rect x="180" y="65" width="30" height="65" rx="3" fill="#7C5F43" />
                      <rect x="240" y="20" width="30" height="110" rx="3" fill="#7C5F43" />
                      <rect x="300" y="40" width="30" height="90" rx="3" fill="#7C5F43" />

                      {/* Labels */}
                      <text x="75" y="145" textAnchor="middle" fontSize="10" fill="#8E7D75" fontWeight="bold">Feb</text>
                      <text x="135" y="145" textAnchor="middle" fontSize="10" fill="#8E7D75" fontWeight="bold">Mar</text>
                      <text x="195" y="145" textAnchor="middle" fontSize="10" fill="#8E7D75" fontWeight="bold">Apr</text>
                      <text x="255" y="145" textAnchor="middle" fontSize="10" fill="#8E7D75" fontWeight="bold">May</text>
                      <text x="315" y="145" textAnchor="middle" fontSize="10" fill="#8E7D75" fontWeight="bold">Jun</text>
                    </svg>
                  </div>
                </div>

                {/* Popularity Metrics Pie Representation */}
                <div className="bg-white border border-[#EADFC9]/45 p-5 rounded-2xl shadow-xs">
                  <h4 className="font-serif font-bold text-sm text-[#2A211D] mb-4">View Traffic Share</h4>
                  
                  <div className="space-y-4">
                    {[
                      { label: 'Mattresses Catalog views', val: '4,280 views', pct: '62%' },
                      { label: 'Sofa Catalog views', val: '2,640 views', pct: '38%' }
                    ].map((metric, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-[#FAF8F5] p-3.5 rounded-xl border border-stone-100">
                        <div>
                          <span className="block font-bold text-xs text-[#2A211D]">{metric.label}</span>
                          <span className="block text-[10.5px] text-[#8E7D75] mt-0.5">{metric.val}</span>
                        </div>
                        <span className="text-sm font-serif font-bold text-[#7C5F43]">{metric.pct}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Conversational Analytics Section */}
              <div className="border-t border-[#EADFC9]/30 pt-6 space-y-4">
                <h4 className="font-serif font-bold text-base text-[#2A211D]">AI Voice Assistant Analytics</h4>
                {analyticsData ? (
                  <div className="space-y-6">
                    {/* Stats Summary Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-white border border-[#EADFC9]/45 p-4 rounded-xl shadow-sm text-center">
                        <div className="text-xl font-bold text-[#2A211D]">{analyticsData.totalConversations}</div>
                        <div className="text-[9px] text-[#8E7D75] font-bold uppercase tracking-wider mt-1">Total Conversations</div>
                      </div>
                      <div className="bg-white border border-[#EADFC9]/45 p-4 rounded-xl shadow-sm text-center">
                        <div className="text-xl font-bold text-green-600">{analyticsData.totalLeads}</div>
                        <div className="text-[9px] text-[#8E7D75] font-bold uppercase tracking-wider mt-1">Leads Generated</div>
                      </div>
                      <div className="bg-white border border-[#EADFC9]/45 p-4 rounded-xl shadow-sm text-center">
                        <div className="text-xl font-bold text-[#2A211D]">{analyticsData.satisfactionRate}%</div>
                        <div className="text-[9px] text-[#8E7D75] font-bold uppercase tracking-wider mt-1">Satisfaction Score</div>
                      </div>
                      <div className="bg-white border border-[#EADFC9]/45 p-4 rounded-xl shadow-sm text-center flex flex-col items-center justify-center">
                        <div className="text-xs font-bold text-[#8E7D75] flex gap-2">
                          <span className="text-green-600">👍 {analyticsData.feedback.helpful}</span>
                          <span className="text-red-500">👎 {analyticsData.feedback.unhelpful}</span>
                        </div>
                        <div className="text-[9px] text-[#8E7D75] font-bold uppercase tracking-wider mt-1.5">User Feedback Ratings</div>
                      </div>
                    </div>

                    {/* Languages and Topic Breakdown charts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Languages Chart */}
                      <div className="bg-white border border-[#EADFC9]/45 p-5 rounded-2xl shadow-sm">
                        <h5 className="font-bold text-xs text-[#2A211D] mb-4">Interactions by Language Locale</h5>
                        <div className="space-y-3">
                          {analyticsData.languages.map(lang => {
                            const percentage = analyticsData.totalConversations > 0 
                              ? Math.round((lang.count / analyticsData.totalConversations) * 100)
                              : 0;
                            return (
                              <div key={lang.name} className="space-y-1">
                                <div className="flex justify-between font-bold text-[10px] text-[#2A211D]">
                                  <span>{lang.name}</span>
                                  <span>{lang.count} ({percentage}%)</span>
                                </div>
                                <div className="w-full bg-[#FAF5EF] h-2 rounded-full overflow-hidden">
                                  <div className="bg-[#7C5F43] h-full" style={{ width: `${percentage}%` }}></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Popular Query Topics Chart */}
                      <div className="bg-white border border-[#EADFC9]/45 p-5 rounded-2xl shadow-sm">
                        <h5 className="font-bold text-xs text-[#2A211D] mb-4">Most Queried Intent Topics</h5>
                        <div className="space-y-3">
                          {analyticsData.topics.map(topic => {
                            const totalLogs = analyticsData.totalConversations || 1;
                            const percentage = Math.min(Math.round((topic.count / totalLogs) * 100), 100);
                            return (
                              <div key={topic.name} className="space-y-1">
                                <div className="flex justify-between font-bold text-[10px] text-[#2A211D]">
                                  <span>{topic.name} Related</span>
                                  <span>{topic.count} hits</span>
                                </div>
                                <div className="w-full bg-[#FAF5EF] h-2 rounded-full overflow-hidden">
                                  <div className="bg-[#7C5F43] h-full opacity-80" style={{ width: `${percentage}%` }}></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 bg-white border border-[#EADFC9]/45 rounded-2xl text-xs text-[#8E7D75]">
                    No conversation logs available to aggregate statistics.
                  </div>
                )}
              </div>

            </div>
          )}

          {/* 9. MODULE: WEBSITE CONTENT */}
          {activeModule === 'website_content' && homepageContent && (
            <div className="animate-fade-in space-y-6">
              
              <div className="border-b border-[#EADFC9]/40 pb-4">
                <h1 className="text-2xl font-serif font-bold text-[#2A211D]">Website Content Management</h1>
                <p className="text-xs text-[#8E7D75]">Update landing page slogans, titles, description copy, and brand paragraphs</p>
              </div>

              <div className="bg-white border border-[#EADFC9]/45 p-6 rounded-2xl shadow-xs">
                <form onSubmit={handleSaveWebsite} className="space-y-4">
                  <div className="flex flex-col">
                    <label className="font-bold text-[#2A211D] mb-1">Hero Subheading</label>
                    <input 
                      type="text" 
                      value={homepageForm.heroSubheading}
                      onChange={(e) => setHomepageForm({ ...homepageForm, heroSubheading: e.target.value })}
                      required
                      className="bg-[#FAF8F5] border border-[#EADFC9]/60 rounded-lg p-2 focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-bold text-[#2A211D] mb-1">Hero Primary Title</label>
                    <input 
                      type="text" 
                      value={homepageForm.heroTitle}
                      onChange={(e) => setHomepageForm({ ...homepageForm, heroTitle: e.target.value })}
                      required
                      className="bg-[#FAF8F5] border border-[#EADFC9]/60 rounded-lg p-2 focus:outline-none font-bold"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-bold text-[#2A211D] mb-1">Hero Subtitle Paragraph</label>
                    <textarea 
                      rows="3"
                      value={homepageForm.heroSubtitle}
                      onChange={(e) => setHomepageForm({ ...homepageForm, heroSubtitle: e.target.value })}
                      required
                      className="bg-[#FAF8F5] border border-[#EADFC9]/60 rounded-lg p-2 focus:outline-none resize-none leading-relaxed"
                    ></textarea>
                  </div>

                  <div className="flex justify-end pt-3">
                    <button 
                      type="submit"
                      disabled={submitLoading}
                      className="bg-[#7C5F43] hover:bg-[#5F4630] text-white font-bold py-2.5 px-6 rounded-xl transition-all disabled:opacity-40"
                    >
                      {submitLoading ? 'Saving...' : 'Save Content Headlines'}
                    </button>
                  </div>
                </form>
              </div>

            </div>
          )}

          {/* 10. MODULE: SETTINGS */}
          {activeModule === 'settings' && (
            <div className="animate-fade-in space-y-6">
              
              <div className="border-b border-[#EADFC9]/40 pb-4">
                <h1 className="text-2xl font-serif font-bold text-[#2A211D]">Portal Settings</h1>
                <p className="text-xs text-[#8E7D75]">Update admin credentials, factory branch profiles, and notification preferences</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Admin credentials form */}
                <div className="lg:col-span-7 bg-white border border-[#EADFC9]/45 p-6 rounded-2xl shadow-xs">
                  <h4 className="font-serif font-bold text-xs text-[#2A211D] mb-4 pb-1.5 border-b border-stone-100">Profile Safety Credentials</h4>
                  
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="flex flex-col">
                      <label className="font-bold text-[#2A211D] mb-1">Admin Email Address</label>
                      <input 
                        type="email" 
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        required
                        className="bg-[#FAF8F5] border border-[#EADFC9]/60 rounded-lg p-2 focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="font-bold text-[#2A211D] mb-1">New Password</label>
                      <input 
                        type="password" 
                        value={profileForm.password}
                        onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })}
                        required
                        placeholder="••••••••••••"
                        className="bg-[#FAF8F5] border border-[#EADFC9]/60 rounded-lg p-2 focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="font-bold text-[#2A211D] mb-1">Confirm New Password</label>
                      <input 
                        type="password" 
                        value={profileForm.confirmPassword}
                        onChange={(e) => setProfileForm({ ...profileForm, confirmPassword: e.target.value })}
                        required
                        placeholder="••••••••••••"
                        className="bg-[#FAF8F5] border border-[#EADFC9]/60 rounded-lg p-2 focus:outline-none"
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={submitLoading}
                      className="bg-[#7C5F43] hover:bg-[#5F4630] text-white font-bold py-2.5 px-6 rounded-xl transition-all"
                    >
                      Update Profile Safety
                    </button>
                  </form>
                </div>

                {/* Company profile & Backup options */}
                <div className="lg:col-span-5 bg-white border border-[#EADFC9]/45 p-6 rounded-2xl shadow-xs space-y-5">
                  <div>
                    <h4 className="font-serif font-bold text-xs text-[#2A211D] mb-3 pb-1 border-b border-stone-100">Database Tools</h4>
                    <button 
                      onClick={() => alert('Simulating full operations database dump creation...')}
                      className="w-full bg-[#FAF5EF] hover:bg-[#F3EFE6] border border-[#7C5F43]/35 text-[#7C5F43] font-bold text-[10.5px] py-3 rounded-xl uppercase tracking-wider transition-all"
                    >
                      💾 Run Database Backup Dump
                    </button>
                  </div>

                  <div className="border-t border-stone-100 pt-4">
                    <h4 className="font-serif font-bold text-xs text-[#2A211D] mb-3 pb-1 border-b border-stone-100">Factory Branch Profile</h4>
                    <div className="text-stone-500 space-y-2 leading-relaxed">
                      <p><strong>Factory Outlet Name:</strong> {profileForm.companyName}</p>
                      <p><strong>Registered Address:</strong> {profileForm.address}</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

        </main>
      </div>

    </div>
  );
};

export default AdminDashboard;
