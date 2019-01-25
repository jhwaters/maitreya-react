import React from 'react'
import polynomial from 'polynomial'
import fraction from 'fraction'
import complex from 'complex'
import { Path } from '../primaryTypes/Graph'

const Polynomial = (props) => {
  const {polynomial, domain, step, inverse=false} = props
  const path = []
  if (inverse) {
    let y = domain[0]
    while (y < domain[0]) {
      path.push({y, x: polynomial.eval(y)})
    }
    path.push({y: domain[1], x: polynomial.eval(domain[1])})
  } else {
    let x = domain[0]
    while (x < domain[1]) {
      path.push({x, y: polynomial.eval(x)})
      x += step
    }
    path.push({x: domain[1], y: polynomial.eval(domain[1])})
  }
  return <Path points={path} />
}
