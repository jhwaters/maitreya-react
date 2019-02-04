import React from 'react'


function parseBorder(border) {
  if (border === 'top') return 'borderTop'
  if (border === 'bottom') return 'borderBottom'
  if (border === 'left') return 'borderLeft'
  if (border === 'right') return 'borderRight'
}


export const EmptySpace = props => {
  const {width, height, border} = props
  const style = {margin: '0'}
  if (width) style.width = width
  if (height) style.height = height
  if (border) {
    if (Array.isArray(border)) {
      for (const b of border) {
        if (parseBorder(b)) {
          style[parseBorder(b)] = '1px solid black'
        }
      }
    }
    if (typeof border === 'string') {
      if (parseBorder(border)) {
        style[parseBorder(border)] = '1px solid black'
      }
      if (border === true) {
        style.border = '1px solid black'
      }
    }
  }
  return (
    <div style={style} />
  )
}