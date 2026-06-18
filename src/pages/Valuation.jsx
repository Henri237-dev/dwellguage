import React, { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PageWrapper } from '../components/layout/PageWrapper';
import { TopHeader } from '../components/layout/TopHeader';
import { BottomNav } from '../components/layout/BottomNav';
import { ToggleSwitch } from '../components/ui/ToggleSwitch';
import { NumberStepper } from '../components/ui/NumberStepper';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Badge } from '../components/ui/Badge';
import { predictPrice, encodeFeatures } from '../ml/model';
import { useAppContext } from '../context/AppContext';

const neighborhoods = ['Tarred Malingo', 'Bulu', 'Small Soppo', 'Sandpit', 'Mayor Street', 'Dirty South', 'Muea', 'Bonduma', 'Molyko', 'Mile16', 'Siac', 'UB south area', 'Cogeni', 'Biaka/SantaBabara', 'Ub junction', 'Bakweri Town', 'Mile18', 'Muea Control', 'Mile17', 'CCA', 'Ndongo', 'Bomaka', 'Memoz', 'Check Point', 'Bakweri', 'Mille 18'];
const propertyTypes = ['Apartment', 'Studio', 'Self-Contained Room'];
const proximities = ['Walking distance (<500m)', 'Near (500m–2km)', 'Far (>2km)'];

export const Valuation = () => {
  const { saveEstimate } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({
    address: '',
    neighborhood: 'Molyko',
    region: 'South West',
    universityProximity: 'Walking distance (<500m)',
    propertyType: 'Apartment',
    bedrooms: 1,
    bathrooms: 1,
    lotSize: 500,
    hasWater: true,
    hasElectricity: true,
    hasFence: false,
    hasGuard: false,
    hasParking: false,
    hasWifi: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updates = { [name]: value };
      
      if (name === 'neighborhood') {
        const walking = ['Molyko', 'Ndongo', 'Mayor Street', 'Biaka/SantaBabara', 'UB south area'];
        const near = ['Check Point', 'Sandpit', 'Ub junction', 'Bakweri Town', 'Bomaka'];
        
        if (walking.includes(value)) updates.universityProximity = proximities[0];
        else if (near.includes(value)) updates.universityProximity = proximities[1];
        else updates.universityProximity = proximities[2];
      }
      
      if (name === 'propertyType') {
        if (value === 'Studio' || value === 'Self-Contained Room') {
          updates.bedrooms = 1;
          updates.bathrooms = 1;
        }
      }
      
      return { ...prev, ...updates };
    });
  };

  const handleToggle = (name) => {
    setFormData(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleNumberChange = (name, val) => {
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const downloadPDF = async () => {
    const element = document.getElementById('valuation-report');
    if (!element) return;
    
    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`DwellGuage_Report_${Date.now()}.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF', err);
      alert('Failed to generate PDF.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate ML processing time
    setTimeout(() => {
      const prediction = predictPrice(formData);
      saveEstimate(prediction, formData);
      setResult(prediction);
      setLoading(false);
    }, 1500);
  };

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white";

  return (
    <PageWrapper noPadding>
      <TopHeader title="ML Valuation" />
      <div className="p-4">
        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2"></div>
          <Badge variant="success" className="mb-2">✓ ML Model Ready</Badge>
          <h2 className="font-bold text-gray-900 mb-1">ML-Powered Valuation</h2>
          <p className="text-xs text-gray-600">Enter property details to get an instant ML-powered valuation estimate based on recent market data.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!result && (
            <>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-4">
                <h3 className="font-bold text-gray-900 text-sm pb-2 border-b border-gray-50">Location Information</h3>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Street Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} className={inputClass} placeholder="e.g. 123 Main St" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Neighborhood</label>
                    <select name="neighborhood" value={formData.neighborhood} onChange={handleChange} className={inputClass}>
                      {neighborhoods.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Region</label>
                    <input type="text" name="region" value={formData.region} disabled className={`${inputClass} bg-gray-50 text-gray-500`} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Proximity to Univ. of Buea</label>
                  <select name="universityProximity" value={formData.universityProximity} onChange={handleChange} className={inputClass}>
                    {proximities.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-4">
                <h3 className="font-bold text-gray-900 text-sm pb-2 border-b border-gray-50">Property Details</h3>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Property Type</label>
                  <select name="propertyType" value={formData.propertyType} onChange={handleChange} className={inputClass}>
                    {propertyTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div className="divide-y divide-gray-50">
                  <NumberStepper label="Bedrooms" value={formData.bedrooms} onChange={(val) => handleNumberChange('bedrooms', val)} min={1} max={formData.propertyType === 'Apartment' ? 10 : 1} />
                  <NumberStepper label="Bathrooms" value={formData.bathrooms} onChange={(val) => handleNumberChange('bathrooms', val)} min={1} max={formData.propertyType === 'Apartment' ? 6 : 1} />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 divide-y divide-gray-50">
                <h3 className="font-bold text-gray-900 text-sm pb-2 mb-2 border-none">Amenities & Security</h3>
                <ToggleSwitch label="Water availability (borehole/tap)" checked={formData.hasWater} onChange={() => handleToggle('hasWater')} />
                <ToggleSwitch label="Electricity (stable)" checked={formData.hasElectricity} onChange={() => handleToggle('hasElectricity')} />
                <ToggleSwitch label="Perimeter fence" checked={formData.hasFence} onChange={() => handleToggle('hasFence')} />
                <ToggleSwitch label="Security guard" checked={formData.hasGuard} onChange={() => handleToggle('hasGuard')} />
                <ToggleSwitch label="Parking space" checked={formData.hasParking} onChange={() => handleToggle('hasParking')} />
                <ToggleSwitch label="Internet / WiFi ready" checked={formData.hasWifi} onChange={() => handleToggle('hasWifi')} />
              </div>

              {!loading && (
                <button type="submit" className="w-full bg-hero-gradient text-white font-bold py-4 rounded-full shadow-lg shadow-primary/25 hover:shadow-xl transition-all flex items-center justify-center gap-2">
                  Calculate ML Valuation
                </button>
              )}
            </>
          )}

          {loading && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex justify-center">
              <LoadingSpinner text="Running ML Inference..." />
            </div>
          )}

          {result && !loading && (
            <div className="p-4 mb-20 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Valuation Complete</h2>
                <button type="button" onClick={() => setResult(null)} className="text-sm font-medium text-primary">New Estimate</button>
              </div>

              <div id="valuation-report" className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-0"></div>
                
                <p className="text-sm text-gray-500 font-medium mb-1 relative z-10">Estimated Market Value / month (rent)</p>
                <h3 className="text-4xl font-black text-gray-900 font-mono tracking-tighter mb-4 relative z-10">{result.price.toLocaleString()} <span className="text-xl text-primary">XAF</span></h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Confidence Score</p>
                    <p className="text-lg font-bold text-green-600">{result.confidence}%</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Estimated Range</p>
                    <p className="text-sm font-bold text-gray-900 font-mono leading-tight">{result.range.low.toLocaleString()} - {result.range.high.toLocaleString()}</p>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100 relative z-10">
                  <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Key Value Drivers</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary"></div> {formData.neighborhood} location</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary"></div> {formData.propertyType} category</li>
                  </ul>
                </div>
              </div>
              
              <button 
                type="button"
                onClick={downloadPDF}
                className="mt-4 w-full bg-white border border-primary text-primary font-bold py-3 rounded-xl flex items-center justify-center shadow-sm hover:bg-gray-50"
              >
                Download PDF Report
              </button>
            </div>
          )}
        </form>
      </div>
      <BottomNav />
    </PageWrapper>
  );
};
