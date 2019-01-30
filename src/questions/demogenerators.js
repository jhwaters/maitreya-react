import QGen from './QGen'
import * as svg from './tools/svgplot'
import { createTree } from './tools/QuadTree'


export class RationalPlot extends QGen {
  static info = {
    name: 'RationalFunction',
    description: 'test vectorgraphic RationalFunction'
  }

  generate(params) {
    const rd = this.random

    const inv = rd.choice([true, false])

    const numRoots = rd.randint(0,2)
    const numAsymptotes = rd.randint(1,3)
    const numHoles = rd.randint(0,2)
    const total = numRoots + numAsymptotes + numHoles
    const values = rd.sampleRange(-9,9,total)
    const roots = values.slice(0,numRoots)
    const asymptotes = values.slice(numRoots, numRoots+numAsymptotes)
    const holes = values.slice(numRoots+numAsymptotes)
    const domain = [-11,11]

    const [x, y] = inv ? ['y', 'x'] : ['x', 'y']

    let num = ''
    let den = ''

    for (const r of [...roots, ...holes].sort((a,b) => b-a)) {
      if (r === 0) {
        num = `${x}${num}`
      } else if (r > 0) {
        num = `${num}(${x}-${r})`
      } else {
        num = `${num}(${x}+${-r})`
      }
    }

    for (const r of [...asymptotes, ...holes].sort((a,b) => b-a)) {
      if (r === 0) {
        den = `${x}${den}`
      } else if (r > 0) {
        den = `${den}(${x}-${r})`
      } else {
        den = `${den}(${x}+${-r})`
      }
    }

    if (num === '') num = '1'
    if (den === '') den = '1'

    const graph = {
      type: 'vectorgraphic',
      data: [
        'CartesianPlane',
        {span: [-10,-10,10,10], autogrid: true, height: '2in'},
        [
          'Transforms',
          {list: [inv ? 'invertXY' : 'none']},
          [
            'RationalFunction',
            {roots, holes, asymptotes, domain}
          ]
        ]
      ]
    }

    return {
      question: `The graph of $$\\displaystyle ${y} = \\frac{${num}}{${den}}$$`,
      diagram: graph,
    }


  }
}

export class PolynomialPlot extends QGen {
  static info = {
    name: 'PolynomialFunction',
    description: 'test vectorgraphic PolynomialFunction'
  }

  generate(params) {
    const rd = this.random

    const deg = rd.randint(2,7)
    const inv = rd.choice([true, false])
    let coeffs = rd.sample([-5,-4,-3,-2,-1,0,1,2,3,4,5], deg+1)
    const denom = rd.randint(2, 21)
    
    if (coeffs[coeffs.length-1] === 0) {
      coeffs = coeffs.slice(0,-1)
    }
    const [v, w] = inv ? ['y', 'x'] : ['x', 'y']
    let tex = ''
    for (let i = coeffs.length-1; i >= 0; i--) {
      const c = coeffs[i]
      const x = i === 0 ? '' : `${v}^{${i}}`
      if (c > 0) {
        if (i < coeffs.length-1) tex += '+';
        if (c !== 1 || i === 0) tex += c;
        tex += x
      } else if (c < 0) {
        if (c !== -1 || i === 0) {
          tex += c
        } else {
          tex += '-'
        }
        tex += x
      }
    }

    const transform = inv ? 'invertXY' : 'none'

    const graph = [
      'CartesianPlane',
      {span: [-10,-10,10,10], autogrid: true, width: '2in'},
      [
        'Transforms',
        {list: [transform]},
        [
          'PolynomialFunction',
          {coefficients: coeffs.map(c => c/denom), domain: [-11,11]}
        ]
      ]
    ]

    const question = `The graph of a $$\\displaystyle ${w} = \\frac{1}{${denom}}(${tex})$$`

    return {
      question: question,
      diagram: {
        type: 'vectorgraphic',
        data: graph,
      },
      answer: {
        prompt: null,
      }
    }
  }
}

export class PlotStyling extends QGen {
  static info = {
    name: 'Plot Style',
    description: 'test applying custom styling to vectorgraphic'
  }

