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
            toast.error('Failed to load announcements', { style: { background: '#1e293b', color: '#fff' } });
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
            toast.success('Announcement broadcasted!', { style: { background: '#1e293b', color: '#fff' } });
            fetchAnnouncements();
            e.target.reset(); // clear form
        } catch (err) {
            toast.error('Failed to post announcement', { style: { background: '#1e293b', color: '#fff' } });
        } finally {
            setIsPosting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this announcement?')) return;
        try {
            await api.delete(`/announcements/${id}`);
            toast.success('Deleted', { style: { background: '#1e293b', color: '#fff' } });
            fetchAnnouncements();
        } catch (err) {
            toast.error('Failed to delete', { style: { background: '#1e293b', color: '#fff' } });
        }
    };

    return (
        <Layout>
            <div className="mb-8">
                <motion.h1 
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    className="text-3xl font-bold text-white mb-2"
                >
                    Announcements
                </motion.h1>
                <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="text-slate-400">
                    Broadcast messages to specific classes or the entire school.
                </motion.p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Broadcast Form */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="lg:col-span-1"
                >
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl sticky top-8">
                        <div className="flex items-center gap-2 mb-6 text-indigo-400">
                            <Megaphone size={20} />
                            <h2 className="text-lg font-bold text-white">New Broadcast</h2>
                        </div>
                        
                        <form onSubmit={handlePost} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
                                <input
                                    required
                                    name="title"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none"
                                    placeholder="e.g. Science Fair Tomorrow!"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Target Class</label>
                                <select
                                    name="targetClass"
                                    defaultValue="All"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none appearance-none"
                                >
                                    <option value="All">All Classes (School-wide)</option>
                                    <option value="9">Class 9</option>
                                    <option value="10">Class 10</option>
                                    <option value="11">Class 11</option>
                                    <option value="12">Class 12</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Message</label>
                                <textarea
                                    required
                                    name="content"
                                    rows="4"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none resize-none"
                                    placeholder="Type your message here..."
                                />
                            </div>
                            <button
                                disabled={isPosting}
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 text-white font-medium mt-4 hover:bg-indigo-500 hover:scale-[1.02] transform transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                            >
                                <Send size={18} /> {isPosting ? 'Sending...' : 'Broadcast'}
                            </button>
                        </form>
                    </div>
                </motion.div>

                {/* Feed */}
                <div className="lg:col-span-2 space-y-4">
                    {loading ? (
                        <div className="p-8 text-center text-slate-400">Loading feed...</div>
                    ) : announcements.length === 0 ? (
                        <div className="p-12 text-center border border-slate-800 rounded-2xl bg-slate-900/50 text-slate-500">
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
                                    className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg relative group transition-colors hover:border-slate-700"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex flex-col">
                                            <h3 className="text-xl font-bold text-white mb-1">{ann.title}</h3>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${ann.targetClass === 'All' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                                    To: {ann.targetClass === 'All' ? 'Everyone' : `Class ${ann.targetClass}`}
                                                </span>
                                                <span className="text-xs text-slate-500 uppercase tracking-wider">
                                                    {new Date(ann.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleDelete(ann._id)}
                                            className="p-2 text-rose-400/50 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{ann.content}</p>
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
