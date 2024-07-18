import express from "express";
import { addReferral } from "../controllers/referrals.js";

const router = express.Router();

router.post("/", addReferral);

export default router;
