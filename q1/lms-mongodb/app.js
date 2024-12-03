const { MongoClient } = require('mongodb');

// MongoDB Connection URI
const uri = 'mongodb://127.0.0.1:27017';

// Database and Collections
const client = new MongoClient(uri);
const dbName = 'LMS_DB';
const usersData = [
    { name: 'Alice', role: 'admin', email: 'alice@admin.com' },
    { name: 'Bob', role: 'instructor', email: 'bob@instructor.com' },
    { name: 'Charlie', role: 'student', email: 'charlie@student.com' }
];
const coursesData = [
    { title: 'Math 101', instructor: 'Bob', duration: '10 weeks', maxCapacity: 30 },
    { title: 'Science 101', instructor: 'Bob', duration: '12 weeks', maxCapacity: 25 },
    { title: 'English 101', instructor: 'Bob', duration: '8 weeks', maxCapacity: 20 },
    { title: 'History 101', instructor: 'Alice', duration: '15 weeks', maxCapacity: 40 },
    { title: 'Geography 101', instructor: 'Alice', duration: '9 weeks', maxCapacity: 35 }
];

async function setupDatabase() {
    try {
        await client.connect();
        const db = client.db(dbName);

        // Create and populate collections
        const users = db.collection('users');
        const courses = db.collection('courses');

        // Clear existing data
        await users.deleteMany({});
        await courses.deleteMany({});

        // Insert sample data
        await users.insertMany(usersData);
        await courses.insertMany(coursesData);

        console.log('Database setup completed.');

        // Retrieve all users
        console.log('All Users:', await users.find().toArray());

        // Retrieve all courses
        console.log('All Courses:', await courses.find().toArray());

        // Retrieve specific users (instructors)
        console.log(
            'Instructors:',
            await users.find({ role: 'instructor' }).toArray()
        );
    } catch (err) {
        console.error('Error setting up database:', err);
    } finally {
        await client.close();
    }
}

setupDatabase();
