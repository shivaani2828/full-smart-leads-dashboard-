import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
    const { register, isAuthenticated, loading, error } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

   async function handleSubmit(e) {
    e.preventDefault();
    try {
      await register({ name, email, password });
      navigate("/");
    } catch (err) {
      console.error("Registration failed:", err.message);
    }
  }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="border p-6 w-full max-w-sm space-y-4"
            >
                <h1 className="text-xl font-bold text-center">Register</h1>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <input
                    type="text"
                    placeholder="Name"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full border p-2"
                />

                <input
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full border p-2"
                />

                <input
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full border p-2"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-2"
                >
                    {loading ? "Creating account..." : "Register"}
                </button>

                <p className="text-sm text-center">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
}
