import React from 'react'
import DefaultEditor from './DefaultEditor'
import { RenderJson, parseJson } from '..'
import { determineVariant } from '../renderTypes/Question'

const variantNames = {
  freeResponse: 'free response',
  multipleChoice: 'multiple choice',
}

function parseAndSetVariant(data) {
  const {type, props={}} = parseJson(data)
  const {content={}, options={}} = props
  if (!options.variant) {
    options.variant = determineVariant(content)
  }
  if (!options.variants) {
    if (content.answer && content.answer.choices) {
      options.variants = ['multipleChoice', 'freeResponse']
    } else {
      options.variants = ['freeResponse']
    }
  }
  return {type, content, options}
}

export default class Question extends DefaultEditor {
  constructor(props) {
    super(props)
    this.state = parseAndSetVariant(props.json)
  }

  stateToJson() {
    return [this.state.type, {content: this.state.content, options: this.state.options}]
  }

  revertChanges = () => {
    const newState = parseAndSetVariant(this.props.json)
    this.setState(newState)
  }

  updateVariant = evt => {
    this.setState({options: {...this.state.options, variant: evt.target.value}})
  }

  updateContent(k, v, variant) {
    if (variant) {
      const variants = this.state.variants || {}
      const updated = variants[variant] || {}
      if (v === '') {
        delete updated[k]
      } else {
        updated[k] = v
      }
      variants[variant] = updated
      this.setState({
        content: {
          ...this.state.content, 
          variants,
        }
      })
    } else {
      this.setState({
        content: {
          ...this.state.content,
          [k]: v
        }
      })
    }
  }

  updateInstructions = evt => this.updateContent('instructions', evt.target.value)
  updateInstructionsMC = evt => this.updateContent('instructions', evt.target.value, 'multipleChoice')
  updateInstructionsFR = evt => this.updateContent('instructions', evt.target.value, 'freeResponse')

  updateQuestion = evt => this.updateContent('question', evt.target.value)
  updateQuestionMC = evt => this.updateContent('question', evt.target.value, 'multipleChoice')
  updateQuestionFR = evt => this.updateContent('question', evt.target.value, 'freeResponse')

  renderInstructionsOrQuestionInputs(fieldname) {
    const isMC = this.state.options.isMultipleChoice
    const overrides = (this.state.content.variants || {})[this.state.options.variant] || {}
    const updaters = {
      instructions: {
        default: this.updateInstructions,
        multipleChoice: this.updateInstructionsMC,
        freeResponse: this.updateInstructionsFR,
      },
      question: {
        default: this.updateQuestion,
        multipleChoice: this.updateQuestionMC,
        freeResponse: this.updateQuestionFR,
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
        <textarea value={overrides[fieldname] || ''} 
          onChange={updaters[this.state.options.variant]}
          cols="40"
          rows="4"
          placeholder={this.state.content[fieldname]}
        />
      </td>
      </>
    )
  }


  renderDiagram() {
    return null
  }

  renderVariantSelect() {
    return (
      <>
        Variant:
        <select value={this.state.options.variant}
          onChange={this.updateVariant}
        >
          {this.state.options.variants.map(v => (
            <option key={v} value={v}>{variantNames[v]}</option>
          ))}
        </select>
      </>
    )
  }

  renderEditor() {
    return (
      <div>
        <table>
          <tbody>
            <tr>
              <td></td>
              <td style={{textAlign: 'center'}}>Default</td>
              <td style={{textAlign: 'center'}}>{this.renderVariantSelect()}</td>
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