import math from 'mathjs'
import Polynomial from 'polynomial'
import * as SVG from './tools/svgplot'
import { range, gcd } from './tools/handystuff'
//import { shuffle, randint, choice, sample } from './random_randomjs'
import QGen from './QGen'
//import _ from 'lodash'

/***** Handy Things *********/

function randomPolynomialCoefficients({degree, maxCoefficient=12, terms='auto'}={}) {
  const rd = this.random
  if (terms === 'auto') {
    terms = degree + 1
  }
  let p = {}
  const whichterms = rd.sample(range(0,degree), terms-1)
  p[degree] = rd.randint(1, maxCoefficient)

  for (const d of whichterms) {
    p[d] = rd.randint(1, maxCoefficient) * rd.choice([-1,1])
  }
  return p
}

function randomPolynomial(props={}) {
  const p = randomPolynomialCoefficients.call(this, props)
  return new Polynomial(p)
}

/*
function divrem(n, p) {
  let r = n
  let d = 0
  while (r % p === 0) {
    r = r / p
    d += 1
  }
  return [d, r]
}

function primeFactorization(n) {
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

function allFactors(n, {include1=false, includeN=false}) {
  let result = []
  const factors = primeFactorization(n)
  for (const p in factors) {
    
  }
  if (include1) {
    result.push(1)
  }
  if (includeN) {
    result.push(n)
  }
}
*/
/****************************/

export class SolveQuadratic extends QGen {
  static info = {
    name: 'Solve Quadratic',
    description: 'Solve a quadratic equation with integer solutions.'
  }


  generate(props) {
    const rd = this.random
    const [r1, r2] = rd.sample(range(-12,13), 2)

    const a = 1
    const b = -(r1 + r2)
    const c = r1 * r2

    const poly = new Polynomial({2: a, 1: b, 0: c})
    const rand = randomPolynomial.call(this, {degree: 2, maxCoefficient: 7, terms: 2})
    
    const [left, right] = rd.random() < 0.5 ? [poly.add(rand), rand] : [rand, poly.add(rand)]

    function fmtAns(ans) {
      return'$$x = ' + ans.sort((a, b) => a > b).join(', ') + '$$'
    }

    return {
      instructions: 'Determine the values of $$x$$ that satisfy the equation:',
      question: '$$' + left.toLatex() + ' = ' + right.toLatex() +'$$',
      answer: fmtAns([r1, r2]),
    }
  }
}

export class FactorQuadraticHard extends QGen {
  static info = {
    name: 'Factor Quadratic (Hard)',
    description: 'Factor a quadratic using AC method.'
  }

  generate(params) {
    let rd = this.random

    const a1 = rd.randint(2,5)
    const a2 = rd.randint(2,8-a1)

    let b1 = rd.randint(1,14-a2)
    while (gcd(a1, b1) !== 1) {
      b1 = rd.randint(1,14-a2)
    }
    b1 *= rd.choice([-1,1])

    
    let b2 = rd.randint(2, 14-a1)
    while (gcd(a2, b2) !== 1) {
      b2 = rd.randint(1,14-a1)
    }
    b2 *= rd.choice([-1,1])

    // prevent difference of squares
    while ((a1 === a2 && b1 === -b2) || (a1 === -a2 && b1 === b2)) {
      b2 = rd.randint(2, 14-a1)
      while (gcd(a2, b2) !== 1) {
        b2 = rd.randint(1,14-a1)
      }
      b2 *= rd.choice([-1,1])
    }

    const p1 = new Polynomial({1: a1, 0: b1})
    const p2 = new Polynomial({1: a2, 0: b2})

    const a = a1 * a2
    const b = a1 * b2 + a2 * b1
    const c = b1 * b2

    const poly = new Polynomial({2: a, 1: b, 0: c})

    const answer = `$$(${p1.toLatex()})(${p2.toLatex()})$$`

    return {
      instructions: 'Rewrite as the product of linear factors:',
      question: `$$${poly.toLatex()}$$`,
      answer: {
        correct: answer,
        prompt: [{width: '2.5in'}],
      }
    }
  }
}


