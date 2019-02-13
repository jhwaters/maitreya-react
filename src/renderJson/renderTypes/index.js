import VectorGraphics from './VectorGraphics'
import { AnswerChoices, AnswerBlanks } from './AnswerSpace'
import { Container } from './Container'
import { EmptySpace } from './EmptySpace'
import { Markdown, InlineMarkdown } from './Markdown'
import { Math, DisplayMath } from './Math'
import { List } from './List'
import { PageHeader } from './PageHeader'
import { Question, NumberedQuestion, AnswerKey } from './Question'
import { RenderError } from './RenderError'
import { Table, TRow } from './Table'
import { Text, Plain } from './Text'
import { VegaLite } from './VegaLite'

// nonTerminal types will have their children rendered with renderJson
const nonTerminal = {
  AnswerBlanks,
  AnswerChoices,
  Container, 
  List,
  Table, 
  TRow,
  ...VectorGraphics,
}



/* terminal types are responsible for rendering their own children
 * children are joined (by newlines) into a single string and passed 
 * as the 'data' prop, e.g.
 * 
 * ['Math', '\\frac{2}{3}', '\\sqrt{3}'] => <Math data={"\\frac{2}{3}\n\\sqrt{3}"}/>
 * 
 */
const terminal = {
  Plain, 
  Text, 
  Math, 
  DisplayMath, 
  Markdown, 
  InlineMarkdown,
}



// childless types will ignore children
// many of these will be tweaked to become nonTerminal or terminal
const childless = {
  AnswerKey,
  EmptySpace, 
  PageHeader,
  NumberedQuestion,
  Plain, 
  Question, 
  RenderError,
  VegaLite,
}

export {nonTerminal, terminal, childless}