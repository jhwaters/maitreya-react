import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { setDocumentFontFamily } from '../../../actions/style'


const GoogleFonts = [
  //{family: 'CharisSILRegular', label: 'Charis SIL'},
  {family: 'CMU Serif'},
  //{family: 'Inconsolata'},
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


function renderFontOption(font) {
  const {family, label} = font
  if (family === "0") {
    const optionLabel = label ? label : "---"
    return (
      <option key={`font-null-${optionLabel}`}
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
    current: PropTypes.string,
    localFonts: PropTypes.array.isRequired,
    setDocumentFontFamily: PropTypes.func.isRequired,
  }

  static defaultProps = {
    localFonts: [],
  }

  constructor(props) {
    super(props)
    this.setCss(props.current)
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
    if (fontFamily) {
      this.setFontFamily(fontFamily)
    }
  }

  render() {
    return (
      <>
        <select
          value={this.props.current}
          onChange={this.onChange}
        >
          {this.fontList().map((f) => renderFontOption(f))}
        </select>
      </>
    )
  }
}


const mapStateToProps = state => ({
  current: state.style.fontFamily,
  localFonts: [...state.config.localFonts],
})

const mapDispatchToProps = dispatch => ({
  setDocumentFontFamily: (family) => dispatch(setDocumentFontFamily(family)),
})

export default connect(mapStateToProps, mapDispatchToProps)(FontFamilySelect)