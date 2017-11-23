const mongoose = require("mongoose");

const WorkoutSchema = new mongoose.Schema({
    name: String,
    description: String,
    equipments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Machines'
    }],
    tutorial: String,
    mode: String,
    effctive_part: [{
        type: String,
        enum: ['Chest', 'Arms', 'Cardio', 'Back', 'Shoulders', 'Legs', 'Abs', 'Neck']
    }]
});

module.exports = { WorkoutSchema };
