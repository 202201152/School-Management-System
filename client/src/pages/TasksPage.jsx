import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import TaskModal from '../components/TaskModal';
import { CheckSquare, Edit2, Trash2, CheckCircle2 } from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const TasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [students, setStudents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [tasksRes, studentsRes] = await Promise.all([
                api.get('/tasks'),
                api.get('/students')
            ]);
            setTasks(tasksRes.data);
            setStudents(studentsRes.data);
        } catch (err) {
            toast.error('Failed to load data', { style: { background: '#1e293b', color: '#fff' } });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddOrEdit = async (data) => {
        try {
            if (editingTask) {
                await api.put(`/tasks/${editingTask._id}`, data);
                toast.success('Task updated!', { style: { background: '#1e293b', color: '#fff' } });
            } else {
                await api.post('/tasks', data);
                toast.success('Task assigned!', { style: { background: '#1e293b', color: '#fff' } });
            }
            fetchData();
            setIsModalOpen(false);
            setEditingTask(null);
        } catch (err) {
            toast.error('Operation failed', { style: { background: '#1e293b', color: '#fff' } });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        try {
            await api.delete(`/tasks/${id}`);
            toast.success('Task deleted', { style: { background: '#1e293b', color: '#fff' } });
            fetchData();
        } catch (err) {
            toast.error('Failed to delete task', { style: { background: '#1e293b', color: '#fff' } });
        }
    };

    const handleToggleComplete = async (task) => {
        try {
            const newStatus = task.status === 'completed' ? 'pending' : 'completed';
            await api.put(`/tasks/${task._id}`, { status: newStatus });
            toast.success(`Task marked as ${newStatus}`, { style: { background: '#1e293b', color: '#fff' } });
            fetchData();
        } catch (err) {
            toast.error('Failed to update status', { style: { background: '#1e293b', color: '#fff' } });
        }
    };

    return (
        <Layout>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <motion.h1 
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                        className="text-3xl font-bold text-white mb-2"
                    >
                        Task Management
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="text-slate-400">
                        Assign and track student tasks
                    </motion.p>
                </div>
                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                    onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20"
                >
                    <CheckSquare size={18} /> Assign Task
                </motion.button>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                {loading ? (
                    <div className="p-8 text-center text-slate-400">Loading tasks...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-800 bg-slate-900">
                                    <th className="p-4 text-slate-300 font-medium">Task Details</th>
                                    <th className="p-4 text-slate-300 font-medium">Assigned To</th>
                                    <th className="p-4 text-slate-300 font-medium">Due Date</th>
                                    <th className="p-4 text-slate-300 font-medium">Status</th>
                                    <th className="p-4 text-slate-300 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-slate-500">No tasks found. Assign one above!</td>
                                    </tr>
                                ) : (
                                    tasks.map((task, i) => (
                                        <motion.tr 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            key={task._id} 
                                            className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                                        >
                                            <td className="p-4">
                                                <div className={`font-medium ${task.status === 'completed' ? 'text-slate-500 line-through' : 'text-white'}`}>
                                                    {task.title}
                                                </div>
                                                <div className="text-sm text-slate-400 truncate max-w-xs">{task.description}</div>
                                            </td>
                                            <td className="p-4">
                                                {task.assignedTo ? (
                                                    <div>
                                                        <div className="text-white text-sm font-medium">{task.assignedTo.name}</div>
                                                        <div className="text-xs text-slate-500">Rol: {task.assignedTo.rollNumber}</div>
                                                    </div>
                                                ) : <span className="text-slate-500 text-sm">Unassigned</span>}
                                            </td>
                                            <td className="p-4 text-slate-300 text-sm whitespace-nowrap">
                                                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                                                    task.status === 'completed' 
                                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                                                    : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                                }`}>
                                                    {task.status === 'completed' ? 'Completed' : 'Pending'}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex justify-end gap-2">
                                                    <button 
                                                        onClick={() => handleToggleComplete(task)}
                                                        className={`p-2 rounded-lg transition-colors ${
                                                            task.status === 'completed' 
                                                            ? 'text-slate-400 hover:bg-slate-700/50 hover:text-white' 
                                                            : 'text-emerald-500 hover:bg-emerald-500/10'
                                                        }`}
                                                        title={task.status === 'completed' ? 'Mark Pending' : 'Mark Completed'}
                                                    >
                                                        <CheckCircle2 size={18} />
                                                    </button>
                                                    <button 
                                                        onClick={() => { setEditingTask(task); setIsModalOpen(true); }}
                                                        className="p-2 text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(task._id)}
                                                        className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
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
