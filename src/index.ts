import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import authRouter from "./api/routes/auth";
import createApi from "./api/routes/CreateApi";
import connectDB from "./config/connectDB";
import { User } from "./interface/interface";

require("dotenv").config();

declare global {
  namespace Express {
    interface Request {
      user: User;
      cookies: {} | undefined;
      isAuthenticatedUser: boolean;
    }
  }
}

//connect database
connectDB();

const app = express();
//static
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json({ limit: "50mb" }));

const PORT = process.env.PORT;

//router -------------------------- authentication
app.use("/auth", authRouter);

//router -------------------------- api
app.use("/api", createApi);

//start app server ------------------------
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
