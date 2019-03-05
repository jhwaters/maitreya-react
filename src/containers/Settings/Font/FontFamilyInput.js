import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setDocumentFontFamily } from '../../../actions/style'


class FontFamilyInput extends React.Component {
  static propTypes = {
    current: PropTypes.string,
    setDocumentFontFamily: PropTypes.func,
  }

  onChange = evt => {
    const fontFamily = evt.target.value
    this.props.setDocumentFontFamily(fontFamily)
  }

  render() {
    return (
      <input type="text"
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