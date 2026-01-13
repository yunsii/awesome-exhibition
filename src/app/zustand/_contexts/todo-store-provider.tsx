'use client'

import { useRef } from 'react'
import { createStore, type StoreApi } from 'zustand'

import type React from 'react'

import { TodoStoreContext, type TodoStoreState } from './todo-store-context'

import type { Todo } from '../_types/todo'

const DEFAULT_TODOS: Todo[] = [
  { id: 1, text: 'Learn Zustand', completed: false },
  { id: 2, text: 'Compare with Context', completed: false },
  { id: 3, text: 'Build awesome apps', completed: false },
]

interface TodoStoreProviderProps {
  children: React.ReactNode
  initialTodos?: Todo[]
}

export const TodoStoreProvider: React.FC<TodoStoreProviderProps> = ({
  children,
  initialTodos = DEFAULT_TODOS,
}) => {
  const storeRef = useRef<StoreApi<TodoStoreState> | null>(null)

  if (!storeRef.current) {
    storeRef.current = createStore<TodoStoreState>((set) => ({
      todos: initialTodos,
      addTodo: (text) =>
        set((state) => ({
          todos: [
            ...state.todos,
            { id: Date.now(), text, completed: false },
          ],
        })),
      toggleTodo: (id) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo,
          ),
        })),
      removeTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),
      resetTodos: () =>
        set(() => ({
          todos: initialTodos,
        })),
    }))
  }

  return (
    <TodoStoreContext value={storeRef.current!}>
      {children}
    </TodoStoreContext>
  )
}
