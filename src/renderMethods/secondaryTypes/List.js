import React from 'react'
import { JsonML } from './JsonML'

export const List = ({data, options}) => {

  return (
    <JsonML 
      data={['ol', {className: 'list-auto'}, ...data.map(d => ['li', {}, d])]} 
      options={options}
    />
  )
}