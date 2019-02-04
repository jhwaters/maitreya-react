import React from 'react'
import { MarkerDefs } from '.'

function makesrange(min, max, step=1, anchor) {
	if (anchor === undefined) {
		anchor = min;
	} else if (anchor < min) {
		anchor = min;
	} else if (anchor > max) {
		anchor = max;
	}
	let r = [anchor,];
	let v = anchor - step;
	while (v >= min) {
			r.splice(0, 0, v);
			v -= step;
	}
	v = anchor + step;
	while (v <= max) {
			r.push(v);
			v += step;
	}
	return r;
}



export const Grid = (props) => {
  const {span, step=[1,1], origin=[0,0], axis=false} = props

  const [x1, y1, x2, y2] = span
  const x = {span: [+x1, +x2], step: +step[0], origin: +origin[0]}
  const y = {span: [+y1, +y2], step: +step[1], origin: +origin[1]}

  const xvals = x.step ? makesrange(...x.span, x.step, x.origin) : []
  const yvals = y.step ? makesrange(...y.span, y.step, y.origin) : []

  return (
    <g className='vg-grid'>
      {xvals.map(v => (
        <line key={`x-${v}`}
          x1={v} x2={v} y1={y.span[0]} y2={y.span[1]} 
          vectorEffect='non-scaling-stroke'/>
      ))}
      {yvals.map(v => (
        <line key={`y-${v}`}
          y1={v} y2={v} x1={x.span[0]} x2={x.span[1]} 
          vectorEffect='non-scaling-stroke'/>
      ))}
      {axis ? (
        <>
          <Axis x1={x1} x2={x2} y1={origin[0]} y2={origin[0]} />
          <Axis y1={y1} y2={y2} x1={origin[1]} x2={origin[1]} />
        </>
      ) : null}
    </g>
  )
}

const AxisMarker = () => {
  return (
    <path d='M 1,0 Q 0,0 0,4 Q 1,1 3,0 Q 1,-1 0,-4 Q 0,0 1,0'/>
  )
}

export const Axis = props => {
  const {x1, x2, y1, y2} = props
  return (
    <line className='vg-axis' 
      x1={x1} y1={y1} x2={x2} y2={y2} 
      vectorEffect='non-scaling-stroke'
    />
  )
}