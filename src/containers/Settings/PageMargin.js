import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setPageMargin } from '../../actions/style'

const MarginOptions = [
  '5mm',
  '10mm',
  '15mm',
  '20mm',
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
          <option key={m} value={`${m} ${m} ${m} ${m}`}>{m}</option>
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