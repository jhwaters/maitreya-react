import React from 'react'
import renderElement from '../../../renderMethods/renderElement'
import styles from './styles.module.css'
import './katex.global.css'


const renderArea = ({name, content, options}) => {
  const gridArea = content.options ? content.options.gridArea || name : name

  return (
    <div key={`q-part-${name}`} style={{gridArea: gridArea}} title={name}>
      {renderElement(content, options)}
    </div>
  )
}


const QuestionWrapper = ({areas, style, options}) => {  
  return (
    <div className={styles.QuestionWrapper} style={style}>
      {Object.keys(areas).map((k) => renderArea({name: k, content: areas[k], options: options}))}
    </div>
  )
}

export default QuestionWrapper