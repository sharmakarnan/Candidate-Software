import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const questionsFile = path.join(__dirname, "../questions.json");

// ✅ Load Questions Safely
function loadQuestions() {
  if (!fs.existsSync(questionsFile)) return [];
  try {
    return JSON.parse(fs.readFileSync(questionsFile, "utf8"));
  } catch {
    return [];
  }
}

// ✅ Save Questions
function saveQuestions(questions) {
  fs.writeFileSync(questionsFile, JSON.stringify(questions, null, 2));
}

// ✅ Utility — Shuffle (Fisher–Yates)
export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ✅ Admin: Add Question
export const addQuestion = (req, res) => {
  try {
    const { question, options, correct } = req.body;
    if (!question || !options || options.length !== 4)
      return res.status(400).json({ error: "Invalid question format" });

    const questions = loadQuestions();
    const newQuestion = {
      id: questions.length > 0 ? questions[questions.length - 1].id + 1 : 1,
      question,
      options,
      correct,
    };

    questions.push(newQuestion);
    saveQuestions(questions);
    res.json({ message: "✅ Question added", question: newQuestion });
  } catch (err) {
    console.error("❌ Error adding question:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Admin: Delete Question
export const deleteQuestion = (req, res) => {
  try {
    const id = Number(req.params.id);
    let questions = loadQuestions();
    questions = questions.filter((q) => q.id !== id);
    saveQuestions(questions);
    res.json({ message: "🗑️ Question deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting question:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Admin: View Questions
export const getQuestions = (req, res) => {
  const questions = loadQuestions();
  res.json(questions);
};
