import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import StudentModal from '../components/StudentModal';
import { UserPlus, Edit2, Trash2 } from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const StudentsPage = () => {
    const [students, setStudents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchStudents = async () => {
        try {
            const res = await api.get('/students');
            setStudents(res.data);
        } catch (err) {
            toast.error('Failed to load students', { style: { background: '#1e293b', color: '#fff' } });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleAddOrEdit = async (data) => {
        try {
            if (editingStudent) {
                await api.put(`/students/${editingStudent._id}`, data);
                toast.success('Student updated!', { style: { background: '#1e293b', color: '#fff' } });
            } else {
                await api.post('/students', data);
                toast.success('Student added!', { style: { background: '#1e293b', color: '#fff' } });
            }
            fetchStudents();
            setIsModalOpen(false);
            setEditingStudent(null);
        } catch (err) {
            toast.error('Operation failed', { style: { background: '#1e293b', color: '#fff' } });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this student?')) return;
        try {
            await api.delete(`/students/${id}`);
            toast.success('Student deleted', { style: { background: '#1e293b', color: '#fff' } });
            fetchStudents();
        } catch (err) {
            toast.error('Failed to delete student', { style: { background: '#1e293b', color: '#fff' } });
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
                        Students Directory
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="text-slate-400">
                        Manage all enrolled students
                    </motion.p>
                </div>
                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                    onClick={() => { setEditingStudent(null); setIsModalOpen(true); }}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20"
                >
                    <UserPlus size={18} /> Add Student
                </motion.button>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                {loading ? (
                    <div className="p-8 text-center text-slate-400">Loading students...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-800 bg-slate-900">
                                    <th className="p-4 text-slate-300 font-medium">Name</th>
                                    <th className="p-4 text-slate-300 font-medium whitespace-nowrap">Roll No</th>
                                    <th className="p-4 text-slate-300 font-medium">Class</th>
                                    <th className="p-4 text-slate-300 font-medium">Contact</th>
                                    <th className="p-4 text-slate-300 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-slate-500">No students found. Add one above!</td>
                                    </tr>
                                ) : (
                                    students.map((student, i) => (
                                        <motion.tr 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            key={student._id} 
                                            className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                                        >
                                            <td className="p-4">
                                                <div className="font-medium text-white">{student.name}</div>
                                            </td>
                                            <td className="p-4 text-slate-300">{student.rollNumber}</td>
                                            <td className="p-4 text-slate-300 whitespace-nowrap">Class {student.class}</td>
                                            <td className="p-4">
                                                <div className="text-sm text-slate-300">{student.email || 'N/A'}</div>
                                                <div className="text-sm text-slate-500">{student.phone || 'N/A'}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex justify-end gap-2">
                                                    <button 
                                                        onClick={() => { setEditingStudent(student); setIsModalOpen(true); }}
                                                        className="p-2 text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(student._id)}
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

            <StudentModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSubmit={handleAddOrEdit}
                initialData={editingStudent}
            />
        </Layout>
    );
};

export default StudentsPage;
