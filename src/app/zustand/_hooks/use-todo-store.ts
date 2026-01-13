'use client'

import { useContext } from 'react'
import { useStore } from 'zustand'

import { TodoStoreContext, type TodoStoreState } from '../_contexts/todo-store-context'

export function useTodoStore<T>(selector: (state: TodoStoreState) => T): T {
  const store = useContext(TodoStoreContext)
  if (!store) {
    throw new Error('useTodoStore must be used within TodoStoreProvider')
  }
  return useStore(store, selector)
}

export function useTodoStoreApi() {
  const store = useContext(TodoStoreContext)
  if (!store) {
    throw new Error('useTodoStoreApi must be used within TodoStoreProvider')
  }
  return store
}
