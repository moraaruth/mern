const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURI = 'mongodb+srv://iammoraaruth:Dakariiman@cluster0.vud23jl.mongodb.net/mgmt_db'; // Replace this with your actual MongoDB URI

        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${mongoose.connection.host}`); 
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
    }
};

module.exports = connectDB;
