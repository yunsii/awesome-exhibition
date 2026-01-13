'use client'

import { useContext } from 'react'
import { useStore } from 'zustand'

import { TodoImmerStoreContext, type TodoImmerStoreState } from '../_contexts/todo-immer-store-context'

export function useTodoImmerStore<T>(selector: (state: TodoImmerStoreState) => T): T {
  const store = useContext(TodoImmerStoreContext)
  if (!store) {
    throw new Error('useTodoImmerStore must be used within TodoImmerStoreProvider')
  }
  return useStore(store, selector)
}

export function useTodoImmerStoreApi() {
  const store = useContext(TodoImmerStoreContext)
  if (!store) {
    throw new Error('useTodoImmerStoreApi must be used within TodoImmerStoreProvider')
  }
  return store
}
