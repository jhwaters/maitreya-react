import VectorGraphics from './VectorGraphics'
import { AnswerChoices, AnswerBlanks } from './AnswerSpace'
import { Container } from './Container'
import { EmptySpace } from './EmptySpace'
import { PageHeader } from './PageHeader'
import { Plain } from './Plain'
import { Question, NumberedQuestion, AnswerKey } from './Question'
import { RenderError } from './RenderError'
import { Table, TRow } from './Table'
import Text from './Text'
import { VegaLite } from './VegaLite'

const renderTypes = {
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

  AnswerChoices,
  Container, 
  Table, 
  TRow,
  ...VectorGraphics,
}

export default renderTypes
