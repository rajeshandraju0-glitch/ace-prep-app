
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BookOpen, 
  Briefcase, 
  Newspaper, 
  Brain, 
  Menu, 
  X,
  MessageSquare,
  CalendarRange,
  LibraryBig,
  LogOut,
  Sparkles,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <BookOpen size={20} /> },
    { name: 'Study Plan', path: '/study-plan', icon: <CalendarRange size={20} /> },
    { name: 'Current Affairs', path: '/current-affairs', icon: <Newspaper size={20} /> },
    { name: 'Recruitments', path: '/recruitments', icon: <Briefcase size={20} /> },
    { name: 'Test Series', path: '/quiz', icon: <Brain size={20} /> },
    { name: 'PYQ Bank', path: '/pyq', icon: <LibraryBig size={20} /> },
    { name: 'Study AI', path: '/study-ai', icon: <MessageSquare size={20} /> },
  ];

  if (!user) {
      // Minimal layout for non-authenticated state if needed, though App.tsx handles the main switch
      return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-20">
        <h1 className="text-xl font-bold text-indigo-600 flex items-center gap-2">
          <BookOpen className="text-indigo-600" /> AcePrep.ai
        </h1>
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-slate-600">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside 
        className={`
          fixed md:sticky top-0 h-screen w-64 bg-white border-r border-slate-200 z-30 transform transition-transform duration-300 ease-in-out flex flex-col
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="p-6 border-b border-slate-100 hidden md:block">
          <h1 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
            <BookOpen className="fill-current" /> AcePrep
          </h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Odisha Exam Special</p>
        </div>

        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-medium shadow-sm ring-1 ring-indigo-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-4">
           {!user.isPro && (
               <NavLink to="/subscription" onClick={() => setSidebarOpen(false)} className="block">
                    <div className="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-xl p-4 text-white shadow-lg shadow-indigo-900/20 group cursor-pointer">
                        <div className="flex items-center gap-2 mb-1">
                            <Sparkles size={16} className="text-yellow-400" />
                            <span className="font-bold text-sm">Upgrade to Pro</span>
                        </div>
                        <p className="text-xs text-slate-300 mb-3">Unlock unlimited AI features.</p>
                        <div className="w-full py-2 bg-white/10 rounded-lg text-center text-xs font-bold group-hover:bg-white/20 transition-colors">
                            View Plans
                        </div>
                    </div>
               </NavLink>
           )}

           <div className="flex items-center gap-3 p-2">
              <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full bg-indigo-100" />
              <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                  <p className="text-xs text-slate-500 truncate">{user.isPro ? 'Pro Member' : 'Free Plan'}</p>
              </div>
              <button onClick={logout} className="text-slate-400 hover:text-red-500 transition-colors" title="Logout">
                  <LogOut size={18} />
              </button>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-64px)] md:h-screen w-full">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-20 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
