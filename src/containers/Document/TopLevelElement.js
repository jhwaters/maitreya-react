import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ReactModal from 'react-modal'
import { RenderElement } from '../../renderMethods'
import { updateElement, deleteElement } from '../../actions/document'


class EditElement extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      type: props.type,
      data: props.data,
      options: props.options,
    }
  }

  applyEdits = () => {
    this.props.updateElement(this.state)
  }

  setData(data) {
    this.setState({data: data})
  }

  headingUpdate(row, lr, text) {
    let newrow = {...this.state.data[row]}
    newrow[lr] = text
    let newdata = [...this.state.data]
    newdata[row] = newrow
    this.setData(newdata)
  }

  headingAddRow = () => {
    const newdata = [...this.state.data, {left: '', right: ''}]
    this.setData(newdata)
  }

  headingRemoveRow = () => {
    const newdata = this.state.data.slice(0,-1)
    this.setData(newdata)
  }

  

  renderEditor() {
    if (this.state.type === 'header') {
      const data = this.state.data
      const inputStyle = {
        width: '100%',
        borderStyle: 'dashed',
        fontSize: '1em',
        fontFamily: 'var(--doc-font-family, sans-serif)',
        margin: '1mm',
      }
      return (
        <div>
        <p>
          Underscores will be translated into a blank underlined space.
        </p>
        <table className='header'>
          <tbody>
            {data.map((row, i) => {
              const {left, right} = row
              return (
                <tr key={i} >
                  <td style={{border: 'none', padding: '0 1em 0 0'}}>
                    <input 
                      onChange={(evt) => this.headingUpdate(i, 'left', evt.target.value)}
                      defaultValue={left || ''} 
                      style={inputStyle}
                    />
                  </td>
                  <td style={{border: 'none', padding: '0 1em 0 0'}}>
                    <input 
                      onChange={(evt) => this.headingUpdate(i, 'right', evt.target.value)}
                      defaultValue={right || ''} 
                      style={inputStyle}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <button onClick={this.headingRemoveRow}>-</button>
        <button onClick={this.headingAddRow}>+</button>
        </div>
      )
    } else {
      return <div>Editing is not yet implemented for this type of element.</div>
    }
  }

  renderPreview() {
    return (
      <div className='document' style={{
        padding: '1cm', 
        margin: '0 1cm', 
        border: '1px solid grey', 
        backgroundColor: 'white',
        overflow: 'clip',
        fontSize: '1.2em',
      }}>
        <RenderElement content={this.state} />
      </div>
    )
  }

  render() {
    return (
      <>
          <div style={{
            width: '100%',
            display: 'grid', 
            gridTemplateColumns: 'auto auto 1fr auto',
            margin: '0 0 5mm 0',
          }}>
            <button onClick={this.applyEdits}>Apply Changes</button>
            <button onClick={this.props.onRequestClose}>Cancel</button>
            <span />
            <button onClick={this.props.onRequestDelete} style={{justifySelf: 'right'}}>Delete</button>
          </div>
        {this.renderEditor()}
        <p style={{marginTop: '5mm'}}>Preview:</p>
        {this.renderPreview()}
      </>
    )
  }
}


class TopLevelElement extends React.Component {
  static propTypes = {
    //id: PropTypes.number.isRequired || PropTypes.string,
    element: PropTypes.object,
    canEdit: PropTypes.bool,
    updateElement: PropTypes.func,
    deleteElement: PropTypes.func,
  } 

  constructor(props) {
    super(props)
    this.state = {
      modal: 'none',
    }
  }

  openEditor = () => this.setState({modal: 'edit'})
  closeModal = () => this.setState({modal: 'none'})

  updateSelf = (newelement) => {
    this.props.updateElement(this.props.id, newelement)
    this.closeModal()
  }

  deleteSelf = () => {
    this.props.deleteElement(this.props.id)
    this.closeModal()
  }

  render() {
    const divprops = (
      this.props.canEdit 
      ? {className: 'editable', onDoubleClick: this.openEditor, title: 'Double-click to edit'} 
      : {}
    )
    return (
      <>
      <div {...divprops}>
        <RenderElement content={this.props.element} />
      </div>
      <ReactModal isOpen={this.state.modal === 'edit'}
        onRequestClose={this.closeModal}
        style={{
          //content: {
          //  top: '20%'
          //}
        }}
      >
        <EditElement 
          type={this.props.element.type} 
          data={this.props.element.data} 
          options={this.props.element.options} 
          updateElement={this.updateSelf}
          onRequestClose={this.closeModal}
          onRequestDelete={this.deleteSelf}
        />
      </ReactModal>
      </>
    )
  }
}

const mapStateToProps = state => ({
  canEdit: state.config.allowEditing,
})
const mapDispatchToProps = dispatch => ({
  updateElement: (id, elem) => dispatch(updateElement(id, elem)),
  deleteElement: (id) => dispatch(deleteElement(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(TopLevelElement)