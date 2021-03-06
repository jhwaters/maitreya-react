import React from 'react'
import { connect } from 'react-redux'
import { RenderJson } from '../../renderJson'
import { addToDocument } from '../../actions/document'
import LatexExamples from './LatexExamples'
import GraphMaker from './GraphMaker'
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

const jsonExample = `{
  "instructions": "Use the Pythagorean Theorem: $$a^2 + b^2 = c^2$$",

  "question": "Which is closest to the length of $$\\\\overline{XY}$$?",

  "answer": {
    "choices": [6, 8, 10, 12, 14],
    "correct": 10
  },

  "diagram": [
    "CoordinatePlane",
    {
      "span": "-5,-5 5,5", 
      "axis": false, 
      "height": "1.5in",
      "style": "geometry green dashed"
    },
    [
      "Path", 
      {
        "points": "-4,3 4,-3", 
        "markers": ".-."
      }
    ],
    [
      "Overlay", 
      {
        "x": -4, 
        "y": 3, 
        "anchor": "S"
      }, 
      "$$X$$"
    ],
    [
      "Overlay", 
      {
        "x": 4, 
        "y": -3, 
        "anchor": "N"
      }, 
      "$$Y$$"
    ]
  ]
}`


class CustomQuestion extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      inputType: 'manual',
      instructions: '',
      question: '',
      answer: '',
      diagram: '',
      json: '',
      modal: 'none',
    }
    //this.inputType = React.createRef()
    //this.instructions = React.createRef()
    //this.question = React.createRef()
    //this.answer = React.createRef()
    //this.json = React.createRef()
  }

  openExamples = () => this.setState({ modal: 'examples' })
  openGraphMaker = () => this.setState({modal: 'graph'})
  closeModal = () => this.setState({ modal: 'none' })

  updateInstructions = (evt) => {
    this.setState({ instructions: evt.target.value })
  }
  updateQuestion = (evt) => {
    this.setState({ question: evt.target.value })
  }
  updateDiagram = (diagram) => {
    this.setState({diagram})
  }
  updateAnswer = (evt) => {
    this.setState({ answer: {...this.state.answer, correct: evt.target.value }})
  }
  updateJSON = (evt) => {
    this.setState({ json: evt.target.value })
  }

  updateInputType = (evt) => {
    this.setState({inputType: evt.target.value})
  }

  getDataFromState() {
    if (this.state.inputType === 'manual') {
      const content = {}
      for (const k of ['instructions', 'question', 'answer']) {
        if (this.state[k]) {
          content[k] = this.state[k]
        }
      }
      if (this.state.diagram) {
        content.diagram = this.state.diagram
      }
      return content
    } else if (this.state.inputType === 'json') {
      try {
        const content = JSON.parse(this.state.json)
        return content
      } catch(e) {
      }
    }
  }

  addQuestion = () => {
    const props = {content: this.getDataFromState()}
    this.props.addToDocument(['NumberedQuestion', props])
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
            value={this.state.instructions}
            onChange={this.updateInstructions}
            style={inputStyle}
            ></textarea>

          <p>Question:</p>
          <textarea 
            value={this.state.question}
            onChange={this.updateQuestion}
            style={inputStyle}
          ></textarea>

          <p>Diagram:</p>
          <button onClick={this.openGraphMaker}>Add Graph</button>
          
          <p>Answer:</p>
          <textarea 
            value={this.state.answer.correct}
            onChange={this.updateAnswer}
            style={inputStyle}
          ></textarea>
        </div>
      )
    } else {
      return (
        <>
          <button onClick={this.setJsonExample}>See example</button>
          <br/>
          <textarea 
            value={this.state.json}
            onChange={this.updateJSON}
            onKeyDown={onKeyDown}
            spellCheck={false}
            style={{width:'30rem', height: '18rem', fontSize: '0.9em'}}
          />
          <br/>
        </>
      )
    }
  }

  setJsonExample = () => {
    const json = jsonExample
    this.setState({ json })
  }

  renderPreview() {
    const content = this.getDataFromState()
    const previewStyle = {
      margin: '2mm',
      width: 'fit-content',
      fontSize: '1.2em',
      minWidth: '3in',
    }
    const props = { content }
    return (
      <>
      <p>Question</p>
      <div className='document preview-area' style={previewStyle}>
        {content ? <RenderJson json={['Question', props]} /> : null}
      </div>
      <p>Answer</p>
      <div className='document preview-area' style={previewStyle}>
        {content ? <RenderJson json={['AnswerKey', props]} /> : null}
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
          <button onClick={this.addQuestion}>Add to Assignment</button>
        </div>
        <div style={{gridArea: 'preview'}}>
          <h4>Preview</h4>
          {this.renderPreview()}
        </div>
      </div>
      


      <ReactModal isOpen={this.state.modal === 'examples'}
        onRequestClose={this.closeModal}
        style={{
          content: {
            backgroundColor: 'var(--ui-page, white)',
            color: 'black',
          }
        }}
      >
        <LatexExamples onRequestClose={this.closeModal}/>
      </ReactModal>

      <ReactModal isOpen={this.state.modal === 'graph'}
        onRequestClose={this.closeModal}
      >
        <GraphMaker onRequestClose={this.closeModal} onSubmit={this.updateDiagram}/>
      </ReactModal>
      </>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  addToDocument: (q) => dispatch(addToDocument(q))
})

export default connect(null, mapDispatchToProps)(CustomQuestion)