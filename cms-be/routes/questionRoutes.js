import express from "express";
import { addQuestion, deleteQuestion, getQuestions } from "../controllers/questionController.js";

const router = express.Router();

// ✅ Routes
router.post("/add", addQuestion);
router.delete("/delete/:id", deleteQuestion);
router.get("/view", getQuestions);

export default router;
