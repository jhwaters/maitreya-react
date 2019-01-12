import React from 'react'
import renderElement from '../../../renderMethods/renderElement'
import styles from './styles.module.css'


const renderAnswer = (question) => {
  const options = question.options || {}
  const generated = question.generated || {}
  let answer = 'no answer provided'
  if (generated.choices) {
    if (generated.answerIndex !== undefined) {
      answer = 'abcde'[generated.answerIndex]
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
  options={},
}) => {

  const startNumbering = options.startNumbering || 1
  return (
    <div className={styles.AnswerKey}>
      <h4>Answer Key</h4>
      <ol>
        {questions.map((q, i) => <li key={`A${i+startNumbering}`}>{renderAnswer(q)}</li>)}
      </ol>
    </div>
  )
}

export default AnswerKey