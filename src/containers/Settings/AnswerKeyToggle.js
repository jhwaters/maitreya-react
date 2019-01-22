import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { setShowAnswerKey } from '../../actions/config'


class AnswerKeyToggle extends React.Component {
  static propTypes = {
    current: PropTypes.bool.isRequired,
    setShowAnswerKey: PropTypes.func.isRequired,
  }

  toggle = (evt) => {
    if (evt.target.checked) {
      this.props.setShowAnswerKey(true)
    } else {
      this.props.setShowAnswerKey(false)
    }
  }

  render() {
    return (
      <input
        onChange={this.toggle}
        type='checkbox' 
        checked={this.props.current}
      />
    )
  }
}

const mapStateToProps = state => ({
  current: state.config.showAnswerKey,
})

const mapDispatchToProps = dispatch => ({
  setShowAnswerKey: (bool) => dispatch(setShowAnswerKey(bool)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AnswerKeyToggle)