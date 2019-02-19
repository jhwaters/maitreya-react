import React from 'react'
import { renderJson } from '..'


const QuestionLayout = ({
  content,
  //layout=[[['instructions', 'question', 'answer'], 'diagram']], 
  layout = ['instructions', 'question', ['answer', 'diagram']],
  direction='column',
}={}) => {

  const className = `question-layout question-layout-${direction}`
  const newDirection = {row: 'column', column: 'row'}[direction]

  return (
    <div className={className}>
      {layout.map((area, i) => {
        if (Array.isArray(area)) {
          return (
            <QuestionLayout key={`region-${i}`} 
              content={content}
              layout={area} 
              direction={newDirection} 
            />
          )
        } else {
          if (content[area]) {
            const classNames = ['question-area', `question-area-${area}`]
            return (
              <div key={area} className={classNames.join(' ')}>
                {renderJson(content[area])}
              </div>
            )
          }
        }
        return null
      })}
    </div>
  )
}


function isMultipleChoice(content, options={}) {
  if (options.isMultipleChoice !== undefined) {
    return options.isMultipleChoice
  }
  if (content.answer && typeof content.answer !== 'string') {
    if (content.answer.choices) {
      return true
    }
  }
  return false
}


export const Question = (props) => {
  const { options={} } = props
  
  const {instructions, question, diagram} = props.content
  let content = { instructions, question, diagram }
  const layout = props.content.layout || options.layout

  // Determine what to render in answer space
  if (isMultipleChoice(props.content, options)) {
    Object.assign(content, props.content.multipleChoice)
    const listDirection = props.content.answer.listDirection
    content.answer = ['AnswerChoices', {listDirection}, ...props.content.answer.choices]
  } else {
    Object.assign(content, props.content.freeResponse)
    if (props.content.answer && props.content.answer.prompt !== undefined) {
      if (props.content.answer.prompt !== null) {
        if (typeof props.content.answer.prompt === 'string') {
          content.answer = ['AnswerBlanks', null, props.content.answer.prompt]
        } else if (Array.isArray(props.content.answer.prompt)) {
          content.answer = props.content.answer.prompt
        }
      }
    } else {
      content.answer = ['EmptySpace', {height: '1cm', width: '2cm'}]
    }
  }
  return (
    <div className='question-wrapper'>
      <QuestionLayout content={content} layout={layout}/>
    </div>
  )
}


export const NumberedQuestion = props => {
  return (
    <div className='question-number'>
      <Question {...props} />
    </div>
  )
}


export const AnswerKey = props => {
  const letters = 'abcdefg'
  const { content, options } = props
  if (isMultipleChoice(content, options)) {
    if (content.answer.choices) {
      if (content.answer.correctIndex !== undefined) {
        if (Array.isArray(content.answer.correctIndex)) {
          return content.answer.correctIndex.map(i => letters[i]).join(', ')
        } else {
          return letters[content.answer.correctIndex]
        }
      }
      if (content.answer.correct) {
        for (let i = 0; i < content.answer.choices.length; i++) {
          if (content.answer.choices[i] == content.answer.correct) {
            return letters[i]
          }
        }
      }
    }
  }
  if (content.answer !== undefined) {
    if (content.answer !== null) {
      if (content.answer.correct) {
        return renderJson(content.answer.correct)
      }
      if (Array.isArray(content.answer) ||  typeof content.answer === 'string' || typeof content.answer === 'number') {
        return renderJson(content.answer, options)
      }
    }
    if (content.answer.choices && content.answer.correctIndex !== undefined) {
      return renderJson(content.answer.choices[content.answer.correctIndex])
    }
  }
  return null
}
