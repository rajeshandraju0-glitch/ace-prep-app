
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Loader2 } from 'lucide-react';

const Login: React.FC = () => {
  const { loginWithGoogle, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if(email && password) {
        // Reuse the login logic for simulation
        loginWithGoogle();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex justify-center mb-4">
             <div className="p-4 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">
                <BookOpen className="text-white" size={40} />
             </div>
        </div>
        <h1 className="text-3xl font-bold text-slate-900">AcePrep.ai</h1>
        <p className="text-slate-500 mt-2">Your AI-Powered Exam Companion for OPSC, OSSC, UPSC & Banking.</p>
      </div>

      <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 animate-in zoom-in-95 duration-500">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Welcome Back</h2>
        
        <div className="space-y-4">
           <button 
             onClick={loginWithGoogle}
             disabled={isLoading}
             className="w-full flex items-center justify-center gap-3 px-6 py-4 border border-slate-300 rounded-xl hover:bg-slate-50 transition-all font-medium text-slate-700 disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
           >
             {isLoading ? (
                 <Loader2 className="animate-spin text-slate-400" />
             ) : (
                 <>
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                    <span>Continue with Google</span>
                 </>
             )}
           </button>
           
           <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-400">or</span>
              </div>
           </div>

           <form className="space-y-4" onSubmit={handleEmailLogin}>
               <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                   <input 
                     type="email" 
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     placeholder="student@example.com" 
                     className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                     required
                   />
               </div>
               <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                   <input 
                     type="password" 
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     placeholder="••••••••" 
                     className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-colors" 
                     required
                   />
               </div>
               <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-lg shadow-slate-900/20"
               >
                   {isLoading ? <Loader2 className="animate-spin mx-auto" /> : "Sign In"}
               </button>
           </form>
           
           <p className="text-xs text-center text-slate-400 mt-4">
               By continuing, you agree to our Terms of Service and Privacy Policy.
           </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
