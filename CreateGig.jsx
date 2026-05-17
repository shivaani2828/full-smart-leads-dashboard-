import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGig } from "../context/GigContext.jsx";
import { Briefcase, IndianRupeeIcon } from "lucide-react";

export default function CreateGig() {
    const navigate = useNavigate();
    const { createGig, loading, error } = useGig();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [budget, setBudget] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        if (!title || !description || !budget) { alert("Please fill all fields"); return; }
        if (budget <= 0) { alert("Budget must be greater than 0"); return; }
        await createGig({ title, description, budget });
        navigate("/dashboard");
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-lg">

                {/* Header */}
                <div className="text-center mb-7">
                    <div className="w-11 h-11 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Briefcase className="h-5 w-5 text-indigo-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Post a New Gig</h2>
                    <p className="text-slate-400 text-sm mt-1.5">Describe your project and set a budget</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-7 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Gig Title</label>
                            <input
                                type="text"
                                placeholder="e.g. Build a React dashboard"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Description</label>
                            <textarea
                                placeholder="Describe what you need, requirements, timeline..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows="5"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all text-sm resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Budget</label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                    <IndianRupeeIcon size={15} />
                                </span>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={budget}
                                    onChange={(e) => setBudget(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>
                        )}

                        <div className="flex gap-3 pt-1">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold text-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                            >
                                {loading ? "Creating..." : "Post Gig"}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="flex-1 border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 hover:bg-slate-50 py-3 rounded-xl text-sm transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}