'use client'

import { Alert, Card } from 'antd'

import ToolTitle from '../_components/ToolTitle'
import { ContextTodoList } from './_components/context-todo-list'
import { ZustandImmerTodoList } from './_components/zustand-immer-todo-list'
import { ZustandTodoList } from './_components/zustand-todo-list'
import { TodoProvider } from './_contexts/todo-context'
import { TodoImmerStoreProvider } from './_contexts/todo-immer-store-provider'
import { TodoStoreProvider } from './_contexts/todo-store-provider'

export default function ZustandPage() {
  return (
    <div className='p-6 flex flex-col gap-4'>
      <ToolTitle
        name='Zustand vs Context Comparison'
        githubHref='https://github.com/pmndrs/zustand'
      />

      <Alert
        title='Render Counter Demo'
        description='This demo compares Zustand (with and without Immer) with React Context. All implement the same todo list functionality. Watch the render counters to see how Zustand optimizes re-renders through selective subscriptions, while Context re-renders all consumers when any state changes. The Zustand + Immer version shows how Immer simplifies state updates with mutable-style code.'
        type='info'
        showIcon
        className='mb-6'
      />

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <Card title='Zustand (Optimized)' className='shadow-lg'>
          <div className='mb-4 text-sm text-gray-600'>
            <p className='mb-2'>
              ✅
              <strong>Selective subscriptions</strong>
              {' '}
              - Components only re-render when their subscribed state changes
            </p>
            <p>
              ✅
              <strong>SSR-friendly with Context</strong>
              {' '}
              - Each component tree gets its own store instance
            </p>
          </div>
          <TodoStoreProvider>
            <ZustandTodoList />
          </TodoStoreProvider>
        </Card>

        <Card title='Zustand + Immer (Mutable style)' className='shadow-lg'>
          <div className='mb-4 text-sm text-gray-600'>
            <p className='mb-2'>
              ✅
              <strong>Same benefits as Zustand</strong>
              {' '}
              - Plus simpler state updates
            </p>
            <p>
              ✅
              <strong>Mutable-style updates</strong>
              {' '}
              - Write code like mutating, but it's immutable under the hood
            </p>
            <p className='mt-2 text-xs text-blue-600'>
              💡 Try editing a todo by clicking the edit icon
            </p>
          </div>
          <TodoImmerStoreProvider>
            <ZustandImmerTodoList />
          </TodoImmerStoreProvider>
        </Card>

        <Card title='React Context (Standard)' className='shadow-lg'>
          <div className='mb-4 text-sm text-gray-600'>
            <p className='mb-2'>
              ⚠️
              <strong>All consumers re-render</strong>
              {' '}
              - Any state change triggers all context consumers
            </p>
            <p>
              ⚠️
              <strong>Provider required</strong>
              {' '}
              - Must wrap components in provider
            </p>
          </div>
          <TodoProvider>
            <ContextTodoList />
          </TodoProvider>
        </Card>
      </div>

      <Card title='Observations' className='mt-6 shadow-lg'>
        <ul className='list-disc list-inside space-y-2 text-sm text-gray-700'>
          <li>
            <strong>Zustand</strong>
            : The input component only re-renders when you type. The todo items list only re-renders when todos change. Each item tracks its own render count independently.
          </li>
          <li>
            <strong>Context</strong>
            : Every consumer (input, list, all items) re-renders whenever any state changes, because context value changes trigger all consumers even if they don't use the changed data.
          </li>
          <li>
            Try adding a todo in both lists and compare the render counters - Zustand will show fewer re-renders.
          </li>
        </ul>
      </Card>
    </div>
  )
}
