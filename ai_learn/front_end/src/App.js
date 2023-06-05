import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Menu from './Menu';
import Game from './Game';
import AddWordForm from './AddWordForm';

const App = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [speechText, setSpeechText] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [audioKey, setAudioKey] = useState(0);
  const [sourceText, setSourceText] = useState('');
  const [targetText, setTargetText] = useState('');
  const [selectedWord, setSelectedWord] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    const handleWordSelect = async () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim().length > 0) {
        const selectedText = selection.toString().trim();
        const words = selectedText.split(/\s+/); // Split selected text into words
        if (words.length === 1) {
          const selectedWord = words[0];

          const response = await axios.post('http://localhost:3000/translate-text', { text: selectedWord })
          setSelectedWord(response.data.text);
          setPopupVisible(true);
          console.log(`Selected word: ${selectedWord}`);
          // Call translation functionality here or perform any other action with the selected word
        } else {
          setPopupVisible(false);
        }
      }
    };

    const textContainer = document.getElementById('text-container');
    textContainer.addEventListener('mouseup', handleWordSelect);
  }, [selectedWord])

  const handleImageUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      const response = await axios.post('http://localhost:3000/extract-text', formData);
      setExtractedText(response.data.text);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleTextToSpeech = async () => {
    try {
      const response = await axios.post('http://localhost:3000/synthesize-speech', { text: speechText, voiceId: 'Joanna' }, { responseType: 'arraybuffer' });
      setAudioUrl(URL.createObjectURL(new Blob([response.data], { type: 'audio/mpeg' })));
      setAudioKey((prevKey) => prevKey + 1); // Increment the key value
    } catch (error) {
      console.error('Error synthesizing speech:', error);
    }
  };

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleTextTranslate = async () => {
    try {
      const response = await axios.post('http://localhost:3000/translate-text', { text: sourceText });
      setTargetText(response.data.text);
    } catch (err) {
      console.error('Error translating text:', err);
    }
  }

  return (
    <div className="font-sans bg-gray-100 min-h-screen">
      <Menu/>
      <div className="container mx-auto py-10">
        <h2 className="text-2xl font-bold mb-4">Image to Text Extraction</h2>
        <input className="mb-4" type="file" onChange={handleImageChange} />
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleImageUpload}>
          Extract Text
        </button>
        <div id="text-container">{extractedText}</div>
        {popupVisible && (
          <div className="bg-white border border-gray-300 p-4 mt-4 rounded shadow">
            <p className="text-gray-800">{selectedWord}</p>
          </div>
        )}

        <h2 className="text-2xl font-bold mt-10">Text to Speech</h2>
        <textarea className="w-full h-40 mb-4 mt-4 p-2 border border-gray-300" value={speechText} onChange={(e) => setSpeechText(e.target.value)}></textarea>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleTextToSpeech}>
          Synthesize Speech
        </button>
        {audioUrl && (
          <audio controls className="mt-4">
            <source key={audioKey} src={audioUrl} type="audio/mpeg" />
          </audio>
        )}

        <h2 className="text-2xl font-bold mt-10">Text Translation</h2>
        <textarea className="w-full h-40 mb-4 mt-4 p-2 border border-gray-300" value={sourceText} onChange={(e) => setSourceText(e.target.value)}></textarea>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleTextTranslate}>
          Translate Text
        </button>
        <textarea className="w-full h-40 mb-4 mt-4 p-2 border border-gray-300" value={targetText}></textarea>

        <h2 className="text-2xl font-bold mt-10">Flashcard Game</h2>
        <div className="col-span-2">
          <Game/>
        </div>
        <div className="col-span-1">
          <AddWordForm/>
        </div>
      </div>
    </div>
  );
};

export default App;
