import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setAllPageMargins } from '../../actions/document'

const MarginOptions = ['5mm', '10mm', '15mm', '20mm']


class SetPageMargins extends React.Component {

  static propTypes = {
    applyButton: PropTypes.bool || PropTypes.string.isRequired,
    default: PropTypes.string.isRequired,
    setAllPageMargins: PropTypes.func.isRequired,
  }

  static defaultProps = { applyButton: false }

  constructor(props) {
    super(props)
    this.selection = React.createRef()
  }

  setPageMargins = () => {
    const marginSize = this.selection.current.value
    if (marginSize) {
      this.props.setAllPageMargins(marginSize)
    }
  }

  renderOptions() {
    return (
      <>
        {MarginOptions.map((m) => {
          return (
            <option key={`margin-select-${m}`} value={m}>{m}</option>
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
          {this.renderOptions()}
        </select>
        <button onClick={this.setPageMargins}>{buttonLabel}</button>
        </>
      )
    } else {
      return (
        <select ref={this.selection}
          onChange={this.setPageMargins}
          defaultValue={this.props.default}
          >
          {this.renderOptions()}
        </select>
      )
    }
    
  }
}


const mapStateToProps = state => ({
  default: state.document.settings.pageMargins.left,
})
const mapDispatchToProps = dispatch => ({
  setAllPageMargins: (m) => dispatch(setAllPageMargins(m))
})

export default connect(mapStateToProps, mapDispatchToProps)(SetPageMargins)