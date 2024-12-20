const mongoose = require("mongoose");

// MongoDB 연결
const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://<username>:<password>@<cluster>/<dbname>?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB 연결 성공");
  } catch (err) {
    console.error("MongoDB 연결 실패:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
