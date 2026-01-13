'use client'

import { useCallback, useMemo, useState } from 'react'

import type React from 'react'

import { TodoContext } from './todo-context-instance'

import type { Todo } from '../_types/todo'

const INITIAL_TODOS: Todo[] = [
  { id: 1, text: 'Learn Zustand', completed: false },
  { id: 2, text: 'Compare with Context', completed: false },
  { id: 3, text: 'Build awesome apps', completed: false },
]

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>(INITIAL_TODOS)

  const addTodo = useCallback((text: string) => {
    setTodos((prev) => [...prev, { id: Date.now(), text, completed: false }])
  }, [])

  const toggleTodo = useCallback((id: number) => {
    setTodos((prev) => prev.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo,
    ))
  }, [])

  const removeTodo = useCallback((id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }, [])

  const resetTodos = useCallback(() => {
    setTodos(INITIAL_TODOS)
  }, [])

  const value = useMemo(() => ({
    todos,
    addTodo,
    toggleTodo,
    removeTodo,
    resetTodos,
  }), [todos, addTodo, toggleTodo, removeTodo, resetTodos])

  return (
    <TodoContext value={value}>
      {children}
    </TodoContext>
  )
}
