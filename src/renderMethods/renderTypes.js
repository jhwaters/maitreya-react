import {
  Html,
  Markdown,
  Text,
  VectorGraphic,
  Vega,
  VegaLite
} from './primaryTypes'

import {
  AnswerBlanks,
  AnswerChoices,
  AnswerKey,
  Header,
  JsonML,
  List,
  NumberedQuestion,
  Question,
} from './secondaryTypes'

export const renderTypes = {
  answerkey: AnswerKey,
  answerblanks: AnswerBlanks,
  answerchoices: AnswerChoices,
  //'answer-choices': AnswerChoices,
  header: Header,
  html: Html,
  jsonml: JsonML,
  list: List,
  markdown: Markdown,
  'question-nonumber': Question,
  question: NumberedQuestion,
  text: Text,
  vectorgraphic: VectorGraphic,
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