export class RationalGraph extends QGen {
  static info = {
    name: 'Rational Graph',
    description: 'Determine the equation from the graph of a rational function'
  }

  generate(params) {
    const rd = this.random

    const makeFunction = (top, bottom) => {
      let f = function(x) {
        let n = 1
        let d = 1
        for (const r of top) {
          n *= (x - r)
        }
        for (const r of bottom) {
          d *= (x - r)
        }
        return n / d
      }
      return f
    }

    function generateValues() {
      let vals = rd.sample(range(1, 9), 4).map(v => rd.random() < 0.5 ? v : -v)
      let roots = [vals[0]]
      let holes = [vals[1]]
      let asymptotes = [vals[2]]
      if (rd.random() < 0.5) {
        asymptotes.push(vals[3])
      } else if (rd.random() < 0.8) {
        holes.push(vals[3])
      }
      return ({roots, holes, asymptotes})
    }

    function allHolesInRange(holes, f) {
      for (const r of holes) {
        if (f(r) <= -10 || f(r) >= 10) {
          return false
        } 
      }
      return true
    }

    let roots, holes, asymptotes, f
    let isGood = false

    while (!isGood) {
      ({roots, holes, asymptotes} = generateValues())
      f = makeFunction(roots, asymptotes)
      isGood = allHolesInRange(holes, f)
    }
    

    const graph = [
      'CartesianPlane',
      {span: [-10,-10,10,10], autogrid: true, height: '2.2in'},
      [
        'Rational',
        {
          domain: [-12,12],
          range: [-12,12],
          roots, holes, asymptotes,
        }
      ]
    ]


    function fmtAns(ans) {
      let numer = ''
      for (const r of ans.top.sort((a,b) => b-a)) {
        numer += '(' + math.simplify(`x - ${r}`).toString() + ')'
      }
      let denom = ''
      for (const r of ans.bottom.sort((a,b) => b-a)) {
        denom += '(' + math.simplify(`x - ${r}`).toString() + ')'
      }
      return `$$y = \\displaystyle\\frac{ ${numer} }{ ${denom} }$$`
    }

    const answer = {top: [...roots, ...holes], bottom: [...holes, ...asymptotes]}

    const wrongs = [
      {top: [...holes, ...asymptotes], bottom: [...holes, ...roots]},
      {top: [...roots], bottom: [...holes, ...asymptotes]},
      {top: [...roots, ...holes].map(r => -r), bottom: [...holes, ...asymptotes].map(r => -r)},
      {top: [...holes, ...asymptotes].map(r => -r), bottom: [...holes, ...roots].map(r => -r)},
    ]

    const i = rd.randint(0,wrongs.length)
    const choices = rd.shuffle([answer, ...wrongs].map(fmtAns), i)

    return {
      instructions: 'Choose the equation that best describes the graph shown.',
      freeResponse: {
        instructions: 'Write the equation that best describes the graph shown.'
      },
      diagram: {
        type: 'vectorgraphic',
        data: graph,
      },
      answer: {
        correct: fmtAns(answer),
        choices: choices,
        correctIndex: i,
        prompt: [{label: '$$y = $$', height: '8em', width: '20em'}],
      }
    }
  }
}



export class FindIntervals extends QGen {
  static info = {
    name: 'Intervals - Either',
    description: 'Identify intervals over which a graph is increasing or decreasing'
  }

  static params = {
    toFind: {
      name: 'Type of interval to find',
      choices: ['increasing', 'decreasing', 'random'],
    },
    style: {
      name: 'Graph style',
      choices: ['jagged'],
    }
  }

  static defaults = {
    toFind: 'random',
    style: 'jagged'
  }

