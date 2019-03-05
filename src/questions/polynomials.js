import Polynomial from 'polynomial'
import fraction from 'fraction.js'
import { range, gcd, listFactors } from './tools/handystuff'
import QGen from './QGen'
import _ from 'lodash'


// HANDY THINGS

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

class Quadratic {
  /*
  quadratic with integer coefficients and roots at
  x = (a +- b*sqrt(rt))/d (if im = false)
  or
  x = (a +- b*sqrt(rt)*i)/d (if im = true)
  */

  constructor(a, b, d=1, rt=1, im=false) {
    this.params = {
      a: a, 
      b: Math.abs(b), 
      d: Math.abs(d),
      rt: Math.abs(rt),
      im: im || rt < 0
    }
    const poly = new Polynomial()
  }

  polynomial() {
    const {a, b, d, rt, im} = this.params
    return new Polynomial([
      a*a + (im ?  b*b*rt : -b*b*rt),
      -2*a*d,
      d*d
    ])
  }

  rootsToLatex() {
    const {a, b, d, rt, im} = this.params
    if (b === 0) {
      return fraction(a,d).toLatex()
    }
    if (rt === 1) {
      // rational
      if (d === 1) {
        if (!im) {
          return [a + b, a - b].sort((x,y) => x-y).map(r => r.toString()).join(', ')
        } else {
          return `${a === 0 ? '' : fraction(a,d).toLatex()} \\pm ${b === d ? '' : fraction(b,d).toLatex()}i`
        }
      } else {
        if (!im) {
          return [fraction(a-b,d), fraction(a+b,d)].map(r => r.toLatex()).join(', ')
        } else {
          return `${a === 0 ? '' : a} \\pm ${b === 1 ? '' : b}i`
        }
      }
    }
    else {
      // irrational
      if (d === 1) {
        return `${a === 0 ? '' : a} \\pm ${b === 1 ? '' : b} \\sqrt{${rt}}${im ? 'i' : ''}`
      } else {
        return `${a === 0 ? '' : fraction(a,d).toLatex()} \\pm ${b === d ? '' : fraction(b,d).toLatex()} \\sqrt{${rt}} ${im ? 'i' : ''}`
      }
    }
  }
}


// GENERATORS

export class SolveQuadratic extends QGen {
	static info = {
		name: 'Solve Quadratic',
		description: 'Solve a quadratic equation'
  }
  
  static params = {
    solutionTypes: {
      label: 'solution types',
      type: 'multiple-select',
      minSelections: 1,
      options: [
        'integer', 
        {value: 'rational', label: 'fraction'}, 
        'irrational',
      ]
    },
    complexSolutions: {
      label: 'allowed solutions',
      type: 'multiple-select',
      minSelections: 1,
      options: ['real', 'imaginary']
    },
    givenForm: {
      label: 'question given as',
      type: 'multiple-select',
      minSelections: 1,
      options: [
        {value: 'standard', label: 'standard form'}, 
        {value: 'oneside', label: '... = 0, not standard form'},
        {value: 'bothsides', label: 'terms on both sides of equation'}
      ]
    },
    simplifySquareRoot: {
      label: 'square root needs to be simplified',
      type: 'select',
      options: ['yes', 'no', 'sometimes']
    },
    simplifyFraction: {
      label: 'fraction needs to be simplified',
      type: 'select',
      options: ['yes', 'no', 'sometimes']
    },
    allowDifferenceOfSquares: {
      label: 'allow difference of squares',
      type: 'boolean',
    },
    allowDoubleRoot: {
      label: 'allow double root',
      type: 'boolean',
    },
    allowZeroRoot: {
      label: 'allow solution of x = 0',
      type: 'boolean',
    }
  }

  static defaultParams = {
    solutionTypes: {
      integer: true, 
      rational: true, 
      irrational: true,
    },
    complexSolutions: {
      real: true, 
      imaginary: true,
    },
    givenForm: {
      standard: true,
      oneside: true,
      bothsides: true,
    },
    simplifySquareRoot: 'sometimes',
    simplifyFraction: 'sometimes',
    allowDifferenceOfSquares: true,
    allowDoubleRoot: true,
    allowZeroRoot: true,
  }

