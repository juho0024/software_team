
const mongoose = require('mongoose');

// 환경변수 확인 로그
console.log("🔍 MONGO_URI:", process.env.MONGO_URI);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

module.exports = {
    connectDB
};
