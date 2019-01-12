import { defaultsDeep } from 'lodash'
import React from 'react'
import ReactModal from 'react-modal'
import renderElement from '../../../renderMethods/renderElement'


const defaultOptions = {
  markdown: {
    render: true,
    superscript: true,
    subscript: true,
    smartarrows: true,
  },

  math: {
    render: true,
    delimiters: {
      display: {left: '$$$', right: '$$$'},
      inline: {left: '$$', right: '$$'},
    },
  }

};

function parseElem(elem, options={}) {
  let result = {}
  if (typeof elem === 'object') {
    result.data = elem.data
    result.type = elem.type || 'text'
    result.options = defaultsDeep({}, elem.options || {}, options, defaultOptions)
  } else {
    result.data = elem
    result.type = 'text'
    result.options = defaultsDeep({}, options, defaultOptions)
  }
  return result
}


class EditableElement extends React.Component {
  constructor(props) {
    super()
    this.state = {
      active: false,
      editing: React.createRef(),
      ...parseElem(props.element, props.options)
    }
  }

  options() {
    return defaultsDeep({}, this.props.options || {}, defaultOptions)
  }

  openEditor = () => this.setState({active: true})
  closeEditor = () => this.setState({active: false})

  update = () => {
    this.setState({data: this.state.editing.value})
  }

  render() {
    return (
      <React.Fragment>
        <span onDoubleClick={this.openEditor}>
          {renderElement({data: this.state.data, type: this.state.type}, this.state.options)}
        </span>
        <ReactModal isOpen={this.state.active}
          onRequestClose={this.closeEditor}
          style={{content: {
          }}}
        >
          <h4>Editing!</h4>
          <textarea ref={this.state.editing} contentEditable={true} defaultValue={JSON.stringify(this.state.data)}></textarea>
          <button onClick={this.update}>Update</button>

        </ReactModal>
      </React.Fragment>
    )
  }
}

export default EditableElement