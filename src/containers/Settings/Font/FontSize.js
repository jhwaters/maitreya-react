import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setDocumentFontSize } from '../../../actions/style'


class FontSizeSelect extends React.Component {

  static propTypes = {
    current: PropTypes.string.isRequired,
    setDocumentFontSize: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.setCss(props.current)
  }

  setCss(fontSize) {
    document.body.style.setProperty('--doc-font-size', fontSize)
  }

  setDocFontSize(size) {
    this.setCss(size)
    this.props.setDocumentFontSize(size)
  }

  onChange = (evt) => {
    this.setDocFontSize(evt.target.value)
  }  

  renderSizeOptions() {
    const options = [5, 6, 7, 8, 9, 10, 11, 12, 13]
    return (
      <>
      {options.map((s) => {
        const size = `${s}pt`
        return (
          <option 
            value={size}
            key={`fontOption-${size}`}
          >{size}</option>
        )
      })}
      </>
    )
  }

  render() {
    return (
      <>
        <select 
          value={this.props.current}
          onChange={this.onChange}
        >
          {this.renderSizeOptions()}
        </select>
      </>
    )
  }
}


const mapStateToProps = state => ({
  current: state.style.fontSize,
})

const mapDispatchToProps = dispatch => ({
  setDocumentFontSize: (size) => dispatch(setDocumentFontSize(size)),
})

export default connect(mapStateToProps, mapDispatchToProps)(FontSizeSelect)