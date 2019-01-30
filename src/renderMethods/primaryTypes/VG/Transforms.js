import React from 'react'

const translate = params => {
  const {x=0, y=0} = params
  return `translate(${x},${y})`
}

const scale = params => {
  const {x=1, y=1} = params
  return `scale(${x},${y})`
}

const matrix = params => {
  const [a=1, b=0, c=0, d=1, e=0, f=0] = params
  return `matrix(${a},${b},${c},${d},${e},${f})`
}

const transform = props => {
  const {type, params} = props
  switch(type) {
    case 'matrix': return matrix(params)
    case 'scale': return scale(params)
    case 'translate': return translate(params)
    case 'invertXY': return matrix([0,1,1,0])
    default: return 'none'
  }
}

export const Transforms = props => {
  const {list} = props
  const transformlist = []
  for (const t of list) {
    const str = typeof t === 'string' ? transform({type: t}) : transform(t)
    if (str !== 'none') {
      transformlist.push(str)
    }
  }
  return (
    <g transform={transformlist.length === 0 ? undefined : transformlist.join(' ')}>
      {props.children}
    </g>
  ) 
}