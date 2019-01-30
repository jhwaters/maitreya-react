import React from 'react'
import { RenderElement } from '../RenderElement'

export const AnswerChoices = ({data, options}) => {
  const classNames = ['answerchoice-list']
  if (options.answerchoices && options.answerchoices.listDirection === 'horizontal') {
    classNames.push('answerchoice-list-horizontal')
  }
  return (
    <ol className={classNames.join(' ')} type='a'>
      {data.map((d,i) => (
        <li key={`choice-${i}`}
          className='answerchoice-item'>
          <RenderElement content={d} inherited={options} />
        </li>
      ))}
    </ol>
  )
}



const AnswerBlank = ({data, options}) => {
  const style = {margin: '0'}
  
  if (data.width !== undefined) {
    style.minWidth = data.width
  }
  if (data.height !== undefined) {
    style.minHeight = data.height
  }

  return (
    <tr>
      <td><RenderElement content={data.label === undefined ? 'answer:' : data.label} /></td>
      <td><div className='blank-underline answerblank' style={style}/></td>
    </tr>
  )
}

export const AnswerBlanks = ({data, options}) => {
  return (
    <table className='answerblanks'>
      <tbody>
        {data.map((d,i) => {
          const dat = typeof d === 'string' ? {label: d} : d
          return (
            <AnswerBlank 
              key={`answerblank=${dat.label}-${i}`} 
              data={dat}
              options={options}
            />
        )})}
      </tbody>
    </table>
  )
}