import React from 'react';
import { connect } from 'react-redux';
import ReactModal from 'react-modal';
import { Preview, SideBar, StatusBar, TopBar, Wrapper } from './AppLayout'
import Document from './Document/Document'
import CustomQuestion from './CustomQuestion'
import Notes from './Notes'
import { DownloadButton, UploadButton } from './Menu'
import { CheckStateButton } from './Debug'
import SettingsPage, {
  AllowEditingToggle,
  AnswerKeyToggle,
  FixPagination,
  FontFamily,
  FontSize,
  GUImode,
  PreviewZoom,
  StartNumbering
} from './Settings'
import {
  addToDocument,
  removeLast,
  clearAll,
} from '../actions/document'
import { QuestionSearch } from './GeneratorMenu'

import '../stylesheets/styles.global.css'


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


class AppWrapper extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modal: 'none',
    }
  }

  addToDoc = (elem) => {
    this.props.addToDocument(elem)
  }

  closeModal = () => this.setState({modal: 'none'})
  openRpcTest = () => this.setState({modal: 'RpcTest'})
  openCustomQuestion = () => this.setState({modal: 'CustomQuestion'})
  openSettings = () => this.setState({modal: 'Settings'})

  render() {
    const toplabel = {margin: '0 0 0 0.5em'}
    return (
      <Wrapper >
        {/* customTitleBar ? <TitleBar /> : null */}
        <TopBar>
          <UploadButton>Load</UploadButton>
          <DownloadButton>Save</DownloadButton>
          <button onClick={window.print}>Print/PDF</button>
          <button onClick={this.openSettings}>Settings</button>
          <label htmlFor="show-answer-key-checkbox" style={toplabel}>Answer Key:</label><AnswerKeyToggle />
          <span style={toplabel}>Start Numbering:</span><StartNumbering />
          <span style={toplabel}>Font:</span><FontFamily/><FontSize />
          <span style={toplabel}>Zoom:</span><PreviewZoom defaultValue="100"/>
          <label htmlFor="allow-editing-checkbox" style={toplabel}>Allow Editing:</label><AllowEditingToggle />
          <div style={{width: '3mm'}} />
          <FixPagination/>
        </TopBar>
        <Preview>
          <Document/>
        </Preview>
        <SideBar>
          <QuestionSearch/>
          <button onClick={this.openCustomQuestion}>Custom Question</button>
          <button onClick={this.props.removeLast}>Remove Last</button>
          <button onClick={this.props.clearAll}>Clear All</button>
          <div style={{margin: 'auto'}}></div>
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
              border: 'none',
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
          <button onClick={this.closeModal}>Close</button>
          <CustomQuestion onRequestClose={this.closeModal}/>
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
  statusBar: "",
  fontFamilyUI: state.config.fontFamilyUI,
})

const mapDispatchToProps = dispatch => ({
  addToDocument: q => dispatch(addToDocument(q)),
  removeLast: () => dispatch(removeLast()),
  clearAll: () => dispatch(clearAll()),
})

export default connect(mapStateToProps, mapDispatchToProps)(AppWrapper)