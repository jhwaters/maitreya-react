import QGen from './QGen'
import fraction from 'fraction.js'
import math from 'mathjs'
import { range, roundTo } from './tools/handystuff'
import { includes } from 'lodash'

function latexpifraction({n, d, s}) {
  if (n === 0) {
    return '0'
  }
  if (d < 0) {
    return latexpifraction({n: -n, d: -d})
  }
  let numer
  if (n === 1) {
    numer = '\\pi'
  } else {
    numer = `${n}\\pi`
  }
  if (s === -1) {
    numer = '-' + numer
  }
  if (d === 1) {
    return numer
  } else {
    return `\\frac{${numer}}{${d}}`
  }
}

const pythagoreanTriples = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
  [20, 21, 29],
  [12, 35, 37],
  [9, 40, 41],
  [28, 45, 53],
  [33, 56, 65],
  [48, 55, 73],
  [36, 77, 85],
  [65, 72, 97],
]


export class ConvertAngle extends QGen {
  static info = {
    name: 'Convert Angle',
    description: 'Convert between degrees and radians'
  }

  static params = {
    conversion: {
      label: 'Convert from:',
      type: 'select',
      options: [
        {value: ['d2r'], label: 'degrees to radians'},
        {value: ['r2d'], label: 'radians to degrees'},
        {value: ['d2r', 'r2d'], label: 'either'},
      ],
      default: ['d2r', 'r2d']
    },
    negative: {
      label: 'Negative angle',
      type: 'select',
      options: [
        {value: [false], label: 'No'},
        {value: [true], label: 'Yes'},
        {value: [false, true], label: 'Random'}
      ],
      default: [false, true],
    }
  }

  static options = {
    singleColumn: true
  }

  generate(params) {
    const rd = this.random
    const conversion = rd.choice(params.conversion)
    const neg = rd.choice(params.negative)
    const rotations = rd.choice([0,1,2])
    
    const denom = rd.choice([5,10,10,12,12])
    const numers = range(1, 2*denom-1, true).filter(n => math.gcd(denom, n) === 1)
    
    let numer = rd.choice(numers)
    if (rotations) {
      numer += denom * 2 * rotations
    }
    
    const radians = fraction(neg ? numer : -numer, denom)
    const degrees = 180 * radians.s * radians.n / radians.d

    let instructions, question, answer
    if (conversion === 'r2d') {
      instructions = 'Convert the angle from radians to degrees:'
      question = ['Math', `\\displaystyle ${latexpifraction(radians)}`]
      answer = ['Math', `${degrees}\\degree`]
    } else {
      instructions = 'Convert the angle from degrees to radians:'
      question = ['Math', `${degrees}\\degree`]
      answer = ['Math', `${latexpifraction(radians)}`]
    }

    return {
      instructions,
      question,
      answer,
      //layout: [['instructions', 'question'], ['answer', 'diagram']]
    }

  }
}


export class IdentifyQuadrant extends QGen {
  static info = {
    name: 'Identify Quadrant',
    description: 'Identify the quadrant of an angle given the sign of two trig functions'
  }

  static params = {
    functions: {
      label: 'Trig functions',
      type: 'multiple-select',
      minSelections: 2,
      maxSelections: 6,
      options: ['sin', 'cos', 'tan', 'csc', 'sec', 'cot'],
      default: {sin: true, cos: true, tan: true, csc: true, sec: true, cot: true},
    },
    quadrant: {
      label: 'Quadrant',
      type: 'multiple-select',
      minSelections: 1,
      maxSelections: 4,
      options: [1, 2, 3, 4],
      default: {1: true, 2: true, 3: true, 4: true}
    }
  }

  static options = {
    singleColumn: true
  }

