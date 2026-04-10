import Navbar from './Navbar';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = ({ children }) => {
    return (
        <div className="flex h-screen bg-slate-950 overflow-hidden">
            <Navbar />
            <div className="flex-1 overflow-auto relative">
                {/* Background decorative elements */}
                <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-transparent pointer-events-none" />
                <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none" />
                
                <main className="p-8 relative z-10 w-full max-w-7xl mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
