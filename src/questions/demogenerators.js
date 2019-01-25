import QGen from './QGen'
import { CartesianPlane, PlotElement } from './tools/plot'
import { createTree } from './tools/QuadTree'


class RationalPlot extends QGen {
  static info = {
    name: 'Rational Plot',
    description: 'Plot rational by parameters'
  }

  generate(params) {
    

    return {
      question: 'Rational:',
      diagram: {
        type: 'graph',
        data: [
          'CartesianPlane',
          {start: [-10,-10], stop: [10,10]},
          [
            'Rational',
            {
              inverse: true,
              domain: [-10,10],
              roots: [-1, 6],
              holes: [-5],
              asymptotes: [0, 3],
            }
          ]
        ]
      }
    }
  }
}

class PolynomialPlot extends QGen {
  static info = {
    name: 'Polynomial plot',
    description: 'Plot polynomial by coefficients'
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


    const graph = [
      'CartesianPlane',
      {start: [-10,-10], stop: [10,10]},
      [
        'Polynomial',
        {coefficients: coeffs.map(c => c/denom), domain: [-10,10], inverse: inv}
      ]
    ]

    const question = `The graph of a $$\\displaystyle ${w} = \\frac{1}{${denom}}(${tex})$$`

    return {
      question: question,
      diagram: {
        type: 'graph',
        data: graph,
      }
    }
  }
}

export class PlotStyling extends QGen {
  static info = {
    name: 'Plot Style',
    description: 'Plot with custom style'
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
      question: 'The graph of $$(x,y) = (9\\sin(t), 9\\cos(1.17t))$$ for $$-36 \\leq t \\leq 36$$:',
      diagram: {
        type: 'graph', 
        data: [
          'CartesianPlane', 
          {
            start: [-10,-10], stop: [10,10], padding: 0.2,
            style: {
              '--plot-grid-color': '#ddd',
              '--plot-axis-color': '#444',
              '--plot-grid-width': '0.3mm',
              '--plot-axis-width': '0',
              //backgroundColor: '#aaa',
              height: '3in',
            }
          },
          [
            'Layer',
            {style: {'--plot-path-color': 'hsl(340,70%,60%)'}},
            ['Path', {points: path4}],
          ],
          [
            'Layer',
            {style: {'--plot-path-color': 'hsl(30,90%,50%)'}},
            ['Path', {points: path3}],
          ],
          [
            'Layer',
            {style: {'--plot-path-color': 'hsl(80,90%,40%)'}},
            ['Path', {points: path2}],
          ],
          [
            'Layer',
            {style: {'--plot-path-color': 'hsl(170,90%,40%)'}},
            ['Path', {points: path1}],
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
      '_IJK_ $$IJK$$',
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

    let graph = new CartesianPlane(-7, -7, 7, 7, {height: '4in'})
    let q = createTree(pt => f1(pt) - f2(pt), -7, -7, 14, 9, 8)
    const marker = ({x, y}) => new PlotElement('circle', {cx: x, cy: y, r: '0.1'})
    const points = q.map(marker)
    graph.add(new PlotElement('g', {style: {fill: 'rgba(200,0,100,0.3)'}}, ...points))

    return {
      question: "The graph of $$\\sin(x^2) = \\cos(y^2)$$:",
      diagram: {
        type: 'jsonml',
        data: graph.toJsonML(),
      }
    }
  }
}

export class MdTest extends QGen {

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
      question: {
        type: 'markdown',
        data: mdtest,
      },
    })
  }

}



export class VegaLite extends QGen {
  static info = {
    name: 'Vega Lite Test',
    description: 'Test Vega-Lite rendering'
  }

  generate(params) {
    let points = []
    for (let x = -3; x <= 3; x++) {
      points.push({x: x, y: x*x})
    }
    const diagram2 = {
      "data": {"values": points},
      "mark": {
        'type': 'line', 
        'interpolate': 'monotone',
      },
      "encoding": {
        'x': {
          'field': 'x', 
          'type': 'quantitative',
        },
        'y': {
          'field': 'y', 
          'type': 'quantitative',
        },
        axisX: {
          titleFont: 'Lora'
        },
      },
    }

    return {
      instructions: 'Rendered with Vega-Lite:',
      diagram: {
        type: 'vega-lite',
        data: diagram2,
      }
    }
  }
}

export class VegaTest extends QGen {
  static info = {
    name: 'Vega Test',
    description: 'Test Vega rendering'
  }

  generate(params) {
    return {
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
