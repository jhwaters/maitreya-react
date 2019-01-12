import Random from 'random-js'

/*
let _RANDOM_ENGINE = new Random(Random.engines.mt19937().autoSeed())

function setRandomSeed(seed) {
  _RANDOM_ENGINE.seed(seed)
}

function choice(arr) {
  return Random.pick(_RANDOM_ENGINE, arr)
}

function randint(min, max) {
  return Random.integer(min, max)(_RANDOM_ENGINE)
}

function sample(pop, size) {
  return Random.sample(_RANDOM_ENGINE, pop, size)
}

function shuffle(arr, first) {
  if (first) {
    let shuffled = Random.shuffle(_RANDOM_ENGINE, arr.slice(1))
    return [...shuffled.slice(0,first), arr[0], ...shuffled.slice(first)]
  } else {
    return Random.shuffle(_RANDOM_ENGINE, arr)
  }
}

function poprandom(arr) {
  const i = randint(0, arr.length-1)
  const v = arr[i]
  const remaining = [...arr.slice(0,i), ...arr.slice(i+1)]
  return {
    popped: v,
    remaining: remaining
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
*/


export class Randomizer {
  constructor(seed=null) {
    this.seed = seed
    this.engine = Random.engines.mt19937()
    this.reset()
  }

  reset() {
    if (this.seed !== null) {
      this.engine.seed(this.seed)
    } else {
      this.engine.autoSeed()
    }
  }

  randint(min, max) {
    return Random.integer(min, max)(this.engine)
  }

  real(min, max, inclusive=false) {
    return Random.real(min, max, inclusive)(this.engine)
  }

  random(max=1.0) {
    return this.real(0, max, false)
  }

  shuffle(array, first) {
    if (first) {
      let shuffled = Random.shuffle(this.engine, array.slice(1))
      return [...shuffled.slice(0,first), array[0], ...shuffled.slice(first)]
    } else {
      return Random.shuffle(this.engine, array)
    }
  }

  choice(array) {
    return Random.pick(this.engine, array)
  }

  sample(pop, size) {
    return Random.sample(this.engine, pop, size)
  }

  poprandom(array) {
    const i = this.randint(0,array.length-1)
    const v = array[i]
    const remaining = [...array.slice(0,i), ...array.slice(i+1)]
    return {
      popped: v,
      remaining: remaining
    }
  }
}

