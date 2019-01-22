import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setDocumentFontSize } from '../../actions/document'


class FontSizeSelect extends React.Component {

  static propTypes = {
    applyButton: PropTypes.bool || PropTypes.string.isRequired,
    default: PropTypes.string.isRequired,
    setDocumentFontSize: PropTypes.func.isRequired,
  }

  static defaultProps = { applyButton: false }

  constructor(props) {
    super(props)
    this.selection = React.createRef()
    this.setCSSVariable(props.default)
  }

  setCSSVariable(fontSize) {
    document.body.style.setProperty('--doc-font-size', fontSize)
  }

  setDocFontSize(size) {
    this.props.setDocumentFontSize(size)
  }

  setFromSelection = () => {
    const value = this.selection.current.value
    if (value) {
      this.setCSSVariable(value)
      this.setDocFontSize(value)
    }
  }  

  renderSizeOptions() {
    const options = [5, 6, 7, 8, 9, 10, 11, 12, 13]
    return (
      <>
      {options.map((s) => {
        const size = `${s}pt`
        return (
          <option 
            value={size}
            key={`fontOption-${size}`}
          >{size}</option>
        )
      })}
      </>
    )
  }

  render() {
    if (this.props.applyButton) {
      const buttonLabel = this.props.applyButton === true ? 'Apply' : this.props.applyButton
      return (
        <>
          <select ref={this.selection}
            defaultValue={this.props.default}
          >
            {this.renderSizeOptions()}
          </select>
          <button onClick={this.setFromSelection}>{buttonLabel}</button>
        </>
      )
    } else {
      return (
        <>
          <select ref={this.selection}
            defaultValue={this.props.default}
            onChange={this.setFromSelection}
          >
            {this.renderSizeOptions()}
          </select>
        </>
      )
    }
  }
}


const mapStateToProps = state => ({
  default: state.document.settings.fontSize,
})

const mapDispatchToProps = dispatch => ({
  setDocumentFontSize: (size) => dispatch(setDocumentFontSize(size)),
})

export default connect(mapStateToProps, mapDispatchToProps)(FontSizeSelect)