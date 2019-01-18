import React from 'react'
import { connect } from 'react-redux'
import { updateDocumentSettings } from '../../actions/document'



/*
IBM Plex Serif looks very similar to Computer Modern,
which will be used in the LaTeX elements.
*/

const GoogleFonts = [
  {family: 'Lora'},
  {family: 'Roboto Slab'},
  {family: 'Source Sans Pro'},

  /*
  {family: 'EB Garamond'},
  {family: 'Vollkorn'},
  */
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

function renderFontOption({family, label}) {
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

class FontFamilySelect extends React.Component {
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
    this.props.updateDocumentSettings({ fontFamily })
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
      return (
        <>
          <select ref={this.selection}
            defaultValue={this.props.default}
          >
            {this.fontList().map((f) => renderFontOption(f))}
          </select>
          <button onClick={this.setDocFont}>Apply</button>
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
  updateDocumentSettings: (settings) => dispatch(updateDocumentSettings(settings)),
})

export default connect(mapStateToProps, mapDispatchToProps)(FontFamilySelect)