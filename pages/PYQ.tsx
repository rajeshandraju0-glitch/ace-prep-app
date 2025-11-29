
import React, { useState } from 'react';
import { fetchPYQs } from '../services/geminiService';
import { PYQItem } from '../types';
import { LoadingSpinner } from '../components/Loading';
import { LibraryBig, Eye, EyeOff, Search, ToggleLeft, ToggleRight, CheckCircle2, XCircle, Database, Sparkles } from 'lucide-react';

const PYQ: React.FC = () => {
  const [exam, setExam] = useState('OPSC OAS');
  const [subject, setSubject] = useState('General Studies');
  const [year, setYear] = useState('');
  const [questions, setQuestions] = useState<PYQItem[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Study Mode State
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  
  // Test Mode State
  const [isTestMode, setIsTestMode] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({}); // questionId -> selectedOption

  const handleSearch = async () => {
    setLoading(true);
    setQuestions([]);
    setRevealedIds(new Set());
    setUserAnswers({});
    try {
      const result = await fetchPYQs(exam, subject, year);
      setQuestions(result);
    } catch (e) {
      alert("Error fetching PYQs");
    } finally {
      setLoading(false);
    }
  };

  const toggleRevealAnswer = (id: string) => {
    const newRevealed = new Set(revealedIds);
    if (newRevealed.has(id)) {
      newRevealed.delete(id);
    } else {
      newRevealed.add(id);
    }
    setRevealedIds(newRevealed);
  };

  const handleOptionSelect = (qId: string, option: string) => {
    if (userAnswers[qId]) return; // Prevent changing answer once selected
    setUserAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach(q => {
      const qId = q.id || q.question;
      if (userAnswers[qId] === q.answer) score++;
    });
    return score;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-900">Previous Year Questions</h1>
            <p className="text-slate-500">Access authentic previous year questions and AI-simulated practice sets.</p>
        </div>
        
        {/* Test Mode Toggle */}
        <div className="flex items-center gap-3 bg-white p-2 pl-4 rounded-xl border border-slate-200 shadow-sm">
            <span className={`text-sm font-semibold ${isTestMode ? 'text-slate-400' : 'text-indigo-600'}`}>Study Mode</span>
            <button 
                onClick={() => {
                    setIsTestMode(!isTestMode);
                    setUserAnswers({});
                    setRevealedIds(new Set());
                }}
                className="text-indigo-600 transition-transform active:scale-95"
            >
                {isTestMode ? <ToggleRight size={40} className="fill-indigo-100" /> : <ToggleLeft size={40} className="text-slate-300" />}
            </button>
            <span className={`text-sm font-semibold ${isTestMode ? 'text-indigo-600' : 'text-slate-400'}`}>Test Mode</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
         <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Exam</label>
                <select 
                    value={exam} 
                    onChange={(e) => setExam(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                    <option value="OPSC OAS">OPSC Civil Services (OAS)</option>
                    <option value="OSSSC Combined">OSSSC Combined</option>
                    <option value="Odisha Police SI">Odisha Police SI</option>
                    <option value="OSSC CGL">OSSC CGL</option>
                    <option value="Banking">Banking (IBPS/SBI)</option>
                </select>
            </div>
            
            <div className="flex-1 space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Subject</label>
                <select 
                    value={subject} 
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                    <option value="General Studies">General Studies (Odisha + India)</option>
                    <option value="Odisha History">Odisha History</option>
                    <option value="Odisha Geography">Odisha Geography</option>
                    <option value="Polity">Polity</option>
                    <option value="Economy">Economy</option>
                    <option value="Reasoning">Reasoning</option>
                </select>
            </div>

            <div className="w-full md:w-32 space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Year</label>
                <select 
                    value={year} 
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                    <option value="">All Years</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                </select>
            </div>
         </div>

         <button 
            onClick={handleSearch}
            disabled={loading}
            className="w-full md:w-auto self-end px-8 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2 justify-center transition-colors"
         >
            {loading ? 'Retrieving Papers...' : <><Search size={18} /> Get Questions</>}
         </button>
      </div>

      {isTestMode && questions.length > 0 && (
          <div className="bg-indigo-50 p-4 rounded-xl flex justify-between items-center animate-in fade-in">
              <span className="font-semibold text-indigo-900">Live Score:</span>
              <span className="font-bold text-2xl text-indigo-700">{calculateScore()} / {questions.length}</span>
          </div>
      )}

      {loading && <div className="py-12"><LoadingSpinner text="Searching database & generating AI supplements..." /></div>}

      <div className="space-y-6">
         {questions.map((q, idx) => {
             const qId = q.id || `q-${idx}`;
             const isAnswered = userAnswers[qId] !== undefined;
             const userSelected = userAnswers[qId];
             const isRevealed = revealedIds.has(qId);
             
             // Check if it's from our static DB or AI
             const isAI = !q.id.includes(q.exam.toLowerCase().split(' ')[0]); 

             return (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold uppercase tracking-wider">
                                {q.exam} • {q.year}
                            </span>
                            {isAI ? (
                                <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded-lg text-xs font-bold flex items-center gap-1" title="Generated by AI based on exam pattern">
                                    <Sparkles size={10} /> AI Model
                                </span>
                            ) : (
                                <span className="px-2 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-bold flex items-center gap-1" title="Verified from Database">
                                    <Database size={10} /> Official PYQ
                                </span>
                            )}
                        </div>
                        
                        {!isTestMode && (
                            <button 
                                onClick={() => toggleRevealAnswer(qId)}
                                className="text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1 text-sm font-medium"
                            >
                                {isRevealed ? <><EyeOff size={16}/> Hide Answer</> : <><Eye size={16} /> Show Answer</>}
                            </button>
                        )}
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-900 mb-6">{q.question}</h3>

                    {/* Options Render */}
                    <div className="space-y-3 mb-4">
                        {q.options?.map((opt, optIdx) => {
                            let optionClass = "bg-white border-slate-200 hover:bg-slate-50";
                            let icon = <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold mr-3">{String.fromCharCode(65 + optIdx)}</span>;
                            
                            if (isTestMode) {
                                if (isAnswered) {
                                    if (opt === q.answer) {
                                        optionClass = "bg-green-50 border-green-500 text-green-800";
                                        icon = <CheckCircle2 size={20} className="text-green-600 mr-3" />;
                                    } else if (opt === userSelected) {
                                        optionClass = "bg-red-50 border-red-300 text-red-800";
                                        icon = <XCircle size={20} className="text-red-500 mr-3" />;
                                    } else {
                                        optionClass = "opacity-50 bg-slate-50 border-slate-100";
                                    }
                                } else {
                                    optionClass = "cursor-pointer hover:border-indigo-300 hover:bg-indigo-50";
                                }
                            } else {
                                // Study Mode visual only unless revealed
                                if (isRevealed && opt === q.answer) {
                                    optionClass = "bg-green-50 border-green-500 text-green-800";
                                    icon = <CheckCircle2 size={20} className="text-green-600 mr-3" />;
                                }
                            }

                            return (
                                <div 
                                    key={optIdx}
                                    onClick={() => isTestMode && !isAnswered && handleOptionSelect(qId, opt)}
                                    className={`p-3 rounded-xl border flex items-center transition-all ${optionClass}`}
                                >
                                    {icon}
                                    <span className="text-sm font-medium">{opt}</span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Explanation Section */}
                    {((!isTestMode && isRevealed) || (isTestMode && isAnswered)) && (
                        <div className="mt-4 pt-4 border-t border-slate-100 animate-in fade-in">
                            <div className="flex gap-2">
                                <span className="font-bold text-slate-700 text-sm">Explanation:</span>
                                <p className="text-sm text-slate-600 leading-relaxed">{q.explanation}</p>
                            </div>
                        </div>
                    )}
                </div>
             );
         })}
         
         {!loading && questions.length === 0 && (
             <div className="text-center py-12 text-slate-400">
                 <LibraryBig size={48} className="mx-auto mb-4 opacity-50" />
                 <p>Select criteria to load Previous Year Questions.</p>
             </div>
         )}
      </div>
    </div>
  );
};

export default PYQ;
