import React, { useEffect, useState } from "react";
import axios from "axios";

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: string;
}

const AdminQuestions: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correct: "",
  });

  const fetchQuestions = async () => {
    const res = await axios.get("http://localhost:5000/api/questions/view");
    setQuestions(res.data);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.question || newQuestion.options.some((o) => !o) || !newQuestion.correct) {
      alert("⚠️ Please fill all fields");
      return;
    }

    await axios.post("http://localhost:5000/api/questions/add", newQuestion);
    alert("✅ Question added successfully");
    setNewQuestion({ question: "", options: ["", "", "", ""], correct: "" });
    fetchQuestions();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this question?")) return;
    await axios.delete(`http://localhost:5000/api/questions/delete/${id}`);
    fetchQuestions();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-10">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-8">
          🧠 Admin — Manage Questions
        </h2>

        {/* Add Question Form */}
        <form onSubmit={handleAddQuestion} className="grid grid-cols-1 gap-4 mb-8">
          <input
            type="text"
            placeholder="Enter question"
            value={newQuestion.question}
            onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
            className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-green-400"
          />

          {newQuestion.options.map((opt, i) => (
            <input
              key={i}
              type="text"
              placeholder={`Option ${i + 1}`}
              value={opt}
              onChange={(e) => {
                const updated = [...newQuestion.options];
                updated[i] = e.target.value;
                setNewQuestion({ ...newQuestion, options: updated });
              }}
              className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-green-400"
            />
          ))}

          <input
            type="text"
            placeholder="Correct Option (A/B/C/D)"
            value={newQuestion.correct}
            onChange={(e) => setNewQuestion({ ...newQuestion, correct: e.target.value })}
            className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-green-400"
          />

          <button
            type="submit"
            className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold"
          >
            ➕ Add Question
          </button>
        </form>

        {/* List of Questions */}
        <h3 className="text-xl font-semibold mb-4">📋 Existing Questions</h3>
        {questions.length === 0 ? (
          <p className="text-gray-500 text-center">No questions added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 text-left text-sm">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Question</th>
                  <th className="p-3">Correct</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q, i) => (
                  <tr key={q.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{i + 1}</td>
                    <td className="p-3">{q.question}</td>
                    <td className="p-3 text-green-700 font-semibold">{q.correct}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDelete(q.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminQuestions;
