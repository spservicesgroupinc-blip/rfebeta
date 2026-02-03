
import React, { useState } from 'react';
import { 
    ShieldCheck, ArrowRight, BookOpen, Smartphone, Users, LayoutDashboard, Calculator, CheckCircle2, DollarSign, Box, Menu, UserPlus, ArrowLeft, Loader2, Lock, PlayCircle, Monitor, XCircle, Zap, Globe, FileText, Wrench, RefreshCw, Radio, Truck
} from 'lucide-react';
import { submitBetaSignup } from '../services/api';

interface LandingPageProps {
  onEnterApp?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  // Default view is now 'marketing'
  const [view, setView] = useState<'marketing' | 'guide' | 'signup' | 'success'>('marketing');
  
  // Basic Contact Info
  const [contactData, setContactData] = useState({ 
      name: '', 
      email: '', 
      phone: ''
  });

  // Survey State
  const [surveyData, setSurveyData] = useState({
      q1_operationType: '',
      q2_headaches: [] as string[],
      q3_estimateMethod: '',
      q4_softwareHate: '',
      q5_yieldLoss: '',
      q6_dynamicPricing: '',
      q7_gunDownCost: '',
      q8_dreamFeatures: [] as string[],
      q9_pricingSwitch: '',
      q10_freeTier: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper for Multi-Select with Limits
  const toggleMultiSelect = (field: 'q2_headaches' | 'q8_dreamFeatures', value: string, limit: number) => {
      setSurveyData(prev => {
          const current = prev[field];
          if (current.includes(value)) {
              return { ...prev, [field]: current.filter(i => i !== value) };
          }
          if (current.length >= limit) {
              return prev; // Limit reached
          }
          return { ...prev, [field]: [...current, value] };
      });
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
          await submitBetaSignup(contactData.name, contactData.email, contactData.phone, surveyData);
          setView('success');
      } catch (error) {
          alert("Connection error. Please try again.");
      } finally {
          setIsSubmitting(false);
      }
  };

  const handleSkipSurvey = async () => {
      if (!contactData.name || !contactData.email) {
          alert("Please provide your Name and Email first.");
          return;
      }
      setIsSubmitting(true);
      try {
          // Submit with current (empty) survey data
          await submitBetaSignup(contactData.name, contactData.email, contactData.phone, surveyData);
          setView('success');
      } catch (error) {
          alert("Connection error. Please try again.");
      } finally {
          setIsSubmitting(false);
      }
  };

  const RFESmallLogo = () => (
    <div className="inline-flex flex-col select-none">
        <div className="flex items-center gap-2">
            <div className="bg-[#E30613] text-white px-1.5 py-0 -skew-x-12 transform origin-bottom-left shadow-sm">
                <span className="skew-x-12 block font-black text-xl tracking-tighter">RFE</span>
            </div>
            <div className="flex items-baseline">
                <span className="text-slate-900 font-black text-xl italic tracking-tight">RFE</span>
                <div className="w-1.5 h-1.5 bg-[#E30613] rounded-full ml-0.5 mb-1"></div>
            </div>
        </div>
    </div>
  );

  // --- VIEW: SUCCESS MESSAGE (Dead End) ---
  if (view === 'success') {
      return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl border border-slate-200 text-center animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">Request Received</h2>
                <p className="text-slate-600 font-medium leading-relaxed mb-8">
                    Thank you for signing up for the FoamApp Pro v3 Beta. 
                    <br/><br/>
                    <span className="font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded">
                        You will receive an email with login instructions within 24 hours.
                    </span>
                </p>
                {onEnterApp && (
                  <button 
                      onClick={onEnterApp}
                      className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-slate-800 transition-colors"
                  >
                      Continue to Demo
                  </button>
                )}
            </div>
        </div>
      );
  }

