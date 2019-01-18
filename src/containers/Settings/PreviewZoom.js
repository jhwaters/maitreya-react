import React from 'react'

class PreviewZoom extends React.Component {
  constructor(props) {
    super(props)
    this.selection = React.createRef()
    this.default = 110
    this.setPreviewZoom(this.default)
  }

  setPreviewZoom(magnification) {
    const scale = magnification / 100.0
    const matrix = [scale, 0, 0, scale, (magnification-110)*1.5, (magnification-100)*10.8].join(',')
    document.body.style.setProperty('--previewZoom', `matrix(${matrix})`)
  }

  setFromInput = () => {
    const magnification = +this.selection.current.value
    this.setPreviewZoom(magnification)
  }

  render() {
    if (this.props.type & this.props.type === 'input') {
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