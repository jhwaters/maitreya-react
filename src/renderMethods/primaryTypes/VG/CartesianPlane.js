import React from 'react'


export function makesrange(min, max, step=1, anchor) {
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



const AutoClip = ({span, padX, padY, clipID}) => {
  const [x0, y0, x1, y1] = span
  const w = x1 - x0, h = y1 - y0
  return (
    <clipPath id={`clip-path-${clipID}`}>
      <rect x={x0-padX} y={y0-padY} 
      width={w+2*padX} height={h+2*padY}/>
    </clipPath>
  )
}

const AxisH = (props) => {
  const {span, origin=[0,0]} = props
  const orig = `${origin[0]},${origin[1]}`
  return (
    <>
    {span[0] === origin[0] ? null : <path className='vg-axis vg-axis-neg' d={`M${orig}H${span[0]}`} vectorEffect='non-scaling-stroke'/>}
    <path className='vg-axis vg-axis-pos' d={`M${orig}H${span[1]}`} vectorEffect='non-scaling-stroke'/>
    </>
  )
}

const AxisV = (props) => {
  const {span, origin=[0,0]} = props
  const orig = `${origin[0]},${origin[1]}`
  return (
    <>
    {span[0] === origin[1] ? null : <path className='vg-axis vg-axis-neg' d={`M${orig}V${span[0]}`} vectorEffect='non-scaling-stroke'/>}
    <path className='vg-axis vg-axis-pos' d={`M${orig}V${span[1]}`} vectorEffect='non-scaling-stroke'/>
    </>
  )
}

export const Grid = (props) => {
  const {span, step=[1,1], origin=[0,0]} = props
  const axis = props.axis !== undefined ? props.axis : [...origin]

  const x = {span: [span[0], span[2]], step: step[0], origin: origin[0]}
  const y = {span: [span[1], span[3]], step: step[1], origin: origin[1]}

  const xvals = x.step ? makesrange(...x.span, x.step, x.origin) : []
  const yvals = y.step ? makesrange(...y.span, y.step, y.origin) : []

  let hAxis = axis === null ? false : (axis[1] === null ? false : true)
  let vAxis = axis === null ? false : (axis[0] === null ? false : true)

  return (
    <>
      {xvals.map(v => <path key={`x-${v}`} className='vg-path vg-grid' d={`M${v},${y.span[0]}V${y.span[1]}`} vectorEffect='non-scaling-stroke'/>)}
      {yvals.map(v => <path key={`y-${v}`} className='vg-path vg-grid' d={`M${x.span[0]},${v}H${x.span[1]}`} vectorEffect='non-scaling-stroke'/>)}
      {vAxis ? <AxisV span={y.span} origin={axis} /> : null}
      {hAxis ? <AxisH span={x.span} origin={axis} /> : null}
    </>
  )
}


let clipCounter = 0
export const CartesianPlane = (props) => {
  const {span, autogrid=false, padding, style='xy-plot', ...otherprops} = props
  const [x0, y0, x1, y1] = span
  const xpad = (x1 - x0) * .1
  const ypad = (y1 - y0) * .1
  const clipPadX = padding === undefined ? (x1 - x0) * .005 : padding
  const clipPadY = padding === undefined ? (y1 - y0) * .005 : padding
  const w = x1 - x0
  const h = y1 - y0
  

  const clipID = ++clipCounter

  const classNames = ['vg-cartesian-plane']
  if (style === 'xy-plot') {
    classNames.push('vg-style-xyplot')
  }
  if (style === 'geom') {
    classNames.push('vg-style-geom')
  }

  //const viewBox = `${x0-xpad} ${-y1-ypad} ${w+2*xpad} ${h+2*ypad}`
  const viewBox = `${x0-xpad} ${y0-ypad} ${w+2*xpad} ${h+2*ypad}`
  const translateY = y0 + y1
  const transform = `translate(0,${translateY}) scale(1,-1)`

  return (
    <svg viewBox={viewBox} 
      className={classNames.join(' ')}
      {...otherprops}>
      <defs>
        <AutoClip span={span} padX={clipPadX} padY={clipPadY} clipID={clipID} />
      </defs>
      <g transform={transform}>
        {autogrid ? <Grid span={span} /> : null}
        <g clipPath={`url(#clip-path-${clipID})`}>
          {props.children}
        </g>
      </g>
    </svg>
  )
}