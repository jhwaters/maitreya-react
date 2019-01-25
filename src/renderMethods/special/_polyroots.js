import React from 'react'
import polynomial from 'polynomial'
import fraction from 'fraction'
import complex from 'complex'


const root = (a, b=0, i=1, d=1) => ({a, b, i, d})

const conjugatePair = ({a, b, i, d}) => ({a: a, b: -b, i: i, d: d})

function rationalPart({a, b, i, d}) {
  if (d === 1) return a
  return fraction(a,d)
}
function irrationalPart({a, b, i, d}) {
  if (d === 1) {
    if (i === 'i') return complex(0,b)
    return b*i
  }
  if (i === 'i') return complex(0,fraction(b,d))
  return fraction(b*i,d)
}

const value = function({a, b, i, d}) {
  if (i === 1) {
    if (d === 1) return a + b
    return fraction(a,d) + fraction(b,d)
  }
  if (i === 'i') {
    if (d === 1) return complex(a, b)
    return complex(fraction(a,d), fraction(b,d))
  }
  if (d === 1) return a + b*i
  return fraction(a,d) + fraction(b*i,d)
}

class PolynomialRoots {

  constructor(roots) {
    this.rational = {}
    this.irrational = {}
    this.complex = {}
    for (const r of roots) {
      if (r.im) {

      }
      else if (r.d) {
        this.rational.push(r)
      }
      else 
    }
  }
}