  generate(params) {
    const x = t => 9*Math.sin(t)
    const y = t => 9*Math.sin(1.17*t)
    const step = 0.1
    let path1 = []
    let path2 = []
    let path3 = []
    let path4 = []

    let t = -36

    while (t <= -18) {
      path1.push([x(t), y(t)])
      t += step
    }
    path1.push([x(t), y(t)])

    while (t <= 0) {
      path2.push([x(t), y(t)])
      t += step
    }
    path2.push([x(t), y(t)])

    while (t <= 18) {
      path3.push([x(t), y(t)])
      t += step
    }
    path3.push([x(t), y(t)])


    while (t <= 36) {
      path4.push([x(t), y(t)])
      t += step
    }
    path4.push([x(t), y(t)])


    return {
      answer: {prompt: null},
      question: 'The graph of $$(x,y) = (9\\sin(t), 9\\cos(1.17t))$$ for $$-36 \\leq t \\leq 36$$:',
      diagram: {
        type: 'vectorgraphic', 
        data: [
          'CartesianPlane', 
          {
            span: [-10,-10,10,10], 
            autogrid: false,
            height: '3in',
          },
          [
            'Layer', {},
            [
              'Layer',
              {style: {'--vg-path-color': 'hsl(340,70%,60%)'}},
              ['Path', {points: path4}],
            ],
            [
              'Layer',
              {style: {'--vg-path-color': 'hsl(30,90%,50%)'}},
              ['Path', {points: path3}],
            ],
            [
              'Layer',
              {style: {'--vg-path-color': 'hsl(80,90%,40%)'}},
              ['Path', {points: path2}],
            ],
            [
              'Layer',
              {style: {'--vg-path-color': 'hsl(170,90%,40%)'}},
              ['Path', {points: path1}],
            ]
          ]
        ]
      }
    }
  }
}


export class FontTest extends QGen {
  static info = {
    name: "Font Test"
  }

  generate(params) {
    
    const text = 'the quick brown fox jumps over the lazy dog 1234567890'

    let lines = []

    for (const chars of [text, text.toUpperCase()]) {
      for (const x of ['', '_', '__', '___']) {
        lines.push(`${x}${chars}${x}`)
      }
    }

    lines.push('$$\\text{' + text + '}$$ (LaTeX)')

    const dontConfuse = ['IJl1']

    for (const d of dontConfuse) {
      let line = []
      for (let i = 0; i < d.length-1; i++) {
        for (let j = i+1; j < d.length; j++) {
          line.push(d[i] + d[j])
        }
      }
      for (const x of ['', '_', '__', '___']) {
        lines.push(`${x}${line.join(' ')}${x}`)
      }
    }

    const question = [
      '_y = ax^2^ + bx +c_', 
      '$$y = ax^2 + bx + c$$',
    ].join('  \n')

    return {
      instructions: lines.join('  \n'),
      question: question,
    }
  }
}

export class QuadTreePlotTest extends QGen {
  static info = {
    name: 'QuadTree Plot Test',
    description: 'Test alternate graphing algorithm'
  }

  generate(params) {
    const f1 = ({x, y}) => Math.pow(Math.sin(x*x), 1)
    const f2 = ({x, y}) => Math.pow(Math.cos(y*y), 1)
    //const f3 = ({x, y}) => Math.pow(Math.sin(y*y), 1)
    //const f4 = ({x, y}) => Math.pow(Math.cos(x*x), 1)

    
    let points = createTree(pt => f1(pt) - f2(pt), -7, -7, 14, 8, 7)

    /*
    const marker = ({x, y}) => ['circle', {cx: x, cy: y, r: '0.1'}]

    const graph = svg.cartesianPlane(
      {span: [-7,-7,7,7], autogrid: true, height: '5in', width: '5in'},
      [
        'g', {style: {fill: 'rgba(200,0,100,0.3)'}},
        ...points.map(marker),
      ]
    )
    */
   const graph = [
     'CartesianPlane',
     {span: [-7,-7,7,7], autogrid: true, width: '2.5in'},
     [
       'ScatterPlot',
       { points }
     ]
   ]



    return {
      answer: null,
      question: "The graph of $$\\sin(x^2) = \\cos(y^2)$$:",
      diagram: {
        type: 'vectorgraphic',
        data: graph,
      }
    }
  }
}

class MdTest extends QGen {

  static info = {
    name: 'Formatting Test',
    description: 'Test markdown/latex'
  }

