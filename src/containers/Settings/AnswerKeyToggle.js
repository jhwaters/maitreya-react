import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { setShowAnswerKey } from '../../actions/config'



class AnswerKeyToggle extends React.Component {
  static propTypes = {
    default: PropTypes.bool.isRequired,
    setShowAnswerKey: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.toggle = React.createRef()
  }

  isChecked = () => this.toggle.current.checked
  setShowAnswerKey = () => {
    const val = this.isChecked()
    this.props.setShowAnswerKey(val)
  }

  render() {
    return (
      <input ref={this.toggle}
        onChange={this.setShowAnswerKey}
        type='checkbox' 
        defaultChecked={this.props.default}
      />
    )
  }
}

const mapStateToProps = state => ({
  default: state.config.showAnswerKey,
})

const mapDispatchToProps = dispatch => ({
  setShowAnswerKey: (bool) => dispatch(setShowAnswerKey(bool)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AnswerKeyToggle)