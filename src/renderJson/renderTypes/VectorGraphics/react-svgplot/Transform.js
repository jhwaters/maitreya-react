import React from 'react'

const translate = params => {
  let x, y
  if (Array.isArray(params)) {
    [x=0, y=0] = params
  } else {
    ({x=0, y=0} = params)
  }
  return `translate(${x},${y})`
}

const scale = params => {
  let x, y
  if (Array.isArray(params)) {
    [x=1, y=1] = params
  } else {
    ({x=1, y=1} = params)
  }
  return `scale(${x},${y})`
}

const matrix = params => {
  let a, b, c, d, e, f
  if (Array.isArray(params)) {
    [a=1, b=0, c=0, d=1, e=0, f=0] = params
  } else {
    ({a=1, b=0, c=0, d=1, e=0, f=0} = params)
  }
  return `matrix(${a},${b},${c},${d},${e},${f})`
}

const rotate = params => {
  let a, x, y
  if (Array.isArray(params)) {
    [a, x, y] = params
  } else {
    ({a, x, y} = params)
  }
  if (x !== undefined && y !== undefined) {
    return `rotate(${a},${x},$${y})`
  }
  return `rotate(${a})`
}

const makeTransform = props => {
  const {type, params} = props
  switch(type) {
    case 'matrix': return matrix(params)
    case 'rotate': return rotate(params)
    case 'scale': return scale(params)
    case 'translate': return translate(params)
    case 'invertXY': return matrix([0,1,1,0])
    default: return 'none'
  }
}


const Transform = props => {
  const { type, list, children, ...params } = props

  const layerprops = { vectorEffect: 'inherit' }

  if (list) {
    const transforms = []
    for (const t of list) {
      const [ty, pa={}] = typeof t === 'string' ? [t] : t
      const str = makeTransform({type: ty, params: pa})
      if (str !== 'none') {
        transforms.push(str)
      }
    }
    if (transforms.length > 0) {
      layerprops.transform = transforms.join(' ')
    }
  } else {
    const str = makeTransform({type, params})
    if (str && str !== 'none') {
      layerprops.transform = str
    }
  }

  return (
    <g {...layerprops}>
      {props.children}
    </g>
  ) 
}

export default Transform