import math from 'mathjs'
import Polynomial from 'polynomial'
import fraction from 'fraction.js'
import { range, gcd, listFactors } from './tools/handystuff'
import QGen from './QGen'
import _ from 'lodash'


////// Handy Things ///////

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



/***********************


Question Generators 


************************/


export class SolveQuadratic extends QGen {
	static info = {
		name: 'Solve Quadratic',
		description: 'Solve a quadratic equation with integer solutions.'
	}

	static options = {
		singleColumn: true,
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
				if (f(r) <= -8 || f(r) >= 8) {
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
			'CoordinatePlane',
			{span: [-10,-8,10,8], height: '1.8in'},
			[
				'RationalFunction',
				{
					domain: [-12,12],
					range: [-10,10],
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
			return `$$\\displaystyle y = \\frac{ ${numer} }{ ${denom} }$$`
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
			diagram: graph,
			answer: {
				correct: fmtAns(answer),
				choices: choices,
				correctIndex: i,
				prompt: [
					'AnswerBlanks',
					{height: '8em', width: '20em'},
					'$$y = $$', 
				],
			}
		}
	}
}



export class IncreasingIntervals extends QGen {
	static info = {
		name: 'Increasing Intervals',
		description: 'Identify intervals over which a graph is increasing'
	}

	static params = {
		toFind: {
			label: 'Type of interval to find',
			type: 'select',
			options: ['increasing', 'decreasing', 'either'],
		},
		style: {
			label: 'Graph style',
			type: 'select',
			options: ['jagged', 'smooth'],
		},
		points: {
			label: 'Mark points',
			type: 'bool',
		}
	}

	static defaultParams = {
		toFind: 'increasing',
		style: 'smooth',
		points: true,
	}

	interpolatePath(points) {
		// smooths path so that 1st deriv = 0 at each point
		const pts = Array.isArray(points[0]) ? points.map(p => ({x: p[0], y: p[1]})) : points
		let d = `M${pts[0].x},${pts[0].y}`
		let prev = pts[0]
		for (let i = 1; i < pts.length; i++) {
			const p = pts[i]
			const x1 = (2*prev.x + p.x) / 3
			const x2 = (prev.x + 2*p.x) / 3
			d += ` C ${x1},${prev.y} ${x2},${p.y} ${p.x},${p.y}`
			prev = p
		}
		return d
	}

	generate(params) {
		const rd = this.random

		const toFind = rd.choice({
			increasing: ['inc'],
			decreasing: ['dec'],
			either: ['inc', 'dec']
		}[params.toFind])

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

		const yRange = [-4,4]
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
				ys.push(rd.randint(Math.max(yRange[0], prev-7), prev-2))
			} else if (which === 'inc') {
				ys.push(rd.randint(prev+2, Math.min(yRange[1], prev+7)))
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

		const path = params.style === 'smooth' ? {d: this.interpolatePath(points)} : {points}
		if (params.points) {
			path.markers = '...'
		}
		
		const diagram = [
			'CoordinatePlane', {span: [-10,yRange[0]-1,10,yRange[1]+1], height: '1.4in', clip: false},
			['Path', path]
		]
		
		const fullName = {inc: 'increasing', dec: 'decreasing'}[toFind]

		function fmtAns(ans) {
			if (ans.length === 0) {
				return 'None'
			}
			return ans.map((int) => `$$(${int.start}, ${int.stop})$$`).join(', ')
		}

		const wrongs = [wrongAnswer1, wrongAnswer2, wrongAnswer3, wrongAnswer4]
		const answerIndex = rd.randint(0, wrongs.length)
		const choices = rd.shuffle([answer, ...wrongs], answerIndex).map(fmtAns)

		return ({
			instructions: `Determine the intervals over which the function is ***${fullName}***.`,
			diagram: diagram,
			answer: {
				correct: fmtAns(answer),
				choices: choices,
				correctIndex: answerIndex,
				prompt: ['EmptySpace', {width: '2in'}]
			}
		})
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
			freeResponse: {
				instructions: "List all possible rational zeros of the function (according to the _Rational Zero Theorem_)."
			}
		}
	}
}


export class GraphLinearInequalities extends QGen {
	static info = {
		name: 'Graph Inequalities',
		description: 'Graph the solution to a system of two linear inequalities',
	}


	static options = {
		singleColumn: true,
	}

