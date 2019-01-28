import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ReactModal from 'react-modal'
import { RenderElement } from '../../renderMethods'
//import { updateElement, deleteElement } from '../../actions/document'
import EditElement from '../../renderMethods/editing'


class TopLevelElement extends React.Component {
  static propTypes = {
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    element: PropTypes.object.isRequired,
    canEdit: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    canEdit: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      modal: 'none',
    }
  }

  openEditor = () => this.setState({modal: 'edit'})
  closeModal = () => this.setState({modal: 'none'})

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
          id={this.props.id}
          element={this.props.element}
          onRequestClose={this.closeModal}
        />
      </ReactModal>
      </>
    )
  }
}

const mapStateToProps = state => ({
  canEdit: state.config.allowEditing,
})
//const mapDispatchToProps = dispatch => ({
//})

export default connect(mapStateToProps)(TopLevelElement)