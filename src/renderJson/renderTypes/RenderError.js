import React from 'react'

export const RenderError = props => {
  return (
    <>
      {props.children.map((c,i) => <code key={i} className='render-error'>{JSON.stringify(c)}</code>)}
    </>
  )
}