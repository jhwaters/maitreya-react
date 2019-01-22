import React from 'react'
import { connect } from 'react-redux'
import { RenderElement } from '../../renderMethods'
import { addToDocument } from '../../actions/document'
import LatexExamples from './LatexExamples'
import ReactModal from 'react-modal'

const tabsize = 2;

function onKeyDown(evt) {
  if (evt.keyCode === 9) { // handle tab
    let target = evt.target;
    const start = target.selectionStart;
    const end = target.selectionEnd;
    const value = target.value;
    target.value = value.substring(0,start) + Array(tabsize).fill(' ').join('') + value.substring(end);
    target.selectionStart = start + tabsize;
    target.selectionEnd = end + tabsize;
    evt.preventDefault();
  } else if (evt.keyCode === 8) { // handle backspace
    let target = evt.target;
    const start = target.selectionStart;
    if (start === target.selectionEnd) {
      const value = target.value;
      if (value.substring(start-tabsize, start) === Array(tabsize).fill(' ').join('')) {
        target.value = value.substring(0,start-tabsize) + value.substring(start);
        target.selectionStart = start - tabsize;
        target.selectionEnd = start - tabsize;
        evt.preventDefault();
      }
    }
  }
}


class CustomQuestion extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      inputType: 'manual',
      instructions: '',
      question: '',
      _answer: '',
      json: '',
      modal: 'none',
    }
    this.inputType = React.createRef()
    this.instructions = React.createRef()
    this.question = React.createRef()
    this.answer = React.createRef()
    this.json = React.createRef()
  }

  openExamples = () => this.setState({ modal: 'examples' })
  closeModal = () => this.setState({ modal: 'none' })

  updateInputType = () => {
    const inputType = this.inputType.current.value
    const data = this.getDataFromState()
    if (data) {
      if (inputType === 'json') {
        const json = JSON.stringify(data,null,2)
        if (json.length <= 2) {
          this.setState({inputType, json: ''})
        } else {
          this.setState({inputType, json})
        }
      } else {
        const newstate = {}
        for (const k of ['instructions', 'question', '_answer']) {
          if (data[k]) {
            if (typeof data[k] === 'string') newstate[k] = data[k];
            else if (data[k].type === 'text') newstate[k] = data[k].data;
            else newstate[k] = '';
          } else {
            newstate[k] = '';
          }
        }
        this.setState({ inputType, ...newstate })
      }
    } else {
      this.setState({inputType})
    }
  }
  updateInstructions = () => {
    const instructions = this.instructions.current.value
    this.setState({ instructions })
  }
  updateQuestion = () => {
    const question = this.question.current.value
    this.setState({ question })
  }
  updateAnswer = () => {
    const answer = this.answer.current.value
    this.setState({ _answer: answer })
  }
  updateJSON = () => {
    const json = this.json.current.value
    if (json) this.setState({ json })
  }

  getDataFromState() {
    if (this.state.inputType === 'manual') {
      let data = {}
      for (const k of ['instructions', 'question', '_answer']) {
        if (this.state[k]) {
          data[k] = this.state[k]
        }
      }
      return data
    } else if (this.state.inputType === 'json') {
      try {
        const data = JSON.parse(this.state.json)
        return data
      } catch(e) {
      }
    }
  }

  addQuestion = () => {
    const data = this.getDataFromState()
    this.props.addToDocument({type: 'question', data})
    this.props.onRequestClose()
  }

  renderInputs() {
    if (this.state.inputType === 'manual') {
      const inputStyle = {width:'30rem'}
      return (
        <div >
          <p>
            Tip: Text surrounded with $$ ... $$ will be treated as a math formula.
          </p>
          <button onClick={this.openExamples}>See Examples</button>
          <p>Instructions:</p>
          <textarea 
            ref={this.instructions} 
            defaultValue={this.state.instructions}
            onChange={this.updateInstructions}
            style={inputStyle}
            ></textarea>

          <p>Question:</p>
          <textarea 
            ref={this.question} 
            defaultValue={this.state.question}
            onChange={this.updateQuestion}
            style={inputStyle}
          ></textarea>
          
          <p>Answer:</p>
          <textarea 
            ref={this.answer} 
            defaultValue={this.state.answer}
            onChange={this.updateAnswer}
            style={inputStyle}
          ></textarea>
        </div>
      )
    } else {
      return (
        <>
          <p>Enter JSON:</p>
          <textarea 
            ref={this.json} 
            defaultValue={this.state.json}
            onChange={this.updateJSON}
            onKeyDown={onKeyDown}
            spellCheck={false}
            style={{width:'30rem', height: '10rem', fontSize: '0.9em'}}
          />
          <br/>
        </>
      )
    }
  }

  renderPreview() {
    const data = this.getDataFromState()
    const previewStyle = {
      backgroundColor: 'white',
      border: '1px solid gray',
      margin: '2mm',
      padding: '1cm',
      width: 'fit-content',
      fontSize: '1.2em',
      minWidth: '3in',
    }

    return (
      <>
      <p>Question</p>
      <div className='document' style={previewStyle}>
        {data ? <RenderElement content={{type: 'question-nonumber', data}} /> : null}
      </div>
      <p>Answer</p>
      <div className='document' style={previewStyle}>
        {data ? <RenderElement content={{type: 'answer',  data}} /> : null}
      </div>
      </>
    )
  }

  render() {
    const divstyle = {
      width: 'auto',
      padding: '0',
      margin: '0',
      display: 'grid',
      gridTemplateAreas: '"inputs preview"',
      gridTemplateColumns: 'auto auto',
    }
    return (
      <>
      <div style={divstyle}>
        <div style={{gridArea: 'inputs'}}>
          <h4 style={{gridArea: 'title'}}>Custom Question</h4>
          <select ref={this.inputType} onChange={this.updateInputType}>
            <option value="manual">Manual</option>
            <option value='json'>JSON</option>
          </select>
          {this.renderInputs()}
        </div>
        <div style={{gridArea: 'preview'}}>
          <h4>Preview</h4>
          {this.renderPreview()}
        </div>
      </div>
      <button onClick={this.addQuestion}>Add to Assignment</button>
      <ReactModal isOpen={this.state.modal === 'examples'}
        onRequestClose={this.closeModal}
      >
        <LatexExamples onRequestClose={this.closeModal}/>
      </ReactModal>
      </>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  addToDocument: (q) => dispatch(addToDocument(q))
})

export default connect(null, mapDispatchToProps)(CustomQuestion)