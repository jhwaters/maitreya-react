//import math from 'mathjs'
import { Randomizer } from './random_randomjs'
import { defaultsDeep } from 'lodash'

let randomSeedGenerator = new Randomizer()

class QGen {
  constructor(props={}) {
    this.kwds = props.params || {}
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

  _handleSpecialCases(k, v) {
    if (k === 'choices' && Array.isArray(v)) {
      return {
        type: 'jsonml',
        data: ['ol', {
          type: 'a', 
          children: v.map(c => ['li', {style: {margin: '0.3rem'}}, c])
        }]
      }
    } else {
      return v
    }
  }

  setRandomSeed(seed) {
    this.randomizer.seed(seed)
  }

  _getParams() {
    return defaultsDeep({}, this.params, this.constructor.defaults)
  }

  output() {
    const out = this.generate(this._getParams())
    let generated = {}
    for (const k in out) {
      generated[k] = this._handleSpecialCases(k, out[k])
    }
    return {
      method: '',
      randomSeed: this.randomSeed,
      params: this.params,
      generated: generated,
      options: this.getOptions(),
    }
  }
}

export default QGen