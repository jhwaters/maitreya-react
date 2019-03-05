import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { AddFontPopup } from '../../Modals'
import { setDocumentFontFamily } from '../../../actions/style'

const DefaultFonts = [
  /*
  'Alegreya',
  'Alegreya Sans',
  'Arima Madurai',
  'BioRhyme',
  'EB Garamond',
  'Fira Sans',
  //'Gentium Basic',
  //'Handlee',
  'IBM Plex Sans',
  'IBM Plex Serif',
  //'Inconsolata',
  //'Jura',
  'Lora',
  //'Merriweather',
  //'Noticia Text',
  //'Noto Sans',
  'Noto Serif',
  'Old Standard TT',
  'Raleway',
  'Roboto',
  'Roboto Slab',
  'Signika',
  'Source Serif Pro',
  'Ubuntu',
  */
]

const BrowserFonts = [
  'sans-serif',
  'serif',
  '__CUSTOM__',
]

const fontLabels = {
  '__CUSTOM__': 'other',
  'cmu_bright': 'CMU Bright',
  'cmu_concrete': 'CMU Concrete',
  'cmu_sansserif': 'CMU Sans',
  'cmu_serif': 'CMU Serif',
  'katex_sansserif': 'KaTeX Sans',
  'katex_main': 'KaTeX Serif',
  'sans-serif': 'sans-serif (browser)',
  'serif': 'serif (browser)'
}

function fontSort(a, b) {
  const aName = (fontLabels[a] || a).toUpperCase()
  const bName = (fontLabels[b] || b).toUpperCase()
  if (aName < bName) { return -1 }
  if (aName > bName) { return 1}
  return 0
}

function renderFontOption(family) {
  if (family) {
    const label = fontLabels[family] || family
    return (
      <option key={`font-${family}`}
        value={family}
        title={family === '__CUSTOM__' ? 'Choose a font not on this list' : ''}
        >{label}</option>
    )
  }
  return <option key={0} value="0" disabled={true}>---</option>
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
    this.state = {
      modal: 'none',
    }
  }

  openFontInput = () => this.setState({modal: 'AddFont'})
  closeModal = () => this.setState({modal: 'none'})

  fontList = () => {
    const result = [
      ...[
        ...DefaultFonts, 
        ...this.props.localFonts
      ].sort(fontSort), 
      ...BrowserFonts,
      
    ]
    return result
  }

  setFontFamily(fontFamily) {
    this.props.setDocumentFontFamily(fontFamily)
  }

  onChange = (evt) => {
    const value = evt.target.value
    if (value === '__CUSTOM__') {
      this.openFontInput()
    } else {
      this.setFontFamily(value)
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
        <AddFontPopup isOpen={this.state.modal === 'AddFont'} onRequestClose={this.closeModal} />
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