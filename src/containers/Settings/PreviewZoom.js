import React from 'react'
import PropTypes from 'prop-types'

class PreviewZoom extends React.Component {
  static propTypes = { type: PropTypes.string.isRequired }

  static defaultProps = { type: 'selection' }

  constructor(props) {
    super(props)
    this.selection = React.createRef()
    this.default = 110
    this.setPreviewZoom(this.default)
  }

  setPreviewZoom(perc) {
    const scale = perc / 100.0
    
    const transform = `matrix(${[scale, 0, 0, scale, 0, 0].join(',')})`
    document.body.style.setProperty('--previewInnerTransform', transform)
  }

  setFromInput = () => {
    const magnification = +this.selection.current.value
    this.setPreviewZoom(magnification)
  }

  render() {
    if (this.props.type === 'input') {
      return (
        <input
          ref={this.selection} 
          type="number"
          min="70"
          max="150"
          step="5"
          defaultValue={this.default}
          onChange={this.setFromInput}
        ></input>
      )
    } else {
      const options = [70, 80, 90, 100, 110, 120, 130, 140, 150]
      return (
        <select
          ref={this.selection}
          defaultValue={this.default}
          onChange={this.setFromInput}>
          {options.map((z) => <option key={`zoom-option-${z}`} value={z}>{z}</option>)}
        </select>
      )
    }
  }
}

export default PreviewZoom