import React from 'react'
import { defaultsDeep } from 'lodash'
import { setGridAreas } from './setQuestionLayout'
import { RenderElement } from '../RenderElement'



const QuestionArea = ({area, content, options}) => {
  const className = `question-area question-area-${area}`
  const style = {gridArea: area}
  return (
    <div className={className} style={style}>
      <RenderElement content={content} inherited={options} />
    </div>
  )
}


export class Question extends React.Component {

  render() {
    // Determine options
    const options = defaultsDeep({}, this.props.data._options || {}, this.props.options)
    
    // Determine options to pass to areas
    let passedOptions = {}
    for (const k of ['markdown', 'math']) {
      if (options[k] !== undefined) {
        passedOptions[k] = options[k]
      }
    }

    // Determine visible areas
    const visibleAreas = Object.keys(this.props.data).filter(area => area[0] !== '_')

    // Determine layout
    const layoutStyle = {display: 'grid'}
    try {
      const layout = options.layout || setGridAreas(visibleAreas)
      if (typeof layout === 'string') {
        layoutStyle.gridTemplateAreas = layout
      } else {
        layoutStyle.gridTemplateAreas = layout.map(row => `"${row.join(' ')}"`).join(' ')
      }
    } catch(e) {
      console.error(e)
    }


    return (
      <div className="question-layout" style={layoutStyle}>
        {visibleAreas.map((area) => {
          return (
            <QuestionArea key={area} 
              area={area} 
              content={this.props.data[area]} 
              options={passedOptions} 
            />
          )
        })}
      </div>
    )
  }
}

export const NumberedQuestion = ({data, options}) => {
  return (
    <div className='question-wrapper'>
      <Question data={data} options={options} />
    </div>
  )
}

export const Answer = ({data, options}) => {
  const letters = 'abcdefg'
  if (data.answer && data.answer.type === 'answerchoices') {
    if (data._answerIndex !== undefined) {
      return letters[data._answerIndex]
    }
    if (data._answer.answerIndex !== undefined) {
      return letters[data._answer.answerIndex]
    }
  }
  if (data._answer !== undefined) {
    return <RenderElement content={data._answer} inherited={options} />
  }
  
  return <RenderElement content='' inherited={options} />
}