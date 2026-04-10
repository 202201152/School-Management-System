import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, color = 'violet', delay = 0 }) => {
    // Determine the icon background based on color theme
    const iconBgs = {
        violet: 'bg-[var(--primary)]',
        pink: 'bg-[var(--secondary)]'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5, type: 'spring' }}
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between"
        >
            <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md ${iconBgs[color]}`}>
                    {icon}
                </div>
            </div>
            <div>
                <h3 className="text-3xl font-black text-[var(--dark)] mb-1">{value}</h3>
                <p className="text-sm font-medium text-[var(--muted)]">{title}</p>
            </div>
        </motion.div>
    );
};

export default StatCard;
