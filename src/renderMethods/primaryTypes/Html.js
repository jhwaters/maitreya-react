import React from 'react'

export const Html = ({data}) => {
  return (
    <span dangerouslySetInnerHtml={{__html: data}}/>
  )
}