import React from 'react'
import ReactModal from 'react-modal';
import styles from './styles.module.css'
import renderElement from '../../../renderMethods/renderElement'

const defaultState = {
  left: [
    'Assignment',
    '',
  ],

  right: [
    'Name: _________________________',
    'Date: _________________________'
  ],

  editorOpen: false,

  edits: {
    left: [
      'Assignment',
      '',
    ],
  
    right: [
      'Name: _________________________',
      'Date: _________________________'
    ],
  }
}



const HeadingElement = (content, i) => {
  let toRender = content
  if (typeof toRender === 'string') {
    toRender = {type: 'text', data: content}
  }
  return (
    <div key={`heading-L${i}`}>
      {renderElement(toRender)}
    </div>
  )
}

class Heading extends React.Component {
  constructor(props) {
    super(props)
    this.state = defaultState
    //this.edits = {...defaultHeading};
  }

  clearEdits = () => {
    const edits = {
      left: [...this.state.left],
      right: [...this.state.right],
    }
    this.setState({edits: edits})
  }

  openEditor = () => {
    this.clearEdits()
    this.setState({editorOpen: true})
  }

  closeEditor = () => {
    this.setState({editorOpen: false})
  }

  updateEdits(lr, i, content) {
    if (!this.state.edits[lr]) {
      this.state.edits[lr] = {}
    }
    this.state.edits[lr][i] = content
  }

  updateHeading = () => {
    const left = [...this.state.edits.left];
    const right = [...this.state.edits.right];
    this.setState({left: left, right: right})
  }

  applyEdits = () => {
    this.updateHeading();
    this.clearEdits();
  }

  applyAndClose = () => {
    this.applyEdits()
    this.closeEditor();
  }

  reset = () => this.setState({edits: defaultState.edits})

  addRow = () => {
    const left = [...this.state.edits.left, '']
    const right = [...this.state.edits.right, '']
    this.setState({edits: {left: left, right: right}})
  }

  removeRow = () => {
    const left = this.state.edits.left.slice(0,-1)
    const right = this.state.edits.right.slice(0,-1)
    this.setState({edits: {left: left, right: right}})
  }

  render() {

    return (
      <>
      <div className={styles.Heading} onDoubleClick={this.openEditor} title="Double-click to edit">
        <div className={styles.HeadingL}>
          {this.state.left.map((elem, i) => HeadingElement(elem, i))}
        </div>
        <div className={styles.HeadingR}>
          {this.state.right.map((elem, i) => HeadingElement(elem, i))}
        </div>
      </div>
      <ReactModal
        isOpen={this.state.editorOpen}
        onRequestClose={this.closeEditor}
      >
        <div>
          <div style={{display: 'flex', flexDirection: 'row'}}>
            <div>
              {this.state.edits.left.map((elem, i) => {
                return (
                  <div key={`editing-left-${i}`}>
                    <input defaultValue={elem} 
                      onChange={(evt) => this.updateEdits('left', i, evt.target.value)}
                      style={{fontSize:'1.2rem', fontFamily: 'serif'}}
                      size='25'></input>
                  </div>
                )
              })}
            </div>
            <div>
              {this.state.edits.right.map((elem, i) => {
                return (
                  <div key={`editing-right-${i}`}>
                    <input defaultValue={elem} 
                    onChange={(evt) => this.updateEdits('right', i, evt.target.value)}
                    style={{fontSize:'1.2rem', fontFamily: 'serif', textAlign: 'right'}}
                    size='40'></input>
                  </div>
                )
              })}
            </div>
          </div>
          <div>
            <button onClick={this.removeRow}>-</button>
            <button onClick={this.addRow}>+</button>
          </div>
          <button onClick={this.applyAndClose}>Apply</button>
          <button onClick={this.closeEditor}>Cancel</button>
          <button onClick={this.reset}>Reset</button>
        </div>
      </ReactModal>
      </>
    )
  }
}

export default Heading