	generate(params) {
		const rd = this.random
		
		let [x1, y1, y2] = rd.sampleRange(2,7,3)
		let x2 = rd.randint(-7,-2)
		const rotation = rd.randint(0,3)
		for (let i = 0; i < rotation; i++) {
			[x1, y1, x2, y2] = [-y1, x1, -y2, x2]
		}
		if (x1 > 0 && x2 > 0) {
			[x1, y1, x2, y2] = [-y1, x1, -y2, x2]
		}

		const [ineq1, ineq2] = rd.shuffle([rd.choice(['<', '>']), rd.choice(['<=', '>='])])

		const line1 = {a: y1, b: x1, c: x1*y1, ineq: ineq1, xInt: x1, yInt: y1}
		const line2 = {a: y2, b: x2, c: x2*y2, ineq: ineq2, xInt: x2, yInt: y2}

		const withsign = n => n < 0 ? n : '+' + n
		const latexineq = ineq => {
			if (ineq === '<=') return '\\leq'
			if (ineq === '>=') return '\\geq'
			return ineq
		}

		const latexeqn = f => `${f.a}x ${withsign(f.b)}y &${latexineq(f.ineq)} ${f.c}`

		const question = `$$\\displaystyle\\left\\{\\begin{aligned}\n${latexeqn(line1)} \\\\\n${latexeqn(line2)}\n\\end{aligned}\\right.$$`

		const blankgraph = ['CoordinatePlane', {span: "-10,-10 10,10", height: "1.8in"}]

		const correct = {
			lines: [], 
			clips: [],
		}

		for (const f of [line1, line2]) {
			const func = x => (f.c - x*f.a) / f.b
			const points = [[-11, func(-11)], [11, func(11)]]

			if (f.ineq === '<' || f.ineq === '>') {
				correct.lines.push(['Path', {points, style: 'dashed'}])
			} else {
				correct.lines.push(['Path', {points}])
			}

			let whichside
			if (f.ineq === '<' || f.ineq === '<=') {
				if (f.b > 0) {
					whichside = 'below'
				}	else {
					whichside = 'above'
				}
			} else {
				if (f.b > 0) {
					whichside = 'above'
				} else {
					whichside = 'below'
				}
			}
			if (whichside === 'above') {
				correct.clips.push([...points, [11,11], [-11, 11]])
			} else {
				correct.clips.push([...points, [11,-11], [-11, -11]])
			}
		}

		const plotAnswer = a => (
			[
				'CoordinatePlane', {span: [-10,-10,10,10], height: '1in', margin: '0.5mm'},
				[
					'Clip', {shape: 'Path', points: a.clips[0]}, [
						'Clip', {shape: 'Path', points: a.clips[1]},
						['Path', {points: [[-11,-11], [-11,11], [11,11], [11,-11]], fill: "solid"}]
				]],
				['Style', {color: '#999'}, ...a.lines],
				['Clip', {shape: 'Path', points: a.clips[1]}, a.lines[0] ],
				['Clip', {shape: 'Path', points: a.clips[0]}, a.lines[1] ],
			]
		)


		return {
			instructions: 'Graph the solution to the system of inequalities.',
			question: question,
			answer: {
				prompt: blankgraph,
				correct: plotAnswer(correct),
			},
		}
	}
}


function eqnFromPoints(p1, p2) {
	const m = fraction(p2[1] - p1[1], p2[0] - p1[0])
	const b = p1[1] - m*p1[0]
	const f = x => m*x + b
	Polynomial.setField('Q')
	const latex = new Polynomial([b, m]).toLatex()
	return ({f, latex})
}


class WritePiecewise extends QGen {
	static info = {
		name: 'Write Piecewise Function',
		description: 'Write the equation for a piecewise function from its graph.'
	}

	generate(params) {
		const rd = this.random

		const domain = [-9,9]
		const range = [-10,10]

		const order = rd.sample(['inc', 'dec', 'const'], 3)



		const eqns = []

		const pieces = []
		const xs = [domain[0], -3, 3, domain[1]]


		const left = [rd.bool(), rd.bool()] // does the function go with the left at the domain break?

		const markers = [
			['<', '.', '.'], 
			['.', '.', '.'], 
			['.', '.', '>'], 
		]

		const domainIneqs = [
			['\\leq', '\\leq'],
			['\\leq', '\\leq'],
			['\\leq', '\\leq'],
		]

		if (left[0]) {
			markers[1][0] = 'o'
			domainIneqs[1][0] = '<'
		} else {
			markers[0][2] = 'o'
			domainIneqs[0][1] = '<'
		}
		if (left[1]) {
			markers[2][0] = 'o'
			domainIneqs[2][0] = '<'
		} else {
			markers[1][2] = 'o'
			domainIneqs[1][1] = '<'
		}

		const answer = `$$y = \\left\\{\\begin{array}{r l r}
	${eqns[0].latex} & \\text{ for } & -\\infty ${domainIneqs[0][0]} x ${domainIneqs[0][1]} ${xs[1]} \\\\
	${eqns[1].latex} & \\text{ for } & ${xs[1]} ${domainIneqs[1][0]} x ${domainIneqs[1][1]} ${xs[2]} \\\\
	${eqns[2].latex} & \\text{ for } & ${xs[2]} ${domainIneqs[2][0]} x ${domainIneqs[2][1]} \\infty \\\\
\\end{array}\\right.$$`

		const paths = [
			['Path', {points: [pieces[0]], markers: markers[0].join('')}],
			['Path', {points: [pieces[1]], markers: markers[1].join('')}],
			['Path', {points: [pieces[2]], markers: markers[2].join('')}],
		]

		const diagram = [
			'CoordinatePlane', {
				span: [domain[0]-1, range[0], domain[1]+1, range[1]], 
				clip: false,
				height: '2in',
			},
			...paths
		]

		return {
			instructions: 'Write the equation for the piecewise function shown.',
			diagram,
			answer,
		}


	}
}