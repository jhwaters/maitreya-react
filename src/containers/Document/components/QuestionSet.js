import React from 'react'
import QuestionHandler from '../QuestionHandler'

const QuestionSet = ({
  questions,
  startNumbering=1,
}) => {
  return (
    <div className='QuestionSet'>
      <ol start={startNumbering}>
        {questions.map((q, i) => <li key={`Q${i+startNumbering}`}><QuestionHandler question={q} /></li>)}
      </ol>
    </div>
  )
}

export default QuestionSet