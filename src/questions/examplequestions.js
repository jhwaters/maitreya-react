import math from 'mathjs'
import Polynomial from 'polynomial'
import fraction from 'fraction.js'
import { range, gcd, listFactors } from './tools/handystuff'
import QGen from './QGen'
import _ from 'lodash'


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


class TransformTracker {
	// y = a * f( (x - h)/b ) + k
	constructor(parent) {
		this.parent = parent
		this.a = fraction(1)
		this.b = fraction(1)
		this.h = 0
		this.k = 0
	}

	translateX(n) { this.h += n }
	translateY(n) { this.k += n }
	scaleX(n) { this.b = this.b.mul(n) }
	scaleY(n) { this.a = this.a.mul(n) }
	
	shiftH(n) { this.translateX(n) }
	shiftV(n) { this.translateY(n) }
	stretchH(n) { this.scaleX(n) }
	stretchV(n) { this.scaleY(n) }
	compressH(n) { this.scaleX(fraction(1,n)) }
	compressV(n) { this.scaleY(fraction(1,n)) }
	reflectH() { this.b = -this.b }
	reflectV() { this.a = -this.a }

	f() {
		const parent = {
			'abs': x => Math.abs(x),
			'cubic': x => x*x*x,
			'exp2': x => Math.pow(2,x),
			'log2': x => Math.log2(x),
			'quad': x => x*x,
			'sqrt': x => Math.sqrt(x),
		}[this.parent]
		const {a, b, h, k} = this
		return x => a * parent(x/b - h/b) + k 
	}

