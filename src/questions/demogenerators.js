import QGen from './QGen'
import { CartesianPlane, SvgElement } from './tools/plot'
import { createTree } from './tools/QuadTree'

export class FontTest extends QGen {
  generate(params) {
    
    const text = 'the quick brown fox jumps over the lazy dog 1234567890'

    let lines = ['$$\\text{' + text + '}$$']

    for (const chars of [text, text.toUpperCase()]) {
      for (const x of ['', '_', '__', '___']) {
        lines.push(`${x}${chars}${x}`)
      }
    }

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
      'Given that _x + y_ = _m_$$\\angle$$1, _IJK_ is equilateral ...',
      'Given that $$x + y = m\\angle{1}$$, $$IJK$$ is equilateral ...',
    ].join('  \n')

    return {
      instructions: lines.join('  \n'),
      question: question,
    }
  }
}

export class QuadTreePlotTest extends QGen {
  static info = {
    name: 'QuadTree Plot',
    description: 'Test alternate graphing algorithm'
  }

  generate(params) {
    const f1 = ({x, y}) => Math.pow(Math.sin(x*x), 1)
    const f2 = ({x, y}) => Math.pow(Math.cos(y*y), 1)
    //const f3 = ({x, y}) => Math.pow(Math.sin(y*y), 1)
    //const f4 = ({x, y}) => Math.pow(Math.cos(x*x), 1)

    let graph = new CartesianPlane(-7, -7, 7, 7, {height: '4in'})
    let q = createTree(pt => f1(pt) - f2(pt), -7, -7, 14, 9, 8)
    const marker = ({x, y}) => new SvgElement('circle', {cx: x, cy: y, r: '0.1'})
    const points = q.map(marker)
    graph.add(new SvgElement('g', {style: {fill: 'rgba(200,0,100,0.3)'}}, ...points))

    return {
      question: "The graph of $$\\sin(x^2) = \\cos(y^2)$$:",
      diagram: {
        type: 'jsonml',
        data: graph.toJsonML(),
      }
    }
  }
}



class JsonMlTest extends QGen {
  static info = {
    name: 'JsonML',
    description: 'Test rendering from JsonML',
  }

  generate(params) {
    const [color1, color2] = this.random.sample(['red', 'orange', 'yellow', 'green', 'blue', 'purple'], 2)

    return {
      instructions: {
        type: 'jsonml',
        data: [
          'div', 
            {
              style: {
                padding: '2mm',
                backgroundColor: 'rgba(0,0,0,0.4)',
                color: 'white',
              },
              children: [
                ['span', 'Child 1'], ['br'],
                ['span', {style: {'fontFamily': 'sans-serif'}}, 'Child 2'], ['br'],
              ],
            }, 
            ['code', 'Child 3'],
        ]
      },
      question: "What color are the circles?",
      answer: `${color1} and ${color2}`,
      diagram: {
        type: "jsonml",
        data: [
          'svg',
          {
            viewBox: "-5 -5 17 10",
            width: "2in",
            children: [
              ["circle", {cx: "0", cy: "0", r: "4", style: {
                fill: color1, 
                fillOpacity: "0.8",
                stroke: 'black',
                strokeWidth: '0.1',
              }}],
              ["circle", {cx: "8", cy: "0", r: "3", style: {
                fill: color2, 
                fillOpacity: "0.8",
                stroke: 'black',
                strokeWidth: '0.1',
                title: `This one is ${color2}!`,
              }}]
            ]
          }
        ]
      },
    }
  }
}

class MdTest extends QGen {

  static info = {
    name: 'Formatting',
    description: 'Test markdown/latex'
  }

  generate(params) {

    const mdtest = `## Text Formatting

Regular, _Italic_, __Bold__, ___Both___, ~sub~script, ^super^script,  \`monospaced\`,  
arrows: --> <-- ==> <== <--> <==>

#### Math (LaTeX)
The formula $$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$
is used to solve quadratic equations.

The Collatz Function:
$$$f(n) = \\left\\{ \\begin{array}{rl}
  n \\div 2 & \\text{ if $n$ is even} \\\\
  3n+1 & \\text{ if $n$ is odd}
\\end{array}\\right.$$$


#### List
- Thing A
  - Thing A.1
  - Thing A.2
- Thing B

#### Table
input ($$x$$) | output ($$y$$)
:-: | :-:
-3  | 3
-2  | -2 
-1  | -5
 0  | -6

#### Block quote
> All summations have a beginning, all effect has a  
> story, all kindness begins with the sown seed.  
> Thought buds toward radiance. The gospel of  
> light is the crossroads of -- indolence, or action.  
> 
> Be ignited, or be gone.

#### Hyperlink
[NPR Website](https://npr.org)

#### Code
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




export class VegaTest extends QGen {
  static info = {
    name: 'Vega Test',
    description: 'Test Vega rendering'
  }

  generate(params) {
    return {
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



export class VegaLite extends QGen {
  static info = {
    name: 'Vega Lite',
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
      instructions: 'Check this out:',
      diagram: {
        type: 'vega-lite',
        data: diagram2,
      }
    }
  }
}
