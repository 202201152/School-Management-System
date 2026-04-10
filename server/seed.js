const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const StudentSchema = new mongoose.Schema({
    name: String,
    class: String,
    rollNumber: String,
    email: String,
    phone: String,
    createdAt: { type: Date, default: Date.now }
});
const Student = mongoose.models.Student || mongoose.model('Student', StudentSchema);

const TaskSchema = new mongoose.Schema({
    title: String,
    description: String,
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    dueDate: Date,
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});
const Task = mongoose.models.Task || mongoose.model('Task', TaskSchema);

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for Seeding...');

        // Clear existing
        await Student.deleteMany({});
        await Task.deleteMany({});

        const studentNames = [
            "Aarav Patel", "Diya Sharma", "Vihaan Singh", "Ananya Gupta", "Advik Kumar",
            "Myra Verma", "Reyansh Reddy", "Kiara Das", "Aryan Bose", "Saanvi Iyer",
            "Kabir Nair", "Navya Joshi", "Shaurya Menon", "Pari Rao", "Atharv Desai",
            "Riya Choudhury", "Vivaan Pillai", "Suhana Kapoor", "Dhruv Malik", "Aditi Ahuja"
        ];
        
        const classes = ["9", "10", "11", "12"];

        // Create Students
        const students = [];
        for (let i = 0; i < 20; i++) {
            const student = new Student({
                name: studentNames[i],
                class: classes[Math.floor(Math.random() * classes.length)],
                rollNumber: (i + 1).toString().padStart(2, '0'),
                email: `student${i + 1}@school.example.com`,
                phone: `+91 9876543${i.toString().padStart(3, '0')}`,
            });
            await student.save();
            students.push(student);
        }
        console.log(`Seeded ${students.length} students.`);

        // Create Tasks
        const taskTitles = [
            "Complete Math Worksheet", "Read Chapter 4 History", "Submit Science Project",
            "Prepare for English Debate", "Write Geography Essay", "Practice Physics Numericals",
            "Chemistry Lab Report", "Computer Science Assignment", "Art Portfolio Update", "Physical Education Log"
        ];

        let taskCount = 0;
        
        // Generate random date between multiple months ago and now
        const generateRandomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        
        for (let i = 0; i < 100; i++) {
            // Distribute dates across last 6 months
            const date = generateRandomDate(new Date('2023-11-01'), new Date()); // Adjust year logic properly below

            const task = new Task({
                title: taskTitles[Math.floor(Math.random() * taskTitles.length)],
                description: "This is a mock task description for testing purposes.",
                assignedTo: students[Math.floor(Math.random() * students.length)]._id,
                dueDate: new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000), // due 1 week after creation
                status: Math.random() > 0.4 ? 'completed' : 'pending',
                createdAt: date
            });
            await task.save();
            taskCount++;
        }
        
        console.log(`Seeded ${taskCount} tasks.`);
        console.log('Database Seeding Complete!');
        process.exit();

    } catch (error) {
        console.error('Seeding Error:', error);
        process.exit(1);
    }
};

seedDatabase();
