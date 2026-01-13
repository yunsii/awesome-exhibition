import { createContext } from 'react'

import type { StoreApi } from 'zustand'

import type { Todo } from '../_types/todo'

export interface TodoImmerStoreState {
  todos: Todo[]
  addTodo: (text: string) => void
  toggleTodo: (id: number) => void
  removeTodo: (id: number) => void
  updateTodoText: (id: number, newText: string) => void
  resetTodos: () => void
}

export const TodoImmerStoreContext = createContext<StoreApi<TodoImmerStoreState> | null>(null)
