import React from 'react'
import DefaultEditor from './DefaultEditor'


export default class Header extends DefaultEditor {

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
    const data = this.state.data
    const inputStyle = {
      width: '100%',
      borderStyle: 'dashed',
      //fontSize: '0.8em',
      //fontFamily: 'var(--doc-font-family, monospace)',
      margin: '1mm',
      padding: '1mm',
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
                    value={left || ''} 
                    style={inputStyle}
                  />
                </td>
                <td style={{border: 'none', padding: '0 1em 0 0'}}>
                  <input 
                    onChange={(evt) => this.headingUpdate(i, 'right', evt.target.value)}
                    value={right || ''} 
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
  }

}