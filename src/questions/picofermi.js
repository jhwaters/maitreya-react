import QGen from './QGen'



const scramble = function(str, digitmap, slotmap) {
  return slotmap.map(s => digitmap[+str[s]]).join('')
}

export class PicoFermiInstructions {

  static register() {
    return {
      name: 'Pico-fermi instructions',
      description: 'How to play pico-fermi'
    }
  }

  output() {
    return ['Text', null, [
      'In the game _Pico Fermi_, players try to guess a secret 4-digit number.',
      'Each of the digits can be from 0 to 9 (leading zeros are allowed,',
      "such as 0083). After each guess, players are given a hint. A _fermi_ (f)",
      'is given for each number in the guess that is in the correct position,',
      "and a _pico_ (p) is given for each number in the guess that is correct but",
      'in the wrong position. For example, if the secret number was 7751 and',
      "the guess was 1734, the player would be told _pico fermi_, because the",
      "1 was correct but in the wrong position (_pico_), and the 7 was both",
      "correct and in the correct position (_fermi_). Based on the number of",
      "_picos_ and _fermis_ received after each guess, a skilled player will soon",
      "narrow down the possibilities to the correct one.",
    ].join(' ')]
  }
}

export class PicoFermi extends QGen {
  static info = {
    name: 'Pico-fermi',
    description: 'A logic puzzle'
  }

  static options = {
    singleColumn: true,
  }

  generate(params) {
    const rd = this.random
    const template = Templates[rd.choice(Object.keys(Templates))]
    const slotmap = rd.shuffleRange(0,3)
    const digitmap = rd.shuffleRange(0,9)
    const answer = scramble(template.answer, digitmap, slotmap)
    const clues = rd.shuffle(Object.keys(template.clues)).map(c => [
      scramble(c, digitmap, slotmap), template.clues[c]
    ])

    const puzzle = [
      'Table', {align: 'r|l'},
      //['TRow', {header: true, align: 'rl'}, 'Guess', 'Clue'],
      ...clues.map((c, i) => (
        ['TRow', {border: false}, c[0], c[1]]
      ))
    ]

    const blank = ['EmptySpace', {width: '7mm', height: '7mm', border: 'bottom'}]
    const gap = ['EmptySpace', {width: '2mm'}]

    const instructions = [
      'The following '
    ].join(' ')

    return {
      instructions: 'The following game of _Pico Fermi_ has only one possible solution. What is it?',
      question: puzzle,
      answer: {
        correct: answer,
        prompt: [
          'Container', {direction: 'row'}, 
          blank, gap, blank, gap, blank, gap, blank
        ],
      },
      layout: ['instructions', 'question', 'diagram', 'answer'],
    }
    
  }
}

export class PicoFermiSet extends QGen {
  static info = {
    name: 'Pico-fermi set',
    description: 'A set of puzzles of similar difficulty'
  }

  generate(params) {
    const rd = this.random
    const template = Templates[rd.choice(Object.keys(Templates))]
    
    const versions = []
    const answers = []
    for (const i of [1,2,3,4,5,6,7,8,9,10]) {
      const slotmap = rd.shuffleRange(0,3)
      const digitmap = rd.shuffleRange(0,9)
      const clues = rd.shuffle(Object.keys(template.clues)).map(c => [
        scramble(c, digitmap, slotmap),
        template.clues[c]
      ])
      versions.push(clues)
      answers.push(scramble(template.answer, digitmap, slotmap))
    }
    
    const answer = answers.join(', ')

    const makeTable = clues => [
      'Table', {border: false, align: 'r|l'},
      ['TRow', {header: true, border: 'bottom'}, 'Guess', 'Clue'],
      ...clues.map((c, i) => (
        ['TRow', {align: 'r|l', border: false}, c[0], c[1]]
      ))
    ]
    
    const question = ['Container', {direction: 'row'}]
    for (const v of versions) {
      question.push(['EmptySpace', {width: '5mm'}])
      question.push(makeTable(v))
    }

    return ({
      instructions: [
        'These puzzles are equivalent, but the order of their clues have',
        'been scrambled and their digits have been remapped in order',
        'to make them appear different.'
      ].join(' '),
      question, 
      answer: {
        correct: answer,
        prompt: null,
      },
      layout: ['instructions', 'diagram', 'question', 'answer'],
    })
  }
}



const Templates = {
  Easy01: {
    "answer": "1295", 
    "clues": {
      "2637": "p", 
      "0018": "p", 
      "0123": "pp", 
      "1034": "f", 
      "3352": "pp"
    }
  },

  Easy02: {
    "answer": "6779", 
    "clues": {
      "5704": "f", 
      "5607": "pp", 
      "5109": "f", 
      "6972": "pff"
    }
  },
  

  Easy03: {
    "answer": "3276", 
    "clues": {
      "1670": "pf", 
      "4567": "pp", 
      "0123": "pp", 
      "1245": "f", 
      "1376": "pff"
    }
  },

  Easy04: {
    "answer": "5132", 
    "clues": {
      "4312": "ppf", 
      "6543": "pp", 
      "4129": "pf", 
      "4230": "pf"
    }
  },

  Easy05: {
    "answer": "3606", 
    "clues": {
      "0660": "ppf", 
      "0386": "ppf", 
      "2030": "pp"
    }
  },

  Easy06: {
    "answer": "3423", 
    "clues": {
      "3773": "ff", 
      "2790": "p", 
      "7243": "ppf", 
      "8467": "f"
    }
  },

  Easy07: {
    "answer": "5938", 
    "clues": {
      "5809": "ppf", 
      "3899": "ppp", 
      "7243": "p", 
      "5593": "ppf"
    }
  },

  Hard01: {
    "answer": "7225", 
    "clues": {
      "9120": "f", 
      "7573": "pf", 
      "2450": "pp", 
      "5320": "pf", 
      "8685": "f"
    }
  },

  Hard02: {
    "answer": "2664", 
    "clues": {
      "4567": "pf", 
      "3210": "p", 
      "5409": "p", 
      "4608": "pf", 
      "1064": "ff"
    }
  },

  Hard03: {
    "answer": "6974", 
    "clues": {
      "4989": "pf", 
      "2954": "ff", 
      "9724": "ppf", 
      "6139": "pf", 
      "7243": "pp"
    }
  },

  NoFour: {
    "answer": "2653", 
    "clues": {
      "4563": "ppf", 
      "4615": "pf", 
      "4652": "pff"
    }
  },

  NoEight: {
    "answer": "2497", 
    "clues": {
      "4786": "pp", 
      "8547": "pf", 
      "0843": "p", 
      "9289": "pp", 
      "8965": "p"
    }
  },

  AllPicos: {
    "answer": "0722", 
    "clues": {
      "2486": "p", 
      "7867": "p", 
      "4573": "p", 
      "5608": "p", 
      "9310": "p"
    }
  },

  VeryHard: {
    "answer": "7583", 
    "clues": {
      "9372": "pp", 
      "1047": "p", 
      "0235": "pp", 
      "3627": "pp", 
      "4753": "ppf"
    }
  }
}