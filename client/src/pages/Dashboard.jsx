import { useState, useEffect, useContext } from 'react';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import { Users, CheckSquare, Clock, CheckCircle2, Search, Bell } from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { AuthContext } from '../AuthContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', tasks: 400 },
  { name: 'Feb', tasks: 300 },
  { name: 'Mar', tasks: 500 },
  { name: 'Apr', tasks: 800 },
  { name: 'May', tasks: 600 },
  { name: 'Jun', tasks: 900 },
];

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalTasks: 0,
        pendingTasks: 0,
        completedTasks: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [studentsRes, tasksRes] = await Promise.all([
                    api.get('/students?limit=1'),
                    api.get('/tasks?limit=1000')
                ]);

                const tasks = tasksRes.data.tasks || tasksRes.data;
                const completed = tasks.filter(t => t.status === 'completed').length;

                const totalStudents = studentsRes.data.total !== undefined ? studentsRes.data.total : studentsRes.data.length;
                const totalTasks = tasksRes.data.total !== undefined ? tasksRes.data.total : tasks.length;
                
                setStats({
                    totalStudents: totalStudents,
                    totalTasks: totalTasks,
                    pendingTasks: totalTasks - completed,
                    completedTasks: completed
                });
            } catch (err) {
                toast.error('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Create avatar initials
    const initials = user?.name ? user.name.slice(0, 2).toUpperCase() : 'AD';

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-full text-[var(--primary)] font-medium">Loading Dashboard...</div>
            </Layout>
        );
    }

    return (
        <Layout>
            {/* Top Bar Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[var(--text-dark)] leading-tight">Dashboard</h1>
                    <p className="text-[var(--text-muted)] font-medium text-sm">Welcome back, {user?.name}</p>
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            className="w-full bg-white border-none rounded-full py-2.5 pl-12 pr-4 shadow-sm text-sm focus:ring-2 focus:ring-[var(--primary-light)] outline-none"
                            placeholder="Search anything..."
                        />
                    </div>
                    <button className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-[var(--primary)] transition-colors">
                        <Bell size={18} />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-[var(--primary)] text-white font-bold flex items-center justify-center shadow-md">
                        {initials}
                    </div>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Students" value={stats.totalStudents} icon={<Users size={24} />} color="violet" delay={0.1} />
                <StatCard title="Total Tasks" value={stats.totalTasks} icon={<CheckSquare size={24} />} color="pink" delay={0.2} />
                <StatCard title="Pending Tasks" value={stats.pendingTasks} icon={<Clock size={24} />} color="violet" delay={0.3} />
                <StatCard title="Completed Tasks" value={stats.completedTasks} icon={<CheckCircle2 size={24} />} color="pink" delay={0.4} />
            </div>
            
            {/* Main Dash Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Chart Area */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                    className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-[var(--text-dark)]">Task Overview</h2>
                        <select className="bg-[var(--bg-page)] border-none text-sm font-medium rounded-full px-4 py-1.5 outline-none cursor-pointer text-[var(--text-dark)]">
                            <option>Monthly</option>
                            <option>Weekly</option>
                        </select>
                    </div>
                    <div className="flex-1 min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Area type="monotone" dataKey="tasks" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorTasks)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Activity Cards */}
                <div className="space-y-6">
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
                        className="bg-[var(--secondary-light)] rounded-3xl p-6 h-48 flex flex-col justify-between"
                    >
                        <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center text-[var(--secondary)]">
                            <Clock size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-[var(--text-dark)] text-lg mb-1">Recent Activity</h3>
                            <p className="text-sm text-[var(--text-dark)]/70">3 new tasks pending review</p>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}
                        className="bg-[var(--primary-light)] rounded-3xl p-6 h-48 flex flex-col justify-between"
                    >
                        <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center text-[var(--primary)]">
                            <CheckCircle2 size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-[var(--text-dark)] text-lg mb-1">Weekly Goal</h3>
                            <p className="text-sm text-[var(--text-dark)]/70">85% of assigned tasks completed</p>
                        </div>
                    </motion.div>
                </div>
            </div>
            
        </Layout>
    );
};

export default Dashboard;
