import React from 'react'
import DefaultEditor from './DefaultEditor'


export default class EditPageHeader extends DefaultEditor {

  headingUpdate(row, lr, text) {
    const newrow = [...this.state.props.rows[row]]
    newrow[lr] = text
    const rows = [...this.state.props.rows]
    rows[row] = newrow
    this.setState({props: {...this.state.props, rows}})
  }

  headingAddRow = () => {
    const rows = [...this.state.props.rows, ['', '']]
    this.setState({ props: {...this.state.props, rows} })
  }

  headingRemoveRow = () => {
    const rows = this.state.props.rows.slice(0,-1)
    this.setState({props: {...this.state.props, rows}})
  }

  renderEditor() {
    const rows = this.state.props.rows
    const inputStyle = {
      width: '100%',
      borderStyle: 'dashed',
      fontSize: '1.1em',
      fontFamily: 'var(--doc-font-family, monospace)',
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
          {rows.map((row, i) => {
            const [left, right] = row
            return (
              <tr key={i} >
                <td style={{border: 'none', padding: '0 1em 0 0'}}>
                  <input 
                    onChange={(evt) => this.headingUpdate(i, 0, evt.target.value)}
                    value={left || ''} 
                    style={inputStyle}
                  />
                </td>
                <td style={{border: 'none', padding: '0 1em 0 0'}}>
                  <input 
                    onChange={(evt) => this.headingUpdate(i, 1, evt.target.value)}
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