  // --- VIEW: SIGN UP FORM ---
  if (view === 'signup') {
      return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
            <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-40 p-4">
                <div className="max-w-xl mx-auto flex items-center justify-between">
                    <RFESmallLogo />
                    <button onClick={() => setView('marketing')} className="text-slate-400 hover:text-slate-900 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4"/> Back
                    </button>
                </div>
            </header>

            <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
                <div className="max-w-3xl w-full bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-200 animate-in slide-in-from-right duration-300 my-8">
                    
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 bg-brand/10 text-brand px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                            Beta Application
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-4">The State of Spray Foam Operations</h2>
                        <p className="text-slate-600 text-lg leading-relaxed">
                            We are building the first "Foam-First" operating system designed to replace generic CRMs and spreadsheets. We want to build what YOU actually need—not what software guys think you need.
                        </p>
                    </div>

                    <form onSubmit={handleSignupSubmit} className="space-y-12">
                        
                        {/* Section 0: Basic Info */}
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Users className="w-4 h-4" /> Contact Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Full Name</label>
                                    <input 
                                        required type="text" placeholder="John Doe"
                                        className="w-full p-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-brand outline-none"
                                        value={contactData.name} onChange={e => setContactData({...contactData, name: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Email</label>
                                    <input 
                                        required type="email" placeholder="john@example.com"
                                        className="w-full p-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-brand outline-none"
                                        value={contactData.email} onChange={e => setContactData({...contactData, email: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Phone</label>
                                    <input 
                                        required type="tel" placeholder="(555) 123-4567"
                                        className="w-full p-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-brand outline-none"
                                        value={contactData.phone} onChange={e => setContactData({...contactData, phone: e.target.value})}
                                    />
                                </div>
                            </div>

                            {/* Skip Survey Button */}
                            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                                <button 
                                    type="button"
                                    onClick={handleSkipSurvey}
                                    className="text-[10px] font-bold text-slate-400 hover:text-brand uppercase tracking-widest flex items-center gap-1 transition-colors"
                                >
                                    Skip Survey & Submit <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>
                        </div>

                        {/* Section 1: Who Are You */}
                        <div>
                            <h3 className="text-lg font-black text-slate-900 border-b-2 border-slate-100 pb-2 mb-6">1. Operation Profile</h3>
                            
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-slate-800 mb-3">1. Which best describes your current operation?</label>
                                <div className="space-y-2">
                                    {['Solo Owner-Operator (I spray and run the business)', 'Small Crew (1-2 Rigs, I spray occasionally)', 'Growing Business (3-5 Rigs, I manage from the office)', 'Large Commercial (5+ Rigs)'].map(opt => (
                                        <label key={opt} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                                            <input type="radio" name="q1" value={opt} checked={surveyData.q1_operationType === opt} onChange={e => setSurveyData({...surveyData, q1_operationType: e.target.value})} className="w-5 h-5 text-brand focus:ring-brand" />
                                            <span className="text-sm font-medium text-slate-700">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-800 mb-3">2. What represents your biggest headache right now? <span className="text-brand text-xs uppercase tracking-wider">(Select Max 2)</span></label>
                                <div className="space-y-2">
                                    {[
                                        'Bidding Speed/Accuracy: I spend too much time calculating board feet and yield.',
                                        'Equipment Downtime: Broken guns/pumps are killing my schedule.',
                                        'Inventory Mystery: I don’t know how much chemical is actually on the trucks.',
                                        'The "App Shuffle": I use 3+ different apps to run one job (e.g. one for bids, one for scheduling).'
                                    ].map(opt => (
                                        <label key={opt} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${surveyData.q2_headaches.includes(opt) ? 'bg-red-50 border-red-200' : 'border-slate-200 hover:bg-slate-50'}`}>
                                            <input type="checkbox" checked={surveyData.q2_headaches.includes(opt)} onChange={() => toggleMultiSelect('q2_headaches', opt, 2)} className="w-5 h-5 mt-0.5 text-brand rounded focus:ring-brand" />
                                            <span className="text-sm font-medium text-slate-700">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Tech Stack */}
                        <div>
                            <h3 className="text-lg font-black text-slate-900 border-b-2 border-slate-100 pb-2 mb-6">2. Current Tech Stack</h3>
                            
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-slate-800 mb-3">3. How do you currently create estimates?</label>
                                <div className="space-y-2">
                                    {['Pen & Paper / Calculator', 'Excel / Google Sheets', 'Generic CRM (Jobber, Housecall Pro, etc.)', 'Specialized App (Foambid, JobPro)'].map(opt => (
                                        <label key={opt} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                                            <input type="radio" name="q3" value={opt} checked={surveyData.q3_estimateMethod === opt} onChange={e => setSurveyData({...surveyData, q3_estimateMethod: e.target.value})} className="w-5 h-5 text-brand focus:ring-brand" />
                                            <span className="text-sm font-medium text-slate-700">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-800 mb-3">4. If you use a software tool currently, what is the #1 thing you HATE about it?</label>
                                <div className="space-y-2">
                                    {[
                                        'It doesn’t calculate "Yield" or "Board Feet" correctly (it only does Square Feet).',
                                        'It requires an internet connection (doesn\'t work offline in metal buildings/basements).',
                                        'It only works on iPhone/iPad (No Android/Web version).',
                                        'It’s too expensive ($200+/month).',
                                        'It doesn’t track my chemical inventory/drum sets.',
                                        'N/A - I don\'t use software.'
                                    ].map(opt => (
                                        <label key={opt} className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                                            <input type="radio" name="q4" value={opt} checked={surveyData.q4_softwareHate === opt} onChange={e => setSurveyData({...surveyData, q4_softwareHate: e.target.value})} className="w-5 h-5 mt-0.5 text-brand focus:ring-brand" />
                                            <span className="text-sm font-medium text-slate-700">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Operational Pain Points */}
                        <div>
                            <h3 className="text-lg font-black text-slate-900 border-b-2 border-slate-100 pb-2 mb-6">3. Operational Issues</h3>
                            
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-slate-800 mb-3">5. How often do you underestimate the amount of chemical needed for a job (Yield Loss)?</label>
                                <div className="space-y-2">
                                    {['Rarely (I have it dialed in).', 'Occasionally (On complex roof lines or cold days).', 'Frequently (I often run short and eat the cost of the extra set).'].map(opt => (
                                        <label key={opt} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                                            <input type="radio" name="q5" value={opt} checked={surveyData.q5_yieldLoss === opt} onChange={e => setSurveyData({...surveyData, q5_yieldLoss: e.target.value})} className="w-5 h-5 text-brand focus:ring-brand" />
                                            <span className="text-sm font-medium text-slate-700">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-bold text-slate-800 mb-3">6. When estimating, do you currently adjust your price based on substrate temperature or lift thickness?</label>
                                <div className="space-y-2">
                                    {['No, I use a flat price per sq/ft.', 'Yes, but I do the math manually in my head.', 'Yes, my software handles this automatically.'].map(opt => (
                                        <label key={opt} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                                            <input type="radio" name="q6" value={opt} checked={surveyData.q6_dynamicPricing === opt} onChange={e => setSurveyData({...surveyData, q6_dynamicPricing: e.target.value})} className="w-5 h-5 text-brand focus:ring-brand" />
                                            <span className="text-sm font-medium text-slate-700">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-800 mb-3">7. How much does a "Gun Down" day cost you in lost labor/revenue?</label>
                                <div className="space-y-2">
                                    {['< $500', '$500 - $1,500', '$2,000+ (Catastrophic)'].map(opt => (
                                        <label key={opt} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                                            <input type="radio" name="q7" value={opt} checked={surveyData.q7_gunDownCost === opt} onChange={e => setSurveyData({...surveyData, q7_gunDownCost: e.target.value})} className="w-5 h-5 text-brand focus:ring-brand" />
                                            <span className="text-sm font-medium text-slate-700">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Section 4: Dream Features */}
                        <div>
                            <h3 className="text-lg font-black text-slate-900 border-b-2 border-slate-100 pb-2 mb-6">4. Dream Features</h3>
                            
                            <label className="block text-sm font-bold text-slate-800 mb-3">8. If you could wave a magic wand, which features would you demand in a new app? <span className="text-brand text-xs uppercase tracking-wider">(Rank Top 3)</span></label>
                            <div className="space-y-2">
                                {[
                                    'Smart Estimator: Auto-calculates Board Feet & Yield based on foam density/temp.',
                                    'Inventory Hawk: Tracks A-Side/B-Side drum sets by serial number & stroke count.',
                                    'Any Device Access: Works seamlessly on Android, iPhone, and Desktop PC.',
                                    'Offline Mode: Fully functional when there is no cell service.',
                                    'Crew Management: GPS tracking and digital work orders for installers.',
                                    'Equipment Sync: Logs maintenance/rebuild history for guns and pumps.'
                                ].map(opt => (
                                    <label key={opt} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${surveyData.q8_dreamFeatures.includes(opt) ? 'bg-red-50 border-red-200' : 'border-slate-200 hover:bg-slate-50'}`}>
                                        <input type="checkbox" checked={surveyData.q8_dreamFeatures.includes(opt)} onChange={() => toggleMultiSelect('q8_dreamFeatures', opt, 3)} className="w-5 h-5 mt-0.5 text-brand rounded focus:ring-brand" />
                                        <span className="text-sm font-medium text-slate-700">{opt}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Section 5: Pricing */}
                        <div>
                            <h3 className="text-lg font-black text-slate-900 border-b-2 border-slate-100 pb-2 mb-6">5. Pricing</h3>
                            
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-slate-800 mb-3">9. Most "Foam-Specific" software costs $300-$500/month. If an app did 90% of what they do for $99/month, would you switch?</label>
                                <div className="space-y-2">
                                    {['Yes, immediately.', 'Maybe, I\'d need to test the features first.', 'No, I prefer the enterprise features of the expensive tools.'].map(opt => (
                                        <label key={opt} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                                            <input type="radio" name="q9" value={opt} checked={surveyData.q9_pricingSwitch === opt} onChange={e => setSurveyData({...surveyData, q9_pricingSwitch: e.target.value})} className="w-5 h-5 text-brand focus:ring-brand" />
                                            <span className="text-sm font-medium text-slate-700">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-800 mb-3">10. Would you be interested in a "Free Tier" that allows you to do unlimited estimates but limits other features?</label>
                                <div className="space-y-2">
                                    {['Yes, that would get me to try it.', 'No, I’d rather pay for full features immediately.'].map(opt => (
                                        <label key={opt} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                                            <input type="radio" name="q10" value={opt} checked={surveyData.q10_freeTier === opt} onChange={e => setSurveyData({...surveyData, q10_freeTier: e.target.value})} className="w-5 h-5 text-brand focus:ring-brand" />
                                            <span className="text-sm font-medium text-slate-700">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-100">
                            <button 
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white p-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-3 transform hover:-translate-y-1 active:scale-95"
                            >
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin"/> : "Submit Request"}
                            </button>
                            <p className="text-center text-[10px] text-slate-400 mt-4 font-medium">
                                By submitting, you agree to join our private beta program.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      );
  }

  // --- VIEW: USER GUIDE ---
  if (view === 'guide') {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Header */}
            <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-40">
                <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
                    <RFESmallLogo />
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setView('marketing')}
                            className="text-slate-500 hover:text-slate-900 text-xs font-bold uppercase tracking-widest flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4"/> Back to Overview
                        </button>
                        <button 
                            onClick={() => setView('signup')}
                            className="bg-[#E30613] hover:bg-red-700 text-white px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2"
                        >
                            Start Free <ArrowRight className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="mb-12 text-center border-b border-slate-200 pb-12">
                    <div className="inline-flex items-center gap-2 text-brand font-bold uppercase tracking-widest text-xs mb-4 bg-red-50 px-3 py-1 rounded-full">
                        <BookOpen className="w-4 h-4" /> User Manual v3.0
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                        FoamApp Pro v3: <br/>
                        <span className="text-slate-500">Professional User Guide</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Welcome to FoamApp Pro v3, the definitive management solution for professional insulation contractors. This guide provides a step-by-step walkthrough of the platform.
                    </p>
                </div>

                <div className="space-y-16">
                    {/* Section 1: Getting Started */}
                    <section>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-lg shadow-lg">1</div>
                            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Getting Started</h2>
                        </div>
                        
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <Smartphone className="w-5 h-5 text-brand" /> Installation
                                </h3>
                                <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                                    FoamApp Pro is built as a Progressive Web App (PWA). This means you can install it directly onto your device without using an app store, providing offline capabilities and faster access.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <strong className="block text-xs uppercase tracking-widest text-slate-900 mb-2">Mobile (iOS)</strong>
                                        <p className="text-xs text-slate-500">Open in Safari, tap the Share icon, and select <span className="font-bold text-slate-700">Add to Home Screen</span>.</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <strong className="block text-xs uppercase tracking-widest text-slate-900 mb-2">Mobile (Android)</strong>
                                        <p className="text-xs text-slate-500">Open in Chrome, tap the three-dot menu, and select <span className="font-bold text-slate-700">Install App</span>.</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <strong className="block text-xs uppercase tracking-widest text-slate-900 mb-2">Desktop</strong>
                                        <p className="text-xs text-slate-500">Click the Install icon (monitor with arrow) located on the right side of the address bar.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-slate-100 pt-8">
                                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <Users className="w-5 h-5 text-brand" /> User Roles & Access
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2">Admin Dashboard</h4>
                                        <p className="text-xs text-slate-500 leading-relaxed mb-3">High-level control over estimates, inventory management, detailed financials, and company-wide settings.</p>
                                        <div className="bg-slate-50 px-3 py-2 rounded border border-slate-200 text-xs font-mono text-slate-600">
                                            Login: Registered Username & Password
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2">Crew Dashboard</h4>
                                        <p className="text-xs text-slate-500 leading-relaxed mb-3">A simplified, mobile-optimized interface for field teams to view schedules, navigate to jobs, and log material usage.</p>
                                        <div className="bg-slate-50 px-3 py-2 rounded border border-slate-200 text-xs font-mono text-slate-600">
                                            Login: Company ID + 4-digit Crew PIN
                                        </div>
                                    </div>
                                </div>
                                <p className="mt-4 text-[10px] text-slate-400 italic">* The Crew PIN is generated and managed within the Admin Settings.</p>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Admin Workflow */}
                    <section>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-lg shadow-lg">2</div>
                            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Admin Workflow</h2>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <LayoutDashboard className="w-5 h-5 text-brand" /> Dashboard Overview
                                </h3>
                                <ul className="space-y-3 text-sm text-slate-600">
                                    <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-brand mt-2 flex-shrink-0"></span><span><strong>Active Jobs:</strong> Track the lifecycle of projects from Draft to Work Order to Invoiced.</span></li>
                                    <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-brand mt-2 flex-shrink-0"></span><span><strong>Financial Summary:</strong> A high-level view of revenue, expenses, and net profit for the current period.</span></li>
                                    <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-brand mt-2 flex-shrink-0"></span><span><strong>Inventory Status:</strong> Automated alerts for low-stock items in the warehouse.</span></li>
                                </ul>
                            </div>

                            <div className="border-t border-slate-100 pt-8">
                                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <Radio className="w-5 h-5 text-brand animate-pulse" /> The RFE Closed-Loop Workflow
                                </h3>
                                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                                    This is the most critical feature of FoamApp Pro. We connect the office to the spray rig in real-time.
                                </p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="relative pl-6 border-l-2 border-brand space-y-6">
                                        <div className="relative">
                                            <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-brand border-4 border-white shadow-sm"></div>
                                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-1">1. Deployment</h4>
                                            <p className="text-xs text-slate-500 leading-relaxed">
                                                When you mark an estimate as <strong>Sold / Work Order</strong>, it <strong className="text-slate-800">automatically displays</strong> on the Crew Dashboard located in the spray rig. No paper, no texts.
                                            </p>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-brand border-4 border-white shadow-sm"></div>
                                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-1">2. Live Status</h4>
                                            <p className="text-xs text-slate-500 leading-relaxed">
                                                When the crew hits <strong>Start Job</strong> on the rig console, your admin dashboard instantly updates to show the job is <strong>In Progress</strong>.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="relative pl-6 border-l-2 border-slate-200 space-y-6">
                                        <div className="relative">
                                            <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-slate-300 border-4 border-white shadow-sm"></div>
                                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-1">3. Completion Report</h4>
                                            <p className="text-xs text-slate-500 leading-relaxed">
                                                The crew submits the actual material used. The system <strong className="text-slate-800">automatically updates your inventory</strong> based on what was sprayed.
                                            </p>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-slate-300 border-4 border-white shadow-sm"></div>
                                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-1">4. Review Needed</h4>
                                            <p className="text-xs text-slate-500 leading-relaxed">
                                                The job appears on your dashboard as <strong>Review Needed</strong>. You verify the numbers and generate the invoice in one click.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Crew Workflow */}
                    <section>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-lg shadow-lg">3</div>
                            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Crew Workflow (In-Rig)</h2>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-2">Time Tracking & Execution</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                        Field personnel tap <strong>Start Job</strong> to begin accurate labor-hour tracking. They can view site address, contact info, and spray depths directly on the mounted touch screen inside the rig.
                                    </p>
                                    <div className="bg-slate-100 p-3 rounded-lg text-xs font-mono text-slate-600 inline-block">
                                        Tap address -> Launch Maps Navigation
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-2">Completion & Actuals</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                        Once finished, the crew taps <strong>Complete Job</strong>. This is the trigger that updates office inventory. They log:
                                    </p>
                                    <ul className="text-sm text-slate-600 list-disc pl-4 space-y-1">
                                        <li>Exact chemical sets (A & B) consumed.</li>
                                        <li>Inventory items (poly, tape) used.</li>
                                        <li>Upload "Before" & "After" photos.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="mt-20 pt-10 border-t border-slate-200 text-center">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">Ready to begin?</h3>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <button 
                            onClick={() => setView('signup')}
                            className="bg-[#E30613] hover:bg-red-700 text-white py-5 px-12 rounded-2xl font-black uppercase text-sm tracking-widest transition-all shadow-xl shadow-red-200 hover:shadow-red-300 transform hover:-translate-y-1 flex items-center gap-3"
                        >
                            Access Platform <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                    <p className="text-xs text-slate-400 mt-6 font-medium">
                        © {new Date().getFullYear()} RFE Foam Equipment. Beta Version 3.0
                    </p>
                </div>
            </div>
        </div>
    );
  }

  // --- VIEW: MARKETING HOME (DEFAULT) ---
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        
        {/* Sticky Header */}
        <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <RFESmallLogo />
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setView('guide')}
                        className="hidden md:flex text-slate-500 hover:text-slate-900 text-xs font-bold uppercase tracking-widest items-center gap-2"
                    >
                        User Manual
                    </button>
                    {onEnterApp && (
                        <button 
                            onClick={onEnterApp}
                            className="text-slate-500 hover:text-brand px-3 py-2 text-xs font-bold uppercase tracking-widest transition-colors hidden md:flex items-center gap-2"
                        >
                            <PlayCircle className="w-4 h-4" /> Live Demo
                        </button>
                    )}
                    <button 
                        onClick={() => setView('signup')}
                        className="bg-[#E30613] hover:bg-red-700 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-red-200 transform hover:-translate-y-0.5 active:scale-95"
                    >
                        Start for Free
                    </button>
                </div>
            </div>
        </header>

        {/* HERO SECTION */}
        <div className="bg-slate-900 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/20 rounded-full blur-[120px] pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>
            <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 relative z-10 text-center">
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-1.5 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">Beta v3.0 Available Now</span>
                </div>
                <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-tight mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    Precision Estimating & <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Perpetual Inventory Control.</span>
                </h1>
                <p className="text-lg md:text-2xl text-slate-400 font-medium max-w-3xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    The only operating system that connects estimation directly to your **Rig Command Console**. <br className="hidden md:block"/>
                    Real-time inventory updates, multi-user crew dispatch, and equipment integration.
                </p>
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                    <button 
                        onClick={() => setView('signup')}
                        className="w-full md:w-auto bg-[#E30613] hover:bg-red-600 text-white px-8 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-red-900/50 transition-all transform hover:-translate-y-1"
                    >
                        Start for Free
                    </button>
                    <button 
                        onClick={() => setView('guide')}
                        className="w-full md:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-5 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                    >
                        <BookOpen className="w-4 h-4"/> Read the Manual
                    </button>
                </div>
                <p className="mt-6 text-xs text-slate-500 uppercase tracking-widest font-bold">No Credit Card Required • Works on Any Device</p>
            </div>
        </div>

        {/* FEATURE HIGHLIGHT: The Rig-Sync Loop */}
        <div className="py-24 bg-white border-b border-slate-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand via-purple-600 to-brand opacity-20"></div>
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-brand font-black uppercase tracking-widest text-xs mb-2 block">Our Signature Feature</span>
                    <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight mb-4">From Office to Rig in Real-Time</h2>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                        Stop chasing paper tickets. The entire workflow is digitized and synchronized between your office computer and the **Integrated Rig Console**—a mounted touch screen wired directly to your equipment.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                    {/* Connecting Line (Desktop Only) */}
                    <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-100 z-0"></div>

                    {/* Step 1 */}
                    <div className="relative z-10 flex flex-col items-center text-center group">
                        <div className="w-24 h-24 bg-white border-4 border-slate-100 rounded-full flex items-center justify-center mb-6 shadow-xl group-hover:border-brand transition-colors">
                            <Monitor className="w-10 h-10 text-slate-400 group-hover:text-brand transition-colors" />
                        </div>
                        <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm mb-2">1. Admin Deploys</h3>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed px-4">
                            You mark an estimate as "Sold". It instantly pushes to the **mounted touch display** as a digital Work Order.
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="relative z-10 flex flex-col items-center text-center group">
                        <div className="w-24 h-24 bg-white border-4 border-slate-100 rounded-full flex items-center justify-center mb-6 shadow-xl group-hover:border-brand transition-colors">
                            <Truck className="w-10 h-10 text-slate-400 group-hover:text-brand transition-colors" />
                        </div>
                        <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm mb-2">2. Rig Starts Job</h3>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed px-4">
                            Crew hits "Start" on the console. Your admin dashboard updates to "In Progress" with live GPS timestamp.
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="relative z-10 flex flex-col items-center text-center group">
                        <div className="w-24 h-24 bg-white border-4 border-slate-100 rounded-full flex items-center justify-center mb-6 shadow-xl group-hover:border-brand transition-colors">
                            <RefreshCw className="w-10 h-10 text-slate-400 group-hover:text-brand transition-colors" />
                        </div>
                        <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm mb-2">3. Auto-Inventory</h3>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed px-4">
                            Crew submits actual usage. The system automatically deducts material from your warehouse stock.
                        </p>
                    </div>

                    {/* Step 4 */}
                    <div className="relative z-10 flex flex-col items-center text-center group">
                        <div className="w-24 h-24 bg-white border-4 border-slate-100 rounded-full flex items-center justify-center mb-6 shadow-xl group-hover:border-brand transition-colors">
                            <CheckCircle2 className="w-10 h-10 text-slate-400 group-hover:text-brand transition-colors" />
                        </div>
                        <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm mb-2">4. Ready to Invoice</h3>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed px-4">
                            Job marked "Review Needed". Admin approves stats and generates the final invoice instantly.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* THE PROBLEM SECTION */}
        <div className="py-24 bg-slate-50 border-b border-slate-200">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-4">Eliminate Data Fragmentation</h2>
                    <p className="text-slate-600 text-lg leading-relaxed">
                        Disconnecting estimation from inventory leads to variance and loss. Eliminate manual data entry between your estimation software, physical warehouse, and financial tools.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Smartphone className="w-32 h-32"/></div>
                        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6">
                            <Monitor className="w-6 h-6"/>
                        </div>
                        <h3 className="text-lg font-black text-slate-900 mb-2">Universal Field Access</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            Cross-Platform Access. Deploy work orders directly to the **hardwired Rig Interface**, Desktop, or Mobile—without hardware restrictions or single-user lockouts.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Box className="w-32 h-32"/></div>
                        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6">
                            <Wrench className="w-6 h-6"/>
                        </div>
                        <h3 className="text-lg font-black text-slate-900 mb-2">Hardware-Integrated Inventory</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            Stop guessing with "Theoretical Yield". RFE Foam Pro integrates with equipment maintenance schedules to track actual material consumption and remaining barrel levels.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Users className="w-32 h-32"/></div>
                        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6">
                            <Users className="w-6 h-6"/>
                        </div>
                        <h3 className="text-lg font-black text-slate-900 mb-2">Crew & Fleet Management</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            Unified Crew Portal. Push digital work orders directly to field teams. Track labor hours, site conditions, and daily completion reports in real-time.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* COMPARISON TABLE */}
        <div className="py-24 bg-white">
            <div className="max-w-5xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Real Business vs. Just Math</h2>
                    <p className="text-slate-500 font-medium mt-2">See why professional contractors are switching to RFE.</p>
                </div>

                <div className="border border-slate-200 rounded-3xl overflow-hidden shadow-xl">
                    <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-200 p-6">
                        <div className="col-span-1 font-black text-slate-400 uppercase tracking-widest text-xs flex items-center">Feature</div>
                        <div className="col-span-1 text-center font-black text-slate-500 uppercase tracking-widest text-xs">Standard Calculators</div>
                        <div className="col-span-1 text-center font-black text-brand uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                            RFE Foam Pro <span className="bg-brand text-white px-2 py-0.5 rounded text-[9px]">BETA</span>
                        </div>
                    </div>
                    
                    {[
                        { label: 'Platform', bad: 'Single OS Locked', good: 'Web, Android, iOS, PC', icon: Globe },
                        { label: 'Inventory', bad: 'Theoretical Estimation', good: 'Perpetual Inventory Tracking', icon: Box },
                        { label: 'CRM', bad: 'None', good: 'Built-in Customer DB', icon: Users },
                        { label: 'Team Access', bad: 'Single User ID', good: 'Multi-User / Role Based', icon: Lock },
                        { label: 'Invoicing', bad: 'Export PDF Only', good: 'Generate & Track Payments', icon: FileText },
                        { label: 'Cost', bad: 'Paid Only', good: 'Free Tier Available', icon: DollarSign },
                    ].map((row, i) => (
                        <div key={i} className="grid grid-cols-3 p-6 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                            <div className="col-span-1 font-bold text-slate-900 flex items-center gap-3 text-sm">
                                <row.icon className="w-4 h-4 text-slate-400" /> {row.label}
                            </div>
                            <div className="col-span-1 text-center text-slate-500 text-sm font-medium flex items-center justify-center gap-2">
                                {row.bad}
                            </div>
                            <div className="col-span-1 text-center font-bold text-slate-900 text-sm flex items-center justify-center gap-2 bg-red-50/50 -my-6 py-6 border-x border-red-50">
                                <CheckCircle2 className="w-4 h-4 text-brand" /> {row.good}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* ECOSYSTEM BONUS */}
        <div className="py-24 bg-slate-900 text-white relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1">
                    <div className="inline-flex items-center gap-2 bg-brand/20 text-brand-yellow border border-brand/20 rounded-full px-4 py-1.5 mb-6">
                        <Wrench className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">RFE Ecosystem</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-6">Integrated Equipment Intelligence</h2>
                    <p className="text-slate-400 text-lg leading-relaxed mb-8">
                        We are the only software provider that also manufactures the equipment you use. 
                        Link your <strong>RFE Gun Service</strong> subscription to the app to automate maintenance logging and adjust inventory based on actual machine throughput.
                        <br/><br/>
                        It's the only software that keeps your equipment running.
                    </p>
                    <button onClick={() => setView('signup')} className="bg-white text-slate-900 hover:bg-slate-200 px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest transition-colors">
                        Link Your Equipment
                    </button>
                </div>
                <div className="flex-1 flex justify-center">
                    <div className="w-64 h-64 bg-gradient-to-tr from-brand to-slate-800 rounded-[3rem] rotate-3 flex items-center justify-center shadow-2xl shadow-black/50 border-4 border-white/10">
                        <div className="text-center">
                            <span className="block text-7xl font-black text-white">FREE</span>
                            <span className="block text-xs font-black uppercase tracking-[0.3em] text-white/50 mt-2">With Gun Sub</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* FINAL CTA */}
        <div className="py-24 bg-white text-center">
            <div className="max-w-3xl mx-auto px-6">
                <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight mb-6">Start Scaling Today</h2>
                <p className="text-lg text-slate-600 mb-10">
                    Send 10 professional bids this month for <span className="font-bold text-slate-900">$0</span>. No credit card required.
                </p>
                <button 
                    onClick={() => setView('signup')}
                    className="bg-[#E30613] hover:bg-red-700 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-red-200 transform hover:-translate-y-1 transition-all"
                >
                    Create Free Account
                </button>
            </div>
        </div>

        {/* Footer */}
        <footer className="bg-slate-50 border-t border-slate-200 py-12 text-center">
            <RFESmallLogo />
            <p className="text-xs text-slate-400 mt-6 font-medium">
                © {new Date().getFullYear()} RFE Foam Equipment. All rights reserved.
            </p>
        </footer>
    </div>
  );
};
