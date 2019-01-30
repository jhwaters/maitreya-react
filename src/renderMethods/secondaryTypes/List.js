import React from 'react'
import { renderElement } from '..'

export const List = ({data, options}) => {
  const {type='lower-roman', spaceAfterItem='0', items} = data
  return (
    <ol style={{listStyleType: type}}>
      {items.map((elem, i) => <li key={i} style={{marginBottom: spaceAfterItem}}>{renderElement(elem, options)}</li>)}
    </ol>
  )
}