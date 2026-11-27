const mongoose = require('mongoose');

// Define the trip schema with performance-optimized indexes
const tripSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, index: true },
    length: { type: String, required: true },
    start: { type: Date, required: true },
    resort: { type: String, required: true },
    perPerson: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    tags: [{ type: String, index: true }], // Indexed array for fast intersection matching
    isActive: { type: Boolean, default: true, index: true }
});

// Compound index to optimize filtering active status and sorting price efficiently
tripSchema.index({ isActive: 1, perPerson: 1 });

const Trip = mongoose.model('trips', tripSchema);
module.exports = Trip;