	toLatex() {
		Polynomial.setField('Q')
		const {parent, a, b, h, k} = this
		const inner = new Polynomial([fraction(-h).div(b), fraction(1).div(b)]).toLatex()
		const kStr = k === 0 ? '' : k < 0 ? k.toString() : '+' + k.toString()
		const aStr = a == 1 ? '' : a == -1 ? '-' : a.toString()
		if (parent === 'sqrt') {
			return `${aStr}\\sqrt{${inner}}${kStr}`
		}
		if (parent === 'quad') {
			if (b == 1 && h === 0) {
				return `${aStr}x^2${kStr}`
			}
			return `${aStr}(${inner})^2${kStr}`
		}
		if (parent === 'cubic') {
			if (b == 1 && h === 0) {
				return `${aStr}x^3${kStr}`
			}
			return `${aStr}(${inner})^3${kStr}`
		}
		if (parent === 'abs') {
			return `${aStr}|${inner}|${kStr}`
		}
		if (parent === 'exp2') {
			if (aStr) {
				return `${aStr} \\cdot 2^{${inner}}${kStr}`
			}
			return `${aStr}2^{${inner}}${kStr}`
		}
		if (parent === 'log2') {
			return `${aStr}\\log_{2}(${inner})${kStr}`
		}
	}
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
		layout: [['instructions', 'question'], ['answer', 'diagram']]
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
		layout: [['instructions', 'question'], ['answer', 'diagram']],
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
				'RationalFunction',
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
			label: 'Type of interval to find',
			type: 'multipleselect',
			options: [
				{value: 'inc', label: 'increasing'}, 
				{value: 'dev', label: 'decreasing'}
			],
			default: ['inc', 'dec'],
		},
		style: {
			label: 'Graph style',
			type: 'select',
			options: ['jagged', 'smooth'],
			default: 'smooth'
		},
		points: {
			label: 'Mark points',
			type: 'bool',
			default: false,
		}
	}

	generate(params) {
		const rd = this.random

		const toFind = rd.choice(params.toFind)

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

		const effects = params.style === 'smooth' ? {interpolate: 'cubic-h'} : {}
		const markers = params.points ? {mid: 'point'} : undefined
		
		const diagram = [
			"CartesianPlane",
			{
				span: [-10,yRange[0]-1,10,yRange[1]+1], 
				autogrid: true,
				height: '1.3in', 
			},
			["Path", { points, effects, markers }]
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

	static params = {
		toFind: {
			label: 'Type of interval to find',
			type: 'multipleselect',
			options: [
				{value: 'inc', label: 'increasing'}, 
				{value: 'dev', label: 'decreasing'}
			],
			default: ['inc'],
		},
		style: {
			label: 'Graph style',
			type: 'select',
			options: ['jagged', 'smooth'],
			default: 'smooth'
		},
		points: {
			label: 'Mark points',
			type: 'bool',
			default: false,
		}
	}
}

export class DecreasingIntervals extends FindIntervals {
	static info = {
		name: 'Intervals - Decreasing',
		description: 'Identify intervals over which a graph is decreasing',
	}

	static params = {
		toFind: {
			label: 'Type of interval to find',
			type: 'multipleselect',
			options: [
				{value: 'inc', label: 'increasing'}, 
				{value: 'dev', label: 'decreasing'}
			],
			default: ['dec'],
		},
		style: {
			label: 'Graph style',
			type: 'select',
			options: ['jagged', 'smooth'],
			default: 'smooth'
		},
		points: {
			label: 'Mark points',
			type: 'bool',
			default: false,
		}
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

		
		const diagram = [
			'CartesianPlane',
			{span: [-20,-20,20,20], height: '3in', autogrid: false, style: 'geom'},
			[
				'Rotate', 
				{degrees: rotateBy},
				['GeomLine', {points: [left, right]}],
				['GeomLine', {points: [top1, bottom1]}],
				['GeomLine', {points: [top2, bottom2]}],
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

export class RationalZeroTheorem extends QGen {
	static info = {
		name: 'Rational Zero Theorem',
		description: 'State possible rational zeros for a polynomial function.'
	}

	static options = {
		answerchoices: {
			listDirection: 'horizontal'
		}
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

		const numCorrect = rd.choice([0,1,1,2,2,2,2,3,3,4])
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
			instructions: "Which of the following are possible zeros of the function according to the _Rational Zero Theorem_? Choose ***all*** that apply.",
			question: question,
			answer: {
				correct: allPossibleZeros.map(s => `$$${fraction(s).toLatex()}$$`).join(', '),
				choices: [...shuffled.map(s => `$$\\displaystyle ${fraction(s).toLatex()}$$`), 'None of these'],
				correctIndex: correctIndex,
			},
			freeResponse: {
				instructions: "List all possible rational zeros of the function (according to the _Rational Zero Theorem_)."
			}
		}
	}
}


export class MatchTransformations extends QGen {
	static info = {
		name: 'Match Transformations',
		description: 'Match equations with graphs'
	}

	static params = {
		parents: {
			label: 'Allowed Parent Functions',
			type: 'multipleselect',
			options: [
				{value: 'sqrt', label: 'Square root'},
				{value: 'quad', label: 'Quadratic'},
				{value: 'abs', label: 'Absolute value'},
				{value: 'cubic', label: 'Cubic'},
				{value: 'exp2', label: 'Exponential'},
				{value: 'log2', label: 'Logarithm'},
			],
			default: ['sqrt', 'quad', 'abs', 'cubic', 'exp2', 'log2'],
		}
	}

	static options = {
		layout: ['instructions', 'question', ['answer', 'diagram']]
	}

	generate(params) {
		const rd = this.random

		/*
		const parents = params.parents ? params.parents : [
			'abs', 'quad', 'sqrt', 'cubic',
			'exp2', 
			'log2',
		]
		*/
		const parent = rd.choice(params.parents)

		const transforms = ['up', 'down', 'left', 'right', 'flipDown', 'flipLR']
		
		let eqns = []
		let paths = []

		const v = rd.randint(2,5)
		for (const t of transforms) {
			const func = new TransformTracker(parent)

			if (t === 'up') func.shiftV(v)
			else if (t === 'down') func.shiftV(-v)
			else if (t === 'left') func.shiftH(-v)
			else if (t === 'right') func.shiftH(v)
			else if (t === 'stretchV') func.stretchV(v)
			else if (t === 'flipDown') func.stretchV(-v)
			else if (t === 'stretchH') func.stretchH(v)
			else if (t === 'flipLR') func.compressH(-v)

			const eqn = func.toLatex()
			eqns.push(`$$y = ${eqn}$$`)
			const f = func.f()
			const points = []
			let start, stop
			const {a, b, h, k} = func
			if (func.parent === 'sqrt') {
				[start, stop] = b < 0 ? [-10, h*b] : [h*b, 10]
			}
			else if (func.parent === 'log2') {
				if (b < 0) {
					[start, stop] = [-10, h*b-0.01]
				}
				else {
					[start, stop] = [h*b+0.01, 10]
					points.push({x: h*b, y: -a*1000})
				}
			}
			else {
				[start, stop] = [-10, 10]
			}
			let x = start
			while (x <= stop) {
				const y = f(x)
				points.push({x, y})
				x += 0.2
			}
			if (func.parent === 'log2' && b < 0) {
				points.push({x: h*b, y: -a*1000})
			}
			paths.push(points)
		}

		const graphPoints = points => ({
			type: 'vectorgraphic',
			data: [
				'CartesianPlane', 
				{ span: [-7,-7,7,7], autogrid: true, height: '1.2in' },
				['Path', { points }]
			]
		})

		const eqnScramble = rd.shuffleRange(0, 5)
		const graphScramble = rd.shuffleRange(0, 5)

		const letters = 'ABCDEF'
		const diagrams = [
			'div', {style: {
				display: 'grid', 
				gridTemplateColumns: '1fr 1fr 1fr',
				gridTemplateRows: '1fr 1r',
			}},
			...graphScramble.map((p, i) => [
				'div', {style: {
					display: 'flex',
					alignItems: 'center',
				}}, 
				['div', {style: {marginLeft: '5mm'}}, letters[i] + ') '], 
				graphPoints(paths[p])
			])
		]

		const eqnTable = {
			type: 'table',
			data: {
				headings: ['Equation', 'Graph'],
				rows: [
					...eqnScramble.map(i => [
						eqns[i], 
						{type: 'emptyspace', data: {height: '7mm', width: '7mm'}},
					])
				]
			}
		}

		const answer = eqnScramble.map(i => letters[graphScramble.indexOf(i)]).join(', ')

		return {
			instructions: 'Fill in the table to match each equation to its graph.',
			diagram: {
				type: 'jsonml',
				data: diagrams,
			},
			answer: {
				prompt: eqnTable,
				correct: answer,
			}
		}

	}
}
