import mongoose from "mongoose";
import * as argon2 from "argon2";
import jwt from "jsonwebtoken";

const Auth = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Provide Your Name"],
  },
  profileImg: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Please Provide Email Address"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid Email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please Provide valid password"],
    minLength: 6,
    select: false,
  },
  created: {},
});

Auth.pre("save", async function (next) {
  if (!this.created) this.created = new Date();
  next();
});
// hash the password
Auth.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await argon2.hash(this.password, { type: argon2.argon2d });
});

//match the password
Auth.methods.matchPassword = async function (
  password: string,
  hashPassword: string
) {
  const isCorrect: boolean = await argon2.verify(hashPassword, password);
  return isCorrect;
};

Auth.methods.getSignedToken = async function () {
  return await jwt.sign({ id: this._id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRE as string,
  });
};

const AuthModel = mongoose.model("Auth", Auth);

export default AuthModel;
