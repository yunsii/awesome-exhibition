import { create } from 'zustand'

import type { Todo } from '../_types/todo'

interface TodoState {
  todos: Todo[]
  addTodo: (text: string) => void
  toggleTodo: (id: number) => void
  removeTodo: (id: number) => void
}

export const useTodoStore = create<TodoState>((set) => ({
  todos: [
    { id: 1, text: 'Learn Zustand', completed: false },
    { id: 2, text: 'Compare with Context', completed: false },
    { id: 3, text: 'Build awesome apps', completed: false },
  ],
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
}))
