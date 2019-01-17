import React from 'react'
import renderElement from '../../../renderMethods/renderElement'

const renderAnswer = (question) => {
  const options = question.options || {}
  const generated = question.generated || {}
  let answer = 'no answer provided'
  if (generated.choices) {
    if (generated.choices.answerIndex !== undefined) {
      if (Array.isArray(generated.choices.answerIndex)) {
        answer = generated.choices.answerIndex.map(i => 'abcdef'[i]).join(', ')
      } else {
        answer = 'abcde'[generated.choices.answerIndex]
      }
    } else if (generated.answer) {
      answer = generated.answer
    }
  } else {
    if (generated.answer) {
      answer = generated.answer
    }
  }
  return renderElement(answer, options)
}

const AnswerKey  = ({
  questions,
  startNumbering=1,
}) => {
  return (
    <div className='AnswerKey'>
      <h4>Answer Key</h4>
      <ol start={startNumbering}>
        {questions.map((q, i) => <li key={`A${i+startNumbering}`}>{renderAnswer(q)}</li>)}
      </ol>
    </div>
  )
}

export default AnswerKey