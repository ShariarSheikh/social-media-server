import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import authRouter from "./api/routes/auth";
import post from "./api/routes/post";
import connectDB from "./config/connectDB";
import { User } from "./interface/interface";
import isApiReqValid from "./api/middleware/isApiReqValid";

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
app.use(express.static("upload"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json({ limit: "50mb" }));

const PORT = process.env.PORT;

//router -------------------------- authentication
app.use("/auth", isApiReqValid, authRouter);

//router -------------------------- api
app.use("/api", isApiReqValid, post);

//start app server ------------------------
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
