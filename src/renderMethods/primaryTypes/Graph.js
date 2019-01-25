import React from 'react'

const SvgJsonML = (data, options) => {
  try {
    if (typeof data === 'string') {
      return data
    }
    let [type, props, ...children] = data
    if (props) {
      if (Array.isArray(props) || typeof props === 'string') {
        children.splice(0,0,props)
        props = {}
      }
    }
    const renderType = {
      CartesianPlane, 
      Layer,
      Grid, 
      Asymptote, 
      Path, 
      Hole, 
      Point, 
      Polynomial,
      Rational,
    }[type]
    return React.createElement(renderType, props, ...children.map(c => SvgJsonML(c, options)))
  } catch(e) {
    console.error(e)
    return null
  }
}

export const Graph = ({data, options}) => SvgJsonML(data, options)

export const CartesianPlane = (props) => {
  const {start, stop, grid=true, padding=0.1, ...otherprops} = props
  if (!props.height && !props.width) {
    otherprops.height = '1.8in'
  }
  const [x0, y0] = start
  const [x1, y1] = stop
  const w = x1 - x0
  const h = y1 - y0
  const viewBox = `${x0-padding} ${-y1-padding} ${w+2*padding} ${h+2*padding}`
  return (
    <svg viewBox={viewBox} 
      className='plot-cartesian-plane' 
      {...otherprops}>
      <g style={{transform: 'scale(1,-1)'}}>
        {grid ? <Grid start={start} stop={stop} /> : null}
        {props.children}
      </g>
    </svg>
  )
}

export const Layer = (props) => {
  return (
    <g {...props}>
      {props.children}
    </g>
  )
}

export const Grid = (props) => {
  const {
    start, stop,
    step=[1,1], 
    axes=[0,0],
  } = props

  const [x0, y0] = start
  const [x1, y1] = stop
  const [xStep, yStep] = step
  const [xAxis, yAxis] = axes

  const xvals = []
  let x = x0
  while (x <= x1) {
    xvals.push(x);
    x += xStep
  }

  const yvals = []
  let y = y0
  while (y <= y1) {
    yvals.push(y);
    y += yStep
  }
  
  return (
    <>
      {xvals.map(x => <path key={`x-${x}`} className='plot-grid-line' d={`M${x},${y0}V${y1}`} vectorEffect='non-scaling-stroke'/>)}
      {yvals.map(y => <path key={`y-${y}`} className='plot-grid-line' d={`M${x0},${y}H${x1}`} vectorEffect='non-scaling-stroke'/>)}
      <path key='ax1' className='plot-grid-axis' d={`M${xAxis},${y0}V${y1}`} vectorEffect='non-scaling-stroke'/>
      <path key='ax2' className='plot-grid-axis' d={`M${x0},${yAxis}H${x1}`} vectorEffect='non-scaling-stroke'/>
    </>
  )
}

export const Point = (props) => {
  const {x, y, coords, ...otherprops} = props
  const d = `M${coords ? `${coords[0]},${coords[1]}` : `${x},${y}`}z`
  return (
    <path className='plot-point'
      vectorEffect='non-scaling-stroke'
      d={d}
      {...otherprops}
    />
  )
}

export const Hole = (props) => {
  const {x, y, coords, inner, outer} = props
  const d = `M${coords ? `${coords[0]},${coords[1]}` : `${x},${y}`}z`
  return (
    <>
      <path key='ext' className='plot-hole-exterior'
        vectorEffect='non-scaling-stroke'
        d={d}
        {...outer}
      />
      <path key='inner' className='plot-hole-interior'
        vectorEffect='non-scaling-stroke'
        d={d}
        {...inner}
      />
    </>
  )
}

function pathFromPoints(points, inverse=false) {
  if (Array.isArray(points[0])) {
    if (inverse) {
      return `M${points.map(p => `${p[1]},${p[0]}`).join('L')}`
    }
    return `M${points.map(p => `${p[0]},${p[1]}`).join('L')}`
  }
  if (inverse) {
    return `M${points.map(p => `${p.y},${p.x}`).join('L')}`
  }
  return `M${points.map(p => `${p.x},${p.y}`).join('L')}`
}

