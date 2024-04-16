import React from 'react';

const Question = ({ question, onAnswerSelect }) => {
  return (
    <div className="question">
      <h2>{question.text}</h2>
      <ul>
        {question.options.map((option, index) => (
          <li key={index}>
            <button onClick={() => onAnswerSelect(option)}>
              {option}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Question;
