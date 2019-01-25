import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addLocalFont } from '../../../actions/config'

class AddLocalFont extends React.Component {
  static propTypes = {
    addLocalFont: PropTypes.func.isRequired,
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
    const fontName = this.input.current.value
    this.props.addLocalFont({family: fontName})
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
  addLocalFont: (font) => dispatch(addLocalFont(font)),
})

export default connect(null, mapDispatchToProps)(AddLocalFont)