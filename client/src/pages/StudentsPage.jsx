import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import StudentModal from '../components/StudentModal';
import { UserPlus, Edit2, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const StudentsPage = () => {
    const [students, setStudents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [debounceSearch, setDebounceSearch] = useState('');
    const [classFilter, setClassFilter] = useState('all');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebounceSearch(searchQuery);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/students?page=${page}&limit=10&search=${debounceSearch}&classFilter=${classFilter}`);
            setStudents(res.data.students);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            toast.error('Failed to load students');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, [page, debounceSearch, classFilter]);

    const handleAddOrEdit = async (data) => {
        try {
            if (editingStudent) {
                await api.put(`/students/${editingStudent._id}`, data);
                toast.success('Student updated!');
            } else {
                await api.post('/students', data);
                toast.success('Student added!');
            }
            fetchStudents();
            setIsModalOpen(false);
            setEditingStudent(null);
        } catch (err) {
            toast.error('Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this student?')) return;
        try {
            await api.delete(`/students/${id}`);
            toast.success('Student deleted');
            fetchStudents();
        } catch (err) {
            toast.error('Failed to delete student');
        }
    };

    return (
        <Layout>
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <motion.h1 
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                        className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] mb-2 inline-block pt-2"
                    >
                        Students Directory
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="text-[var(--text-muted)] font-medium">
                        Manage all enrolled students
                    </motion.p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by name or roll..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border-none rounded-full py-3 pl-12 pr-4 shadow-sm text-sm focus:ring-2 focus:ring-[var(--primary-light)] outline-none font-medium"
                        />
                    </div>
                    <div className="relative w-full sm:w-44">
                        <select 
                            value={classFilter}
                            onChange={(e) => { setClassFilter(e.target.value); setPage(1); }}
                            className="w-full bg-white border-none rounded-full py-3 px-6 shadow-sm text-sm focus:ring-2 focus:ring-[var(--primary-light)] outline-none font-medium appearance-none cursor-pointer"
                        >
                            <option value="all">All Classes</option>
                            <option value="9">Class 9</option>
                            <option value="10">Class 10</option>
                            <option value="11">Class 11</option>
                            <option value="12">Class 12</option>
                        </select>
                    </div>
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { setEditingStudent(null); setIsModalOpen(true); }}
                        className="flex items-center justify-center gap-2 bg-[var(--primary)] text-white px-6 py-3 w-full sm:w-auto rounded-full font-bold shadow-md shadow-purple-500/30 whitespace-nowrap"
                    >
                        <UserPlus size={20} /> Add Student
                    </motion.button>
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 flex flex-col min-h-[500px] overflow-hidden">
                {loading ? (
                    <div className="flex-1 flex items-center justify-center text-[var(--primary)] font-medium">Loading students...</div>
                ) : (
                    <>
                        <div className="overflow-x-auto flex-1 p-2">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[var(--primary-light)] rounded-2xl">
                                        <th className="p-5 text-[var(--text-dark)] font-bold rounded-l-2xl">Student</th>
                                        <th className="p-5 text-[var(--text-dark)] font-bold whitespace-nowrap">Roll No</th>
                                        <th className="p-5 text-[var(--text-dark)] font-bold whitespace-nowrap">Class</th>
                                        <th className="p-5 text-[var(--text-dark)] font-bold">Contact</th>
                                        <th className="p-5 text-[var(--text-dark)] font-bold text-right rounded-r-2xl">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="p-12 text-center text-gray-400 font-medium">
                                                No students found matching your criteria.
                                            </td>
                                        </tr>
                                    ) : (
                                        <AnimatePresence>
                                        {students.map((student, i) => (
                                            <motion.tr 
                                                initial={{ opacity: 0, y: 15 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                transition={{ delay: i * 0.05 }}
                                                key={student._id} 
                                                className="group border-b border-gray-50 last:border-0 hover:bg-[var(--primary-light)] transition-colors duration-200"
                                            >
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                                                            {student.name.slice(0,2).toUpperCase()}
                                                        </div>
                                                        <div className="font-bold text-[var(--text-dark)]">{student.name}</div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-[var(--muted)] font-medium">{student.rollNumber}</td>
                                                <td className="p-4 text-[var(--muted)] font-medium whitespace-nowrap">Class {student.class}</td>
                                                <td className="p-4">
                                                    <div className="text-sm font-medium text-[var(--text-dark)]">{student.email || 'N/A'}</div>
                                                    <div className="text-sm text-[var(--muted)]">{student.phone || 'N/A'}</div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex justify-end gap-2">
                                                        <motion.button 
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => { setEditingStudent(student); setIsModalOpen(true); }}
                                                            className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--primary)] bg-[var(--primary-light)] opacity-0 group-hover:opacity-100 transition-all duration-200"
                                                        >
                                                            <Edit2 size={18} />
                                                        </motion.button>
                                                        <motion.button 
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => handleDelete(student._id)}
                                                            className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--danger)] bg-rose-50 opacity-0 group-hover:opacity-100 transition-all duration-200"
                                                        >
                                                            <Trash2 size={18} />
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
