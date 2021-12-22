import mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  const uri = process.env.DB_URL as string;

  try {
    await mongoose.connect(uri, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    } as ConnectOptions);
    console.log("DB CONNECTED");
  } catch (error) {
    console.log(`DB ERROR: ${error}`);
  }
};

export default connectDB;
