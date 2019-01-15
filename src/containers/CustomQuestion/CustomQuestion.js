import React from 'react'
import renderElement from '../../renderMethods/renderElement'


class CustomQuestion extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      inputType: 'manual',
      preview: {
        instructions: '',
        question: '',
        answer: '',
      }
    }
    this.jsonInput = React.createRef()
    this.inputType = React.createRef()
    this.inputs = {
      instructions: React.createRef(),
      question: React.createRef(),
      answer: React.createRef(),
    }
  }

  updatePreview(fieldname) {
    const newpreview = {...this.state.preview, [fieldname]: this.inputs[fieldname].current.value}
    this.setState({preview: newpreview})
  }

  updateInstructions = () => this.updatePreview('instructions')
  updateQuestion = () => this.updatePreview('question')
  updateAnswer = () => this.updatePreview('answer')

  getInput() {
    switch(this.state.inputType) {
      case 'json':
        return JSON.parse(this.jsonInput.current.value)
      case 'manual':
        const inputs = {
          instructions: this.inputs.instructions.current.value,
          question: this.inputs.question.current.value,
          answer: this.inputs.answer.current.value,
        }
        let generated = {}
        for (const k in inputs) {
          if (inputs[k]) {
            generated[k] = inputs[k]
          }
        }
        return {generated: generated}
      default:
        return {generated: {}}
    }
  }

  addQuestion = () => {
    this.props.addQuestion(this.getInput())
    this.props.onRequestClose()
  }

  previewQuestion = () => {
    const data = this.getInput().generated
    console.log(data)
    this.setState({preview: data})
  }

  updateInputType = () => this.setState({
    inputType: this.inputType.current.value,
    preview: {instructions: '', question: '', answer: ''},
  })

  render() {
    const inputStyle = {width:'20rem'}
    return (
      <>
        <select ref={this.inputType} onChange={this.updateInputType}>
          <option value="manual">Manual</option>
          <option value='json'>JSON</option>
        </select>
        {this.state.inputType === 'manual'
          ? (
            <>
            <div style={{marginTop: '1rem'}}>
              Instructions: <br/>
              <textarea 
                ref={this.inputs.instructions} 
                style={inputStyle}
                onChange={this.updateInstructions}
                ></textarea>
              <span style={{marginLeft: '1rem', fontFamily: 'var(--docFontFamily, serif)'}}>{renderElement(this.state.preview.instructions)}</span>
              <br />
              Question: <br/>
              <textarea 
                ref={this.inputs.question} 
                onChange={this.updateQuestion}
                style={inputStyle}
              ></textarea>
              <span style={{marginLeft: '1rem', fontFamily: 'var(--docFontFamily, serif)'}}>{renderElement(this.state.preview.question)}</span>
              <br/>
              Answer: <br/>
              <textarea 
                ref={this.inputs.answer} 
                style={inputStyle}
                onChange={this.updateAnswer}
                ></textarea>
              <span style={{marginLeft: '1rem', fontFamily: 'var(--docFontFamily, serif)'}}>{renderElement(this.state.preview.answer)}</span>
            </div>
            <br />
            <button onClick={this.addQuestion}>Add to Assignment</button>
            </>
          )
          : (
            <>
              <p>Enter JSON</p>
              <textarea ref={this.jsonInput} style={{width:'30rem', height: '10rem'}}></textarea>
              <br />
              <button onClick={this.addQuestion}>Add to Assignment</button>
            </>
          )
        }
      </>
    )
  }
}

export default CustomQuestion