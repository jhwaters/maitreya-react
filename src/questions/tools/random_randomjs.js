import Random from 'random-js'

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