  generate(params) {
    const rd = this.random

    const toFind = {
      increasing: 'inc', 
      decreasing: 'dec', 
      random: rd.choice(['inc', 'dec']),
    }[params.toFind]

    const xs = [-10]
    let prev = -10
    while (prev < 7) {
      const next = rd.randint(prev+3, prev+5)
      if (next > 7) {
        xs.push(8)
      } else {
        xs.push(next)
      }
      prev = xs[xs.length-1]
    }
    xs.push(10)

    
    
    const yRange = [-5,5]
    const ys = [rd.randint(...yRange)]

    let maxConstantIntervals = 2
    let which
    while (ys.length < xs.length) {
      let possible = []
      const prev = ys[ys.length-1]
      if (which !== 'dec' & prev >= yRange[0]+2) {
        possible.push('dec')
      }
      if (which !== 'inc' & prev <= yRange[1]-2) {
        possible.push('inc')
      }
      if (which !== 'const' & maxConstantIntervals > 0) {
        possible.push('const')
        maxConstantIntervals -= 1
      }
      which = rd.choice(possible)
      if (which === 'dec') {
        ys.push(rd.randint(Math.max(yRange[0], prev-7), prev-1))
      } else if (which === 'inc') {
        ys.push(rd.randint(prev+1, Math.min(yRange[1], prev+7)))
      } else {
        ys.push(prev)
      }
    }

    if (rd.random() < 0.5) {
      ys.reverse()
    }

    const intervals = []
    for (let i = 1; i < ys.length; i++) {
      if (ys[i-1] < ys[i]) {
        intervals.push('inc')
      } else if (ys[i-1] === ys[i]) {
        intervals.push('const')
      } else {
        intervals.push('dec')
      }
    }

    let answer = []
    let wrongAnswer1 = []  // ys insteas of xs
    let wrongAnswer2 = []  // points instead of xs
    let wrongAnswer3 = []  // switch dec/inc
    let wrongAnswer4 = []  // switch dec/inc, ys instead of xs

    let points = [
      {x: xs[0], y: ys[0]},
    ]
    for (let i=0; i < intervals.length; i++) {
      points.push({x: xs[i+1], y: ys[i+1]})
      if (intervals[i] === toFind) {
        answer.push({start: xs[i], stop: xs[i+1]})
        wrongAnswer1.push({start: ys[i], stop: ys[i+1]})
        wrongAnswer2.push({start: xs[i], stop: ys[i]})
        wrongAnswer2.push({start: xs[i+1], stop: ys[i+1]})
      } else if (intervals[i] === {'inc': 'dec', 'dec': 'inc'}[toFind]) {
        wrongAnswer3.push({start: xs[i], stop: xs[i+1]})
        wrongAnswer4.push({start: ys[i], stop: ys[i+1]})
      }
    }

    const diagram = [
      "CartesianPlane",
      {
        span: [-10,yRange[0]-1,10,yRange[1]+1], 
        autogrid: true,
        height: '1.5in', 
      },
      ["Path", {points: points}]
    ]
    
    const fullName = {inc: 'increasing', dec: 'decreasing'}[toFind]

    function fmtAns(ans) {
      if (ans.length === 0) {
        return 'None'
      }
      return '$$' + ans.map((int) => `(${int.start}, ${int.stop})`).join(', ') + '$$'
    }

    const wrongs = [wrongAnswer1, wrongAnswer2, wrongAnswer3, wrongAnswer4]
    const answerIndex = rd.randint(0, wrongs.length)
    const choices = rd.shuffle([answer, ...wrongs], answerIndex).map(fmtAns)

    return ({
      question: `Determine the intervals over which the function is ***${fullName}***.`,
      diagram: {
        type: 'vectorgraphic',
        data: diagram,
      },
      answer: {
        correct: fmtAns(answer),
        choices: choices,
        correctIndex: answerIndex,
        prompt: [{width: '2in'}]
      }
    })
  }
}

export class IncreasingIntervals extends FindIntervals {
  static info = {
    name: 'Intervals - Increasing',
    description: 'Identify intervals over which a graph is increasing',
  }

  static defaults = {
    toFind: 'increasing',
    style: 'jagged',
  }
}

