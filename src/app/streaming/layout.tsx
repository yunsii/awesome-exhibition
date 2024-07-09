import React from 'react'

export interface ILayoutProps {
  children?: React.ReactNode
}

const Layout: React.FC<ILayoutProps> = (props) => {
  const { children } = props
  return (
    <section className='p-4'>
      <h1>Streaming Layout</h1>
      {children}
    </section>
  )
}

export default Layout
