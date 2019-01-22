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
    this.state = { current: this.props.default }
  }

  updateSelection = (evt) => {
    this.setState({ current: evt.target.value })
  }

  setPageMargins = () => {
    const marginSize = this.state.current
    if (marginSize) {
      this.props.setAllPageMargins(marginSize)
    }
  }

  updateAndSetPageMargins = (evt) => {
    this.setState({ current: evt.target.value })
    this.props.setAllPageMargins(evt.target.value)
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
        <select
          defaultValue={this.props.default}
          onChange={this.updateSelection}
          value={this.state.current}
          >
          {this.renderOptions()}
        </select>
        <button onClick={this.setPageMargins}>{buttonLabel}</button>
        </>
      )
    } else {
      return (
        <select
          onChange={this.updateAndSetPageMargins}
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