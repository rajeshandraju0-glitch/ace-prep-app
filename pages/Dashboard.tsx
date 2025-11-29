
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Target, Award, Calendar, Bell, LibraryBig } from 'lucide-react';
import { NotificationItem } from '../types';
import { fetchNotifications } from '../services/geminiService';

const Dashboard: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    // Simulate real-time fetch on mount
    fetchNotifications().then(setNotifications);
  }, []);

  const features = [
    {
      title: "Today's Current Affairs",
      desc: "Daily updates with Odisha focus.",
      icon: <Zap className="text-yellow-500" size={24} />,
      link: "/current-affairs",
      color: "bg-yellow-50 hover:bg-yellow-100"
    },
    {
      title: "Latest Recruitments",
      desc: "OPSC, OSSSC & Central notifications.",
      icon: <Target className="text-indigo-500" size={24} />,
      link: "/recruitments",
      color: "bg-indigo-50 hover:bg-indigo-100"
    },
    {
      title: "Previous Year Qs",
      desc: "Practice with past exam papers.",
      icon: <LibraryBig className="text-rose-500" size={24} />,
      link: "/pyq",
      color: "bg-rose-50 hover:bg-rose-100"
    },
    {
      title: "Test Series",
      desc: "AI-generated exam pattern tests.",
      icon: <Award className="text-emerald-500" size={24} />,
      link: "/quiz",
      color: "bg-emerald-50 hover:bg-emerald-100"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-2 flex justify-between items-end">
        <div>
            <h1 className="text-3xl font-bold text-slate-900">Welcome back!</h1>
            <p className="text-slate-500 text-lg">Your Odisha exam preparation hub.</p>
        </div>
      </header>

      {/* Real-time Notifications */}
      {notifications.length > 0 && (
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-semibold mb-2">
                  <Bell className="text-indigo-600 animate-bounce" size={18} /> 
                  <span>Latest Updates</span>
              </div>
              <div className="grid gap-2">
                  {notifications.map((n, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg text-sm text-slate-700">
                          <span className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${n.type === 'JOB' ? 'bg-blue-500' : n.type === 'ALERT' ? 'bg-red-500' : 'bg-green-500'}`} />
                          <div>
                            <p>{n.message}</p>
                            <span className="text-xs text-slate-400 block mt-1">{n.timestamp}</span>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f) => (
          <Link 
            key={f.title} 
            to={f.link}
            className={`p-6 rounded-2xl border border-transparent transition-all duration-300 ${f.color} group`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white rounded-xl shadow-sm">{f.icon}</div>
              <ArrowRight className="text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
          </Link>
        ))}
      </div>

      {/* Call to Action: Study Plan */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-900 rounded-3xl p-8 shadow-lg text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-lg">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-sm font-semibold backdrop-blur-md">
                    <Calendar size={14} /> Personalized for You
                </div>
                <h2 className="text-2xl font-bold">Need a structured path?</h2>
                <p className="text-slate-300 leading-relaxed">
                    Create a customized study plan based on your exam goals and available time. 
                    Perfect for OPSC and OSSSC aspirants.
                </p>
                <Link to="/study-plan" className="inline-block px-6 py-3 bg-white text-indigo-900 rounded-xl font-bold hover:bg-slate-100 transition-colors">
                    Generate My Plan
                </Link>
            </div>
            <div className="hidden md:block opacity-20 transform scale-150 rotate-12">
                 <Calendar size={200} />
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
