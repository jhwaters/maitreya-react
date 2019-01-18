import React from 'react'
import { connect } from 'react-redux'

import { 
  AnswerKey,
  Heading,
  QuestionSet,
} from './components'

class Document extends React.Component {
  constructor(props) {
    super(props)
    this.state = {scale: 1}
  }

  render() {
    const questions = this.props.order.map(i => this.props.questions[i])
    const sectionClass = `sheet padding-${this.props.settings.pageMargins}`

    return (
      <div className="Document" >
        <div className="letter">
          <section className={sectionClass}>
            <Heading />
            <QuestionSet questions={questions} startNumbering={this.props.settings.startNumbering}/>
          </section>
        </div>
        <div className="letter">
          <section className={sectionClass}>
            <AnswerKey questions={questions} startNumbering={this.props.settings.startNumbering}/>
          </section>
        </div>
      </div>
    )
  }
}


const mapStateToProps = state => ({
  questions: state.document.questions,
  order: state.document.order,
  settings: {...state.document.settings},
})

export default connect(mapStateToProps)(Document)
