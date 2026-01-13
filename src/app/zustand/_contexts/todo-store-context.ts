import { createContext } from 'react'

import type { StoreApi } from 'zustand'

import type { Todo } from '../_types/todo'

export interface TodoStoreState {
  todos: Todo[]
  addTodo: (text: string) => void
  toggleTodo: (id: number) => void
  removeTodo: (id: number) => void
  resetTodos: () => void
}

export const TodoStoreContext = createContext<StoreApi<TodoStoreState> | null>(null)
