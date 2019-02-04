import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setPageMargin } from '../../actions/style'

const MarginOptions = [
  '0.25in',
  '0.5in',
  '0.75in',
  '1.0in',
]

class SetPageMargin extends React.Component {

  static propTypes = {
    current: PropTypes.string.isRequired,
    setPageMargin: PropTypes.func.isRequired,
  }

  setPageMargin(margin) {
    this.props.setPageMargin(margin)
  }

  updateFromSelection = (evt) => {
    const m = evt.target.value
    this.setPageMargin(m)
  }

  render() {
    return (
      <select
        onChange={this.updateFromSelection}
        value={this.props.current}
      >
        {MarginOptions.map((m) => (
          <option key={m} value={m}>{m}</option>
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