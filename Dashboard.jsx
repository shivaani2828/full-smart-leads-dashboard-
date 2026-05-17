import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGig } from '../context/GigContext.jsx';
import { useBid } from '../context/BidContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Briefcase, Send, User, Plus, IndianRupeeIcon } from 'lucide-react';
import socket from "../socket.js";

export default function Dashboard() {
    const { myGigs, loading: gigsLoading, error: gigsError, getMyGigs, deleteGig } = useGig();
    const { myBids, loading: bidsLoading, error: bidsError, getMyBids } = useBid();
    const { user } = useAuth();

    useEffect(() => {
        getMyGigs();
        getMyBids();
    }, []);

    useEffect(() => {
        socket.on("hired", (data) => {
            alert(`You have been hired for ${data.gigTitle}! 🎉`);
            getMyBids();
        });
        return () => { socket.off("hired"); };
    }, []);

    function getStatusConfig(status) {
        switch (status) {
            case 'open': return { cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Open' };
            case 'assigned': return { cls: 'bg-sky-50 text-sky-700 border-sky-200', label: 'Assigned' };
            case 'hired': return { cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Hired' };
            case 'rejected': return { cls: 'bg-red-50 text-red-600 border-red-200', label: 'Rejected' };
            default: return { cls: 'bg-amber-50 text-amber-700 border-amber-200', label: status };
        }
    }

    function handleDeleteGig(gigId) {
        if (window.confirm("Are you sure you want to delete this gig?")) deleteGig(gigId);
    }

    const spinner = (
        <div className="flex justify-center py-10">
            <div className="w-5 h-5 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Profile */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 flex items-center gap-4 shadow-sm">
                    <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">{user?.name}</h1>
                        <p className="text-slate-400 text-sm">{user?.email}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* MY GIGS */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2">
                                <Briefcase className="h-5 w-5 text-indigo-600" />
                                <h2 className="text-base font-bold text-slate-900">My Gigs</h2>
                            </div>
                            <Link to="/create-gig" className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all active:scale-95">
                                <Plus size={13} /> Post New
                            </Link>
                        </div>

                        {gigsLoading ? spinner
                        : gigsError ? (
                            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm">{gigsError}</div>
                        ) : myGigs.length === 0 ? (
                            <div className="text-center py-10">
                                <p className="text-slate-400 text-sm">You haven't posted any gigs yet</p>
                                <Link to="/create-gig" className="text-indigo-600 hover:text-indigo-700 mt-2 inline-block text-sm font-medium">
                                    Post your first gig →
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-96 overflow-y-auto pr-0.5">
                                {myGigs.map((gig) => {
                                    const sc = getStatusConfig(gig.status);
                                    return (
                                        <div key={gig._id} className="border border-slate-200 rounded-xl p-4 hover:border-slate-300 hover:bg-slate-50 transition-all">
                                            <div className="flex justify-between items-start mb-1.5">
                                                <h3 className="font-semibold text-slate-800 text-sm line-clamp-1 flex-1 mr-2">{gig.title}</h3>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium border flex-shrink-0 ${sc.cls}`}>{sc.label}</span>
                                            </div>
                                            <p className="text-slate-400 text-xs mb-3 line-clamp-2 leading-relaxed">{gig.description}</p>
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-slate-900 text-sm flex items-center gap-0.5">
                                                    <IndianRupeeIcon size={12} className="text-slate-500" />{gig.budget}
                                                </span>
                                                <div className="flex items-center gap-3">
                                                    <Link to={`/gigs/${gig._id}`} className="text-indigo-600 hover:text-indigo-700 text-xs font-medium transition-colors">View</Link>
                                                    <button onClick={() => handleDeleteGig(gig._id)} className="text-red-400 hover:text-red-600 text-xs font-medium transition-colors cursor-pointer">Delete</button>
                                                </div>
                                            </div>
                                            {gig.assignedTo && (
                                                <div className="mt-2 pt-2 border-t border-slate-100 text-xs text-slate-400">
                                                    Assigned to: <span className="text-slate-600 font-medium">{gig.assignedTo.name}</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* MY BIDS */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-5">
                            <Send className="h-5 w-5 text-indigo-600" />
                            <h2 className="text-base font-bold text-slate-900">My Bids</h2>
                        </div>

                        {bidsLoading ? spinner
                        : bidsError ? (
                            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm">{bidsError}</div>
                        ) : myBids.length === 0 ? (
                            <div className="text-center py-10">
                                <p className="text-slate-400 text-sm">You haven't submitted any bids yet</p>
                                <Link to="/" className="text-indigo-600 hover:text-indigo-700 mt-2 inline-block text-sm font-medium">
                                    Browse available gigs →
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-96 overflow-y-auto pr-0.5">
                                {myBids.map((bid) => {
                                    const sc = getStatusConfig(bid.status);
                                    return (
                                        <div key={bid._id} className="border border-slate-200 rounded-xl p-4 hover:border-slate-300 hover:bg-slate-50 transition-all">
                                            <div className="flex justify-between items-start mb-1.5">
                                                <h3 className="font-semibold text-slate-800 text-sm line-clamp-1 flex-1 mr-2">{bid.gigId?.title || 'Deleted Gig'}</h3>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium border flex-shrink-0 ${sc.cls}`}>{sc.label}</span>
                                            </div>
                                            <p className="text-slate-400 text-xs mb-3 line-clamp-2 leading-relaxed">{bid.message}</p>
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-slate-900 text-sm flex items-center gap-0.5">
                                                    <IndianRupeeIcon size={12} className="text-slate-500" />{bid.price}
                                                </span>
                                                {bid.gigId && (
                                                    <Link to={`/gigs/${bid.gigId._id}`} className="text-indigo-600 hover:text-indigo-700 text-xs font-medium transition-colors">View Gig</Link>
                                                )}
                                            </div>
                                            {bid.status === 'hired' && (
                                                <div className="mt-2 pt-2 border-t border-slate-100 text-emerald-600 text-xs font-medium">
                                                    🎉 You've been hired for this project!
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}