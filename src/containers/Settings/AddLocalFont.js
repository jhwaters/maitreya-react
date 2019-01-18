import React from 'react'
import { connect } from 'react-redux'
import { addLocalFont } from '../../actions/config'

class AddLocalFont extends React.Component {
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
      <input ref={this.input}></input>
      <button onClick={this.addFont}>{this.props.children}</button>
      </>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  addLocalFont: (font) => dispatch(addLocalFont(font)),
})

export default connect(null, mapDispatchToProps)(AddLocalFont)