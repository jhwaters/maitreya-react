import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ReactModal from 'react-modal'
import { RenderJson, EditJson, parseJson } from '../../renderJson'



class TopLevelElement extends React.Component {
  static propTypes = {
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    json: PropTypes.array.isRequired,
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
    const divprops = {}
    const classNames = []
    if (this.props.canEdit) {
      classNames.push('editable')
      divprops.onDoubleClick = this.openEditor
    }
    if (this.props.columns) {
      const elemprops = parseJson(this.props.json).props
      if (elemprops.options && elemprops.options.singleColumn) {
        classNames.push('single-column')
      }
    }

    if (classNames.length) {
      divprops.className = classNames.join(' ')
    }
    return (
      <>
      <div {...divprops}>
        <RenderJson json={this.props.json} />
      </div>
      <ReactModal isOpen={this.state.modal === 'edit'}
        onRequestClose={this.closeModal}
        style={{
          content: {
            margin: '20px'
          }
        }}
      >
        <EditJson
          id={this.props.id}
          json={this.props.json}
          onRequestClose={this.closeModal}
        />
      </ReactModal>
      </>
    )
  }
}

const mapStateToProps = state => ({
  canEdit: state.config.allowEditing,
  columns: state.style.columns,
})
//const mapDispatchToProps = dispatch => ({
//})

export default connect(mapStateToProps)(TopLevelElement)