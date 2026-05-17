import { Link } from "react-router-dom";
import { IndianRupeeIcon, ArrowUpRight } from "lucide-react";

export default function GigCard({ gig }) {
  return (
    <div className="group bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg hover:border-indigo-200 transition-all duration-200 flex flex-col">

      <div className="flex items-start justify-between mb-3">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
          gig.status === "open"
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : "bg-sky-50 text-sky-700 border-sky-200"
        }`}>
          {gig.status === "open" ? "Open" : "Assigned"}
        </span>
        <span className="flex items-center gap-0.5 font-bold text-slate-900 text-base">
          <IndianRupeeIcon size={14} className="text-slate-500" />
          {gig.budget}
        </span>
      </div>

      <h3 className="text-sm font-semibold text-slate-800 mb-2 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors duration-200">
        {gig.title}
      </h3>

      <p className="text-slate-400 text-sm mb-4 line-clamp-3 leading-relaxed flex-1">
        {gig.description}
      </p>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <p className="text-xs text-slate-400">
          by <span className="text-slate-600 font-medium">{gig.ownerId?.name || "Unknown"}</span>
        </p>
        <Link
          to={`/gigs/${gig._id}`}
          className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          View Details
          <ArrowUpRight size={13} />
        </Link>
      </div>
    </div>
  );
}