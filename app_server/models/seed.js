var fs = require('fs');
const Mongoose = require('./db');
const Trip = require('./travlr');

var trips = JSON.parse(fs.readFileSync('./data/trips.json', 'utf8'));

// delete any existing records, then insert seed data
const seedDB = async () => {
    await Trip.deleteMany({});
    await Trip.insertMany(trips);
};

// Wait until Mongoose establishes a connection before running seedDB
Mongoose.connection.once('open', async () => {
    try {
        await seedDB();
        console.log('Database successfully seeded!');
    } catch (err) {
        console.error('Seeding error:', err);
    } finally {
        await Mongoose.connection.close();
        process.exit(0);
    }
});