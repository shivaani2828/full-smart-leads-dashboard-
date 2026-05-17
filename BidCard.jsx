import { useEffect, useState } from 'react';
import { useGig } from '../context/GigContext.jsx';
import GigCard from '../components/GigCard.jsx';
import { Search } from 'lucide-react';

export default function Home() {
  const { gigs = [], loading, getGigs, error } = useGig();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getGigs('');
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    getGigs(searchQuery);
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero */}
      <div className="bg-white border-b border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 tracking-wide uppercase">
            Freelance Marketplace
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 tracking-tight leading-tight">
            Find the Perfect<br />
            <span className="text-indigo-600">Freelance Gig</span>
          </h1>
          <p className="text-slate-500 text-lg mb-10 max-w-lg mx-auto">
            Connect with talented freelancers or find your next project opportunity.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex bg-white border border-slate-300 rounded-xl overflow-hidden focus-within:border-indigo-400 focus-within:ring-3 focus-within:ring-indigo-100 transition-all shadow-sm">
              <div className="flex items-center pl-4 text-slate-400">
                <Search size={17} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for gigs..."
                className="flex-1 px-3 py-3.5 bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none text-sm"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 text-sm font-semibold transition-all m-1.5 rounded-lg active:scale-95"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Gigs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Available Gigs</h2>
            <p className="text-slate-400 text-sm mt-0.5">{gigs.length} opportunities found</p>
          </div>
          {error && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg">{error}</p>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="flex items-center gap-3 text-slate-400">
              <div className="w-5 h-5 border-2 border-slate-300 border-t-indigo-500 rounded-full animate-spin" />
              <span className="text-sm">Loading gigs...</span>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-24">
            <p className="text-lg text-slate-500">No gigs found</p>
            <p className="text-slate-400 mt-1 text-sm">Try adjusting your search or check back later</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {gigs.map((gig) => (
              <GigCard key={gig._id} gig={gig} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}