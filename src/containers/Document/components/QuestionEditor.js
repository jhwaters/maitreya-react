import React from 'react'
import renderElement from '../../../renderMethods/renderElement'

const Props = {
  areaNames: [],
  generated: {},
  options: {},
}

class QuestionEditor extends React.Component<Props> {
  constructor(props) {
    super(props)
    this.state = {
      areaNames: this.props.areaNames,
      generated: this.props.generated,
      options: this.props.options,
      active: '__none__',
    }
  }

  changeSelection = (evt) => this.setState({active: evt.target.value})

  render() {
    return (
      <div>
        <select onChange={this.changeSelection}>
          <option value='__none__'>NO ELEMENT SELECTED</option>
          {this.state.areaNames.map(a => <option key={`select${a}`} value={a}>{a}</option>)}
        </select>
        <div style={{marginTop: '3mm'}}>
          {
            this.state.active === '__none__'
              ? null 
              : renderElement(this.state.generated[this.state.active], this.state.options)
              //: (<EditableElement element={this.state.generated[this.state.active]} options={this.state.options} />)
          }
        </div>
      </div>
    )
  }
}

export default QuestionEditor
