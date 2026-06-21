import React, { useState, useEffect } from 'react';
import API from '../services/api';
import MetaTags from '../components/MetaTags';

const Warranty = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await API.get('/website-content/warranty_policy');
        if (response.data.success && response.data.data) {
          setContent(response.data.data.content);
        }
      } catch (err) {
        console.warn('Failed to load warranty content from API, using fallback.');
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const fallbackContent = `TimeWell Mattress Factory offers a comprehensive manufacturer-backed warranty program on all our mattresses and sofa structures. 

1. Orthopaedic Memory Foam Range: Up to 10 Years limited warranty against foam sagging, core softening, or structural collapse.
2. Premium Natural Latex Core Range: Up to 12 Years limited warranty covering latex tearing or indentation exceeding 1.5 inches.
3. Luxury Pocket Coil Hybrid Spring Systems: Up to 8 Years warranty on pocket springs against spring coil breakages or localized structural frame collapse.
4. Custom Sectional Sofa Range: Up to 5 Years warranty on internal solid timber frameworks and high-density foam cushioning.

This warranty covers manufacturing defects and structural sagging under normal usage. It does not cover fabrics, stains, spills, or custom sizing alterations requested after production approvals. To register your warranty or request service, please get in touch with our support desk with your invoice number.`;

  return (
    <div className="max-w-[1000px] mx-auto px-6 py-16 select-none animate-fade-in">
      <MetaTags 
        title="Warranty Terms & Policy | TimeWell Mattress Factory"
        description="Verify warranty details for TimeWell orthopedic sleep cores, spring mattresses, and custom sofas. Claim terms and direct factory support guarantees."
      />

      <div className="text-center max-w-[650px] mx-auto mb-16">
        <span className="text-xs font-bold text-accent uppercase tracking-wider mb-2 inline-block">Factory Guarantee</span>
        <h1 className="text-3xl md:text-4xl font-extrabold font-display mb-4 text-primary">Warranty Information</h1>
        <p className="text-sm text-text-muted leading-relaxed">
          Premium sleep products deserve premium coverage. Review our warranty terms directly from the manufacturer.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        
        {/* Left Columns - Content Text */}
        <div className="md:col-span-2 bg-white border border-border p-8 rounded shadow-sm">
          <h2 className="text-lg font-bold font-display text-primary mb-4 pb-2 border-b border-border">Warranty Coverage details</h2>
          <div className="text-xs text-text-muted space-y-4 leading-relaxed whitespace-pre-line">
            {loading ? (
              <div className="w-full h-40 bg-bg-light animate-pulse rounded"></div>
            ) : (
              content || fallbackContent
            )}
          </div>
        </div>

        {/* Right Column - Claims Info */}
        <div className="bg-bg-light p-6 rounded border border-border flex flex-col gap-5 text-xs text-text-muted">
          <div>
            <h4 className="font-bold text-primary font-display text-sm mb-3">How to File a Claim?</h4>
            <ol className="list-decimal pl-4 space-y-2.5">
              <li>Retrieve your original invoice or order confirmation details.</li>
              <li>Measure any visible sagging by laying a straight edge across the mattress.</li>
              <li>Take clear photos of the sag depth and the overall mattress condition on the bed frame.</li>
              <li>Email the invoice and photos to <span className="font-semibold text-primary">warranty@timewellfactory.com</span> or contact us on WhatsApp.</li>
            </ol>
          </div>
          
          <div className="pt-4 border-t border-border mt-2">
            <h4 className="font-bold text-primary font-display text-sm mb-2">Exclusions Notice</h4>
            <p className="leading-relaxed">
              Warranty is void if the product has been placed on an uneven foundation, shows signs of liquid damage/spills, or has been altered or repaired by third parties.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Warranty;
