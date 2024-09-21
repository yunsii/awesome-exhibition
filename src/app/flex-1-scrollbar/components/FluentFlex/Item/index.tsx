'use client'

import { classed, deriveClassed } from '@tw-classed/react'
import { Switch } from 'antd'
import React, { useEffect, useState } from 'react'
import { cls } from 'tagged-classnames-free'

const ItemBase = classed('div', 'flex flex-1 overflow-auto', {
  variants: {
    type: {
      row: 'flex-row',
      col: 'flex-col',
    },
  },
})

export type ItemProps = React.ComponentProps<typeof ItemBase> & {
  debug?: boolean
}

const Item = deriveClassed<typeof ItemBase, ItemProps>(
  (props, ref) => {
    const { children, className, type, debug, ...rest } = props

    const [internalType, setInternalType] = useState(type)

    useEffect(() => {
      setInternalType(type)
    }, [type])

    return (
      <ItemBase
        className={cls`
          relative
          ${className}
        `}
        type={internalType}
        {...rest}
        ref={ref}
      >
        {debug && (
          <div className={cls`sticky top-0 left-0`}>
            <Switch
              checkedChildren='col'
              unCheckedChildren='row'
              checked={internalType === 'col'}
              onClick={() => {
                setInternalType(internalType === 'col' ? 'row' : 'col')
              }}
            />
          </div>
        )}
        {children}
      </ItemBase>
    )
  },
)

export default Item
