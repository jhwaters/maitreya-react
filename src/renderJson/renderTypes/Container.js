import React from 'react'

export const Container = props => {
  const {direction='row', border=false, alignItems, justifyItems, wrap=true} = props
  const divstyle = {
    display: 'flex',
    flexDirection: direction,
    flexWrap: wrap ? 'wrap' : 'nowrap',
    border: border ? '1px solid black' : 'none',
  }
  if (direction === 'row') {
    if (alignItems === 'bottom') {
      divstyle.alignItems = 'flex-end'
    } else if (alignItems === 'top') {
      divstyle.alignItems = 'flex-start'
    } else if (alignItems === 'center') {
      divstyle.alignItems = 'center'
    }
  }

  return (
    <div style={divstyle}>
      {props.children}
    </div>
  )
}