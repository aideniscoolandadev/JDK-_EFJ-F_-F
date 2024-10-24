import React, { useState } from 'react';
import axios from 'axios';
import { Configuration, OpenAIApi } from 'openai';

interface YouTubeSummarizerProps {
  darkMode: boolean;
}

const YouTubeSummarizer: React.FC<YouTubeSummarizerProps> = ({ darkMode }) => {
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const configuration = new Configuration({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const fetchTranscript = async (videoId: string) => {
    try {
      const response = await axios.get(`https://www.youtube.com/watch?v=${videoId}`);
      const html = response.data;
      const captionTrackRegex = /"captionTracks":(\[.*?\])/;
      const match = html.match(captionTrackRegex);
      if (match) {
        const captionTracks = JSON.parse(match[1]);
        const englishTrack = captionTracks.find((track: any) => track.languageCode === 'en');
        if (englishTrack) {
          const transcriptResponse = await axios.get(englishTrack.baseUrl);
          return transcriptResponse.data;
        }
      }
      throw new Error('No English captions found');
    } catch (error) {
      console.error('Error fetching transcript:', error);
      throw error;
    }
  };

  const summarizeTranscript = async (transcript: string) => {
    try {
      const response = await openai.createCompletion({
        model: "text-davinci-002",
        prompt: `Summarize the following YouTube video transcript:\n\n${transcript}\n\nSummary:`,
        max_tokens: 150,
        temperature: 0.5,
      });
      return response.data.choices[0].text?.trim();
    } catch (error) {
      console.error('Error summarizing transcript:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSummary('');

    try {
      const videoId = extractVideoId(url);
      if (!videoId) {
        throw new Error('Invalid YouTube URL');
      }

      const transcript = await fetchTranscript(videoId);
      const summary = await summarizeTranscript(transcript);
      setSummary(summary || 'Unable to generate summary');
    } catch (error) {
      console.error('Error:', error);
      setSummary('Error generating summary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} shadow rounded-lg p-4 mb-4 transition-colors duration-200`}>
      <h2 className="text-xl font-semibold mb-4">YouTube Video Summarizer</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter YouTube URL"
          className={`w-full p-2 mb-4 border rounded ${
            darkMode
              ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-400'
              : 'bg-white text-gray-800 border-gray-300 focus:border-blue-500'
          } focus:outline-none transition-colors duration-200`}
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full p-2 rounded ${
            darkMode
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          } transition-colors duration-200`}
        >
          {loading ? 'Summarizing...' : 'Summarize'}
        </button>
      </form>
      {summary && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Summary:</h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
};

export default YouTubeSummarizer;