  generate(params) {
    const rd = this.random
    
    const functions = {
      // funcs  Q1  Q2  Q3  Q4
      sin: [[], 1,  1, -1, -1],
      cos: [[], 1, -1, -1,  1],
      tan: [[], 1, -1,  1, -1],
    }
    for (const f in params.functions) {
      if (params.functions[f]) {
        if (f === 'sin' || f === 'csc') {
          functions.sin[0].push(f)
        } else if (f === 'cos' || f === 'sec') {
          functions.cos[0].push(f)
        } else if (f === 'tan' || f === 'cot') {
          functions.tan[0].push(f)
        }
      }
    }

    const quadrant = rd.choice(Object.keys(params.quadrant).filter(k => params.quadrant[k]))
    const answer = {1: 'I', 2: 'II', 3: 'III', 4: 'IV'}[quadrant]
    const ineq = {[-1]: '< 0', 1: '> 0'}
    const angle = rd.choice(['theta', 'omega', 'alpha', 'beta'])

    const funcChoices = Object.keys(functions).filter(f => functions[f][0].length > 0)
    const funcKeys = rd.sample(funcChoices, 2)
    const funcs = funcKeys.map(f => rd.choice(functions[f][0]))
  
    const clue = i => `\\${funcs[i]}\\${angle} ${ineq[functions[funcKeys[i]][quadrant]]}`
    const question = `If $$${clue(0)}$$ and $$${clue(1)}$$, which quadrant is $$\\${angle}$$ in?`

    return {
      question,
      answer: {
        correct: answer,
        choices: ['I', 'II', 'III', 'IV'],
        correctIndex: quadrant-1,
        listDirection: 'horizontal',
      }
    }
  }
}

export class SolveRightTriangle extends QGen {
  static info = {
    name: 'Solve Right Triangle',
    description: 'Find all missing side and angle measures for a right triangle'
  }

  static params = {
    given: {
      label: 'Givens',
      type: 'multiple-select',
      minSelections: 1,
      options: [
        {value: 'HL', label: 'Hypotenuse-Leg'},
        {value: 'LL', label: 'Leg-Leg'},
        {value: 'HA', label: 'Hypotenuse-Angle'}, 
        {value: 'LA', label: 'Leg-Angle'},
      ],
      default: {HL: true, LL: true, HA: true, 'LA': true}
    },
  }

