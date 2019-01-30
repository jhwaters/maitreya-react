import React from 'react'
import { renderElement } from '..'

export const Container = ({data, options}) => {
  const {direction='column', items} = data
  return (
    <div style={{display: 'flex', flexDirection: direction}}>
      {items.map((el, i) => (
        <div key={i}>
          {renderElement(el, options)}
        </div>
      ))}
    </div>
  )
}