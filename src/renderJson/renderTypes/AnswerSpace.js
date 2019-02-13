import React from 'react'

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

export const AnswerBlanks = props => {
  const style = {margin: 0}
  if (props.width !== undefined) {
    style.minWidth = props.width
  }
  if (props.height !== undefined) {
    style.minHeight = props.height
  }
  return (
    <table className='answerblanks'>
      <tbody>
        {React.Children.map(props.children, (c,i) => (
          <tr key={i}>
            <td>{c}</td>
            <td><div className='blank-underline answerblank' style={style}/></td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}