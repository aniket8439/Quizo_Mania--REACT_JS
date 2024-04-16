import React, { useState, useEffect } from 'react';
import Question from './Question';
import questionsData from '../data/questions.json';

const QuizApp = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [fullScreenMode, setFullScreenMode] = useState(false);
  const [tabSwitchViolations, setTabSwitchViolations] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const storedIndex = localStorage.getItem('currentQuestionIndex');
    const storedScore = localStorage.getItem('score');

    if (storedIndex !== null && storedScore !== null) {
      setCurrentQuestionIndex(parseInt(storedIndex));
      setScore(parseInt(storedScore));
    }

    setQuestions(questionsData);
    checkFullScreenMode();
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('currentQuestionIndex', currentQuestionIndex);
    localStorage.setItem('score', score);
  }, [currentQuestionIndex, score]);

  const checkFullScreenMode = () => {
    setFullScreenMode(document.fullscreenEnabled && document.fullscreenElement !== null);
  };

  const openFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
      elem.msRequestFullscreen();
    }
  };

  const handleFullScreenChange = () => {
    checkFullScreenMode();
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      setTabSwitchViolations(prevCount => prevCount + 1);
    }
  };

  const handleAnswerSelect = (selectedOption) => {
    if (!fullScreenMode) {
      alert('Please switch to full-screen mode to take the quiz.');
      return;
    }

    if (selectedOption === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const goToNextQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const goToPreviousQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  const restartGame = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setTabSwitchViolations(0);
    setGameOver(false);
  };

  const questionsAttempted = currentQuestionIndex + 1;
  const questionsLeft = questions.length - questionsAttempted;

  useEffect(() => {
    if (tabSwitchViolations >= 3) {
      alert('Warning: Next tab switch will result in game over!');
    }
    if (tabSwitchViolations >= 4) {
      setGameOver(true);
    }
  }, [tabSwitchViolations]);

  return (
    <div className="quiz-app">
      {!fullScreenMode && (
        <div className="fullscreen-blocker">
          <p>Please switch to full-screen mode to take the quiz.</p>
          <button className="fullscreen-button" onClick={openFullscreen}>Open Fullscreen</button>
        </div>
      )}
      <div className="quiz-content">
        {fullScreenMode && !gameOver && (
          <>
            {currentQuestionIndex < questions.length ? (
              <>
                <Question
                  question={questions[currentQuestionIndex]}
                  onAnswerSelect={handleAnswerSelect}
                />
                <div className="navigation">
                  {currentQuestionIndex > 0 && (
                    <button className="prev-button" onClick={goToPreviousQuestion}>Previous</button>
                  )}
                  <span className="question-count">
                    Question {questionsAttempted} of {questions.length} ({questionsLeft} left)
                  </span>
                  {currentQuestionIndex < questions.length - 1 && (
                    <button className="next-button" onClick={goToNextQuestion}>Next</button>
                  )}
                </div>
              </>
            ) : (
              <div className="quiz-result">
                <h2>Quiz Completed!</h2>
                <p>Your score is: {score}</p>
                <button className='next-button' onClick={restartGame}>Restart Game</button>
              </div>
            )}
          </>
        )}
        {gameOver && (
          <div className="game-over">
            <h2>Game Over!</h2>
            <p>Your score is: {score}</p>
            <button className='next-button' onClick={restartGame}>Restart Game</button>
          </div>
        )}
      </div>
      {tabSwitchViolations > 0 && (
        <div className="tab-switch-violation">
          <p>Tab switch violations: {tabSwitchViolations}</p>
        </div>
      )}
    </div>
  );
};

export default QuizApp;