export class DecreasingIntervals extends FindIntervals {
  static info = {
    name: 'Intervals - Decreasing',
    description: 'Identify intervals over which a graph is decreasing',
  }

  static defaults = {
    toFind: 'decreasing',
    style: 'jagged',
  }
}


class AngleMeasure extends QGen {
  static info = {
    name: 'Angle Measure',
    description: '',
  }

  generate(params) {

    const translate = (a, b) => [a[0] + b[0], a[1]+ b[1]]
    const difference = (a, b) => [a[0] - b[0], a[1] - b[1]]
    //const complexMult = (a, b) => [a[0] * b[0] - a[1] * b[1], a[1] * b[0] + a[0] * b[1]]
    /*
    const rotate = (pt, angle, center=[0,0]) => {
      const radians = angle * Math.PI / 180
      const rotator = [Math.cos(radians), Math.sin(radians)]
      const recenter = difference(pt, center)
      return translate(complexMult(recenter, rotator), center)
    }
    */

    const rd = this.random

    const angle1 = rd.randint(35, 145)

    const rotateBy = rd.randint(0, 359)
    //let diagram = new Canvas(-20, -20, 20, 20, {height: '1.5in'})
    //let graph = new PlotElement('g', {transform: `rotate(${rotateBy})`})

    const intersect1 = [-5,0]
    const r = 10
    const pp = [r * Math.cos(angle1 * Math.PI / 180), r * Math.sin(angle1 * Math.PI / 180)]
    const top1 = translate(intersect1, pp)
    const bottom1 = difference(intersect1, pp)

    const intersect2 = [intersect1[0] + r, intersect1[1]]
    const top2 = [top1[0] + r, top1[1]]
    const bottom2 = [bottom1[0] + r, bottom1[1]]

    const left = [intersect1[0] - r, intersect1[1]]
    const right = [intersect2[0] + r, intersect2[1]]

    
    const plotPoint = (pt) => {
      return ['Point', {x: pt[0], y: pt[1]}]
    }

    const plotSegment = (a, b) => {
     return ['Segment', {points: [a, b]}]
    }
    
    const diagram = [
      'CartesianPlane',
      {span: [-20,-20,20,20], height: '3in', autogrid: false, style: 'geom'},
      [
        'Rotate', 
        {degrees: rotateBy},
        ['Line', {endpoints: [left, right]}],
        ['Line', {endpoints: [top1, bottom1]}],
        ['Line', {endpoints: [top2, bottom2]}],
        ['Point', {coords: intersect1}],
        ['Point', {coords: intersect2}]
      ]
    ]


    return {
      instructions: 'Work in progress',
      diagram: {
        'type': 'vectorgraphic',
        'data': diagram,
      }
    }

  }
}

class RationalRootTheorem extends QGen {
  static info = {
    name: 'Rational Root Theorem',
    description: 'State possible rational roots for a given function.'
  }

  generate(params) {
    const rd = this.random
    let primes = rd.sample([1, 2, 3, 5, 7, 11], 4)
    for (const i in primes) {
      if (primes[i] === 1) {
        if (i === 0 | i === 2) {
          primes[i+1] = Math.pow(primes[i+1], rd.randint(1,2))
        } else {
          primes[i-1] = Math.pow(primes[i-1], rd.randint(1,2))
        }
      }
    }
    for (const i in primes) {
      if (primes[i] === 2 | primes[i] === 3) {
        primes[i] = Math.pow(primes[i], rd.randint(1,2))
      }
    }
    const leading_coeff = primes[0] * primes[1]
    const trailing_coeff = primes[2] * primes[3]
    const degree = rd.randint(3,6)
    const num_coeffs = rd.randint(3,degree)
    let poly = randomPolynomialCoefficients.call(this, {degree: degree, terms: num_coeffs})
    poly[0] = trailing_coeff
    poly[degree] = leading_coeff
    const f = new Polynomial(poly)

    const question = '$$y = ' + f.toLatex() + '$$'
    
    return {
      instructions: "Work in progress",
      question: question,
    }
  }
}
