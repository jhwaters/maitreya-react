import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { setDocumentFontFamily } from '../../actions/style'
import { addFontFamily } from '../../actions/config'
import ReactModal from 'react-modal'
import styles from './styles.module.css'

class AddFontPopup extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func,
    setDocumentFontFamily: PropTypes.func.isRequired,
  }

  static defaultProps = {
    isOpen: false
  }

  constructor(props) {
    super(props)
    this.state = {input: ''}
  }

  close = () => {
    this.setState({input: ''})
    this.props.onRequestClose()
  }

  onChange = evt => this.setState({input: evt.target.value})

  setFontFamily(fontFamily) {
    this.props.setDocumentFontFamily(fontFamily)
  }

  addFont = () => {
    const family = this.state.input
    if (family.length) {
      this.props.addFontFamily(family)
      this.setFontFamily(family)
    }
    this.close()
  }

  handleKeyPress = evt => {
    if (evt.key === 'Enter') {
      this.addFont()
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
        <span>
          This should be the name of a font already installed on your computer.
        </span>
        <br/>
        <input
          type="text"
          placeholder="Enter Font Name"
          autoFocus
          onChange={this.onChange}
          onKeyPress={this.handleKeyPress}
          style={{width: '30em', margin: '2mm 0'}}
        />
        <div className={styles.PopupButtons}>
          <button onClick={this.setFromPrompt}>Accept</button>
          <button onClick={this.close}>Cancel</button>
        </div>
      </div>
      </ReactModal>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  addFontFamily: f => dispatch(addFontFamily(f)),
  setDocumentFontFamily: (family) => dispatch(setDocumentFontFamily(family)),
})

export default connect(null, mapDispatchToProps)(AddFontPopup)