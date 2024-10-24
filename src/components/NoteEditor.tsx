import React, { useState, useEffect } from 'react'
import { Note } from '../App'
import { Trash2 } from 'lucide-react'

interface NoteEditorProps {
  note: Note
  updateNote: (note: Note) => void
  removeNote: (noteId: string) => void
  darkMode: boolean
}

const NoteEditor: React.FC<NoteEditorProps> = ({ note, updateNote, removeNote, darkMode }) => {
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)

  useEffect(() => {
    const timer = setTimeout(() => {
      updateNote({ ...note, title, content })
    }, 500)

    return () => clearTimeout(timer)
  }, [title, content])

  return (
    <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} shadow rounded-lg p-4 mb-4 transition-colors duration-200`}>
      <div className="flex justify-between items-center mb-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`flex-grow text-xl font-semibold p-2 border-b ${
            darkMode
              ? 'bg-gray-800 text-white border-gray-600 focus:border-blue-400'
              : 'bg-white text-gray-800 border-gray-300 focus:border-blue-500'
          } focus:outline-none transition-colors duration-200`}
          placeholder="Note title"
        />
        <button
          onClick={() => removeNote(note.id)}
          className={`ml-2 p-1 rounded ${
            darkMode ? 'text-red-400 hover:text-red-300 hover:bg-gray-700' : 'text-red-600 hover:text-red-700 hover:bg-gray-100'
          }`}
        >
          <Trash2 size={20} />
        </button>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className={`w-full h-40 p-2 border rounded ${
          darkMode
            ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-400'
            : 'bg-white text-gray-800 border-gray-300 focus:border-blue-500'
        } focus:outline-none transition-colors duration-200`}
        placeholder="Write your note here..."
      />
    </div>
  )
}

export default NoteEditor