import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Briefcase, LogOut, User, Plus, Home } from 'lucide-react';

export function Navbar() {
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();

    async function handleLogout() {
        await logout();
        navigate('/');
    }

    return (
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14">

                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                            <Briefcase className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-lg font-bold text-slate-900 tracking-tight">
                            Gig<span className="text-indigo-600">Flow</span>
                        </span>
                    </Link>

                    {/* Links */}
                    <div className="flex items-center gap-1">
                        <Link
                            to="/"
                            className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-3 py-2 rounded-lg transition-all text-sm font-medium"
                        >
                            <Home size={15} />
                            <span>Browse</span>
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/create-gig"
                                    className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-3 py-2 rounded-lg transition-all text-sm font-medium"
                                >
                                    <Plus size={15} />
                                    <span>Post Gig</span>
                                </Link>
                                <Link
                                    to="/dashboard"
                                    className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-3 py-2 rounded-lg transition-all text-sm font-medium"
                                >
                                    <User size={15} />
                                    <span>Dashboard</span>
                                </Link>
                                <div className="flex items-center gap-2 ml-2 pl-3 border-l border-slate-200">
                                    <span className="text-slate-400 text-sm">Hi, <span className="text-slate-700 font-medium">{user?.name}</span></span>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-all text-sm font-medium"
                                    >
                                        <LogOut size={15} />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-2 ml-2">
                                <Link to="/login" className="text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-all text-sm font-medium">
                                    Login
                                </Link>
                                <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95 shadow-sm">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}