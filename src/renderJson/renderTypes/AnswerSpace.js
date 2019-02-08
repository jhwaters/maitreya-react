import React from 'react'
import { RenderJson } from '..'

export const AnswerChoices = props => {

  const classNames = ['answerchoice-list']
  if (props.listDirection && props.listDirection === 'horizontal') {
    classNames.push('answerchoice-list-horizontal')
  }
  return (
    <ol className={classNames.join(' ')} type='a'>
      {React.Children.map(props.children, (c,i) => (
        <li key={`choice-${i}`}
          className='answerchoice-item'>
          {c}
        </li>
      ))}
    </ol>
  )
}



const AnswerBlank = props => {
  const style = {margin: '0'}
  
  if (props.width !== undefined) {
    style.minWidth = props.width
  }
  if (props.height !== undefined) {
    style.minHeight = props.height
  }

  return (
    <tr>
      <td><RenderJson json={props.label === undefined ? 'answer:' : props.label} /></td>
      <td><div className='blank-underline answerblank' style={style}/></td>
    </tr>
  )
}

export const AnswerBlanks = props => {
  return (
    <table className='answerblanks'>
      <tbody>
        {props.items.map((d,i) => {
          const dat = typeof d === 'string' ? {label: d} : d
          return (
            <AnswerBlank 
              key={`answerblank=${dat.label}-${i}`} 
              {...dat}
            />
        )})}
      </tbody>
    </table>
  )
}