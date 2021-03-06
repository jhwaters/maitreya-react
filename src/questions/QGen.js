//import math from 'mathjs'
import { Randomizer } from './tools/random_randomjs'
import { defaultsDeep } from 'lodash'

let randomSeedGenerator = new Randomizer()

class QGen {
  constructor(props={}) {
    this.params = props.params || {}
    //this.randomSeed = props.randomSeed || math.randomInt(0, math.pow(2,32))
    this.randomSeed = props.randomSeed || randomSeedGenerator.randint(0, Math.pow(2, 32)-1)
    this.random = new Randomizer(this.randomSeed)
  }

  static register() {
    let result = {name: this.name}
    return {...result, ...this.info}
  }

  getOptions() {
    return this.constructor.options
  }

  _specialCaseValues(k, v) {
    return v
  }

  _specialCaseKeys(k, v) {
    //if (k === 'answer') return '_answer'
    return k
  }

  setRandomSeed(seed) {
    this.randomizer.seed(seed)
  }

  _getParams() {
    let result = ({})
    const defaults = this.constructor.defaultParams || {}
    for (const k in this.constructor.params) {
      if (this.params[k] !== undefined) {
        result[k] = this.params[k]
      } else if (defaults[k] !== undefined) {
        result[k] = defaults[k]
      }
    }
    return result
  }

  output() {
    const out = this.generate(this._getParams())
    let content = {}
    for (const k in out) {
      content[this._specialCaseKeys(k)] = this._specialCaseValues(k, out[k])
    }
    return [
      'NumberedQuestion',
      { content, options: this.getOptions() },
    ]
  }
}

export default QGen