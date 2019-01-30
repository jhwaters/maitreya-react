import React from 'react'
import { defaultsDeep } from 'lodash'
import { renderElement } from '../RenderElement'




const QuestionLayout = ({
  content, options={},
  layout=[[['instructions', 'question', 'answer'], 'diagram']], 
  direction='column',
  firstAreaFlag={found: false}
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
              layout={area} direction={newDirection} 
              firstAreaFlag={firstAreaFlag}
            />
          )
        } else {
          if (content[area]) {
            const classNames = ['question-area', `question-area-${area}`]
            if (!firstAreaFlag.found) {
              classNames.push('question-area-first')
              firstAreaFlag.found = true
            }
            return (
              <div key={area} className={classNames.join(' ')}>
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
  const {layout} = opts

  // Determine what to render in answer space
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
        if (typeof data.answer.prompt === 'string') {
          content.answer = {
            type: 'answerblanks',
            data: [data.answer.prompt],
          }
        } else if (Array.isArray(data.answer.prompt)) {
          content.answer = {
            type: 'answerblanks',
            data: data.answer.prompt,
          }
        } else {
          content.answer = data.answer.prompt
        }
      }
    } else {
      content.answer = {
        type: 'emptyspace',
        data: {height: '1cm', width: '2cm'}
      }
    }
  }
  return <QuestionLayout content={content} options={opts} layout={layout}/>
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
      if (Array.isArray(data.answer.correctIndex)) {
        return data.answer.correctIndex.map(i => letters[i]).join(', ')
      } else {
        return letters[data.answer.correctIndex]
      }
    }
  }
  if (data.answer !== undefined && data.answer !== null) {
    if (data.answer.correct) {
      return renderElement(data.answer.correct, options)
    }
    if (data.answer.type || typeof data.answer === 'string' || typeof data.answer === 'number') {
      return renderElement(data.answer, options)
    }
  }
  return null
}