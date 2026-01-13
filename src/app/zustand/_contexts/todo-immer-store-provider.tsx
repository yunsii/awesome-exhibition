'use client'

import { useRef } from 'react'
import { createStore, type StoreApi } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import type React from 'react'

import { TodoImmerStoreContext, type TodoImmerStoreState } from './todo-immer-store-context'

import type { Todo } from '../_types/todo'

const DEFAULT_TODOS: Todo[] = [
  { id: 1, text: 'Learn Zustand + Immer', completed: false },
  { id: 2, text: 'Use immutable updates', completed: false },
  { id: 3, text: 'Simplify state management', completed: false },
]

interface TodoImmerStoreProviderProps {
  children: React.ReactNode
  initialTodos?: Todo[]
}

export const TodoImmerStoreProvider: React.FC<TodoImmerStoreProviderProps> = ({
  children,
  initialTodos = DEFAULT_TODOS,
}) => {
  const storeRef = useRef<StoreApi<TodoImmerStoreState> | null>(null)

  if (!storeRef.current) {
    storeRef.current = createStore<TodoImmerStoreState>()(
      immer((set) => ({
        todos: initialTodos,
        addTodo: (text) =>
          set((state) => {
            state.todos.push({ id: Date.now(), text, completed: false })
          }),
        toggleTodo: (id) =>
          set((state) => {
            const todo = state.todos.find((t) => t.id === id)
            if (todo) {
              todo.completed = !todo.completed
            }
          }),
        removeTodo: (id) =>
          set((state) => {
            state.todos = state.todos.filter((todo) => todo.id !== id)
          }),
        updateTodoText: (id, newText) =>
          set((state) => {
            const todo = state.todos.find((t) => t.id === id)
            if (todo) {
              todo.text = newText
            }
          }),
        resetTodos: () =>
          set(() => ({
            todos: initialTodos,
          })),
      })),
    )
  }

  return (
    <TodoImmerStoreContext value={storeRef.current!}>
      {children}
    </TodoImmerStoreContext>
  )
}
