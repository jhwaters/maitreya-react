import React from 'react'
import math from 'mathjs'
import { Path } from '../primaryTypes/Graph'


const round = function(v, n) {
  const d = Math.pow(10,n)
  return Math.floor(d*v) / d
}

export function calcParametric(x, y, domain, step) {
  const f = (t) => ({x: round(x(t), 6), y: round(y(t), 6)})
  let paths = []
  let points = []
  let t = domain[0]
  while (t < domain[1]) {
    try {
      const pt = f(t)
      if (points.length > 0 && Math.abs(pt.y - points[points.length-1].y) > 100) {
        paths.push(points)
        points = [pt]
      } else {
        points.push(pt)
      }
    } catch(e) {
      if (points.length > 0) {
        paths.push(points)
        points = []
      }
    }
    t += step
  }
  try {
    points.push(f(domain[1]))
  } catch(e) {}
  if (points.length > 0) paths.push(points)
  return paths
}

export function parseFunction(str) {
  try {
    const nodes = math.parse(str)
    const func = nodes.compile()
    return scope => func.eval(scope)
  } catch(e) {
    console.error(e)
  }
}

export const Parametric = (props) => {
  const {x='t', y='t', domain=[-12,12], step=0.1}=props
  const xmap = parseFunction(x)
  if (!xmap) {
    console.error(`Could not parse ${x} as a function of t`)
    return null
  }
  const ymap = parseFunction(y)
  if (!ymap) {
    console.error(`Could not parse ${y} as a function of t`)
    return null
  }
  const paths = calcParametric(t => xmap({t}), t => ymap({t}), domain, step)
  return paths.map((p,i) => <Path key={i} points={p} />)
}

export const Function = (props) => {
  const {domain=[-12,12], step=0.1} = props
  if (props.y) {
    const y = parseFunction(props.y)
    if (y) {
      const paths = calcParametric(x => x, x => y({x}), domain, step)
      return paths.map((p,i) => <Path key={i} points={p} />)
    }
  }
  if (props.x) {
    const x = parseFunction(props.x)
    if (x) {
      const paths = calcParametric(y => x({y}), y => y, domain, step)
      return paths.map((p,i) => <Path key={i} points={p} />)
    }
  }
  return null
}

