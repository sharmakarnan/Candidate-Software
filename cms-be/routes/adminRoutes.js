import express from "express";
import { addCandidate, getCandidates, viewRegisteredCandidates} from "../controllers/adminController.js";

const router = express.Router();

router.post("/add", addCandidate);
router.get("/view", getCandidates);
router.get("/registered", viewRegisteredCandidates); // 👈 new route


export default router;
