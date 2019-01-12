import React from 'react'

import { 
  AnswerKey,
  Heading,
  QuestionSet 
} from './components'

import './papercss.global.css'
import './customize.global.css'


class Document extends React.Component {

  render() {
    const questions = this.props.order.map(i => this.props.questions[i])

    return (
      <div id="document">
        <div className="letter">
          <section className="sheet padding-10mm">
            <Heading />
            <QuestionSet questions={questions} />
          </section>
        </div>
        <div className="letter">
          <section className="sheet padding-10mm">
            <AnswerKey questions={questions} />
          </section>
        </div>
      </div>
    )
  }
}

export default Document