import math from 'mathjs'
import Polynomial from 'polynomial'
import { CartesianPlane, Rational, SvgElement, Canvas } from './plot'
import { range, gcd } from './handystuff'
//import { shuffle, randint, choice, sample } from './random_randomjs'
import QGen from './QGen'


export class SolveQuadratic extends QGen {
  static info = {
    name: 'Solve Quadratic',
    description: 'Solve a quadratic equation with integer solutions.'
  }

  static options = {
    wrapper: {
      gridTemplateAreas: [
        'instructions question extra',
        'empty empty empty'
      ],
      gridTemplateColumns: 'auto auto 1fr',
      gridTemplateRows: 'auto 0.5in',
    }
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
    wrapper: {
      gridTemplateRows: 'auto 0.5in',
    },
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
    while (gcd(a1, b1) != 1) {
      b1 = rd.randint(1,14-a2)
    }
    b1 *= rd.choice([-1,1])

    
    let b2 = rd.randint(2, 14-a1)
    while (gcd(a2, b2) != 1) {
      b2 = rd.randint(1,14-a1)
    }
    b2 *= rd.choice([-1,1])

    // prevent difference of squares
    while ((a1 === a2 && b1 === -b2) || (a1 === -a2 && b1 === b2)) {
      b2 = rd.randint(2, 14-a1)
      while (gcd(a2, b2) != 1) {
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


    let graph = new CartesianPlane(-10, -10, 10, 10, {height: '1.7in'})
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
      return `$$y = \\frac{ ${numer} }{ ${denom} }$$`
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
      choices: choices,
      answer: fmtAns(answer),
      answerIndex: i,
    }
  }
}