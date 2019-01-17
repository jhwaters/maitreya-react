import React from 'react'

class PreviewZoom extends React.Component {
  constructor(props) {
    super(props)
    this.input = React.createRef()
    this.default = 110
    this.setPreviewZoom(this.default)
  }

  setPreviewZoom(magnification) {
    const scale = magnification / 100.0
    const matrix = [scale, 0, 0, scale, (magnification-110)*1.5, (magnification-100)*10.8].join(',')
    document.body.style.setProperty('--previewZoom', `matrix(${matrix})`)
  }

  setFromInput = () => {
    const magnification = +this.input.current.value
    this.setPreviewZoom(magnification)
  }

  render() {
    return (
      <>
        <input
          ref={this.input} 
          type="number"
          min="70"
          max="150"
          step="5"
          defaultValue={this.default}
          onChange={this.setFromInput}
        ></input>
      </>
    )
  }
}

export default PreviewZoom