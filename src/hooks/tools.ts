'use client'

import { usePathname } from 'next/navigation'

export function useToolName() {
  const pathname = usePathname()
  return pathname.split('/')[2]
}
