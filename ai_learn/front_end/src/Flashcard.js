import React, { useState } from 'react';

const Flashcard = ({ word, definition, translation, onNextCard, onPrevCard }) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);

  const handleAnswerChange = (event) => {
    setUserAnswer(event.target.value);
  };

  const checkAnswer = () => {
    if (userAnswer.toLowerCase() === translation.toLowerCase()) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  const handleNextCard = () => {
    setUserAnswer('');
    setIsCorrect(null);
    onNextCard();
  };

  const handlePrevCard = () => {
    setUserAnswer('');
    setIsCorrect(null);
    onPrevCard();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-4">
      <h2 className="text-2xl font-bold mb-4">{word}</h2>
      <p className="text-lg">{definition}</p>
      <div className="mt-4">
        <input
          type="text"
          value={userAnswer}
          onChange={handleAnswerChange}
          className="border rounded-md px-4 py-2 w-full"
          placeholder="Enter translation"
        />
        <div className="flex flex-col gap-4">
          <div>
            <button
              onClick={checkAnswer}
              className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-600"
              >
              Check
            </button>
          </div>
            {isCorrect !== null && (
            <p className={`mt-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {isCorrect ? 'Correct!' : 'Wrong!'}
            </p>
            )}
          <div>
            <button
              onClick={handleNextCard}
              className="bg-blue-500 text-white mr-4 px-4 py-2 rounded-md mt-4 hover:bg-blue-600"
              >
              Next Card
            </button>
            <button
              onClick={handlePrevCard}
              className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-600"
              >
              Prev Card
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
