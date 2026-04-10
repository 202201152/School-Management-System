import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Megaphone, Trash2, Send } from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const AnnouncementsPage = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPosting, setIsPosting] = useState(false);

    const fetchAnnouncements = async () => {
        try {
            const res = await api.get('/announcements');
            setAnnouncements(res.data);
        } catch (err) {
            toast.error('Failed to load announcements');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const handlePost = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        setIsPosting(true);
        try {
            await api.post('/announcements', data);
            toast.success('Announcement broadcasted!');
            fetchAnnouncements();
            e.target.reset(); // clear form
        } catch (err) {
            toast.error('Failed to post announcement');
        } finally {
            setIsPosting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this announcement?')) return;
        try {
            await api.delete(`/announcements/${id}`);
            toast.success('Deleted');
            fetchAnnouncements();
        } catch (err) {
            toast.error('Failed to delete');
        }
    };

    return (
        <Layout>
            <div className="mb-8">
                <motion.h1 
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] mb-2 inline-block pt-2"
                >
                    Announcements
                </motion.h1>
                <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="text-[var(--text-muted)] font-medium">
                    Broadcast messages to specific classes or the entire school.
                </motion.p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Broadcast Form */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="lg:col-span-1"
                >
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 sticky top-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-[var(--primary-light)] flex items-center justify-center text-[var(--primary)]">
                                <Megaphone size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-[var(--text-dark)]">New Broadcast</h2>
                        </div>
                        
                        <form onSubmit={handlePost} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-[var(--text-dark)] mb-2">Title</label>
                                <input
                                    required
                                    name="title"
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[var(--text-dark)] font-medium focus:ring-4 focus:ring-[var(--primary-light)] outline-none transition-all placeholder-gray-400"
                                    placeholder="e.g. Science Fair Tomorrow!"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[var(--text-dark)] mb-2">Target Class</label>
                                <select
                                    name="targetClass"
                                    defaultValue="All"
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[var(--text-dark)] font-medium focus:ring-4 focus:ring-[var(--primary-light)] outline-none appearance-none transition-all"
                                >
                                    <option value="All">All Classes (School-wide)</option>
                                    <option value="9">Class 9</option>
                                    <option value="10">Class 10</option>
                                    <option value="11">Class 11</option>
                                    <option value="12">Class 12</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[var(--text-dark)] mb-2">Message</label>
                                <textarea
                                    required
                                    name="content"
                                    rows="4"
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[var(--text-dark)] font-medium focus:ring-4 focus:ring-[var(--primary-light)] outline-none resize-none transition-all placeholder-gray-400"
                                    placeholder="Type your message here..."
                                />
                            </div>
                            <button
                                disabled={isPosting}
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-[var(--primary)] text-white font-bold hover:bg-violet-700 hover:scale-[1.03] transform transition-all shadow-md active:scale-95 disabled:opacity-50"
                            >
                                <Send size={18} /> {isPosting ? 'Sending...' : 'Broadcast'}
                            </button>
                        </form>
                    </div>
                </motion.div>

                {/* Feed */}
                <div className="lg:col-span-2 space-y-4">
                    {loading ? (
                        <div className="font-medium text-center text-[var(--primary)] py-12">Loading feed...</div>
                    ) : announcements.length === 0 ? (
                        <div className="p-12 text-center rounded-[2rem] border-2 border-dashed border-gray-200 bg-white/50 text-gray-400 font-medium">
                            No announcements yet. Send a broadcast to get started!
                        </div>
                    ) : (
                        <AnimatePresence>
                            {announcements.map((ann, i) => (
                                <motion.div
                                    key={ann._id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 group transition-all hover:shadow-md"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex flex-col">
                                            <h3 className="text-xl font-bold text-[var(--text-dark)] mb-2">{ann.title}</h3>
                                            <div className="flex items-center gap-3">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${ann.targetClass === 'All' ? 'bg-[var(--primary-light)] text-[var(--primary)]' : 'bg-[var(--secondary-light)] text-[var(--secondary)]'}`}>
                                                    To: {ann.targetClass === 'All' ? 'Everyone' : `Class ${ann.targetClass}`}
                                                </span>
                                                <span className="text-xs text-[var(--muted)] font-medium">
                                                    {new Date(ann.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                        <motion.button 
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleDelete(ann._id)}
                                            className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--danger)]/50 hover:text-[var(--danger)] bg-rose-50 opacity-0 group-hover:opacity-100 transition-all duration-200"
                                        >
                                            <Trash2 size={18} />
                                        </motion.button>
                                    </div>
                                    <p className="text-[var(--text-muted)] font-medium leading-relaxed whitespace-pre-wrap">{ann.content}</p>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default AnnouncementsPage;
