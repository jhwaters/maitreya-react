import React from 'react'
import styles from './styles.css'
import { connect } from 'react-redux'
import { updateDocumentSettings } from '../../actions/document'


const SerifFonts = [
  {name: '== Serif Fonts ==', disabled: true},
  {name: 'Andada'},
  {name: 'Lora'},
  {name: 'PT Serif'},
  {name: 'Quattrocento'},
]

const SansFonts = [
  {name: '== Sans-Serif Fonts ==', disabled: true},
  {name: 'Open Sans'},
  {name: 'Roboto'},
]

const OtherFonts = [
  {name: '== Test ==', disabled: true},
  {name: 'Source Serif Pro'},
  {name: 'Source Sans Pro'},
]


const fontList = [
  {name: 'Browser Default', family: 'serif', size: '3.5mm'},
  ...SerifFonts,
  ...SansFonts,
  ...OtherFonts,
]

function getFont(name) {
  for (const f of fontList) {
    if (f.name === name) {
      return {
        fontFamily: f.family ? f.family : f.name,
        fontSize: f.size ? f.size : '3mm',
      }
    }
  }
}

class Settings extends React.Component {
  constructor() {
    super()
    this.docFont = React.createRef()
    this.startNumbering = React.createRef()
    this.state = {
      modal: 'none',
    }
  }

  setDocFont = () => {
    const name = this.docFont.current.value
    const font = getFont(name)
    if (font) {
      document.body.style.setProperty('--docFontFamily', font.fontFamily)
      document.body.style.setProperty('--docFontSize', font.fontSize)
      this.props.updateDocumentSettings(font)
      this.props.onRequestClose()
    }
  }

  setNumbering = () => {
    const startat = this.startNumbering.current.value
    if (startat) {
      this.props.updateDocumentSettings({startNumbering: startat})
    }
    this.props.onRequestClose()
  }

  renderFontSelection() {
    return fontList.map((f,i) => {
      if (f.disabled) {
        return (
          <option 
            value={f.name}
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
    return (
      <div className={styles.Settings} style={{marginBottom: '1cm'}}>
        <h3>Settings </h3>

        <span style={{fontSize: '3mm'}}>Font Family: </span> 
        <select ref={this.docFont} defaultValue={this.props.document.fontFamily}>
          {this.renderFontSelection()}
        </select>
        <button onClick={this.setDocFont}>Apply</button>

        <br />

        <span style={{fontSize: '3mm'}}>Start Numbering At: </span>
        <input type='number' min='1' ref={this.startNumbering} style={{width: '2rem'}}></input>
        <button onClick={this.setNumbering}>Apply</button>
      </div>
    )
  }
}



const mapStateToProps = state => ({
  document: {
    fontFamily: state.document.settings.fontFamily,
  }
})

const mapDispatchToProps = dispatch => ({
  updateDocumentSettings: (props) => dispatch(updateDocumentSettings(props)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Settings)