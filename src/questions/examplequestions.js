import math from 'mathjs'
import Polynomial from 'polynomial'
import { CartesianPlane, Rational, SvgElement, Canvas, Path } from './plot'
import { range, gcd } from './handystuff'
//import { shuffle, randint, choice, sample } from './random_randomjs'
import QGen from './QGen'
import _ from 'lodash'


export class SolveQuadratic extends QGen {
  static info = {
    name: 'Solve Quadratic',
    description: 'Solve a quadratic equation with integer solutions.'
  }


  generate(props) {
    const randomPolynomial = ({degree, maxCoefficient, terms='auto'}={}) => {
      if (terms === 'auto') {
        terms = degree + 1
      }
      let p = {}
      const whichterms = rd.sample(range(0,degree), terms-1)
      p[degree] = rd.randint(1, maxCoefficient)

      for (const d of whichterms) {
        p[d] = rd.randint(1, maxCoefficient) * rd.choice([-1,1])
      }
      return new Polynomial(p)
    }

    const rd = this.random
    const [r1, r2] = rd.sample(range(-12,13), 2)

    const a = 1
    const b = -(r1 + r2)
    const c = r1 * r2

    const poly = new Polynomial({2: a, 1: b, 0: c})
    const rand = randomPolynomial({degree: 2, maxCoefficient: 7, terms: 2})
    
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

  static options = {
    math: {
      delimiters: {
        inline: {left: '&', right: '&'},
        display: {left: '&&', right: '&&'},
      }
    }
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

    const answer = `&(${p1.toLatex()})(${p2.toLatex()})&`

    return {
      instructions: 'Rewrite as the product of linear factors:',
      question: `&${poly.toLatex()}&`,
      answer: answer,
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
    let vals = rd.sample(range(1, 9), 4).map(v => rd.random() < 0.5 ? v : -v)
    let roots = [vals[0]]
    let holes = [vals[1]]
    let vas = [vals[2]]
    if (rd.random() < 0.5) {
      holes.push(vals[3])
    } else {
      vas.push(vals[3])
    }


    let graph = new CartesianPlane(-10, -10, 10, 10, {height: '2in'})
    graph.addGrid()
    const rat = new Rational({roots: roots, holes: holes, vas: vas})
    graph.add(rat)


    function fmtAns(ans) {
      let numer = ''
      for (const r of ans.top.sort((a,b) => a-b)) {
        numer += '(' + math.simplify(`x - ${r}`).toString() + ')'
      }
      let denom = ''
      for (const r of ans.bottom.sort((a,b) => a-b)) {
        denom += '(' + math.simplify(`x - ${r}`).toString() + ')'
      }
      return `$$y = \\displaystyle\\frac{ ${numer} }{ ${denom} }$$`
    }

    const answer = {top: [...roots, ...holes], bottom: [...holes, ...vas]}

    const wrongs = [
      {top: [...holes, ...vas], bottom: [...holes, ...roots]},
      {top: [...roots], bottom: [...holes, ...vas]},
      {top: [...roots, ...holes].map(r => -r), bottom: [...holes, ...vas].map(r => -r)},
      {top: [...holes, ...vas].map(r => -r), bottom: [...holes, ...roots].map(r => -r)},
    ]

    const i = rd.randint(0,wrongs.length)
    const choices = rd.shuffle([answer, ...wrongs].map(fmtAns), i)

    return {
      instructions: 'Choose the equation that best describes the graph shown.',
      diagram: {
        type: 'jsonml',
        data: graph.jsonml(),
      },
      choices: {
        type: 'answerchoices',
        data: choices,
      },
      answer: fmtAns(answer),
      answerIndex: i,
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
    }
  }

  static defaults = {
    toFind: 'random'
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

    const intervals = []
    
    const yRange = [-5,5]
    const ys = [rd.randint(...yRange)]

    let maxConstantIntervals = 2
    while (ys.length < xs.length) {
      let possible = []
      const prev = ys[ys.length-1]
      if (intervals[intervals.length-1] !== 'dec' & prev >= yRange[0]+1) {
        possible.push('dec')
      }
      if (intervals[intervals.length-1] !== 'inc' & prev <= yRange[1]-1) {
        possible.push('inc')
      }
      if (intervals[intervals.length-1] !== 'const' & maxConstantIntervals > 0) {
        possible.push('const')
        maxConstantIntervals -= 1
      }
      const which = rd.choice(possible)
      intervals.push(which)
      if (which === 'dec') {
        ys.push(rd.randint(Math.max(yRange[0], prev-7), prev-1))
      } else if (which === 'inc') {
        ys.push(rd.randint(prev+1, Math.min(yRange[1], prev+7)))
      } else {
        ys.push(prev)
      }
    }

    let answer = []
    let wrongAnswer1 = []  // ys insteas of xs
    let wrongAnswer2 = []  // points instead of xs
    let wrongAnswer3 = []  // switch dec/inc
    let wrongAnswer4 = []  // switch dec/inc, ys instead of xs

    let diagram = new CartesianPlane(-10, yRange[0], 10, yRange[1], {height: '1.2in'})
    diagram.addGrid()


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

    diagram.add(new Path(points.map(p => [p.x, p.y]), {'style': {
			stroke: 'rgb(200,0,100)',
			strokeOpacity: '0.8',
			strokeWidth: '0.2',
			fill: 'none',
    }}))
    
    const fullName = {inc: 'increasing', dec: 'decreasing'}[toFind]

    function fmtAns(ans) {
      if (ans.length === 0) {
        return 'None'
      }
      return '$$' + ans.map((int) => `(${int.start}, ${int.stop})`).join(', ') + '$$'
    }

    const wrongs = [wrongAnswer1, wrongAnswer2, wrongAnswer3, wrongAnswer4]
    const answerIndex = rd.randint(0, wrongs.length)
    const choices = rd.shuffle([answer, ...wrongs], answerIndex)

    return ({
      question: `Determine the intervals over which the function is ***${fullName}***.`,
      diagram: {
        type: 'jsonml',
        data: diagram.toJsonML(),
      },
      answer: fmtAns(answer),
      answerIndex: answerIndex,
      choices: {
        type: 'answerchoices', 
        data: choices.map(fmtAns),
      },
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
  }
}

export class DecreasingIntervals extends FindIntervals {
  static info = {
    name: 'Intervals - Decreasing',
    description: 'Identify intervals over which a graph is decreasing',
  }

  static defaults = {
    toFind: 'decreasing',
  }
}


export class AngleMeasure extends QGen {
  static info = {
    name: 'Angle Measure',
    description: '',
  }

  generate(params) {

    const translate = (a, b) => [a[0] + b[0], a[1]+ b[1]]
    const difference = (a, b) => [a[0] - b[0], a[1] - b[1]]
    const complexMult = (a, b) => [a[0] * b[0] - a[1] * b[1], a[1] * b[0] + a[0] * b[1]]
    const rotate = (pt, angle, center=[0,0]) => {
      const radians = angle * Math.PI / 180
      const rotator = [Math.cos(radians), Math.sin(radians)]
      const recenter = difference(pt, center)
      return translate(complexMult(recenter, rotator), center)
    }

    const rd = this.random

    const angle1 = rd.randint(35, 145)
    const angle2 = 180 - angle1

    const rotateBy = rd.randint(0, 359)
    let diagram = new Canvas(-20, -20, 20, 20, {height: '1.5in'})
    let graph = new SvgElement('g', {transform: `rotate(${rotateBy})`})

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
      return new SvgElement('circle', {cx: pt[0], cy: pt[1], r: '0.4', style: {
        'fill': 'black'
      }})
    }

    const plotSegment = (a, b) => {
      return new SvgElement('path', {
        d: `M${a[0]},${a[1]}L${b[0]},${b[1]}`, 
        style: {
          fill: 'none', 
          stroke: 'black',
          strokeWidth: '0.2',
        },
      })
    }
    
    graph.add(plotSegment(left, right))
    graph.add(plotSegment(top1, bottom1))
    graph.add(plotSegment(top2, bottom2))
    graph.add(plotPoint(intersect1))
    graph.add(plotPoint(intersect2))

    diagram.add(graph)

    return {
      instructions: 'Work in progress',
      diagram: {
        'type': 'jsonml',
        'data': diagram.jsonml(),
      }
    }

  }
}