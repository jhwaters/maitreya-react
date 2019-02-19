import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setPageMargin } from '../../../actions/style'

const MarginOptions = [
  '.25',
  '.5',
  '.75',
  '1.0',
]

class SetPageMargin extends React.Component {
  static defaultProps = {
    unit: 'in',
  }

  static propTypes = {
    current: PropTypes.string.isRequired,
    setPageMargin: PropTypes.func.isRequired,
  }

  setPageMargin(margin) {
    this.props.setPageMargin(margin)
  }

  updateFromSelection = (evt) => {
    const m = evt.target.value + this.props.unit
    this.setPageMargin(m)
  }

  render() {
    return (
      <select
        onChange={this.updateFromSelection}
        value={parseFloat(this.props.current)}
      >
        {MarginOptions.map((m) => (
          <option key={m} value={parseFloat(m)}>{m} {this.props.unit}</option>
        ))}
      </select>
    )
  }
}

const mapStateToProps = state => ({
  current: state.style.pageMargin,
})

const mapDispatchToProps = dispatch => ({
  setPageMargin: (m) => dispatch(setPageMargin(m))
})

export default connect(mapStateToProps, mapDispatchToProps)(SetPageMargin)