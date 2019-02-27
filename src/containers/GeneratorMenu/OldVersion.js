import React from 'react'
import { connect } from 'react-redux'
import { addToDocument } from '../../actions/document'
import questionBank from './questionbank'

const sortfunc = (a, b) => {
  const A = a.toUpperCase(), B = b.toUpperCase()
  if (A > B) return 1
  if (A < B) return -1
  return 0
}


class QuestionTypeMenu extends React.Component {
  static defaultProps = {
    questionTypes: questionBank,
  }

  constructor(props) {
    super(props)
    this.questionTypeSelect = React.createRef()
  }

  addToDoc = (elem) => {
    this.props.addToDocument(elem)
  }

  generateAndAdd = () => {
    const questionType = this.questionTypeSelect.current.value
    if (questionType !== '__NONE__') {
      console.log(`Generating ${questionType}`)
      try {
        const qtype = this.props.questionTypes[questionType]
        const question = new qtype()
        this.addToDoc(question.output())
      } catch(e) {
        console.log('failed')
        console.log(e)
      }
    }
  }

  renderQuestionList() {
    return Object.keys(this.props.questionTypes).sort(sortfunc).map(k => {
      const register = this.props.questionTypes[k].register()
      return (
        <option key={`qtype${k}`} 
          title={register.description}
          value={k} >
          {k}
        </option>
      )
    })
  }

  render() {
    return (
      <>
      <select ref={this.questionTypeSelect} defaultValue="__NONE__">
        <option value='__NONE__' disabled>Question Type</option>
        <option value='__NONE__' disabled>-------</option>
        {this.renderQuestionList()}
      </select>
      <button onClick={this.generateAndAdd}>Add</button>
      </>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  addToDocument: q => dispatch(addToDocument(q)),
})

export default connect(null, mapDispatchToProps)(QuestionTypeMenu)