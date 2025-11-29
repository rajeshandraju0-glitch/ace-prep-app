
import React, { useState, useEffect } from 'react';
import { generateQuiz } from '../services/geminiService';
import { QuizQuestion, TestConfig, TestType } from '../types';
import { 
    Brain, 
    CheckCircle, 
    XCircle, 
    ChevronRight, 
    RotateCcw, 
    Play, 
    Clock, 
    FileText, 
    Book, 
    Layers, 
    AlertCircle,
    Flag,
    ListChecks
} from 'lucide-react';
import { LoadingSpinner } from '../components/Loading';

const Quiz: React.FC = () => {
  // Application State
  const [viewState, setViewState] = useState<'SELECT' | 'CONFIG' | 'TEST' | 'RESULT'>('SELECT');
  const [loading, setLoading] = useState(false);

  // Test Configuration State
  const [config, setConfig] = useState<TestConfig>({
      type: 'MOCK',
      exam: 'OPSC Civil Services',
      questionCount: 10,
      durationMinutes: 15,
      subject: '',
      topic: ''
  });

  // Test Execution State
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({}); // Index -> Selected Option
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [timeTaken, setTimeTaken] = useState(0); // in seconds

  // Timer Logic
  useEffect(() => {
    let timer: any;
    if (viewState === 'TEST' && config.durationMinutes > 0 && timeLeft > 0) {
        timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    handleSubmitTest();
                    return 0;
                }
                return prev - 1;
            });
            setTimeTaken((prev) => prev + 1);
        }, 1000);
    }
    return () => clearInterval(timer);
  }, [viewState, timeLeft, config.durationMinutes]);

  const handleModeSelect = (type: TestType) => {
      setConfig({ ...config, type, subject: '', topic: '' });
      setViewState('CONFIG');
  };

  const handleStartTest = async () => {
      setLoading(true);
      setQuestions([]);
      setAnswers({});
      setMarkedForReview(new Set());
      setCurrentIndex(0);
      setTimeTaken(0);
      
      try {
          // Adjust count based on type for demo purposes, keep it manageable for AI
          const qs = await generateQuiz(config);
          setQuestions(qs);
          setTimeLeft(config.durationMinutes * 60);
          setViewState('TEST');
      } catch (e) {
          alert("Failed to generate test. Please try again.");
      } finally {
          setLoading(false);
      }
  };

  const handleAnswer = (option: string) => {
      setAnswers(prev => ({ ...prev, [currentIndex]: option }));
  };

  const toggleMarkForReview = () => {
      const newSet = new Set(markedForReview);
      if (newSet.has(currentIndex)) {
          newSet.delete(currentIndex);
      } else {
          newSet.add(currentIndex);
      }
      setMarkedForReview(newSet);
  };

  const handleSubmitTest = () => {
      setViewState('RESULT');
  };

  const formatTime = (seconds: number) => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getExamPatternDescription = (exam: string) => {
      if (exam.includes("OPSC") || exam.includes("UPSC")) {
          return "General Studies (History, Geography, Polity, Economy, Science)";
      }
      if (exam.includes("Banking")) {
          return "Reasoning Ability, Quantitative Aptitude, English Language";
      }
      if (exam.includes("OSSC") || exam.includes("Police")) {
          return "Odisha GK, Reasoning, Arithmetic, Computer Awareness";
      }
      return "General Exam Syllabus";
  };

  // --- VIEW: SELECTION SCREEN ---
  if (viewState === 'SELECT') {
      return (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
              <div className="text-center space-y-4 mb-8">
                  <h1 className="text-4xl font-bold text-slate-900">Test Series</h1>
                  <p className="text-lg text-slate-600">Premium AI-generated mock tests based on latest exam patterns.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <button 
                    onClick={() => handleModeSelect('MOCK')}
                    className="p-8 bg-white rounded-3xl border border-slate-200 hover:border-indigo-500 hover:shadow-xl hover:-translate-y-1 transition-all group text-left relative overflow-hidden"
                  >
                      <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">RECOMMENDED</div>
                      <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          <Layers size={28} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Exam Pattern Test</h3>
                      <p className="text-slate-500 text-sm">Full mock tests strictly following the syllabus of your selected exam.</p>
                  </button>

                  <button 
                    onClick={() => handleModeSelect('SUBJECT')}
                    className="p-8 bg-white rounded-3xl border border-slate-200 hover:border-purple-500 hover:shadow-xl hover:-translate-y-1 transition-all group text-left"
                  >
                      <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                          <Book size={28} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Subject Test</h3>
                      <p className="text-slate-500 text-sm">Focus on specific subjects like History, Polity, or Geography.</p>
                  </button>

                  <button 
                    onClick={() => handleModeSelect('CHAPTER')}
                    className="p-8 bg-white rounded-3xl border border-slate-200 hover:border-emerald-500 hover:shadow-xl hover:-translate-y-1 transition-all group text-left"
                  >
                      <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                          <FileText size={28} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Chapter Test</h3>
                      <p className="text-slate-500 text-sm">Deep dive into specific topics or chapters.</p>
                  </button>
              </div>
          </div>
      );
  }

  // --- VIEW: CONFIGURATION SCREEN ---
  if (viewState === 'CONFIG') {
      return (
          <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-right-4">
              <button onClick={() => setViewState('SELECT')} className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1">
                  &larr; Back to modes
              </button>
              
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                  <div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-1">
                          {config.type === 'MOCK' ? 'Configure Exam Series' : 'Configure Test'}
                      </h2>
                      <p className="text-slate-500 text-sm">Customize your practice session.</p>
                  </div>

                  <div className="space-y-4">
                      <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Target Exam Pattern</label>
                          <select 
                            value={config.exam}
                            onChange={(e) => setConfig({ ...config, exam: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                          >
                              <option value="OPSC Civil Services">OPSC Civil Services (GS Paper 1)</option>
                              <option value="OSSSC Combined">OSSSC Combined Recruitment</option>
                              <option value="Odisha Police">Odisha Police (SI/Constable)</option>
                              <option value="OSSC CGL">OSSC CGL</option>
                              <option value="UPSC">UPSC Civil Services (Prelims)</option>
                              <option value="Banking (IBPS PO)">Banking (IBPS PO)</option>
                              <option value="Banking (SBI PO)">Banking (SBI PO)</option>
                          </select>
                      </div>
                      
                      {/* Exam Pattern Info Box */}
                      {config.type === 'MOCK' && (
                          <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex gap-3">
                              <ListChecks className="text-indigo-600 shrink-0 mt-1" size={20} />
                              <div>
                                  <h4 className="font-bold text-indigo-900 text-sm">Pattern Syllabus</h4>
                                  <p className="text-sm text-indigo-700 mt-1">
                                      {getExamPatternDescription(config.exam)}
                                  </p>
                              </div>
                          </div>
                      )}

                      {config.type !== 'MOCK' && (
                          <div>
                              <label className="block text-sm font-bold text-slate-700 mb-2">Subject</label>
                              <select 
                                value={config.subject}
                                onChange={(e) => setConfig({ ...config, subject: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                              >
                                  <option value="">Select Subject...</option>
                                  <option value="Odisha History">Odisha History</option>
                                  <option value="Odisha Geography">Odisha Geography</option>
                                  <option value="Indian Polity">Indian Polity</option>
                                  <option value="Economy">Economy</option>
                                  <option value="General Science">General Science</option>
                                  <option value="Reasoning">Reasoning</option>
                                  <option value="English">English</option>
                              </select>
                          </div>
                      )}

                      {config.type === 'CHAPTER' && (
                          <div>
                              <label className="block text-sm font-bold text-slate-700 mb-2">Specific Chapter/Topic</label>
                              <input 
                                type="text"
                                value={config.topic}
                                onChange={(e) => setConfig({ ...config, topic: e.target.value })}
                                placeholder="e.g. Salt Satyagraha in Odisha"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                              />
                          </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="block text-sm font-bold text-slate-700 mb-2">Questions</label>
                              <select 
                                value={config.questionCount}
                                onChange={(e) => setConfig({ ...config, questionCount: Number(e.target.value) })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                              >
                                  <option value="10">Mini Mock (10 Qs)</option>
                                  <option value="20">Sectional (20 Qs)</option>
                                  <option value="50">Full Length (50 Qs)</option>
                              </select>
                           </div>
                           <div>
                              <label className="block text-sm font-bold text-slate-700 mb-2">Timer</label>
                              <select 
                                value={config.durationMinutes}
                                onChange={(e) => setConfig({ ...config, durationMinutes: Number(e.target.value) })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                              >
                                  <option value="0">No Timer</option>
                                  <option value="15">15 Minutes</option>
                                  <option value="30">30 Minutes</option>
                                  <option value="60">1 Hour</option>
                              </select>
                           </div>
                      </div>
                  </div>

                  <button 
                    onClick={handleStartTest}
                    disabled={(config.type !== 'MOCK' && !config.subject) || (config.type === 'CHAPTER' && !config.topic)}
                    className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                  >
                      Start Test <Play size={20} className="fill-current" />
                  </button>
              </div>
          </div>
      );
  }

  // --- VIEW: LOADING SCREEN ---
  if (loading) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <LoadingSpinner text={`Generating your ${config.exam} test series...`} />
          </div>
      );
  }

  // --- VIEW: TEST SCREEN ---
  if (viewState === 'TEST' && questions.length > 0) {
      const currentQ = questions[currentIndex];
      const isAnswered = answers[currentIndex] !== undefined;
      const isMarked = markedForReview.has(currentIndex);

      return (
          <div className="max-w-6xl mx-auto h-[calc(100vh-100px)] flex flex-col md:flex-row gap-6 animate-in fade-in">
              {/* Main Question Area */}
              <div className="flex-1 flex flex-col h-full">
                  {/* Header */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                         <span className="font-bold text-slate-700">Q.{currentIndex + 1}</span>
                         <span className="text-sm text-slate-400">/ {questions.length}</span>
                      </div>
                      
                      {config.durationMinutes > 0 && (
                          <div className={`flex items-center gap-2 font-mono font-bold text-lg ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-slate-700'}`}>
                              <Clock size={20} /> {formatTime(timeLeft)}
                          </div>
                      )}

                      <button 
                         onClick={handleSubmitTest}
                         className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-bold transition-colors"
                      >
                          Submit Test
                      </button>
                  </div>

                  {/* Question Card */}
                  <div className="flex-1 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm overflow-y-auto">
                      <div className="flex justify-between items-start mb-6">
                           <span className="text-xs font-bold text-white bg-slate-500 px-3 py-1 rounded-full uppercase tracking-wider">{currentQ.subject || 'General'}</span>
                           <button 
                             onClick={toggleMarkForReview}
                             className={`text-sm flex items-center gap-1 font-medium ${isMarked ? 'text-yellow-600' : 'text-slate-400 hover:text-slate-600'}`}
                           >
                               <Flag size={16} className={isMarked ? 'fill-current' : ''} />
                               {isMarked ? 'Marked' : 'Mark for Review'}
                           </button>
                      </div>
                      
                      <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-8 leading-snug">
                          {currentQ.question}
                      </h2>

                      <div className="space-y-3">
                          {currentQ.options.map((option, idx) => (
                              <button
                                  key={idx}
                                  onClick={() => handleAnswer(option)}
                                  className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 flex items-center gap-3 group
                                      ${answers[currentIndex] === option 
                                          ? 'border-indigo-600 bg-indigo-50 text-indigo-900' 
                                          : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50 text-slate-700'
                                      }
                                  `}
                              >
                                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0
                                      ${answers[currentIndex] === option 
                                          ? 'bg-indigo-600 text-white' 
                                          : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600'
                                      }
                                  `}>
                                      {String.fromCharCode(65 + idx)}
                                  </span>
                                  <span className="font-medium">{option}</span>
                              </button>
                          ))}
                      </div>
                  </div>

                  {/* Footer Nav */}
                  <div className="flex justify-between mt-4">
                      <button 
                        onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                        disabled={currentIndex === 0}
                        className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold disabled:opacity-50 hover:bg-slate-50 transition-colors"
                      >
                          Previous
                      </button>
                      <button 
                        onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
                        disabled={currentIndex === questions.length - 1}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold disabled:opacity-50 hover:bg-indigo-700 transition-colors"
                      >
                          Next
                      </button>
                  </div>
              </div>

              {/* Sidebar Question Palette */}
              <div className="w-full md:w-64 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 h-fit md:h-full overflow-y-auto">
                  <h3 className="font-bold text-slate-900 mb-4">Questions</h3>
                  <div className="grid grid-cols-5 gap-2">
                      {questions.map((_, idx) => {
                          const isAns = answers[idx] !== undefined;
                          const isRev = markedForReview.has(idx);
                          const isCurr = currentIndex === idx;
                          
                          let bgClass = "bg-slate-100 text-slate-500"; // Not visited
                          if (isRev) bgClass = "bg-yellow-100 text-yellow-700 border border-yellow-300";
                          else if (isAns) bgClass = "bg-green-100 text-green-700 border border-green-300";
                          
                          if (isCurr) bgClass += " ring-2 ring-indigo-500 ring-offset-1";

                          return (
                              <button 
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`aspect-square rounded-lg flex items-center justify-center text-sm font-bold transition-all ${bgClass}`}
                              >
                                  {idx + 1}
                              </button>
                          );
                      })}
                  </div>
                  
                  <div className="mt-6 space-y-2 text-xs text-slate-500">
                      <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div> Answered</div>
                      <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded"></div> Marked</div>
                      <div className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-100 rounded"></div> Not Visited</div>
                  </div>
              </div>
          </div>
      );
  }

  // --- VIEW: RESULT SCREEN ---
  if (viewState === 'RESULT') {
      const correctCount = questions.filter((q, i) => answers[i] === q.correctAnswer).length;
      const score = correctCount; // Assuming 1 mark per question for simplicity
      const percentage = Math.round((score / questions.length) * 100);

      return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in-95 duration-500">
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-sm">
             <div className="inline-block p-4 rounded-full bg-indigo-50 text-indigo-600 mb-4">
               <Brain size={48} />
             </div>
             <h2 className="text-3xl font-bold text-slate-900 mb-2">Test Completed</h2>
             <p className="text-slate-500 mb-6">Here is how you performed in {config.exam}</p>
             
             <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-8">
                 <div className="p-4 bg-slate-50 rounded-2xl">
                     <div className="text-sm text-slate-500 mb-1">Score</div>
                     <div className="text-3xl font-black text-indigo-600">{score}/{questions.length}</div>
                 </div>
                 <div className="p-4 bg-slate-50 rounded-2xl">
                     <div className="text-sm text-slate-500 mb-1">Accuracy</div>
                     <div className="text-3xl font-black text-emerald-600">{percentage}%</div>
                 </div>
                 <div className="p-4 bg-slate-50 rounded-2xl">
                     <div className="text-sm text-slate-500 mb-1">Time</div>
                     <div className="text-3xl font-black text-slate-700">{formatTime(timeTaken)}</div>
                 </div>
             </div>
             
             <button 
               onClick={() => setViewState('SELECT')}
               className="px-8 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors inline-flex items-center gap-2"
             >
               <RotateCcw size={18} /> Take Another Test
             </button>
          </div>
  
          <div className="space-y-4">
             <h3 className="font-bold text-slate-900 text-lg px-2">Detailed Analysis</h3>
             {questions.map((q, idx) => {
               const userAns = answers[idx];
               const isCorrect = userAns === q.correctAnswer;
               const isSkipped = userAns === undefined;

               let borderClass = 'border-slate-200';
               let bgClass = 'bg-white';
               if (!isSkipped) {
                   borderClass = isCorrect ? 'border-green-200' : 'border-red-200';
                   bgClass = isCorrect ? 'bg-green-50' : 'bg-red-50';
               }

               return (
                 <div key={idx} className={`p-6 rounded-2xl border ${bgClass} ${borderClass}`}>
                   <div className="flex gap-3">
                      <span className="font-bold text-slate-900">{idx + 1}.</span>
                      <div className="space-y-2 flex-1">
                          <p className="font-medium text-slate-900">{q.question}</p>
                          <div className="flex flex-col gap-1 text-sm mt-2">
                               {isSkipped ? (
                                   <div className="text-slate-500 flex items-center gap-2"><AlertCircle size={14}/> Skipped</div>
                               ) : (
                                   <div className={`flex items-center gap-2 ${isCorrect ? 'text-green-700 font-semibold' : 'text-red-600 line-through opacity-75'}`}>
                                      {isCorrect ? <CheckCircle size={14}/> : <XCircle size={14}/>} 
                                      Your Answer: {userAns}
                                   </div>
                               )}
                               
                               {!isCorrect && (
                                   <div className="text-green-700 font-semibold flex items-center gap-2">
                                       <CheckCircle size={14}/> Correct: {q.correctAnswer}
                                   </div>
                               )}
                          </div>
                          <div className="mt-3 pt-3 border-t border-black/5 text-sm text-slate-600 italic">
                              <span className="font-semibold not-italic">Explanation:</span> {q.explanation}
                          </div>
                      </div>
                   </div>
                 </div>
               );
             })}
          </div>
        </div>
      );
  }

  return null;
};

export default Quiz;
