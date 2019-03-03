import React from 'react'
import { renderJson } from '..'


const defaultLayout = ['instructions', 'question', ['answer', 'diagram']]
//const defaultLayout = [[['instructions', 'question', 'answer'], 'diagram']]
const layoutAnswerRight = ['instructions', 'question', ['diagram', 'answer']]

const QuestionLayout = ({
  content,
  layout,
  direction='column',
}={}) => {

  const className = `question-layout question-layout-${direction}`
  const newDirection = {row: 'column', column: 'row'}[direction]
  //const useLayout = layout || defaultLayout
  const useLayout = layout || (content.answer && content.answer[0] === 'EmptySpace' ? layoutAnswerRight : defaultLayout)

  return (
    <div className={className}>
      {useLayout.map((area, i) => {
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


function parseAnswer(answer) {
  if (answer) {
    if (answer.constructor.name === 'Object') {
      return answer
    } else {
      return {correct: answer}
    }
  }
}

export function determineVariant(content={}, options={}) {
  if (options.variant) {
    return options.variant
  }
  if (content.answer && content.answer.choices) {
    return 'multipleChoice'
  }
  if (content.variants && content.variants.multipleChoice) {
    return 'multipleChoice'
  }
  return 'freeResponse'
}

function determineAnswerSpace(answer, variant) {
  if (answer) {
    if (variant === 'multipleChoice' && answer.choices) {
      const listDirection = answer.listDirection
      return ['AnswerChoices', {listDirection}, ...answer.choices]
    } else if (answer.prompt !== undefined) {
      if (answer.prompt === null) {
        return null
      }
      if (typeof answer.prompt === 'string') {
        return ['AnswerBlanks', null, answer.prompt]
      } else if (Array.isArray(answer.prompt)) {
        return answer.prompt
      }
    }
  }
  return ['EmptySpace', {width: '1cm', height: '1cm'}]
}

function determineContent(content, variant) {
  const {variants, ...othercontent} = content
  const usecontent = Object.assign({}, othercontent)
  if (variants) {
    const variantContent = variants[variant]
    Object.assign(usecontent, variantContent)
  }
  return {
    ...usecontent,
    answer: determineAnswerSpace(parseAnswer(usecontent.answer), variant)
  }
}

function determineAnswerKey(answer={}, variant='freeResponse', letters='abcdef') {
  if (answer) {
    if (variant === 'multipleChoice') {
      if (answer.correctIndex !== undefined) {
        if (Array.isArray(answer.correctIndex)) {
          return answer.correctIndex.map(i => letters[i]).join(', ')
        } else {
          return letters[answer.correctIndex]
        }
      }
      if (answer.correct !== undefined) {
        for (let i = 0; i < answer.choices.length; i++) {
          if (answer.choices[i] == answer.correct) {
            return letters[i]
          }
        }
      }
    }
    if (answer !== null) {
      if (answer.correct) {
        return answer.correct
      }
      if (Array.isArray(answer) ||  typeof answer === 'string' || typeof answer === 'number') {
        return answer
      }
    }
    if (answer.choices && answer.correctIndex !== undefined) {
      return answer.choices[answer.correctIndex]
    }
  }
}


export const Question = (props) => {
  const options = props.options || {}
  const variant = determineVariant(props.content, props.options)
  const content = determineContent(props.content, variant)

  const layout = content.layout || options.layout
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
  const { options } = props
  const variant = determineVariant(props.content, options)
  const answer = determineAnswerKey(props.content.answer, variant, letters)
  return renderJson(answer)
}
