import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setDocumentFontFamily } from '../../actions/document'


class FontFamilyInput extends React.Component {
  static propTypes = {
    current: PropTypes.string,
    setDocumentFontFamily: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.setCSSVariable(props.current)
  }

  setCSSVariable(fontFamily) {
    document.body.style.setProperty('--doc-font-family', fontFamily)
  }

  onSelect = (evt) => {
    const value = evt.target.value
    const fontFamily = value.slice(0,7) === '_LOCAL_' ? value.slice(8) : value
    this.setCSSVariable(fontFamily)
    this.props.setDocumentFontFamily(fontFamily)
  }

  render() {
    return (
      <input 
        value={this.props.current}
        spellCheck={false}
        onChange={this.onSelect}
      />
    )
  }
}

const mapStateToProps = state => ({
  current: state.document.settings.fontFamily,
})

const mapDispatchToProps = dispatch => ({
  setDocumentFontFamily: (family) => dispatch(setDocumentFontFamily(family)),
})

export default connect(mapStateToProps, mapDispatchToProps)(FontFamilyInput)