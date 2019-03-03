import React from 'react';
import { connect } from 'react-redux'
import ReactModal from 'react-modal'
import { loadDocument } from '../../actions/document'
import { setFilename } from '../../actions/config'
import { loadStyle } from '../../actions/style'

class UploadButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modal: 'none',
    }
  }

  openPrompt = () => this.setState({modal: 'uploadPrompt'})
  closeModal = () => this.setState({modal: 'none'})

  selectFile = evt => {
    const file = evt.target.files[0]
    this.setState({filename: file.name})
    this.readFile(file)
  }

  readFile(file) {
    if (file) {
      const reader = new FileReader()
      reader.onload = evt => this.checkData(evt.target.result)
      reader.readAsText(file)
    }
  }

  checkData(dataString) {
    let data
    try {
      data = JSON.parse(dataString)
    } catch {
      this.setState({message: 'File is not valid JSON'})
      return
    }
    try {
      const {document, style} = data
      const {
        content, 
        order, 
        headers={}, 
        footers={}, 
        pagebreaks=[], 
        startNumbering=1,
      } = document
      const docdata = {
        document: {content, order, headers, footers, pagebreaks, startNumbering},
        style
      }
      if (!content || !order || (content.constructor.name !== 'Object') || !Array.isArray(order)) {
        this.setState({message: 'Warning: This does not appear to be a valid file.', ...docdata})
      } else {
        this.setState({message: '', ...docdata})
      }
    } catch {
      this.setState({message: 'Error: Unable to load file.', document: null, style: null})
    }
  }

  loadJson = () => {
    if (this.state.document) {
      this.props.setFilename(this.state.filename)
      this.props.loadStyle(this.state.style || {})
      this.props.loadDocument(this.state.document)
      this.closeModal()
    } else {
      this.setState({message: 'No valid file selected'})
    }
  }

  load = () => {
    this.loadJson()
  }

  render() {
    return (
      <>
        <button
          onClick={this.openPrompt}
        >{this.props.children}</button>
        <ReactModal
          className="modal-dialog-popup"
          isOpen={this.state.modal === 'uploadPrompt'}
          onRequestClose={this.closeModal}
        >
          <div>
            <input 
              size="10"
              type="file" 
              onChange={this.selectFile}
            />

            <br/>
            <span style={{color: 'red'}}>{this.state.message || ''}</span>
            <div className="dialog-button-container">
              <button onClick={this.load}>Load</button>
              <button onClick={this.closeModal}>Cancel</button>
            </div>
          </div>
        </ReactModal>
      </>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  loadDocument: doc => dispatch(loadDocument(doc)),
  loadStyle: style => dispatch(loadStyle(style)),
  setFilename: filename => dispatch(setFilename(filename)),
})

export default connect(null, mapDispatchToProps)(UploadButton)