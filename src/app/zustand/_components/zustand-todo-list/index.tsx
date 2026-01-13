'use client'

import { DeleteOutlined } from '@ant-design/icons'
import { Button, Checkbox, Input } from 'antd'
import { memo, useState } from 'react'

import { useClientItemRenderCount, useClientRenderCount } from '../../_hooks/use-client-render-count'
import { useTodoStore, useTodoStoreApi } from '../../_hooks/use-todo-store'

interface ZustandTodoItemProps {
  id: number
  text: string
  completed: boolean
  onToggle: (id: number) => void
  onRemove: (id: number) => void
}

const ZustandTodoItem = memo<ZustandTodoItemProps>(({
  id,
  text,
  completed,
  onToggle,
  onRemove,
}) => {
  const count = useClientItemRenderCount(id)

  return (
    <div className='flex items-center gap-2 p-2 bg-gray-50 rounded'>
      <Checkbox checked={completed} onChange={() => onToggle(id)} />
      <span className={completed ? 'line-through flex-1' : 'flex-1'}>{text}</span>
      <span className='text-xs text-gray-400'>
        #
        {count}
      </span>
      <Button
        type='text'
        danger
        size='small'
        icon={<DeleteOutlined />}
        onClick={() => onRemove(id)}
      />
    </div>
  )
})

ZustandTodoItem.displayName = 'ZustandTodoItem'

const itemsRenderCount = 0

const ZustandTodoItems: React.FC = () => {
  const todos = useTodoStore((state) => state.todos)
  const toggleTodo = useTodoStore((state) => state.toggleTodo)
  const removeTodo = useTodoStore((state) => state.removeTodo)

  const localItemsRenderCount = useClientRenderCount()

  return (
    <div>
      <div className='text-xs text-gray-400 mb-2'>
        Items Component Renders:
        {' '}
        {localItemsRenderCount}
      </div>
      <div className='space-y-2'>
        {todos.map((todo) => (
          <ZustandTodoItem
            key={todo.id}
            id={todo.id}
            text={todo.text}
            completed={todo.completed}
            onToggle={toggleTodo}
            onRemove={removeTodo}
          />
        ))}
      </div>
    </div>
  )
}

const renderCount = 0

export const ZustandTodoList: React.FC = () => {
  const [inputValue, setInputValue] = useState('')
  const store = useTodoStoreApi()
  const localRenderCount = useClientRenderCount()

  return (
    <div className='border-2 border-blue-500 rounded-lg p-4'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-lg font-bold'>Zustand Todo List</h3>
        <span className='text-sm text-gray-500'>
          Renders:
          {localRenderCount}
        </span>
      </div>
      <div className='mb-4 flex gap-2'>
        <Input
          placeholder='Add new todo...'
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onPressEnter={() => {
            if (inputValue.trim()) {
              store.getState().addTodo(inputValue)
              setInputValue('')
            }
          }}
        />
        <Button
          type='primary'
          onClick={() => {
            if (inputValue.trim()) {
              store.getState().addTodo(inputValue)
              setInputValue('')
            }
          }}
        >
          Add
        </Button>
        <Button
          onClick={() => {
            store.getState().resetTodos()
          }}
        >
          Reset
        </Button>
      </div>
      <ZustandTodoItems />
    </div>
  )
}
