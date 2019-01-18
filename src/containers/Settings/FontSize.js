import React from 'react'
import { connect } from 'react-redux'
import { updateDocumentSettings } from '../../actions/document'



class FontSizeSelect extends React.Component {
  constructor(props) {
    super(props)
    this.selection = React.createRef()
    this.setCSSVariable(props.default)
  }

  setCSSVariable(fontSize) {
    document.body.style.setProperty('--doc-font-size', fontSize)
  }

  setDocFontSize(size) {
    this.props.updateDocumentSettings({fontSize: size})
  }

  setFromSelection = () => {
    const value = this.selection.current.value
    if (value) {
      this.setCSSVariable(value)
      this.setDocFontSize(value)
    }
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
    if (this.props.applyButton) {
      return (
        <>
          <select ref={this.selection}
            defaultValue={this.props.default}
          >
            {this.renderSizeOptions()}
          </select>
          <button onClick={this.setFromSelection}>Apply</button>
        </>
      )
    } else {
      return (
        <>
          <select ref={this.selection}
            defaultValue={this.props.default}
            onChange={this.setFromSelection}
          >
            {this.renderSizeOptions()}
          </select>
        </>
      )
    }
  }
}


const mapStateToProps = state => ({
  default: state.document.settings.fontSize,
})

const mapDispatchToProps = dispatch => ({
  updateDocumentSettings: (settings) => dispatch(updateDocumentSettings(settings)),
})

export default connect(mapStateToProps, mapDispatchToProps)(FontSizeSelect)