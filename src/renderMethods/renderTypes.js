import {
  Graph,
  Html,
  Markdown,
  Text,
  Vega,
  VegaLite
} from './primaryTypes'

import {
  Answer,
  AnswerChoices,
  Header,
  JsonML,
  List,
  NumberedQuestion,
  Question,
} from './secondaryTypes'

export const renderTypes = {
  answer: Answer,
  answerchoices: AnswerChoices,
  //'answer-choices': AnswerChoices,
  graph: Graph,
  header: Header,
  html: Html,
  jsonml: JsonML,
  list: List,
  markdown: Markdown,
  'question-nonumber': Question,
  question: NumberedQuestion,
  text: Text,
  vega: Vega,
  'vega-lite': VegaLite,
}


// If type is undefined:
export const detectType = function(elem) {
  if (Array.isArray(elem)) return 'list'
  if (typeof elem === 'string') return 'text'
  if (typeof elem === 'number') return 'text'
}

export default renderTypes
