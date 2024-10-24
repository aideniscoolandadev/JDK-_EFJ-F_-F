import React from 'react'
import { FileText, CheckSquare, Youtube, PenTool, BookOpen, Calculator } from 'lucide-react'

interface SidebarProps {
  activeView: 'notes' | 'tasks' | 'youtube' | 'essay' | 'study' | 'math'
  setActiveView: (view: 'notes' | 'tasks' | 'youtube' | 'essay' | 'study' | 'math') => void
  addNote: () => void
  addTask: () => void
  darkMode: boolean
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, addNote, addTask, darkMode }) => {
  return (
    <aside className={`w-64 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} shadow-md transition-colors duration-200`}>
      <nav className="p-4">
        <ul>
          <li>
            <button
              onClick={() => setActiveView('notes')}
              className={`flex items-center w-full p-2 rounded ${
                activeView === 'notes'
                  ? darkMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 text-blue-600'
                  : darkMode
                  ? 'hover:bg-gray-700'
                  : 'hover:bg-gray-100'
              }`}
            >
              <FileText className="mr-2" size={20} />
              Notes
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveView('tasks')}
              className={`flex items-center w-full p-2 rounded mt-2 ${
                activeView === 'tasks'
                  ? darkMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 text-blue-600'
                  : darkMode
                  ? 'hover:bg-gray-700'
                  : 'hover:bg-gray-100'
              }`}
            >
              <CheckSquare className="mr-2" size={20} />
              Tasks
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveView('youtube')}
              className={`flex items-center w-full p-2 rounded mt-2 ${
                activeView === 'youtube'
                  ? darkMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 text-blue-600'
                  : darkMode
                  ? 'hover:bg-gray-700'
                  : 'hover:bg-gray-100'
              }`}
            >
              <Youtube className="mr-2" size={20} />
              YouTube Summarizer
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveView('essay')}
              className={`flex items-center w-full p-2 rounded mt-2 ${
                activeView === 'essay'
                  ? darkMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 text-blue-600'
                  : darkMode
                  ? 'hover:bg-gray-700'
                  : 'hover:bg-gray-100'
              }`}
            >
              <PenTool className="mr-2" size={20} />
              Essay Writer
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveView('study')}
              className={`flex items-center w-full p-2 rounded mt-2 ${
                activeView === 'study'
                  ? darkMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 text-blue-600'
                  : darkMode
                  ? 'hover:bg-gray-700'
                  : 'hover:bg-gray-100'
              }`}
            >
              <BookOpen className="mr-2" size={20} />
              Study AI
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveView('math')}
              className={`flex items-center w-full p-2 rounded mt-2 ${
                activeView === 'math'
                  ? darkMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 text-blue-600'
                  : darkMode
                  ? 'hover:bg-gray-700'
                  : 'hover:bg-gray-100'
              }`}
            >
              <Calculator className="mr-2" size={20} />
              Math Practice
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar