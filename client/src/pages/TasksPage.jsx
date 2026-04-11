import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import Layout from '../components/Layout';
import TaskModal from '../components/TaskModal';
import { CheckSquare, Edit2, Trash2, CheckCircle2, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const TasksPage = () => {
    const { user } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [students, setStudents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [debounceSearch, setDebounceSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebounceSearch(searchQuery);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [tasksRes, studentsRes] = await Promise.all([
                api.get(`/tasks?page=${page}&limit=10&search=${debounceSearch}&status=${statusFilter}`),
                api.get('/students?limit=1000')
            ]);
            setTasks(tasksRes.data.tasks);
            setTotalPages(tasksRes.data.totalPages);
            setStudents(studentsRes.data.students || studentsRes.data); 
        } catch (err) {
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, debounceSearch, statusFilter]);

    const handleAddOrEdit = async (data) => {
        try {
            if (editingTask) {
                await api.put(`/tasks/${editingTask._id}`, data);
                toast.success('Task updated!');
            } else {
                await api.post('/tasks', data);
                toast.success('Task assigned!');
            }
            fetchData();
            setIsModalOpen(false);
            setEditingTask(null);
        } catch (err) {
            toast.error('Operation failed');
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/tasks/${id}`);
            toast.success('Task deleted');
            fetchData();
        } catch (err) {
            toast.error('Failed to delete task');
        }
    };

    const handleToggleComplete = async (task) => {
        try {
            const newStatus = task.status === 'completed' ? 'pending' : 'completed';
            await api.put(`/tasks/${task._id}`, { status: newStatus });
            toast.success(`Task marked as ${newStatus}`);
            fetchData();
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    return (
        <Layout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <motion.h1 
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                        className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] mb-2 inline-block pt-2"
                    >
                        Task Management
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="text-[var(--text-muted)] font-medium">
                        Assign and track student tasks
                    </motion.p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    <div className="relative w-full sm:w-56">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border-none rounded-full py-3 pl-12 pr-4 shadow-sm text-sm focus:ring-2 focus:ring-[var(--primary-light)] outline-none font-medium"
                        />
                    </div>
                    <div className="relative w-full sm:w-40">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                        <select 
                            value={statusFilter}
                            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                            className="w-full bg-white border-none rounded-full py-3 pl-12 pr-10 shadow-sm text-sm focus:ring-2 focus:ring-[var(--primary-light)] outline-none font-medium appearance-none"
                        >
                            <option value="all">All Tasks</option>
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
                        className="flex items-center justify-center gap-2 bg-[var(--primary)] text-white px-6 py-3 w-full sm:w-auto rounded-full font-bold shadow-md shadow-purple-500/30 whitespace-nowrap"
                    >
                        <CheckSquare size={20} /> Assign Task
                    </motion.button>
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 flex flex-col min-h-[500px] overflow-hidden">
                {loading ? (
                    <div className="flex-1 flex items-center justify-center text-[var(--primary)] font-medium">Loading tasks...</div>
                ) : (
                    <>
                        <div className="overflow-x-auto flex-1 p-2">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[var(--primary-light)] rounded-2xl">
                                        <th className="p-5 text-[var(--text-dark)] font-bold rounded-l-2xl">Task Details</th>
                                        <th className="p-5 text-[var(--text-dark)] font-bold">Assigned To</th>
                                        <th className="p-5 text-[var(--text-dark)] font-bold whitespace-nowrap">Due Date</th>
                                        <th className="p-5 text-[var(--text-dark)] font-bold">Status</th>
                                        <th className="p-5 text-[var(--text-dark)] font-bold text-right rounded-r-2xl">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tasks.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="p-12 text-center text-gray-400 font-medium">
                                                No tasks found for your selection.
                                            </td>
                                        </tr>
                                    ) : (
                                        <AnimatePresence>
                                        {tasks.map((task, i) => (
                                            <motion.tr 
                                                initial={{ opacity: 0, y: 15 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                transition={{ delay: i * 0.05 }}
                                                key={task._id} 
                                                className="group border-b border-gray-50 last:border-0 hover:bg-[var(--primary-light)] transition-colors duration-200"
                                            >
                                                <td className="p-4 w-1/3">
                                                    <div className={`font-bold ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-[var(--text-dark)]'}`}>
                                                        {task.title}
                                                    </div>
                                                    <div className="text-sm font-medium text-[var(--muted)] truncate max-w-[250px]">{task.description}</div>
                                                </td>
                                                <td className="p-4 w-1/4">
                                                    {task.assignedTo ? (
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-[var(--secondary-light)] text-[var(--secondary)] flex items-center justify-center font-bold text-xs shadow-sm">
                                                                {task.assignedTo.name.slice(0,2).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-[var(--text-dark)] text-sm">{task.assignedTo.name}</div>
                                                                <div className="text-xs font-medium text-[var(--muted)]">Roll: {task.assignedTo.rollNumber}</div>
                                                            </div>
                                                        </div>
                                                    ) : <span className="text-sm text-gray-400 font-medium">Unassigned</span>}
                                                </td>
                                                <td className="p-4 text-[var(--muted)] text-sm whitespace-nowrap font-medium">
                                                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                                                        task.status === 'completed' 
                                                        ? 'bg-emerald-100 text-emerald-700' 
                                                        : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                        {task.status === 'completed' ? 'Completed' : 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex justify-end gap-2 items-center">
                                                        <motion.button 
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => handleToggleComplete(task)}
                                                            className={`h-9 px-3 rounded-full flex items-center justify-center transition-all duration-200 font-bold text-xs border ${
                                                                task.status === 'completed' 
                                                                ? 'text-[var(--muted)] bg-gray-50 border-gray-200 hover:text-[var(--dark)]' 
                                                                : 'text-[var(--success)] border-[var(--success)] bg-white hover:bg-emerald-50'
                                                            }`}
                                                            title={task.status === 'completed' ? 'Mark Pending' : 'Mark Completed'}
                                                        >
                                                            {task.status === 'completed' ? 'Undo' : 'Mark Done'}
                                                        </motion.button>
                                                        <motion.button 
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => { setEditingTask(task); setIsModalOpen(true); }}
                                                            className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--primary)] bg-[var(--primary-light)] opacity-0 group-hover:opacity-100 transition-all duration-200"
                                                        >
                                                            <Edit2 size={16} />
                                                        </motion.button>
                                                        <motion.button 
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => handleDelete(task._id)}
                                                            className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--danger)] bg-rose-50 opacity-0 group-hover:opacity-100 transition-all duration-200"
                                                        >
                                                            <Trash2 size={16} />
                                                        </motion.button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                        </AnimatePresence>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Pagination Footer */}
                        {totalPages > 0 && (
                            <div className="border-t border-gray-100 bg-white/50 p-4 px-6 flex items-center justify-between rounded-b-[2rem]">
                                <span className="text-sm font-medium text-[var(--muted)]">
                                    Page {page} of {totalPages}
                                </span>
                                <div className="flex items-center gap-2">
                                    <button
                                        disabled={page === 1}
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button
                                        disabled={page === totalPages}
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            <TaskModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSubmit={handleAddOrEdit}
                students={students}
                initialData={editingTask}
            />
        </Layout>
    );
};

export default TasksPage;
