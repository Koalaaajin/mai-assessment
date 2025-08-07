
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Bar } from "react-chartjs-2";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// NOTE: shorten question list for demo
const questions = [
  { text: "I ask myself periodically if I am meeting my goals.", zh: "我会定期问自己是否达成目标" },
  { text: "I consider several alternatives to a problem before I answer.", zh: "我会在回答问题前考虑几种可能的解决办法" },
  { text: "I try to use strategies that have worked in the past.", zh: "我尝试使用过去有效的方法" },
];

export default function MAIForm() {
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [showResult, setShowResult] = useState(false);

  const perPage = 10;
  const totalPages = Math.ceil(questions.length / perPage);
  const start = currentPage * perPage;
  const end = start + perPage;

  const handleAnswer = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleNext = () => setCurrentPage((prev) => prev + 1);
  const handleBack = () => setCurrentPage((prev) => prev - 1);
  const isCompleted = answers.every((a) => a !== null);

  const categories = {
    "Knowledge about Cognition": [1],
    "Procedural Knowledge": [2],
    "Conditional Knowledge": [3],
  };

  const scores = Object.entries(categories).map(([label, indices]) => {
    const score = indices.reduce((sum, i) => sum + (answers[i - 1] ? 1 : 0), 0);
    return { label, score, total: indices.length };
  });

  const chartData = {
    labels: scores.map((s) => s.label),
    datasets: [
      {
        label: "Your Score",
        data: scores.map((s) => s.score),
        backgroundColor: "rgba(99, 102, 241, 0.5)",
      },
    ],
  };

  const exportCSV = () => {
    const csvData = scores.map(({ label, score, total }) => ({
      Category: label,
      Score: score,
      Total: total,
    }));
    const blob = new Blob([Papa.unparse(csvData)], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "MAI_scores.csv");
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      {!showResult && (
        <>
          <Progress value={((currentPage + 1) / totalPages) * 100} />
          {questions.slice(start, end).map((q, idx) => {
            const i = start + idx;
            return (
              <div key={i} className="space-y-1">
                <p className="font-medium">
                  {i + 1}. {q.text} <br />
                  <span className="text-gray-500 text-sm">{q.zh}</span>
                </p>
                <div className="flex gap-4">
                  <Button
                    variant={answers[i] === true ? "default" : "outline"}
                    onClick={() => handleAnswer(i, true)}
                  >
                    True
                  </Button>
                  <Button
                    variant={answers[i] === false ? "default" : "outline"}
                    onClick={() => handleAnswer(i, false)}
                  >
                    False
                  </Button>
                </div>
              </div>
            );
          })}
          <div className="flex justify-between pt-4">
            <Button onClick={handleBack} disabled={currentPage === 0}>
              Back
            </Button>
            {currentPage < totalPages - 1 ? (
              <Button onClick={handleNext} disabled={answers.slice(start, end).some((a) => a === null)}>
                Next
              </Button>
            ) : (
              <Button onClick={() => setShowResult(true)} disabled={!isCompleted}>
                Submit
              </Button>
            )}
          </div>
        </>
      )}

      {showResult && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Your Results</h2>
          <Bar data={chartData} options={{
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, max: 3 } },
            responsive: true,
          }} />
          <ul className="text-sm text-gray-700">
            {scores.map((s) => (
              <li key={s.label}>
                <strong>{s.label}:</strong> {s.score} / {s.total}
              </li>
            ))}
          </ul>
          <Button onClick={exportCSV} className="mt-4">
            Export as CSV
          </Button>
        </div>
      )}
    </div>
  );
}
