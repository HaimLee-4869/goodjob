const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if(!uri) {
    console.error('MONGO_URI not defined in .env');
    process.exit(1);
  }
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB 연결 성공!');
  } catch (error) {
    console.error('MongoDB 연결 실패:', error);
    process.exit(1);
  }
}

module.exports = connectDB;
