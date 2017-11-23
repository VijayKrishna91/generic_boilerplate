const mongoose = require("mongoose");

const MachineSchema = new mongoose.Schema({
    name: String,
    description: String,
    effctive_part: [{
        type: String,
        enum: ['Chest', 'Arms', 'Cardio', 'Back', 'Shoulders', 'Legs', 'Abs', 'Neck']
    }],
    type: String
});

module.exports = { MachineSchema };
