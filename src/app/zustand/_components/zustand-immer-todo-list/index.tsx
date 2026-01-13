'use client'

import { DeleteOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Checkbox, Input } from 'antd'
import { memo, useState } from 'react'

import { useClientItemRenderCount, useClientRenderCount } from '../../_hooks/use-client-render-count'
import { useTodoImmerStore, useTodoImmerStoreApi } from '../../_hooks/use-todo-immer-store'

const itemRenderCounts = new Map<number, number>()

interface ZustandImmerTodoItemProps {
  id: number
  text: string
  completed: boolean
  onToggle: (id: number) => void
  onRemove: (id: number) => void
  onUpdate: (id: number, text: string) => void
}

const ZustandImmerTodoItem = memo<ZustandImmerTodoItemProps>(({
  id,
  text,
  completed,
  onToggle,
  onRemove,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(text)

  const count = useClientItemRenderCount(id)

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(id, editText.trim())
      setIsEditing(false)
    }
  }

  return (
    <div className='flex items-center gap-2 p-2 bg-gray-50 rounded'>
      <Checkbox checked={completed} onChange={() => onToggle(id)} />
      {isEditing
        ? (
            <Input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onPressEnter={handleSave}
              className='flex-1'
              autoFocus
            />
          )
        : (
            <span className={completed ? 'line-through flex-1' : 'flex-1'}>{text}</span>
          )}
      <span className='text-xs text-gray-400'>
        #
        {count}
      </span>
      {isEditing
        ? (
            <Button
              type='text'
              size='small'
              icon={<SaveOutlined />}
              onClick={handleSave}
            />
          )
        : (
            <Button
              type='text'
              size='small'
              icon={<EditOutlined />}
              onClick={() => {
                setEditText(text)
                setIsEditing(true)
              }}
            />
          )}
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

ZustandImmerTodoItem.displayName = 'ZustandImmerTodoItem'

const itemsRenderCount = 0

const ZustandImmerTodoItems: React.FC = () => {
  const todos = useTodoImmerStore((state) => state.todos)
  const toggleTodo = useTodoImmerStore((state) => state.toggleTodo)
  const removeTodo = useTodoImmerStore((state) => state.removeTodo)
  const updateTodoText = useTodoImmerStore((state) => state.updateTodoText)

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
          <ZustandImmerTodoItem
            key={todo.id}
            id={todo.id}
            text={todo.text}
            completed={todo.completed}
            onToggle={toggleTodo}
            onRemove={removeTodo}
            onUpdate={updateTodoText}
          />
        ))}
      </div>
    </div>
  )
}

const renderCount = 0

export const ZustandImmerTodoList: React.FC = () => {
  const [inputValue, setInputValue] = useState('')
  const store = useTodoImmerStoreApi()
  const localRenderCount = useClientRenderCount()

  return (
    <div className='border-2 border-green-500 rounded-lg p-4'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-lg font-bold'>Zustand + Immer Todo List</h3>
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
      <ZustandImmerTodoItems />
    </div>
  )
}
