import math from 'mathjs'

export const range = function(start, stop, inclusive=false) {
  if (inclusive) {
    return math.range(start, stop+1)._data
  }
  return math.range(start, stop)._data
}

export const roundTo = (n, d) => {
  const f = Math.pow(10, d)
  return Math.round(n*f) / f
} 

export const gcd = (a, b) => math.gcd(a, b)

export const divrem = function(n, p) {
  let r = n
  let d = 0
  while (r % p === 0) {
    r = r / p
    d += 1
  }
  return [d, r]
}

export const primeFactorization = function(n) {
  let result = {}
  let r = n
  let d
  let p = 2
  if (r % p === 0) {
    [d, r] = divrem(r, p)
    result[p] = d
  }
  p = 3
  if (r % p === 0) {
    [d, r] = divrem(r, p)
    result[p] = d
  }
  p = 5
  while (p * p <= r) {
    if (r % p === 0) {
      [d, r] = divrem(r, p)
      result[p] = d
    }
    if (r === 1) {
      return result
    }
    p += 2
    if (r % p === 0) {
      [d, r] = divrem(r, p)
      result[p] = d
    }
    if (r === 1) {
      return result
    }
    p += 4
  }
  if (r !== 1) {
    result[r] = 1
  }
  return result
}

export const listFactors = function(n, {include1=false, includeN=false}) {
  let result = []
  const start = include1 ? 1 : 2
  const stop = includeN ? n : n-1
  for (let i = start; i <= stop; i++) {
    if (n % i === 0) {
      result.push(i)
    } 
  }
  return result
}
