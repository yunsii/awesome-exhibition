import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import type { Todo } from '../_types/todo'

interface TodoImmerState {
  todos: Todo[]
  addTodo: (text: string) => void
  toggleTodo: (id: number) => void
  removeTodo: (id: number) => void
  updateTodoText: (id: number, newText: string) => void
}

export const useTodoImmerStore = create<TodoImmerState>()(
  immer((set) => ({
    todos: [
      { id: 1, text: 'Learn Zustand + Immer', completed: false },
      { id: 2, text: 'Use immutable updates', completed: false },
      { id: 3, text: 'Simplify state management', completed: false },
    ],
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
  })),
)
