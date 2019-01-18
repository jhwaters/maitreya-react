import React from 'react'
import ReactModal from 'react-modal';


const parseHeading = (text) => {
  let result = []
  let current = ''
  let isBlank = false
  let i = 0
  let blankSize = 0
  while (i < text.length) {
    const nextChar = text[i]
    if (isBlank) {
      if (nextChar === '_') {
        blankSize += 1
      } else {
        result.push({type: 'blank', size: blankSize})
        current = nextChar
        isBlank = false
        blankSize = 0
      }
    } else {
      if (nextChar === '_') {
        if (current !== '') {
          result.push({type: 'text', text: current})
          current = ''
        }
        isBlank = true
        blankSize = 1
      } else {
        current += nextChar
      }
    }
    i += 1
  }
  if (isBlank) {
    if (blankSize > 0) {
      result.push({type: 'blank', size: blankSize})
    }
  } else {
    if (current !== '') {
      result.push({type: 'text', text: current})
    }
  }
  return result
}

const HeadingBlank = ({size=3}) => {
  const w = `${1 + 3*(size - 1)}cm`
  return (
    <div className='HeadingBlank' style={{width: w}} />
  )
}

const renderHeading = (text) => {
  const parts = parseHeading(text)
  return (
    <>
      {parts.map((p, i) => {
        if (p.type === 'text') {
          return (
            <div key={`heading-${text}-${i}`} style={{display: 'inline-block'}}>{p.text}</div>
          )
        } else {
          return (
            <HeadingBlank key={`heading-${text}-${i}`} size={p.size}/>
          )
        }
      })}
    </>
  )
}


const defaultHeading = () => ([
  {left: 'Assignment', right: 'Name ___'},
  {left: '', right: 'Date __ Class _'},
])

class Heading extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      heading: defaultHeading(),
      edits: defaultHeading(),
      editorOpen: false, 
    }
    //this.clearEdits()
  }

  clearEdits = () => {
    let newEdits = []
    for (const row of this.state.heading) {
      newEdits.push({...row})
    }
    this.setState({edits: newEdits})
  }

  openEditor = () => {
    this.clearEdits()
    this.setState({editorOpen: true})
  }

  closeEditor = () => {
    this.setState({editorOpen: false})
  }

  updateElement(row, lr, content) {
    let newRow = {...this.state.edits[row]}
    newRow[lr] = content
    let edits = [...this.state.edits]
    edits[row] = newRow
    this.setState({edits: edits})
  }

  updateHeading = () => {
    let newHeading = []
    for (const row of this.state.edits) {
      newHeading.push({...row})
    }
    //if (newHeading.length === 0) {
    //  newHeading.push({left: '', right: ''})
    //}
    this.setState({heading: newHeading});
  }

  applyEdits = () => {
    this.updateHeading();
  }

  applyAndClose = () => {
    this.applyEdits();
    this.closeEditor();
  }

  resetToDefault = () => {
    this.setState({heading: defaultHeading()})
    this.closeEditor()
  }

  addRow = () => {
    this.setState({edits: [...this.state.edits, {left: '', right: ''}]})
  }

  removeRow = () => {
    this.setState({edits: this.state.edits.slice(0,-1)})
  }

  render() {

    return (
      <>
      {this.state.heading.length === 0
      ? (
        <div className='Heading' onDoubleClick={this.openEditor} title="Double-click to edit"
          style={{height: '5mm'}}
        ></div>
      ) : (
        <table className='Heading' onDoubleClick={this.openEditor} title="Double-click to edit">
          <tbody>
            {this.state.heading.map((row, i) => {
              const {left, right} = row
              return (
                <tr key={`heading-row-${i+1}`}>
                  <td>{renderHeading(left)}</td>
                  <td>{renderHeading(right)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}


      <ReactModal
        isOpen={this.state.editorOpen}
        onRequestClose={this.closeEditor}
      >
        <div>
          <h4>Edit Document Heading:</h4>
          <p>Underscores will be translated into an underlined blank space.</p>

          <table className="Heading" style={{width: '100%'}}>
            <tbody>
              {this.state.edits.map((row, i) => {
                const {left, right} = row
                return (
                  <tr key={`edit-heading-row-${i+1}`}>
                    <td style={{border: '2px dotted rgba(0,0,0,0.2)'}}>
                      <input defaultValue={left} 
                        onChange={(evt) => this.updateElement(i, 'left', evt.target.value)}
                        style={{
                          fontFamily: 'var(--doc-font-family, serif)',
                          width: '100%',
                          border: 'none',
                        }}
                        ></input>
                    </td>
                    <td style={{border: '2px dotted rgba(0,0,0,0.2)'}}>
                      <input defaultValue={right} 
                        onChange={(evt) => this.updateElement(i, 'right', evt.target.value)}
                        style={{
                          fontFamily: 'var(--doc-font-family, serif)',
                          width: '100%',
                          border: 'none',
                        }}
                        ></input>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <div style={{marginTop: '5mm'}}>
            <button onClick={this.removeRow}>-</button>
            <button onClick={this.addRow}>+</button>
          </div>

          <div style={{marginTop: '1cm', bottom: '0'}}>
            <button onClick={this.applyAndClose}>Apply</button>
            <button onClick={this.closeEditor}>Cancel</button>
            <button onClick={this.resetToDefault}>Reset</button>
          </div>
          
          
        </div>
      </ReactModal>
      </>
    )
  }
}

export default Heading