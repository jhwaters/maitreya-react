import Polynomial from 'polynomial'
import fraction from 'fraction.js'

import QGen from './QGen'



class TransformTracker {
	// y = a * f((x - h)/b) + k
	constructor(parent) {
		this.parent = parent
		this.a = fraction(1)
		this.b = fraction(1)
		this.h = 0
		this.k = 0
	}

  translate(x,y) { this.h += x; this.k += y }
  scale(x,y) { this.b = this.b.mul(x); this.a = this.a.mul(y) }
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
  up(n) { this.translateY(n) }
  down(n) { this.translateY(-n) }

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
		return x => a * parent((x - h)/b) + k 
  }
  
  vgTransform() {
    return ({type: 'matrix', params: [this.b.valueOf(), 0, 0, this.a.valueOf(), this.h, this.k]})
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
				{value: 'cubic', label: 'Cubic'}, // cubic is problematic because reflections are ambiguous
				{value: 'exp2', label: 'Exponential'},
				{value: 'log2', label: 'Logarithm'},
			],
			default: ['sqrt', 'quad', 'abs', 'exp2', 'log2'],
		}
	}

	//static options = {
	//	layout: ['instructions', 'question', ['answer', 'diagram']]
	//}

	generate(params) {
		const rd = this.random

		const parent = rd.choice(params.parents)

		const transforms = (
			parent === 'cubic' 
			? ['up', 'down', 'left', 'right', 'stretchV', rd.choice(['flipLR', 'flipDown'])]
			: ['up', 'down', 'left', 'right', 'flipDown', 'flipLR']
		)
		
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

		const graphPoints = points => [
			'ABVG', [
				'CoordinatePlane', 
				{ span: [-7,-7,7,7], height: '1.2in' },
				['Path', { points }]
			]
		]

		const eqnScramble = rd.shuffleRange(0, 5)
		const graphScramble = rd.shuffleRange(0, 5)

		const letters = 'ABCDEF'

		const makebox = i => [
			'Container', 
			{direction: 'row', alignItems: 'center'}, 
			letters[i] + ')',
			graphPoints(paths[graphScramble[i]])
		]

		const diagrams = [
			'Table', {border: false},
			['TRow', ...[0,1,2].map(makebox)],
			['TRow', ...[3,4,5].map(makebox)]
		]

		const eqnTable = [
			'Table', {border: true, align: 'c|c'},
			['TRow', {header: true, border: true}, 'Equation', 'Graph'],
			...eqnScramble.map(i => (
				['TRow', {border: true}, eqns[i], ['EmptySpace', {height: '7mm', width: '7mm'}]]
			))
		]


		const answer = eqnScramble.map(i => letters[graphScramble.indexOf(i)]).join(', ')

		return {
			instructions: 'Fill in the table to match each equation to its graph.',
			diagram: diagrams,
			answer: {
				prompt: eqnTable,
				correct: answer,
			}
		}

	}
}
