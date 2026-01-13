'use client'

import { DeleteOutlined } from '@ant-design/icons'
import { Button, Checkbox, Input } from 'antd'
import { memo, useState } from 'react'

import { useClientItemRenderCount, useClientRenderCount } from '../../_hooks/use-client-render-count'
import { useTodoContext } from '../../_hooks/use-todo-context'

interface ContextTodoItemProps {
  id: number
  text: string
  completed: boolean
  onToggle: (id: number) => void
  onRemove: (id: number) => void
}

const ContextTodoItem = memo<ContextTodoItemProps>(({
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

ContextTodoItem.displayName = 'ContextTodoItem'

const itemsRenderCount = 0

const ContextTodoItems: React.FC = () => {
  const { todos, toggleTodo, removeTodo } = useTodoContext()

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
          <ContextTodoItem
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

export const ContextTodoList: React.FC = () => {
  const [inputValue, setInputValue] = useState('')
  const { addTodo, resetTodos } = useTodoContext()

  const localRenderCount = useClientRenderCount()

  return (
    <div className='border-2 border-red-500 rounded-lg p-4'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-lg font-bold'>Context Todo List</h3>
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
              addTodo(inputValue)
              setInputValue('')
            }
          }}
        />
        <Button
          type='primary'
          onClick={() => {
            if (inputValue.trim()) {
              addTodo(inputValue)
              setInputValue('')
            }
          }}
        >
          Add
        </Button>
        <Button
          onClick={() => {
            resetTodos()
          }}
        >
          Reset
        </Button>
      </div>
      <ContextTodoItems />
    </div>
  )
}
