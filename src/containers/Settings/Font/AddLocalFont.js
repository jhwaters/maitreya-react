import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addFontFamily } from '../../../actions/config'

class AddLocalFont extends React.Component {
  static propTypes = {
    addFontFamily: PropTypes.func.isRequired,
    buttonLabel: PropTypes.string.isRequired,
  }

  static defaultProps = {
    buttonLabel: 'Add'
  }

  constructor(props) {
    super(props)
    this.input = React.createRef()
  }

  addFont = () => {
    const fontFamily = this.input.current.value
    this.props.addFontFamily(fontFamily)
  }

  render() {
    return (
      <>
      <input ref={this.input} spellCheck={false} />
      <button onClick={this.addFont}>{this.props.buttonLabel}</button>
      </>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  addFontFamily: f => dispatch(addFontFamily(f)),
})

export default connect(null, mapDispatchToProps)(AddLocalFont)