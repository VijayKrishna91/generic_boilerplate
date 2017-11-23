const mongoose = require("mongoose");

const { UserSchema } = require("./user.model");
const { WorkoutSchema } = require("./Workout");


mongoose.model("User", UserSchema);
mongoose.model("Workout", WorkoutSchema);


module.exports = mongoose;
