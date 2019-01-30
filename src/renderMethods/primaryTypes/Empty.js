import React from 'react'

export const EmptySpace = ({data, options}) => {
  const {width, height} = data
  return (
    <div style={{width, height, margin: '0'}} />
  )
}