const  mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = async ()  => {

    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("Database Connected")
        
    } catch (error) {

        console.log(`Database Connecting Error : ${error}`)
        process.exit(1)
        
    }

}


module.exports = connectDB;