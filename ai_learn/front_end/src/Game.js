import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Flashcard from './Flashcard';

const Game = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const fetchFlashcards = async () => {
    try {
      const response = await axios.get('http://backend-env.eba-gz7kcc7n.ap-southeast-1.elasticbeanstalk.com:80/flashcards');
      console.log(response);
      setFlashcards(response.data);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
    }
  };

  const handleNextCard = () => {
    setCurrentCardIndex((prevIndex) => prevIndex + 1);
  };

  if (flashcards.length === 0) {
    return <p>Loading flashcards...</p>;
  }

  if (currentCardIndex >= flashcards.length) {
    return <p>End of game</p>;
  }

  const currentCard = flashcards[currentCardIndex];

  return (
    <Flashcard
      word={currentCard.word}
      definition={currentCard.definition}
      translation={currentCard.translation}
      onNextCard={handleNextCard}
    />
  );
};

export default Game;
