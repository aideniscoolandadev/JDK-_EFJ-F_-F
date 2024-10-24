import React, { useState, useCallback } from 'react';
import { Configuration, OpenAIApi } from 'openai';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { Download } from 'lucide-react';

interface EssayWriterProps {
  darkMode: boolean;
}

const EssayWriter: React.FC<EssayWriterProps> = ({ darkMode }) => {
  const [topic, setTopic] = useState('');
  const [essayContent, setEssayContent] = useState('');
  const [loading, setLoading] = useState(false);

  const configuration = new Configuration({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const generateEssayDraft = async () => {
    setLoading(true);
    try {
      const response = await openai.createCompletion({
        model: "text-davinci-002",
        prompt: `Write an essay draft on the following topic: ${topic}\n\nEssay Draft:`,
        max_tokens: 500,
        temperature: 0.7,
      });
      const generatedContent = response.data.choices[0].text?.trim() || 'Unable to generate essay draft.';
      setEssayContent(prevContent => prevContent + (prevContent ? '\n\n' : '') + generatedContent);
    } catch (error) {
      console.error('Error generating essay draft:', error);
      setEssayContent(prevContent => prevContent + (prevContent ? '\n\n' : '') + 'Error generating essay draft. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const exportToDocx = useCallback(() => {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [new TextRun(essayContent.replace(/<[^>]+>/g, ''))],
          }),
        ],
      }],
    });

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, 'essay.docx');
    });
  }, [essayContent]);

  return (
    <div className={`flex h-full ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
      <div className="w-1/4 p-4 border-r border-gray-300 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Essay Writer</h2>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter essay topic"
          className={`w-full p-2 mb-4 border rounded ${
            darkMode
              ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-400'
              : 'bg-white text-gray-800 border-gray-300 focus:border-blue-500'
          } focus:outline-none transition-colors duration-200`}
        />
        <button
          onClick={generateEssayDraft}
          disabled={loading || !topic}
          className={`w-full p-2 rounded mb-4 ${
            darkMode
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          } transition-colors duration-200 ${(loading || !topic) && 'opacity-50 cursor-not-allowed'}`}
        >
          {loading ? 'Generating...' : 'Generate Essay Draft'}
        </button>
        <button
          onClick={exportToDocx}
          className={`w-full p-2 rounded flex items-center justify-center ${
            darkMode
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          } transition-colors duration-200`}
        >
          <Download size={20} className="mr-2" />
          Export to DOCX
        </button>
      </div>
      <div className="w-3/4 p-4">
        <ReactQuill
          theme="snow"
          value={essayContent}
          onChange={setEssayContent}
          className={`h-full ${darkMode ? 'text-white' : 'text-gray-800'}`}
          modules={{
            toolbar: [
              [{ 'header': [1, 2, 3, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              ['link', 'image'],
              ['clean']
            ],
          }}
        />
      </div>
    </div>
  );
};

export default EssayWriter;