	static options = {
		singleColumn: true,
	}

	generate(params) {
    const rd = this.random
    
    const solutionType = rd.choice(Object.keys(params.solutionTypes).filter(k => params.solutionTypes[k]))
    const complexSolution = rd.choice(Object.keys(params.complexSolutions).filter(k => params.complexSolutions[k]))
    const givenForm = rd.choice(Object.keys(params.givenForm).filter(k => params.givenForm[k]))
    const simplifySquareRoot = params.simplifySquareRoot === 'sometimes'
      ? rd.bool()
      : {'yes': true, 'no': false}[params.simplifySquareRoot]
    const {simplifyFraction, allowDifferenceOfSquares} = params
    const allowDoubleRoot = solutionType === 'irrational' || complexSolution === 'imaginary' ? false : params.allowDoubleRoot
    const allowZeroRoot = solutionType === 'irrational' || complexSolution === 'imaginary' ? false : params.allowZeroRoot

    let poly, answer

    if (solutionType === 'integer') {
      let a = allowDifferenceOfSquares ? rd.randint(0,11) : rd.randint(1,11)
      let b = allowDoubleRoot ? rd.randint(0,12-a) : rd.randint(1,12-a)
      if (allowZeroRoot) {
        while (a === b) {
          a = allowDifferenceOfSquares ? rd.randint(0,11) : rd.randint(1,11)
          b = allowDoubleRoot ? rd.randint(0,12-a) : rd.randint(1,12-a)
        }
      }
      if (rd.bool()) {
        a = -a
      }
      const quad = new Quadratic(a, b, 1, 1, complexSolution === 'imaginary')
      poly = quad.polynomial()
      answer = 'x = ' + quad.rootsToLatex()
    }
    else if (solutionType === 'rational') {
      let a, b, d
      let isValid = false
      while (!isValid) {
        isValid = true

        d = rd.choice([2,3,4])
        a = allowDifferenceOfSquares ? rd.randint(0,11) : rd.randint(1,11)
        b = allowDoubleRoot ? rd.randint(0,12-a) : rd.randint(1,12-a)

        if (!allowZeroRoot && a === b) {
          isValid = false; continue;
        }
        if (simplifyFraction === 'yes') {
          // ensure both fractions can't be simplified just by dividing
          // out the GCF at the beginning
          if (gcd(a+b, d) === gcd(a-b, d)) {
            isValid = false; continue;
          }
        } else if (simplifyFraction === 'no') {
          // ensure that neither fraction can simplify
          if (gcd(a+b, d) !== 1 || gcd(a-b, d) !== 1) {
            isValid = false; continue;
          }
        }
      }

      if (rd.bool()) {
        a = -a
      }
      const quad = new Quadratic(a, b, d, 1, complexSolution === 'imaginary')
      poly = quad.polynomial()
      answer = 'x = ' + quad.rootsToLatex()
    }
    else if (solutionType === 'irrational') {
      let a, b, d, rt
      let isValid = false
      while (!isValid) {
        isValid = true

        d = rd.choice([2,3,4])
        rt = rd.choice([2,3,5,6,7,10,11])
        b = simplifySquareRoot ? rd.randint(2,11) : 1
        a = allowDifferenceOfSquares ? rd.randint(0,12-b) : rd.randint(1,12-b)

        if (simplifyFraction === 'yes') {
          // ensure both fractions can't be simplified just by dividing
          // out the GCF at the beginning
          if (gcd(a+b, d) === gcd(a-b, d)) {
            isValid = false; continue;
          }
        } else if (simplifyFraction === 'no') {
          // ensure that neither fraction can simplify
          if (gcd(a+b, d) !== 1 || gcd(a-b, d) !== 1) {
            isValid = false; continue;
          }
        }
      }
      const quad = new Quadratic(a, b, d, rt, complexSolution === 'imaginary')
      poly = quad.polynomial()
      answer = 'x = ' + quad.rootsToLatex()
    }

    let question

    if (givenForm === 'standard') {
      question = rd.bool() ? poly.toLatex() + '= 0' : '0 =' + poly.toLatex()
    }
    else if (givenForm === 'oneside') {
      const deg = rd.choice([1,2])
      const rand = randomPolynomial.call(this, {degree: deg, maxCoefficient: 7, terms: rd.choice([2, deg+1])})
      const expr = rd.bool() 
        ? `${poly.sub(rand).toLatex()} + ${rand.toLatex()}`
        : `${rand.mul(-1).toLatex()} + ${poly.add(rand).toLatex()}`
      if (rd.bool()) {
        question = expr + '= 0'
      } else {
        question = '0 =' + expr
      }
    }
    else if (givenForm === 'bothsides') {
      const deg = rd.choice([1,2])
      const rand = randomPolynomial.call(this, {degree: deg, maxCoefficient: 11, terms: rd.choice([2,deg+1])})
      let [left, right] = rd.random() < 0.5 ? [poly.add(rand), rand] : [rand, poly.add(rand)]
      if (rd.bool()) {
        [left, right] = [right, left]
      }
      question = `${left.toLatex()} = ${right.toLatex()}`
    }

		return {
			instructions: 'Determine the values of $$x$$ that satisfy the equation:',
			question: '$$' + question + '$$',
			answer: '$$' + answer + '$$'
		}
	}
}

