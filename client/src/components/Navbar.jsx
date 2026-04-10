import { NavLink, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { LayoutDashboard, Users, CheckSquare, LogOut, Megaphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={24} /> },
        { name: 'Students', path: '/students', icon: <Users size={24} /> },
        { name: 'Tasks', path: '/tasks', icon: <CheckSquare size={24} /> },
        { name: 'Announcements', path: '/announcements', icon: <Megaphone size={24} /> },
    ];

    return (
        <nav className="w-20 bg-[var(--primary)] rounded-3xl flex flex-col justify-between items-center py-8 shadow-xl shadow-purple-500/20 z-20 shrink-0">
            {/* Top Logo minimal */}
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner mb-6 z-10">
                <span className="text-white font-black text-xl tracking-tighter">S</span>
            </div>

            <div className="flex flex-col items-center gap-6 flex-1 w-full relative">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className="relative w-12 h-12 flex items-center justify-center rounded-2xl group transition-all"
                        title={item.name}
                    >
                        {({ isActive }) => (
                            <>
                                {/* Active State Background Glow */}
                                <AnimatePresence>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeSidebarTab"
                                            className="absolute inset-0 bg-white rounded-2xl shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                        />
                                    )}
                                </AnimatePresence>

                                {/* Icon Holder */}
                                <motion.div 
                                    className={`relative z-10 flex items-center justify-center transition-colors duration-300 ${isActive ? 'text-[var(--primary)]' : 'text-white/60 group-hover:text-white'}`}
                                    whileHover={{ scale: 1.1 }}
                                >
                                    {item.icon}
                                </motion.div>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>

            {/* Logout Action */}
            <button
                onClick={handleLogout}
                className="w-12 h-12 flex items-center justify-center rounded-2xl text-white/60 hover:text-white hover:bg-white/10 transition-all group"
                title="Logout"
            >
                <motion.div whileHover={{ scale: 1.1 }}>
                    <LogOut size={24} />
                </motion.div>
            </button>
        </nav>
    );
};

export default Navbar;
