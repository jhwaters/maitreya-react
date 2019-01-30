import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setHiddenCount } from '../../actions/config'
import { clearPageBreaks } from '../../actions/document'

class FixPagination extends React.Component {
  static propTypes = {
    hidden: PropTypes.number.isRequired,
    setHiddenCount: PropTypes.func.isRequired,
  }

  reset = () => {
    this.props.clearPageBreaks()
    this.props.setHiddenCount(this.props.total)
  }

  check() {
    setTimeout(() => {
      if (this.props.hidden > 0) {
        this.props.setHiddenCount(this.props.hidden-1)
      }
    }, 20)
  }

  componentDidMount() {
    this.check()
  }

  componentDidUpdate() {
    this.check()
  }

  render() {
    return (
      <button onClick={this.reset}>Fix Pagination</button>
    )
  }
}

const mapStateToProps = state => ({
  hidden: state.config.numberHidden,
  total: state.document.order.length,
})

const mapDispatchToProps = dispatch => ({
  setHiddenCount: n => dispatch(setHiddenCount(n)),
  clearPageBreaks: () => dispatch(clearPageBreaks()),
})

export default connect(mapStateToProps, mapDispatchToProps)(FixPagination)