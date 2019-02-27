import React from 'react'
import { Path, Style, Point } from '.'


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

export const PolynomialFunction = (props) => {
  const { 
    coefficients, domain, step=0.2,
    ...otherprops
  } = props

  if (domain === undefined) {
    console.error("no domain provided for PolynomialFunction")
    return null
  }

  const f = (x) => {
    let ans = 0
    for (const deg in coefficients) {
      ans += coefficients[deg] * Math.pow(x,deg)
    }
    return ans
  }

  return <Path points={calcPath(f, domain, step)} {...otherprops}/>
}

export const RationalFunction = (props) => {
  const {
    roots=[], holes=[], asymptotes=[], numerLC=1, denomLC=1, 
    domain, step=0.2, range=[-1000,1000], 
    renderAsymptotes=true, renderRoots=true, renderHoles=true,
    style, fill,
  } = props

  if (domain === undefined) {
    console.error("no domain provided for RationalFunction")
    return null
  }

  const f = (x) => {
    let num = numerLC
    let den = denomLC
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
    let path = calcPath(f, dom, step)
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
  let ha
  if (asymptotes.length > roots.length) {
    ha = [{x: domain[0], y: 0}, {x: domain[1], y: 0}]
  } else if (asymptotes.length === roots.length) {
    ha = [{x: domain[0], y: numerLC/denomLC}, {x: domain[1], y: numerLC/denomLC}]
  }




  return (
    <>
      {renderAsymptotes ? (
        <Style name='asymptote'>
          {ha ? <Path key='hasym' points={ha} /> : null}
          {vas.map(p => <Path key={`asym${p[0].x}`} points={p} />)}
        </Style>
      ) : null}
      {style ? (
        <Style name={style}>
          {paths.map(p => <Path key={`path${p[0].x}`} points={p} fill={fill}/>)}
          {renderRoots ? roots.map(x => <Point key={`root${x}`} x={x} y={f(x)} />): null}
          {renderHoles ? holes.map(x => <Point key={`hole${x}`} x={x} y={f(x)} marker="o"/>) : null}
        </Style>
      ) : (
        <>
          {paths.map(p => <Path key={`path${p[0].x}`} points={p} fill={fill}/>)}
          {renderRoots ? roots.map(x => <Point key={`root${x}`} x={x} y={f(x)} />): null}
          {renderHoles ? holes.map(x => <Point key={`hole${x}`} x={x} y={f(x)} marker="o"/>) : null}        
        </>
      )}    
      
    </>
  )
}
