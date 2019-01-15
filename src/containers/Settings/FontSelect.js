import React from 'react'
import { connect } from 'react-redux'
import { updateDocumentSettings } from '../../actions/document'


const MainFonts = [
  {name: 'EB Garamond', size: '10pt'},
  {name: 'Fira Sans'},
  {name: 'Lora'},
  {name: 'Open Sans'},
  {name: 'PT Serif'},
  {name: 'Roboto'},
  {name: 'Quattrocento'},
]


const OtherFonts = [
  {name: 'Browser default serif', family: 'serif'},
  {name: 'Browser default sans', family: 'sans-serif'},
]

const fontList = [
  {name: 'Select Font', disabled: true},
  {name: '-------', disabled: true},
  ...MainFonts,
  ...OtherFonts,
]

function getFont(name) {
  for (const f of fontList) {
    if (f.name === name) {
      return {
        fontFamily: f.family ? f.family : f.name,
        fontSize: f.size ? f.size : '9pt',
      }
    }
  }
}

class FontSelect extends React.Component {
  constructor(props) {
    super(props)
    this.selection = React.createRef()
  }

  setDocFont = () => {
    const name = this.selection.current.value
    const font = getFont(name)
    if (font) {
      document.body.style.setProperty('--docFontFamily', font.fontFamily)
      document.body.style.setProperty('--docFontSize', font.fontSize)
      this.props.updateDocumentSettings(font)
    }
  }

  renderFontList() {
    return fontList.map((f,i) => {
      if (f.disabled) {
        return (
          <option 
            value='0'
            key={`fontSelection-${i}`}
            disabled={true}
          >{f.name}</option>
        )
      } else {
        return (
          <option 
            value={f.name}
            key={`fontSelection-${i}`}
          >{f.name}</option>
        )
      }
    })
  }

  render() {
    if (this.props.applyButton) {
      return (
        <>
          <select ref={this.selection}
            defaultValue={this.props.defaultFamily}
          >{this.renderFontList()}</select>
          <button onChange={this.setDocFont}>Apply</button>
        </>
      )
    } else {
      return (
        <>
          <select ref={this.selection}
            defaultValue={this.props.defaultFamily}
            onChange={this.setDocFont}
          >{this.renderFontList()}</select>
        </>
      )
    }
  }
}


const mapStateToProps = state => ({
  defaultFamily: state.document.settings.fontFamily,
})

const mapDispatchToProps = dispatch => ({
  updateDocumentSettings: (settings) => dispatch(updateDocumentSettings(settings)),
})

export default connect(mapStateToProps, mapDispatchToProps)(FontSelect)