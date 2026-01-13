'use client'

import { useContext } from 'react'

import { TodoContext } from '../_contexts/todo-context-instance'

export function useTodoContext() {
  const context = useContext(TodoContext)
  if (!context) {
    throw new Error('useTodoContext must be used within TodoProvider')
  }
  return context
}
