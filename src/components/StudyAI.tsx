import React, { useState } from 'react';
import { Configuration, OpenAIApi } from 'openai';

interface StudyAIProps {
  darkMode: boolean;
}

interface Flashcard {
  question: string;
  answer: string;
}

const StudyAI: React.FC<StudyAIProps> = ({ darkMode }) => {
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('science');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [englishPractice, setEnglishPractice] = useState('');
  const [loading, setLoading] = useState(false);

  const configuration = new Configuration({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const generateStudyMaterial = async () => {
    setLoading(true);
    try {
      if (subject === 'english') {
        const response = await openai.createCompletion({
          model: "text-davinci-002",
          prompt: `Generate a paragraph about ${topic} followed by 3 questions for English class practice:\n\nParagraph:`,
          max_tokens: 300,
          temperature: 0.7,
        });
        setEnglishPractice(response.data.choices[0].text?.trim() || 'Unable to generate English practice.');
      } else {
        const response = await openai.createCompletion({
          model: "text-davinci-002",
          prompt: `Generate 5 flashcards about ${topic} for ${subject} class. Format as JSON: [{"question": "...", "answer": "..."}]`,
          max_tokens: 500,
          temperature: 0.7,
        });
        const flashcardsData = JSON.parse(response.data.choices[0].text || '[]');
        setFlashcards(flashcardsData);
      }
    } catch (error) {
      console.error('Error generating study material:', error);
      setFlashcards([]);
      setEnglishPractice('Error generating study material. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} shadow rounded-lg p-4 mb-4 transition-colors duration-200`}>
      <h2 className="text-xl font-semibold mb-4">Study AI</h2>
      <div className="flex mb-4">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter study topic"
          className={`flex-grow p-2 mr-2 border rounded ${
            darkMode
              ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-400'
              : 'bg-white text-gray-800 border-gray-300 focus:border-blue-500'
          } focus:outline-none transition-colors duration-200`}
        />
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className={`p-2 border rounded ${
            darkMode
              ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-400'
              : 'bg-white text-gray-800 border-gray-300 focus:border-blue-500'
          } focus:outline-none transition-colors duration-200`}
        >
          <option value="science">Science</option>
          <option value="social studies">Social Studies</option>
          <option value="english">English</option>
        </select>
      </div>
      <button
        onClick={generateStudyMaterial}
        disabled={loading || !topic}
        className={`w-full p-2 rounded ${
          darkMode
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        } transition-colors duration-200 ${(loading || !topic) && 'opacity-50 cursor-not-allowed'}`}
      >
        {loading ? 'Generating...' : 'Generate Study Material'}
      </button>
      {subject !== 'english' && flashcards.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Flashcards:</h3>
          {flashcards.map((card, index) => (
            <div key={index} className="mb-2 p-2 border rounded">
              <p><strong>Q:</strong> {card.question}</p>
              <p><strong>A:</strong> {card.answer}</p>
            </div>
          ))}
        </div>
      )}
      {subject === 'english' && englishPractice && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">English Practice:</h3>
          <div className="whitespace-pre-wrap">{englishPractice}</div>
        </div>
      )}
    </div>
  );
};

export default StudyAI;