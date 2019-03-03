const Random = require('random-js')

export class Randomizer {
  constructor(seed=null) {
    this.seed = seed
    if (seed !== null) {
      this.engine = Random.MersenneTwister19937.seed(seed)
    } else {
      this.engine = Random.MersenneTwister19937.autoSeed()
    }
  }

  reset() {
    if (this.seed !== null) {
      this.engine.seed(this.seed);
    } else {
      this.engine.autoSeed();
    }
  }

  randint(min, max) {
    return Random.integer(min, max)(this.engine);
  }

  real(min, max, inclusive=false) {
    return Random.real(min, max, inclusive)(this.engine);
  }

  random(max=1.0) {
    return this.real(0, max, false);
  }

  shuffle(array, first) {
    if (first !== undefined) {
      let shuffled = Random.shuffle(this.engine, array.slice(1));
      return [...shuffled.slice(0,first), array[0], ...shuffled.slice(first)];
    } else {
      return Random.shuffle(this.engine, array);
    }
  }

  shuffleRange(start, end) {
    let range = [];
    for (let i = start; i <= end; i++) range.push(i);
    return this.shuffle(range);
  }

  bool() {
    return Random.pick(this.engine, [true, false]);
  }

  choice(array) {
    return Random.pick(this.engine, array);
  }

  sample(pop, size) {
    return Random.sample(this.engine, pop, size);
  }

  sampleRange(start, end, size) {
    let range = [];
    for (let i = start; i <= end; i++) range.push(i);
    return this.sample(range, size);
  }

  poprandom(array) {
    const i = this.randint(0,array.length-1);
    return array.splice(i,1)[0];
  }
}

