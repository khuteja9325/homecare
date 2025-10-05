import React, { useState } from "react";
import type { RegistrationData } from "../CaregiverRegistration"; // adjust path if needed

type AssessmentStepProps = {
  data: RegistrationData;
  updateData: (updates: Partial<RegistrationData>) => void;
  onNext: () => void;
  onPrevious: () => void;
};

const AssessmentStep: React.FC<AssessmentStepProps> = ({
  data,
  updateData,
  onNext,
  onPrevious,
}) => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState<number | null>(data.assessmentScore ?? null);

  const questions = [
    "Do you have prior caregiving experience?",
    "Can you handle emergency situations?",
    "Are you comfortable with elderly care?",
  ];

  const handleAnswer = (index: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [index]: answer }));
  };

  const calculateScore = () => {
    let total = 0;
    Object.values(answers).forEach((ans) => {
      if (ans === "yes") total += 100 / questions.length;
    });

    const finalScore = Math.round(total);
    setScore(finalScore);

    // ✅ update flat fields (correct structure)
    updateData({
      assessmentScore: finalScore,
      assessmentPassed: finalScore >= 50,
    });

    return finalScore;
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Caregiver Assessment
      </h2>

      <div className="space-y-6">
        {questions.map((q, i) => (
          <div
            key={i}
            className="p-4 border border-gray-200 rounded-lg shadow-sm"
          >
            <p className="font-medium text-gray-700 mb-3">{q}</p>
            <div className="flex space-x-4">
              <button
                onClick={() => handleAnswer(i, "yes")}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  answers[i] === "yes"
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 hover:bg-green-100"
                }`}
              >
                Yes
              </button>
              <button
                onClick={() => handleAnswer(i, "no")}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  answers[i] === "no"
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 hover:bg-red-100"
                }`}
              >
                No
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={calculateScore}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
        >
          Submit Assessment
        </button>
      </div>

      {score !== null && (
        <p
          className={`mt-6 text-lg font-semibold text-center ${
            score >= 50 ? "text-green-600" : "text-red-600"
          }`}
        >
          Your score: {score} – {score >= 50 ? "✅ Passed" : "❌ Failed"}
        </p>
      )}

      <div className="flex justify-between mt-8">
        <button
          onClick={onPrevious}
          className="px-5 py-2 bg-gray-300 rounded-lg shadow hover:bg-gray-400 transition"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AssessmentStep;
