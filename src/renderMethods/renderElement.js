import React from 'react'
import { defaultsDeep } from 'lodash'
import { renderTypes, detectType } from './renderTypes'


function renderAs(type, data, options) {
  const RenderType = renderTypes[type]
  if (RenderType) {
    return (
      <RenderType 
        data={data} 
        options={options} 
      />
    )
  } else {
    console.error(`No render method for type ${type}`)
    return <code className='error-failed-render'>{JSON.stringify(data)}</code>
  }
}

const isArray = Array.isArray

export const RenderElement = ({content, inherited}) => {
  try {
    if (typeof content === 'string' || typeof content === 'number') {
      return renderAs('text', content, inherited)
    }
    if (isArray(content)) {
      return renderAs('list', content, inherited)
    }
    let {type, data, options} = content
    if (!type) {
      type = detectType(data)
    }
    if (data) {
      return renderAs(type, data, inherited ? defaultsDeep({}, options, inherited) : options)
    }
    return <code className='error-failed-render'>{JSON.stringify(content)}</code>
  } catch(e) {
    console.error(e)
    return <code className='error-failed-render'>{JSON.stringify(content)}</code>
  }
}