import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Flashcard from './Flashcard';

const Game = ( {wordAdded} ) => {
  const [flashcards, setFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  console.log(flashcards);

  useEffect(() => {
    fetchFlashcards();
  }, [wordAdded]);

  const fetchFlashcards = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/flashcards');
      setFlashcards(response.data);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
    }
  };

  const handleNextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  }

  if (flashcards.length === 0) {
    return <p>Loading flashcards...</p>;
  }

  const currentCard = flashcards[currentCardIndex];

  return (
    <Flashcard
      word={currentCard.word}
      definition={currentCard.definition}
      translation={currentCard.translation}
      onNextCard={handleNextCard}
      onPrevCard={handlePrevCard}
    />
  );
};

export default Game;
