import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const StudentModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black text-[var(--text-dark)]">
                                {initialData ? 'Edit Student' : 'Add New Student'}
                            </h2>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:text-[var(--text-dark)] hover:bg-gray-200 transition-colors flex items-center justify-center"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            onSubmit(Object.fromEntries(formData));
                        }} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-[var(--text-dark)] mb-1">Name</label>
                                <input
                                    required
                                    name="name"
                                    defaultValue={initialData?.name || ''}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[var(--text-dark)] focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition-all font-medium placeholder-gray-400"
                                    placeholder="e.g. Rahul Sharma"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-[var(--text-dark)] mb-1">Class</label>
                                    <input
                                        required
                                        name="class"
                                        defaultValue={initialData?.class || ''}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[var(--text-dark)] focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition-all font-medium placeholder-gray-400"
                                        placeholder="e.g. 10"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-[var(--text-dark)] mb-1">Roll Number</label>
                                    <input
                                        required
                                        name="rollNumber"
                                        defaultValue={initialData?.rollNumber || ''}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[var(--text-dark)] focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition-all font-medium placeholder-gray-400"
                                        placeholder="e.g. 01"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[var(--text-dark)] mb-1">Email <span className="text-gray-400 font-normal text-xs">(optional)</span></label>
                                <input
                                    type="email"
                                    name="email"
                                    defaultValue={initialData?.email || ''}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[var(--text-dark)] focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition-all font-medium placeholder-gray-400"
                                    placeholder="Email Address"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[var(--text-dark)] mb-1">Phone <span className="text-gray-400 font-normal text-xs">(optional)</span></label>
                                <input
                                    name="phone"
                                    defaultValue={initialData?.phone || ''}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[var(--text-dark)] focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition-all font-medium placeholder-gray-400"
                                    placeholder="Phone Number"
                                />
                            </div>
                            
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="w-full py-4 rounded-xl bg-[var(--primary)] text-white font-bold hover:bg-violet-700 hover:scale-[1.03] transform transition-all shadow-md active:scale-95"
                                >
                                    {initialData ? 'Save Changes' : 'Add Student'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default StudentModal;
