import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { setDocumentFontFamily } from '../../../actions/style'
import { addFontFamily } from '../../../actions/config'


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
  'cmu_concrete': 'CMU Concrete',
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
  }

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
    //this.setCss(fontFamily)
    this.props.setDocumentFontFamily(fontFamily)
  }

  setFromPrompt = () => {
    const family = window.prompt(`Enter Font Name
(this should be the name of a font already installed on your computer)`)
    if (family) {
      this.props.addFontFamily(family)
      this.setFontFamily(family)
    }
  }

  onChange = (evt) => {
    const value = evt.target.value
    if (value === '__CUSTOM__') {
      this.setFromPrompt()
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
      </>
    )
  }
}

const mapStateToProps = state => ({
  current: state.style.fontFamily,
  localFonts: [...state.config.localFonts],
})

const mapDispatchToProps = dispatch => ({
  addFontFamily: f => dispatch(addFontFamily(f)),
  setDocumentFontFamily: (family) => dispatch(setDocumentFontFamily(family)),
})

export default connect(mapStateToProps, mapDispatchToProps)(FontFamilySelect)