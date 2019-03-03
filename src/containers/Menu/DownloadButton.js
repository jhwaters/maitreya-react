import React from 'react';
import { connect } from 'react-redux'
import ReactModal from 'react-modal'
import { setFilename } from '../../actions/config'

// Download document as JSON
class DownloadButton extends React.Component {
  constructor(props) {
    super(props)
    this.inputRef = React.createRef()
    this.state = {
      modal: 'none'
    }
  }

  closeModal= () => this.setState({modal: 'none'})
  openModal = () => {
    this.setState({modal: 'savePrompt'})
  }
  updateFilename = evt => this.props.setFilename(evt.target.value)

  downloadAs(filename) {
    const dataString = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      document: this.props.document,
      style: this.props.style,
    }));
    const dlanchor = document.createElement('a')
    dlanchor.setAttribute('href', dataString)
    dlanchor.setAttribute('download', filename)
    document.body.appendChild(dlanchor)
    dlanchor.click()
    dlanchor.remove()
  }

  download = () => {
    const filename = this.props.filename
    this.props.setFilename(filename)
    this.downloadAs(filename)
    this.closeModal()
  }

  handleKeyPress = evt => {
    if (evt.key === 'Enter') {
      this.download()
    }
  }

  render() {
    return (
      <>
      <button
        onClick={this.openModal}
      >{this.props.children}</button>
      <ReactModal 
        className="modal-dialog-popup"
        isOpen={this.state.modal === 'savePrompt'}
        onRequestClose={this.closeModal}
      >
        <div>
          <span style={{fontWeight: 'bold'}}>Save as: </span>
          <input 
            type="text" 
            ref={this.inputRef}
            defaultValue={this.props.filename} 
            onChange={this.updateFilename}
            spellCheck={false}
            autoFocus
            onKeyPress={this.handleKeyPress}
            onFocus={evt => {evt.target.selectionStart = 0; evt.target.selectionEnd = evt.target.value.length-5}}
          />
          <div className="dialog-button-container">
            <button onClick={this.download}>Save</button>
            <button onClick={this.closeModal}>Cancel</button>
          </div>
        </div>
      </ReactModal>
      </>
    )
  }
}

function defaultFilename(document) {
  if (document.headers && document.headers[1]) {
    const [t, {rows}] = document.headers[1]
    if (rows) {
      const titleparts = []
      for (const r of rows) {
        if (r[0]) {
          titleparts.push(r[0].replace(' ', ''))
        }
      }
      if (titleparts.length) {
        return titleparts.join('_')
      }
    }
  }
  return 'assignment'
}

const mapStateToProps = state => ({
  filename: state.config.filename || defaultFilename(state.document) + '.json',
  document: state.document,
  style: state.style,
})
const mapDispatchToProps = dispatch => ({
  setFilename: filename => dispatch(setFilename(filename)),
})

export default connect(mapStateToProps, mapDispatchToProps)(DownloadButton)