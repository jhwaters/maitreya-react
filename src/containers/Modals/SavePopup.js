import React from 'react';
import { connect } from 'react-redux'
import ReactModal from 'react-modal'
import { setFilename } from '../../actions/config'
import styles from './styles.module.css'

function filterUnusedElements(document) {
  const result = {...document, content: {}}
  for (const k of document.order) {
    result.content[k] = document.content[k]
  }
  return result
}

// Download document as JSON
class SaveFilePopup extends React.Component {
  static defaultProps = {
    isOpen: false,
  }

  constructor(props) {
    super(props)
    this.inputRef = React.createRef()
    this.state = {
      includeStyle: true,
    }
  }

  close= () => this.props.onRequestClose()
  updateFilename = evt => this.props.setFilename(evt.target.value)
  toggleIncludeStyle = evt => this.setState({includeStyle: evt.target.checked})

  downloadAs(filename) {
    const data = this.state.includeStyle
      ? {document: filterUnusedElements(this.props.document), style: this.props.style}
      : {document: filterUnusedElements(this.props.document)}
    const dataString = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
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
    this.close()
  }

  handleKeyPress = evt => {
    if (evt.key === 'Enter') {
      this.download()
    }
  }

  render() {
    return (
      <ReactModal 
        className={styles.Popup}
        isOpen={this.props.isOpen}
        onRequestClose={this.close}
      >
        <div>
          <span style={{fontWeight: 'bold'}}>Save as: </span>
          <br/>
          <input 
            type="text" 
            style={{width: '30em', margin: '2mm 0'}}
            ref={this.inputRef}
            defaultValue={this.props.filename} 
            onChange={this.updateFilename}
            spellCheck={false}
            autoFocus
            onKeyPress={this.handleKeyPress}
            onFocus={evt => {evt.target.selectionStart = 0; evt.target.selectionEnd = evt.target.value.length-5}}
          />
          <br/>
          <input 
            id="save-style-with-document-checkbox"
            type="checkbox"
            checked={this.state.includeStyle}
            onChange={this.toggleIncludeStyle}
          />
          <label htmlFor="save-style-with-document-checkbox">
            Save style with document
          </label>
          <div className={styles.PopupButtons}>
            <button onClick={this.download}>Save</button>
            <button onClick={this.close}>Cancel</button>
          </div>
        </div>
      </ReactModal>
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

export default connect(mapStateToProps, mapDispatchToProps)(SaveFilePopup)