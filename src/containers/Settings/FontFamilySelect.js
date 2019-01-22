import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { setDocumentFontFamily } from '../../actions/document'


const GoogleFonts = [
  //{family: 'CharisSILRegular', label: 'Charis SIL'},
  {family: 'CMUSerifRoman', label: 'CMU Serif'},
  {family: 'Inconsolata'},
  {family: 'Lora'},
  {family: 'Source Sans Pro'},
]

const BrowserFonts = [
  {label: 'Serif (browser default)', family: 'serif'},
  {label: 'Sans-serif (browser default)', family: 'sans-serif'},
]

function fontSort(a, b) {
  const aName = (a.label ? a.label : a.family).toUpperCase()
  const bName = (b.label ? b.label : b.family).toUpperCase()
  if (aName < bName) { return -1 }
  if (aName > bName) { return 1}
  return 0
}

let nullkey = 0

function renderFontOption(font) {
  const {family, label} = font
  if (family === "0") {
    const optionLabel = label ? label : "---"
    return (
      <option key={`font-null-${++nullkey}`}
        value="0"
        disabled
      >{optionLabel}</option>
    )
  } else {
    const optionLabel = label ? label : family
    return (
      <option key={`font-family-option-${family}`}
        value={family}
        >{optionLabel}</option>
    )
  }
}



//////////////////////////////
//
// COMPONENT
//
////////////////////////////


class FontFamilySelect extends React.Component {
  static propTypes = {
    applyButton: PropTypes.bool.isRequired || PropTypes.string.isRequired,
    default: PropTypes.string,
    localFonts: PropTypes.array.isRequired,
    setDocumentFontFamily: PropTypes.func.isRequired,
  }

  static defaultProps = {
    applyButton: false,
    localFonts: [],
  }

  constructor(props) {
    super(props)
    this.selection = React.createRef()
    this.setCSSVariable(props.default)
  }

  fontList = () => {
    let result = [
      ...GoogleFonts.sort(fontSort),
      ...BrowserFonts, 
    ]
    if (this.props.localFonts.length > 0) {
      result.push({family: "0"})
      result = result.concat(this.props.localFonts.sort(fontSort))
    }
    return result
  }

  setCSSVariable(fontFamily) {
    document.body.style.setProperty('--doc-font-family', fontFamily)
  }

  setDocFontFamily(fontFamily) {
    this.props.setDocumentFontFamily(fontFamily)
  }

  setFromSelection = () => {
    const value = this.selection.current.value
    const fontFamily = value.slice(0,7) === '_LOCAL_' ? value.slice(8) : value
    if (fontFamily) {
      this.setCSSVariable(fontFamily)
      this.setDocFontFamily(fontFamily)
    }
  }  

  render() {
    if (this.props.applyButton) {
      const buttonLabel = this.props.applyButton === true ? 'Apply' : this.props.applyButton
      return (
        <>
          <select ref={this.selection}
            defaultValue={this.props.default}
          >
            {this.fontList().map((f) => renderFontOption(f))}
          </select>
          <button onClick={this.setFromSelection}>{buttonLabel}</button>
        </>
      )
    } else {
      return (
        <>
          <select ref={this.selection}
            defaultValue={this.props.default}
            onChange={this.setFromSelection}
          >
            {this.fontList().map((f) => renderFontOption(f))}
          </select>
        </>
      )
    }
  }
}


const mapStateToProps = state => ({
  default: state.document.settings.fontFamily,
  localFonts: [...state.config.localFonts],
})

const mapDispatchToProps = dispatch => ({
  setDocumentFontFamily: (family) => dispatch(setDocumentFontFamily(family)),
})

export default connect(mapStateToProps, mapDispatchToProps)(FontFamilySelect)