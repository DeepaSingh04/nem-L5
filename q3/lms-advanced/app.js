const { MongoClient, ObjectId } = require('mongodb');

const uri = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri);
const dbName = 'LMS_DB';

async function main() {
    try {
        await client.connect();
        const db = client.db(dbName);
        const users = db.collection('users');
        const courses = db.collection('courses');

        // Setup: Add sample data
        console.log('--- Setup ---');
        await users.deleteMany({});
        await courses.deleteMany({});

        const course1 = await courses.insertOne({
            title: 'Math 101',
            instructor: 'Alice',
            duration: '10 weeks',
            maxCapacity: 30,
            dateAdded: new Date()
        });

        const course2 = await courses.insertOne({
            title: 'Science 101',
            instructor: 'Bob',
            duration: '12 weeks',
            maxCapacity: 25,
            dateAdded: new Date()
        });

        const student = await users.insertOne({
            name: 'Charlie',
            role: 'student',
            email: 'charlie@student.com',
            enrolledCourses: []
        });

        console.log('Sample data added.');

        // Dynamic Filtering and Sorting
        console.log('--- Filtering and Sorting ---');
        const filteredCourses = await courses.find({ instructor: 'Alice' }).toArray();
        console.log('Courses by Alice:', filteredCourses);

        const sortedCourses = await courses.find().sort({ dateAdded: -1 }).toArray();
        console.log('Courses sorted by date added (descending):', sortedCourses);

        // Enrollment Logic
        console.log('--- Enrollment ---');

        // Enroll student in a course
        const courseId = course1.insertedId;
        const userId = student.insertedId;

        const user = await users.findOne({ _id: userId });
        if (user.role !== 'student') {
            console.log('Error: Only students can enroll in courses.');
        } else if (user.enrolledCourses.includes(courseId.toString())) {
            console.log('Error: Student is already enrolled in this course.');
        } else {
            await users.updateOne(
                { _id: userId },
                { $push: { enrolledCourses: courseId.toString() } }
            );
            console.log('Enrollment successful.');
        }

        // Prevent course deletion if students are enrolled
        console.log('--- Course Deletion Check ---');
        const enrolledUsers = await users.find({ enrolledCourses: courseId.toString() }).toArray();
        if (enrolledUsers.length > 0) {
            console.log('Error: Cannot delete course with enrolled students.');
        } else {
            const deleteResult = await courses.deleteOne({ _id: courseId });
            console.log('Course Deleted:', deleteResult.deletedCount);
        }

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.close();
    }
}

main();
