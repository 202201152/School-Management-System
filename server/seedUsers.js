const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'student'], default: 'admin' },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' }
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);

const StudentSchema = new mongoose.Schema({
    name: String,
    class: String,
    rollNumber: String,
    email: String,
    phone: String,
    createdAt: { type: Date, default: Date.now }
});
const Student = mongoose.models.Student || mongoose.model('Student', StudentSchema);

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB. Seeding User Logins...');

        // Clear existing students to avoid dups from earlier tests
        await User.deleteMany({ role: 'student' });
        
        // Ensure Admin exists
        const adminExists = await User.findOne({ email: 'admin@school.com' });
        if (!adminExists) {
            const adminSalt = await bcrypt.genSalt(10);
            const adminPass = await bcrypt.hash('admin123', adminSalt);
            await new User({ name: 'System Admin', email: 'admin@school.com', password: adminPass, role: 'admin' }).save();
        }

        const students = await Student.find();
        
        const salt = await bcrypt.genSalt(10);
        const defaultPassword = await bcrypt.hash('student123', salt);

        let count = 0;
        for (let student of students) {
            const email = student.email || `student${student.rollNumber}@school.example.com`;
            
            const existing = await User.findOne({ email });
            if (!existing) {
                const user = new User({
                    name: student.name,
                    email: email,
                    password: defaultPassword,
                    role: 'student',
                    studentId: student._id
                });
                await user.save();
                count++;
            }
        }
        
        console.log(`Created ${count} student logins!`);
        console.log('Password for all students is: student123');
        process.exit();

    } catch (error) {
        console.error('Seeding Error:', error);
        process.exit(1);
    }
};

seedUsers();
