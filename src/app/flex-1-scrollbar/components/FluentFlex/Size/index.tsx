'use client'

import { classed, deriveClassed } from '@tw-classed/react'
import React from 'react'

import Item from '../Item'

const SizeBase = classed('div')

export type SizeProps = React.ComponentProps<typeof SizeBase>

const Size = deriveClassed<typeof SizeBase, SizeProps>(
  (props, ref) => {
    const { children, ...rest } = props

    return (
      <Item>
        <div className='flex flex-1 size-0'>
          <SizeBase
            {...rest}
            ref={ref}
          >
            {children}
          </SizeBase>
        </div>
      </Item>
    )
  },
)

export default Size
