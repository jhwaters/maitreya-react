import {
  range as mathjsrange 
} from 'mathjs'

export const range = function(start, stop, inclusive=false) {
  return mathjsrange(start, stop, inclusive)._data
}

export const gcd = (a, b) => {
  if (a > b) {
    return gcd(b, a)
  } else if (a === 0) {
    return b
  } else {
    return gcd(b % a, a)
  }
}