export class FactorQuadraticHard extends QGen {
	static info = {
		name: 'Factor Quadratic (Hard)',
		description: 'Factor a quadratic using AC method.'
	}

	static options = {
		singleColumn: true,
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

		// prevent difference of squares and perfect square
		while (Math.abs(a1) === Math.abs(a2) && Math.abs(b1) === Math.abs(b2)) {
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
			answer: answer,
		}
	}
}



export class RationalZeroTheorem extends QGen {
	static info = {
		name: 'Rational Zero Theorem',
		description: 'State possible rational zeros for a polynomial function.'
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

		const question = '$$f(x) = ' + f.toLatex() + '$$'
		
		const correctNumerators = listFactors(trailing_coeff, {include1: true, includeN: true})
		const correctDenominators = listFactors(leading_coeff, {include1: true, includeN: true})
		
		const allPossibleZeros = []
		for (const a of correctNumerators) {
			for (const b of correctDenominators) {
				allPossibleZeros.push(`${a}/${b}`)
			}
		}

		const numCorrect = rd.choice([0,1,1,2,2,2,2,2,2,3,3,4])
		const correctAnswers = []
		while (correctAnswers.length < numCorrect) {
			const [a, b] = [rd.choice(correctNumerators), rd.choice(correctDenominators)]
			const s = `${a}/${b}`
			if (!_.includes(correctAnswers, s)) {
				correctAnswers.push(s)
			}
		}

		const wrongAnswers = []
		while (wrongAnswers.length < 4-numCorrect) {
			const [a,b] = [rd.choice(correctDenominators), rd.choice(correctNumerators)]
			const s = `${a}/${b}`
			if (!(s == '1/1') && !_.includes(wrongAnswers, s)) {
				wrongAnswers.push(s)
			}
		}

		const allChoices = [...correctAnswers, ...wrongAnswers]
		const shuffled = []
		const correctIndex = numCorrect ? [] : 4
		for (let i = 0; i < 4; i++) {
			const a = rd.poprandom(allChoices)
			if (_.includes(correctAnswers, a)) {
				correctIndex.push(i)
			}
			shuffled.push(a)
		}

		return {
			instructions: "Which of the following are _possible_ zeros of the function according to the _Rational Zero Theorem_? Choose ***all*** that apply.",
			question: question,
			answer: {
				correct: allPossibleZeros.map(s => `$$${fraction(s).toLatex()}$$`).join(', '),
				choices: [...shuffled.map(s => `$$\\displaystyle ${fraction(s).toLatex()}$$`), 'None of these'],
				correctIndex: correctIndex,
				listDirection: 'horizontal',
			},
      variants: {
        freeResponse: {
          instructions: "List all possible rational zeros of the function (according to the _Rational Zero Theorem_)."
        }
      }
		}
	}
}

