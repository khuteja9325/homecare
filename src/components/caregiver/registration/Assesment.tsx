import React, { useState } from 'react';

type AssessmentStepProps = {
  data: any; // Replace with RegistrationData type if you have it
  updateData: (updates: Partial<any>) => void;
  onNext: () => void;
  onPrevious: () => void;
};

const AssessmentStep: React.FC<AssessmentStepProps> = ({ updateData, onNext, onPrevious }) => {
  const [score, setScore] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});

  const questions = [
    "Do you have prior caregiving experience?",
    "Are you trained in first aid?",
    "Can you handle emergency situations confidently?",
    "Do you have patience working with children or elderly?",
  ];

  const handleAnswer = (index: number, value: string) => {
    setAnswers(prev => ({ ...prev, [index]: value }));
  };

  const calculateScore = () => {
    let total = 0;
    Object.values(answers).forEach(ans => {
      if (ans === "yes") total += 25;
    });
    setScore(total);

    updateData({
      assessment: { score: total, passed: total >= 50 }
    });
  };

  const handleSubmit = () => {
    if (score === null) {
      calculateScore();
    }
    if (score !== null && score >= 50) {
      onNext();
    } else if (score !== null) {
      alert("You must score at least 50 to continue registration.");
    }
  };

  return (
    <div>
      <h2>Assessment</h2>
      {questions.map((q, idx) => (
        <div key={idx}>
          <p>{q}</p>
          <label>
            <input
              type="radio"
              name={`q-${idx}`}
              value="yes"
              onChange={() => handleAnswer(idx, "yes")}
            /> Yes
          </label>
          <label>
            <input
              type="radio"
              name={`q-${idx}`}
              value="no"
              onChange={() => handleAnswer(idx, "no")}
            /> No
          </label>
        </div>
      ))}

      <div style={{ marginTop: "1rem" }}>
        <button onClick={onPrevious}>Back</button>
        <button onClick={handleSubmit}>Submit Assessment</button>
      </div>

      {score !== null && (
        <p>
          Your Score: {score} / 100 ({score >= 50 ? "Passed ✅" : "Failed ❌"})
        </p>
      )}
    </div>
  );
};

export default AssessmentStep;
