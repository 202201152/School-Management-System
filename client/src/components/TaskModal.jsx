import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const TaskModal = ({ isOpen, onClose, onSubmit, students, initialData }) => {
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
                                {initialData ? 'Edit Task' : 'Assign New Task'}
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
                                <label className="block text-sm font-bold text-[var(--text-dark)] mb-1">Task Title</label>
                                <input
                                    required
                                    name="title"
                                    defaultValue={initialData?.title || ''}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[var(--text-dark)] focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition-all font-medium placeholder-gray-400"
                                    placeholder="e.g. Complete Science Project"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-[var(--text-dark)] mb-1">Assign To (Student)</label>
                                <select
                                    required
                                    name="assignedTo"
                                    defaultValue={initialData?.assignedTo?._id || initialData?.assignedTo || ''}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[var(--text-dark)] focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition-all font-medium outline-none"
                                >
                                    <option value="" disabled>Select a student</option>
                                    {students.map(s => (
                                        <option key={s._id} value={s._id}>{s.name} (Roll: {s.rollNumber}, Class: {s.class})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-[var(--text-dark)] mb-1">Due Date <span className="text-gray-400 font-normal text-xs">(optional)</span></label>
                                <input
                                    type="date"
                                    name="dueDate"
                                    defaultValue={initialData?.dueDate ? initialData.dueDate.split('T')[0] : ''}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[var(--text-dark)] focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition-all font-medium outline-none [color-scheme:light]"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-[var(--text-dark)] mb-1">Description <span className="text-gray-400 font-normal text-xs">(optional)</span></label>
                                <textarea
                                    name="description"
                                    rows="3"
                                    defaultValue={initialData?.description || ''}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[var(--text-dark)] focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition-all font-medium placeholder-gray-400 resize-none"
                                    placeholder="Brief details about the task..."
                                />
                            </div>
                            
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="w-full py-4 rounded-xl bg-[var(--primary)] text-white font-bold hover:bg-violet-700 hover:scale-[1.03] transform transition-all shadow-md active:scale-95"
                                >
                                    {initialData ? 'Save Changes' : 'Assign Task'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default TaskModal;
