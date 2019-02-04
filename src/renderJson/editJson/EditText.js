import React from 'react'
import DefaultEditor from './DefaultEditor'
import { RenderJson, parseJson } from '..'


export default class EditText extends DefaultEditor {

  updateChild(i, val) {
    const children = [...this.state.children]
    children[i] = val
    this.setState({ children })
  }

  renderChildEditor(i) {
    return (
      <textarea key={i} value={this.state.children[i]}
        onChange={evt => this.updateChild(i, evt.target.value)}
        rows='12'
        cols='80'
        style={{width: 'fit-content'}}
      />
    )
  }

  renderEditor() {
    return (
      <>
        {this.state.children.map((el, i) => this.renderChildEditor(i))}
      </>
    )
  }
}