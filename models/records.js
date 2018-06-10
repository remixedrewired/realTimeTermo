const mongoose = require("mongoose"),
        Schema = mongoose.Schema;

const recordSchema = new mongoose.Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    temperatureInCelsius: {
        type: Number,
        default: 0
    },
    temperatureInFahrenheit: {
        type: Number,
        default: 32
    },
    relativeHumidity: {
        type: Number,
        default: 0
    }
})

mongoose.model("Record", recordSchema);