import ABVG from './VectorGraphics/index'
import { AnswerChoices, AnswerBlanks } from './AnswerSpace'
import { Container } from './Container'
import { EmptySpace } from './EmptySpace'
import { PageHeader } from './PageHeader'
import { Plain } from './Plain'
import { Question, NumberedQuestion, AnswerKey } from './Question'
import { RenderError } from './RenderError'
import { Table, TRow } from './Table'
import { Text } from './Text'
import { VegaLite } from './VegaLite'

const Terminal = {
  ABVG,
  AnswerBlanks,
  AnswerKey,
  EmptySpace, 
  PageHeader,
  NumberedQuestion,
  Plain, 
  Question, 
  RenderError,
  Text,
  VegaLite,
}

const NonTerminal = {
  AnswerChoices,
  Container, 
  Table, 
  TRow
}

export { NonTerminal, Terminal}