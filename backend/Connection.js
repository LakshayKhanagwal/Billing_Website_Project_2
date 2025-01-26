const mongoose = require("mongoose")

const Connection = async () => {
    await mongoose.connect(process.env.MONGODB_CONNECTION_URL)
    return console.log("Connected to MongoDB");
}
module.exports = Connection