import React from 'react'
import PropTypes from 'prop-types'

class PreviewZoom extends React.Component {
  static propTypes = {
    defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    values: PropTypes.arrayOf(PropTypes.number),
    type: PropTypes.string.isRequired,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    options: PropTypes.arrayOf(PropTypes.number),
  }

  static defaultProps = {
    defaultValue: 100,
    type: 'input',
    min: 30,
    max: 200,
    step: 10,
    options: [25, 50, 75, 100, 125, 150, 175, 200],
  }

  constructor(props) {
    super(props)
    this.state = { zoom: props.defaultValue }
  }

  setZoom() {
    const perc = this.state.zoom
    const scale = perc / 100.0
    const transform = `matrix(${[scale, 0, 0, scale, 0, 0].join(',')})`
    document.body.style.setProperty('--previewInnerTransform', transform)
  }

  updateState = evt => {
    const zoom = +evt.target.value
    this.setState({ zoom })
  }

  zoomIn = () => {
    const zoom = Math.min(+this.state.zoom + this.props.step, this.props.max)
    this.setState({ zoom })
  }

  zoomOut = () => {
    const zoom = Math.max(+this.state.zoom - this.props.step, this.props.min)
    this.setState({ zoom })
  }

  componentDidMount() {
    this.setZoom()
  }

  componentDidUpdate() {
    this.setZoom()
  }

  renderInput() {
    return (
      <input
        type="number"
        min={this.props.min}
        max={this.props.max}
        step={this.props.step}
        value={this.state.zoom}
        onChange={this.updateState}
      ></input>
    )
  }

  renderSelect() {
    return (
      <select
        value={this.state.zoom}
        onChange={this.updateState}>
        {this.props.options.map((z) => <option key={`zoom-option-${z}`} value={z}>{z}</option>)}
      </select>
    )
  }

  renderButtons() {
    return (
      <>
        <button onClick={this.zoomOut}>-</button>
        <button onClick={this.zoomIn}>+</button>
      </>
    )
  }

  render() {
    if (this.props.type === 'input') {
      return this.renderInput()
    }
    if (this.props.type === 'select') {
      return this.renderSelect()
    }
    if (this.props.type === 'buttons') {
      return this.renderButtons()
    }
  }
}

export default PreviewZoom