import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setDocumentFontFamily } from '../../actions/document'


class FontFamilyInput extends React.Component {
  static propTypes = {
    applyButton: PropTypes.bool || PropTypes.string.isRequired,
    default: PropTypes.string,
    setDocumentFontFamily: PropTypes.func,
  }

  static defaultProps = {
    applyButton: true,
  }

  constructor(props) {
    super(props)
    this.input = React.createRef()
    this.setCSSVariable(props.default)
  }

  setCSSVariable(fontFamily) {
    document.body.style.setProperty('--doc-font-family', fontFamily)
  }

  setDocFontFamily(fontFamily) {
    this.props.setDocumentFontFamily(fontFamily)
  }

  setFromInput = () => {
    const value = this.input.current.value
    const fontFamily = value.slice(0,7) === '_LOCAL_' ? value.slice(8) : value
    if (fontFamily) {
      this.setCSSVariable(fontFamily)
      this.setDocFontFamily(fontFamily)
    }
  }

  render() {
    if (this.props.applyButton) {
      const buttonLabel = this.props.applyButton === true ? 'Apply' : this.props.applyButton
      return (
        <>
          <input ref={this.input} 
            defaultValue={this.props.default}
            spellCheck={false}
          />
          <button onClick={this.setFromInput}>{buttonLabel}</button>
        </>
      )
    } else {
      return (
        <>
          <input ref={this.input} 
            defaultValue={this.props.default}
            spellCheck={false}
            onChange={this.setFromInput}
          />
        </>
      )
    }
  }
}

const mapStateToProps = state => ({
  default: state.document.settings.fontFamily,
})

const mapDispatchToProps = dispatch => ({
  setDocumentFontFamily: (family) => dispatch(setDocumentFontFamily(family)),
})

export default connect(mapStateToProps, mapDispatchToProps)(FontFamilyInput)