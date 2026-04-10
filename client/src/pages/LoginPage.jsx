import { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const LoginPage = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            await login(email, password);
            toast.success('Login successful!');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center p-4 relative overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                className="w-full max-w-md bg-white rounded-[2rem] p-10 relative z-10 shadow-2xl shadow-indigo-500/10"
            >
                <div className="text-center mb-10">
                    <motion.div 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1 }} 
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="w-20 h-20 bg-[var(--primary)] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-purple-500/30"
                    >
                        <span className="text-white font-black text-4xl tracking-tighter">S</span>
                    </motion.div>
                    <h1 className="text-3xl font-black text-[var(--text-dark)] mb-2">School Admin</h1>
                    <p className="text-[var(--text-muted)] font-medium">Sign in to manage the system</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            required
                            type="email"
                            name="email"
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-[var(--text-dark)] focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition-all font-medium placeholder-gray-400"
                            placeholder="Email address"
                        />
                    </div>
                    <div>
                        <input
                            required
                            type="password"
                            name="password"
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-[var(--text-dark)] focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition-all font-medium placeholder-gray-400"
                            placeholder="Password"
                        />
                    </div>
                    
                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-bold mt-2 shadow-lg shadow-purple-500/20 active:scale-95 transition-all outline-none"
                    >
                        <motion.div whileHover={ loading ? {} : { scale: 1.05 } } transition={{ duration: 0.1 }}>
                            {loading ? 'Authenticating...' : 'Sign In'}
                        </motion.div>
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default LoginPage;
