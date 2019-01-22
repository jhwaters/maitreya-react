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
  FontFamilyInput,
  FontFamilySelect,
  FontSizeSelect,
  PageMargins,
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
  examplequestions, demogenerators
} from '../questions'


let questionBank = {}
for (const q in examplequestions) {
  const n = examplequestions[q].register().name
  questionBank[n] = examplequestions[q]
}
questionBank['_ Alternate Plotting Method'] = demogenerators.QuadTreePlotTest


ReactModal.setAppElement('#root')
Object.assign(ReactModal.defaultStyles.content, {
  borderRadius: '0',
  borderColor: '#999',
  background: 'white',
  padding: '5mm',
  top: '15px',
  left: '15px',
  right: '15px',
  bottom: '15px',
})
Object.assign(ReactModal.defaultStyles.overlay, {
  background: 'rgba(100,100,100,0.2)',
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
          <button onClick={window.print}>Print</button>
          <span style={toplabel}>Answer Key:</span><AnswerKeyToggle />
          <span style={toplabel}>Start Numbering At:</span><StartNumbering />
          <span style={toplabel}>Font:</span>
          {this.props.fontFamilyUI === 'input' ? <FontFamilyInput applyButton={false}/> : <FontFamilySelect />}
          <FontSizeSelect />
          <span style={toplabel}>Margins:</span><PageMargins />
          <span style={toplabel}>Zoom:</span><PreviewZoom />
          <span style={toplabel}>Allow Editing:</span><AllowEditingToggle />
          
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
          <button onClick={this.openSettings}>Settings</button>
          <div style={{height: '1in'}}></div>
          <button onClick={() => this.setState({modal: 'Notes'})}>Notes</button>
          <CheckStateButton>Log State</CheckStateButton>
        </SideBar>
        { this.props.statusBar ? <StatusBar><span>{this.props.statusBar}</span></StatusBar> : null }


        <ReactModal
          isOpen={this.state.modal === 'Settings'}
          onRequestClose={this.closeModal}
        >
          <SettingsPage onRequestClose={this.closeModal}/>
          <button onClick={this.closeModal}>Close</button>
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