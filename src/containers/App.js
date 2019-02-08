import React from 'react';
import { connect } from 'react-redux';
import ReactModal from 'react-modal';
import {
  Preview,
  SideBar,
  StatusBar,
  TopBar,
  Wrapper,
} from '../components'
import Document from './Document/Document'
import CustomQuestion from './CustomQuestion'
import Notes from './Notes'
import { CheckStateButton } from './Debug'
import SettingsPage, {
  AllowEditingToggle,
  AnswerKeyToggle,
  FixPagination,
  FontFamily,
  FontSize,
  GUImode,
  PageMargin,
  PreviewZoom,
  StartNumbering
} from './Settings'


import '../stylesheets/styles.global.css'

import {
  addToDocument,
  removeLast,
  clearAll,
} from '../actions/document'

import {
  examplequestions, transformations, demogenerators, picofermi
} from '../questions'


let questionBank = {}
for (const set of [examplequestions, transformations]) {
  for (const q in set) {
    const n = set[q].register().name
    questionBank[n] = set[q]
  }
}

for (const set of [demogenerators, picofermi]) {
  for (const q in set) {
    const n = '_ ' + set[q].register().name
    questionBank[n] = set[q]
  }
}



ReactModal.setAppElement('#root')
Object.assign(ReactModal.defaultStyles.content, {
  borderRadius: '4px',
  borderColor: 'var(--ui-border-1, #999)',
  background: 'var(--ui-bg-1, #eee)',
  padding: '5mm',
  top: '10px',
  left: '10px',
  right: '10px',
  bottom: '10px',
})
Object.assign(ReactModal.defaultStyles.overlay, {
  background: 'rgba(10,10,10,0.3)',
})


//let questionID = 0;

class AppWrapper extends React.Component {
  constructor(props) {
    super(props)
    this.questionTypeSelect = React.createRef()
    this.state = {
      modal: 'none',
    }
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

  closeModal = () => this.setState({modal: 'none'})
  openRpcTest = () => this.setState({modal: 'RpcTest'})
  openCustomQuestion = () => this.setState({modal: 'CustomQuestion'})
  openSettings = () => this.setState({modal: 'Settings'})
  
  renderQuestionList() {
    const sortfunc = (a, b) => {
      const A = a.toUpperCase(), B = b.toUpperCase()
      if (A > B) return 1
      if (A < B) return -1
      return 0
    }

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
    const toplabel = {margin: '0 0 0 0.5em'}
    return (
      <Wrapper >
        {/* customTitleBar ? <TitleBar /> : null */}
        <TopBar>
          <button onClick={window.print}>Print / PDF</button>
          <button onClick={this.openSettings}>Settings</button>
          <span style={toplabel}>Answer Key:</span><AnswerKeyToggle />
          <span style={toplabel}>Start Numbers:</span><StartNumbering />
          <span style={toplabel}>Font:</span><FontFamily/><FontSize />
          <span style={toplabel}>Margins:</span><PageMargin />
          <span style={toplabel}>Zoom:</span><PreviewZoom defaultValue="110"/>
          <span style={toplabel}>Allow Editing:</span><AllowEditingToggle />
          <div style={{width: '3mm'}} />
          <FixPagination/>
        </TopBar>
        <Preview>
          <Document/>
        </Preview>
        <SideBar>
          <select ref={this.questionTypeSelect} defaultValue='__NONE__'>
            <option value='__NONE__' disabled>Question Type</option>
            <option value='__NONE__' disabled>-------</option>
            {this.renderQuestionList()}
          </select>
          <button onClick={this.generateAndAdd}>Add</button>
          <button onClick={this.openCustomQuestion}>Custom Question</button>
          <button onClick={this.props.removeLast}>Remove Last</button>
          <button onClick={this.props.clearAll}>Clear All</button>
          <div style={{height: '1in'}}></div>
          <GUImode/>
          <button onClick={() => this.setState({modal: 'Notes'})}>Notes</button>
          <CheckStateButton>Log State</CheckStateButton>
        </SideBar>
        { this.props.statusBar ? <StatusBar><span>{this.props.statusBar}</span></StatusBar> : null }

        <ReactModal
          isOpen={this.state.modal === 'Settings'}
          onRequestClose={this.closeModal}
          style={{
            content: {
              top: '0',
              bottom: 0,
              left: 0,
              right: 0,
              padding: 0,
            },
            overlay: {
              background: 'none',
              backgroundColor: 'none',
            }
          }}
        >
          <SettingsPage onRequestClose={this.closeModal}/>
        </ReactModal>

        <ReactModal
          isOpen={this.state.modal === 'CustomQuestion'}
          onRequestClose={this.closeModal}
        >
          <CustomQuestion onRequestClose={this.closeModal}/>
          <button onClick={this.closeModal}>Close</button>
        </ReactModal>

        <ReactModal
          isOpen={this.state.modal === 'Notes'}
          onRequestClose={this.closeModal}
          style={{
            content: {
              width: '4in',
              top: '1in',
              left: '1in',
              right: 'unset',
              bottom: 'unset',
              color: 'black',
              backgroundColor: 'var(--ui-page, white)',
            }
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
  statusBar: "",
  fontFamilyUI: state.config.fontFamilyUI,
})

const mapDispatchToProps = dispatch => ({
  addToDocument: q => dispatch(addToDocument(q)),
  removeLast: () => dispatch(removeLast()),
  clearAll: () => dispatch(clearAll()),
})

export default connect(mapStateToProps, mapDispatchToProps)(AppWrapper)