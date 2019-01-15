import React from 'react'
import ReactModal from 'react-modal'
import _ from 'lodash'
import { QuestionWrapper, QuestionEditor } from './components'


const defaultGridAreas = [
  'question question',
  'choices diagram'
]

const setGridAreas = (keys, options={}) => {
  if (_.includes(keys, 'instructions')) {
    if (_.includes(keys, 'question')) {
      return [
        'instructions instructions',
        'question question',
        'choices diagram',
      ]
    } else {
      return [
        'instructions instructions',
        'choices diagram',
      ]
    }
  } else {
    return defaultGridAreas
  }
}



class QuestionHandler extends React.Component {
  constructor(props) {
    super(props)
    const {params={}, generated, options={}} = props.question;
    this.state = {
      generated: generated,
      params: params,
      options: options,
      editorActive: false,
    }
  }

  openEditor = () => { 
    if (!this.state.editorActive) {
      this.setState({editorActive: true}) 
    }
  }

  closeEditor = () => { 
    this.setState({editorActive: false}) 
  }

  render() {
    const generated = this.state.generated
    const options = this.state.options
    const areaNames = _.partition(Object.keys(generated), k => k[0] !== '_')[0]
    const wrapper = options.wrapper || {}
    const gridTemplateAreas = wrapper.gridTemplateAreas || setGridAreas(areaNames)

    let toDisplay = {}
    for (const line of gridTemplateAreas) {
      for (const area of line.split(' ')) {
        toDisplay[area] = true
      }
    }

    let areas = {}
    for (const a of areaNames) {
      if (toDisplay[a]) {
        areas[a] = generated[a]
      }
    }

    let wrapperStyle = {
      display: 'grid',
      ...wrapper,
      gridTemplateAreas: gridTemplateAreas.map(line => `"${line}"`).join(' ')
    }


    return (
      <div onDoubleClick={this.openEditor}>
        <QuestionWrapper areas={areas} style={wrapperStyle} options={options} />

        <ReactModal
          isOpen={this.state.editorActive}
          onRequestClose={this.closeEditor}
        >
          <h3>Edit Question <button onClick={this.closeEditor}>Close</button></h3>
          <p>(doesn't work yet)</p>
          <QuestionEditor areaNames={areaNames} generated={generated} options={options} />
        </ReactModal>

      </div>
    )
  }
}

export default QuestionHandler