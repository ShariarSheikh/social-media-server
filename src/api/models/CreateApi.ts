import mongoose from "mongoose";

const CreateApi = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Provide Api Name"],
  },
  about: {
    type: String,
    required: [true, "Please Provide Api About"],
  },
  isCompleted: {
    type: Boolean,
    required: [true, "Please Provide Api IsCompleted"],
  },
  apiData: {
    type: Array,
    required: [true, "Please Provide Api Data"],
  },
  apiSpeed: {
    type: String,
    required: [true, "Please Provide Api Speed"],
  },
  apiSecretKey: {
    type: String,
    required: [true, "Please Provide Api Secret"],
  },
});

const ApiDB = mongoose.model("apis", CreateApi);

export default ApiDB;
