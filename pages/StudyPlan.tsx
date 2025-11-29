
import React, { useState } from 'react';
import { generateStudyPlan } from '../services/geminiService';
import { StudyPlan as StudyPlanType } from '../types';
import { LoadingSpinner } from '../components/Loading';
import { CalendarRange, Clock, GraduationCap, CheckCircle2, Play, BookOpen, Bell, BellRing } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const StudyPlan: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    exam: 'OPSC Civil Services',
    level: 'Beginner',
    hours: 2
  });
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<StudyPlanType | null>(null);
  const [remindersSet, setRemindersSet] = useState<Set<string>>(new Set());

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateStudyPlan(formData.exam, formData.level, formData.hours);
      setPlan(result);
      setRemindersSet(new Set()); // Reset reminders for new plan
    } catch (e) {
      alert("Failed to generate plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSetReminder = async (day: string, topic: string) => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notifications");
      return;
    }

    if (Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;
    }

    // Set reminder
    new Notification(`Study Reminder: ${day}`, {
      body: `It's time to focus on: ${topic}. Good luck!`,
      icon: '/favicon.ico'
    });

    const newSet = new Set(remindersSet);
    newSet.add(`${day}-${topic}`);
    setRemindersSet(newSet);
    
    // In a real app, this would schedule a service worker or backend job
    alert(`Reminder set for ${topic}! (Simulated push notification sent now for demo)`);
  };

  if (!user?.isPro && !plan && !loading) {
      // Simple upsell or limit
      // For now we allow generation but maybe could limit quantity in future
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Personalized Study Plan</h1>
        <p className="text-slate-500">Tailored schedules for your target exam and availability.</p>
      </div>

      {!plan && !loading && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
          {!user?.isPro && (
             <div className="mb-6 p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between">
                 <div className="text-sm text-indigo-800">
                     <span className="font-bold">Pro Tip:</span> Pro members get more detailed AI plans with resource links.
                 </div>
                 <Link to="/subscription" className="text-xs font-bold bg-white text-indigo-600 px-3 py-1.5 rounded-lg shadow-sm">
                     Upgrade
                 </Link>
             </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Target Exam</label>
              <select 
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.exam}
                onChange={e => setFormData({...formData, exam: e.target.value})}
              >
                <option value="OPSC Civil Services">OPSC Civil Services</option>
                <option value="OSSSC Combined Recruitment">OSSSC Combined</option>
                <option value="Odisha Police SI">Odisha Police SI</option>
                <option value="OSSC CGL">OSSC CGL</option>
                <option value="UPSC">UPSC</option>
                <option value="Banking (IBPS/SBI)">Banking (IBPS/SBI)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Current Level</label>
              <select 
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.level}
                onChange={e => setFormData({...formData, level: e.target.value})}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced (Revision)</option>
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">Daily Study Hours: {formData.hours}</label>
              <input 
                type="range" 
                min="1" 
                max="12" 
                step="0.5"
                value={formData.hours}
                onChange={e => setFormData({...formData, hours: parseFloat(e.target.value)})}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-slate-400 font-medium px-1">
                <span>1 hr</span>
                <span>6 hrs</span>
                <span>12 hrs</span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
          >
            <Play size={20} className="fill-current" /> Generate Plan
          </button>
        </div>
      )}

      {loading && (
         <div className="py-20 text-center bg-white rounded-3xl border border-slate-200">
           <LoadingSpinner text="Crafting your personalized strategy..." />
         </div>
      )}

      {plan && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="bg-indigo-900 text-white p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
             <div>
                <h2 className="text-xl font-bold flex items-center gap-2"><GraduationCap /> Study Plan for {plan.exam}</h2>
                <p className="text-indigo-200 opacity-90 text-sm mt-1">{plan.duration} Strategy • {formData.hours} Hours/Day</p>
             </div>
             <button onClick={() => setPlan(null)} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors">
                Create New
             </button>
          </div>

          <div className="grid gap-4">
            {plan.schedule.map((day, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-md transition-shadow relative">
                <div className="flex items-center justify-between mb-4">
                   <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                     <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm">{idx + 1}</span>
                     {day.day}
                   </h3>
                   <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                     {day.focus}
                   </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2 flex items-center gap-1"><BookOpen size={14}/> Topics</h4>
                    <div className="flex flex-wrap gap-2">
                      {day.topics.map((t, i) => {
                          const key = `${day.day}-${t}`;
                          const isSet = remindersSet.has(key);
                          return (
                            <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium group">
                              <span>{t}</span>
                              <button 
                                onClick={() => handleSetReminder(day.day, t)}
                                title="Set Reminder"
                                className={`ml-1 ${isSet ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'}`}
                              >
                                {isSet ? <BellRing size={14} /> : <Bell size={14} />}
                              </button>
                            </div>
                          );
                      })}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2 flex items-center gap-1"><Clock size={14}/> Activities</h4>
                    <ul className="space-y-2">
                      {day.activities.map((act, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-600 text-sm">
                          <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />
                          {act}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyPlan;
