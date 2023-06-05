import React, { useState } from 'react';
import axios from 'axios';

const AddWordForm = () => {
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [translation, setTranslation] = useState('');

  const handleAddWord = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://backend-env.eba-gz7kcc7n.ap-southeast-1.elasticbeanstalk.com:80/words', { word, definition, translation });
      console.log('Word added successfully.');
      // Add any desired success handling, such as displaying a success message
    } catch (error) {
      console.error('Error adding word:', error);
      // Add error handling, such as displaying an error message
    }
  };

  return (
    <form onSubmit={handleAddWord} className="bg-white mt-4 p-6 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add Word</h2>
      <div className="mb-4">
        <label className="block mb-2 text-gray-700">Word</label>
        <input type="text" value={word} onChange={(e) => setWord(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
      </div>
      <div className="mb-4">
        <label className="block mb-2 text-gray-700">Definition</label>
        <input type="text" value={definition} onChange={(e) => setDefinition(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
      </div>
      <div className="mb-4">
        <label className="block mb-2 text-gray-700">Translation</label>
        <input type="text" value={translation} onChange={(e) => setTranslation(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">Add Word</button>
    </form>
  );
};

export default AddWordForm;
