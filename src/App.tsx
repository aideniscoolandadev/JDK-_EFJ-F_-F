import React, { useState, useEffect } from 'react'
import { PlusCircle, FileText, CheckSquare, Moon, Sun, Youtube, PenTool, BookOpen, Calculator } from 'lucide-react'
import Sidebar from './components/Sidebar'
import NoteEditor from './components/NoteEditor'
import TaskList from './components/TaskList'
import YouTubeSummarizer from './components/YouTubeSummarizer'
import EssayWriter from './components/EssayWriter'
import StudyAI from './components/StudyAI'
import MathPractice from './components/MathPractice'

export interface Note {
  id: string
  title: string
  content: string
}

export interface Task {
  id: string
  title: string
  completed: boolean
}

function App() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem('notes')
    return savedNotes ? JSON.parse(savedNotes) : []
  })

  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks')
    return savedTasks ? JSON.parse(savedTasks) : []
  })

  const [activeView, setActiveView] = useState<'notes' | 'tasks' | 'youtube' | 'essay' | 'study' | 'math'>('notes')
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode')
    return savedMode ? JSON.parse(savedMode) : false
  })

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const addNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
    }
    setNotes([...notes, newNote])
  }

  const updateNote = (updatedNote: Note) => {
    setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note))
  }

  const removeNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId))
  }

  const addTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: 'New Task',
      completed: false,
    }
    setTasks([...tasks, newTask])
  }

  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task))
  }

  const removeTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <div className={`flex h-screen ${darkMode ? 'dark' : ''}`}>
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        addNote={addNote}
        addTask={addTask}
        darkMode={darkMode}
      />
      <main className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold dark:text-white">
            {activeView === 'notes' ? 'Notes' : 
             activeView === 'tasks' ? 'Tasks' : 
             activeView === 'youtube' ? 'YouTube Summarizer' :
             activeView === 'essay' ? 'Essay Writer' :
             activeView === 'study' ? 'Study AI' : 'Math Practice'}
          </h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
        <div className="p-4">
          {activeView === 'notes' && (
            <div>
              {notes.map(note => (
                <NoteEditor key={note.id} note={note} updateNote={updateNote} removeNote={removeNote} darkMode={darkMode} />
              ))}
              <button
                onClick={addNote}
                className="mt-4 flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                <PlusCircle className="mr-2" size={20} />
                Add Note
              </button>
            </div>
          )}
          {activeView === 'tasks' && (
            <div>
              <TaskList tasks={tasks} updateTask={updateTask} removeTask={removeTask} darkMode={darkMode} />
              <button
                onClick={addTask}
                className="mt-4 flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                <PlusCircle className="mr-2" size={20} />
                Add Task
              </button>
            </div>
          )}
          {activeView === 'youtube' && <YouTubeSummarizer darkMode={darkMode} />}
          {activeView === 'essay' && <EssayWriter darkMode={darkMode} />}
          {activeView === 'study' && <StudyAI darkMode={darkMode} />}
          {activeView === 'math' && <MathPractice darkMode={darkMode} />}
        </div>
      </main>
    </div>
  )
}

export default App