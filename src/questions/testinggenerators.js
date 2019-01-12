import QGen from './QGen'
import { CartesianPlane, SvgElement } from './plot'
import { createTree } from './QuadTree'



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



export class JsonMlTest extends QGen {
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

export class MdTest extends QGen {

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