  generate(params) {

    const mdtest = `# Heading

Regular, _Italic_, __Bold__, ___Both___, ~sub~script, ^super^script,  \`monospaced\`,  
arrows: --> <-- ==> <== <--> <==>

The formula $$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$
is used to solve quadratic equations.

The Collatz Function:
$$$f(n) = \\left\\{ \\begin{array}{rl}
  n \\div 2 & \\text{ if $n$ is even} \\\\
  3n+1 & \\text{ if $n$ is odd}
\\end{array}\\right.$$$

- Thing A
  - Thing A.1
  - Thing A.2
- Thing B

input ($$x$$) | output ($$y$$)
:-: | :-:
-3  | 3
-2  | -2 
-1  | -5
 0  | -6

> All summations have a beginning, all effect has a  
> story, all kindness begins with the sown seed.  
> Thought buds toward radiance. The gospel of  
> light is the crossroads of -- indolence, or action.  
> 
> Be ignited, or be gone.

[Hyperlink](https://npr.org)

${'```'}python
def gcd(a, b):
    if a == b or b == 0:
        return a
    elif a == 0:
        return b
    else:
      return gcd(a, a-b) if a > b else gcd(b, b-a)
${'```'}
`

    return ({
      answer: null,
      question: {
        type: 'markdown',
        data: mdtest,
      },
    })
  }

}



export class VegaLite extends QGen {
  static info = {
    name: 'Vega Lite',
    description: 'test vega-lite render type'
  }

  generate(params) {
    let points = []

    const f = x => ({x: x, y: 6*x - x*x, function: 'f'})
    const g = x => ({x: x, y: 5*Math.sin(x), function: 'g'})

    let t = 0
    while (t <= 7) {
      points.push(f(t))
      points.push(g(t))
      t += 0.2
    }

    const diagram2 = {
      data: { values: points },
      mark: {
        type: 'line', 
        interpolate: 'monotone',
      },
      "encoding": {
        x: {
          field: 'x', 
          type: 'quantitative',
        },
        y: {
          field: 'y', 
          type: 'quantitative',
        },
        color: {
          field: 'function',
          type: 'nominal'
        }
      },
    }

    return {
      answer: null,
      instructions: 'The graphs of $$f(x) = - x^2 + 6x$$ and $$g(x) = 5\\sin(x)$$',
      diagram: {
        type: 'vega-lite',
        data: diagram2,
      }
    }
  }
}

class VegaTest extends QGen {
  static info = {
    name: 'Vega Test',
    description: 'Test Vega rendering'
  }

  generate(params) {
    return {
      answer: null,
      instructions: "Rendered with Vega:",
      diagram: {
        type: 'vega',
        data: {
          "$schema": "https://vega.github.io/schema/vega/v4.json",
          "width": 500,
          "height": 200,
          "padding": 5,
        
          "signals": [
            {
              "name": "interpolate",
              "value": "linear",
              "bind": {
                "input": "select",
                "options": [
                  "basis",
                  "cardinal",
                  "catmull-rom",
                  "linear",
                  "monotone",
                  "natural",
                  "step",
                  "step-after",
                  "step-before"
                ]
              }
            }
          ],
        
          "data": [
            {
              "name": "table",
              "values": [
                {"x": 0, "y": 28, "c":0}, {"x": 0, "y": 20, "c":1},
                {"x": 1, "y": 43, "c":0}, {"x": 1, "y": 35, "c":1},
                {"x": 2, "y": 81, "c":0}, {"x": 2, "y": 10, "c":1},
                {"x": 3, "y": 19, "c":0}, {"x": 3, "y": 15, "c":1},
                {"x": 4, "y": 52, "c":0}, {"x": 4, "y": 48, "c":1},
                {"x": 5, "y": 24, "c":0}, {"x": 5, "y": 28, "c":1},
                {"x": 6, "y": 87, "c":0}, {"x": 6, "y": 66, "c":1},
                {"x": 7, "y": 17, "c":0}, {"x": 7, "y": 27, "c":1},
                {"x": 8, "y": 68, "c":0}, {"x": 8, "y": 16, "c":1},
                {"x": 9, "y": 49, "c":0}, {"x": 9, "y": 25, "c":1}
              ]
            }
          ],
        
          "scales": [
            {
              "name": "x",
              "type": "point",
              "range": "width",
              "domain": {"data": "table", "field": "x"}
            },
            {
              "name": "y",
              "type": "linear",
              "range": "height",
              "nice": true,
              "zero": true,
              "domain": {"data": "table", "field": "y"}
            },
            {
              "name": "color",
              "type": "ordinal",
              "range": "category",
              "domain": {"data": "table", "field": "c"}
            }
          ],
        
          "axes": [
            {"orient": "bottom", "scale": "x", 'titleFont': 'Zilla Slab'},
            {"orient": "left", "scale": "y"}
          ],
        
          "marks": [
            {
              "type": "group",
              "from": {
                "facet": {
                  "name": "series",
                  "data": "table",
                  "groupby": "c"
                }
              },
              "marks": [
                {
                  "type": "line",
                  "from": {"data": "series"},
                  "encode": {
                    "enter": {
                      "x": {"scale": "x", "field": "x"},
                      "y": {"scale": "y", "field": "y"},
                      "stroke": {"scale": "color", "field": "c"},
                      "strokeWidth": {"value": 2}
                    },
                    "update": {
                      "interpolate": {"signal": "interpolate"},
                      "fillOpacity": {"value": 1}
                    },
                    "hover": {
                      "fillOpacity": {"value": 0.5}
                    }
                  }
                }
              ]
            }
          ]
        }
        
      }
    }
  }
}