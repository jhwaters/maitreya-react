import React from 'react'
import DefaultEditor from './DefaultEditor'
import { renderElement } from '..'
import styles from './styles.module.css'

function checkMC(data, options) {
  if (options.isMultipleChoice === undefined) {
    if (data.answer && data.answer.choices) {
      return true
    } else {
      return false
    }
  } else {
    return options.isMultipleChoice
  }
}


export default class Question extends DefaultEditor {
  constructor(props) {
    super(props)
    this.state.options.isMultipleChoice = checkMC(this.state.data, this.state.options)
  }

  revertChanges = () => {
    const newState = ({
      type: this.props.element.type,
      data: this.props.element.data || {},
      options: this.props.element.options || {},
    })
    newState.options.isMultipleChoice = checkMC(newState.data, newState.options)
    this.setState(newState)
  }

  toggleMC = evt => {
    this.isMC = evt.target.checked
    this.setState({options: {...this.state.options, isMultipleChoice: evt.target.checked}})
  }

  updateVersionDefault(k, v) {
    this.setState({data: {...this.state.data, [k]: v}})
  } 
  updateVersionMC(k, v) {
    const multipleChoice = {...this.state.data.multipleChoice}
    if (v === '') {
      delete multipleChoice[k]
    } else {
      multipleChoice[k] = v
    }
    this.setState({data: {...this.state.data, multipleChoice}})
  }
  updateVersionFR(k, v) {
    const freeResponse = {...this.state.data.freeResponse}
    if (v === '') {
      delete freeResponse[k]
    } else {
      freeResponse[k] = v
    }
    this.setState({data: {...this.state.data, freeResponse}})
  }

  updateInstructions = evt => this.updateVersionDefault('instructions', evt.target.value)
  updateInstructionsMC = evt => this.updateVersionMC('instructions', evt.target.value)
  updateInstructionsFR = evt => this.updateVersionFR('instructions', evt.target.value)

  updateQuestion = evt => this.updateVersionDefault('question', evt.target.value)
  updateQuestionMC = evt => this.updateVersionMC('question', evt.target.value)
  updateQuestionFR = evt => this.updateVersionFR('question', evt.target.value)

  renderInstructionsOrQuestionInputs(fieldname) {
    const isMC = this.state.options.isMultipleChoice
    const overrides = isMC ? this.state.data.multipleChoice || {} : this.state.data.freeResponse || {}
    const updaters = {
      instructions: {
        default: this.updateInstructions,
        mc: this.updateInstructionsMC,
        fr: this.updateInstructionsFR,
      },
      question: {
        default: this.updateQuestion,
        mc: this.updateQuestionMC,
        fr: this.updateQuestionFR,
      }
    }[fieldname]
    return (
      <>
      <td>
        <textarea value={this.state.data[fieldname]} 
          onChange={updaters.default}
          cols="40"
          rows="4"
        />
      </td>
      <td>
        {isMC ? (
          <textarea value={overrides[fieldname] || ''} 
            onChange={updaters.mc}
            cols="40"
            rows="4"
          />
        ) : (
          <textarea value={overrides[fieldname] || ''} 
            onChange={updaters.fr}
            cols="40"
            rows="4"
          />
        )}
      </td>
      </>
    )
  }


  renderDiagram() {
    return null
  }

  renderMCToggle() {
    if (this.state.data.answer && this.state.data.answer.choices) {
      return (
        <>
          Multiple Choice:
          <input type="checkbox" 
            checked={this.state.options.isMultipleChoice}
            onChange={this.toggleMC}
          />
        </>
      )
    }
    return null
  }

  renderEditor() {
    const isMC = this.state.options.isMultipleChoice
    const data = this.state.data

    return (
      <div>
        {this.renderMCToggle()}
        <table>
          <tbody>
            <tr>
              <td></td>
              <td style={{textAlign: 'center'}}>Default</td>
              <td style={{textAlign: 'center'}}>{isMC ? 'Multiple Choice' : 'Free Response'} Version</td>
            </tr>
            <tr>
              <td>Instructions</td>
              {this.renderInstructionsOrQuestionInputs('instructions')}
            </tr>
            <tr>
              <td>Question</td>
              {this.renderInstructionsOrQuestionInputs('question')}
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  renderPreview() {

    return (
      <>
      {super.renderPreview()}
      <div className='document' style={{
        padding: '5mm', 
        margin: '0 5mm 5mm 5mm ', 
        border: '1px solid grey', 
        backgroundColor: 'white',
        overflow: 'clip',
        fontSize: '1em',
      }}>
        {renderElement({...this.state, type: 'answerkey'})}
      </div>
      </>
    )
  }

}