'use client'

import { useEffect, useRef } from 'react'

/**
 * 客户端专用的渲染计数器
 * 避免水合异常，仅在客户端计数和显示
 */
export function useClientRenderCount() {
  const countRef = useRef(0)
  const isClientRef = useRef(false)

  useEffect(() => {
    isClientRef.current = true
  }, [])

  if (!isClientRef.current) {
    return 0
  }

  countRef.current++
  return countRef.current
}

/**
 * 项目级别的客户端渲染计数管理
 */
export function useClientItemRenderCount(id: number) {
  const isClientRef = useRef(false)
  const countRef = useRef(new Map<number, number>())

  useEffect(() => {
    isClientRef.current = true
  }, [])

  if (!isClientRef.current) {
    return 0
  }

  const count = (countRef.current.get(id) || 0) + 1
  countRef.current.set(id, count)
  return count
}
