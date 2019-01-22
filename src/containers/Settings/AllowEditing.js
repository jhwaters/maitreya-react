import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setAllowEditing } from '../../actions/config'

class AllowEditing extends React.Component {
  static propTypes = {
    default: PropTypes.bool.isRequired,
    setAllowEditing: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.toggle = React.createRef()
  }

  isChecked = () => this.toggle.current.checked
  setAllowEditing = () => {
    const val = this.isChecked()
    this.props.setAllowEditing(val)
  }

  render() {
    return (
      <input ref={this.toggle}
        onChange={this.setAllowEditing}
        type='checkbox' 
        defaultChecked={this.props.default}
      />
    )
  }
}

const mapStateToProps = state => ({
  default: state.config.allowEditing,
})

const mapDispatchToProps = dispatch => ({
  setAllowEditing: (b) => dispatch(setAllowEditing(b)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AllowEditing)