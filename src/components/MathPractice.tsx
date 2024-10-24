import React, { useState } from 'react';
import { Configuration, OpenAIApi } from 'openai';

interface MathPracticeProps {
  darkMode: boolean;
}

interface MathProblem {
  problem: string;
  solution: string;
}

const MathPractice: React.FC<MathPracticeProps> = ({ darkMode }) => {
  const [topic, setTopic] = useState('');
  const [grade, setGrade] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [problems, setProblems] = useState<MathProblem[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const configuration = new Configuration({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const generateMathProblems = async () => {
    setLoading(true);
    try {
      const response = await openai.createCompletion({
        model: "text-davinci-002",
        prompt: `Generate 5 ${difficulty} math problems about ${topic} for grade ${grade}. Format as JSON: [{"problem": "...", "solution": "..."}]`,
        max_tokens: 500,
        temperature: 0.7,
      });
      const problemsData = JSON.parse(response.data.choices[0].text || '[]');
      setProblems(problemsData);
      setUserAnswers(new Array(problemsData.length).fill(''));
      setFeedback([]);
    } catch (error) {
      console.error('Error generating math problems:', error);
      setProblems([]);
    } finally {
      setLoading(false);
    }
  };

  const checkAnswers = async () => {
    setLoading(true);
    try {
      const newFeedback = await Promise.all(problems.map(async (problem, index) => {
        const response = await openai.createCompletion({
          model: "text-davinci-002",
          prompt: `Problem: ${problem.problem}\nCorrect solution: ${problem.solution}\nUser's answer: ${userAnswers[index]}\n\nProvide feedback on the user's answer, explaining if it's correct or not and why:`,
          max_tokens: 150,
          temperature: 0.7,
        });
        return response.data.choices[0].text?.trim() || 'Unable to generate feedback.';
      }));
      setFeedback(newFeedback);
    } catch (error) {
      console.error('Error checking answers:', error);
      setFeedback(new Array(problems.length).fill('Error generating feedback. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} shadow rounded-lg p-4 mb-4 transition-colors duration-200`}>
      <h2 className="text-xl font-semibold mb-4">Math Practice</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter math topic (e.g., fractions, algebra)"
          className={`p-2 border rounded ${
            darkMode
              ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-400'
              : 'bg-white text-gray-800 border-gray-300 focus:border-blue-500'
          } focus:outline-none transition-colors duration-200`}
        />
        <input
          type="text"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          placeholder="Enter grade level (e.g., 5, 8, 11)"
          className={`p-2 border rounded ${
            darkMode
              ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-400'
              : 'bg-white text-gray-800 border-gray-300 focus:border-blue-500'
          } focus:outline-none transition-colors duration-200`}
        />
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className={`p-2 border rounded ${
            darkMode
              ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-400'
              : 'bg-white text-gray-800 border-gray-300 focus:border-blue-500'
          } focus:outline-none transition-colors duration-200`}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <button
          onClick={generateMathProblems}
          disabled={loading || !topic || !grade}
          className={`p-2 rounded ${
            darkMode
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          } transition-colors duration-200 ${(loading || !topic || !grade) && 'opacity-50 cursor-not-allowed'}`}
        >
          {loading ? 'Generating...' : 'Generate Problems'}
        </button>
      </div>
      {problems.length > 0 && (
        <div>
          {problems.map((problem, index) => (
            <div key={index} className="mb-4">
              <p className="font-semibold">{problem.problem}</p>
              <input
                type="text"
                value={userAnswers[index]}
                onChange={(e) => {
                  const newAnswers = [...userAnswers];
                  newAnswers[index] = e.target.value;
                  setUserAnswers(newAnswers);
                }}
                placeholder="Your answer"
                className={`w-full p-2 mt-2 border rounded ${
                  darkMode
                    ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-400'
                    : 'bg-white text-gray-800 border-gray-300 focus:border-blue-500'
                } focus:outline-none transition-colors duration-200`}
              />
              {feedback[index] && (
                <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded">
                  <p><strong>Feedback:</strong> {feedback[index]}</p>
                </div>
              )}
            </div>
          ))}
          <button
            onClick={checkAnswers}
            disabled={loading || userAnswers.some(answer => answer === '')}
            className={`w-full p-2 rounded ${
              darkMode
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            } transition-colors duration-200 ${(loading || userAnswers.some(answer => answer === '')) && 'opacity-50 cursor-not-allowed'}`}
          >
            {loading ? 'Checking...' : 'Check Answers'}
          </button>
        </div>
      )}
    </div>
  );
};

export default MathPractice;