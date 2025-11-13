import express from "express";
import db from "../config/db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// ✅ Dynamic Path Setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const questionsFile = path.join(__dirname, "../questions.json");

/* ============================================================
   🧠 Helper Function: Load Latest Questions
============================================================ */
function loadQuestions() {
  if (!fs.existsSync(questionsFile)) return [];
  try {
    const data = fs.readFileSync(questionsFile, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("❌ Error reading questions file:", err.message);
    return [];
  }
}

/* ============================================================
   🧠 1️⃣ START TEST
============================================================ */
router.post("/start", async (req, res) => {
  try {
    const { candidate_id } = req.body;

    if (!candidate_id) {
      return res.status(400).json({ error: "Candidate ID is required" });
    }

    console.log("🟢 Candidate Starting Test:", candidate_id);

    // ✅ Check if test already completed
    const [existing] = await db.query(
      `SELECT test_status FROM candidate_tests 
       WHERE candidate_id = ? ORDER BY test_id DESC LIMIT 1`,
      [candidate_id]
    );

    if (existing.length > 0 && existing[0].test_status === "COMPLETED") {
      return res.status(403).json({
        error: "⚠️ You have already completed this test.",
      });
    }

    // ✅ Create new test entry
    const [test] = await db.query(
      "INSERT INTO candidate_tests (candidate_id, test_status) VALUES (?, 'IN_PROGRESS')",
      [candidate_id]
    );

    // ✅ Load latest questions from file
    const allQuestions = loadQuestions();

    if (!allQuestions || allQuestions.length === 0) {
      return res.status(400).json({ error: "No questions available" });
    }

    // ✅ Shuffle & select random 10 questions
    const selectedQuestions = [...allQuestions]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(10, allQuestions.length));

    console.log(`🧩 Sending ${selectedQuestions.length} questions to candidate`);

    res.json({
      message: "✅ Test started successfully",
      test_id: test.insertId,
      questions: selectedQuestions,
    });
  } catch (err) {
    console.error("❌ Error starting test:", err.message);
    res.status(500).json({ error: "Database Error", details: err.message });
  }
});

/* ============================================================
   🧩 2️⃣ SUBMIT TEST
============================================================ */
router.post("/submit", async (req, res) => {
  try {
    const { test_id, answers } = req.body;

    if (!test_id || !answers) {
      return res
        .status(400)
        .json({ error: "Missing test_id or answers in request body" });
    }

    console.log("🟢 Received Test Submission:", { test_id, answers });

    const allQuestions = loadQuestions();
    if (allQuestions.length === 0) {
      return res.status(400).json({ error: "No questions found in file" });
    }

    // ✅ Calculate score
    let score = 0;
    for (const q of allQuestions) {
      if (answers[q.id] && answers[q.id] === String(q.correct)) {
        score += 10;
      }
    }

    console.log(`✅ Score Calculated: ${score}`);

    await db.query(
      `UPDATE candidate_tests 
       SET score = ?, test_status = 'COMPLETED' 
       WHERE test_id = ?`,
      [score, test_id]
    );

    res.json({
      message: "✅ Test submitted successfully",
      score,
    });
  } catch (err) {
    console.error("❌ Error submitting test:", err.message);
    res.status(500).json({ error: "Database Error", details: err.message });
  }
});

/* ============================================================
   🧾 3️⃣ HR RESULTS PAGE
============================================================ */
router.get("/results", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        ct.test_id,
        c.candidate_name AS name,
        ct.score,
        CASE 
          WHEN ct.score >= 20 THEN 'PASSED'
          ELSE 'FAILED'
        END AS result
      FROM candidate_tests ct
      JOIN candidates c ON ct.candidate_id = c.id
      WHERE ct.test_status = 'COMPLETED'
      ORDER BY ct.test_id DESC
    `);

    console.log("📊 HR Results Fetched:", rows);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching HR results:", err.message);
    res.status(500).json({ error: "Database Error", details: err.message });
  }
});

export default router;
