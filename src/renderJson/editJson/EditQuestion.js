import React from 'react'
import DefaultEditor from './DefaultEditor'
import { RenderJson, parseJson } from '..'

function checkMC(content, options={}) {
  if (options.isMultipleChoice === undefined) {
    if (content.answer && content.answer.choices) {
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
    const parsed = parseJson(props.json)
    this.state = {
      type: parsed.type,
      content: parsed.props.content || {},
      options: parsed.props.options || {},
    }
    this.state.options.isMultipleChoice = checkMC(this.state.content, this.state.options)
  }

  stateToJson() {
    return [this.state.type, {content: this.state.content, options: this.state.options}]
  }

  revertChanges = () => {
    const newState = ({
      content: this.state.content || {},
      options: this.state.options || {},
    })
    newState.options.isMultipleChoice = checkMC(newState.content, newState.options)
    this.setState(newState)
  }

  toggleMC = evt => {
    //this.isMC = evt.target.checked
    this.setState({
      options: {...this.state.options, isMultipleChoice: evt.target.checked}
    })
  }

  updateVersionDefault(k, v) {
    this.setState({content: {...this.state.content, [k]: v}})
  } 
  updateVersionMC(k, v) {
    const multipleChoice = {...this.state.content.multipleChoice}
    if (v === '') {
      delete multipleChoice[k]
    } else {
      multipleChoice[k] = v
    }
    this.setState({content: {...this.state.content, multipleChoice}})
  }
  updateVersionFR(k, v) {
    const freeResponse = {...this.state.content.freeResponse}
    if (v === '') {
      delete freeResponse[k]
    } else {
      freeResponse[k] = v
    }
    this.setState({content: {...this.state.content, freeResponse}})
  }

  updateInstructions = evt => this.updateVersionDefault('instructions', evt.target.value)
  updateInstructionsMC = evt => this.updateVersionMC('instructions', evt.target.value)
  updateInstructionsFR = evt => this.updateVersionFR('instructions', evt.target.value)

  updateQuestion = evt => this.updateVersionDefault('question', evt.target.value)
  updateQuestionMC = evt => this.updateVersionMC('question', evt.target.value)
  updateQuestionFR = evt => this.updateVersionFR('question', evt.target.value)

  renderInstructionsOrQuestionInputs(fieldname) {
    const isMC = this.state.options.isMultipleChoice
    const overrides = isMC ? this.state.content.multipleChoice || {} : this.state.content.freeResponse || {}
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
        <textarea value={this.state.content[fieldname]} 
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
    if (this.state.content.answer && this.state.content.answer.choices) {
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
    //const content = this.state.content

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
    const json = this.stateToJson().slice(1)
    return (
      <>
      <div className='document preview-area' style={{margin: '3mm 1mm'}}>
        <RenderJson json={['Question', ...json]} />
      </div>
      <div className='document preview-area' style={{margin: '3mm 1mm'}}>
        <RenderJson json={['AnswerKey', ...json]} />
      </div>
      </>
    )
  }

}