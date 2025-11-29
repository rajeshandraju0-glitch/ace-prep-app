import React, { useEffect, useState } from 'react';
import { fetchLatestCurrentAffairs } from '../services/geminiService';
import { NewsItem, FetchStatus } from '../types';
import { LoadingSpinner, SkeletonCard } from '../components/Loading';
import { Calendar, Tag, ExternalLink, RefreshCcw, AlertCircle } from 'lucide-react';

const CurrentAffairs: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [status, setStatus] = useState<FetchStatus>(FetchStatus.IDLE);
  const [error, setError] = useState<string | null>(null);

  const loadNews = async () => {
    setStatus(FetchStatus.LOADING);
    setError(null);
    try {
      const { items, sources: s } = await fetchLatestCurrentAffairs();
      setNews(items);
      setSources(s);
      setStatus(FetchStatus.SUCCESS);
    } catch (err) {
      setError("Failed to fetch latest news. Please check your connection.");
      setStatus(FetchStatus.ERROR);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Current Affairs</h1>
          <p className="text-slate-500 mt-1">AI-curated updates from the last 3 days for exam prep.</p>
        </div>
        <button 
          onClick={loadNews}
          disabled={status === FetchStatus.LOADING}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors disabled:opacity-50"
        >
          <RefreshCcw size={16} className={status === FetchStatus.LOADING ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {status === FetchStatus.LOADING && (
        <div className="grid gap-6">
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

      {status === FetchStatus.SUCCESS && (
        <div className="grid gap-6 animate-in slide-in-from-bottom-8 duration-700">
          {news.map((item) => (
            <article key={item.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
              <div className="flex flex-wrap gap-3 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wide">
                  <Tag size={12} /> {item.category}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                  <Calendar size={12} /> {item.date}
                </span>
              </div>
              
              <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                {item.title}
              </h2>
              
              <p className="text-slate-600 leading-relaxed">
                {item.summary}
              </p>
            </article>
          ))}

          {sources.length > 0 && (
             <div className="mt-8 pt-8 border-t border-slate-200">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Sources Verified by Google Search</h3>
                <div className="flex flex-wrap gap-2">
                    {sources.map((s, idx) => (
                        <a 
                           key={idx} 
                           href={s.web?.uri || '#'} 
                           target="_blank" 
                           rel="noreferrer"
                           className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-colors truncate max-w-xs"
                        >
                           <ExternalLink size={10} />
                           {s.web?.title || 'Source Link'}
                        </a>
                    ))}
                </div>
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CurrentAffairs;
