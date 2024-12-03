const { MongoClient, ObjectId } = require('mongodb');

// MongoDB Connection URI
const uri = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri);
const dbName = 'LMS_DB';

async function main() {
    try {
        await client.connect();
        const db = client.db(dbName);

        // Collections
        const users = db.collection('users');
        const courses = db.collection('courses');

        // CRUD Operations for Courses
        console.log('--- Courses Operations ---');

        // CREATE a new course
        const newCourse = { title: 'Physics 101', instructor: 'Alice', duration: '12 weeks', maxCapacity: 40 };
        const courseResult = await courses.insertOne(newCourse);
        console.log('Course Created:', courseResult.insertedId);

        // READ all courses
        console.log('All Courses:', await courses.find().toArray());

        // READ specific courses by filter
        console.log(
            'Courses by Alice:',
            await courses.find({ instructor: 'Alice' }).toArray()
        );

        // UPDATE a course
        const updatedCourse = await courses.updateOne(
            { _id: courseResult.insertedId },
            { $set: { title: 'Advanced Physics 101', duration: '14 weeks' } }
        );
        console.log('Course Updated:', updatedCourse.modifiedCount);

        // DELETE a course
        const deletedCourse = await courses.deleteOne({ _id: courseResult.insertedId });
        console.log('Course Deleted:', deletedCourse.deletedCount);

        // CRUD Operations for Users
        console.log('--- Users Operations ---');

        // CREATE a new user
        const newUser = { name: 'David', role: 'student', email: 'david@student.com' };
        const userResult = await users.insertOne(newUser);
        console.log('User Created:', userResult.insertedId);

        // READ all users
        console.log('All Users:', await users.find().toArray());

        // READ specific users by role
        console.log('Instructors:', await users.find({ role: 'instructor' }).toArray());

        // UPDATE a user
        const updatedUser = await users.updateOne(
            { _id: userResult.insertedId },
            { $set: { email: 'david.new@student.com' } }
        );
        console.log('User Updated:', updatedUser.modifiedCount);

        // DELETE a user
        const deletedUser = await users.deleteOne({ _id: userResult.insertedId });
        console.log('User Deleted:', deletedUser.deletedCount);

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.close();
    }
}

main();

