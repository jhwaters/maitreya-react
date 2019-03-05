import React from 'react';
import { connect } from 'react-redux'
import ReactModal from 'react-modal'
import { loadDocument } from '../../actions/document'
import { setFilename } from '../../actions/config'
import { loadStyle } from '../../actions/style'

class UploadModal extends React.Component {
  static defaultProps = {
    isOpen: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      filename: null, 
      validFilename: null, 
      message: null,
    }
  }

  close = () => {
    this.setState({
      filename: null, 
      validFilename: null, 
      message: null,
    })
    this.props.onRequestClose()
  }

  handleDragOver = evt => {
    evt.stopPropagation()
    evt.preventDefault()
    evt.dataTransfer.dropEffect = 'copy'
  }

  handleDrop = evt => {
    evt.stopPropagation()
    evt.preventDefault()
    const file = evt.dataTransfer.files[0]
    this.setState({filename: file.name})
    this.readFile(file)
    return false
  }

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
        this.setState({
          message: 'Warning: This does not appear to be a valid file.', 
          ...docdata,
        })
      } else {
        this.setState({
          message: '', 
          validFilename: this.state.filename,
          ...docdata,
        })
        this.loadJson()
      }
    } catch {
      this.setState({message: 'Error: Unable to load file.', document: null, style: null})
    }
  }

  loadJson = () => {
    if (this.state.document) {
      this.props.loadStyle(this.state.style || {})
      this.props.loadDocument(this.state.document)
      this.close()
    } else {
      this.setState({message: 'No valid file selected'})
    }
  }

  load = () => {
    this.loadJson()
  }

  render() {
    return (
      <ReactModal
        isOpen={this.props.isOpen}
        onRequestClose={this.close}
        style={{
          content: {
            background: 'none',
            top: '0',
            bottom: '0',
            left: '0',
            right: '0',
            borderRadius: 0,
            margin: 0,
            padding: 0,
          },
          overlay: {
            background: 'none',
            margin: 0,
            padding: 0,
          }
        }}
      >
        <div 
          style={{
            position: 'absolute',
            top: '5px',
            right: '5px',
            left: '5px',
            bottom: '5px',
            margin: '0',
            borderRadius: '3px',
            borderWidth: '3px',
            borderStyle: 'dashed',
            borderColor: 'var(--ui-fg-2, black)',
            backgroundColor: 'var(--ui-border-0, rgba(210,210,210))',
            opacity: '0.95',
            color: 'var(--ui-fg-1, black)',
            fontFamily: 'katex_typewriter, sans-serif',
          }}
          onDrop={this.handleDrop}
          onDragOver={this.handleDragOver}
          onClick={this.close}
        >
          <div style={{position: 'absolute', top: '1in', left: '2in'}}>
            <span style={{
              fontSize: '2em', 
              fontWeight: 'bold', 
            }}>Drop File Here</span>
            <br/>
            <span>(click to cancel)</span>
            <div style={{height: '1em'}}/>
            <span style={{color: 'red', fontWeight: 'bold', fontSize: '1.5em'}}>{this.state.message || ''}</span>
            <div style={{height: '1em'}}/>
          </div>
        </div>
      </ReactModal>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  loadDocument: doc => dispatch(loadDocument(doc)),
  loadStyle: style => dispatch(loadStyle(style)),
})

export default connect(null, mapDispatchToProps)(UploadModal)