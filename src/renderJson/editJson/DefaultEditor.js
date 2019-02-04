import React from 'react'
import PropTypes from 'prop-types'
import { RenderJson, parseJson } from '..'

export default class DefaultEditor extends React.Component {
  static propTypes = {
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    json: PropTypes.array,
    onUpdateElement: PropTypes.func.isRequired,
    onDeleteElement: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = parseJson(props.json)
  }

  stateToJson() {
    return [this.state.type, this.state.props, ...this.state.children]
  }

  updateAndClose = () => {
    this.props.onUpdateElement(this.props.id, this.stateToJson())
    this.props.onRequestClose()
  }

  deleteAndClose = () => {
    this.props.onDeleteElement(this.props.id)
    this.props.onRequestClose()
  }

  revertChanges = () => {
    this.setState(parseJson(this.props.json))
  }

  renderEditor() {
    return <div>Editing is not yet implemented for this type of element.</div>
  }

  renderPreview() {
    const json = [...this.stateToJson()]
    return (
      <div className='document preview-area' style={{margin: '3mm 1mm'}}>
        <RenderJson json={json} />
      </div>
    )
  }

  render() {
    return (
      <>
        <div style={{
          width: '100%',
          display: 'grid', 
          gridTemplateColumns: 'auto auto auto 1fr auto',
          margin: '0 0 5mm 0',
        }}>
          <button onClick={this.updateAndClose}>Apply Changes</button>
          <button onClick={this.revertChanges}>Revert Changes</button>
          <button onClick={this.props.onRequestClose}>Cancel</button>
          <span />
          <button onClick={this.deleteAndClose} style={{justifySelf: 'right'}}>Delete</button>
        </div>
        {this.renderEditor()}
        {this.renderPreview()}
      </>
    )
  }
}