  generate(params) {
    const rd = this.random
    const given = rd.choice(Object.keys(params.given).filter(k => params.given[k]))
    
    // Determine givens
    let givens
    if (given === 'HL') {
      if (rd.bool()) {
        givens = ['a', 'c']
      } else {
        givens = ['b', 'c']
      }
    }

    else if (given === 'LL') {
      givens = ['a', 'b']
    }

    else if (given === 'HA') {
      if (rd.bool()) {
        givens = ['c', 'A']
      } else {
        givens = ['c', 'B']
      }
    }

    else if (given === 'LA') {
      if (rd.bool()) {
        if (rd.bool()) {
          givens = ['a', 'A']
        } else {
          givens = ['b', 'B']
        }
      } else {
        if (rd.bool()) {
          givens = ['a', 'B']
        } else {
          givens = ['b', 'A']
        }
      }
    }

    console.log(given)
    console.log(givens)

    // Generate triangle
    const C = 90
    let a, b, c, A, B

    // Use integer angles
    A = rd.randint(8, 42)
    while (includes([30, 45, 60, 69, 21], A)) {
      A = rd.randint(8, 42)
    }
    B = 90 - A
    if (rd.bool()) {
      A = B
      B = 90 - A
    }

    c = rd.randint(8, 90)
    a = Math.sin(A * Math.PI / 180) * c
    b = Math.sin(B * Math.PI / 180) * c
    
    console.log({a, b, c, A, B})


    // Make sure all givens are integers
    if (given === 'HA') {
      c = Math.ceil(c)
      a = Math.sin(A * Math.PI / 180) * c
      b = Math.sin(B * Math.PI / 180) * c
    } else if (given === 'LA') {
      if (includes(givens, 'a')) {
        a = Math.ceil(a)
        c = a / Math.sin(A * Math.PI / 180)
        b = a / Math.tan(A * Math.PI / 180)
      } else {
        b = Math.ceil(a)
        c = b / Math.sin(B * Math.PI / 180)
        a = b / Math.tan(B * Math.PI / 180)
      }
    } else if (given === 'LL') {
      a = Math.round(a)
      b = Math.round(b)
      c = Math.sqrt(a*a + b*b)
      A = Math.atan(b/a) * 180 / Math.PI
      B = 90 - A
    } else if (given === 'HL') {
      if (includes(givens, 'a')) {
        a = Math.floor(a)
        c = Math.ceil(c)
        b = Math.sqrt(c*c - a*a)
      } else if (includes(givens, 'b')) {
        b = Math.floor(b)
        c = Math.ceil(c)
        a = Math.sqrt(c*c - b*b)
      }
      A = Math.atan(b/a) * 180 / Math.PI
      B = 90 - A
    }

    //const units = rd.choice(['cm', 'km', 'in', 'ft', 'm'])
    
    const values = {
      a: roundTo(a, 2),
      b: roundTo(b, 2),
      c: roundTo(c, 2),
      A: roundTo(A, 1) + '\\degree',
      B: roundTo(B, 1) + '\\degree',
      C: roundTo(C, 1) + '\\degree'
    }
    

    const labels = {C: 'C'}

    let giveninfo = []
    let answer = []
    let answerblanks = []
    for (const k of ['A', 'B', 'a', 'b', 'c']) {
      if (includes(givens, k)) {
        giveninfo.push(`${k} = ${values[k]}`)
        labels[k] = values[k]
      } else {
        answerblanks.push(k)
        answer.push(`${k} = ${values[k]}`)
        labels[k] = k
      }
    }

    const question = [
      `Given that ${giveninfo.slice(0,-1).map(g => '$$' + g + '$$').join(', ')} and $$${giveninfo[giveninfo.length-1]}$$,`,
      'determine the measure of all sides and angles for right triangle $$ABC$$. The diagram is __not__ to scale.'
    ].join(' ')

    const diagram = [
      'CoordinatePlane', {span: "0,0 4,3", axis: false, grid: false, clip: false, height: '1.3in'},
      //['Style', {exactName: 'svgplot-grid'}, ['Grid', {span: [0,0,4,3]}]],
      ['Path', {points: "3.5,0 3.5,0.5 4,0.5", style: 'geometry anglemark'}],
      ['Polygon', {points: "0,0 4,0 4,3", style: "geometry", markers: '...'}],
      
      ['Overlay', {x: 4, y: 1.5, anchor: 'W', displacement: '1mm'}, `$$${labels.a}$$`],
      ['Overlay', {x: 2.2, y: 0, anchor: 'N', displacement: '1mm'}, `$$${labels.b}$$`],
      [
        'Overlay', 
        {x: 2, y: 1.5, anchor: 'SE', displacement: '1mm', rotate: '30' },
        `$$${labels.c}$$`,
      ],
      ['Overlay', {x: 4, y: 3, displacement: {angle: 245, radius: labels.B === 'B' ? '7mm': '8.5mm'}}, `$$${labels.B}$$`],
      ['Overlay', {x: 0, y: 0, displacement: {angle: 15, radius: labels.A === 'A' ? '8mm' : '10mm'}}, `$$${labels.A}$$`],
    ]

    function answerPrompt(s) {
      if (includes(['a', 'b', 'c'], s)) {
        return `length $$${s} = $$`
      }
      if (includes(['A', 'B'], s)) {
        return `$$m\\angle{${s}} = $$`
      }
    }

    return {
      question,
      diagram,
      answer: {
        correct: answer.map(a => '$$' + a + '$$').join(', '),
        prompt: [
          'AnswerBlanks',
          ...answerblanks.map(answerPrompt)
        ]
      },
    }
  }
}