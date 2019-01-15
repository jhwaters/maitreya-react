import React from 'react'
import renderElement from '../../../renderMethods/renderElement'


const renderArea = ({name, content, options}) => {
  const gridArea = content.options ? content.options.gridArea || name : name

  return (
    <div key={`q-part-${name}`} style={{gridArea: gridArea}}>
      {renderElement(content, options)}
    </div>
  )
}


const QuestionWrapper = ({areas, style, options}) => {  
  return (
    <div className='QuestionWrapper' style={style}>
      {Object.keys(areas).map((k) => renderArea({name: k, content: areas[k], options: options}))}
    </div>
  )
}

export default QuestionWrapper