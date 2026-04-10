import Navbar from './Navbar';
import { motion } from 'framer-motion';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-[var(--bg-page)] p-4 sm:p-6 md:p-8 lg:p-12 flex justify-center custom-scrollbar">
            {/* The outer floating white app container */}
            <div className="w-full max-w-[1600px] bg-[var(--bg-card)] rounded-[2.5rem] shadow-2xl shadow-indigo-500/10 flex p-4 gap-4 overflow-hidden relative border border-white">
                
                {/* Narrow pill sidebar */}
                <Navbar />
                
                {/* Main Content Area */}
                <div className="flex-1 bg-[#f5f3ff] rounded-3xl overflow-hidden relative flex flex-col shadow-inner border border-violet-100/50">
                    <main className="flex-1 overflow-y-auto px-6 py-8 md:px-10 lg:px-12 w-full custom-scrollbar relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {children}
                        </motion.div>
                    </main>
                </div>

            </div>
        </div>
    );
};

export default Layout;
