import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGig } from "../context/GigContext.jsx";
import { useBid } from "../context/BidContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import BidCard from "../components/BidCard.jsx";
import { IndianRupeeIcon, User, Calendar, MessageSquare, CheckCircle, Send } from "lucide-react";

export default function GigDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { currentGig, loading, error: gigError, getGig } = useGig();
    const { bids, createBid, getBidsForGig, hireBid, clearError, clearBids, error: bidError } = useBid();
    const { user, isAuthenticated } = useAuth();

    const [showBidForm, setShowBidForm] = useState(false);
    const [bidData, setBidData] = useState({ message: "", price: "" });
    const [bidSuccess, setBidSuccess] = useState(false);

    const isOwner = currentGig && user && String(currentGig.ownerId?._id) === String(user.id);

    useEffect(() => {
        getGig(id);
        return () => { clearBids(); clearError(); };
    }, [id]);

    useEffect(() => {
        if (!currentGig || !user) return;
        if (String(currentGig.ownerId?._id) === String(user.id)) getBidsForGig(id);
    }, [currentGig, user, id]);

    async function handleBidSubmit(e) {
        e.preventDefault();
        if (!isAuthenticated) { navigate("/login"); return; }
        await createBid({ gigId: id, message: bidData.message, price: Number(bidData.price) });
        setBidData({ message: "", price: "" });
        setShowBidForm(false);
        setBidSuccess(true);
    }

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="flex items-center gap-2.5 text-slate-400">
                <div className="w-5 h-5 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin" />
                <span className="text-sm">Loading gig...</span>
            </div>
        </div>
    );

    if (gigError) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl text-sm">❌ {gigError}</div>
        </div>
    );

    if (!currentGig) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <p className="text-slate-400 text-sm">Gig not found</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="max-w-5xl mx-auto px-4">

                {bidSuccess && !isOwner && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl mb-6 flex items-start gap-3 text-sm">
                        <CheckCircle size={15} className="mt-0.5 flex-shrink-0" />
                        <div>
                            <span className="font-semibold">Bid submitted successfully.</span><br />
                            <span className="text-emerald-600">Track it from your dashboard.</span>
                        </div>
                    </div>
                )}

                {/* Gig Card */}
                <div className="bg-white border border-slate-200 rounded-2xl p-7 shadow-sm mb-6">
                    <div className="flex items-start justify-between mb-4">
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-snug flex-1 mr-4">{currentGig.title}</h1>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex-shrink-0 ${
                            currentGig.status === 'open'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-sky-50 text-sky-700 border-sky-200'
                        }`}>
                            {currentGig.status?.charAt(0).toUpperCase() + currentGig.status?.slice(1)}
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-5 mb-5">
                        <span className="flex items-center gap-1.5 font-bold text-slate-900 text-xl">
                            <IndianRupeeIcon size={16} className="text-slate-500" /> {currentGig.budget}
                        </span>
                        <span className="flex items-center gap-1.5 text-slate-500 text-sm">
                            <User size={14} className="text-slate-400" /> {currentGig.ownerId?.name}
                        </span>
                        <span className="flex items-center gap-1.5 text-slate-500 text-sm">
                            <Calendar size={14} className="text-slate-400" />
                            {new Date(currentGig.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                    </div>

                    <p className="text-slate-500 leading-relaxed text-sm mb-5">{currentGig.description}</p>

                    {!isOwner && currentGig.status === "open" && isAuthenticated && !bidSuccess && (
                        <button
                            onClick={() => setShowBidForm(true)}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95 shadow-sm"
                        >
                            <Send size={14} /> Submit Bid
                        </button>
                    )}
                </div>

                {/* Bid Form */}
                {showBidForm && !bidSuccess && (
                    <div className="bg-white border border-slate-200 rounded-2xl p-7 shadow-sm mb-6">
                        <h2 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2">
                            <MessageSquare size={16} className="text-indigo-600" /> Your Proposal
                        </h2>
                        <form onSubmit={handleBidSubmit} className="space-y-4">
                            <textarea
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all text-sm resize-none"
                                placeholder="Describe your approach, experience, and timeline..."
                                rows={4}
                                required
                                value={bidData.message}
                                onChange={(e) => setBidData({ ...bidData, message: e.target.value })}
                            />
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
                                <input
                                    type="number"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-3.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
                                    placeholder="Your price"
                                    required
                                    value={bidData.price}
                                    onChange={(e) => setBidData({ ...bidData, price: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-3 pt-1">
                                <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95 shadow-sm">
                                    Submit Bid
                                </button>
                                <button type="button" onClick={() => setShowBidForm(false)}
                                    className="px-5 border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 hover:bg-slate-50 py-2.5 rounded-xl text-sm transition-all">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Bids Owner View */}
                {isOwner && bids.length > 0 && (
                    <div>
                        <h2 className="text-base font-bold text-slate-900 mb-4">
                            Proposals <span className="text-indigo-600">({bids.length})</span>
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {bids.map((bid) => (
                                <BidCard key={bid._id} bid={bid} isOwner={isOwner} onHire={hireBid} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}