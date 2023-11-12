import React from 'react'

export interface IToolTitleProps {
  name: string
  githubHref: string
}

const ToolTitle: React.FC<IToolTitleProps> = (props) => {
  const { name, githubHref } = props
  return (
    <h2 className={`mb-2 flex items-center gap-2`}>
      <span>{name}</span>
      <a
        className={`i-mdi--github text-black hover:text-black transform hover:scale-110`}
        href={githubHref}
        target='_blank'
        rel='noreferrer'
      />
    </h2>
  )
}

export default ToolTitle
