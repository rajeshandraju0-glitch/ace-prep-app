import React, { useEffect, useState } from 'react';
import { fetchLatestRecruitments } from '../services/geminiService';
import { RecruitmentItem, FetchStatus } from '../types';
import { SkeletonCard } from '../components/Loading';
import { Building2, Clock, CheckCircle2, ArrowUpRight, AlertCircle, RefreshCcw } from 'lucide-react';

const Recruitments: React.FC = () => {
  const [jobs, setJobs] = useState<RecruitmentItem[]>([]);
  const [status, setStatus] = useState<FetchStatus>(FetchStatus.IDLE);
  const [error, setError] = useState<string | null>(null);

  const loadJobs = async () => {
    setStatus(FetchStatus.LOADING);
    setError(null);
    try {
      const { items } = await fetchLatestRecruitments();
      setJobs(items);
      setStatus(FetchStatus.SUCCESS);
    } catch (err) {
      setError("Unable to fetch job listings at this time.");
      setStatus(FetchStatus.ERROR);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  return (
    <div className="space-y-6 pb-12">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Latest Recruitments</h1>
          <p className="text-slate-500 mt-1">Government and competitive exam notifications from the last 14 days.</p>
        </div>
        <button 
          onClick={loadJobs}
          disabled={status === FetchStatus.LOADING}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors disabled:opacity-50 shadow-sm shadow-indigo-200"
        >
          <RefreshCcw size={16} className={status === FetchStatus.LOADING ? "animate-spin" : ""} />
          Check for Updates
        </button>
      </div>

      {status === FetchStatus.LOADING && (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
         </div>
      )}

      {status === FetchStatus.ERROR && (
        <div className="p-6 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-center gap-3">
          <AlertCircle />
          {error}
        </div>
      )}

      {status === FetchStatus.SUCCESS && jobs.length === 0 && (
         <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
             <p className="text-slate-500">No recent notifications found in the last 14 days.</p>
         </div>
      )}

      {status === FetchStatus.SUCCESS && jobs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-8 duration-700">
            {jobs.map((job) => (
                <div key={job.id} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <div>
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                                <Building2 size={24} />
                            </div>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-semibold border border-orange-100">
                                <Clock size={12} /> {job.deadline}
                            </span>
                        </div>
                        
                        <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-2">{job.title}</h3>
                        <p className="text-slate-500 font-medium text-sm mb-4">{job.organization}</p>
                        
                        <div className="p-3 bg-slate-50 rounded-xl mb-4">
                            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Eligibility</h4>
                            <p className="text-sm text-slate-700">{job.eligibility}</p>
                        </div>
                    </div>

                    <a 
                        href={job.link === '#' ? `https://www.google.com/search?q=${job.organization} ${job.title} recruitment` : job.link}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
                    >
                        Apply Now <ArrowUpRight size={16} />
                    </a>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Recruitments;
