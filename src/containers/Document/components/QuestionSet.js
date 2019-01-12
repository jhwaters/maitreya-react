import React from 'react'
import QuestionHandler from '../QuestionHandler'
import styles from './styles.module.css'

const QuestionSet = ({
  questions,
  options={},
}) => {
  const startNumbering = options.startNumbering || 1
  return (
    <div className={styles.QuestionSet}>
      <ol>
        {questions.map((q, i) => <li key={`Q${i+startNumbering}`}><QuestionHandler question={q} /></li>)}
      </ol>
    </div>
  )
}

export default QuestionSet