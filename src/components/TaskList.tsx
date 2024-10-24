import React, { useState } from 'react'
import { Task } from '../App'
import { CheckSquare, Square, Edit2, Save, X, Trash2 } from 'lucide-react'

interface TaskListProps {
  tasks: Task[]
  updateTask: (task: Task) => void
  removeTask: (taskId: string) => void
  darkMode: boolean
}

const TaskList: React.FC<TaskListProps> = ({ tasks, updateTask, removeTask, darkMode }) => {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editedTitle, setEditedTitle] = useState('')

  const toggleTask = (task: Task) => {
    updateTask({ ...task, completed: !task.completed })
  }

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id)
    setEditedTitle(task.title)
  }

  const saveEdit = (task: Task) => {
    updateTask({ ...task, title: editedTitle })
    setEditingTaskId(null)
  }

  const cancelEdit = () => {
    setEditingTaskId(null)
  }

  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id} className="flex items-center mb-2">
          <button
            onClick={() => toggleTask(task)}
            className={`mr-2 ${task.completed ? 'text-green-500' : darkMode ? 'text-gray-400' : 'text-gray-600'}`}
          >
            {task.completed ? <CheckSquare size={20} /> : <Square size={20} />}
          </button>
          {editingTaskId === task.id ? (
            <>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className={`flex-grow mr-2 p-1 rounded ${
                  darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
                } border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
              />
              <button
                onClick={() => saveEdit(task)}
                className="mr-2 text-green-500 hover:text-green-600"
              >
                <Save size={20} />
              </button>
              <button
                onClick={cancelEdit}
                className="text-red-500 hover:text-red-600"
              >
                <X size={20} />
              </button>
            </>
          ) : (
            <>
              <span className={`flex-grow ${task.completed ? 'line-through' : ''} ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {task.title}
              </span>
              <button
                onClick={() => startEditing(task)}
                className={`ml-2 ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'}`}
              >
                <Edit2 size={20} />
              </button>
              <button
                onClick={() => removeTask(task.id)}
                className={`ml-2 ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'}`}
              >
                <Trash2 size={20} />
              </button>
            </>
          )}
        </li>
      ))}
    </ul>
  )
}

export default TaskList