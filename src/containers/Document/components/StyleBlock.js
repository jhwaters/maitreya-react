import React from 'react'

const joinStyle = (style) => Object.keys(style).map(k => `${k}:${style[k]};`).join(' ')

const StyleBlock = ({styles={}}) => {
  const lines = []
  for (const k in styles) {
    lines.push(`${k} { ${joinStyle(styles[k])} }`)
  }
  return (
    <style>
      {lines.join('\n')}
    </style>
  )
}

export default StyleBlock