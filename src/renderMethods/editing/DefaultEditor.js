import React from 'react'
import PropTypes from 'prop-types'
import { renderElement } from '..'




class DefaultEditor extends React.Component {
  static propTypes = {
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    element: PropTypes.object.isRequired,
    onUpdateElement: PropTypes.func.isRequired,
    onDeleteElement: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      type: props.element.type,
      data: props.element.data || {},
      options: props.element.options || {},
    }
  }

  updateAndClose = () => {
    this.props.onUpdateElement(this.props.id, this.state)
    this.props.onRequestClose()
  }

  deleteAndClose = () => {
    this.props.onDeleteElement(this.props.id)
    this.props.onRequestClose()
  }

  setData(data) {
    this.setState({data: data})
  }

  revertChanges = () => {
    this.setState({
      type: this.props.element.type,
      data: this.props.element.data || {},
      options: this.props.element.options || {},
    })
  }

  renderEditor() {
    return <div>Editing is not yet implemented for this type of element.</div>
  }

  renderPreview() {
    return (
      <div className='document' style={{
        padding: '5mm', 
        margin: '5mm', 
        border: '1px solid grey', 
        backgroundColor: 'white',
        overflow: 'clip',
      }}>
        {renderElement(this.state)}
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


export default DefaultEditor