import React from 'react'

export interface ILayoutProps {
  children?: React.ReactNode
}

const Layout: React.FC<ILayoutProps> = (props) => {
  const { children } = props
  return (
    <section className='flex h-screen p-4'>
      {children}
    </section>
  )
}

export default Layout
