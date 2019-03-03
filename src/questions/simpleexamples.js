/*
Every 
```
export class ... extends QGen {
  ...
  generate() {
    ...
  }
}
```
is a question generator. The `generate()` method describes how the question
is generated and returns an object that looks something like: 
```
{
  instructions: ...,
  question: ...,
  diagram: ...,
  answer: ...
}
```
Any of the four fields (instructions, question, diagram, and answer) can be
left out if not needed.
*/


import QGen from './QGen'
import fraction from 'fraction.js'
import Polynomial from 'polynomial'


export class MinimalGenerator extends QGen {
  /*
  A minimal question generator - this generator does not have any 'info'
  set. The name therefore defaults to the class name (in this case 
  'MinimalGenerator')
  */

  generate() {
    return {
      instructions: 'instructions here',
      question: 'question here',
      diagram: 'diagram here',
      answer: 'answer here',
    }
  }
}


export class EasySum extends QGen {
  static info = {
    name: 'Easy Sum',
    description: 'Calculate the sum of two 1-digit integers'
  }

  static options = {
    // this question takes only half the width of the page
    singleColumn: true, 
  }

  generate() {
    const rd = this.random
    /* 
    You can generate random numbers in other ways, but this has the
    seed set correctly and has several handy methods built in.
    Look in ./tools/random_randomjs.js to see available methods
    rd.randint(m, n) generates a random integer between m and n (inclusive)
    */
    const a = rd.randint(1,9)
    const b = rd.randint(1,9)
    const answer = a + b

    return {
      instructions: 'Calculate the sum:',
      question: `$$${a} + ${b} =$$ ?`, 
      answer: '$$' + answer + '$$',
      /*
      The question and answer are wrapped in $$...$$ to signify math mode
      this is not strictly necessary for this particular question, since 
      everything is an integer that can be displayed without latex, but 
      it is a good idea to put the numbers in math mode anyway for 
      consistent styling
      */
    }
  }
}


export class SimpleGraph extends QGen {
  static info = {
    name: 'Simple Graph',
    description: 'Coordinate plane with two points plotted.',
  }

  static options = {
    singleColumn: true,
  }

  generate() {
    const rd = this.random

    let x1, x2, y1, y2
    while (x1 === x2 && y1 === y2) {
      // pick 4 numbers at random, each from -5 to 5 (inclusive)
      // and regenerate if the two points are identical
      x1 = rd.randint(-5,5)
      x2 = rd.randint(-5,5)
      y1 = rd.randint(-5,5)
      y2 = rd.randint(-5,5) 
    }

    let answer
    if (x1 === x2) {
      answer = 'undefined'
    } else if (y1 === y2) {
      answer = '$$0$$'
    } else {
      // using the fraction.js library will simplify the fraction 
      // (if necessary) and give us the latex formula
      answer = '$$' + fraction(y2-y1, x2-x1).toLatex() + '$$'
    }

    return {
      instructions: 'Calculate the slope between the two points shown on the graph.',
      answer,
      diagram: [
        'CoordinatePlane',
        {
          span: [-6,-6,6,6], // left, bottom, right, top; can also be a string, e.g. "-6,-6 6,6"
          height: '1.5in', // height on the page - you need to provide either height or width
          axis: true,  // whether to show the axis; default is true
          grid: true,  // whether to show the grid; default is true
          clip: false, // whether to clip elements on the graph to the grid (rather than grid+margins); default is true
        },
        [
          'Path', 
          {
            points: [[x1, y1], [x2, y2]], 
            style: 'dashed',  // make the path dashed rather than solid
            markers: '.-.',  // place a point mark at the two endpoints
          },
        ],
      ]
    }
  }
}


export class AnswerPrompt extends QGen {
  static info = {
    name: 'Answer Prompt',
    description: 'Generator with spot for answer'
  }

  static options = {
    singleColumn: true,
  }

  generate() {
    const rd = this.random

    // This question will also ask for slope, but without a graph
    // We'll generate it the same way as the last one
    let x1, x2, y1, y2
    while (x1 === x2 && y1 === y2) {
      x1 = rd.randint(-5,5)
      x2 = rd.randint(-5,5)
      y1 = rd.randint(-5,5)
      y2 = rd.randint(-5,5) 
    }

    const rise = y2 - y1
    const run = x2 - x1
    let answer = `rise: $$${rise}$$, run: $$${run}$$, slope: `
    if (run === 0) {
      answer += 'undefined'
    } else if (rise === 0) {
      answer += '$$0$$'
    } else {
      answer += '$$' + fraction(rise, run).toLatex() + '$$'
    }

    return {
      instructions: 'Calculate the slope between the two points:',
      question: `$$(${x1},${y1})$$ and $$(${x2},${y2})$$`,
      answer: {
        prompt: ['AnswerBlanks', 'rise = ', 'run = ', 'slope = '],
        correct: answer,
      }
    }
  }
}


export class PolynomialLibrary extends QGen {
	static info = {
		name: 'Factor Quadratic',
		description: 'Factor quadratic question using polynomial.js library'
  }
  
  static options = {
    singleColumn: true
  }

	generate() {
		const rd = this.random

		// generate two integers to be the roots of the quadratic:
		const a = rd.randint(-12,12)
		const b = rd.randint(-12,12)

		// first linear factor: x - a
		const lin1 = new Polynomial({
			1: 1, // coefficient of x^1
			0: -a, // coefficient of x^0 (constant term)
		})

		// second linear factor: x - b
		const lin2 = new Polynomial({1: 1, 0: -b})

		const quadratic = lin1.mul(lin2)

		return {
			instructions: 'Solve the quadratic equation:',
			question: `$$${quadratic.toLatex()} = 0$$`,
			answer: `$$x = ${a}, ${b}$$`,
		}
	}
}