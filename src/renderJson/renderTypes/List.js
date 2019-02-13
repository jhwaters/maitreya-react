import React from 'react'

export const List = props => {
  const {type} = props
  return (
    <ol type={type}>
      {React.Children.map(props.children, c => <li>{c}</li>)}
    </ol>
  )
}