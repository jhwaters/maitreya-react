import React from 'react'
import { defaultsDeep } from 'lodash'
import { renderElement } from '../RenderElement'




const QuestionLayout = ({
  content, options={},
  layout=[['instructions', 'question', 'answer'], 'diagram'], 
  direction='row'
}={}) => {

  const className = `question-layout question-layout-${direction}`
  const newDirection = {row: 'column', column: 'row'}[direction]

  return (
    <div className={className}>
      {layout.map((area, i) => {
        if (Array.isArray(area)) {
          return (
            <QuestionLayout key={`region-${i}`} 
            content={content} options={options}
            layout={area} direction={newDirection} />
          )
        } else {
          if (content[area]) {
            return (
              <div key={area} className={`question-area question-area-${area}`}>
                {renderElement(content[area], options)}
              </div>
            )
          }
        }
        return null
      })}
    </div>
  )
}


function isMultipleChoice(data, options={}) {
  if (options.isMultipleChoice !== undefined) {
    return options.isMultipleChoice
  }
  if (data.answer && typeof data.answer !== 'string') {
    if (data.answer.choices) {
      return true
    }
  }
  return false
}


export const Question = ({data, options={}}) => {
  const opts = defaultsDeep({}, data._options || {}, options)
  let {instructions, question, diagram} = data
  const content = {instructions, question, diagram}
  if (isMultipleChoice(data, opts)) {
    Object.assign(content, data.multipleChoice)
    content.answer = {
      type: 'answerchoices',
      data: data.answer.choices,
    }
  } else {
    Object.assign(content, data.freeResponse)
    if (data.answer && data.answer.prompt !== undefined) {
      if (data.answer.prompt !== null) {
        content.answer = {
          type: 'answerblanks',
          data: typeof data.answer.prompt === 'string' ? [data.answer.prompt] : data.answer.prompt
        }
      }
    } else {
      if (data.answer !== null) {
        content.answer = {
          type: 'answerblanks',
          data: [({})],
        }
      }
    }
  }
  return <QuestionLayout content={content} options={opts}/>
}


export const NumberedQuestion = ({data, options}) => {
  return (
    <div className='question-wrapper'>
      <Question data={data} options={options} />
    </div>
  )
}

export const AnswerKey = ({data, options={}}) => {
  const letters = 'abcdefg'
  if (isMultipleChoice(data, options)) {
    if (data.answer.choices && data.answer.correctIndex !== undefined) {
      return letters[data.answer.correctIndex]
    }
  }
  if (data.answer !== undefined && data.answer !== null) {
    if (data.answer.correct) {
      return renderElement(data.answer.correct, options)
    }
    if (data.answer.type || typeof data.answer === 'string') {
      return renderElement(data.answer, options)
    }
  }
  return null
}