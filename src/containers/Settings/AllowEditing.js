import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setAllowEditing } from '../../actions/config'

class AllowEditing extends React.Component {
  static propTypes = {
    current: PropTypes.bool.isRequired,
    setAllowEditing: PropTypes.func.isRequired,
  }

  toggle = (evt) => {
    if (evt.target.checked) {
      this.props.setAllowEditing(true)
    } else {
      this.props.setAllowEditing(false)
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
  current: state.config.allowEditing,
})

const mapDispatchToProps = dispatch => ({
  setAllowEditing: (b) => dispatch(setAllowEditing(b)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AllowEditing)