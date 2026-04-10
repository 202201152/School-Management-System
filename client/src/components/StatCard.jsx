import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, delay = 0, color = 'indigo' }) => {
    const colorClasses = {
        indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
        emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        rose: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
        amber: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay, type: 'spring', bounce: 0.4 }}
            className={`p-6 rounded-2xl border backdrop-blur-md shadow-xl ${colorClasses[color]}`}
        >
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-white">{value}</h3>
                </div>
                <div className={`p-3 rounded-xl bg-slate-900/50 ${colorClasses[color].split(' ')[0]}`}>
                    {icon}
                </div>
            </div>
        </motion.div>
    );
};

export default StatCard;
