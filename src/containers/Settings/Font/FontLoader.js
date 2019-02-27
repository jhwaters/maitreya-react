import React from 'react'
import PropTypes from 'prop-types'
import WebFont from 'webfontloader'
import { connect } from 'react-redux'
import { addFontFamily } from '../../../actions/config'
import { setDocumentFontFamily } from '../../../actions/style'
import { includes } from 'lodash'


const googleFonts = [
  'ABeeZee',
  //'Alegreya',
  //'Alegreya Sans',
  'Arima Madurai',
  //'BioRhyme',
  //'Cormorant',
  'EB Garamond',
  'Fira Sans',
  //'Gentium Basic',
  //'Handlee',
  'IBM Plex Sans',
  //'IBM Plex Serif',
  //'Inconsolata',
  //'Jura',
  'Lora',
  //'Merriweather',
  //'Neuton',
  'Noticia Text',
  //'Noto Sans',
  //'Noto Serif',
  //'Old Standard TT',
  //'Raleway',
  //'Roboto',
  'Roboto Slab',
  //'Signika',
  //'Source Sans Pro',
  //'Source Serif Pro',
  'Ubuntu',
  //'Zilla Slab',
].sort()

const fontStyles = {
  default: '400,400i,700,700i',
  //'Jura': '500,700',
  //'Signika': '300,700',
  //'Ubuntu': '300,300i,700,700i',
  'BioRhyme': '300,700',
  'Merriweather': '300,300i,700,700i',
}

class FontLoader extends React.Component {
  static propTypes = {
    addFontFamily: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
  }

  static defaultProps = {
    type: 'button'
  }

  constructor(props) {
    super(props)
    const toAdd = googleFonts.filter(f => !includes(this.props.localFonts, f))
    
    this.state = {
      input: '',
      selection: toAdd[0],
      toAdd,
    }
  }

  updateInput = evt => {
    this.setState({input: evt.target.value})
  }

  updateSelection = evt => {
    this.setState({selection: evt.target.value})
  }

  setFont(family) {
    this.props.setDocumentFontFamily(family)
  }

  addFont(family) {
    //this.props.setDocumentFontFamily(family)
    this.props.addFontFamily(family)
    const toAdd = this.state.toAdd.filter(f => f !== family)
    this.setState({toAdd, selection: toAdd[0]})
  }

  loadFont = (family) => {
    const request = `${family}:${fontStyles[family] || fontStyles.default}`
    WebFont.load({
      google: {
        families: [request]
      },
      fontactive: () => this.addFont(family),
      fontinactive: () => console.error(`Could not load font ${family}`),
    })
  }

  loadAll = () => {
    if (this.state.toAdd.length === 1) {
      return null
    }
    WebFont.load({
      google: {
        families: this.state.toAdd.map(f => `${f}:${fontStyles[f] || fontStyles.default}`)
      },
      fontactive: (family) => this.addFont(family),
      fontinactive: (family) => console.error(`Could not load font ${family}`),
    })
  }

  loadInputFont = () => {
    const family = this.state.input
    if (family) {
      this.loadFont(family)
    }
  }

  loadSelectedFont = () => {
    const family = this.state.selection
    if (family) {
      if (family === '__LOAD_ALL_WEB_FONTS__') {
        this.loadAll()
      } else {
        this.loadFont(family)
      }
    }
  }

  renderButton() {
    return (
      <button onClick={this.loadAll}
      >{this.props.children}</button>
    )
  }

  renderInput() {
    return (
      <>
      <input type="text" 
        onChange={this.updateInput} 
        value={this.state.input}
        placeholder="Enter Font Name"
        
      ></input>
      <button onClick={this.loadInputFont}
        title="Load from Google Fonts"
      >{this.props.children}</button>
      </>
    )
  }

  renderSelect() {
    return (
      <>
      <select 
        value={this.state.selection}
        onChange={this.updateSelection}
      >
        {this.state.toAdd.map(f => <option key={`ff-${f}`} value={f}>{f}</option>)}
        <option value="__LOAD_ALL_WEB_FONTS__">Load All Web Fonts</option>
      </select>
      <button onClick={this.loadSelectedFont}>Load</button>
      </>
    )
  }

  render() {
    if (this.props.type === 'button') {
      return this.renderButton()
    }
    if (this.props.type === 'input') {
      return this.renderInput()
    }
    if (this.props.type === 'select') {
      return this.renderSelect()
    }
  }
}

const mapStateToProps = state => ({
  localFonts: state.config.localFonts,
})
const mapDispatchToProps = dispatch => ({
  addFontFamily: f => dispatch(addFontFamily(f)),
  setDocumentFontFamily: f => dispatch(setDocumentFontFamily(f)),
})

export default connect(mapStateToProps, mapDispatchToProps)(FontLoader)