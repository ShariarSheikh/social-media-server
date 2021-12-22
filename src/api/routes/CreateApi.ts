import express from "express";
import { createApiHeader, getApiHeader, updateApiHeader} from "../controllers/createApi";

const router = express.Router();

//api
router.route("/createApiHeader").post(createApiHeader);
router.route('/updateApiHeader').patch(updateApiHeader);
router.route('/getApiHeader/:id').get(getApiHeader);

export default router;
