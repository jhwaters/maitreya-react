import React from 'react'
import { connect } from 'react-redux'
import { updateDocumentSettings } from '../../actions/document'

const MarginOptions = ['10mm', '15mm', '20mm', '25mm']


class SetPageMargins extends React.Component {
  constructor(props) {
    super(props)
    this.selection = React.createRef()
  }

  setPageMargins = () {
    const marginSize = this.selection.current.value
  }



  renderOptions() {
    return (
      <>
        {MarginOptions.map((m) => {
          return (
            <option key={`margin-select-${m}`} value={m}>{m}</option>
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
          default={this.props.default}
          >
          {this.renderOptions()}
        </select>
        <button onClick={this.setPageMargins}>Apply</button>
        </>
      )
    } else {
      return (
        <select ref={this.selection}
          onChange={this.setPageMargins}
          default={this.props.default}
          >
          {this.renderOptions()}
        </select>
      )
    }
    
  }
}


const mapStateToProps = state => ({
  default: state.document.settings.pageMargin
})
const mapDispatchToProps = dispatch => ({
  updateDocumentSettings: (settings) => dispatch(updateDocumentSettings(settings))
})

export default connect(mapStateToProps, mapDispatchToProps)(SetPageMargins)