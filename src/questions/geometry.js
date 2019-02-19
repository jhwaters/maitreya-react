import QGen from './QGen'
import Polynomial from 'polynomial'
import { includes } from 'lodash'

function lineThroughPoints(a, b) {
  /** returns polynomial coefficients */
  const m = (b[1] - a[1]) / (b[0] - a[0])
  return [a[1] - m*a[0], m]
}

function congruentOrSupplementary() {
  const rd = this.random;
  
  let [leadingCoeff1, leadingCoeff2] = rd.sampleRange(2,8,2);
  while (Math.abs(leadingCoeff1 - leadingCoeff2) < 2) {
    [leadingCoeff1, leadingCoeff2] = rd.sampleRange(2,8,2);
  }

  const congruentVal = rd.randint(3,12);
  const dx = ((leadingCoeff1 % 2) === (leadingCoeff2 % 2)) ? rd.randint(4,12) : 2*rd.randint(1,6)
  const l = (180 - leadingCoeff1*dx - leadingCoeff2*dx) / 2

  const supplementaryVal = congruentVal + dx
  const f = lineThroughPoints([congruentVal, l], [supplementaryVal, leadingCoeff1*dx+l])
  const g = lineThroughPoints([congruentVal, l], [supplementaryVal, 180 - (f[0] + f[1]*supplementaryVal)])

  return {
    f: new Polynomial(f).toLatex(),
    g: new Polynomial(g).toLatex(),
    solution: {
      congruent: congruentVal,
      supplementary: supplementaryVal,
    }
  }
}

const translate = (a, b) => [a[0] + b[0], a[1]+ b[1]]
const difference = (a, b) => [a[0] - b[0], a[1] - b[1]]
const complexMult = (a, b) => [a[0] * b[0] - a[1] * b[1], a[1] * b[0] + a[0] * b[1]]

const rotate = (pt, angle, center=[0,0]) => {
	const radians = angle * Math.PI / 180
	const rotator = [Math.cos(radians), Math.sin(radians)]
	const recenter = difference(pt, center)
	return translate(complexMult(recenter, rotator), center)
}



export class TransversalNames extends QGen {
	static info = {
		name: 'Transversal Relations',
		description: 'Name the relation of two angles',
	}

	static params = {
		possibleRelations: {
			label: 'Possible relations',
			type: 'multiple-select',
			options: [
				'alternate exterior',
				'alternate interior',
				//'consecutive exterior',
				'consecutive interior',
				'corresponding',
				'linear',
				'vertical', 
			],
			default: {
				'alternate exterior': true,
				'alternate interior': true,
				'consecutive exterior': false,
				'consecutive interior': true,
				'corresponding': true,
				'linear': false,
				'vertical': false,
			}
		}
	}

	generate(params) {

		const rd = this.random
		const possibleRelations = Object.keys(params.possibleRelations).filter(k => params.possibleRelations[k])
		const answer = rd.choice(possibleRelations)

		const angle1 = rd.randint(45, 135)

		const rotateBy = rd.randint(-35,35)

		const r1 = 8
		const r2 = 5
		const intersect1 = [-r1/2,0]
		const pp = [r2 * Math.cos(angle1 * Math.PI / 180), r2 * Math.sin(angle1 * Math.PI / 180)]
		const top1 = translate(intersect1, pp)
		const bottom1 = difference(intersect1, pp)

		const intersect2 = [-intersect1[0], intersect1[1]]
		const top2 = [top1[0] + r1, top1[1]]
		const bottom2 = [bottom1[0] + r1, bottom1[1]]

		const left = [intersect1[0] - r2, intersect1[1]]
		const right = [intersect2[0] + r2, intersect2[1]]

		function angleMark(transversal, position) {
			// transversal: 1 or 2 
			// position: 'a', 'b', 'c', or 'd'

			const result = {minRadius: 1.6};

			if (transversal === 1) {
				result.coords = intersect1;
			} else {
				result.coords = intersect2;
			}
			if (position === 'a') {
				result.start = 0;
				result.end = angle1;
			} else if (position === 'b') {
				result.start = angle1;
				result.end = 180;
			} else if (position === 'c') {
				result.start = 180;
				result.end = 180 + angle1;
			} else {
				result.start = 180 + angle1;
				result.end = 360;
			}
			return result
		}

		const relations = {
			'alternate exterior': ['1b:2d', '1c:2a'],
			'alternate interior': ['1a:2c', '1d:2b'],
			'consecutive exterior': ['1b:2a', '1c:2d'],
			'consecutive interior': ['1a:2b', '1d:2c'],
			'corresponding': ['1a:2a', '1b:2b', '1c:2c', '1d:2d'],
			'linear': [
				'1a:1b', '1b:1c', '1c:1d', '1d:1a',
				'2a:2b', '2b:2c', '2c:2d', '2d:2a',
			],
			'vertical': ['1a:1c', '1b:1d', '2a:2c', '2b:2d'], 
		}

		const choices = (
			possibleRelations.length > 5 
			? [answer, ...rd.sample(possibleRelations.filter(k => k != answer), 4)] 
			: [...possibleRelations]
		)
		while (choices.length < 5) {
			const k = rd.choice(Object.keys(relations))
			if (!includes(choices, k)) {
				choices.push(k)
			}
		}

		const anglesToMark = rd.choice(relations[answer])
		const [a1, a2] = anglesToMark.split(':')

		const angleMark1 = angleMark(+a1[0], a1[1])
		const angleMark2 = angleMark(+a2[0], a2[1])
		
		const diagram = [
			'CoordinatePlane',
			{
				span: [-11,-7,11,7], margin: '0mm', width: '2.5in', 
				grid: false, axis: false, style: 'geom',
			},
			[
				'Transform', 
				{type: 'rotate', a: rotateBy},
				['AngleMark', angleMark1],
				['AngleMark', angleMark2],
				['Path', {points: [left, right], markers: '<->'}],
				['Path', {points: [top1, bottom1], markers: '<->'}],
				['Path', {points: [top2, bottom2], markers: '<->'}],
				['Point', {coords: intersect1}],
				['Point', {coords: intersect2}]
			]
		]


		return {
			instructions: 'The indicated angles are best described as ...',
			diagram: diagram,
			answer: {
				correct: answer,
				choices: rd.shuffle(choices),
			},
			layout: [[['instructions', 'question', 'answer'], 'diagram', ]],
		}

	}
}
