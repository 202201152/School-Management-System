import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import { Users, CheckSquare, Clock, CheckCircle2 } from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Dashboard = () => {
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
                    api.get('/students'),
                    api.get('/tasks')
                ]);

                const tasks = tasksRes.data;
                const completed = tasks.filter(t => t.status === 'completed').length;
                
                setStats({
                    totalStudents: studentsRes.data.length,
                    totalTasks: tasks.length,
                    pendingTasks: tasks.length - completed,
                    completedTasks: completed
                });
            } catch (err) {
                toast.error('Failed to load dashboard data', { style: { background: '#1e293b', color: '#fff' } });
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-full text-indigo-400">Loading Dashboard...</div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="mb-8">
                <motion.h1 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-3xl font-bold text-white mb-2"
                >
                    Dashboard Overview
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-slate-400"
                >
                    Welcome back! Here's what's happening today.
                </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Students" 
                    value={stats.totalStudents} 
                    icon={<Users size={24} />} 
                    color="indigo" 
                    delay={0.1} 
                />
                <StatCard 
                    title="Total Tasks" 
                    value={stats.totalTasks} 
                    icon={<CheckSquare size={24} />} 
                    color="emerald" 
                    delay={0.2} 
                />
                <StatCard 
                    title="Pending Tasks" 
                    value={stats.pendingTasks} 
                    icon={<Clock size={24} />} 
                    color="amber" 
                    delay={0.3} 
                />
                <StatCard 
                    title="Completed Tasks" 
                    value={stats.completedTasks} 
                    icon={<CheckCircle2 size={24} />} 
                    color="rose" 
                    delay={0.4} 
                />
            </div>
            
            {/* Can add charts or recent activity lists here in the future */}
        </Layout>
    );
};

export default Dashboard;
