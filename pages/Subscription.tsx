
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Check, Loader2, Star, ShieldCheck, Zap, CreditCard, Smartphone } from 'lucide-react';

const Subscription: React.FC = () => {
  const { user, upgradeToPro } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'UPI'>('UPI');

  const handleSubscribe = () => {
    setShowPaymentModal(true);
  };

  const handlePayment = async () => {
    setProcessing(true);
    // Mock Payment Delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    upgradeToPro();
    setProcessing(false);
    setShowPaymentModal(false);
  };

  if (user?.isPro) {
      return (
          <div className="max-w-4xl mx-auto py-12 text-center animate-in zoom-in-95">
              <div className="inline-block p-6 rounded-full bg-indigo-100 text-indigo-600 mb-6">
                  <Star size={48} className="fill-current" />
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-4">You are a Pro Member!</h1>
              <p className="text-xl text-slate-600 mb-8">Thank you for subscribing. Enjoy unlimited access to all AI features.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-3xl mx-auto">
                   <div className="p-4 bg-white border border-indigo-100 rounded-xl shadow-sm">
                       <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-2"><Zap size={18} className="text-indigo-500"/> Unlimited AI</h3>
                       <p className="text-sm text-slate-500">Generate unlimited quizzes and study plans.</p>
                   </div>
                   <div className="p-4 bg-white border border-indigo-100 rounded-xl shadow-sm">
                       <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-2"><ShieldCheck size={18} className="text-indigo-500"/> Premium Content</h3>
                       <p className="text-sm text-slate-500">Access exclusive mock tests for OSSC & UPSC.</p>
                   </div>
                   <div className="p-4 bg-white border border-indigo-100 rounded-xl shadow-sm">
                       <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-2"><Star size={18} className="text-indigo-500"/> Priority Support</h3>
                       <p className="text-sm text-slate-500">Get your doubts resolved faster.</p>
                   </div>
              </div>
          </div>
      );
  }

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl font-bold text-slate-900">Upgrade Your Preparation</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Unlock the full power of AcePrep AI. specialized specifically for serious aspirants of OSSC, UPSC, and Banking exams.
          </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Free</h2>
              <p className="text-slate-500 mb-6">Basic access for beginners.</p>
              <div className="text-4xl font-bold text-slate-900 mb-6">₹0<span className="text-lg font-medium text-slate-400">/mo</span></div>
              
              <ul className="space-y-4 mb-8 flex-1">
                  {['Daily Current Affairs', 'Limited Quiz Generation (5/day)', 'Access to Basic PYQs', 'Community Support'].map((feat, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-600">
                          <Check size={20} className="text-green-500 shrink-0" /> {feat}
                      </li>
                  ))}
              </ul>
              
              <button className="w-full py-4 bg-slate-100 text-slate-500 font-bold rounded-xl cursor-not-allowed">
                  Current Plan
              </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden flex flex-col transform md:-translate-y-4">
              <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">POPULAR</div>
              <h2 className="text-2xl font-bold text-white mb-2">Pro Aspirant</h2>
              <p className="text-slate-400 mb-6">For dedicated OPSC/UPSC prep.</p>
              <div className="text-4xl font-bold text-white mb-6">₹499<span className="text-lg font-medium text-slate-500">/mo</span></div>
              
              <ul className="space-y-4 mb-8 flex-1">
                  {[
                      'Unlimited AI Quiz Generation', 
                      'Personalized AI Study Plans', 
                      'Full PYQ Database Access (10 Years)', 
                      'Test Mode with Detailed Analysis',
                      'Exclusive OSSC & UPSC Pattern Tests'
                   ].map((feat, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-200">
                          <div className="p-1 bg-indigo-500/20 rounded-full"><Check size={14} className="text-indigo-400 shrink-0" /></div> {feat}
                      </li>
                  ))}
              </ul>
              
              <button 
                onClick={handleSubscribe}
                className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-900/50"
              >
                  Upgrade Now
              </button>
          </div>
      </div>

      {/* Mock Payment Modal */}
      {showPaymentModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in zoom-in-95">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Secure Payment</h3>
                  
                  <div className="space-y-4 mb-6">
                      <div className="p-4 border border-indigo-100 bg-indigo-50 rounded-xl flex justify-between items-center">
                          <div>
                              <p className="font-bold text-indigo-900">Pro Aspirant Plan</p>
                              <p className="text-xs text-indigo-700">Monthly Subscription</p>
                          </div>
                          <p className="font-bold text-indigo-700">₹499.00</p>
                      </div>

                      <div className="flex gap-2 p-1 bg-slate-100 rounded-xl mb-4">
                          <button 
                            onClick={() => setPaymentMethod('UPI')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${paymentMethod === 'UPI' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                          >
                              <Smartphone size={16} /> UPI
                          </button>
                          <button 
                            onClick={() => setPaymentMethod('CARD')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${paymentMethod === 'CARD' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                          >
                              <CreditCard size={16} /> Card
                          </button>
                      </div>

                      {paymentMethod === 'UPI' && (
                          <div className="animate-in fade-in slide-in-from-right-4">
                               <label className="block text-xs font-bold text-slate-500 uppercase mb-1">UPI ID</label>
                               <input type="text" placeholder="username@upi" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-mono" />
                               <p className="text-xs text-slate-400 mt-2">Compatible with GPay, PhonePe, Paytm</p>
                          </div>
                      )}

                      {paymentMethod === 'CARD' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-left-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Card Number</label>
                                <input type="text" placeholder="4242 4242 4242 4242" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-mono" />
                            </div>
                            
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Expiry</label>
                                    <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-mono" />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CVC</label>
                                    <input type="text" placeholder="123" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-mono" />
                                </div>
                            </div>
                        </div>
                      )}
                  </div>

                  <div className="flex gap-3">
                      <button 
                        onClick={() => setShowPaymentModal(false)}
                        className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                      >
                          Cancel
                      </button>
                      <button 
                        onClick={handlePayment}
                        disabled={processing}
                        className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors flex justify-center items-center gap-2"
                      >
                          {processing ? <Loader2 className="animate-spin" /> : 'Pay ₹499'}
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Subscription;
