import React from 'react'
import { connect } from 'react-redux'
import { updateDocumentSettings } from '../../actions/document'


const fontDefaults = {
  size: 8,
  units: 'pt',
}

const GoogleFonts = [
  {name: 'EB Garamond', size: s => s+1},
  {name: 'IBM Plex Sans'},
  //{name: 'IBM Plex Serif'},  // Very distinct I and J, similar to Computer Modern
  {name: 'Inconsolata'},
  {name: 'Lora'},
  //{name: 'Quattrocento'},
  //{name: 'PT Serif'},  // J looks too much like I
  //{name: 'Source Sans Pro'},
  {name: 'Source Serif Pro'},
]

const BrowserFonts = [
  {name: 'Serif (browser default)', family: 'serif'},
  {name: 'Sans-serif (browser default)', family: 'sans-serif'},
]

const OtherFonts = []

const fontStyle = (font) => {
  let result = {}
  if (font.family) {
    result.fontFamily = font.family
  } else {
    result.fontFamily = font.name
  }
  if (font.size) {
    const units = font.units ? font.units : fontDefaults.units
    if (typeof font.size === 'function') {
      result.fontSize = `${font.size(fontDefaults.size)}${units}`
    } else {
      result.fontSize = `${font.size}${units}`
    }
  } else {
    result.fontSize = fontDefaults.size + fontDefaults.units
  }
  return result
}

class FontSelect extends React.Component {
  constructor(props) {
    super(props)
    this.selection = React.createRef()
    this.setCSSVariables(this.props.defaultFont)
  }

  fontList = () => [...GoogleFonts, ...BrowserFonts, ...OtherFonts]

  getFont(name) {
    if (name.slice(0,7) === '_LOCAL_') {
      for (const f of this.props.localFonts) {
        if (f.name === name.slice(8)) {
          return fontStyle(f)
        }
      }
    } else {
      for (const f of this.fontList()) {
        if (f.name === name) {
          return fontStyle(f)
        }
      }
    }
  }

  setCSSVariables(font) {
    document.body.style.setProperty('--docFontFamily', font.fontFamily)
    document.body.style.setProperty('--docFontSize', font.fontSize)
    document.body.style.setProperty('--docMathFontSize', font.fontSize)
  }

  setDocFont(font) {
    this.props.updateDocumentSettings(font)
  }

  setFromSelection = () => {
    const name = this.selection.current.value
    const font = this.getFont(name)
    if (font) {
      this.setCSSVariables(font)
      this.setDocFont(font)
    }
  }  

  renderDefaultFonts() {
    const fontList = this.fontList()
    return (
      <>
      {fontList.map((f,i) => (
        <option 
          value={f.name}
          key={`fontSelection-${i}`}
        >{f.name}</option>
      ))}
      </>
    )
  }

  renderLocalFonts() {
    return this.props.localFonts.sort((a, b) => a['name'] - b['name']).map((f,i) => (
      <option 
        value={`_LOCAL_:${f.name}`}
        key={`fontSelectionLocal-${i}`}
      >{f.name} (Local)</option>
    ))
  }

  render() {
    if (this.props.applyButton) {
      return (
        <>
          <select ref={this.selection}
            defaultValue={this.props.defaultFont.fontFamily}
          >
            <option value="0" disabled>Select Font</option>
            <option value="0" disabled>-----------</option>
            {this.renderDefaultFonts()}
            {this.renderLocalFonts()}
          </select>
          <button onClick={this.setDocFont}>Apply</button>
        </>
      )
    } else {
      return (
        <>
          <select ref={this.selection}
            defaultValue={this.props.defaultFont.fontFamily}
            onChange={this.setFromSelection}
          >
            <option value="0" disabled>Select Font</option>
            <option value="0" disabled>-----------</option>
            {this.renderDefaultFonts()}
            {this.renderLocalFonts()}
          </select>
        </>
      )
    }
  }
}


const mapStateToProps = state => ({
  defaultFont: {
    fontFamily: state.document.settings.fontFamily,
    fontSize: state.document.settings.fontSize,
  },
  localFonts: state.config.localFonts,
})

const mapDispatchToProps = dispatch => ({
  updateDocumentSettings: (settings) => dispatch(updateDocumentSettings(settings)),
})

export default connect(mapStateToProps, mapDispatchToProps)(FontSelect)