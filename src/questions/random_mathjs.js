import math from 'mathjs'


const setRandomSeed = s => math.config({randomSeed: s})

const randint = function(lo, hi) {
  return math.randomInt(lo, hi+1)
}

const choice = function(arr) {
  return math.pickRandom(arr)
}

const sample = function(arr, howmany) {
  return math.pickRandom(arr, howmany)
}

const poprandom = function(somearray) {
  const i = math.randomInt(0, somearray.length-1)
  const v = somearray[i]
  const remaining = [...somearray.slice(0,i), ...somearray.slice(i+1)]
  return {
    popped: v,
    remaining: remaining,
  }
}

const shuffle = (choices, first) => {
  // if you want you can determine the position the first element will
  // be put in (useful to track the correct answer)
  const l = choices.length
  if (first) {
    const randomized = math.pickRandom(choices.slice(1), l-1)
    return [...randomized.slice(0,first), choices[0], ...randomized.slice(first)]
  } else {
    return math.pickRandom(choices, l)
  }
}

export {
  choice,
  randint,
  sample,
  shuffle,
  setRandomSeed,
  poprandom,
}