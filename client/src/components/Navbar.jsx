import { NavLink, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { LayoutDashboard, Users, CheckSquare, LogOut, Megaphone } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Students', path: '/students', icon: <Users size={20} /> },
        { name: 'Tasks', path: '/tasks', icon: <CheckSquare size={20} /> },
        { name: 'Announcements', path: '/announcements', icon: <Megaphone size={20} /> },
    ];

    return (
        <nav className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0">
            <div>
                <div className="p-6">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
                        EduManage
                    </h1>
                </div>
                <div className="flex flex-col mt-4 space-y-2 px-4">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative ${isActive ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-indigo-600/20 border border-indigo-500/50 rounded-xl"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10">{item.icon}</span>
                                    <span className="relative z-10 font-medium">{item.name}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>
            </div>
            
            <div className="p-4 border-t border-slate-800">
                <div className="mb-4 px-4 text-sm text-slate-400 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                        {user?.name?.charAt(0) || 'A'}
                    </div>
                    <div>
                        <p className="text-white font-medium">{user?.name || 'Admin'}</p>
                        <p className="text-xs">{user?.role || 'Administrator'}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 text-rose-400 hover:text-rose-300 hover:bg-rose-400/10 rounded-xl transition-all duration-300"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
