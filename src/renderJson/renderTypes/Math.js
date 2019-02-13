import React from 'react'
import { formulaToKatex as formulaToHtml } from './katexMath'


export const Math = props => {
  const html = formulaToHtml(props.data, props.options);
  return <span dangerouslySetInnerHTML={{__html: html}} />
}

export const DisplayMath = props => {
  const options = {displayMode: true, ...props.options}
  const html = formulaToHtml(props.data, options);
  return <span dangerouslySetInnerHTML={{__html: html}} />
}
