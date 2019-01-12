import React from 'react';
import { connect } from 'react-redux';
import ReactModal from 'react-modal';
import {
  Preview,
  SideBar,
  StatusBar,
  TitleBar,
  Wrapper,
} from '../components'
import Document from './Document'
import CustomQuestion from './CustomQuestion'
import Notes from './Notes'

import {
  addQuestion,
  removeLast,
  clearAll,
} from '../actions/document'

import * as exampleQuestions from '../questions/examplequestions'
import { QuadTreePlotTest } from '../questions/testinggenerators'

let questionBank = exampleQuestions
questionBank['___QuadTree'] = QuadTreePlotTest

ReactModal.setAppElement('#root')

//let questionID = 0;

class AppWrapper extends React.Component {
  constructor(props) {
    super(props)
    this.questionTypeSelect = React.createRef()
    this.state = {
      modal: 'none',
    }
    this.document = React.createRef();

  }

  addNew = (question) => {
    //const qid = ++questionID;
    this.props.addQuestion(question)
  }

  generateAndAdd = () => {
    const questionType = this.questionTypeSelect.current.value
    console.log(`Generating ${questionType}`)
    try {
      const qtype = this.props.questionTypes[questionType]
      const question = new qtype()
      this.addNew(question.output())
    } catch(e) {
      console.log('failed')
    }
  }

  closeModal = () => this.setState({modal: 'none'})
  openRpcTest = () => this.setState({modal: 'RpcTest'})
  openCustomEditor = () => this.setState({modal: 'CustomEditor'})

  //changeQuestionTypeSelection = (evt) => this.setState({selected: evt.target.value})

  render() {
    const customTitleBar = {
      'default': false,
      'hidden': true,
    }[this.props.titleBarStyle]

    const qlist = Object.keys(this.props.questionTypes).sort()

    return (
      <Wrapper customTitleBar={customTitleBar}>
        { customTitleBar ? <TitleBar /> : null }
        <Preview>
          <Document ref={this.document}/>
        </Preview>
        <SideBar>
          <select ref={this.questionTypeSelect}>
            <option value='none' >Select Question Type</option>
            <option disabled >-------</option>
            {qlist.map(k => {
              const register = this.props.questionTypes[k].register()
              return (
                <option key={`qtype${k}`} 
                  title={register.description}
                  value={k} >
                  {register.name}
                </option>
              )
            })}
          </select>
          <button
            onClick={this.generateAndAdd}>
            Add
          </button>
          <button onClick={this.openCustomEditor}>Custom Question</button>
          <button 
            onClick={this.props.removeLast}>
            Remove Last
          </button>
          <button 
            onClick={this.props.clearAll}>
            Clear All
          </button>
          <button onClick={window.print}>Print</button>
          <button onClick={() => this.setState({modal: 'Notes'})}>Notes</button>
        </SideBar>
        <StatusBar>{this.props.statusBar}</StatusBar>

        <ReactModal
          isOpen={this.state.modal === 'CustomEditor'}
          onRequestClose={this.closeModal}
        >
          <CustomQuestion onRequestClose={this.closeModal}/>
          <button onClick={this.closeModal}>Cancel</button>
        </ReactModal>

        <ReactModal
          isOpen={this.state.modal === 'Notes'}
          onRequestClose={this.closeModal}
          style={{
            content: {
              border: '1px solid rgba(0,0,0,0.6)',
              borderRadius: '0',
              left: '20px',
              right: '20px',
              top: '20px',
              bottom: '20px',
              backgroundColor: '#fcf8e5',
            },
          }}
        >
          <Notes onRequestClose={this.closeModal} />
        </ReactModal>

      </Wrapper>
    )

  }
}

const mapStateToProps = state => ({
  questionTypes: questionBank,
  titleBarStyle: state.config.titleBarStyle,
  statusBar: `Questions: ${state.document.order.length}`
})

const mapDispatchToProps = dispatch => ({
  addQuestion: q => dispatch(addQuestion(q)),
  removeLast: () => dispatch(removeLast()),
  clearAll: () => dispatch(clearAll()),
})

export default connect(mapStateToProps, mapDispatchToProps)(AppWrapper)