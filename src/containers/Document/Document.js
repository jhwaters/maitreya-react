import React from 'react'

import { 
  AnswerKey,
  Heading,
  QuestionSet,
} from './components'


class Document extends React.Component {

  render() {
    const questions = this.props.order.map(i => this.props.questions[i])

    return (
      <div className="Document" >
        <div className="letter">
          <section className="sheet padding-10mm">
            <Heading />
            <QuestionSet questions={questions} startNumbering={this.props.settings.startNumbering}/>
          </section>
        </div>
        <div className="letter">
          <section className="sheet padding-10mm">
            <AnswerKey questions={questions} startNumbering={this.props.settings.startNumbering}/>
          </section>
        </div>
      </div>
    )
  }
}

export default Document