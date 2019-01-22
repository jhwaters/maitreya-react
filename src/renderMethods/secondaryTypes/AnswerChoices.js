import React from 'react'
import { JsonML } from './JsonML'

export const AnswerChoices = ({data, options}) => {
  const tagname = 'ol'
  const props = {className: 'answerchoice-list', type: 'a'}
  const children = data.map(d => ['li', {className: 'answerchoice-item'}, d])
  return <JsonML data={[tagname, props, ...children]} options={options} />
}