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
                        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl p-6"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">
                                {initialData ? 'Edit Task' : 'Assign New Task'}
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-slate-400 hover:text-white transition-colors p-1"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            onSubmit(Object.fromEntries(formData));
                        }} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Task Title</label>
                                <input
                                    required
                                    name="title"
                                    defaultValue={initialData?.title || ''}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                    placeholder="e.g. Complete Math Homework"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Assign To (Student)</label>
                                <select
                                    required
                                    name="assignedTo"
                                    defaultValue={initialData?.assignedTo?._id || initialData?.assignedTo || ''}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none"
                                >
                                    <option value="" disabled>Select a student</option>
                                    {students.map(s => (
                                        <option key={s._id} value={s._id}>{s.name} (Roll: {s.rollNumber}, Class: {s.class})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Due Date <span className="text-slate-500 text-xs">(optional)</span></label>
                                <input
                                    type="date"
                                    name="dueDate"
                                    defaultValue={initialData?.dueDate ? initialData.dueDate.split('T')[0] : ''}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 [color-scheme:dark]"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Description <span className="text-slate-500 text-xs">(optional)</span></label>
                                <textarea
                                    name="description"
                                    rows="3"
                                    defaultValue={initialData?.description || ''}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                                    placeholder="Brief details about the task..."
                                />
                            </div>
                            
                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-medium hover:bg-slate-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 hover:scale-[1.02] transform transition-all shadow-lg shadow-indigo-500/20"
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