export const Path = (props) => {
  const {points, inverse=false, ...otherprops} = props
  return (
    <path className='plot-path' 
      vectorEffect='non-scaling-stroke'
      d={pathFromPoints(points, inverse)}
      {...otherprops}
    />
  )
}

export const ShadedRegion = (props) => {
  const {points, ...otherprops} = props
  return (
    <path className='plot-region-shaded' 
      vectorEffect='non-scaling-stroke'
      d={pathFromPoints(points)}
      {...otherprops}
    />
  )
}

export const Asymptote = (props) => {
  const {points, otherprops} = props
  return (
    <path className='plot-asymptote'
      vectorEffect='non-scaling-stroke'
      d={pathFromPoints(points)}
      {...otherprops}
    />
  )
}

const calcPath = function(f, domain, step=0.1) {
  let path = []
  let x = domain[0]
  while (x < domain[1]) {
    path.push({x: x, y: f(x)})
    x += step
  }
  path.push(({x: domain[1], y: f(domain[1])}))
  return path
}

export const Polynomial = (props) => {
  const { 
    coefficients, domain, step=0.1,
    ...otherprops
  } = props

  const f = (x) => {
    let ans = 0
    for (const deg in coefficients) {
      ans += coefficients[deg] * Math.pow(x,deg)
    }
    return ans
  }

  return <Path points={calcPath(f, domain, step)} {...otherprops}/>
}

export const Rational = (props) => {
  const {
    roots=[], holes=[], asymptotes=[], numerCoeff=1, denomCoeff=1, 
    domain, step=0.1, range=[-100,100],
    ...otherprops
  } = props

  const f = (x) => {
    let num = numerCoeff
    let den = denomCoeff
    for (const r of roots) {
      num *= (x - r)
    }
    for (const r of asymptotes) {
      den *= (x - r)
    }
    return num / den
  }

  const domainPts = {
    [+domain[0]] : true,
    [+domain[1]] : true,
  }

  for (const r of asymptotes.filter(r => r >= domain[0] && r <= domain[1])) {
    domainPts[+r] = false
  }

  const domains = []
  const dp = Object.keys(domainPts).sort((a,b) => a-b)
  for (let i = 1; i<dp.length; i++) {
    const [v1, v2] = [dp[i-1], dp[i]]
    domains.push([
      {val: v1, def: domainPts[v1]},
      {val: v2, def: domainPts[v2]}, 
    ])
  }
  
  const paths = []
  for (const d of domains) {
    
    const dom = [
      d[0].def ? +d[0].val : +d[0].val + step,
      d[1].def ? +d[1].val : +d[1].val - step,
    ]
    console.log(dom)
    let path = calcPath(f, dom, step)
    console.log(path)
    if (!d[0].def) {
      let p = path[0]
      while (p.y > range[0] && p.y < range[1]) {
        const x = (3*d[0].val + p.x) / 4
        p = {x, y: f(x)}
        path = [p, ...path]
      }
    }
    if (!d[1].def) {
      let p = path[path.length-1]
      while (p.y > range[0] && p.y < range[1]) {
        const x = (3*d[1].val + p.x) / 4
        p = {x, y: f(x)}
        path.push(p)
      }
    }
    paths.push(path)
  }

  const vas = asymptotes.map(x => [{x: x, y: range[0]}, {x: x, y: range[1]}])
  let ha = null
  if (asymptotes.length > roots.length) {
    ha = [{x: domain[0], y: 0}, {x: domain[1], y: 0}]
  } else if (asymptotes.length === roots.length) {
    ha = [{x: domain[0], y: numerCoeff/denomCoeff}, {x: domain[1], y: numerCoeff/denomCoeff}]
  }

  return (
    <>
      {ha ? <Asymptote key='hasym' points={ha} /> : null}
      {vas.map(p => <Asymptote key={`asym${p[0].x}`} points={p} />)}
      {paths.map(p => <Path key={`path${p[0].x}`} points={p} {...otherprops} />)}
      {roots.map(x => <Point key={`root${x}`} x={x} y={f(x)} />)}
      {holes.map(x => <Hole key={`hole${x}`} x={x} y={f(x)} />)}
    </>
  )
}
