import React from 'react'
import PropTypes from 'prop-types'
import { RenderElement } from '../../../renderMethods'



const tabsize = 2;

function onKeyDown(evt) {
  if (evt.keyCode === 9) { // handle tab
    let target = evt.target;
    const start = target.selectionStart;
    const end = target.selectionEnd;
    const value = target.value;
    target.value = value.substring(0,start) + Array(tabsize).fill(' ').join('') + value.substring(end);
    target.selectionStart = start + tabsize;
    target.selectionEnd = end + tabsize;
    evt.preventDefault();
  } else if (evt.keyCode === 8) { // handle backspace
    let target = evt.target;
    const start = target.selectionStart;
    if (start === target.selectionEnd) {
      const value = target.value;
      if (value.substring(start-tabsize, start) === Array(tabsize).fill(' ').join('')) {
        target.value = value.substring(0,start-tabsize) + value.substring(start);
        target.selectionStart = start - tabsize;
        target.selectionEnd = start - tabsize;
        evt.preventDefault();
      }
    }
  }
}

class TextPreview extends React.Component {
  static propTypes = {
    defaultValue: PropTypes.string,
    renderType: PropTypes.string.isRequired
  }

  static defaultProps = {
    renderType: 'text'
  }

  constructor(props) {
    super(props)
    this.input = React.createRef()
    this.state = { text: props.defaultValue || '' }
  }

  updatePreview = (evt) => {
    this.setState({ text: evt.target.value })
  }

  renderPreview() {
    if (this.props.renderType === 'text') {
      return this.state.text.split('\n\n').map((t,i) => (
        <RenderElement key={i} content={t} />
      ))
    } else if (this.props.renderType === 'json') {
      try {
        const json = JSON.parse(this.state.text)
        return <RenderElement content={json} />
      } catch(e) {
        return "Failed to render"
      }
    }
  }

  render() {
    return (
      <>
      <textarea
        onChange={this.updatePreview}
        onKeyDown={onKeyDown}
        value={this.state.text}
        rows='3'
        style={{
          minWidth: '4in',
        }}
      />
      <div className='document preview-area' style={{
        fontSize: '1.2em',
        width: 'fit-content',
      }}>
        {this.renderPreview()}
      </div>
      </>
    )
  }
}

export default TextPreview