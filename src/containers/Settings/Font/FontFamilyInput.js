import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setDocumentFontFamily } from '../../../actions/style'


class FontFamilyInput extends React.Component {
  static propTypes = {
    current: PropTypes.string,
    setDocumentFontFamily: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.setCss(props.current)
  }

  setCss(fontFamily) {
    document.body.style.setProperty('--doc-font-family', fontFamily)
  }

  setFontFamily(fontFamily) {
    this.setCss(fontFamily)
    this.props.setDocumentFontFamily(fontFamily)
  }

  onChange = (evt) => {
    const value = evt.target.value
    const fontFamily = value.slice(0,7) === '_LOCAL_' ? value.slice(8) : value
    this.setFontFamily(fontFamily)
  }

  render() {
    return (
      <input 
        value={this.props.current}
        spellCheck={false}
        onChange={this.onChange}
      />
    )
  }
}

const mapStateToProps = state => ({
  current: state.style.fontFamily,
})

const mapDispatchToProps = dispatch => ({
  setDocumentFontFamily: (family) => dispatch(setDocumentFontFamily(family)),
})

export default connect(mapStateToProps, mapDispatchToProps)(FontFamilyInput)