import express from "express";
import {
  addQuestion,
  deleteQuestion,
  getQuestions,
  generateTest,
  getQuestionCount
} from "../controllers/questionController.js";

const router = express.Router();

router.post("/add", addQuestion);
router.delete("/delete/:id", deleteQuestion);
router.get("/view", getQuestions);
router.post("/generate-test", generateTest);
router.get("/count", getQuestionCount);


export default router;
