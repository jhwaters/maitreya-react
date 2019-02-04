import React from 'react'

export const Plain = props => {
  return (
    <>
      {props.children.map((c,i) => <span key={i}>{c}</span>)}
    </>
  )
}

