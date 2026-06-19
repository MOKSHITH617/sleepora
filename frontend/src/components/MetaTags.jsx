import React, { useEffect } from 'react';

const MetaTags = ({ title, description, ogUrl, ogImage, productSchema, localBusinessSchema }) => {
  useEffect(() => {
    // 1. Update Title Tag
    const pageTitle = title 
      ? `${title} | TimeWell Mattress Factory` 
      : 'TimeWell Mattresses | Factory Direct Premium Comfort';
    document.title = pageTitle;

    // 2. Update Description Meta Tag
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description || 'Buy premium mattresses directly from the manufacturer in India. Custom sizes, Orthopaedic Memory Foam, Natural Latex, and Pocket Spring. Save 50% on retail showroom prices.');

    // 3. Helper to update/create Open Graph (OG) tags
    const updateOgTag = (property, content) => {
      let ogTag = document.querySelector(`meta[property="${property}"]`);
      if (!ogTag) {
        ogTag = document.createElement('meta');
        ogTag.setAttribute('property', property);
        document.head.appendChild(ogTag);
      }
      ogTag.setAttribute('content', content || '');
    };

    updateOgTag('og:title', title || 'TimeWell Mattresses | Factory Direct Premium Comfort');
    updateOgTag('og:description', description || 'Buy premium mattresses directly from the manufacturer. Custom sizes, Orthopaedic Memory Foam, Natural Latex, and Pocket Spring.');
    updateOgTag('og:url', ogUrl || window.location.href);
    updateOgTag('og:image', ogImage || `${window.location.origin}/images/ortho_mattress.png`);
    updateOgTag('og:type', 'website');

    // 4. Inject JSON-LD Structured Data Schema Markup
    // Remove old dynamic JSON-LD scripts to prevent duplicates
    const oldScripts = document.querySelectorAll('script[type="application/ld+json"].dynamic-seo');
    oldScripts.forEach(el => el.remove());

    const addStructuredData = (schemaObj) => {
      if (!schemaObj) return;
      const script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.className = 'dynamic-seo';
      script.text = JSON.stringify(schemaObj);
      document.head.appendChild(script);
    };

    if (productSchema) {
      addStructuredData(productSchema);
    }

    if (localBusinessSchema) {
      addStructuredData(localBusinessSchema);
    }

  }, [title, description, ogUrl, ogImage, productSchema, localBusinessSchema]);

  return null; // Side-effect only component, renders nothing
};

export default MetaTags;
