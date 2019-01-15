import React from 'react';
import { connect } from 'react-redux';
import ReactModal from 'react-modal';
import {
  Preview,
  SideBar,
  StatusBar,
  TitleBar,
  TopBar,
  Wrapper,
} from '../components'
import Document from './Document'
import CustomQuestion from './CustomQuestion'
import {
  SettingsPage, 
  FontSelect,
  StartNumbering
} from './Settings'
import Notes from './Notes'
import {
  CheckStateButton
} from './Debug'

import '../styles/styles.global.css'

import {
  addQuestion,
  removeLast,
  clearAll,
} from '../actions/document'

import * as exampleQuestions from '../questions/examplequestions'
//import * as demoGenerators from '../questions/testinggenerators'

let questionBank = exampleQuestions
//for (const q in demoGenerators) {
//  questionBank['___' + q] = demoGenerators[q]
//}

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
    if (questionType !== '__NONE__') {
      console.log(`Generating ${questionType}`)
      try {
        const qtype = this.props.questionTypes[questionType]
        const question = new qtype()
        this.addNew(question.output())
      } catch(e) {
        console.log('failed')
        console.log(e)
      }
    }
  }

  closeModal = () => this.setState({modal: 'none'})
  openRpcTest = () => this.setState({modal: 'RpcTest'})
  openCustomEditor = () => this.setState({modal: 'CustomEditor'})
  openSettings = () => this.setState({modal: 'Settings'})

  //changeQuestionTypeSelection = (evt) => this.setState({selected: evt.target.value})

  renderQuestionList() {
    const sortfunc = (a, b) => {
      const aName = this.props.questionTypes[a].register().name.toUpperCase()
      const bName = this.props.questionTypes[b].register().name.toUpperCase()
      if (aName < bName) {
        return -1
      }
      if (aName > bName) {
        return 1
      }
      return 0
    }

    const qlist = Object.keys(this.props.questionTypes).sort(sortfunc)

    return qlist.map(k => {
      const register = this.props.questionTypes[k].register()
      return (
        <option key={`qtype${k}`} 
          title={register.description}
          value={k} >
          {register.name}
        </option>
      )
    })
  }

  render() {
    const customTitleBar = {
      'default': false,
      'hidden': true,
    }[this.props.titleBarStyle]

    return (
      <Wrapper customTitleBar={customTitleBar}>
        { customTitleBar ? <TitleBar /> : null }
        <TopBar>
          <button onClick={window.print}>Print</button>
          <div style={{width: '1cm'}}></div>
          <span style={{margin: '0 0.5rem'}}>Font:</span><FontSelect />
          <span style={{margin: '0 0.5rem'}}>Start Numbering At:</span><StartNumbering />
        </TopBar>
        <Preview>
          <Document ref={this.document}/>
        </Preview>
        <SideBar>
          <select ref={this.questionTypeSelect} defaultValue='__NONE__'>
            <option value='__NONE__' disabled>Question Type</option>
            <option value='__NONE__' disabled>-------</option>
            {this.renderQuestionList()}
          </select>
          <button onClick={this.generateAndAdd}>Add</button>
          <button onClick={this.openCustomEditor}>Custom Question</button>
          <button onClick={this.props.removeLast}>Remove Last</button>
          <button onClick={this.props.clearAll}>Clear All</button>
          <div style={{height: '1in'}}></div>
          <button onClick={() => this.setState({modal: 'Notes'})}>Notes</button>
          <CheckStateButton>Log State</CheckStateButton>
        </SideBar>
        <StatusBar><span>{this.props.statusBar}</span></StatusBar>

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
        >
          <Notes onRequestClose={this.closeModal} />
        </ReactModal>

        <ReactModal
          isOpen={this.state.modal === 'Settings'}
          onRequestClose={this.closeModal}
        >
          <SettingsPage onRequestClose={this.closeModal}/>
          <button onClick={this.closeModal}>Close</button>
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