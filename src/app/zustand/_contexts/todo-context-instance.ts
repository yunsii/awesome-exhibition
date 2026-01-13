import { createContext } from 'react'

import type { Todo } from '../_types/todo'

interface TodoContextType {
  todos: Todo[]
  addTodo: (text: string) => void
  toggleTodo: (id: number) => void
  removeTodo: (id: number) => void
  resetTodos: () => void
}

export const TodoContext = createContext<TodoContextType | null>(null)
