import { createTree } from './QuadTree'


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

export function round(n, d) {
	return Math.round(d * Math.pow(10,d)) / Math.pow(10,d)
}

const clipdef = ({span, padX, padY, clipID}) => {
	const [x0, y0, x1, y1] = span
	const w = x1 - x0, h = y1 - y0
	return (
		[
			'defs'
			[
				'clipPath', {id: `clip-path-${clipID}`},
				[
					'rect', {x: x0-padX, y: y0-padY, width: w+2*padX, height: h+2*padY}
				]
			]
		]
	)
}

let clipCounter = 0

export const cartesianPlane = function(props, ...children) {
	const {span, autogrid=false, padding, ...otherprops} = props
  const [x0, y0, x1, y1] = span
  const xpad = (x1 - x0) * .1
  const ypad = (y1 - y0) * .1
  const clipPadX = padding === undefined ? (x1 - x0) * .005 : padding
  const clipPadY = padding === undefined ? (y1 - y0) * .005 : padding
  const w = x1 - x0
  const h = y1 - y0
  const viewBox = `${x0-xpad} ${-y1-ypad} ${w+2*xpad} ${h+2*ypad}`

  const clipID = ++clipCounter

  return (
		[
			'svg', {viewBox, className: 'plot-cartesian-plane', ...otherprops},
			clipdef({span, padX: clipPadX, padY: clipPadY, clipID}),
			[
				'g', {style: {transform: 'scale(1,-1)'}},
				(autogrid ? grid({x: {start: x0, end: x1}, y: {start: y0, end: y1}}) : null),
				[
					'g', {clipPath: `url(#clip-path-${clipID})`},
					...children,
				]
			]
		]
	)
}


export const grid = function(props) {
	const x = {step: 1, axis: 0}
  const y = {step: 1, axis: 0}
  Object.assign(x, props.x)
  Object.assign(y, props.y)

	let t
  const xvals = []
  if (x.step) {
    t = x.start
    while (t <= x.end) {
      xvals.push(t);
      t += x.step
    }
  }

  const yvals = []
  if (y.step) {
    t = y.start
    while (t <= y.end) {
      yvals.push(t);
      t += y.step
    }
	}

	const xmap = v => ['path', {
		className: 'plot-grid-line', 
		d: `M${v},${y.start}V${y.end}`,
		vectorEffect: 'non-scaling-stroke',
	}]

	const ymap = v => ['path', {
		className: 'plot-grid-line',
		d: `M${x.start},${v}H${x.end}`,
		vectorEffect: 'non-scaling-stroke',
	}]
	
	return ['g', 
		...xvals.map(xmap),
		...yvals.map(ymap),
		['path', {className: 'plot-axis', d: `M${x.axis},${y.start}V${y.end}`, vectorEffect: 'non-scaling-stroke'}],
		['path', {className: 'plot-axis', d: `M${x.start},${y.axis}H${x.end}`, vectorEffect: 'non-scaling-stroke'}],
	]
}

export const point = (props) => {
	const {x, y, coords, ...otherprops} = props
	const pt = coords ? `${coords[0]},${coords[1]}` : `${x},${y}`
  const d = `M${pt}L${pt}z`
  return [
		'path', 
		{d, className: 'plot-path-point', vectorEffect: 'non-scaling-stroke'},
	]
}

export const hole = (props) => {
  const {x, y, coords, inner, outer} = props
  const d = `M${coords ? `${coords[0]},${coords[1]}` : `${x},${y}`}z`
  return [
		'path',
		{d, className: 'plot-hole', vectorEffect: 'non-scaling-slope'},
	]
}


const defaultMarker = p => ['circle', {cx: p.x, cy: p.y, r: '0.05'}]

export const quadTreePlot = function(
	quadtreeprops, 
	{marker=defaultMarker, style={fill: 'rgba(200,0,100,0.6)'}}={}
) {
	const {f, x, y, d, depth, searchDepth} = quadtreeprops
	const points = createTree(f, x, y, d, depth, searchDepth)
	return [
		'g', {style: style},
		...points.map(marker),
	]
}
