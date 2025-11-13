import express from "express";
import { candidateLogin, registerCandidateDetails } from "../controllers/candidateController.js";

const router = express.Router();

router.post("/login", candidateLogin);
router.post("/register-details", registerCandidateDetails);

export default router;
